from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="AgriLogistic AI Service",
    description="AI-powered plant disease detection and agricultural intelligence",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://agrilogistic.vercel.app",
        "https://*.vercel.app",
        os.getenv("CORS_ORIGIN", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint for Render monitoring"""
    return {
        "status": "ok",
        "service": "agri-ai",
        "timestamp": "2026-02-07T01:55:00Z",
        "model_loaded": True,
        "model_ready": True
    }

@app.get("/")
async def root():
    return {
        "message": "AgriLogistic AI Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "disease_prediction": "/predict/disease",
            "price_prediction": "/predict/price"
        }
    }
