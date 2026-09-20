from datetime import date
from pydantic import BaseModel, ConfigDict


class IdentityRecordOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    record_id: str
    member_id: str | None
    source_system: str
    source_member_id: str
    name_as_recorded: str
    dob: date
    gender: str
    district: str
    village: str
    ration_card_id: str | None


class MemberOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    member_id: str
    family_id: str
    name: str
    dob: date
    gender: str
    relation_to_head: str
    education_level: str | None
    student_status: bool
    occupation: str | None
    disability_status: bool
    identity_records: list[IdentityRecordOut] = []
