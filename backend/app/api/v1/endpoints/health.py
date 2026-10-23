"""Health endpoint."""
from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()


@router.get("")
def health_check():
    return {
        "status": "healthy",
        "service": "UPGW Backend",
        "version": "2.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "mode": "demo",
    }
