from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine, get_db
from . import models
from .schemas import (
    UserCreate,
    UserLogin,
    IssueCreate,
    IssueStatusUpdate,
    IssuePriorityUpdate
)
from .auth import hash_password, verify_password, create_access_token
from .dependencies import get_current_user, require_admin


Base.metadata.create_all(bind=engine)

app = FastAPI(title="CivicFix API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "CivicFix API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "role": new_user.role
    }


@app.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        existing_user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token({
        "user_id": existing_user.id,
        "role": existing_user.role
    })

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "role": existing_user.role
    }


@app.get("/me")
def get_me(
    current_user=Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


@app.get("/admin-test")
def admin_test(
    current_user=Depends(require_admin)
):
    return {
        "message": "Welcome Admin!",
        "name": current_user.name,
        "role": current_user.role
    }


@app.post("/issues")
def create_issue(
    issue: IssueCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    new_issue = models.Issue(
        ticket_id="TEMP",
        citizen_id=current_user.id,
        category=issue.category,
        title=issue.title,
        description=issue.description,
        latitude=issue.latitude,
        longitude=issue.longitude
    )

    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)

    new_issue.ticket_id = f"CF-{new_issue.id:04d}"

    db.commit()
    db.refresh(new_issue)

    return {
        "message": "Issue reported successfully",
        "ticket_id": new_issue.ticket_id,
        "issue_id": new_issue.id,
        "status": new_issue.status
    }


@app.get("/issues/my")
def get_my_issues(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    issues = db.query(models.Issue).filter(
        models.Issue.citizen_id == current_user.id
    ).all()

    return issues


@app.get("/issues/{ticket_id}")
def get_issue(
    ticket_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    issue = db.query(models.Issue).filter(
        models.Issue.ticket_id == ticket_id,
        models.Issue.citizen_id == current_user.id
    ).first()

    if not issue:
        raise HTTPException(
            status_code=404,
            detail="Issue not found"
        )

    return {
        "ticket_id": issue.ticket_id,
        "title": issue.title,
        "category": issue.category,
        "description": issue.description,
        "priority": issue.priority,
        "status": issue.status,
        "latitude": issue.latitude,
        "longitude": issue.longitude,
        "created_at": issue.created_at,
        "updated_at": issue.updated_at
    }


@app.get("/admin/issues")
def get_all_issues(
    status: str = None,
    priority: str = None,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):

    query = db.query(models.Issue)

    if status:
        query = query.filter(models.Issue.status == status)

    if priority:
        query = query.filter(models.Issue.priority == priority)

    return query.all()


@app.put("/admin/issues/{ticket_id}/status")
def update_issue_status(
    ticket_id: str,
    status_update: IssueStatusUpdate,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):

    issue = db.query(models.Issue).filter(
        models.Issue.ticket_id == ticket_id
    ).first()

    if not issue:
        raise HTTPException(
            status_code=404,
            detail="Issue not found"
        )

    issue.status = status_update.status

    db.commit()
    db.refresh(issue)

    return {
        "message": "Issue status updated successfully",
        "ticket_id": issue.ticket_id,
        "status": issue.status
    }


@app.put("/admin/issues/{ticket_id}/priority")
def update_issue_priority(
    ticket_id: str,
    priority_update: IssuePriorityUpdate,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db)
):

    issue = db.query(models.Issue).filter(
        models.Issue.ticket_id == ticket_id
    ).first()

    if not issue:
        raise HTTPException(
            status_code=404,
            detail="Issue not found"
        )

    issue.priority = priority_update.priority

    db.commit()
    db.refresh(issue)

    return {
        "message": "Issue priority updated successfully",
        "ticket_id": issue.ticket_id,
        "priority": issue.priority
    }