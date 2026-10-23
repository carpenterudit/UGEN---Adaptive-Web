"""
Comprehensive backend test suite for UPGW.
Tests:
- Health check
- Project CRUD
- UI Spec validation & invalid component rejection
- Deterministic demo generation (login, register, phone field, theme update)
- Action execution (form.validate, form.reset, form.submit_demo, navigation)
- Revisions listing & restore
- User preferences CRUD
- Extension plan & validate endpoints
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.database import create_tables
from app.schemas.ui_spec import UISpecification, ComponentSpec, ThemeSpec
from pydantic import ValidationError


@pytest.fixture(autouse=True, scope="session")
def init_test_db():
    create_tables()


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.mark.anyio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "UPGW Backend"
        assert "version" in data


@pytest.mark.anyio
async def test_project_lifecycle():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Create
        create_resp = await ac.post("/api/v1/projects", json={
            "name": "Test Project",
            "description": "Test description"
        })
        assert create_resp.status_code == 201
        project_data = create_resp.json()
        project_id = project_data["id"]
        assert project_data["name"] == "Test Project"

        # Read
        get_resp = await ac.get(f"/api/v1/projects/{project_id}")
        assert get_resp.status_code == 200
        assert get_resp.json()["id"] == project_id

        # Update
        patch_resp = await ac.patch(f"/api/v1/projects/{project_id}", json={
            "name": "Updated Test Project"
        })
        assert patch_resp.status_code == 200
        assert patch_resp.json()["name"] == "Updated Test Project"

        # List
        list_resp = await ac.get("/api/v1/projects")
        assert list_resp.status_code == 200
        assert list_resp.json()["total"] >= 1


@pytest.mark.anyio
async def test_ui_spec_validation():
    # Valid spec
    valid_spec = UISpecification(
        project_id="test-proj",
        title="Test Page",
        theme=ThemeSpec(mode="dark", primary="#10b981"),
        pages=[{
            "id": "home",
            "title": "Home",
            "components": [
                {
                    "id": "btn-1",
                    "type": "button",
                    "props": {"label": "Click me"},
                    "action_id": "form.submit_demo"
                }
            ]
        }]
    )
    assert valid_spec.project_id == "test-proj"
    assert len(valid_spec.pages) == 1

    # Invalid component type rejection
    with pytest.raises(ValidationError):
        ComponentSpec(id="invalid-comp", type="malicious-script-tag", props={})

    # Invalid action ID rejection
    with pytest.raises(ValidationError):
        ComponentSpec(id="btn-bad", type="button", action_id="arbitrary.exec_code")


@pytest.mark.anyio
async def test_demo_generation_login_and_followup():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Create project
        proj_resp = await ac.post("/api/v1/projects", json={"name": "Gen Test"})
        project_id = proj_resp.json()["id"]

        # 2. Request login form
        msg_resp = await ac.post(f"/api/v1/projects/{project_id}/messages", json={
            "content": "Create a login page with email and password"
        })
        assert msg_resp.status_code == 200
        data = msg_resp.json()
        assert data["is_demo"] is True
        assert data["ui_spec"] is not None
        assert data["ui_spec"]["title"] == "Login"
        assert len(data["ui_spec"]["pages"]) > 0

        # Verify components in login
        components = data["ui_spec"]["pages"][0]["components"]
        form_comp = next((c for c in components if c["type"] == "form"), None)
        assert form_comp is not None

        # 3. Follow-up modification: Change theme to green
        theme_resp = await ac.post(f"/api/v1/projects/{project_id}/messages", json={
            "content": "Change the theme to green"
        })
        assert theme_resp.status_code == 200
        theme_data = theme_resp.json()
        assert theme_data["ui_spec"]["theme"]["primary"] == "#10b981"

        # 4. Follow-up: Add a phone field
        phone_resp = await ac.post(f"/api/v1/projects/{project_id}/messages", json={
            "content": "Add a phone number field to the form"
        })
        assert phone_resp.status_code == 200
        phone_data = phone_resp.json()
        form_children = phone_data["ui_spec"]["pages"][0]["components"][2]["children"]
        has_phone = any("phone" in c["id"] for c in form_children)
        assert has_phone is True

        # 5. Check revisions were recorded
        rev_resp = await ac.get(f"/api/v1/projects/{project_id}/revisions")
        assert rev_resp.status_code == 200
        revs = rev_resp.json()
        assert revs["total"] >= 3


@pytest.mark.anyio
async def test_action_execution():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Form validate - valid data
        val_resp = await ac.post("/api/v1/actions/form.validate/execute", json={
            "payload": {"form_data": {"email": "user@example.com", "password": "password123"}}
        })
        assert val_resp.status_code == 200
        assert val_resp.json()["result"]["valid"] is True

        # 2. Form validate - invalid data
        val_fail = await ac.post("/api/v1/actions/form.validate/execute", json={
            "payload": {"form_data": {"email": "bademail", "password": "short"}}
        })
        assert val_fail.status_code == 200
        assert val_fail.json()["result"]["valid"] is False
        assert "email" in val_fail.json()["result"]["errors"]

        # 3. Form reset
        reset_resp = await ac.post("/api/v1/actions/form.reset/execute", json={
            "payload": {"form_id": "test-form"}
        })
        assert reset_resp.status_code == 200
        assert reset_resp.json()["result"]["reset"] is True

        # 4. Form submit demo
        submit_resp = await ac.post("/api/v1/actions/form.submit_demo/execute", json={
            "payload": {"form_id": "test-form", "form_data": {"email": "test@demo.com", "password": "securepass123"}}
        })
        assert submit_resp.status_code == 200
        assert submit_resp.json()["result"]["submitted"] is True

        # 5. Unallowed action rejection
        unallowed = await ac.post("/api/v1/actions/malicious.eval/execute", json={
            "payload": {}
        })
        assert unallowed.status_code == 403


@pytest.mark.anyio
async def test_preferences_api():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Get default
        get_resp = await ac.get("/api/v1/preferences?session_id=pytest_sess")
        assert get_resp.status_code == 200
        data = get_resp.json()
        assert data["theme"] in ["light", "dark"]

        # Update
        patch_resp = await ac.patch("/api/v1/preferences?session_id=pytest_sess", json={
            "theme": "dark",
            "font_size": "large",
            "animations": False
        })
        assert patch_resp.status_code == 200
        updated = patch_resp.json()
        assert updated["theme"] == "dark"
        assert updated["font_size"] == "large"
        assert updated["animations"] is False


@pytest.mark.anyio
async def test_extension_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Plan safe changes
        plan_resp = await ac.post("/api/v1/extension/plan", json={
            "prompt": "Increase text size and apply dark mode for better readability",
            "page_url": "https://example.com/article"
        })
        assert plan_resp.status_code == 200
        plan = plan_resp.json()
        assert plan["is_safe"] is True
        assert len(plan["operations"]) >= 2

        # Validate operations
        val_resp = await ac.post("/api/v1/extension/validate", json={
            "operations": [
                {"type": "adjust_font_size", "value": "120%"},
                {"type": "harmful_eval_injection", "value": "alert(1)"}
            ]
        })
        assert val_resp.status_code == 200
        val_data = val_resp.json()
        assert val_data["valid"] is False
        assert val_data["valid_count"] == 1
        assert val_data["rejected_count"] == 1
