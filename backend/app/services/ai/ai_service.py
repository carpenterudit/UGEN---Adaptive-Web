"""
AI Service - Provider abstraction layer.
Supports: demo (built-in), openai, anthropic, google.
API keys are read only from environment variables.
"""
from __future__ import annotations
import logging
from app.core.config import settings
from app.schemas.ui_spec import UISpecification

logger = logging.getLogger(__name__)


class AIService:
    """Provider-agnostic AI service for UI generation."""

    def __init__(self):
        self.provider = settings.AI_PROVIDER
        self.is_demo = self.provider == "demo" or not self._has_credentials()

    def _has_credentials(self) -> bool:
        if self.provider == "openai":
            return bool(settings.OPENAI_API_KEY)
        elif self.provider == "anthropic":
            return bool(settings.ANTHROPIC_API_KEY)
        elif self.provider == "google":
            return bool(settings.GOOGLE_API_KEY)
        return False

    async def generate_ui(
        self,
        prompt: str,
        current_spec: UISpecification | None,
        project_id: str,
        conversation_history: list[dict] | None = None,
    ) -> dict:
        """Generate or modify a UI specification from a natural language prompt."""
        if self.is_demo:
            from app.services.generation.demo_generator import DemoGenerator
            return await DemoGenerator().generate(prompt, current_spec, project_id)

        # Real AI provider path
        try:
            from app.services.ai.provider_client import ProviderClient
            client = ProviderClient(self.provider)
            return await client.generate(prompt, current_spec, project_id, conversation_history)
        except Exception as e:
            logger.error(f"AI generation failed, falling back to demo: {e}")
            from app.services.generation.demo_generator import DemoGenerator
            result = await DemoGenerator().generate(prompt, current_spec, project_id)
            result["fallback_reason"] = str(e)
            return result


_ai_service: AIService | None = None


def get_ai_service() -> AIService:
    global _ai_service
    if _ai_service is None:
        _ai_service = AIService()
    return _ai_service
