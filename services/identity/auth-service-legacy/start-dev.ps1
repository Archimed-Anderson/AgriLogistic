# Script de demarrage du service auth en mode dev
# Utilise les services Docker existants (Redis, PostgreSQL)

$ErrorActionPreference = "Stop"

Write-Host "=== Demarrage Auth Service (Mode Dev) ===" -ForegroundColor Cyan
Write-Host ""

# Verification que les services sont demarres
Write-Host "[1/5] Verification des services requis..." -ForegroundColor Yellow

$postgresRunning = docker ps --filter "name=AgriLogistic-postgres" --filter "status=running" -q
$redisRunning = docker ps --filter "name=AgriLogistic-redis" --filter "status=running" -q

if (!$postgresRunning) {
    Write-Host "  ERREUR - PostgreSQL n'est pas demarre" -ForegroundColor Red
    Write-Host "  Lancez d'abord: docker-compose up -d (a la racine du projet)" -ForegroundColor Yellow
    exit 1
}
Write-Host "  OK - PostgreSQL actif" -ForegroundColor Green

if (!$redisRunning) {
    Write-Host "  ERREUR - Redis n'est pas demarre" -ForegroundColor Red
    Write-Host "  Lancez d'abord: docker-compose up -d (a la racine du projet)" -ForegroundColor Yellow
    exit 1
}
Write-Host "  OK - Redis actif" -ForegroundColor Green

Write-Host ""

# Test de connexion PostgreSQL
Write-Host "[2/5] Test de connexion PostgreSQL..." -ForegroundColor Yellow
$testConnection = docker exec AgriLogistic-postgres psql -U AgriLogistic -d AgriLogistic_auth -c "SELECT 1;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  AVERTISSEMENT - Erreur de connexion PostgreSQL" -ForegroundColor Yellow
    Write-Host "  Execution du script de fix automatique..." -ForegroundColor Yellow
    
    # Fix automatique
    docker exec AgriLogistic-postgres psql -U AgriLogistic -d AgriLogistic -c "ALTER USER AgriLogistic WITH PASSWORD 'AgriLogistic_secure_2026';" | Out-Null
    docker exec AgriLogistic-postgres sh -c "sed -i 's/host    all             all             127.0.0.1\/32            trust/host    all             all             127.0.0.1\/32            scram-sha-256/' /var/lib/postgresql/data/pg_hba.conf" | Out-Null
    docker exec AgriLogistic-postgres psql -U AgriLogistic -c "SELECT pg_reload_conf();" | Out-Null
    
    Write-Host "  OK - Authentification PostgreSQL corrigee" -ForegroundColor Green
} else {
    Write-Host "  OK - PostgreSQL accessible" -ForegroundColor Green
}

Write-Host ""

# Verification des dependances Node.js
Write-Host "[3/5] Verification des dependances..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "  Installation des dependances..." -ForegroundColor Yellow
    npm install
    Write-Host "  OK - Dependances installees" -ForegroundColor Green
} else {
    Write-Host "  OK - Dependances presentes" -ForegroundColor Green
}

Write-Host ""

# Configuration des variables d'environnement
Write-Host "[3/4] Configuration..." -ForegroundColor Yellow
$env:NODE_ENV = "development"
$env:PORT = "3001"
$env:DB_HOST = "localhost"
$env:DB_PORT = "5432"
$env:DB_NAME = "AgriLogistic_auth"
$env:DB_USER = "AgriLogistic"
$env:DB_PASSWORD = "AgriLogistic_secure_2026"
$env:REDIS_HOST = "AgriLogistic-redis"
$env:REDIS_PORT = "6379"
$env:REDIS_PASSWORD = "redis_secure_2026"
$env:JWT_ACCESS_SECRET = "dev_jwt_access_secret_change_in_production"
$env:JWT_REFRESH_SECRET = "dev_jwt_refresh_secret_change_in_production"
$env:CORS_ORIGIN = "http://localhost:5173"

Write-Host "  Configuration appliquee:" -ForegroundColor Green
Write-Host "    - PostgreSQL: AgriLogistic-postgres:5432 (via reseau Docker)" -ForegroundColor Gray
Write-Host "    - Redis: AgriLogistic-redis:6379 (via reseau Docker)" -ForegroundColor Gray
Write-Host "    - Service: localhost:3001" -ForegroundColor Gray

Write-Host ""

# Demarrage du service avec connexion au reseau Docker
Write-Host "[5/5] Demarrage du service..." -ForegroundColor Yellow
Write-Host "  Note: Le service Node.js doit pouvoir resoudre les noms Docker" -ForegroundColor Yellow
Write-Host "  Si l'erreur persiste, utilisez docker-compose up -d a la place" -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Service Auth demarre sur http://localhost:3001" -ForegroundColor Green
Write-Host "  Connexion via reseau Docker (AgriLogistic-network)" -ForegroundColor Cyan
Write-Host "  Appuyez sur Ctrl+C pour arreter" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Essayer de lancer avec Docker run pour etre dans le meme reseau
Write-Host "  Lancement avec Docker pour beneficier du reseau..." -ForegroundColor Cyan
docker run --rm -it `
  --network AgriLogistic-network `
  -p 3001:3001 `
  -v "${PWD}:/app" `
  -w /app `
  -e NODE_ENV=$env:NODE_ENV `
  -e PORT=$env:PORT `
  -e DB_HOST=$env:DB_HOST `
  -e DB_PORT=$env:DB_PORT `
  -e DB_NAME=$env:DB_NAME `
  -e DB_USER=$env:DB_USER `
  -e DB_PASSWORD=$env:DB_PASSWORD `
  -e REDIS_HOST=$env:REDIS_HOST `
  -e REDIS_PORT=$env:REDIS_PORT `
  -e REDIS_PASSWORD=$env:REDIS_PASSWORD `
  -e JWT_ACCESS_SECRET=$env:JWT_ACCESS_SECRET `
  -e JWT_REFRESH_SECRET=$env:JWT_REFRESH_SECRET `
  -e CORS_ORIGIN=$env:CORS_ORIGIN `
  node:20-alpine sh -c "npm install && npm run dev"

