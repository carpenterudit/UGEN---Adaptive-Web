"""Projects CRUD endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.db.database import get_db
from app.models.project import Project
from app.models.conversation import Conversation
from app.models.ui_spec import UISpec
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
import uuid

router = APIRouter()


@router.post("", response_model=ProjectResponse, status_code=201)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(
        id=str(uuid.uuid4()),
        name=data.name,
        description=data.description,
    )
    db.add(project)

    conversation = Conversation(id=str(uuid.uuid4()), project_id=project.id)
    ui_spec = UISpec(id=str(uuid.uuid4()), project_id=project.id, spec_json="{}")
    db.add(conversation)
    db.add(ui_spec)

    db.flush()
    db.refresh(project)
    return project


@router.get("", response_model=ProjectListResponse)
def list_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * page_size
    total_result = db.execute(select(func.count()).select_from(Project).where(Project.is_active == True))
    total = total_result.scalar() or 0

    result = db.execute(
        select(Project)
        .where(Project.is_active == True)
        .order_by(Project.updated_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    projects = result.scalars().all()
    return ProjectListResponse(items=list(projects), total=total, page=page, page_size=page_size)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    result = db.execute(select(Project).where(Project.id == project_id, Project.is_active == True))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: str, data: ProjectUpdate, db: Session = Depends(get_db)):
    result = db.execute(select(Project).where(Project.id == project_id, Project.is_active == True))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if data.name is not None:
        project.name = data.name
    if data.description is not None:
        project.description = data.description
    db.flush()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: str, db: Session = Depends(get_db)):
    result = db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.is_active = False
    db.flush()
