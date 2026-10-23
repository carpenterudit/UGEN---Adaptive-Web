"""Revisions API endpoints for undo, redo, and history restore."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
import json
import uuid

from app.db.database import get_db
from app.models.project import Project
from app.models.revision import Revision
from app.models.ui_spec import UISpec
from app.schemas.revision import RevisionResponse, RevisionListResponse

router = APIRouter()


@router.get("/{project_id}/revisions", response_model=RevisionListResponse)
def list_revisions(project_id: str, db: Session = Depends(get_db)):
    proj_result = db.execute(select(Project).where(Project.id == project_id))
    if not proj_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Project not found")

    result = db.execute(
        select(Revision)
        .where(Revision.project_id == project_id)
        .order_by(desc(Revision.revision_number))
    )
    revisions = result.scalars().all()
    return RevisionListResponse(
        items=[RevisionResponse.model_validate(r) for r in revisions],
        total=len(revisions)
    )


@router.post("/{project_id}/revisions/{revision_id}/restore")
def restore_revision(
    project_id: str,
    revision_id: str,
    db: Session = Depends(get_db)
):
    proj_result = db.execute(select(Project).where(Project.id == project_id))
    if not proj_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Project not found")

    rev_result = db.execute(
        select(Revision).where(
            Revision.id == revision_id,
            Revision.project_id == project_id
        )
    )
    rev = rev_result.scalar_one_or_none()
    if not rev:
        raise HTTPException(status_code=404, detail="Revision not found")

    # Update the UI spec with the revision's spec_json
    ui_result = db.execute(select(UISpec).where(UISpec.project_id == project_id))
    ui_spec_row = ui_result.scalar_one_or_none()
    if ui_spec_row:
        ui_spec_row.spec_json = rev.spec_json
    else:
        ui_spec_row = UISpec(
            id=str(uuid.uuid4()),
            project_id=project_id,
            spec_json=rev.spec_json
        )
        db.add(ui_spec_row)

    # Record a new revision for this restore action
    revs_count_result = db.execute(
        select(Revision).where(Revision.project_id == project_id)
    )
    new_rev_number = len(revs_count_result.scalars().all()) + 1

    new_revision = Revision(
        id=str(uuid.uuid4()),
        project_id=project_id,
        revision_number=new_rev_number,
        spec_json=rev.spec_json,
        operation_type="RESTORE_REVISION",
        description=f"Restored revision #{rev.revision_number}",
    )
    db.add(new_revision)
    db.flush()

    parsed_spec = json.loads(rev.spec_json)
    return {
        "success": True,
        "message": f"Successfully restored revision #{rev.revision_number}",
        "revision_number": rev.revision_number,
        "ui_spec": parsed_spec
    }
