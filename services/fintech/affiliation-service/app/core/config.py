"""Affiliation Service Configuration"""
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SERVICE_NAME: str = "affiliation-service"
    SERVICE_PORT: int = 5011
    DEBUG: bool = False
    
    DATABASE_URL: str = "postgresql://affiliation:affiliation@localhost:5435/affiliation_db"
    REDIS_URL: str = "redis://localhost:6379/2"
    
    # Commission rates
    DEFAULT_COMMISSION_RATE: float = 8.0  # 8% default
    MAX_COMMISSION_RATE: float = 25.0
    MIN_PAYOUT_AMOUNT: int = 5000  # 5000 XOF minimum
    PAYOUT_DELAY_DAYS: int = 30  # Days before commission is paid
    
    # Attribution
    COOKIE_DURATION_DAYS: int = 30
    ATTRIBUTION_WINDOW_DAYS: int = 90
    
    # Security
    SECRET_KEY: str = "your-secret-key"
    JWT_ALGORITHM: str = "RS256"
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:5173"]
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
