from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database import get_db
from app.models.models import User
from app.schemas.schemas import UserCreate, UserResponse, LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/signup", response_model=TokenResponse)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = pwd_context.hash(payload.password)
    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hashed,
        photo_url=payload.photo_url or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        city=payload.city,
        country=payload.country,
        phone=payload.phone
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = "demo-jwt-token-access-2026"
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = "demo-jwt-token-access-2026"
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/forgot-password")
def forgot_password(payload: dict):
    email = payload.get("email")
    return {"message": f"Password reset instructions sent to {email}", "reset_token": "mock-reset-token-2026"}

@router.get("/me", response_model=UserResponse)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
