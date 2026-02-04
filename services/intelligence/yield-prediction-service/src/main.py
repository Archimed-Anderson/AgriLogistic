"""
Yield Prediction Service - Prédictions IA pour productions agricoles
Met à jour les estimations quotidiennes (qualité, rendement, date optimale récolte)
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="Yield Prediction Service", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])


class TelemetryInput(BaseModel):
    temp: float
    humidity: float
    light: float


class PredictionResult(BaseModel):
    quality_score: str  # A, B, C
    estimated_yield_ton_per_ha: float
    optimal_harvest_days: int
    confidence: float


@app.get("/health")
def health():
    return {"status": "ok", "service": "yield-prediction"}


@app.post("/predict/{production_id}", response_model=PredictionResult)
def predict_yield(production_id: str, telemetry: list[TelemetryInput] | TelemetryInput):
    """Prédiction qualité et rendement basée sur télémétrie récente (7 derniers jours)"""
    if isinstance(telemetry, TelemetryInput):
        telemetry = [telemetry]
    if not telemetry or len(telemetry) < 1:
        raise HTTPException(400, "At least 1 telemetry point required")

    avg_temp = sum(t.temp for t in telemetry) / len(telemetry)
    avg_humidity = sum(t.humidity for t in telemetry) / len(telemetry)
    avg_light = sum(t.light for t in telemetry) / len(telemetry)

    # Modèle simplifié (remplacer par ML réel : XGBoost, LSTM...)
    score = 70
    if 25 <= avg_temp <= 32 and 50 <= avg_humidity <= 75:
        score += 15
    if avg_light >= 800:
        score += 10
    if avg_humidity < 30:
        score -= 20

    score = max(0, min(100, score))
    quality = "A" if score >= 80 else "B" if score >= 60 else "C"
    yield_ha = 0.5 + (score / 100) * 1.5 + random.uniform(-0.1, 0.1)
    optimal_days = max(1, int(30 - score / 4 + random.uniform(-3, 3)))
    confidence = 0.7 + random.uniform(0, 0.2)

    return PredictionResult(
        quality_score=quality,
        estimated_yield_ton_per_ha=round(yield_ha, 2),
        optimal_harvest_days=optimal_days,
        confidence=round(confidence, 2),
    )
