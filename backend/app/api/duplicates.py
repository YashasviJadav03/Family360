import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.identity_record import IdentityRecord
from app.models.duplicate_review import DuplicateReview
from app.services.duplicate_detection_service import (
    find_candidate_duplicates,
    DuplicateCandidate,
)
from app.ml.entity_resolution import compute_match_score, MatchResult
from app.schemas.member import IdentityRecordOut

router = APIRouter(prefix="/duplicates", tags=["Entity Resolution / Duplicates"])


class ResolveDuplicatePayload(BaseModel):
    status: str  # CONFIRMED_DUPLICATE, NOT_DUPLICATE
    reviewed_by: str | None = "Outreach Officer"
    notes: str | None = None


class DuplicateListResponse(BaseModel):
    total_candidates: int
    metrics: dict
    items: list[DuplicateCandidate]


@router.get(
    "",
    response_model=DuplicateListResponse,
    summary="List Candidate Duplicate Records",
    description="Retrieve candidate duplicate identity records across source systems, ranked by explainable confidence match score with blocking metrics.",
)
def list_duplicates(
    min_score: float = Query(0.65, ge=0.0, le=1.0, description="Minimum confidence threshold"),
    district: str | None = Query(None, description="Filter by district"),
    limit: int = Query(50, ge=1, le=200, description="Maximum candidate pairs to return"),
    db: Session = Depends(get_db),
):
    candidates, metrics = find_candidate_duplicates(
        db=db,
        min_score=min_score,
        district_filter=district,
        limit=limit,
    )
    return DuplicateListResponse(
        total_candidates=len(candidates),
        metrics=metrics,
        items=candidates,
    )


@router.get(
    "/{record_id_1}/{record_id_2}",
    response_model=DuplicateCandidate,
    summary="Get Duplicate Pair Explanation",
    description="Retrieve granular, explainable field-by-field similarity signals for two specific identity records.",
)
def get_duplicate_detail(
    record_id_1: str,
    record_id_2: str,
    db: Session = Depends(get_db),
):
    rec_a = db.query(IdentityRecord).filter(IdentityRecord.record_id == record_id_1).first()
    rec_b = db.query(IdentityRecord).filter(IdentityRecord.record_id == record_id_2).first()

    if not rec_a:
        raise HTTPException(status_code=404, detail=f"Identity record '{record_id_1}' not found")
    if not rec_b:
        raise HTTPException(status_code=404, detail=f"Identity record '{record_id_2}' not found")

    res = compute_match_score(rec_a, rec_b)

    # Check review status
    pair_key = sorted([record_id_1, record_id_2])
    rev = (
        db.query(DuplicateReview)
        .filter(
            DuplicateReview.record_id_1 == pair_key[0],
            DuplicateReview.record_id_2 == pair_key[1],
        )
        .first()
    )

    return DuplicateCandidate(
        record_1=IdentityRecordOut.model_validate(rec_a),
        record_2=IdentityRecordOut.model_validate(rec_b),
        match_result=res,
        review_status=rev.status if rev else "PENDING",
        reviewed_by=rev.reviewed_by if rev else None,
        review_notes=rev.notes if rev else None,
    )


@router.patch(
    "/{record_id_1}/{record_id_2}/resolve",
    summary="Resolve Duplicate Candidate Pair",
    description="Allows an authorized officer to resolve a flagged duplicate pair as CONFIRMED_DUPLICATE or NOT_DUPLICATE.",
)
def resolve_duplicate_pair(
    record_id_1: str,
    record_id_2: str,
    payload: ResolveDuplicatePayload,
    db: Session = Depends(get_db),
):
    allowed = {"CONFIRMED_DUPLICATE", "NOT_DUPLICATE"}
    if payload.status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid review status '{payload.status}'. Allowed: {allowed}",
        )

    rec_a = db.query(IdentityRecord).filter(IdentityRecord.record_id == record_id_1).first()
    rec_b = db.query(IdentityRecord).filter(IdentityRecord.record_id == record_id_2).first()

    if not rec_a or not rec_b:
        raise HTTPException(status_code=404, detail="One or both identity records not found")

    pair = sorted([record_id_1, record_id_2])
    rev = (
        db.query(DuplicateReview)
        .filter(
            DuplicateReview.record_id_1 == pair[0],
            DuplicateReview.record_id_2 == pair[1],
        )
        .first()
    )

    res = compute_match_score(rec_a, rec_b)

    if not rev:
        rev = DuplicateReview(
            review_id=f"REV{uuid.uuid4().hex[:7].upper()}",
            record_id_1=pair[0],
            record_id_2=pair[1],
            match_score=res.match_score,
            status=payload.status,
            reviewed_by=payload.reviewed_by,
            notes=payload.notes,
            reviewed_at=datetime.utcnow(),
        )
        db.add(rev)
    else:
        rev.status = payload.status
        rev.reviewed_by = payload.reviewed_by
        rev.notes = payload.notes
        rev.reviewed_at = datetime.utcnow()

    # If confirmed duplicate and one record is unlinked, link it to the other's member_id!
    if payload.status == "CONFIRMED_DUPLICATE":
        if rec_a.member_id and not rec_b.member_id:
            rec_b.member_id = rec_a.member_id
        elif rec_b.member_id and not rec_a.member_id:
            rec_a.member_id = rec_b.member_id

    db.commit()
    db.refresh(rev)

    return {
        "review_id": rev.review_id,
        "record_id_1": rev.record_id_1,
        "record_id_2": rev.record_id_2,
        "status": rev.status,
        "reviewed_by": rev.reviewed_by,
        "notes": rev.notes,
        "reviewed_at": str(rev.reviewed_at),
        "message": f"Duplicate candidate pair successfully resolved as {payload.status}.",
    }
