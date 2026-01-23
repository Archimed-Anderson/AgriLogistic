"""
Payment Service Configuration
"""
from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Service Info
    SERVICE_NAME: str = "payment-service"
    SERVICE_PORT: int = 5010
    DEBUG: bool = False
    LOG_LEVEL: str = "info"
    
    # Database
    DATABASE_URL: str = "postgresql://payment:payment@localhost:5434/payment_db"
    REDIS_URL: str = "redis://localhost:6379/1"
    
    # Celery
    CELERY_BROKER_URL: str = "amqp://guest:guest@localhost:5672"
    
    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_CONNECT_CLIENT_ID: str = ""
    
    # PayPal
    PAYPAL_CLIENT_ID: str = ""
    PAYPAL_CLIENT_SECRET: str = ""
    PAYPAL_MODE: str = "sandbox"  # sandbox or live
    PAYPAL_WEBHOOK_ID: str = ""
    
    # Flutterwave (Mobile Money)
    FLW_PUBLIC_KEY: str = ""
    FLW_SECRET_KEY: str = ""
    FLW_ENCRYPTION_KEY: str = ""
    
    # Business Logic
    PLATFORM_FEE_PERCENT: float = 10.0
    ESCROW_AUTO_RELEASE_DAYS: int = 7
    MIN_PAYOUT_AMOUNT: int = 1000  # XOF
    WALLET_MAX_BALANCE: int = 10000000  # 10M XOF
    
    # Security
    SECRET_KEY: str = "your-super-secret-key"
    JWT_ALGORITHM: str = "RS256"
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
