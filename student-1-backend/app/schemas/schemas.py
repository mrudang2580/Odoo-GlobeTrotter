from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: str
    email: EmailStr
    city: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    photo_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ActivityResponse(BaseModel):
    id: str
    city_id: str
    name: str
    category: str
    cost: float
    duration_minutes: int
    description: Optional[str] = None
    image_url: str
    class Config:
        from_attributes = True

class CityResponse(BaseModel):
    id: str
    name: str
    country: str
    region: str
    cost_index: int
    popularity_score: int
    image_url: str
    description: Optional[str] = None
    class Config:
        from_attributes = True

class StopActivityResponse(BaseModel):
    id: str
    stop_id: str
    activity_id: str
    scheduled_date: Optional[date] = None
    scheduled_time: Optional[str] = None
    cost: float
    activity: Optional[ActivityResponse] = None
    class Config:
        from_attributes = True

class StopActivityCreate(BaseModel):
    activity_id: str
    scheduled_date: Optional[date] = None
    scheduled_time: Optional[str] = None
    cost: Optional[float] = None

class StopCreate(BaseModel):
    city_id: str
    order_index: int = 0
    start_date: date
    end_date: date
    budget: float = 500.00

class StopResponse(BaseModel):
    id: str
    trip_id: str
    city_id: str
    order_index: int
    start_date: date
    end_date: date
    budget: float
    city: Optional[CityResponse] = None
    stop_activities: List[StopActivityResponse] = []
    class Config:
        from_attributes = True

class TripCreate(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    budget_limit: Optional[float] = 2500.00
    cover_photo_url: Optional[str] = None
    is_public: Optional[bool] = False

class TripResponse(TripCreate):
    id: str
    user_id: str
    status: str
    share_slug: Optional[str] = None
    created_at: datetime
    stops: List[StopResponse] = []
    class Config:
        from_attributes = True

class BudgetBreakdown(BaseModel):
    total_cost: float
    budget_limit: float
    is_over_budget: bool
    by_category: dict
    by_day: List[dict]
    average_cost_per_day: float
    over_budget_days: List[str]
