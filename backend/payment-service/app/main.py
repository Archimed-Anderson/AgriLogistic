"""
FastAPI Main Application - Payment Service
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import structlog
import uvicorn

from app.core.config import settings
from app.api.v1.endpoints import stripe, paypal, wallet, webhooks

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("payment_service_starting", 
               service=settings.SERVICE_NAME,
               port=settings.SERVICE_PORT)
    yield
    # Shutdown
    logger.info("payment_service_shutting_down")


# Create FastAPI app
app = FastAPI(
    title="AgroLogistic Payment Service",
    description="Multi-provider payment system with Stripe, PayPal, Wallet, and Escrow",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", 
                path=request.url.path,
                method=request.method,
                error=str(exc))
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


# Include routers
app.include_router(stripe.router, prefix="/api/v1/payments/stripe", tags=["Stripe"])
app.include_router(paypal.router, prefix="/api/v1/payments/paypal", tags=["PayPal"])
app.include_router(wallet.router, prefix="/api/v1/wallet", tags=["Wallet"])
app.include_router(webhooks.router, prefix="/api/v1/webhooks", tags=["Webhooks"])


# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "version": "1.0.0"
    }


# Root endpoint
@app.get("/")
async def root():
    return {
        "service": "AgroLogistic Payment Service",
        "version": "1.0.0",
        "docs": "/docs" if settings.DEBUG else "Disabled in production"
    }


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.SERVICE_PORT,
        reload=settings.DEBUG
    )
