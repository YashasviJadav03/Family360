# Family360 (કુટુંબ ૩૬૦)
### Family-Centric Welfare Intelligence & Entitlement Delivery Platform for Gujarat Family ID

> **Family360 transforms Family ID from a static identifier into an active, intelligent welfare-delivery infrastructure.**

Built for the **Government of Gujarat Social Justice and Empowerment ecosystem**, Family360 solves India's chronic welfare delivery paradox: millions of eligible households miss out on vital social security schemes simply because benefits are fragmented across departmental silos and require citizens to discover and apply for them individually.

Family360 unifies Civil Supplies (Ration), Social Justice (Scholarships & Pensions), Health, and Housing footprints into an explainable 360-degree household profile, proactively evaluates statutory entitlements using a high-performance **deterministic rule engine**, reconciles cross-registry duplicate identities using **explainable entity resolution**, and provides a **natural-language AI assistant** for district welfare officers.

---

## 🏛️ System Architecture

```
                                  =======================================
                                          CLIENT APPLICATIONS (UX4G)
                                  =======================================
                                     │                               │
                                     ▼                               ▼
                          [Citizen Portal (Bilingual)]     [District Officer Console]
                          • Family 360 Profile              • State Macro Welfare Dashboard
                          • Proactive Benefit Gap Matrix    • Data Quality Telemetry (72.6%)
                          • 1-Click Assisted Applications   • Explainable Duplicate Queue
                          • Civil Identity Graph            • Natural-Language AI Assistant
                                     │                               │
                                     └───────────────┬───────────────┘
                                                     │ HTTP / REST (Axios)
                                                     ▼
                                  =======================================
                                        FASTAPI APPLICATION GATEWAY
                                  =======================================
                                     │               │               │
                     ┌───────────────┘               │               └───────────────┐
                     ▼                               ▼                               ▼
        ┌─────────────────────────┐    ┌───────────────────────────┐    ┌─────────────────────────┐
        │  Deterministic Engine   │    │     Entity Resolution     │    │  AI Explanation Layer   │
        │ • 11 Gujarat Schemes    │    │ • RapidFuzz Weighted Sim  │    │ • LLM Client (OpenAI/   │
        │ • 40+ Atomic Rules      │    │ • Phonetic & Geo Blocking │    │   Gemini / Fallback)    │
        │ • Matched vs. Failed    │    │ • >96% Comparisons Pruned │    │ • Token Cap: 300 tokens │
        │ • Zero Decision Drift   │    │ • Field-by-Field Signals  │    │ • Fixed Template Intent │
        └────────────┬────────────┘    └─────────────┬─────────────┘    └────────────┬────────────┘
                     │                               │                               │
                     └───────────────────────┬───────┴───────────────────────────────┘
                                             ▼
                                  =======================================
                                       POSTGRESQL 15 RELATIONAL DB
                                  =======================================
                                  • families (3,000 unified households)
                                  • family_members (12,141 residents)
                                  • benefits (7,922 entitlement records)
                                  • identity_records (15,023 source footprints)
                                  • schemes & eligibility_rules (11 schemes)
                                  • duplicate_reviews (Audit decisions)
```

---

## ⚡ Core Innovations & Features

1. **Rule Engine Decides, LLM Explains (Zero Autonomous Decision Risk)**:
   - Evaluates boolean eligibility deterministically in `<5ms`.
   - The LLM layer is strictly decoupled from decision-making; it only synthesizes plain-language administrative memos explaining *pre-computed* rule evaluations for field officers.
2. **Explainable Entity Resolution with Blocking**:
   - Compares multi-source records across name, DOB, gender, and village.
   - Standard $(N^2)$ brute-force comparison on 15,000 records requires ~113 million operations. Our `(district, initial)` blocking key prunes >96% of unviable comparisons, ensuring sub-second response times.
3. **Cross-Registry Data Quality & Anomaly Telemetry**:
   - Surfaces real-world departmental data flaws: inter-departmental address discrepancies (609 families), unresolved duplicates (500 candidate pairs), and unlinked ration records.
4. **Natural-Language Administrative Query Assistant**:
   - Safe, predictable intent-matching over a fixed template set (no open-ended text-to-SQL risks).
   - Allows officers to query benefit gap concentrations, housing assistance criteria, or deduplication statistics.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Libraries / Frameworks |
