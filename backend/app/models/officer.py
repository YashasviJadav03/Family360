from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base_class import Base


class Officer(Base):
    """
    Represents an administrative field worker or supervisory officer in Gujarat administration.
    """
    __tablename__ = "officers"

    officer_id: Mapped[str] = mapped_column(String(32), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    district: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(64), nullable=False)  # Taluka Officer, District Officer, State Admin
