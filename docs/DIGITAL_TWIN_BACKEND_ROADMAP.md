# Digital Twin - Backend & Infrastructure Roadmap

**Date :** 1er Février 2025  
**Statut :** Structure de base définie, à implémenter

---

## 1. TILE SERVER (Python FastAPI)

### Objectif
Servir des tuiles NDVI/Sentinel-2 depuis COG (Cloud Optimized GeoTIFF) stockés dans MinIO.

### Stack proposée
- **FastAPI** : API REST + endpoints tuiles
- **Rasterio** : Lecture COG, calcul NDVI (B08-B04)/(B08+B04)
- **rio-tiler** : Génération tuiles XYZ depuis COG
- **Redis** : Cache tuiles (TTL 24h pour mode offline)

### Structure
```
services/geospatial/
└── tile-service/
    ├── Dockerfile
    ├── requirements.txt
    ├── src/
    │   ├── main.py
    │   ├── config.py          # MinIO, Redis, Sentinel paths
    │   ├── routes/
    │   │   ├── tiles.py       # GET /tiles/ndvi/{z}/{x}/{y}.png
    │   │   └── catalog.py     # GET /catalog/scenes (STAC)
    │   └── services/
    │       ├── cog_reader.py  # Lecture COG MinIO
    │       └── ndvi_processor.py  # Calcul NDVI
    └── .env.example
```

### Endpoints
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/tiles/ndvi/{z}/{x}/{y}.png` | Tuile NDVI |
| GET | `/tiles/sentinel/{band}/{z}/{x}/{y}.png` | Tuile bande brute |
| GET | `/catalog/scenes` | Liste scènes disponibles (bbox, date) |

---

## 2. POSTGIS (Stockage géométries)

### Objectif
Stockage des parcelles agricoles avec requêtes spatiales (intersection, buffer, etc.).

### Schéma
```sql
-- migrations/001_parcels_postgis.sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id VARCHAR(64) NOT NULL,
  crop_type VARCHAR(64),
  area_ha DECIMAL(10,2),
  geometry GEOMETRY(Polygon, 4326),
  ndvi DECIMAL(4,2),
  predicted_yield DECIMAL(6,2),
  status VARCHAR(32),
  last_updated TIMESTAMPTZ
);

CREATE INDEX idx_parcels_geom ON parcels USING GIST (geometry);

CREATE TABLE disease_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center GEOMETRY(Point, 4326),
  radius_m INTEGER,
  severity VARCHAR(32),
  disease_type VARCHAR(64),
  detected_at TIMESTAMPTZ,
  model_version VARCHAR(32)
);
```

### Intégration
- Ajouter `geospatial_db` à `POSTGRES_MULTIPLE_DATABASES`
- Migration dans `scripts/init-multiple-dbs.sh`

---

## 3. COG / MinIO (Stockage images satellite)

### Objectif
Stockage des COG Sentinel-2 (B04, B08) pour calcul NDVI à la volée.

### Structure MinIO
```
bucket: sentinel-cogs
  └── {grid}/{year}/{month}/{scene_id}/
      ├── B04.tif  (Red)
      └── B08.tif  (NIR)
```

### Pipeline ingestion
1. Requête Copernicus Data Space / AWS Open Data
2. Téléchargement COG
3. Upload MinIO
4. Enregistrement metadata PostGIS (ou catalogue STAC)

---

## 4. SERVICE IA (Détection anomalies / maladies)

### Objectif
CNN PyTorch pour segmentation images satellite → détection maladies (Black Pod, Swollen Shoot, etc.).

### Stack
- **Python 3.11** + **FastAPI**
- **PyTorch** + **torchvision** (modèles pré-entraînés ResNet, U-Net)
- **OpenCV** : préprocessing images
- **Redis** : queue jobs (BullMQ côté Node ou Celery)

### Structure (extension ai-service existant)
```
services/intelligence/ai-service/
└── src/
    ├── satellite/
    │   ├── anomaly_detector.py   # Détection anomalies NDVI
    │   ├── disease_classifier.py # CNN classification maladies
    │   └── models/               # Poids modèles (MLflow, S3)
    └── routes/
        └── satellite.py          # POST /analyze/scene
```

### Endpoints
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/analyze/scene` | Analyse image → anomalies, maladies |
| POST | `/analyze/parcel/{id}` | Analyse parcelle spécifique |
| GET | `/health` | Health check |

---

## 5. INTÉGRATION FRONTEND

### Variables d'environnement
```env
# Tuiles NDVI (tile-service)
NEXT_PUBLIC_NDVI_TILE_URL=http://localhost:5006/tiles/ndvi/{z}/{x}/{y}.png

# MapLibre (optionnel)
NEXT_PUBLIC_DIGITAL_TWIN_USE_MAPLIBRE=true
```

### MapLibre - Couche NDVI
```typescript
// Dans GlobalSatelliteMapMapLibre.tsx
const ndviTileUrl = process.env.NEXT_PUBLIC_NDVI_TILE_URL;
{activeLayers.includes('ndvi') && ndviTileUrl && (
  <Source id="ndvi" type="raster" tiles={[ndviTileUrl]}>
    <Layer id="ndvi-layer" type="raster" paint={{ 'raster-opacity': 0.6 }} />
  </Source>
)}
```

---

## 6. ORDRE D'IMPLÉMENTATION

| Phase | Composant | Effort estimé |
|-------|-----------|---------------|
| 1 | PostGIS migration + table parcels | 1-2 j |
| 2 | Tile-service FastAPI (structure + route mock) | 2-3 j |
| 3 | Intégration MinIO + COG Sentinel-2 | 3-5 j |
| 4 | NDVI calculation (rio-tiler) | 2 j |
| 5 | Cache Redis tuiles | 1 j |
| 6 | IA service - anomaly detector | 5-7 j |
| 7 | Pipeline ingestion COG | 3-4 j |

**Total estimé : 17-24 jours**

---

## 7. RESSOURCES OPEN SOURCE

- **Sentinel-2 COG** : AWS Open Data, Copernicus Data Space
- **rio-tiler** : https://github.com/developmentseed/rio-tiler
- **MapLibre GL JS** : https://maplibre.org/
- **PostGIS** : https://postgis.net/
- **MinIO** : https://min.io/
- **PyTorch** : https://pytorch.org/
