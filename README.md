# UGEN — Adaptive Web (Universal Personalized Generative Web)

> **"Your ideas. Your interface. Generated."**  
> A premium, chat-first generative UI platform that transforms natural intent into personalized, interactive web experiences that evolve with you.

![UGEN](https://img.shields.io/badge/UGEN-v2.0.0-3A0F34.svg)
![Palette](https://img.shields.io/badge/Brand-Aubergine%20%7C%20Silver%20%7C%20Marigold-EAAA00.svg)
![Python](https://img.shields.io/badge/Python-3.14-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)
![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)
![Vercel](https://img.shields.io/badge/Vercel-Deployment--Ready-black.svg)
![Netlify](https://img.shields.io/badge/Netlify-Deployment--Ready-00C7B7.svg)
![Extension](https://img.shields.io/badge/Chrome_MV3-Ready-success.svg)

---

## 🌟 Key Features

1. **Premium 3D Editorial Home Page**: Atmospheric 3D browser composition, volumetric lighting, and interactive showcase using brand colors: **Ice Silver (`#DDE3E8`)**, **Deep Aubergine (`#3A0F34`)**, and **Marigold (`#EAAA00`)**.
2. **Generative Studio Workspace**: Seamlessly transition from home page prompt bar into a live split workspace with conversational chat and real-time renderer.
3. **Deterministic UI Specification & Runtime Renderer**: Schema-validated JSON rendered into real, accessible React components.
4. **No Arbitrary Code Execution**: Zero execution of unverified JavaScript or dynamic HTML scripts. All components run through an approved, hardened `ComponentRegistry`.
5. **Deterministic Demo Mode & Offline Fallback**: Ready out-of-the-box without requiring AI provider credentials, with client-side fallback for static Vercel previews.
6. **Incremental Patches**: Follow-up natural language instructions modify specific components, add fields, or switch themes while preserving existing form state.
7. **Multi-Page Workflows**: Page transitions (e.g. Dashboard → Courses → Progress) handled with state continuity.
8. **Allowlisted Action Registry**: Forms validate on server, Reset actually clears inputs, and Submit returns authentic responses.
9. **Undo/Redo Revision History**: Full audit trail of specification revisions with one-click restore.
10. **Browser Extension MVP**: Chrome Manifest V3 companion extension for on-page personalization.
11. **Vercel & Supabase Ready**: Production deployment configurations, SPA rewrites, and PostgreSQL connection pooling guide in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

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
