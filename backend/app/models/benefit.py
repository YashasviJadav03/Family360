from datetime import date
from sqlalchemy import String, Integer, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class Benefit(Base):
    """
    Represents an entitlement status between a family/member and a scheme.
    Status can be RECEIVING, NOT_APPLIED, or APPLIED.
    """
    __tablename__ = "benefits"

    benefit_id: Mapped[str] = mapped_column(String(32), primary_key=True, index=True)
    family_id: Mapped[str] = mapped_column(String(32), ForeignKey("families.family_id"), nullable=False, index=True)
    member_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("family_members.member_id"), nullable=True, index=True)
    scheme_id: Mapped[str] = mapped_column(String(32), ForeignKey("schemes.scheme_id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False)  # RECEIVING, NOT_APPLIED, APPLIED
    application_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    approval_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    amount: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Relationships
    family: Mapped["Family"] = relationship("Family", back_populates="benefits")
    member: Mapped["FamilyMember | None"] = relationship("FamilyMember", back_populates="benefits")
    scheme: Mapped["Scheme"] = relationship("Scheme", back_populates="benefits")
