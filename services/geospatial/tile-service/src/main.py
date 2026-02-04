"""
Digital Twin - Tile Service
Sert les tuiles NDVI/Sentinel-2 depuis COG (MinIO).
TODO: Implémenter lecture COG, calcul NDVI, cache Redis.
"""
from fastapi import FastAPI
from fastapi.responses import Response

app = FastAPI(title="Digital Twin Tile Service", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok", "service": "tile-service"}


@app.get("/tiles/ndvi/{z}/{x}/{y}.png")
async def get_ndvi_tile(z: int, x: int, y: int):
    """
    Retourne une tuile NDVI.
    TODO: Lire COG depuis MinIO, calculer NDVI (B08-B04)/(B08+B04), retourner PNG.
    Actuellement placeholder pour structure.
    """
    # Placeholder: retourne 204 No Content (pas de tuile)
    return Response(status_code=204)
