"""Chat and message endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from slowapi import Limiter
from slowapi.util import get_remote_address
import uuid
import json
import logging

from app.db.database import get_db
from app.models.project import Project
from app.models.conversation import Conversation, Message
from app.models.ui_spec import UISpec
from app.models.revision import Revision
from app.schemas.chat import MessageCreate, MessageResponse, ChatResponse, ConversationResponse
from app.schemas.ui_spec import UISpecification
from app.services.ai.ai_service import get_ai_service

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)
logger = logging.getLogger(__name__)


def _get_or_create_conversation(project_id: str, db: Session) -> Conversation:
    result = db.execute(
        select(Conversation).where(Conversation.project_id == project_id).limit(1)
    )
    conv = result.scalar_one_or_none()
    if not conv:
        conv = Conversation(id=str(uuid.uuid4()), project_id=project_id)
        db.add(conv)
        db.flush()
    return conv


def _get_current_spec(project_id: str, db: Session) -> UISpecification | None:
    result = db.execute(select(UISpec).where(UISpec.project_id == project_id))
    ui_spec_row = result.scalar_one_or_none()
    if not ui_spec_row or not ui_spec_row.spec_json or ui_spec_row.spec_json == "{}":
        return None
    try:
        data = json.loads(ui_spec_row.spec_json)
        if not data or not data.get("project_id"):
            return None
        return UISpecification(**data)
    except Exception as e:
        logger.warning(f"Could not parse UI spec for project {project_id}: {e}")
        return None


def _save_spec(project_id: str, spec_dict: dict, db: Session):
    result = db.execute(select(UISpec).where(UISpec.project_id == project_id))
    ui_spec_row = result.scalar_one_or_none()
    spec_json = json.dumps(spec_dict)
    if ui_spec_row:
        ui_spec_row.spec_json = spec_json
    else:
        ui_spec_row = UISpec(id=str(uuid.uuid4()), project_id=project_id, spec_json=spec_json)
        db.add(ui_spec_row)
    db.flush()


def _save_revision(project_id: str, spec_dict: dict, operation_type: str, description: str, db: Session):
    count_result = db.execute(
        select(func.count()).select_from(Revision).where(Revision.project_id == project_id)
    )
    revision_number = (count_result.scalar() or 0) + 1

    revision = Revision(
        id=str(uuid.uuid4()),
        project_id=project_id,
        revision_number=revision_number,
        spec_json=json.dumps(spec_dict),
        operation_type=operation_type,
        description=description[:500] if description else None,
    )
    db.add(revision)
    db.flush()
    return revision


@router.post("/{project_id}/messages", response_model=ChatResponse)
async def send_message(
    project_id: str,
    data: MessageCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    proj_result = db.execute(select(Project).where(Project.id == project_id, Project.is_active == True))
    if not proj_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Project not found")

    conv = _get_or_create_conversation(project_id, db)
    current_spec = _get_current_spec(project_id, db)

    # Save user message
    user_msg = Message(
        id=str(uuid.uuid4()),
        conversation_id=conv.id,
        role="user",
        content=data.content,
    )
    db.add(user_msg)

    # Get conversation history
    history_result = db.execute(
        select(Message)
        .where(Message.conversation_id == conv.id)
        .order_by(Message.created_at.desc())
        .limit(10)
    )
    history = [{"role": m.role, "content": m.content} for m in reversed(history_result.scalars().all())]

    # Generate UI
    ai_service = get_ai_service()
    try:
        result = await ai_service.generate_ui(
            prompt=data.content,
            current_spec=current_spec,
            project_id=project_id,
            conversation_history=history,
        )
    except Exception as e:
        logger.error(f"Generation failed: {e}", exc_info=True)
        result = {
            "operation_type": "ERROR",
            "explanation": f"Generation failed: {str(e)}",
            "ui_spec": current_spec.model_dump() if current_spec else None,
            "is_demo": True,
        }

    # Save UI spec if we got one
    ui_spec_dict = result.get("ui_spec")
    if ui_spec_dict and isinstance(ui_spec_dict, dict) and ui_spec_dict.get("project_id"):
        _save_spec(project_id, ui_spec_dict, db)
        _save_revision(
            project_id=project_id,
            spec_dict=ui_spec_dict,
            operation_type=result.get("operation_type", "UNKNOWN"),
            description=result.get("explanation", "")[:500],
            db=db,
        )

    # Save assistant message
    assistant_msg = Message(
        id=str(uuid.uuid4()),
        conversation_id=conv.id,
        role="assistant",
        content=result.get("explanation", "I've processed your request."),
        operation_type=result.get("operation_type"),
    )
    db.add(assistant_msg)
    db.flush()
    db.refresh(assistant_msg)

    return ChatResponse(
        message=MessageResponse(
            id=assistant_msg.id,
            role=assistant_msg.role,
            content=assistant_msg.content,
            operation_type=assistant_msg.operation_type,
            created_at=assistant_msg.created_at,
        ),
        ui_spec=ui_spec_dict,
        operation_type=result.get("operation_type"),
        explanation=result.get("explanation"),
        is_demo=result.get("is_demo", True),
    )


@router.get("/{project_id}/messages", response_model=ConversationResponse)
def get_messages(project_id: str, db: Session = Depends(get_db)):
    proj_result = db.execute(select(Project).where(Project.id == project_id))
    if not proj_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Project not found")

    conv = _get_or_create_conversation(project_id, db)

    msg_result = db.execute(
        select(Message)
        .where(Message.conversation_id == conv.id)
        .order_by(Message.created_at)
    )
    messages = msg_result.scalars().all()

    return ConversationResponse(
        id=conv.id,
        project_id=project_id,
        messages=[MessageResponse(
            id=m.id, role=m.role, content=m.content,
            operation_type=m.operation_type, created_at=m.created_at,
        ) for m in messages],
        created_at=conv.created_at,
        updated_at=conv.updated_at,
    )
