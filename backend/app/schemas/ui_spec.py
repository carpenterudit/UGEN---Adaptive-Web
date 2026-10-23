"""UI Specification Pydantic schemas - versioned JSON format."""
from __future__ import annotations
from typing import Any, Literal
# pyrefly: ignore[missing-import]
from pydantic import BaseModel, Field, field_validator
import re

SCHEMA_VERSION = "1.0"

ALLOWED_COMPONENT_TYPES = {
    "container", "section", "heading", "text", "button",
    "text-input", "email-input", "password-input", "number-input",
    "select", "checkbox", "radio-group", "textarea", "form",
    "card", "badge", "table", "tabs", "dialog", "drawer",
    "navigation", "alert", "divider", "progress", "chart", "image",
    "spacer", "grid", "flex-row", "flex-col",
}

ALLOWED_ACTION_IDS = {
    "form.validate",
    "form.reset",
    "form.submit_demo",
    "navigation.go_to_page",
    "preferences.update_theme",
    "project.create",
    "project.save",
    "revision.undo",
    "revision.redo",
    "workflow.start_demo",
}

ID_PATTERN = re.compile(r"^[a-z0-9][a-z0-9\-_]{0,63}$")


class ThemeSpec(BaseModel):
    mode: Literal["light", "dark"] = "dark"
    primary: str = "#FF2D95"
    secondary: str = "#007BA7"
    accent: str = "#007BA7"
    background: str | None = "#0A0A0A"
    surface: str | None = "#181818"
    font_family: str = "Inter"
    font_size: Literal["sm", "md", "lg"] = "md"
    border_radius: Literal["none", "sm", "md", "lg", "full"] = "md"


class ValidationRule(BaseModel):
    required: bool = False
    min_length: int | None = None
    max_length: int | None = None
    min_value: float | None = None
    max_value: float | None = None
    pattern: str | None = None
    pattern_message: str | None = None
    email: bool = False


class ComponentSpec(BaseModel):
    id: str = Field(..., description="Stable unique component ID")
    type: str = Field(..., description="Component type from allowed registry")
    props: dict[str, Any] = Field(default_factory=dict)
    children: list["ComponentSpec"] | None = None
    action_id: str | None = None
    validation: ValidationRule | None = None
    responsive: dict[str, Any] | None = None
    hidden: bool = False

    @field_validator("id")
    @classmethod
    def validate_id(cls, v: str) -> str:
        if not ID_PATTERN.match(v):
            raise ValueError(
                f"Component ID '{v}' must be lowercase alphanumeric with hyphens/underscores"
            )
        return v

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in ALLOWED_COMPONENT_TYPES:
            raise ValueError(
                f"Component type '{v}' is not in the allowed registry. "
                f"Allowed types: {sorted(ALLOWED_COMPONENT_TYPES)}"
            )
        return v

    @field_validator("action_id")
    @classmethod
    def validate_action_id(cls, v: str | None) -> str | None:
        if v is not None and v not in ALLOWED_ACTION_IDS:
            raise ValueError(
                f"Action ID '{v}' is not in the allowed action registry. "
                f"Never execute arbitrary generated code."
            )
        return v


ComponentSpec.model_rebuild()


class NavigationItem(BaseModel):
    label: str
    page_id: str
    icon: str | None = None


class PageSpec(BaseModel):
    id: str
    title: str
    components: list[ComponentSpec] = Field(default_factory=list)
    layout: Literal["single-column", "two-column", "dashboard", "auth"] = "single-column"
    meta: dict[str, Any] | None = None

    @field_validator("id")
    @classmethod
    def validate_id(cls, v: str) -> str:
        if not ID_PATTERN.match(v):
            raise ValueError(f"Page ID '{v}' must be lowercase alphanumeric with hyphens/underscores")
        return v


class UISpecification(BaseModel):
    schema_version: str = SCHEMA_VERSION
    project_id: str
    revision_id: str | None = None
    title: str = "Untitled"
    description: str | None = None
    theme: ThemeSpec = Field(default_factory=ThemeSpec)
    pages: list[PageSpec] = Field(default_factory=list)
    navigation: list[NavigationItem] = Field(default_factory=list)
    current_page_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("schema_version")
    @classmethod
    def validate_schema_version(cls, v: str) -> str:
        if v != SCHEMA_VERSION:
            raise ValueError(f"Schema version '{v}' is not supported. Expected '{SCHEMA_VERSION}'")
        return v

    def get_page(self, page_id: str) -> PageSpec | None:
        return next((p for p in self.pages if p.id == page_id), None)

    def get_component_by_id(self, component_id: str) -> ComponentSpec | None:
        for page in self.pages:
            for comp in page.components:
                if comp.id == component_id:
                    return comp
                if comp.children:
                    for child in comp.children:
                        if child.id == component_id:
                            return child
        return None


class UISpecCreate(BaseModel):
    title: str = "Untitled"
    theme: ThemeSpec | None = None


class UISpecResponse(UISpecification):
    pass
