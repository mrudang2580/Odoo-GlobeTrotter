from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Stop, StopActivity, Trip
from app.schemas.schemas import StopCreate, StopResponse, StopActivityCreate, StopActivityResponse

router = APIRouter(tags=["Stops & Activities"])

@router.post("/trips/{trip_id}/stops", response_model=StopResponse)
def add_stop(trip_id: str, payload: StopCreate, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    stop = Stop(
        trip_id=trip_id,
        city_id=payload.city_id,
        order_index=payload.order_index,
        start_date=payload.start_date,
        end_date=payload.end_date,
        budget=payload.budget
    )
    db.add(stop)
    db.commit()
    db.refresh(stop)
    return stop

@router.put("/stops/reorder")
def reorder_stops(payload: List[dict], db: Session = Depends(get_db)):
    for item in payload:
        stop = db.query(Stop).filter(Stop.id == item["id"]).first()
        if stop:
            stop.order_index = item["order_index"]
    db.commit()
    return {"message": "Stops reordered successfully"}

@router.post("/stops/{stop_id}/activities", response_model=StopActivityResponse)
def add_activity_to_stop(stop_id: str, payload: StopActivityCreate, db: Session = Depends(get_db)):
    stop = db.query(Stop).filter(Stop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    
    sa = StopActivity(
        stop_id=stop_id,
        activity_id=payload.activity_id,
        scheduled_date=payload.scheduled_date or stop.start_date,
        scheduled_time=payload.scheduled_time or "10:00 AM",
        cost=payload.cost or 0.0
    )
    db.add(sa)
    db.commit()
    db.refresh(sa)
    return sa

@router.delete("/stops/{stop_id}/activities/{activity_id}")
def remove_activity(stop_id: str, activity_id: str, db: Session = Depends(get_db)):
    sa = db.query(StopActivity).filter(
        StopActivity.stop_id == stop_id,
        StopActivity.id == activity_id
    ).first()
    if not sa:
        raise HTTPException(status_code=404, detail="Activity mapping not found")
    db.delete(sa)
    db.commit()
    return {"message": "Activity removed from stop"}
