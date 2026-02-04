# Productions Backend - Implémentation

**Date :** 1er Février 2025  
**Services :** production-service (Node), yield-prediction-service (Python)

---

## 1. Production Service (Node/Express)

### Emplacement
`services/logistics/production-service/`

### Endpoints

| Méthode | Path | Description |
|---------|------|-------------|
| GET | `/productions` | Liste productions (filtres: crop, region, calendar) |
| GET | `/productions/:id` | Détail production + télémétrie + alertes + weatherForecast |
| PATCH | `/productions/:id/stage` | Mise à jour statut → **auto-publish Marketplace si Récolte** |
| POST | `/productions/:id/telemetry` | Envoi point télémétrie |
| POST | `/irrigation/:productionId/activate-valve` | Commande activation vanne irrigation |
| POST | `/irrigation/:productionId/deactivate-valve` | Commande désactivation vanne |

### Base de données (PostgreSQL productions_db)
- **productions** : id, parcel_*, farmer_*, crop_type, region, stage, health_score, moisture_level, quality_prediction, estimated_tonnage, location_lat/lng
- **production_telemetry** : production_id, time, temp, humidity, light (TimescaleDB-compatible)
- **production_alerts** : production_id, type, severity, message
- **irrigation_events** : production_id, valve_id, action (activate/deactivate)

### API Météo
- Variable : `OPENWEATHERMAP_API_KEY`
- Si non définie : fallback qualité A par défaut
- Prédiction qualité fin de cycle : A/B/C selon temp + humidité

### Auto-publication Marketplace
- Lors du PATCH stage → "Récolte", appel `POST /api/v1/products` (product-service)
- Payload : nom, description, catégorie, metadata (productionId, farmerName, etc.)

---

## 2. Yield Prediction Service (Python/FastAPI)

### Emplacement
`services/intelligence/yield-prediction-service/`

### Endpoints

| Méthode | Path | Description |
|---------|------|-------------|
| GET | `/health` | Health check |
| POST | `/predict/{production_id}` | Prédiction qualité + rendement (T/ha) + jours optimaux récolte |

### Body `/predict`
```json
[
  { "temp": 28.5, "humidity": 65, "light": 900 },
  ...
]
```

### Réponse
```json
{
  "quality_score": "A",
  "estimated_yield_ton_per_ha": 1.85,
  "optimal_harvest_days": 5,
  "confidence": 0.88
}
```

---

## 3. Docker & Kong

### Services Docker
- **production-service** : port 3018, DATABASE_URL=...productions_db
- **yield-prediction-service** : port 5020

### Kong Routes
- `/api/v1/productions` → production-service:3018
- `/api/v1/irrigation` → production-service:3018
- `/api/v1/yield-prediction` → yield-prediction-service:5020

### PostgreSQL
- Base `productions_db` créée via init-multiple-dbs.sh
- Schéma appliqué via `scripts/zz_productions_schema.sql`

---

## 4. Frontend (lib/api/productions.ts)

- `getProductions(params)` : liste filtrée
- `getProductionById(id)` : détail + weather
- `updateProductionStage(id, stage)` : mise à jour + auto-publish si Récolte
- `activateValve(productionId)` : commande irrigation
- `deactivateValve(productionId)`

### Variables d'environnement
- `NEXT_PUBLIC_PRODUCTIONS_API_URL` : URL API (défaut: Kong /api/v1)
- `OPENWEATHERMAP_API_KEY` : côté backend production-service
