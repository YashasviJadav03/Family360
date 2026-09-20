from pydantic import BaseModel
from app.schemas.scheme import SchemeOut
from app.services.eligibility_engine import RuleEvaluationDetail


class GapSchemeItem(BaseModel):
    scheme: SchemeOut
    matched_rules: list[RuleEvaluationDetail]
    failed_rules: list[RuleEvaluationDetail] = []
    missing_data_fields: list[str] = []
    current_benefit_status: str  # NOT_APPLIED, APPLIED
    application_id: str | None = None
    application_status: str | None = None


class ReceivingSchemeItem(BaseModel):
    scheme: SchemeOut
    benefit_id: str
    status: str
    amount: int | None
    approval_date: str | None


class NotEligibleSchemeItem(BaseModel):
    scheme: SchemeOut
    matched_rules: list[RuleEvaluationDetail] = []
    failed_rules: list[RuleEvaluationDetail] = []
    missing_data_fields: list[str] = []


class BenefitGapReport(BaseModel):
    family_id: str
    eligible_count: int
    receiving_count: int
    gap_count: int
    gap_schemes: list[GapSchemeItem]
    receiving_schemes: list[ReceivingSchemeItem]
    not_eligible_schemes: list[NotEligibleSchemeItem] = []
