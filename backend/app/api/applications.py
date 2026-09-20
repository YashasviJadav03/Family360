import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.application import Application
from app.models.family import Family
from app.models.scheme import Scheme
from app.models.benefit import Benefit
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationOut

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.get(
    "",
    response_model=list[ApplicationOut],
    summary="List Applications",
    description="Retrieve submitted scheme applications with optional filtering by family_id, scheme_id, and status.",
)
def list_applications(
    family_id: str | None = Query(None, description="Filter by family ID"),
    scheme_id: str | None = Query(None, description="Filter by scheme ID"),
    status: str | None = Query(None, description="Filter by status (SUBMITTED, DOCS_VERIFIED, UNDER_VERIFICATION, APPROVED, REJECTED)"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(Application)
    if family_id:
        query = query.filter(Application.family_id == family_id)
    if scheme_id:
        query = query.filter(Application.scheme_id == scheme_id)
    if status:
        query = query.filter(Application.status == status)
    return query.order_by(Application.submitted_at.desc()).limit(limit).all()


@router.post(
    "",
    response_model=ApplicationOut,
    status_code=201,
    summary="Submit Scheme Application",
    description="Allows a citizen or assisting field officer to submit an application for an identified eligible benefit gap.",
)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    family = db.query(Family).filter(Family.family_id == payload.family_id).first()
    if not family:
        raise HTTPException(status_code=404, detail=f"Family '{payload.family_id}' not found")

    scheme = db.query(Scheme).filter(Scheme.scheme_id == payload.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{payload.scheme_id}' not found")

    app_id = f"APP{uuid.uuid4().hex[:7].upper()}"
    new_app = Application(
        application_id=app_id,
        family_id=payload.family_id,
        member_id=payload.member_id or (family.members[0].member_id if family.members else None),
        scheme_id=payload.scheme_id,
        status="SUBMITTED",
        submitted_at=datetime.utcnow(),
        assigned_officer="Pending Assignment",
    )
    db.add(new_app)

    # Update matching benefit status to APPLIED if present
    benefit = (
        db.query(Benefit)
        .filter(
            Benefit.family_id == payload.family_id,
            Benefit.scheme_id == payload.scheme_id,
        )
        .first()
    )
    if benefit and benefit.status == "NOT_APPLIED":
        benefit.status = "APPLIED"

    db.commit()
    db.refresh(new_app)
    return new_app


@router.patch(
    "/{application_id}",
    response_model=ApplicationOut,
    summary="Update Application Status",
    description="Enables an authorized administrative officer to transition an application status (e.g., DOCS_VERIFIED, UNDER_VERIFICATION, APPROVED, REJECTED).",
)
def update_application(
    application_id: str,
    payload: ApplicationUpdate,
    db: Session = Depends(get_db),
):
    app = db.query(Application).filter(Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail=f"Application '{application_id}' not found")

    allowed_statuses = {"SUBMITTED", "DOCS_VERIFIED", "UNDER_VERIFICATION", "APPROVED", "REJECTED"}
    if payload.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{payload.status}'. Allowed: {allowed_statuses}",
        )

    app.status = payload.status
    if payload.assigned_officer:
        app.assigned_officer = payload.assigned_officer

    # If APPROVED, update corresponding Benefit record to RECEIVING
    if payload.status == "APPROVED":
        benefit = (
            db.query(Benefit)
            .filter(
                Benefit.family_id == app.family_id,
                Benefit.scheme_id == app.scheme_id,
            )
            .first()
        )
        if benefit:
            benefit.status = "RECEIVING"
            benefit.approval_date = datetime.utcnow().date()

    db.commit()
    db.refresh(app)
    return app
