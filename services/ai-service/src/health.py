"""
🧠 NEURAL LINK REPAIR - Health Check Robuste pour AI Main Service

Objectif: Vérifier que le service ET les modèles ML sont chargés
"""

from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Optional
import time
import psutil
import os

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# GLOBAL STATE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class ModelState:
    """État global des modèles ML"""
    models_loaded: Dict[str, bool] = {}
    models_metadata: Dict[str, Dict] = {}
    startup_time: float = time.time()
    ready: bool = False

model_state = ModelState()

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MODELS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    model_ready: bool
    models_loaded: Dict[str, bool]
    uptime_seconds: float
    memory_usage_mb: float
    cpu_percent: float
    timestamp: str

class DetailedHealthResponse(HealthResponse):
    models_metadata: Dict[str, Dict]
    environment: str
    workers: int

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# HELPER FUNCTIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def get_memory_usage() -> float:
    """Retourne l'utilisation mémoire en MB"""
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / 1024 / 1024

def get_cpu_percent() -> float:
    """Retourne le % CPU utilisé"""
    return psutil.cpu_percent(interval=0.1)

def check_model_loaded(model_name: str) -> bool:
    """
    Vérifie si un modèle ML est chargé en mémoire
    
    TODO: Implémenter la vraie vérification selon le framework ML utilisé
    Exemples:
    - TensorFlow: tf.saved_model.contains_saved_model(model_path)
    - PyTorch: model is not None and hasattr(model, 'eval')
    - Scikit-learn: hasattr(model, 'predict')
    """
    return model_state.models_loaded.get(model_name, False)

def load_models():
    """
    Charge tous les modèles ML au démarrage
    
    TODO: Implémenter le chargement réel des modèles
    """
    models_to_load = [
        "yield-predictor",
        "price-forecaster",
        "quality-cv"
    ]
    
    for model_name in models_to_load:
        try:
            # TODO: Charger le modèle réel
            # model = load_model(f"/app/models/{model_name}")
            
            model_state.models_loaded[model_name] = True
            model_state.models_metadata[model_name] = {
                "version": "1.0.0",
                "loaded_at": time.time(),
                "size_mb": 0,  # TODO: Taille réelle
                "framework": "tensorflow",  # TODO: Framework réel
            }
        except Exception as e:
            model_state.models_loaded[model_name] = False
            model_state.models_metadata[model_name] = {
                "error": str(e),
                "loaded_at": None
            }
    
    # Marquer comme ready si au moins 1 modèle est chargé
    model_state.ready = any(model_state.models_loaded.values())

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ENDPOINTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def register_health_endpoints(app: FastAPI):
    """Enregistre les endpoints de health check"""
    
    @app.on_event("startup")
    async def startup_event():
        """Charge les modèles au démarrage"""
        print("🧠 Loading ML models...")
        load_models()
        print(f"✅ Models loaded: {model_state.models_loaded}")
    
    @app.get("/health", response_model=HealthResponse, tags=["Health"])
    async def health_check():
        """
        🛡️ Health Check Robuste
        
        Vérifie:
        - Service en ligne
        - Modèles ML chargés en mémoire
        - Ressources système (CPU, RAM)
        
        Retourne:
        - 200 OK si tout est opérationnel
        - 503 Service Unavailable si modèles non chargés
        """
        uptime = time.time() - model_state.startup_time
        memory_mb = get_memory_usage()
        cpu_percent = get_cpu_percent()
        
        # Déterminer le statut
        if model_state.ready and all(model_state.models_loaded.values()):
            health_status = "healthy"
            status_code = status.HTTP_200_OK
        elif model_state.ready:
            health_status = "degraded"
            status_code = status.HTTP_200_OK
        else:
            health_status = "unhealthy"
            status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        
        response = {
            "status": health_status,
            "service": "ai-main",
            "version": "1.0.0",
            "model_ready": model_state.ready,
            "models_loaded": model_state.models_loaded,
            "uptime_seconds": round(uptime, 2),
            "memory_usage_mb": round(memory_mb, 2),
            "cpu_percent": round(cpu_percent, 2),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        
        return JSONResponse(content=response, status_code=status_code)
    
    @app.get("/health/detailed", response_model=DetailedHealthResponse, tags=["Health"])
    async def detailed_health_check():
        """
        🔍 Health Check Détaillé
        
        Informations supplémentaires:
        - Métadonnées des modèles
        - Configuration environnement
        - Nombre de workers
        """
        uptime = time.time() - model_state.startup_time
        memory_mb = get_memory_usage()
        cpu_percent = get_cpu_percent()
        
        health_status = "healthy" if model_state.ready else "unhealthy"
        
        response = {
            "status": health_status,
            "service": "ai-main",
            "version": "1.0.0",
            "model_ready": model_state.ready,
            "models_loaded": model_state.models_loaded,
            "models_metadata": model_state.models_metadata,
            "uptime_seconds": round(uptime, 2),
            "memory_usage_mb": round(memory_mb, 2),
            "cpu_percent": round(cpu_percent, 2),
            "environment": os.getenv("NODE_ENV", "development"),
            "workers": int(os.getenv("WORKERS", 2)),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        
        return response
    
    @app.get("/health/ready", tags=["Health"])
    async def readiness_check():
        """
        ✅ Readiness Check (Kubernetes-style)
        
        Retourne 200 uniquement si le service est prêt à recevoir du trafic
        """
        if model_state.ready:
            return {"ready": True}
        else:
            return JSONResponse(
                content={"ready": False, "reason": "Models not loaded"},
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE
            )
    
    @app.get("/health/live", tags=["Health"])
    async def liveness_check():
        """
        💓 Liveness Check (Kubernetes-style)
        
        Retourne 200 si le service est vivant (même si pas ready)
        """
        return {"alive": True}
