"""UI Specification endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
import json
import uuid

from app.db.database import get_db
from app.models.project import Project
from app.models.ui_spec import UISpec
from app.schemas.ui_spec import UISpecification

router = APIRouter()


@router.get("/{project_id}/ui")
def get_ui_spec(project_id: str, db: Session = Depends(get_db)):
    proj_result = db.execute(select(Project).where(Project.id == project_id))
    if not proj_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Project not found")

    result = db.execute(select(UISpec).where(UISpec.project_id == project_id))
    ui_spec = result.scalar_one_or_none()

    if not ui_spec or ui_spec.spec_json == "{}":
        return {"spec": None, "message": "No UI spec yet. Send a chat message to generate one."}

    try:
        return {"spec": json.loads(ui_spec.spec_json)}
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to parse UI spec")


@router.put("/{project_id}/ui")
def update_ui_spec(project_id: str, spec_data: dict, db: Session = Depends(get_db)):
    proj_result = db.execute(select(Project).where(Project.id == project_id))
    if not proj_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        spec = UISpecification(**spec_data)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Invalid UI specification: {str(e)}")

    result = db.execute(select(UISpec).where(UISpec.project_id == project_id))
    ui_spec = result.scalar_one_or_none()
    if ui_spec:
        ui_spec.spec_json = json.dumps(spec.model_dump())
    else:
        ui_spec = UISpec(id=str(uuid.uuid4()), project_id=project_id, spec_json=json.dumps(spec.model_dump()))
        db.add(ui_spec)

    db.flush()
    return {"spec": spec.model_dump(), "message": "UI spec updated"}
