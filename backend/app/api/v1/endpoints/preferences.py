"""User preferences endpoints for theme, font size, density, animations, etc."""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
import json
import uuid

from app.db.database import get_db
from app.models.preferences import UserPreferences
from app.schemas.preferences import PreferencesUpdate, PreferencesResponse

router = APIRouter()


def _get_or_create_prefs(session_id: str, db: Session) -> UserPreferences:
    result = db.execute(
        select(UserPreferences).where(UserPreferences.session_id == session_id)
    )
    prefs = result.scalar_one_or_none()
    if not prefs:
        prefs = UserPreferences(
            id=str(uuid.uuid4()),
            session_id=session_id,
            theme="dark",
            font_size="medium",
            density="comfortable",
            animations=True,
            reduced_motion=False,
            preferred_layout="split",
            extra_prefs_json="{}"
        )
        db.add(prefs)
        db.flush()
    return prefs


@router.get("", response_model=PreferencesResponse)
def get_preferences(
    session_id: str = Query("default_session"),
    db: Session = Depends(get_db)
):
    prefs = _get_or_create_prefs(session_id, db)
    return PreferencesResponse(
        session_id=prefs.session_id,
        theme=prefs.theme,
        font_size=prefs.font_size,
        density=prefs.density,
        animations=prefs.animations,
        reduced_motion=prefs.reduced_motion,
        preferred_layout=prefs.preferred_layout,
    )


@router.patch("", response_model=PreferencesResponse)
def update_preferences(
    data: PreferencesUpdate,
    session_id: str = Query("default_session"),
    db: Session = Depends(get_db)
):
    prefs = _get_or_create_prefs(session_id, db)
    if data.theme is not None:
        prefs.theme = data.theme
    if data.font_size is not None:
        prefs.font_size = data.font_size
    if data.density is not None:
        prefs.density = data.density
    if data.animations is not None:
        prefs.animations = data.animations
    if data.reduced_motion is not None:
        prefs.reduced_motion = data.reduced_motion
    if data.preferred_layout is not None:
        prefs.preferred_layout = data.preferred_layout
    if data.extra_prefs is not None:
        try:
            current = json.loads(prefs.extra_prefs_json or "{}")
            current.update(data.extra_prefs)
            prefs.extra_prefs_json = json.dumps(current)
        except Exception:
            prefs.extra_prefs_json = json.dumps(data.extra_prefs)

    db.flush()
    db.refresh(prefs)
    return PreferencesResponse(
        session_id=prefs.session_id,
        theme=prefs.theme,
        font_size=prefs.font_size,
        density=prefs.density,
        animations=prefs.animations,
        reduced_motion=prefs.reduced_motion,
        preferred_layout=prefs.preferred_layout,
    )


@router.delete("", status_code=204)
def delete_preferences(
    session_id: str = Query("default_session"),
    db: Session = Depends(get_db)
):
    result = db.execute(
        select(UserPreferences).where(UserPreferences.session_id == session_id)
    )
    prefs = result.scalar_one_or_none()
    if prefs:
        db.delete(prefs)
        db.flush()
    return None
