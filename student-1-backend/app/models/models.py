import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Numeric, Date, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    photo_url = Column(Text, default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
    city = Column(String(100))
    country = Column(String(100))
    phone = Column(String(50))
    role = Column(String(50), default="user")
    created_at = Column(DateTime, default=datetime.utcnow)
    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
    posts = relationship("CommunityPost", back_populates="user", cascade="all, delete-orphan")

class Trip(Base):
    __tablename__ = "trips"
    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    budget_limit = Column(Numeric(10, 2), default=2500.00)
    cover_photo_url = Column(Text, default="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800")
    status = Column(String(50), default="upcoming")
    is_public = Column(Boolean, default=False)
    share_slug = Column(String(100), unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="trips")
    stops = relationship("Stop", back_populates="trip", cascade="all, delete-orphan", order_by="Stop.order_index")
    expenses = relationship("Expense", back_populates="trip", cascade="all, delete-orphan")

class City(Base):
    __tablename__ = "cities"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False, index=True)
    country = Column(String(100), nullable=False, index=True)
    region = Column(String(100), nullable=False)
    cost_index = Column(Integer, nullable=False)
    popularity_score = Column(Integer, nullable=False)
    image_url = Column(Text, nullable=False)
    description = Column(Text)
    stops = relationship("Stop", back_populates="city")
    activities = relationship("Activity", back_populates="city", cascade="all, delete-orphan")

class Stop(Base):
    __tablename__ = "stops"
    id = Column(String, primary_key=True, default=gen_uuid)
    trip_id = Column(String, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    city_id = Column(String, ForeignKey("cities.id", ondelete="CASCADE"), nullable=False)
    order_index = Column(Integer, default=0, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    budget = Column(Numeric(10, 2), default=500.00)
    trip = relationship("Trip", back_populates="stops")
    city = relationship("City", back_populates="stops")
    stop_activities = relationship("StopActivity", back_populates="stop", cascade="all, delete-orphan")

class Activity(Base):
    __tablename__ = "activities"
    id = Column(String, primary_key=True, default=gen_uuid)
    city_id = Column(String, ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)
    cost = Column(Numeric(10, 2), default=0.00)
    duration_minutes = Column(Integer, default=60)
    description = Column(Text)
    image_url = Column(Text, nullable=False)
    city = relationship("City", back_populates="activities")
    stop_activities = relationship("StopActivity", back_populates="activity")

class StopActivity(Base):
    __tablename__ = "stop_activities"
    id = Column(String, primary_key=True, default=gen_uuid)
    stop_id = Column(String, ForeignKey("stops.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_id = Column(String, ForeignKey("activities.id", ondelete="CASCADE"), nullable=False)
    scheduled_date = Column(Date, nullable=True)
    scheduled_time = Column(String(50), nullable=True)
    cost = Column(Numeric(10, 2), default=0.00)
    stop = relationship("Stop", back_populates="stop_activities")
    activity = relationship("Activity", back_populates="stop_activities")

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(String, primary_key=True, default=gen_uuid)
    trip_id = Column(String, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    date = Column(Date, nullable=False)
    description = Column(String(255))
    trip = relationship("Trip", back_populates="expenses")

class CommunityPost(Base):
    __tablename__ = "community_posts"
    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    trip_id = Column(String, ForeignKey("trips.id", ondelete="SET NULL"), nullable=True)
    caption = Column(Text, nullable=False)
    likes_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="posts")
