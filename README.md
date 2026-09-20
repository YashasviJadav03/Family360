# Family360 (કુટુંબ ૩૬૦)

> **Family-Centric Welfare Intelligence & Entitlement Delivery Platform for Gujarat Family ID**  
> *Unifying fragmented civil registries to proactively identify unclaimed welfare benefits and eliminate duplicate citizen records.*

[![Live Demo](https://img.shields.io/badge/Live_Demo-family360--1.onrender.com-success?style=for-the-badge&logo=render)](https://family360-1.onrender.com)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://family360-backend.onrender.com/docs)
[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://family360-1.onrender.com)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)

🌐 **Live Application**: [https://family360-1.onrender.com](https://family360-1.onrender.com)  
📖 **Interactive Swagger API**: [https://family360-backend.onrender.com/docs](https://family360-backend.onrender.com/docs)

---

## 📌 Problem & Solution

* **The Problem**: Welfare data in India is trapped in departmental silos (Civil Supplies, Health, Social Justice, Housing). Families miss out on statutory schemes they legally qualify for, while duplicate and ghost records cause leakage in public delivery.
* **The Solution**: **Family360** consolidates multi-department records into an actionable 360-degree household profile. It runs a sub-5ms deterministic rule engine to proactively flag unclaimed entitlements (benefit gaps) and employs fuzzy entity resolution with blocking keys to detect duplicate beneficiary records.

---

## ⚡ Core Capabilities

* **360° Household Dossier**: Consolidated view of family members, income bracket, social category, land holding, and active welfare receipts.
* **Deterministic Eligibility Engine**: Evaluates 11 statutory Gujarat schemes (Education, Pensions, Housing, Health) against 40+ rules in `<5ms` with zero decision drift.
* **Proactive Benefit Gap Analysis**: Instantly flags eligible but unclaimed schemes per household with 1-click assisted enrollment.
* **Explainable Entity Resolution**: Multi-pass blocking (district + birth year) with Jaro-Winkler and Token Sort fuzzy scoring to identify cross-department duplicate identities.
* **District Intelligence Console**: Live macro analytics on scheme saturation, poverty coverage, and data quality telemetry across all 33 Gujarat districts.
* **Decoupled AI Assistant**: Natural language assistant using OpenAI/Gemini strictly for generating citizen-friendly Gujarati and English explanations without hallucinating rules.

---

## 🔄 Architecture Workflow

```
┌─────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│ Department Data Silos   │ ──▶ │ Entity Resolution      │ ──▶ │ Unified Gujarat        │
│ (Ration, Health, SJE)   │     │ (Phonetic + Fuzzy Match│     │ Family 360 Profile     │
└─────────────────────────┘     └────────────────────────┘     └───────────┬────────────┘
                                                                           │
                                                                           ▼
┌─────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│ 1-Click Assisted Apply  │ ◀── │ Benefit Gap Matrix     │ ◀── │ Deterministic Rule     │
│ (Pre-filled Enrollment) │     │ (Unclaimed Benefits)   │     │ Engine (11 Schemes)    │
└─────────────────────────┘     └────────────────────────┘     └────────────────────────┘
```

---

## 🎯 Curated Demo Profiles

Test the live application at [family360-1.onrender.com](https://family360-1.onrender.com) using these verified IDs:

| Family ID | District | Social Category | Key Verification Scenario |
| :--- | :--- | :--- | :--- |
| **`GJ-F000525`** | Anand | SC | **5 Benefit Gaps** + 1.00 score duplicate identity pair |
| **`GJ-F001954`** | Junagadh | OBC | **6 Benefit Gaps** + cross-system duplicate record |
| **`GJ-F000049`** | Rajkot | SC | Housing assistance (Ambedkar Awas Yojana) qualification |
| **`GJ-F000012`** | Ahmedabad | SC | AI Officer Assistant queries & natural language explanations |

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite, TailwindCSS, Lucide Icons, Recharts, React Router v7
* **Backend**: FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic, Uvicorn
* **Database**: PostgreSQL 15 (with SQLite cloud resilience fallback)
* **Matching & ML**: RapidFuzz (Jaro-Winkler, Token Sort), Scikit-learn
* **Deployment**: Render (Web Services + Static Sites), Docker Compose

---

## 💻 Local Setup in 3 Steps

### 1. Clone & Database
```bash
git clone https://github.com/YashasviJadav03/Family360.git
cd Family360
docker compose up -d postgres
```

### 2. Backend API
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python -m alembic upgrade head
python scripts/seed_if_empty.py
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Visit **http://localhost:5173** to view the app.

---

## 📄 License & Attribution
Developed for Gujarat Digital Public Infrastructure (DPI) & Welfare Intelligence. Distributed under the MIT License.
