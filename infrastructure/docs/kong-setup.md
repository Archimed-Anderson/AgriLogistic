# Kong Gateway (RS256) - Setup

## Prérequis

- Docker Desktop + Docker Compose
- OpenSSL (Windows: Git for Windows inclut souvent `openssl`)

## Démarrage (Windows)

```powershell
cd .\AgriLogistic\infrastructure

# 1) Générer les clés RS256 + injecter la clé publique dans kong.yml
.\scripts\generate-jwt-keys.ps1

# 2) Créer un fichier .env.kong à partir de l'exemple
Copy-Item .\env.kong.example .\.env.kong
# puis éditer .\.env.kong pour définir au minimum KONG_PG_PASSWORD

# 3) Démarrer Kong (DB mode)
docker-compose -f docker-compose.kong.yml --env-file .\.env.kong up -d

# 4) Démarrer l'auth-service (FastAPI)
docker-compose -f docker-compose.services.yml up -d

# 5) Test rapide
curl http://localhost:8001/status
curl http://localhost:8000/health
```

## Démarrage (Linux/macOS)

```bash
cd AgriLogistic/infrastructure

chmod +x scripts/generate-jwt-keys.sh
./scripts/generate-jwt-keys.sh

cp env.kong.example .env.kong
# edit .env.kong

docker-compose -f docker-compose.kong.yml --env-file .env.kong up -d
docker-compose -f docker-compose.services.yml up -d
```

## Monitoring / Tracing (optionnels)

```bash
# Monitoring (Prometheus/Grafana)
docker-compose -f docker-compose.kong.yml --profile monitoring up -d

# Tracing (Jaeger)
docker-compose -f docker-compose.kong.yml --profile tracing up -d
```



