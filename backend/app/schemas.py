from pydantic import BaseModel, EmailStr, Field
from enum import Enum


class UserCreate(BaseModel):

    name: str
    email: EmailStr
    password: str
    role: str = "CITIZEN"


class UserLogin(BaseModel):

    email: EmailStr
    password: str


class IssueCreate(BaseModel):

    category: str
    title: str
    description: str
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)

    class Config:
        str_strip_whitespace = True


class IssueStatus(str, Enum):

    REPORTED = "REPORTED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"


class IssueStatusUpdate(BaseModel):

    status: IssueStatus


class IssuePriority(str, Enum):

    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class IssuePriorityUpdate(BaseModel):

    priority: IssuePriority