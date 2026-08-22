import uuid
from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Trip, User, Stop, StopActivity
from app.schemas.schemas import TripCreate, TripResponse

router = APIRouter(prefix="/trips", tags=["Trips"])

def compute_status(start: date, end: date) -> str:
    today = date.today()
    if today < start:
        return "upcoming"
    elif today > end:
        return "completed"
    return "ongoing"

@router.post("", response_model=TripResponse)
def create_trip(payload: TripCreate, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        user = User(name="Alex Wanderer", email="demo@globetrotter.io", password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
    
    slug = payload.name.lower().replace(" ", "-") + "-" + str(uuid.uuid4())[:6]
    trip = Trip(
        user_id=user.id,
        name=payload.name,
        description=payload.description,
        start_date=payload.start_date,
        end_date=payload.end_date,
        budget_limit=payload.budget_limit or 2500.0,
        cover_photo_url=payload.cover_photo_url or "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
        status=compute_status(payload.start_date, payload.end_date),
        is_public=payload.is_public or False,
        share_slug=slug
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip

@router.get("", response_model=List[TripResponse])
def list_trips(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Trip)
    if status:
        query = query.filter(Trip.status == status)
    return query.order_by(Trip.start_date.asc()).all()

@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    trip.status = compute_status(trip.start_date, trip.end_date)
    return trip

@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(trip_id: str, payload: TripCreate, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    for field, val in payload.dict().items():
        setattr(trip, field, val)
    trip.status = compute_status(trip.start_date, trip.end_date)
    db.commit()
    db.refresh(trip)
    return trip

@router.delete("/{trip_id}")
def delete_trip(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
    return {"message": "Trip deleted successfully"}

@router.get("/{trip_id}/public", response_model=TripResponse)
def get_public_trip(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter((Trip.id == trip_id) | (Trip.share_slug == trip_id)).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Public trip not found")
    return trip

@router.post("/{trip_id}/copy", response_model=TripResponse)
def copy_trip(trip_id: str, db: Session = Depends(get_db)):
    original = db.query(Trip).filter(Trip.id == trip_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Source trip not found")
    
    cloned_slug = f"copy-{original.name.lower().replace(' ', '-')}-{str(uuid.uuid4())[:6]}"
    cloned_trip = Trip(
        user_id=original.user_id,
        name=f"Copy of {original.name}",
        description=original.description,
        start_date=original.start_date,
        end_date=original.end_date,
        budget_limit=original.budget_limit,
        cover_photo_url=original.cover_photo_url,
        status="upcoming",
        is_public=False,
        share_slug=cloned_slug
    )
    db.add(cloned_trip)
    db.commit()
    db.refresh(cloned_trip)
    return cloned_trip
