"""Revision schemas."""
from datetime import datetime
from pydantic import BaseModel


class RevisionResponse(BaseModel):
    id: str
    project_id: str
    revision_number: int
    operation_type: str | None
    description: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class RevisionListResponse(BaseModel):
    items: list[RevisionResponse]
    total: int


class ActionExecuteRequest(BaseModel):
    action_id: str
    payload: dict = {}
    project_id: str | None = None
    session_id: str | None = None


class ActionExecuteResponse(BaseModel):
    success: bool
    action_id: str
    result: dict = {}
    message: str | None = None
    error: str | None = None


class ExtensionPlanRequest(BaseModel):
    prompt: str
    page_title: str | None = None
    page_url: str | None = None
    session_id: str | None = None


class ExtensionOperation(BaseModel):
    type: str
    target: str | None = None
    value: str | None = None
    description: str


class ExtensionPlanResponse(BaseModel):
    operations: list[ExtensionOperation]
    explanation: str
    is_safe: bool
    warnings: list[str] = []


class ExtensionApplyRecord(BaseModel):
    operations_applied: list[str]
    page_url: str
    session_id: str | None = None