| :--- | :--- | :--- |
| **Backend** | Python 3.10+ | FastAPI, SQLAlchemy 2.0, Pydantic v2, Uvicorn, Alembic |
| **Database** | PostgreSQL 15 | Docker Compose, Psycopg2, Indexed Foreign Keys |
| **Entity Resolution** | Python / RapidFuzz | Token Sort Ratio, Jaro-Winkler, Levenshtein, Soundex |
| **AI Phrasing Layer** | LLM Client | OpenAI / Gemini API Wrapper (max_tokens=300 cap + TTL Cache) |
| **Frontend** | React 18, Vite | Vanilla CSS / Tailwind CSS, Lucide React, Recharts, Axios |
| **Design Standard** | UX4G | UX4G (Unified Experience for Gov), India.gov.in aesthetic |

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- Docker & Docker Compose (for PostgreSQL)

---

### Step 1: Start PostgreSQL Database
```bash
# Clone the repository
git clone https://github.com/YashasviJadav03/Family360.git
cd Family360

# Start PostgreSQL 15 container in background
docker compose up -d postgres
```
*Database runs on `localhost:5432` (User: `family360_user`, Pass: `family360_pass`, DB: `family360`).*

---

### Step 2: Backend Setup & Launch
```bash
cd backend

# Create and activate Python virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (defaults work out-of-the-box)
cp .env.example .env

# Run FastAPI development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- Interactive Swagger API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

### Step 3: Frontend Setup & Launch
```bash
# Open a new terminal tab
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
- Citizen & Officer Portal: [http://localhost:5173](http://localhost:5173)

---

## 🎯 Curated "Hero" Families for Live Demo

To ensure a seamless live walkthrough without relying on random data, test with these verified records:
- **`GJ-F000525`** *(Primary Hero, Anand)*: 5 members, SC, income ₹1,24,173. Has **5 unclaimed benefit gaps** (Ambedkar Awas, Vrudh Pension, etc.) and a **1.00 match score duplicate pair** (`REC0002647` ⟷ `REC0002648`).
- **`GJ-F001954`** *(Junagadh Hero)*: 5 members, OBC, income ₹1,30,016. Has **6 benefit gaps** and duplicate pair `REC0009798` ⟷ `REC0009799`.
- **`GJ-F000049`** *(Housing Hero, Rajkot)*: 4 members, SC, Housing: None. Demonstrates Dr. B.R. Ambedkar Awas Yojana eligibility.
- **`GJ-F000012`** *(Ahmedabad Hero)*: 5 members, SC, income ₹1,40,701. Directly corresponds to the officer assistant demo queries.

*Full walkthrough script is available in [docs/demo_script.md](file:///d:/Family360/docs/demo_script.md).*

---

## 🔒 Data & Privacy Notice

1. **100% Synthetic Data**: All 3,000 families, 12,141 family members, 15,023 identity records, and citizen identifiers in this repository are **strictly synthetic**, generated via procedural generation scripts adhering to real Gujarat demographic distributions (Census 2011, SECC ratios). No real personal citizen data is stored or processed.
2. **Official Government Scheme Sources**: The 11 welfare scheme names, criteria, and departmental mandates are derived from official Gujarat gazetted sources:
   - Social Justice and Empowerment Department ([sje.gujarat.gov.in](https://sje.gujarat.gov.in))
   - Women and Child Development Department ([wcd.gujarat.gov.in](https://wcd.gujarat.gov.in))
   - e-Samaj Kalyan Portal ([esamajkalyan.gujarat.gov.in](https://esamajkalyan.gujarat.gov.in))
   - Digital Gujarat Portal ([digitalgujarat.gov.in](https://digitalgujarat.gov.in))
   - Directorate of Scheduled Caste Welfare & Developing Castes Welfare Directorate.
3. **UIDAI / Aadhaar Compliance**: In compliance with UIDAI regulations, Family360 never collects or stores raw 12-digit Aadhaar numbers. In production, identity verification operates via UIDAI's consent-based authentication APIs returning hashed reference tokens only.

---

## 📖 Architecture Decision Records (ADRs)
- [ADR-001: Technology Stack & Framework Selection](file:///d:/Family360/docs/architecture_decisions/ADR-001.md)
- [ADR-002: Deterministic Rule Engine vs. LLM Decision Decoupling](file:///d:/Family360/docs/architecture_decisions/ADR-002.md)
- [ADR-003: Entity Resolution, RapidFuzz Scoring, & Blocking Strategy](file:///d:/Family360/docs/architecture_decisions/ADR-003.md)
- [System Design Document](file:///d:/Family360/docs/system_design.md)
