from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class EligibilityRule(Base):
    """
    Represents an atomic, deterministic eligibility criterion associated with a scheme.
    """
    __tablename__ = "eligibility_rules"

    rule_id: Mapped[str] = mapped_column(String(32), primary_key=True, index=True)
    scheme_id: Mapped[str] = mapped_column(String(32), ForeignKey("schemes.scheme_id"), nullable=False, index=True)
    attribute: Mapped[str] = mapped_column(String(64), nullable=False)  # age, income, category, gender, etc.
    operator: Mapped[str] = mapped_column(String(16), nullable=False)   # >=, <=, =, !=, IN, NOT_IN, >, <
    value: Mapped[str] = mapped_column(String(128), nullable=False)

    # Relationships
    scheme: Mapped["Scheme"] = relationship("Scheme", back_populates="rules")
