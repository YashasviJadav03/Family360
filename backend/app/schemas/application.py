from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.scheme import SchemeOut


class ApplicationCreate(BaseModel):
    family_id: str
    member_id: str | None = None
    scheme_id: str


class ApplicationUpdate(BaseModel):
    status: str  # SUBMITTED, DOCS_VERIFIED, UNDER_VERIFICATION, APPROVED, REJECTED
    assigned_officer: str | None = None


class ApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    application_id: str
    family_id: str
    member_id: str | None
    scheme_id: str
    status: str
    submitted_at: datetime
    assigned_officer: str | None
    scheme: SchemeOut | None = None
