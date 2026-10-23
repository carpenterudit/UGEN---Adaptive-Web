"""User preferences model."""
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Text, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    # Using session_id for MVP (no auth)
    session_id: Mapped[str] = mapped_column(String(36), nullable=False, unique=True)
    theme: Mapped[str] = mapped_column(String(20), default="dark")
    font_size: Mapped[str] = mapped_column(String(20), default="medium")
    density: Mapped[str] = mapped_column(String(20), default="comfortable")
    animations: Mapped[bool] = mapped_column(default=True)
    reduced_motion: Mapped[bool] = mapped_column(default=False)
    preferred_layout: Mapped[str] = mapped_column(String(20), default="split")
    extra_prefs_json: Mapped[str] = mapped_column(Text, default="{}")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
