from datetime import datetime
from sqlalchemy import String, Integer, Float, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class Family(Base):
    """
    Represents a unified Gujarat Family record.
    Acts as the primary anchor for social security and entitlement delivery.
    """
    __tablename__ = "families"

    family_id: Mapped[str] = mapped_column(String(32), primary_key=True, index=True)
    ration_card_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    district: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    taluka: Mapped[str] = mapped_column(String(64), nullable=False)
    village: Mapped[str] = mapped_column(String(64), nullable=False)
    annual_income: Mapped[int] = mapped_column(Integer, nullable=False)
    social_category: Mapped[str] = mapped_column(String(32), nullable=False)  # SC, ST, OBC, General, SEBC
    housing_status: Mapped[str] = mapped_column(String(32), nullable=False)   # Owned, Rented, None
    land_holding_acres: Mapped[float | None] = mapped_column(Float, nullable=True)
    family_size: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    members: Mapped[list["FamilyMember"]] = relationship("FamilyMember", back_populates="family", cascade="all, delete-orphan")
    benefits: Mapped[list["Benefit"]] = relationship("Benefit", back_populates="family", cascade="all, delete-orphan")
    applications: Mapped[list["Application"]] = relationship("Application", back_populates="family", cascade="all, delete-orphan")
