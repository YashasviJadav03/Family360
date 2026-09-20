from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.family import Family
from app.models.benefit import Benefit
from app.models.eligibility_rule import EligibilityRule
from app.schemas.family import FamilySummaryOut, FamilyDetailOut
from app.schemas.common import PaginatedResponse
from app.schemas.benefit_gap import BenefitGapReport
from app.services.eligibility_engine import evaluate_eligibility, EligibilityResult
from app.services.benefit_gap_service import compute_benefit_gap

router = APIRouter(prefix="/families", tags=["Families"])


@router.get(
    "",
    response_model=PaginatedResponse[FamilySummaryOut],
    summary="List Families",
    description="Retrieve a paginated list of families with optional filtering by district, social category, and unclaimed benefit gap status.",
)
def list_families(
    district: str | None = Query(None, description="Filter by district name"),
    category: str | None = Query(None, description="Filter by social category (SC, ST, OBC, General, SEBC)"),
    has_gap: bool | None = Query(None, description="Filter for families with at least 1 unclaimed benefit gap"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    query = db.query(Family)

    if district:
        query = query.filter(Family.district == district)
    if category:
        query = query.filter(Family.social_category == category)

    if has_gap is not None:
        # Families that have at least one NOT_APPLIED benefit
        gap_subquery = (
            db.query(Benefit.family_id)
            .filter(Benefit.status == "NOT_APPLIED")
            .distinct()
        )
        if has_gap:
            query = query.filter(Family.family_id.in_(gap_subquery))
        else:
            query = query.filter(~Family.family_id.in_(gap_subquery))

    total = query.count()
    families = query.order_by(Family.family_id).offset((page - 1) * page_size).limit(page_size).all()

    # Calculate gap and receiving counts for items
    family_ids = [f.family_id for f in families]
    benefits = db.query(Benefit).filter(Benefit.family_id.in_(family_ids)).all()
    b_map: dict[str, dict[str, int]] = {}
    for b in benefits:
        b_map.setdefault(b.family_id, {"gap": 0, "receiving": 0})
        if b.status == "NOT_APPLIED":
            b_map[b.family_id]["gap"] += 1
        elif b.status == "RECEIVING":
            b_map[b.family_id]["receiving"] += 1

    items = []
    for f in families:
        f_counts = b_map.get(f.family_id, {"gap": 0, "receiving": 0})
        summary_obj = FamilySummaryOut(
            family_id=f.family_id,
            ration_card_id=f.ration_card_id,
            district=f.district,
            taluka=f.taluka,
            village=f.village,
            annual_income=f.annual_income,
            social_category=f.social_category,
            housing_status=f.housing_status,
            land_holding_acres=f.land_holding_acres,
            family_size=f.family_size,
            gap_count=f_counts["gap"],
            receiving_count=f_counts["receiving"],
            created_at=f.created_at,
            updated_at=f.updated_at,
        )
        items.append(summary_obj)

    pages = (total + page_size - 1) // page_size if total > 0 else 1

    return PaginatedResponse(
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
        items=items,
    )


@router.get(
    "/{family_id}",
    response_model=FamilyDetailOut,
    summary="Get Family 360 Profile",
    description="Retrieve the complete 360-degree profile of a family, including demographic attributes, all members, multi-source identity records, active benefits, and applications.",
)
def get_family_detail(family_id: str, db: Session = Depends(get_db)):
    family = db.query(Family).filter(Family.family_id == family_id).first()
    if not family:
        raise HTTPException(status_code=404, detail=f"Family '{family_id}' not found")
    return family


@router.get(
    "/{family_id}/eligibility",
    response_model=dict[str, EligibilityResult],
    summary="Evaluate Family Scheme Eligibility",
    description="Run the deterministic rule engine to evaluate this family against all 11 Gujarat welfare schemes, returning granular matched and failed rule audits.",
)
def get_family_eligibility(family_id: str, db: Session = Depends(get_db)):
    family = db.query(Family).filter(Family.family_id == family_id).first()
    if not family:
        raise HTTPException(status_code=404, detail=f"Family '{family_id}' not found")
    all_rules = db.query(EligibilityRule).all()
    return evaluate_eligibility(family, family.members, all_rules)


@router.get(
    "/{family_id}/benefit-gap",
    response_model=BenefitGapReport,
    summary="Get Benefit Gap Report",
    description="Analyze welfare entitlement delivery for this family, partitioning schemes into Receiving (Claimed), Eligible but Not Applied (Gap), and Not Eligible.",
)
def get_family_benefit_gap(family_id: str, db: Session = Depends(get_db)):
    return compute_benefit_gap(family_id, db)
