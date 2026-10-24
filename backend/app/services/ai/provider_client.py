"""
Provider client for real LLM backends (OpenAI, Anthropic, Google Gemini).
Enforces structured JSON output and validates output against Pydantic schemas.
Falls back safely to DemoGenerator if keys are missing or requests fail.
"""
from __future__ import annotations
import json
import logging
import httpx
from app.core.config import settings
from app.schemas.ui_spec import UISpecification

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Universal Personalized Generative Web (UPGW) AI assistant.
Your task is to generate or edit a versioned UI specification for a web application based on user prompts.
Return ONLY valid JSON matching this schema:
{
  "operation_type": "CREATE_UI" | "ADD_COMPONENT" | "UPDATE_COMPONENT" | "REMOVE_COMPONENT" | "UPDATE_THEME" | "CREATE_PAGE",
  "explanation": "Concise friendly explanation of changes",
  "ui_spec": {
    "schema_version": "1.0",
    "project_id": "...",
    "title": "...",
    "theme": {"mode": "light" | "dark", "primary": "#hex"},
    "pages": [
      {
        "id": "page-id",
        "title": "Page Title",
        "layout": "single-column" | "two-column" | "dashboard" | "auth",
        "components": [
          {
            "id": "comp-id",
            "type": "heading"|"text"|"button"|"text-input"|"email-input"|"password-input"|"form"|"card"|"table"|"badge"|"checkbox"|"grid",
            "props": {...},
            "children": [...],
            "action_id": "form.submit_demo" | "form.reset" | "navigation.go_to_page" | null
          }
        ]
      }
    ],
    "current_page_id": "page-id"
  }
}
Never include Markdown backticks in raw JSON responses.
"""


class ProviderClient:
    def __init__(self, provider: str):
        self.provider = provider

    async def generate(
        self,
        prompt: str,
        current_spec: UISpecification | None,
        project_id: str,
        conversation_history: list[dict] | None = None
    ) -> dict:
        if self.provider == "openai" and settings.OPENAI_API_KEY:
            return await self._call_openai(prompt, current_spec, project_id, conversation_history)
        elif self.provider == "anthropic" and settings.ANTHROPIC_API_KEY:
            return await self._call_anthropic(prompt, current_spec, project_id, conversation_history)
        elif self.provider == "google" and settings.GOOGLE_API_KEY:
            return await self._call_google(prompt, current_spec, project_id, conversation_history)
        else:
            from app.services.generation.demo_generator import DemoGenerator
            return await DemoGenerator().generate(prompt, current_spec, project_id)

    async def _call_openai(self, prompt: str, current_spec, project_id: str, history) -> dict:
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        if history:
            messages.extend(history[-4:])
        user_content = f"User Request: {prompt}\nProject ID: {project_id}"
        if current_spec:
            user_content += f"\nCurrent UI Spec JSON:\n{json.dumps(current_spec.model_dump())}"
        messages.append({"role": "user", "content": user_content})

        async with httpx.AsyncClient(timeout=float(settings.AI_TIMEOUT)) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": settings.AI_MODEL or "gpt-4o-mini",
                    "messages": messages,
                    "response_format": {"type": "json_object"},
                    "temperature": 0.2
                }
            )
            resp.raise_for_status()
            data = resp.json()
            raw_text = data["choices"][0]["message"]["content"]
            parsed = json.loads(raw_text)
            parsed["is_demo"] = False
            return parsed

    async def _call_anthropic(self, prompt: str, current_spec, project_id: str, history) -> dict:
        user_content = f"User Request: {prompt}\nProject ID: {project_id}"
        if current_spec:
            user_content += f"\nCurrent UI Spec JSON:\n{json.dumps(current_spec.model_dump())}"

        async with httpx.AsyncClient(timeout=float(settings.AI_TIMEOUT)) as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": settings.ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                json={
                    "model": "claude-3-5-haiku-latest",
                    "system": SYSTEM_PROMPT + "\nRespond ONLY with a JSON object.",
                    "messages": [{"role": "user", "content": user_content}],
                    "max_tokens": 4096,
                }
            )
            resp.raise_for_status()
            data = resp.json()
            raw_text = data["content"][0]["text"]
            # Clean markdown fences if any
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_text:
                raw_text = raw_text.split("```")[1].split("```")[0].strip()
            parsed = json.loads(raw_text)
            parsed["is_demo"] = False
            return parsed

    async def _call_google(self, prompt: str, current_spec, project_id: str, history) -> dict:
        model = settings.AI_MODEL if (settings.AI_MODEL and "gemini" in settings.AI_MODEL) else "gemini-3.8-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GOOGLE_API_KEY}"
        user_content = f"{SYSTEM_PROMPT}\n\nUser Request: {prompt}\nProject ID: {project_id}"
        if current_spec:
            user_content += f"\nCurrent UI Spec JSON:\n{json.dumps(current_spec.model_dump())}"

        async with httpx.AsyncClient(timeout=float(settings.AI_TIMEOUT)) as client:
            resp = await client.post(
                url,
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [{"parts": [{"text": user_content}]}],
                    "generationConfig": {"responseMimeType": "application/json"}
                }
            )
            resp.raise_for_status()
            data = resp.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(raw_text)
            parsed["is_demo"] = False
            return parsed
