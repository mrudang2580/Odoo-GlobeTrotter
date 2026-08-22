import csv
import os
import math
from typing import List, Dict, Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="GlobeTrotter AI Recommendation Engine",
    description="Content-based and collaborative AI recommendation microservice for multi-city travel planning.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
CITIES_FILE = os.path.join(DATA_DIR, "cities.csv")
ACTIVITIES_FILE = os.path.join(DATA_DIR, "activities.csv")

def load_cities() -> List[Dict]:
    cities = []
    if os.path.exists(CITIES_FILE):
        with open(CITIES_FILE, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for r in reader:
                r["cost_index"] = int(r["cost_index"])
                r["popularity_score"] = int(r["popularity_score"])
                r["avg_daily_budget_usd"] = float(r["avg_daily_budget_usd"])
                cities.append(r)
    return cities

def load_activities() -> List[Dict]:
    activities = []
    if os.path.exists(ACTIVITIES_FILE):
        with open(ACTIVITIES_FILE, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for r in reader:
                r["cost"] = float(r["cost"])
                r["duration_minutes"] = int(r["duration_minutes"])
                r["rating"] = float(r["rating"])
                activities.append(r)
    return activities

@app.get("/")
def health_check():
    return {
        "service": "GlobeTrotter AI Recommender",
        "status": "online",
        "cities_count": len(load_cities()),
        "activities_count": len(load_activities())
    }

@app.get("/recommend/destinations")
def recommend_destinations(
    interests: Optional[str] = Query(None, description="Comma-separated interests (e.g. food,art,adventure)"),
    max_cost_index: Optional[int] = Query(5, description="Max budget index 1-5"),
    preferred_region: Optional[str] = Query(None, description="Preferred world region"),
    limit: int = 5
):
    cities = load_cities()
    scored = []
    interest_list = [i.strip().lower() for i in interests.split(",")] if interests else []

    for city in cities:
        if max_cost_index and city["cost_index"] > max_cost_index:
            continue
        
        score = city["popularity_score"] * 0.4
        
        if preferred_region and preferred_region.lower() in city["region"].lower():
            score += 25
        
        desc = city["description"].lower()
        for interest in interest_list:
            if interest in desc:
                score += 15
        
        scored.append({"city": city, "match_score": round(score, 1)})
    
    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return scored[:limit]

@app.get("/recommend/activities")
def recommend_activities(
    city_id: Optional[str] = None,
    category: Optional[str] = None,
    max_budget: Optional[float] = None,
    limit: int = 6
):
    activities = load_activities()
    results = []

    for act in activities:
        if city_id and act["city_id"] != city_id:
            continue
        if category and category.lower() != "all" and act["category"].lower() != category.lower():
            continue
        if max_budget is not None and act["cost"] > max_budget:
            continue
        
        results.append(act)

    results.sort(key=lambda x: x["rating"], reverse=True)
    return results[:limit]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("recommender_api:app", host="0.0.0.0", port=8001, reload=True)
