from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from .database import Base
import enum


class IssuePriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class IssueStatus(str, enum.Enum):
    REPORTED = "REPORTED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="CITIZEN")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)

    ticket_id = Column(String(20), unique=True, nullable=False, index=True)

    citizen_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    category = Column(String(50), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)

    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    priority = Column(
        Enum(IssuePriority),
        default=IssuePriority.MEDIUM,
        nullable=False
    )

    status = Column(
        Enum(IssueStatus),
        default=IssueStatus.REPORTED,
        nullable=False
    )

    image_url = Column(String(500), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )