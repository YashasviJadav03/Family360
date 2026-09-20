from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.officer import Officer
from app.schemas.officer import OfficerOut

router = APIRouter(prefix="/officers", tags=["Officers"])


@router.get(
    "",
    response_model=list[OfficerOut],
    summary="List Administrative Officers",
    description="Retrieve all registered outreach officers and district administrators responsible for welfare verification and beneficiary support.",
)
def list_officers(
    district: str | None = Query(None, description="Filter by district name"),
    db: Session = Depends(get_db),
):
    query = db.query(Officer)
    if district:
        query = query.filter(Officer.district == district)
    return query.order_by(Officer.officer_id).all()
