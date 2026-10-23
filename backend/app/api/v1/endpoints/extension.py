"""Browser extension API endpoints for safe web page customization."""
from fastapi import APIRouter, HTTPException
import re
from app.schemas.revision import (
    ExtensionPlanRequest,
    ExtensionPlanResponse,
    ExtensionOperation,
    ExtensionApplyRecord
)

router = APIRouter()

# Safe allowed operation types for the browser extension
ALLOWED_EXTENSION_OPS = {
    "adjust_font_size",
    "enhance_readability",
    "apply_color_theme",
    "highlight_content",
    "simplify_layout",
    "inject_reader_panel"
}


@router.post("/plan", response_model=ExtensionPlanResponse)
async def plan_extension_modifications(request: ExtensionPlanRequest):
    """
    Plan safe, structured page modifications based on user instruction.
    Never generates executable JS scripts or unsafe DOM manipulations.
    """
    prompt = request.prompt.lower().strip()
    url = (request.page_url or "").lower()

    # Reject unsupported or sensitive pages
    if url.startswith("chrome://") or url.startswith("edge://") or url.startswith("about:"):
        return ExtensionPlanResponse(
            operations=[],
            explanation="Browser internal pages cannot be customized for security reasons.",
            is_safe=False,
            warnings=["Internal browser pages are restricted."]
        )

    operations: list[ExtensionOperation] = []
    warnings: list[str] = []

    # Check for prompt intents
    if "font" in prompt or "text size" in prompt or "larger text" in prompt or "bigger text" in prompt:
        operations.append(ExtensionOperation(
            type="adjust_font_size",
            target="body",
            value="120%",
            description="Increase text size by 20% across readable elements"
        ))

    if "readable" in prompt or "readability" in prompt or "spacing" in prompt:
        operations.append(ExtensionOperation(
            type="enhance_readability",
            target="article, main, p",
            value="comfortable",
            description="Increase line-height to 1.7 and limit paragraph line length"
        ))

    if "dark" in prompt or "night" in prompt:
        operations.append(ExtensionOperation(
            type="apply_color_theme",
            target="root",
            value="dark",
            description="Apply comfortable high-contrast dark theme"
        ))
    elif "sepia" in prompt or "warm" in prompt or "paper" in prompt:
        operations.append(ExtensionOperation(
            type="apply_color_theme",
            target="root",
            value="sepia",
            description="Apply warm sepia background with soft dark text"
        ))
    elif "green" in prompt:
        operations.append(ExtensionOperation(
            type="apply_color_theme",
            target="root",
            value="calm-green",
            description="Apply calming green accent theme"
        ))
    elif "blue" in prompt:
        operations.append(ExtensionOperation(
            type="apply_color_theme",
            target="root",
            value="soft-blue",
            description="Apply focused blue accent theme"
        ))

    if "highlight" in prompt or "important" in prompt:
        operations.append(ExtensionOperation(
            type="highlight_content",
            target="h1, h2, strong",
            value="#fef08a",
            description="Subtly highlight primary headings and key emphasized text"
        ))

    if "simplify" in prompt or "clean" in prompt or "distraction" in prompt:
        operations.append(ExtensionOperation(
            type="simplify_layout",
            target="aside, .sidebar, .ad, .banner",
            value="dim",
            description="Dim non-essential peripheral widgets and banners"
        ))

    if "panel" in prompt or "notes" in prompt or "summary" in prompt or "assistant" in prompt:
        operations.append(ExtensionOperation(
            type="inject_reader_panel",
            target="body",
            value="right-drawer",
            description="Attach an isolated reader assistant panel on the right margin"
        ))

    # Default fallback if no specific keywords matched
    if not operations:
        operations.append(ExtensionOperation(
            type="enhance_readability",
            target="article, main, p",
            value="comfortable",
            description="Enhanced line spacing and text contrast for better readability"
        ))

    return ExtensionPlanResponse(
        operations=operations,
        explanation=f"Planned {len(operations)} safe readability & styling enhancement(s).",
        is_safe=True,
        warnings=warnings
    )


@router.post("/validate")
async def validate_operations(payload: dict):
    """Validate a set of operations before client application."""
    operations = payload.get("operations", [])
    valid_ops = []
    rejected_ops = []

    for op in operations:
        op_type = op.get("type")
        if op_type in ALLOWED_EXTENSION_OPS:
            valid_ops.append(op)
        else:
            rejected_ops.append(op)

    return {
        "valid": len(rejected_ops) == 0,
        "valid_count": len(valid_ops),
        "rejected_count": len(rejected_ops),
        "rejected_operations": rejected_ops
    }


@router.post("/apply-record")
async def record_extension_application(record: ExtensionApplyRecord):
    """Log an audit entry of applied extension operations."""
    return {
        "status": "recorded",
        "operations_count": len(record.operations_applied),
        "page_url": record.page_url,
    }
