from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.family import Family
from app.models.benefit import Benefit
from app.models.identity_record import IdentityRecord

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
