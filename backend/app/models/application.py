from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class Application(Base):
    """
    Represents an in-flight or finalized scheme application initiated by a citizen
    or an outreach officer on behalf of the family.
    """
    __tablename__ = "applications"

    application_id: Mapped[str] = mapped_column(String(32), primary_key=True, index=True)
    family_id: Mapped[str] = mapped_column(String(32), ForeignKey("families.family_id"), nullable=False, index=True)
    member_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("family_members.member_id"), nullable=True, index=True)
    scheme_id: Mapped[str] = mapped_column(String(32), ForeignKey("schemes.scheme_id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False)  # SUBMITTED, DOCS_VERIFIED, UNDER_VERIFICATION, APPROVED, REJECTED
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    assigned_officer: Mapped[str | None] = mapped_column(String(128), nullable=True)

    # Relationships
    family: Mapped["Family"] = relationship("Family", back_populates="applications")
    member: Mapped["FamilyMember | None"] = relationship("FamilyMember", back_populates="applications")
    scheme: Mapped["Scheme"] = relationship("Scheme", back_populates="applications")
