from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import City, Activity
from app.schemas.schemas import CityResponse, ActivityResponse

router = APIRouter(tags=["Discovery & Search"])

@router.get("/cities", response_model=List[CityResponse])
def search_cities(
    search: Optional[str] = None,
    country: Optional[str] = None,
    sort: Optional[str] = "popularity",
    db: Session = Depends(get_db)
):
    query = db.query(City)
    if search:
        query = query.filter(City.name.ilike(f"%{search}%") | City.country.ilike(f"%{search}%"))
    if country:
        query = query.filter(City.country.ilike(f"%{country}%"))
    
    if sort == "cost_low":
        query = query.order_by(City.cost_index.asc())
    elif sort == "cost_high":
        query = query.order_by(City.cost_index.desc())
    else:
        query = query.order_by(City.popularity_score.desc())
    return query.all()

@router.get("/activities", response_model=List[ActivityResponse])
def search_activities(
    city_id: Optional[str] = None,
    category: Optional[str] = None,
    max_cost: Optional[float] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Activity)
    if city_id:
        query = query.filter(Activity.city_id == city_id)
    if category:
        query = query.filter(Activity.category == category)
    if max_cost is not None:
        query = query.filter(Activity.cost <= max_cost)
    if search:
        query = query.filter(Activity.name.ilike(f"%{search}%") | Activity.description.ilike(f"%{search}%"))
    return query.all()
