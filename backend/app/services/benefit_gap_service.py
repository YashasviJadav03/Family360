from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.family import Family
from app.models.scheme import Scheme
from app.models.eligibility_rule import EligibilityRule
from app.models.benefit import Benefit
from app.models.application import Application
from app.services.eligibility_engine import evaluate_eligibility
from app.schemas.benefit_gap import (
    BenefitGapReport,
    GapSchemeItem,
    ReceivingSchemeItem,
    NotEligibleSchemeItem,
)
from app.schemas.scheme import SchemeOut


def compute_benefit_gap(family_id: str, db: Session) -> BenefitGapReport:
    """
    Computes a comprehensive benefit gap report for a given family.
    Cross-references real-time deterministic eligibility evaluations
    with existing benefits and active scheme applications.

    Args:
        family_id: Canonical Gujarat Family ID (e.g. "GJ-F000001").
        db: Active SQLAlchemy database session.

    Returns:
        BenefitGapReport: Structured report categorizing all schemes into
        Receiving, Eligible but Unclaimed (Gap), and Not Eligible.
    """
    family = db.query(Family).filter(Family.family_id == family_id).first()
    if not family:
        raise HTTPException(status_code=404, detail=f"Family {family_id} not found")

    members = family.members
    all_rules = db.query(EligibilityRule).all()
    all_schemes = {s.scheme_id: s for s in db.query(Scheme).all()}
    existing_benefits = db.query(Benefit).filter(Benefit.family_id == family_id).all()
    active_applications = {
        app.scheme_id: app
        for app in db.query(Application).filter(Application.family_id == family_id).all()
    }

    # Map existing benefits by scheme_id
    benefits_by_scheme = {b.scheme_id: b for b in existing_benefits}

    # Run deterministic eligibility engine
    eval_results = evaluate_eligibility(family, members, all_rules)

    receiving_items: list[ReceivingSchemeItem] = []
    gap_items: list[GapSchemeItem] = []
    not_eligible_items: list[NotEligibleSchemeItem] = []

    for scheme_id, scheme in all_schemes.items():
        scheme_out = SchemeOut.model_validate(scheme)
        res = eval_results.get(scheme_id)
        benefit = benefits_by_scheme.get(scheme_id)

        # Check if already actively receiving
        if benefit and benefit.status == "RECEIVING":
            receiving_items.append(
                ReceivingSchemeItem(
                    scheme=scheme_out,
                    benefit_id=benefit.benefit_id,
                    status=benefit.status,
                    amount=benefit.amount,
                    approval_date=str(benefit.approval_date) if benefit.approval_date else None,
                )
            )
        elif res and res.is_eligible:
            # Eligible but not receiving -> BENEFIT GAP
            in_flight_app = active_applications.get(scheme_id)
            gap_items.append(
                GapSchemeItem(
                    scheme=scheme_out,
                    matched_rules=res.matched_rules,
                    failed_rules=res.failed_rules,
                    missing_data_fields=res.missing_data_fields,
                    current_benefit_status=benefit.status if benefit else "NOT_APPLIED",
                    application_id=in_flight_app.application_id if in_flight_app else None,
                    application_status=in_flight_app.status if in_flight_app else None,
                )
            )
        else:
            # Not eligible
            not_eligible_items.append(
                NotEligibleSchemeItem(
                    scheme=scheme_out,
                    matched_rules=res.matched_rules if res else [],
                    failed_rules=res.failed_rules if res else [],
                    missing_data_fields=res.missing_data_fields if res else [],
                )
            )

    return BenefitGapReport(
        family_id=family_id,
        eligible_count=len(receiving_items) + len(gap_items),
        receiving_count=len(receiving_items),
        gap_count=len(gap_items),
        gap_schemes=gap_items,
        receiving_schemes=receiving_items,
        not_eligible_schemes=not_eligible_items,
    )
