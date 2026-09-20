from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class Scheme(Base):
    """
    Represents an official Gujarat Government welfare scheme.
    """
    __tablename__ = "schemes"

    scheme_id: Mapped[str] = mapped_column(String(32), primary_key=True, index=True)
    scheme_name: Mapped[str] = mapped_column(String(256), nullable=False)
    department: Mapped[str] = mapped_column(String(256), nullable=False)
    category: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    benefit: Mapped[str] = mapped_column(Text, nullable=False)
    application_url: Mapped[str] = mapped_column(String(512), nullable=False)
    source_url: Mapped[str] = mapped_column(String(512), nullable=False)

    # Relationships
    rules: Mapped[list["EligibilityRule"]] = relationship("EligibilityRule", back_populates="scheme", cascade="all, delete-orphan")
    benefits: Mapped[list["Benefit"]] = relationship("Benefit", back_populates="scheme")
    applications: Mapped[list["Application"]] = relationship("Application", back_populates="scheme")
