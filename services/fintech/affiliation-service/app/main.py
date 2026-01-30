"""FastAPI Main Application - Affiliation Service"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog

from app.core.config import settings
from app.api.v1.endpoints import affiliates

structlog.configure(processors=[
    structlog.processors.JSONRenderer()
])
logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("affiliation_service_starting", port=settings.SERVICE_PORT)
    yield
    logger.info("affiliation_service_stopping")


app = FastAPI(
    title="AgroLogistic Affiliation Service",
    description="Referral tracking, commission calculation, and payouts",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(affiliates.router, prefix="/api/v1/affiliates", tags=["Affiliates"])


@app.get("/health")
async def health():
    return {"status": "healthy", "service": settings.SERVICE_NAME}


@app.get("/")
async def root():
    return {"service": "Affiliation Service", "version": "1.0.0"}
