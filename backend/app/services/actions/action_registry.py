"""
Action Registry - Allowlisted actions that generated components can trigger.
NEVER permits arbitrary code execution, generated function names, or external URLs.
"""
from __future__ import annotations
import logging
from pydantic import BaseModel
from app.schemas.revision import ActionExecuteRequest, ActionExecuteResponse

logger = logging.getLogger(__name__)

ALLOWED_ACTIONS = {
    "form.validate",
    "form.reset",
    "form.submit_demo",
    "navigation.go_to_page",
    "preferences.update_theme",
    "project.create",
    "project.save",
    "revision.undo",
    "revision.redo",
    "workflow.start_demo",
}


class ActionHandler:
    """Executes allowlisted actions with validation."""

    async def execute(self, request: ActionExecuteRequest) -> ActionExecuteResponse:
        action_id = request.action_id

        if action_id not in ALLOWED_ACTIONS:
            logger.warning(f"Rejected unknown action: {action_id}")
            return ActionExecuteResponse(
                success=False,
                action_id=action_id,
                error=f"Action '{action_id}' is not in the allowed action registry.",
            )

        handler_map = {
            "form.validate": self._form_validate,
            "form.reset": self._form_reset,
            "form.submit_demo": self._form_submit_demo,
            "navigation.go_to_page": self._nav_go_to_page,
            "preferences.update_theme": self._prefs_update_theme,
            "project.create": self._project_create,
            "project.save": self._project_save,
            "revision.undo": self._revision_undo,
            "revision.redo": self._revision_redo,
            "workflow.start_demo": self._workflow_start_demo,
        }

        try:
            handler = handler_map[action_id]
            return await handler(request)
        except Exception as e:
            logger.error(f"Action {action_id} failed: {e}", exc_info=True)
            return ActionExecuteResponse(
                success=False,
                action_id=action_id,
                error=f"Action execution failed: {str(e)}",
            )

    async def _form_validate(self, req: ActionExecuteRequest) -> ActionExecuteResponse:
        form_data = req.payload.get("form_data", {})
        errors = {}
        # Basic server-side validation
        for field, value in form_data.items():
            if isinstance(value, str) and len(value.strip()) == 0:
                errors[field] = "This field is required"
            if "email" in field.lower() and value and "@" not in str(value):
                errors[field] = "Invalid email address"
            if "password" in field.lower() and value and len(str(value)) < 8:
                errors[field] = "Password must be at least 8 characters"
        is_valid = len(errors) == 0
        return ActionExecuteResponse(
            success=True,
            action_id="form.validate",
            result={"valid": is_valid, "errors": errors},
            message="Validation complete" if is_valid else f"Found {len(errors)} validation error(s)",
        )

    async def _form_reset(self, req: ActionExecuteRequest) -> ActionExecuteResponse:
        form_id = req.payload.get("form_id")
        return ActionExecuteResponse(
            success=True,
            action_id="form.reset",
            result={"form_id": form_id, "reset": True},
            message=f"Form '{form_id or 'default'}' has been reset.",
        )

    async def _form_submit_demo(self, req: ActionExecuteRequest) -> ActionExecuteResponse:
        form_data = req.payload.get("form_data", {})
        form_id = req.payload.get("form_id", "form")
        
        # Validate first
        validate_req = ActionExecuteRequest(
            action_id="form.validate",
            payload={"form_data": form_data},
        )
        validation = await self._form_validate(validate_req)
        if not validation.result.get("valid", True):
            return ActionExecuteResponse(
                success=False,
                action_id="form.submit_demo",
                result={"errors": validation.result.get("errors", {})},
                message="Validation failed. Please correct the errors and try again.",
            )
        
        # Simulate successful submission
        return ActionExecuteResponse(
            success=True,
            action_id="form.submit_demo",
            result={
                "submitted": True,
                "form_id": form_id,
                "timestamp": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
                "demo_note": "This is a demo submission. No real data was stored.",
            },
            message="✅ Form submitted successfully! (Demo mode - no real data stored)",
        )

    async def _nav_go_to_page(self, req: ActionExecuteRequest) -> ActionExecuteResponse:
        page_id = req.payload.get("page_id")
        if not page_id:
            return ActionExecuteResponse(success=False, action_id="navigation.go_to_page", error="page_id is required")
        return ActionExecuteResponse(
            success=True,
            action_id="navigation.go_to_page",
            result={"page_id": page_id},
            message=f"Navigating to page '{page_id}'",
        )

    async def _prefs_update_theme(self, req: ActionExecuteRequest) -> ActionExecuteResponse:
        theme = req.payload.get("theme", "dark")
        return ActionExecuteResponse(
            success=True,
            action_id="preferences.update_theme",
            result={"theme": theme},
            message=f"Theme updated to '{theme}'",
        )

    async def _project_create(self, req: ActionExecuteRequest) -> ActionExecuteResponse:
        return ActionExecuteResponse(
            success=True,
            action_id="project.create",
            result={"action": "create_project"},
            message="Creating new project...",
        )

    async def _project_save(self, req: ActionExecuteRequest) -> ActionExecuteResponse:
        return ActionExecuteResponse(
            success=True,
            action_id="project.save",
            result={"saved": True},
            message="Project saved successfully",
        )

    async def _revision_undo(self, req: ActionExecuteRequest) -> ActionExecuteResponse:
        return ActionExecuteResponse(
            success=True,
            action_id="revision.undo",
            result={"action": "undo"},
            message="Undid last change",
        )

    async def _revision_redo(self, req: ActionExecuteRequest) -> ActionExecuteResponse:
        return ActionExecuteResponse(
            success=True,
            action_id="revision.redo",
            result={"action": "redo"},
            message="Redid last change",
        )

    async def _workflow_start_demo(self, req: ActionExecuteRequest) -> ActionExecuteResponse:
        workflow = req.payload.get("workflow", "demo")
        return ActionExecuteResponse(
            success=True,
            action_id="workflow.start_demo",
            result={"workflow": workflow, "started": True, "demo_note": "Demo workflow - no real transactions"},
            message=f"Demo workflow '{workflow}' started. (This is a demo - no real action taken)",
        )


_handler: ActionHandler | None = None


def get_action_handler() -> ActionHandler:
    global _handler
    if _handler is None:
        _handler = ActionHandler()
    return _handler
