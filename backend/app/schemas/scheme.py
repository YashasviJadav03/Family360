from pydantic import BaseModel, ConfigDict


class EligibilityRuleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    rule_id: str
    scheme_id: str
    attribute: str
    operator: str
    value: str


class SchemeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    scheme_id: str
    scheme_name: str
    department: str
    category: str
    description: str
    benefit: str
    application_url: str
    source_url: str
    rules: list[EligibilityRuleOut] = []
