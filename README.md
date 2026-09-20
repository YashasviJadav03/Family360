# Family360 (કુટુંબ ૩૬૦)
### Family-Centric Welfare Intelligence & Entitlement Delivery Platform for Gujarat Family ID

**Family360** unifies fragmented departmental records (Civil Supplies, Social Justice, Health, Housing) into a single 360-degree household profile. It proactively identifies unclaimed government welfare schemes using a deterministic rule engine and detects cross-registry duplicates using explainable entity resolution.

---

## ⚡ Key Features

- **360° Family Profile**: Consolidates household members, caste, income, housing, and social security footprints into a single verified view.
- **Deterministic Eligibility Engine**: Evaluates 11 statutory Gujarat welfare schemes against 40+ atomic criteria in `<5ms` with zero decision drift.
- **Proactive Benefit Gap Detection**: Instantly highlights schemes a family is eligible for but hasn't received, bridging the last-mile delivery gap.
- **1-Click Assisted Applications**: Pre-fills official welfare application forms using verified profile data, eliminating repetitive documentation.
- **Explainable Entity Resolution**: Uses phonetic, geographic, and RapidFuzz blocking to detect duplicate or fraudulent citizen records across departments.
- **District Welfare Console & Telemetry**: Macro-level dashboard displaying district coverage, data quality telemetry, and duplicate review queues.
- **AI Administrative Assistant**: Decoupled natural-language assistant that translates pre-computed rule outcomes into plain-language citizen and officer memos.

---

## 🔄 How It Works (Workflow)

```
[ Department Silos ] ──▶ [ Entity Resolution ] ──▶ [ Unified Family Profile ]
(Ration/Health/SJE)         (Deduplication)               (Family ID)
                                                                │
                                                                ▼
[ 1-Click Application ] ◀── [ Benefit Gap Matrix ] ◀── [ Deterministic Rule Engine ]
 (Instant Enrollment)        (Unclaimed Schemes)            (11 Schemes / 40+ Rules)
```

1. **Ingest & Unify**: Records across departmental databases are mapped and deduplicated into a single verified Family ID and member hierarchy.
2. **Evaluate Entitlements**: The deterministic rule engine evaluates household and individual demographics (income, age, caste, disability, land ownership) against all welfare scheme criteria.
3. **Surface Benefit Gaps**: The platform pinpoints exact schemes the household qualifies for but has not yet claimed.
4. **Action & Apply**: Citizens or kiosk operators submit pre-filled assisted applications with a single click.
5. **Monitor & Audit**: District officers track scheme saturation, resolve flagged duplicate candidates, and query welfare data via the AI assistant.

---

## 🚀 Quickstart

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- Docker & Docker Compose (for PostgreSQL)

---

### 1. Start Database
```bash
# Start PostgreSQL 15 container
docker compose up -d postgres
```
*Database runs on `localhost:5432` (`user: family360_user`, `pass: family360_pass`, `db: family360`).*

---

### 2. Start Backend (FastAPI)
```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

### 3. Start Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## 🎯 Demo Family IDs

Use these curated IDs in the Citizen Portal to test specific flows:

| Family ID | District | Category | Highlights |
| :--- | :--- | :--- | :--- |
| **`GJ-F000525`** | Anand | SC | **5 Benefit Gaps** + 1.00 score duplicate identity pair |
| **`GJ-F001954`** | Junagadh | OBC | **6 Benefit Gaps** + duplicate identity pair |
| **`GJ-F000049`** | Rajkot | SC | Dr. B.R. Ambedkar Awas Yojana (Housing) qualification |
| **`GJ-F000012`** | Ahmedabad | SC | Target profile for Officer AI Assistant queries |

---

## 🛠️ Tech Stack

| Layer | Stack |
| :--- | :--- |
| **Backend** | FastAPI, SQLAlchemy 2.0, Pydantic v2, PostgreSQL 15 |
| **Frontend** | React 18, Vite, Lucide React, Recharts |
| **Deduplication** | RapidFuzz (Token Sort, Jaro-Winkler) with Blocking Keys |
| **AI Layer** | OpenAI / Gemini API (strictly for explanation generation) |

---

## 🚀 Production Deployment

Family360 is configured for 1-click automated deployment or manual cloud hosting:

1. **Database Deployment**: PostgreSQL is **required** (Render PostgreSQL, Supabase, or Neon).
2. **Backend**: FastAPI web service with automatic database migrations and initial demo data seeding via `start.sh`.
3. **Frontend**: React + Vite single-page application connecting to the backend via `VITE_API_BASE_URL`.

👉 Read the complete step-by-step instructions in the [Production Deployment Guide](file:///d:/Family360/docs/DEPLOYMENT_GUIDE.md) or deploy using Render Blueprints via [`render.yaml`](file:///d:/Family360/render.yaml).

