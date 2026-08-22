import pytest
from fastapi.testclient import TestClient
from scripts.recommender_api import app

client = TestClient(app)

def test_recommender_health():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert data["cities_count"] > 0

def test_recommend_destinations():
    res = client.get("/recommend/destinations?interests=food,art&max_cost_index=4")
    assert res.status_code == 200
    items = res.json()
    assert isinstance(items, list)
    assert len(items) > 0
    assert "city" in items[0]
    assert "match_score" in items[0]

def test_recommend_activities():
    res = client.get("/recommend/activities?city_id=c1&category=sightseeing")
    assert res.status_code == 200
    activities = res.json()
    assert isinstance(activities, list)
    assert len(activities) > 0
