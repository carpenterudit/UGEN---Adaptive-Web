# UPGW Local Development Guide

## Prerequisites
- **Node.js**: v18+ (verified on v22.19.0)
- **Python**: 3.11+ (verified on Python 3.14.2)
- **Windows PowerShell**

---

## Directory Structure
```
universal-personalized-generative-web-v2/
  frontend/          # React, Vite, Tailwind CSS
  backend/           # FastAPI, SQLAlchemy, SQLite, Pydantic
  browser-extension/ # Chrome Manifest V3 extension
  docs/              # Architectural, API, and security documentation
  scripts/           # PowerShell start/test automation scripts
```

---

## Manual Execution Steps

### 1. Backend Setup
```powershell
cd universal-personalized-generative-web-v2\backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API runs on `http://127.0.0.1:8000`
Swagger documentation is available at `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```powershell
cd universal-personalized-generative-web-v2\frontend
npm run dev
```
Web app runs on `http://127.0.0.1:5173`

### 3. Running Automated Tests
```powershell
cd universal-personalized-generative-web-v2\backend
.\venv\Scripts\python.exe -m pytest app/tests -v
```

---

## Environment Variables
Copy `.env.example` to `.env` in the backend folder or set:
- `AI_PROVIDER=demo` (Runs in deterministic demo mode with no API keys required)
- `AI_PROVIDER=openai` + `OPENAI_API_KEY=...` (Enables real LLM generation)
- `AI_PROVIDER=anthropic` + `ANTHROPIC_API_KEY=...`
- `AI_PROVIDER=google` + `GOOGLE_API_KEY=...`
