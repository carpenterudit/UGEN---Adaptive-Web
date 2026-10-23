# UGEN — Adaptive Web Deployment Guide
## Production Readiness, Vercel Frontend & Backend Deployment

This guide outlines the production deployment workflow for **UGEN — Adaptive Web (Universal Personalized Generative Web)**.

---

## 1. Architecture Overview

- **Frontend**: React 18 + Vite 5 + Tailwind CSS SPA, deployed to **Vercel**.
- **Backend**: FastAPI (Python 3.14+ async ASGI), hosted on **Render**, **Railway**, **Fly.io**, or as container.
- **Database**: **Supabase PostgreSQL** for production persistence (or local SQLite for development).
- **Extension**: Companion Chrome Manifest V3 browser extension.

---

## 2. Frontend Deployment to Vercel

### Option A: Automatic Git Deployment (Recommended)

1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository: `carpenterudit/UGEN---Adaptive-Web`.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (or leave default if using the root `vercel.json`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. In **Environment Variables**, add:
   - `VITE_API_URL`: Your live production backend URL (e.g. `https://ugen-backend.onrender.com/api/v1`).
     *(Note: If omitted, the frontend automatically activates the resilient client-side demo engine!)*
6. Click **Deploy**.

### Option B: Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### SPA Routing & Clean URLs
The included `frontend/vercel.json` and root `vercel.json` route all client navigation paths to `index.html` preventing 404s on browser reloads.

---

## 3. Backend Deployment (Render / Railway / Fly.io)

### Recommended: Render Web Service

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect `carpenterudit/UGEN---Adaptive-Web`.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables (see Section 5 below).

---

## 4. Production Database Setup (Supabase PostgreSQL)

1. Create a new project on [Supabase](https://supabase.com).
2. Under **Project Settings** → **Database**, locate your connection string.
3. Use the URI connection format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
4. Configure `DATABASE_URL` in your backend environment variables.
5. On backend startup, SQLAlchemy automatically verifies and provisions all required tables synchronously.

---

## 5. Required Environment Variables

### Frontend (Vercel)
| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Optional | Live FastAPI backend URL. Defaults to local or demo engine if unset. | `https://ugen-api.onrender.com/api/v1` |

### Backend (Render / Railway / Server)
| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `APP_ENV` | Yes | Environment type | `production` |
| `DEBUG` | Yes | Disable debug docs in prod | `false` |
| `SECRET_KEY` | Yes | Minimum 32-character secure secret | `your-cryptographically-secure-key` |
| `DATABASE_URL` | Yes | Supabase PostgreSQL connection URI | `postgresql://postgres:pw@db.ref.supabase.co:5432/postgres` |
| `FRONTEND_URL` | Yes | Vercel production frontend domain for CORS | `https://ugen-adaptive-web.vercel.app` |
| `AI_PROVIDER` | Yes | Engine provider (`demo`, `openai`, `anthropic`, `google`) | `demo` |
| `AI_MODEL` | No | Target LLM model name | `gpt-4o-mini` |
| `OPENAI_API_KEY` | If using OpenAI | API key | `sk-...` |
| `ANTHROPIC_API_KEY` | If using Anthropic | API key | `sk-ant-...` |
| `GOOGLE_API_KEY` | If using Gemini | API key | `AIza...` |
| `EXTENSION_SECRET` | Yes | Shared secret for Chrome extension | `strong-secret-token` |

---

## 6. Local Testing & Verification

### Test Backend Locally
```powershell
cd backend
$env:PYTHONPATH="."
python -m pytest -v
```

### Test Frontend Build Locally
```powershell
cd frontend
npm run build
npm run preview
```

---

## 7. Production Verification & Troubleshooting

1. **Frontend Health**: Open your Vercel deployment URL (`https://your-app.vercel.app`). Verify that the 3D Hero, interactive tabs, and prompt input render crisply.
2. **Backend Health**: Send a GET request to `https://your-api.com/api/v1/health`. Expected response:
   ```json
   {
     "status": "healthy",
     "service": "UPGW Backend",
     "version": "2.0.0"
   }
   ```
3. **CORS Errors**: If browser console warns `CORS policy: No 'Access-Control-Allow-Origin' header`, ensure `FRONTEND_URL` on the backend matches the exact Vercel URL (e.g. `https://your-app.vercel.app`).
4. **Offline Demo Resilience**: If backend is temporarily offline, the frontend seamlessly engages the client-side demo engine with zero user disruption.
