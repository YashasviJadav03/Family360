from datetime import date
from sqlalchemy import String, Boolean, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class FamilyMember(Base):
    """
    Represents an individual resident belonging to a registered Gujarat Family.
    """
    __tablename__ = "family_members"

    member_id: Mapped[str] = mapped_column(String(32), primary_key=True, index=True)
    family_id: Mapped[str] = mapped_column(String(32), ForeignKey("families.family_id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    dob: Mapped[date] = mapped_column(Date, nullable=False)
    gender: Mapped[str] = mapped_column(String(16), nullable=False)
    relation_to_head: Mapped[str] = mapped_column(String(32), nullable=False)  # Head, Spouse, Son, Daughter, Parent, Other
    education_level: Mapped[str | None] = mapped_column(String(64), nullable=True)  # None, Primary, Secondary, HigherSecondary, Graduate
    student_status: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    occupation: Mapped[str | None] = mapped_column(String(64), nullable=True)
    disability_status: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    family: Mapped["Family"] = relationship("Family", back_populates="members")
    identity_records: Mapped[list["IdentityRecord"]] = relationship("IdentityRecord", back_populates="member")
    benefits: Mapped[list["Benefit"]] = relationship("Benefit", back_populates="member")
    applications: Mapped[list["Application"]] = relationship("Application", back_populates="member")
