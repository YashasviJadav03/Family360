from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router

app = FastAPI(
    title="Family360 API",
    description="Family-Centric Welfare Intelligence & Beneficiary Management Platform for Gujarat Family ID",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

from app.core.config import settings

# CORS middleware configuration for frontend (supports local dev and deployed cloud origins)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:8000",
]
if settings.ALLOWED_ORIGINS:
    for origin in settings.ALLOWED_ORIGINS.split(","):
        origin_clean = origin.strip()
        if origin_clean and origin_clean not in origins:
            origins.append(origin_clean)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.onrender\.com|https://.*\.vercel\.app|https://.*\.netlify\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core API Routes
app.include_router(api_router)


@app.get("/health", summary="Health Check", description="Returns system health status")
def health_check():
    return {"status": "ok"}


# ==============================================================================
# SPIKE (PHASE 0.5) — RETAINED FOR RETROSPECTIVE & SPEED-OF-ITERATION PROOF
# ==============================================================================
@app.get(
    "/spike/eligibility-demo",
    tags=["Spike (Throwaway)"],
    summary="Spike Eligibility Evaluation Demo",
    description="Rapid vertical-slice spike endpoint proving deterministic eligibility evaluation end-to-end.",
)
def spike_eligibility_demo():
    family = {
        "family_id": "GJ-F000001",
        "district": "Ahmedabad",
        "annual_income": 120000,
        "social_category": "OBC",
        "members": [
            {
                "member_id": "GJ-M000001",
                "name": "Rameshbhai Patel",
                "age": 64,
                "relation": "Head",
            },
            {
                "member_id": "GJ-M000002",
                "name": "Geetaben Patel",
                "age": 61,
                "relation": "Spouse",
            },
        ],
    }
    scheme_name = "Indira Gandhi National Old Age Pension / Vrudh Pension Yojana"
    age_rule_passed = any(m["age"] >= 60 for m in family["members"])
    income_rule_passed = family["annual_income"] <= 200000
    is_eligible = age_rule_passed and income_rule_passed

    return {
        "spike_id": "spike-phase-0.5",
        "family": {
            "family_id": family["family_id"],
            "district": family["district"],
            "annual_income": family["annual_income"],
            "qualifying_member": "Rameshbhai Patel (Age 64)",
        },
        "scheme": {
            "scheme_id": "SCH_SPIKE_001",
            "name": scheme_name,
            "department": "Social Justice & Empowerment",
        },
        "evaluation": {
            "rules_checked": [
                {
                    "attribute": "age",
                    "operator": ">=",
                    "threshold": 60,
                    "actual": 64,
                    "passed": age_rule_passed,
                },
                {
                    "attribute": "annual_income",
                    "operator": "<=",
                    "threshold": 200000,
                    "actual": family["annual_income"],
                    "passed": income_rule_passed,
                },
            ],
            "is_eligible": is_eligible,
            "current_benefit_status": "NOT_APPLIED",
            "gap_detected": True,
            "message": "Eligible but unclaimed benefit detected for senior citizen member.",
        },
    }
