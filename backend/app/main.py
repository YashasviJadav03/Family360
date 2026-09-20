from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Family360 API",
    description="Family-Centric Welfare Intelligence & Beneficiary Management Platform",
    version="0.1.0",
)

# CORS setup to allow local frontend access (including spike.html and Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", summary="Health check", description="Returns API health status")
def health_check():
    return {"status": "ok"}


# ==============================================================================
# SPIKE — DELETE OR RETIRE BEFORE PHASE 3
# Rapid vertical-slice spike to prove the core loop: UI -> API -> Rule Check -> Response
# ==============================================================================
@app.get(
    "/spike/eligibility-demo",
    tags=["Spike (Throwaway)"],
    summary="Spike Eligibility Evaluation Demo",
    description="Throwaway vertical-slice endpoint proving deterministic eligibility evaluation end-to-end.",
)
def spike_eligibility_demo():
    # Hardcoded test family
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

    # Hardcoded scheme criteria: Old Age Pension (age >= 60, income <= 200,000)
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
