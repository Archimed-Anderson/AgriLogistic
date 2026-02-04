# Incident Service (War Room)

Service backend pour le War Room - API incidents, Kafka, Redis Pub/Sub, Socket.io.

## Stack

- **Express** - API REST
- **PostgreSQL** - Persistance incidents (table `incidents` dans AgriLogistic_orders)
- **Kafka** - Topic `incident-events` (producteur + consommateur)
- **Redis Pub/Sub** - Diffusion temps réel (< 2s)
- **Socket.io** - Namespace `/war-room` pour le frontend

## Endpoints

| Méthode | Path | Description |
|---------|------|-------------|
| GET | /api/v1/incidents | Liste des incidents actifs |
| POST | /api/v1/incidents | Créer un incident (→ Kafka + Redis) |
| PATCH | /api/v1/incidents/:id/resolve | Résoudre un incident |

## WebSocket (Socket.io)

- **URL**: `http://localhost:3015/war-room`
- **Events reçus**: `incident:new`, `incident:update`, `metrics:update`
- **Event envoyé**: `join` (pour rejoindre la room)

## Variables d'environnement

Voir `.env.example`

## Démarrage

```bash
# Depuis la racine
pnpm install
cd services/intelligence/incident-service
pnpm dev

# Ou via Docker
docker-compose up incident-service
```

## Flow

1. **POST /incidents** → Insert DB → Produce Kafka `incident-events` → Publish Redis `war-room:incidents`
2. **Kafka consumer** reçoit `incident-events` → Publish Redis `war-room:incidents`
3. **Redis subscriber** reçoit message → Broadcast Socket.io `incident:new` / `incident:update`
4. **Métriques** émises toutes les 30s → Redis `war-room:metrics` → Socket.io `metrics:update`
