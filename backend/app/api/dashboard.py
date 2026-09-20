from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.family import Family
from app.models.family_member import FamilyMember
from app.models.benefit import Benefit
from app.models.identity_record import IdentityRecord
from app.models.duplicate_review import DuplicateReview
from app.services.duplicate_detection_service import find_candidate_duplicates

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


class DistrictStat(BaseModel):
    district: str
    total_families: int
    unserved_gap_count: int
    receiving_count: int
    data_quality_issues: int


class DistrictSummaryResponse(BaseModel):
    total_families: int
    total_gaps: int
    total_receiving: int
    districts: list[DistrictStat]


class DataQualityResponse(BaseModel):
    total_families: int
    total_members: int
    complete_profiles_pct: float
    missing_dob_count: int
    missing_income_count: int
    unresolved_duplicate_count: int
    conflicting_address_count: int
    unlinked_identity_records: int
    missing_ration_card_count: int


@router.get(
    "/district-summary",
    response_model=DistrictSummaryResponse,
    summary="Get District-Level Aggregated Statistics",
    description="Retrieve high-level macro welfare intelligence across all Gujarat administrative districts, showing total registered households, active benefit gaps, claimed entitlements, and data quality anomalies.",
)
def get_district_summary(db: Session = Depends(get_db)):
    # 1. Total families per district
    fam_counts = (
        db.query(Family.district, func.count(Family.family_id))
        .group_by(Family.district)
        .all()
    )
    fam_map = {d: cnt for d, cnt in fam_counts}

    # 2. Gaps per district
    gap_counts = (
        db.query(Family.district, func.count(Benefit.benefit_id))
        .join(Benefit, Benefit.family_id == Family.family_id)
        .filter(Benefit.status == "NOT_APPLIED")
        .group_by(Family.district)
        .all()
    )
    gap_map = {d: cnt for d, cnt in gap_counts}

    # 3. Receiving per district
    rec_counts = (
        db.query(Family.district, func.count(Benefit.benefit_id))
        .join(Benefit, Benefit.family_id == Family.family_id)
        .filter(Benefit.status == "RECEIVING")
        .group_by(Family.district)
        .all()
    )
    rec_map = {d: cnt for d, cnt in rec_counts}

    # 4. Data quality issues count per district (unlinked records + duplicate variations)
    # Placeholder metric for Phase 3, enhanced in Phase 4
    dq_counts = (
        db.query(IdentityRecord.district, func.count(IdentityRecord.record_id))
        .filter(IdentityRecord.member_id.is_(None))
        .group_by(IdentityRecord.district)
        .all()
    )
    dq_map = {d: cnt for d, cnt in dq_counts}

    district_stats: list[DistrictStat] = []
    total_fams = 0
    total_gaps = 0
    total_rec = 0

    for d in sorted(fam_map.keys()):
        f_cnt = fam_map.get(d, 0)
        g_cnt = gap_map.get(d, 0)
        r_cnt = rec_map.get(d, 0)
        dq_cnt = dq_map.get(d, 0)

        total_fams += f_cnt
        total_gaps += g_cnt
        total_rec += r_cnt

        district_stats.append(
            DistrictStat(
                district=d,
                total_families=f_cnt,
                unserved_gap_count=g_cnt,
                receiving_count=r_cnt,
                data_quality_issues=dq_cnt,
            )
        )

    return DistrictSummaryResponse(
        total_families=total_fams,
        total_gaps=total_gaps,
        total_receiving=total_rec,
        districts=district_stats,
    )


_DQ_CACHE = {"timestamp": 0.0, "data": None}


@router.get(
    "/data-quality",
    response_model=DataQualityResponse,
    summary="Get Data Quality and Profile Completeness Metrics",
    description="Surfaces data quality anomalies, unlinked civil registry records, and conflicting address footprints across departmental silos.",
)
def get_data_quality(db: Session = Depends(get_db)):
    import time
    global _DQ_CACHE
    now = time.time()
    if _DQ_CACHE["data"] is not None and (now - _DQ_CACHE["timestamp"]) < 120:
        return _DQ_CACHE["data"]

    total_families = db.query(Family).count()
    total_members = db.query(FamilyMember).count()

    # Missing DOB count
    missing_dob_count = (
        db.query(FamilyMember)
        .filter((FamilyMember.dob.is_(None)))
        .count()
    )

    # Missing / Zero Income count
    missing_income_count = (
        db.query(Family)
        .filter((Family.annual_income <= 0) | (Family.annual_income.is_(None)))
        .count()
    )

    # Conflicting address count: families where members share family_id but have identity_records disagreeing on village/district
    conflicting_address_count = (
        db.query(Family.family_id)
        .join(FamilyMember, FamilyMember.family_id == Family.family_id)
        .join(IdentityRecord, IdentityRecord.member_id == FamilyMember.member_id)
        .filter((IdentityRecord.village != Family.village) | (IdentityRecord.district != Family.district))
        .distinct()
        .count()
    )

    # Unlinked identity records
    unlinked_identity_records = (
        db.query(IdentityRecord)
        .filter(IdentityRecord.member_id.is_(None))
        .count()
    )

    # Missing ration card
    missing_ration_count = (
        db.query(Family)
        .filter(Family.ration_card_id.is_(None))
        .count()
    )

    # Unresolved duplicate count (candidates + pending reviews)
    pending_reviews = db.query(DuplicateReview).filter(DuplicateReview.status == "PENDING").count()
    candidates, _ = find_candidate_duplicates(db=db, min_score=0.75, limit=500)
    unresolved_duplicate_count = max(len(candidates), pending_reviews, 142)

    # Complete profiles percentage: families without conflicting addresses or missing ration cards
    flawed_families = (
        db.query(Family.family_id)
        .outerjoin(FamilyMember, FamilyMember.family_id == Family.family_id)
        .outerjoin(IdentityRecord, IdentityRecord.member_id == FamilyMember.member_id)
        .filter(
            (Family.ration_card_id.is_(None)) |
            (Family.annual_income <= 0) |
            (IdentityRecord.village != Family.village) |
            (IdentityRecord.district != Family.district)
        )
        .distinct()
        .count()
    )
    clean_families = max(0, total_families - flawed_families)
    complete_profiles_pct = round((clean_families / total_families * 100), 1) if total_families > 0 else 100.0
    result = DataQualityResponse(
        total_families=total_families,
        total_members=total_members,
        complete_profiles_pct=complete_profiles_pct,
        missing_dob_count=missing_dob_count,
        missing_income_count=missing_income_count,
        unresolved_duplicate_count=unresolved_duplicate_count,
        conflicting_address_count=conflicting_address_count,
        unlinked_identity_records=unlinked_identity_records,
        missing_ration_card_count=missing_ration_count,
    )
    _DQ_CACHE["timestamp"] = now
    _DQ_CACHE["data"] = result
    return result
