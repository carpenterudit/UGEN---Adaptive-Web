# Universal Personalized Generative Web (UPGW)

> A chat-first full-stack AI platform that generates, modifies, and personalizes functional web interfaces from natural-language instructions.

![UPGW](https://img.shields.io/badge/UPGW-v2.0.0-indigo.svg)
![Python](https://img.shields.io/badge/Python-3.14-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)
![Extension](https://img.shields.io/badge/Chrome_MV3-Ready-success.svg)

---

## 🌟 Key Features

1. **Chat-First Starting Screen (Mode A)**: Clean conversational interface to start, transitioning dynamically to a live interactive split workspace upon generation.
2. **Dynamic UI Specification & Runtime Renderer**: Schema-validated JSON rendered into real, accessible React components.
3. **No Arbitrary Code Execution**: Zero execution of unverified JavaScript or dynamic HTML scripts. All components run through an approved, hardened `ComponentRegistry`.
4. **Deterministic Demo Mode**: Ready out-of-the-box without requiring AI provider credentials.
5. **Incremental Patches**: Follow-up natural language instructions modify specific components, add fields, or switch themes while preserving existing form state.
6. **Multi-Page Workflows**: Page transitions (e.g. Dashboard → Courses → Progress) handled with state continuity.
7. **Allowlisted Action Registry**: Forms validate on server, Reset actually clears inputs, and Submit returns authentic backend responses.
8. **Undo/Redo Revision History**: Full audit trail of specification revisions with one-click restore.
9. **Personalization Engine**: Persistent preferences for theme, typography scale, density, and accessibility.
10. **Browser Extension MVP (Mode B)**: Chrome Manifest V3 extension for safe on-page readability adjustments, theme overrides, and supplemental reader panels.

---

## 🚀 Quick Start (Windows PowerShell)

### Automated Setup
From the project root:
```powershell
.\scripts\setup.ps1
```

### Starting the Application

1. **Start Backend (FastAPI)**:
   ```powershell
   .\scripts\run-backend.ps1
   ```
   - **Backend API**: `http://127.0.0.1:8000`
   - **Interactive API Documentation**: `http://127.0.0.1:8000/docs`

2. **Start Frontend (React + Vite)**:
   ```powershell
   .\scripts\run-frontend.ps1
   ```
   - **Frontend Web Application**: `http://127.0.0.1:5173`

3. **Run Automated Tests**:
   ```powershell
   .\scripts\run-tests.ps1
   ```

---

## 🧩 Supported Prompt Examples

Try submitting these prompts in the chat:
- `"Create a login page with email, password, and sign in button."`
- `"Build a registration form with name, email, phone number, and password."`
- `"Create a student dashboard with course stats, charts, and progress tracker."`
- `"Create a task manager with filters and a task creation form."`
- `"Build an e-commerce shopping workflow with products and cart."`
- `"Add a phone number field without changing anything else."`
- `"Change the entire theme to green."`
- `"Switch to dark mode."`
- `"Add a reset button to the form."`
- `"Make this interface responsive."`

---

## 📁 Project Structure

```
universal-personalized-generative-web-v2/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/ # Health, Projects, Chat, UI, Revisions, Actions, Preferences, Extension
│   │   ├── core/             # Configuration & Logging
│   │   ├── db/               # SQLAlchemy engine & session factory
│   │   ├── models/           # Project, Conversation, UISpec, Revision, UserPreferences
│   │   ├── schemas/          # Pydantic schemas (UISpecification, ComponentSpec, ThemeSpec)
│   │   ├── services/         # AIService, DemoGenerator, ActionRegistry, ProviderClient
│   │   └── tests/            # Pytest test suite (7 comprehensive test cases)
│   ├── alembic/              # Database migration environment
│   ├── requirements.txt      # Stable dependency versions
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── chat/         # ChatPanel, ChatInput, ChatMessage, QuickPrompts
│   │   │   ├── workspace/    # Workspace, Device mockups (Desktop, Tablet, Mobile)
│   │   │   ├── ui-renderer/  # UIRenderer, ComponentRegistry
│   │   │   ├── revisions/    # RevisionHistoryModal
│   │   │   ├── preferences/  # PreferencesModal
│   │   │   └── projects/     # ProjectListModal
│   │   ├── services/         # API Client
│   │   └── styles/           # Tailwind CSS & Glassmorphism styles
│   ├── package.json
│   └── vite.config.js
├── browser-extension/        # Chrome Manifest V3 extension
│   ├── manifest.json
│   ├── src/
│   │   ├── popup/            # Extension popup UI
│   │   ├── content/          # Safe DOM modifier & reader panel
│   │   └── background/       # Service worker
│   └── README.md
├── docs/                     # ARCHITECTURE.md, API.md, SECURITY.md, EXTENSION.md, DEVELOPMENT.md
└── scripts/                  # setup.ps1, run-backend.ps1, run-frontend.ps1, run-tests.ps1
```

---

## 🧪 Browser Extension Installation (Mode B)

1. Open Chrome or Edge and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the directory:
   `universal-personalized-generative-web-v2/browser-extension`
5. Click the extension icon on any webpage to adjust readability, font scale, or dark theme!
