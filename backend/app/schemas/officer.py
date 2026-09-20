from pydantic import BaseModel, ConfigDict


class OfficerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    officer_id: str
    name: str
    district: str
    role: str
