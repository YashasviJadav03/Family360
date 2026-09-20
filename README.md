# Family360

> **Family360 transforms Family ID from a static identifier into an intelligent welfare-delivery layer.**

Family360 is a proactive welfare intelligence and beneficiary management platform built for the Gujarat Family ID ecosystem. It solves the critical welfare delivery problem: linking fragmented citizen records across departments, identifying unclaimed welfare benefits through a deterministic eligibility engine, surfacing explainable duplicate clusters, and providing natural-language assistance for government officers.

---

## Architecture Overview

- **Backend**: Python 3.10+, FastAPI, SQLAlchemy 2.0, PostgreSQL, Pydantic v2, Alembic
- **ML / Matching**: RapidFuzz explainable weighted scoring for Entity Resolution
- **AI Layer**: LLM client for plain-language eligibility grounding and officer query assistance
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide React (Scaffolded in Phase 5)

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- Docker & Docker Compose (or local PostgreSQL 15)

### 1. Database Setup
Start PostgreSQL using Docker Compose:
```bash
docker compose up -d postgres
```
Database credentials:
- **Host**: `localhost:5432`
- **User**: `family360_user`
- **Password**: `family360_pass`
- **Database**: `family360`

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Run the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)
Health check: [http://localhost:8000/health](http://localhost:8000/health)

### 3. Frontend Setup
*(Detailed setup instructions will be added during Phase 5)*

---

## Project Structure
```
family360/
├── backend/
│   ├── app/
│   │   ├── api/        # REST endpoints
│   │   ├── core/       # Configurations & security
│   │   ├── db/         # SQLAlchemy session & base
│   │   ├── models/     # Database models
│   │   ├── schemas/    # Pydantic schemas
│   │   ├── services/   # Business logic & engines
│   │   └── ml/         # Entity resolution & matching
│   ├── data/
│   │   ├── raw/        # Source schemes & rules
│   │   └── generated/  # Ground truth & validation data
│   ├── scripts/        # Data generators & evaluation
│   ├── tests/          # Pytest suite
│   ├── alembic/        # DB migrations
│   ├── requirements.txt
│   └── .env.example
├── frontend/           # React + Vite application
├── docs/
│   ├── schemes/        # Scheme specifications
│   └── demo_script.md  # 8-scene demo script
├── docker-compose.yml
└── README.md
```
