from datetime import date
from pydantic import BaseModel, ConfigDict
from app.schemas.scheme import SchemeOut


class BenefitOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    benefit_id: str
    family_id: str
    member_id: str | None
    scheme_id: str
    status: str
    application_date: date | None
    approval_date: date | None
    amount: int | None
    scheme: SchemeOut | None = None
