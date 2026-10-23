"""Actions endpoint for executing approved frontend actions."""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.revision import ActionExecuteRequest, ActionExecuteResponse
from app.services.actions.action_registry import get_action_handler

router = APIRouter()


@router.post("/{action_id}/execute", response_model=ActionExecuteResponse)
async def execute_action(
    action_id: str,
    payload: dict,
    db: Session = Depends(get_db)
):
    request = ActionExecuteRequest(
        action_id=action_id,
        payload=payload.get("payload", payload),
        project_id=payload.get("project_id"),
        session_id=payload.get("session_id")
    )
    handler = get_action_handler()
    response = await handler.execute(request)
    if not response.success and response.error and "not in the allowed" in response.error:
        raise HTTPException(status_code=403, detail=response.error)
    return response
