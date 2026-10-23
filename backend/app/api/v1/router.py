"""API v1 router."""
from fastapi import APIRouter
from app.api.v1.endpoints import health, projects, chat, ui, revisions, actions, preferences, extension

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(chat.router, prefix="/projects", tags=["Chat"])
api_router.include_router(ui.router, prefix="/projects", tags=["UI Specs"])
api_router.include_router(revisions.router, prefix="/projects", tags=["Revisions"])
api_router.include_router(actions.router, prefix="/actions", tags=["Actions"])
api_router.include_router(preferences.router, prefix="/preferences", tags=["Preferences"])
api_router.include_router(extension.router, prefix="/extension", tags=["Extension"])
