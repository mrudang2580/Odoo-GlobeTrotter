import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.models import City, Activity, User, Trip

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    # Seed a test city if none exists
    if not db.query(City).filter(City.name == "Paris").first():
        city = City(
            id="c-paris-test",
            name="Paris",
            country="France",
            region="Europe",
            cost_index=4,
            popularity_score=98,
            image_url="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
            description="The City of Light."
        )
        db.add(city)
        db.commit()
    db.close()
    yield

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["version"] == "1.0.0"
    assert data["health"] == "healthy"

def test_cities_endpoint():
    response = client.get("/api/v1/cities")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_signup_and_login():
    email = f"test_{int(pytest.importorskip('time').time())}@example.com"
    signup_payload = {
        "name": "Tester Traveler",
        "email": email,
        "password": "SecretPassword123!",
        "city": "Berlin",
        "country": "Germany"
    }
    signup_res = client.post("/api/v1/auth/signup", json=signup_payload)
    assert signup_res.status_code == 200
    assert "access_token" in signup_res.json()

    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": "SecretPassword123!"})
    assert login_res.status_code == 200
    assert login_res.json()["user"]["email"] == email

def test_create_and_get_trip():
    trip_payload = {
        "name": "Summer Mediterranean Tour",
        "description": "Exploration of France and Italy",
        "start_date": "2026-07-01",
        "end_date": "2026-07-15",
        "budget_limit": 3000.0,
        "is_public": True
    }
    create_res = client.post("/api/v1/trips", json=trip_payload)
    assert create_res.status_code == 200
    trip_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/trips/{trip_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Summer Mediterranean Tour"

def test_admin_stats():
    res = client.get("/api/v1/admin/stats")
    assert res.status_code == 200
    data = res.json()
    assert "total_trips" in data
    assert "total_users" in data
