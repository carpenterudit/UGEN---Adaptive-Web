"""Chat and message schemas."""
from datetime import datetime
from pydantic import BaseModel, Field


class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=4000)
    session_id: str | None = None


class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    operation_type: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatResponse(BaseModel):
    message: MessageResponse
    ui_spec: dict | None = None
    operation_type: str | None = None
    explanation: str | None = None
    is_demo: bool = True


class ConversationResponse(BaseModel):
    id: str
    project_id: str
    messages: list[MessageResponse]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
