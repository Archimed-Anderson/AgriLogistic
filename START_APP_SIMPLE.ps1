# =============================================================================
# Script de Démarrage "Simple" pour AgriLogistic V3.0 (Monorepo)
# =============================================================================
# Orchestration : prérequis, dépendances pnpm, infrastructure Docker complète,
# configuration base de données (Prisma) puis lancement TurboRepo.
#
# Services démarrés (Docker - compose principal) :
#   - Bases : postgres, redis, mongodb, minio, elasticsearch, clickhouse
#   - API Gateway : kong-database, kong-migrations, kong
#   - Message queue : zookeeper, kafka
#   - Observabilité : prometheus, grafana (sauf si AGRI_START_MONITORING=1)
#
# Stacks optionnelles (variables d'environnement) :
#   AGRI_START_MONITORING=1  → Stack monitoring (Prometheus, Grafana, Alertmanager, Loki, Tempo, cAdvisor)
#   AGRI_START_SUPERSET=1    → Apache Superset (BI, http://localhost:8088)
#   AGRI_START_FULL=1        → Monitoring + Superset
#   AGRI_START_KONG_INFRA=1  → Kong dédié (infrastructure/docker-compose.kong.yml)
#
# Application : pnpm dev (frontend + microservices via TurboRepo)
# NOUVEAU : Authentification via Better Auth + Prisma (Postgres : 5435)
# =============================================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  AgriLogistic V3.0 - Démarrage Automatique" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# -----------------------------------------------------------------------------
# [1/6] Vérification des prérequis
# -----------------------------------------------------------------------------
Write-Host "[1/6] Vérification de l'environnement..." -ForegroundColor Yellow

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  ERREUR: Node.js n'est pas installé." -ForegroundColor Red
    exit 1
}
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "  ATTENTION: 'pnpm' n'est pas détecté." -ForegroundColor Yellow
    Write-Host "  Installation automatique via npm..." -ForegroundColor Gray
    try {
        npm install -g pnpm
    }
    catch {
        Write-Host "  ERREUR: Impossible d'installer pnpm. Veuillez l'installer manuellement." -ForegroundColor Red
        exit 1
    }
}
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "  ERREUR: Docker Desktop n'est pas installé/détecté." -ForegroundColor Red
    exit 1
}
try {
    docker ps | Out-Null
}
catch {
    Write-Host "  ERREUR: Le daemon Docker n'est pas lancé. Démarrez Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "  OK - Environnement validé (Node, pnpm, Docker)" -ForegroundColor Green

# -----------------------------------------------------------------------------
# [2/6] Emplacement et dépendances
# -----------------------------------------------------------------------------
$scriptPath = $PSScriptRoot
Set-Location $scriptPath

Write-Host ""
Write-Host "[2/6] Installation des dépendances (pnpm)..." -ForegroundColor Yellow
pnpm install
Write-Host "  OK - Node modules hydratés" -ForegroundColor Green

# -----------------------------------------------------------------------------
# [3/6] Infrastructure Docker - Compose principal
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "[3/6] Démarrage de l'infrastructure Docker (compose principal)..." -ForegroundColor Yellow

# Services essentiels : bases de données + API Gateway (ordre respecté par depends_on)
$coreServices = @(
    "postgres",
    "redis",
    "mongodb",
    "minio",
    "elasticsearch",
    "clickhouse",
    "kong-database",
    "kong-migrations",
    "kong"
)
docker-compose up -d $coreServices 2>&1 | Out-Null
Write-Host "  OK - Core : Postgres, Redis, MongoDB, MinIO, Elasticsearch, ClickHouse, Kong" -ForegroundColor Green

# Attente Kong prêt (migrations + gateway)
Write-Host "  Attente de la stabilisation (8s)..." -ForegroundColor Gray
Start-Sleep -Seconds 8

# Message queue (Kafka) + observabilité de base (Prometheus/Grafana du compose principal)
$extraServices = @("zookeeper", "kafka")
if ($env:AGRI_START_MONITORING -ne "1" -and $env:AGRI_START_FULL -ne "1") {
    $extraServices += "prometheus", "grafana"
}
docker-compose up -d $extraServices 2>&1 | Out-Null
Write-Host "  OK - Kafka (Zookeeper + broker)" -NoNewline -ForegroundColor Green
if ($extraServices -contains "prometheus") {
    Write-Host ", Prometheus, Grafana" -ForegroundColor Green
}
else {
    Write-Host " (Prometheus/Grafana via stack Monitoring en [5/6])" -ForegroundColor Green
}

# -----------------------------------------------------------------------------
# [4/6] Initialisation Base de Données (Prisma / Better Auth)
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "[4/6] Initialisation de la base de données (Prisma)..." -ForegroundColor Yellow

$webAppPath = Join-Path $scriptPath "apps\web-app"
if (Test-Path $webAppPath) {
    Push-Location $webAppPath
    
    # Check .env existence check could be here, but usually generated/managed
    
    Write-Host "  Synchronisation du schéma (npx prisma db push)..." -ForegroundColor Cyan
    try {
        # On utilise cmd /c pour s'assurer que npx est bien résolu sur Windows
        cmd /c "npx prisma db push" 2>&1 | Write-Host -ForegroundColor Gray
        Write-Host "  OK - Base de données synchronisée (Port 5435)." -ForegroundColor Green
    }
    catch {
        Write-Host "  ATTENTION: Erreur lors de la synchro Prisma. Vérifiez les logs ci-dessus." -ForegroundColor Red
    }
    
    Pop-Location
}
else {
    Write-Host "  ERREUR: Dossier apps/web-app introuvable." -ForegroundColor Red
}

# -----------------------------------------------------------------------------
# [5/6] Stacks optionnelles (infrastructure/)
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "[5/6] Stacks optionnelles (Kong dédié, Monitoring, Superset)..." -ForegroundColor Yellow

$infraPath = Join-Path $scriptPath "infrastructure"
$runOptional = $env:AGRI_START_FULL -eq "1" -or $env:AGRI_START_SUPERSET -eq "1" -or $env:AGRI_START_MONITORING -eq "1"

# Monitoring technique (Prometheus, Grafana, Alertmanager, Loki, Tempo, Node Exporter, cAdvisor)
if ($env:AGRI_START_MONITORING -eq "1" -or $env:AGRI_START_FULL -eq "1") {
    if (Test-Path (Join-Path $infraPath "docker-compose.monitoring.yml")) {
        Push-Location $infraPath
        docker compose -f docker-compose.monitoring.yml up -d 2>&1 | Out-Null
        Pop-Location
        Write-Host "  OK - Stack Monitoring (Prometheus, Grafana, Alertmanager, Loki, Tempo, cAdvisor)" -ForegroundColor Green
    }
}
# Superset (BI / monitoring métier)
if ($env:AGRI_START_SUPERSET -eq "1" -or $env:AGRI_START_FULL -eq "1") {
    if (Test-Path (Join-Path $infraPath "docker-compose.superset.yml")) {
        Push-Location $infraPath
        docker compose -f docker-compose.superset.yml up -d 2>&1 | Out-Null
        Pop-Location
        Write-Host "  OK - Apache Superset (http://localhost:8088, admin/admin)" -ForegroundColor Green
    }
}
# Kong dédié (infrastructure) : généralement le compose principal suffit
if ($env:AGRI_START_KONG_INFRA -eq "1") {
    if (Test-Path (Join-Path $infraPath "docker-compose.kong.yml")) {
        Push-Location $infraPath
        docker compose -f docker-compose.kong.yml up -d 2>&1 | Out-Null
        Pop-Location
        Write-Host "  OK - Kong (stack infrastructure)" -ForegroundColor Green
    }
}

if (-not $runOptional) {
    Write-Host "  (Optionnel) Pour démarrer Monitoring : AGRI_START_MONITORING=1 ; Superset : AGRI_START_SUPERSET=1 ; tout : AGRI_START_FULL=1" -ForegroundColor Gray
}

# -----------------------------------------------------------------------------
# [6/6] Lancement TurboRepo (frontend + microservices)
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "[6/6] Lancement de l'écosystème (TurboRepo)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  URLs principales :" -ForegroundColor Cyan
Write-Host "    - Frontend    : http://localhost:3000" -ForegroundColor White
Write-Host "    - Auth/API    : http://localhost:3000/api/auth" -ForegroundColor White
Write-Host "    - API Gateway : http://localhost:8000 (Kong)" -ForegroundColor White
Write-Host "    - Kong Admin  : http://localhost:8001" -ForegroundColor White
Write-Host "    - Grafana     : http://localhost:4001 (admin / GRAFANA_PASSWORD)" -ForegroundColor White
Write-Host "    - Prometheus  : http://localhost:9090" -ForegroundColor White
Write-Host ""
Write-Host "  Appuyez sur Ctrl+C pour quitter proprement." -ForegroundColor Gray
Write-Host ""

# Lancement de la commande dev racine qui orchestre tout
pnpm dev
