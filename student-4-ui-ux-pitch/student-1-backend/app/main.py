from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, trips, stops, budget, search, community, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GlobeTrotter API",
    description="Multi-city travel planning backend supporting auth, itineraries, budgets, discovery & analytics.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(trips.router, prefix="/api/v1")
app.include_router(stops.router, prefix="/api/v1")
app.include_router(budget.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(community.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "message": "Welcome to the GlobeTrotter Backend API",
        "docs_url": "/docs",
        "version": "1.0.0"
    }
