from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.member import MemberOut
from app.schemas.benefit import BenefitOut
from app.schemas.application import ApplicationOut


class FamilySummaryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    family_id: str
    ration_card_id: str | None
    district: str
    taluka: str
    village: str
    annual_income: int
    social_category: str
    housing_status: str
    land_holding_acres: float | None
    family_size: int
    gap_count: int = 0
    receiving_count: int = 0
    created_at: datetime
    updated_at: datetime


class FamilyDetailOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    family_id: str
    ration_card_id: str | None
    district: str
    taluka: str
    village: str
    annual_income: int
    social_category: str
    housing_status: str
    land_holding_acres: float | None
    family_size: int
    created_at: datetime
    updated_at: datetime
    members: list[MemberOut] = []
    benefits: list[BenefitOut] = []
    applications: list[ApplicationOut] = []
