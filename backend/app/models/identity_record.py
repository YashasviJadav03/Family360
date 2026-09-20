from datetime import date
from sqlalchemy import String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class IdentityRecord(Base):
    """
    Represents an identity footprint captured from departmental source systems
    (e.g., ration system, scholarship registry, health MIS).
    Deliberately contains real-world variations and errors to power entity resolution.
    """
    __tablename__ = "identity_records"

    record_id: Mapped[str] = mapped_column(String(32), primary_key=True, index=True)
    member_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("family_members.member_id"), nullable=True, index=True)
    source_system: Mapped[str] = mapped_column(String(64), nullable=False)  # ration, scholarship, housing, health, education
    source_member_id: Mapped[str] = mapped_column(String(64), nullable=False)
    name_as_recorded: Mapped[str] = mapped_column(String(128), nullable=False)
    dob: Mapped[date] = mapped_column(Date, nullable=False)
    gender: Mapped[str] = mapped_column(String(16), nullable=False)
    district: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    village: Mapped[str] = mapped_column(String(64), nullable=False)
    ration_card_id: Mapped[str | None] = mapped_column(String(64), nullable=True)

    # Relationships
    member: Mapped["FamilyMember | None"] = relationship("FamilyMember", back_populates="identity_records")
