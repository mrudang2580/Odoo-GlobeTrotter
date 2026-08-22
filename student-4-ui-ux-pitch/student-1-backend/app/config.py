import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GlobeTrotter API"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "hackathon-globetrotter-super-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./globetrotter.db")

    class Config:
        case_sensitive = True

settings = Settings()
