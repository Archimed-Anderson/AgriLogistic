from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid
from services.vision_service import VisionService
from services.weather_service import WeatherService

app = FastAPI(title="Agri-Vision & Weather API")

# Allow CORS for integration with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

vision_service = VisionService(model="llava")
weather_service = WeatherService()

@app.post("/vision/analyze")
async def analyze_plant(
    image: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...)
):
    # 1. Save uploaded image temporarily
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(image.filename)[1]
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_ext}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    try:
        # 2. Run Vision Diagnosis and Weather Fetch in parallel (conceptual)
        diagnosis = await vision_service.diagnose_plant(file_path)
        weather = await weather_service.get_hyperlocal_weather(latitude, longitude)

        # 3. Contextual Risk Assessment
        # Example logic: Humidity > 80% + Fungal suspicion = CRITICAL
        humidity = weather.get("humidity", 0)
        maladie = diagnosis.get("maladie", "").lower()
        gravite = diagnosis.get("gravite", "Moyenne")

        risk_context = "Normal"
        if humidity > 75 and any(kw in maladie for kw in ["mildiou", "rouille", "champignon", "fungus"]):
            risk_context = "RISQUE CRITIQUE (Hygrométrie favorable au pathogène)"
            gravite = "Critique"

        return {
            "status": "success",
            "diagnosis": {
                "maladie": diagnosis.get("maladie"),
                "gravite": gravite,
                "traitement": diagnosis.get("traitement"),
                "analyse_visuelle": diagnosis.get("analyse_visuelle")
            },
            "weather": weather,
            "contextual_risk": risk_context,
            "location": {"lat": latitude, "lon": longitude}
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup image after analysis
        if os.path.exists(file_path):
            os.remove(file_path)

@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "agri-vision",
        "model_ready": True,
        "model_loaded": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3009)
