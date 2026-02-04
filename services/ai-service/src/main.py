# OpenTelemetry tracing (à charger avant la création de l'app)
try:
    from . import tracing
except ImportError:
    import tracing

from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import os

app = FastAPI(title="AgroDeep AI Service", version="1.0.0")
tracing.instrument_fastapi(app)

class ModelMetadata(BaseModel):
    id: str
    name: str
    version: str
    status: str
    accuracy: float

@app.get("/")
def read_root():
    return {"status": "AI Service Running", "framework": "FastAPI"}

@app.get("/models")
def get_models():
    return [
        {"id": "yield-pred", "name": "Yield Predictor", "version": "v2.4.1", "status": "PRODUCTION"},
        {"id": "price-pred", "name": "Price Forecasting", "version": "v1.8.3", "status": "PRODUCTION"},
        {"id": "quality-cv", "name": "Quality Computer Vision", "version": "v3.0.0", "status": "STAGING"},
    ]

@app.get("/predict/yield")
def predict_yield(hectares: float, crop: str, region: str):
    # Mock prediction logic
    return {
        "prediction_tonnes": 45.2,
        "confidence": 0.94,
        "shap_values": {"humidity": 0.4, "temp": 0.3}
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
