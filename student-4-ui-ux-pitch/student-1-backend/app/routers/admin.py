from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Trip, City, Activity

router = APIRouter(prefix="/admin", tags=["Admin & Analytics"])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    return {
        "metrics": {
            "total_users": db.query(User).count(),
            "total_trips": db.query(Trip).count(),
            "total_cities": db.query(City).count(),
            "total_activities": db.query(Activity).count()
        },
        "top_cities": [{"name": c.name, "score": c.popularity_score} for c in db.query(City).limit(5).all()]
    }
