"""Preferences schemas."""
from pydantic import BaseModel, Field
from typing import Literal, Any


class PreferencesUpdate(BaseModel):
    theme: Literal["light", "dark", "system"] | None = None
    font_size: Literal["small", "medium", "large"] | None = None
    density: Literal["compact", "comfortable", "spacious"] | None = None
    animations: bool | None = None
    reduced_motion: bool | None = None
    preferred_layout: Literal["split", "overlay", "fullscreen"] | None = None
    extra_prefs: dict[str, Any] | None = None


class PreferencesResponse(BaseModel):
    session_id: str
    theme: str
    font_size: str
    density: str
    animations: bool
    reduced_motion: bool
    preferred_layout: str

    model_config = {"from_attributes": True}
