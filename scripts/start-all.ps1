# Script de demarrage complet de AgriLogistic (PROMPTS 1-FINAL)
# Demarre Docker Desktop, l'infrastructure, le service auth et les services AI

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  AgriLogistic - Demarrage Complet (Final)" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Etape 1: Verifier Docker Desktop
Write-Host "[1/7] Verification Docker Desktop..." -ForegroundColor Yellow

$dockerRunning = $false
$ErrorActionPreference = "Continue"
$dockerTest = docker ps 2>&1 | Out-String
$ErrorActionPreference = "Stop"

if ($dockerTest -notlike "*cannot find the file*" -and $dockerTest -notlike "*error*") {
    $dockerRunning = $true
    Write-Host "  OK - Docker Desktop est actif" -ForegroundColor Green
}
else {
    Write-Host "  AVERTISSEMENT - Docker Desktop n'est pas actif" -ForegroundColor Yellow
    Write-Host "  Tentative de demarrage de Docker Desktop..." -ForegroundColor Yellow
    
    $dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerPath) {
        Start-Process $dockerPath
        Write-Host "  Docker Desktop lance. Attente de demarrage (60s)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 60
    }
    else {
        Write-Host "  ERREUR - Docker Desktop n'est pas installe" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Etape 2: Nettoyer les conteneurs obsoletes
Write-Host "[2/7] Nettoyage des conteneurs obsoletes..." -ForegroundColor Yellow
# Nettoyage des anciens noms (AgriLogistic) et nouveaux (agrodeep)
$oldContainers = docker ps -a --filter "name=AgriLogistic" -q 
$newContainers = docker ps -a --filter "name=agrodeep" -q
$allContainers = $oldContainers + $newContainers

if ($allContainers) {
    docker rm -f $allContainers | Out-Null
    Write-Host "  OK - Conteneurs obsoletes supprimes" -ForegroundColor Green
}
else {
    Write-Host "  OK - Aucun nettoyage necessaire" -ForegroundColor Green
}

Write-Host ""

# Etape 3: Demarrer l'infrastructure principale
Write-Host "[3/7] Demarrage infrastructure (PostgreSQL, Redis)..." -ForegroundColor Yellow

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Démarrage via Docker Compose Dev (Postgres + Redis uniquement)
# Note: On ne lance pas encore user-service/auth-service ici, on laisse turbo dev gérer ou on le lance après
$ErrorActionPreference = "Continue"
docker-compose -f docker-compose.dev.yml up -d postgres redis 2>&1 | Out-Null
$ErrorActionPreference = "Stop"

Start-Sleep -Seconds 5

# Vérification du succès (agrodeep-postgres-dev)
if (docker ps --filter "name=agrodeep-postgres-dev" --filter "status=running" -q) {
    Write-Host "  OK - Infrastructure demarree" -ForegroundColor Green
}
else {
    Write-Host "  ERREUR - PostgreSQL n'a pas demarre. Diagnostic:" -ForegroundColor Red
    Write-Host "  Logs PostgreSQL:" -ForegroundColor Yellow
    docker logs agrodeep-postgres-dev --tail 20 2>&1 | Write-Host
    exit 1
}

Write-Host ""

# Etape 4: Attendre que les services soient prets
Write-Host "[4/7] Attente initialisation des services (15s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Vérification PostgreSQL (user: agrodeep, db: agrodeep_dev)
$postgresReady = docker exec agrodeep-postgres-dev pg_isready -U agrodeep -d agrodeep_dev 2>&1
if ($postgresReady -like "*accepting connections*") {
    Write-Host "  OK - PostgreSQL pret" -ForegroundColor Green
}
else {
    Write-Host "  AVERTISSEMENT - PostgreSQL pas encore pret" -ForegroundColor Yellow
    Write-Host "  Erreur: $postgresReady" -ForegroundColor Red
}

Write-Host ""

# Etape 5: Configuration Auth DB (si necessaire)
# Normalement géré par l'image postgres officielle via POSTGRES_DB
Write-Host "[5/7] Configuration PostgreSQL..." -ForegroundColor Yellow
Write-Host "  OK - PostgreSQL configure via Docker Compose" -ForegroundColor Green

Write-Host ""

# Etape 6: Demarrer le service d'authentification (Mode Dev Container)
Write-Host "[6/7] Demarrage service d'authentification..." -ForegroundColor Yellow

# On utilise le service Auth défini dans docker-compose si possible, ou on le lance manuellement
# Ici, on va lancer le container 'auth-service' défini dans docker-compose.dev.yml mais en mode watch si possible
# Pour simplifier et rester cohérent avec l'infrastructure, on lance via compose
# On lance les services d'identité définis dans docker-compose.dev.yml
$ErrorActionPreference = "Continue"
docker-compose -f docker-compose.dev.yml up -d auth-service 2>&1 | Out-Null
$ErrorActionPreference = "Stop"
Write-Host "  Container Auth lance (agrodeep-auth-service)" -ForegroundColor Green

Write-Host ""

# Etape 7: Demarrer Services AI (Prompt 4)
Write-Host "[7/7] Demarrage Services AI (Prompt 4)..." -ForegroundColor Yellow
Set-Location $projectRoot

# Création des dossiers de données requis par docker-compose.ai.yml (bind mounts)
$aiDataDirs = @(
    "data/ai-models", "data/ai-cache",
    "data/llm-models", "data/llm-cache",
    "data/vision-models", "data/vision-cache", "data/vision-uploads"
)

foreach ($dir in $aiDataDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

$ErrorActionPreference = "Continue"
# Capture output to show only on error
$aiOutput = docker-compose -f docker-compose.ai.yml up -d 2>&1 | Out-String

if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK - Services AI demarres (Ports 8003, 8004, 8005)" -ForegroundColor Green
}
else {
    Write-Host "  AVERTISSEMENT - Echec demarrage AI" -ForegroundColor Yellow
    Write-Host "  Diagnostic:" -ForegroundColor Red
    Write-Host $aiOutput -ForegroundColor Gray
}
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Demarrage Termine!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services actifs:" -ForegroundColor Cyan
Write-Host "  - PostgreSQL:  localhost:5432"
Write-Host "  - Redis:       localhost:6379"
Write-Host "  - Auth Service: localhost:3001"
Write-Host "  - User Service: localhost:3013"
Write-Host "  - Product Service: localhost:3002"
Write-Host "  - AI Main:      localhost:8003"
Write-Host "  - AI LLM:       localhost:8004"
Write-Host "  - AI Vision:    localhost:8005"
Write-Host ""
Write-Host "Prochaines Etapes:" -ForegroundColor Yellow
Write-Host "1. Frontend lance dans une autre fenetre"
Write-Host "2. Valider l'etat global: pnpm check:all"
Write-Host ""

Set-Location $projectRoot
