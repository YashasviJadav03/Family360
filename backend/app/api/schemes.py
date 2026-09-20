from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.scheme import Scheme
from app.schemas.scheme import SchemeOut

router = APIRouter(prefix="/schemes", tags=["Schemes"])


@router.get(
    "",
    response_model=list[SchemeOut],
    summary="List All Welfare Schemes",
    description="Retrieve all official Gujarat welfare schemes registered in the platform, including department metadata and structured statutory eligibility rules.",
)
def list_schemes(db: Session = Depends(get_db)):
    schemes = db.query(Scheme).order_by(Scheme.scheme_id).all()
    return schemes


@router.get(
    "/{scheme_id}",
    response_model=SchemeOut,
    summary="Get Scheme Details",
    description="Retrieve full details for a specific welfare scheme, including description, benefits, department contact, application links, and atomic evaluation rules.",
)
def get_scheme(scheme_id: str, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.scheme_id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{scheme_id}' not found")
    return scheme
