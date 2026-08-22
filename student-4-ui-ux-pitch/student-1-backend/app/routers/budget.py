from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Trip, Expense
from app.schemas.schemas import BudgetBreakdown

router = APIRouter(prefix="/trips", tags=["Budget & Analytics"])

@router.get("/{trip_id}/budget", response_model=BudgetBreakdown)
def get_trip_budget(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    expenses = db.query(Expense).filter(Expense.trip_id == trip_id).all()
    by_category = {"transport": 0.0, "stay": 0.0, "activities": 0.0, "meals": 0.0}
    by_day_dict = {}

    for exp in expenses:
        cat = exp.category.lower()
        amt = float(exp.amount)
        if cat in by_category:
            by_category[cat] += amt
        else:
            by_category["activities"] += amt
        d_str = str(exp.date)
        by_day_dict[d_str] = by_day_dict.get(d_str, 0.0) + amt
    
    for stop in trip.stops:
        for sa in stop.stop_activities:
            cost = float(sa.cost or 0.0)
            by_category["activities"] += cost
            d_str = str(sa.scheduled_date or stop.start_date)
            by_day_dict[d_str] = by_day_dict.get(d_str, 0.0) + cost

    total_cost = sum(by_category.values())
    total_days = max(1, (trip.end_date - trip.start_date).days + 1)
    daily_avg = round(total_cost / total_days, 2)
    daily_limit = float(trip.budget_limit) / total_days

    over_budget_days = [d for d, cost in by_day_dict.items() if cost > daily_limit]
    by_day_list = [{"date": d, "cost": c} for d, c in sorted(by_day_dict.items())]

    return {
        "total_cost": round(total_cost, 2),
        "budget_limit": float(trip.budget_limit),
        "is_over_budget": total_cost > float(trip.budget_limit),
        "by_category": by_category,
        "by_day": by_day_list,
        "average_cost_per_day": daily_avg,
        "over_budget_days": over_budget_days
    }
