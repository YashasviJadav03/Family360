from datetime import datetime
from sqlalchemy import String, DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base_class import Base


class DuplicateReview(Base):
    """
    Represents an administrative review decision made by a field/district officer
    on a flagged candidate duplicate pair.
    """
    __tablename__ = "duplicate_reviews"

    review_id: Mapped[str] = mapped_column(String(32), primary_key=True, index=True)
    record_id_1: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    record_id_2: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    match_score: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="PENDING")  # PENDING, CONFIRMED_DUPLICATE, NOT_DUPLICATE
    reviewed_by: Mapped[str | None] = mapped_column(String(128), nullable=True)
    notes: Mapped[str | None] = mapped_column(String(512), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
