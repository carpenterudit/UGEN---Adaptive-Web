# UPGW Backend REST API Specification

**Base URL**: `http://127.0.0.1:8000/api/v1`
**Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`

---

## 1. Health
- `GET /health`
  - Returns service status, version, timestamp, and mode.

## 2. Projects
- `POST /projects`
  - Body: `{"name": string, "description"?: string}`
  - Creates a new generative project, associated conversation, and empty UI spec.
- `GET /projects`
  - Query params: `page` (default 1), `page_size` (default 20).
  - Returns paginated list of active projects.
- `GET /projects/{project_id}`
  - Returns details of a specific project.
- `PATCH /projects/{project_id}`
  - Updates project name or description.
- `DELETE /projects/{project_id}`
  - Soft-deletes the project.

## 3. Chat and Generation
- `POST /projects/{project_id}/messages`
  - Body: `{"content": string, "session_id"?: string}`
  - Processes prompt with AI / DemoGenerator, updates UI spec, records revision, and returns updated JSON specification + assistant message.
- `GET /projects/{project_id}/messages`
  - Returns chronological conversation history for the project.

## 4. UI Specifications
- `GET /projects/{project_id}/ui`
  - Returns the latest valid JSON specification for the workspace.
- `PUT /projects/{project_id}/ui`
  - Updates and validates a raw UI specification.

## 5. Revisions (Undo / History)
- `GET /projects/{project_id}/revisions`
  - Returns all previous revision records with revision numbers and descriptions.
- `POST /projects/{project_id}/revisions/{revision_id}/restore`
  - Restores the UI specification to the chosen revision state and records an audit event.

## 6. Allowlisted Actions
- `POST /actions/{action_id}/execute`
  - Body: `{"action_id": string, "payload": object, "project_id"?: string}`
  - Supported action IDs:
    - `form.validate`: Server-side form field validation.
    - `form.reset`: Form state reset confirmation.
    - `form.submit_demo`: Form submission with validation and audit log.
    - `navigation.go_to_page`: Workspace multi-page routing.
    - `preferences.update_theme`: Theme switching.
    - `project.save`: Workspace checkpoint.
    - `revision.undo`: Revert to previous revision.
    - `revision.redo`: Redo undone revision.
    - `workflow.start_demo`: Start simulated workflow.

## 7. Personalization Preferences
- `GET /preferences?session_id={id}`
  - Reads saved user theme, typography scale, information density, and animation preferences.
- `PATCH /preferences?session_id={id}`
  - Updates saved preferences.
- `DELETE /preferences?session_id={id}`
  - Clears saved preferences.

## 8. Browser Extension Endpoints
- `POST /extension/plan`
  - Body: `{"prompt": string, "page_title"?: string, "page_url"?: string}`
  - Plans safe page operations based on user request.
- `POST /extension/validate`
  - Body: `{"operations": [...]}`
  - Validates proposed operations against allowed security policies.
- `POST /extension/apply-record`
  - Records an audit log of applied page modifications.
