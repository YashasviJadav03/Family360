# Family360 — Production Deployment Guide

This guide covers everything you need to deploy **Family360** (Gujarat Family ID Welfare Intelligence Platform) to production, including the **Database**, **Backend API**, and **Frontend Single-Page Application (SPA)**.

---

## 1. Do You Need to Deploy the Database Also?

### **YES, absolutely.**
Family360 relies on a relational **PostgreSQL** database. The backend cannot operate without it because:
1. **Core Data Models**: It queries families, demographic members, social categories, income, identity records, and officers.
2. **Deterministic Rules & Benefits**: Scheme eligibility rules, existing benefits, and scheme applications are stored in database tables.
3. **Analytics & Deduplication**: Real-time cross-database matching, district analytics, and data quality metrics all execute SQL aggregations.

> [!IMPORTANT]
> If you deploy only the backend without a database, the FastAPI service will fail health checks and raise database connection errors (`ConnectionRefused` / `OperationalError`).
>
> You can host your PostgreSQL database for free using:
> - **Render PostgreSQL** (included in `render.yaml`)
> - **Supabase** (Free tier: 500MB PostgreSQL, perpetual free tier)
> - **Neon Serverless Postgres** (Free tier: 0.5GB compute & storage)

---

## 2. Deployment Architecture Overview

```
                      +-----------------------------+
                      |       Citizen / Officer     |
                      |            Browser          |
                      +--------------+--------------+
                                     |
                                     | HTTPS
                                     v
                      +-----------------------------+
                      |   Frontend (React + Vite)   |
                      |  Render / Vercel / Netlify  |
                      +--------------+--------------+
                                     |
                                     | REST API calls (/api)
                                     v
                      +-----------------------------+
                      |     Backend (FastAPI)       |
                      |        Render Web           |
                      +--------------+--------------+
                                     |
                                     | SQLAlchemy / Psycopg2
                                     v
                      +-----------------------------+
                      |    Database (PostgreSQL)    |
                      |   Render / Supabase / Neon  |
                      +-----------------------------+
```

---

## 3. Method 1: Automated 1-Click Deployment with Render Blueprints (Recommended)

The repository includes a ready-to-use [`render.yaml`](../render.yaml) blueprint that automatically sets up:
- 1 Managed PostgreSQL Database (`family360-db`)
- 1 FastAPI Python Web Service (`family360-backend`) with automatic database migrations and seeding
- 1 React Vite Static Site (`family360-frontend`) with SPA routing and API connection

### Steps:
1. Push your code to your GitHub / GitLab repository.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **"New +"** in the top right and select **"Blueprint"**.
4. Connect your GitHub repository.
5. Render will detect `render.yaml` and display the 3 resources:
   - `family360-db` (PostgreSQL)
   - `family360-backend` (Web Service)
   - `family360-frontend` (Static Site)
6. Click **"Apply"**.
7. Render will automatically:
   - Provision the PostgreSQL database.
   - Install backend requirements and run `bash start.sh` (which executes `alembic upgrade head` and seeds 300 demo families).
   - Build the frontend static site with `npm run build` and route API calls to the backend.

---

## 4. Method 2: Manual Step-by-Step Deployment

If you prefer to configure each service manually or host them across different providers (e.g., Database on Supabase, Backend on Render, Frontend on Vercel):

### Step 1: Deploy the PostgreSQL Database

#### Option A: On Render
1. Go to **Render Dashboard** -> **New +** -> **PostgreSQL**.
2. Set Name: `family360-db`.
3. Database: `family360`.
4. User: `family360_user`.
5. Region: Singapore (or your nearest region).
6. Plan: **Free**.
7. Click **Create Database**.
8. Once provisioned, copy the **Internal Database URL** (if backend is on Render) or **External Database URL** (if backend is elsewhere).

#### Option B: On Supabase (Free Perpetual PostgreSQL)
1. Sign up at [Supabase.com](https://supabase.com) and create a new project.
2. Go to **Project Settings** -> **Database** -> **Connection string** (URI).
3. Copy the connection string (format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`).

---

### Step 2: Deploy the Backend API (FastAPI)

1. Go to **Render Dashboard** -> **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name**: `family360-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command**: `bash start.sh`
     *(Alternatively: `python -m alembic upgrade head && python scripts/seed_if_empty.py && uvicorn app.main:app --host 0.0.0.0 --port $PORT`)*
4. Under **Environment Variables**, add:
   | Key | Value | Notes |
   |---|---|---|
   | `DATABASE_URL` | `postgresql://...` | Connection string from Step 1 |
   | `ENVIRONMENT` | `production` | Production mode |
   | `SEED_FAMILIES_COUNT` | `300` | Number of demo families to seed |
   | `LLM_PROVIDER` | `openai` | (Optional: `openai` or `gemini`) |
   | `LLM_API_KEY` | *(your api key)* | (Optional: for AI Assistant / Explanations) |
5. Click **Create Web Service**.
6. Wait for the build to complete. The logs will show:
   ```
   [Family360] Applying database migrations...
   [Family360] Checking and seeding database if empty...
   [Seed] Initial dataset generation completed successfully.
   [Family360] Starting Uvicorn API server...
   Application startup complete.
   ```
7. Note down your backend URL (e.g., `https://family360-backend.onrender.com`).
8. Test the health endpoint: `https://family360-backend.onrender.com/health` -> `{"status": "ok"}`.

---

### Step 3: Deploy the Frontend (React + Vite)

#### Option A: On Render (Static Site)
1. Go to **Render Dashboard** -> **New +** -> **Static Site**.
2. Connect your repository.
3. Configure:
   - **Name**: `family360-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://family360-backend.onrender.com/api` |
5. Under **Redirects/Rewrites**:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
6. Click **Create Static Site**.

#### Option B: On Vercel
1. Go to [Vercel.com](https://vercel.com) -> **Add New Project**.
2. Select your repository.
3. Set **Root Directory** to `frontend`.
4. Framework Preset: **Vite**.
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://family360-backend.onrender.com/api`
6. Click **Deploy**.

---

## 5. Verification Checklist

After deployment is complete, verify the application:

1. **Backend Health Check**:
   Visit `https://<YOUR-BACKEND-DOMAIN>/health`. Expected: `{"status": "ok"}`.
2. **Interactive Swagger Docs**:
   Visit `https://<YOUR-BACKEND-DOMAIN>/docs`. Verify all routes are loaded.
3. **Frontend Landing Page**:
   Visit `https://<YOUR-FRONTEND-DOMAIN>`. You should see the Gujarat Family ID Welfare Intelligence portal.
4. **Citizen Portal Verification**:
   Click **Citizen Login** or navigate to `/citizen/family/GJ-F000001`. You should see family demographic details, active entitlements, and benefit gap analysis.
5. **Officer Console Verification**:
   Click **Officer Login** or navigate to `/officer/dashboard`. You should see district coverage statistics, deduplication queues, and welfare charts.
