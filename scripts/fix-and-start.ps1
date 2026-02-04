# Script de correction et demarrage complet
# Corrige les problemes Docker et lance tous les services

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  AgriLogistic - Correction et Demarrage Backend" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Etape 1: Demarrer Docker Desktop
Write-Host "[1/6] Verification et demarrage de Docker Desktop..." -ForegroundColor Yellow

$dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (!(Test-Path $dockerPath)) {
    Write-Host "  ERREUR - Docker Desktop n'est pas installe" -ForegroundColor Red
    Write-Host "  Installez Docker Desktop depuis: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Verifier si Docker est actif
$dockerTest = docker ps 2>&1 | Out-String
if ($dockerTest -like "*cannot find the file*") {
    Write-Host "  Docker Desktop n'est pas actif. Demarrage..." -ForegroundColor Yellow
    Start-Process $dockerPath
    
    Write-Host "  Attente du demarrage de Docker Desktop (jusqu'a 60s)..." -ForegroundColor Yellow
    $timeout = 60
    $elapsed = 0
    $dockerReady = $false
    
    while ($elapsed -lt $timeout) {
        Start-Sleep -Seconds 5
        $elapsed += 5
        
        $testDocker = docker ps 2>&1 | Out-String
        if ($testDocker -notlike "*cannot find the file*" -and $testDocker -notlike "*error*") {
            $dockerReady = $true
            Write-Host "  OK - Docker Desktop est actif" -ForegroundColor Green
            break
        }
        Write-Host "  Attente... ($elapsed/$timeout secondes)" -ForegroundColor Gray
    }
    
    if (!$dockerReady) {
        Write-Host ""
        Write-Host "  ERREUR - Docker Desktop n'a pas demarre" -ForegroundColor Red
        Write-Host "  Veuillez:" -ForegroundColor Yellow
        Write-Host "    1. Lancer Docker Desktop manuellement" -ForegroundColor Yellow
        Write-Host "    2. Attendre que l'icone soit verte" -ForegroundColor Yellow
        Write-Host "    3. Relancer ce script" -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
} else {
    Write-Host "  OK - Docker Desktop est actif" -ForegroundColor Green
}

Write-Host ""

# Etape 2: Nettoyer les conteneurs arretes
Write-Host "[2/6] Nettoyage des conteneurs obsoletes..." -ForegroundColor Yellow
$oldContainers = docker ps -a --filter "status=exited" --filter "name=AgriLogistic" -q 2>$null
if ($oldContainers) {
    docker rm $oldContainers 2>&1 | Out-Null
    Write-Host "  OK - Conteneurs obsoletes supprimes" -ForegroundColor Green
} else {
    Write-Host "  OK - Aucun nettoyage necessaire" -ForegroundColor Green
}

Write-Host ""

# Etape 3: Demarrer les services principaux
Write-Host "[3/6] Demarrage des services (PostgreSQL, Redis, Kong)..." -ForegroundColor Yellow

# RÃ©soudre le chemin de faÃ§on portable (script dans AgriLogistic\scripts)
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $projectRoot

Write-Host "  Lancement de docker-compose..." -ForegroundColor Cyan
docker-compose up -d postgres redis kong 2>&1 | Out-Null

# Attendre un peu
Start-Sleep -Seconds 5

# Verifier
$postgresRunning = docker ps --filter "name=AgriLogistic-postgres" --filter "status=running" -q
$redisRunning = docker ps --filter "name=AgriLogistic-redis" --filter "status=running" -q
$kongRunning = docker ps --filter "name=AgriLogistic-kong" --filter "status=running" -q

if ($postgresRunning) {
    Write-Host "  OK - PostgreSQL demarre" -ForegroundColor Green
} else {
    Write-Host "  ATTENTION - PostgreSQL non demarre" -ForegroundColor Yellow
}

if ($redisRunning) {
    Write-Host "  OK - Redis demarre" -ForegroundColor Green
} else {
    Write-Host "  ATTENTION - Redis non demarre" -ForegroundColor Yellow
}

if ($kongRunning) {
    Write-Host "  OK - Kong demarre" -ForegroundColor Green
} else {
    Write-Host "  ATTENTION - Kong non demarre" -ForegroundColor Yellow
}

Write-Host ""

# Etape 4: Creer les bases manquantes (productions_db, etc.)
Write-Host "[4/6] Creation des bases PostgreSQL manquantes..." -ForegroundColor Yellow
& (Join-Path $PSScriptRoot "ensure-databases.ps1")
if ($LASTEXITCODE -ne 0) { $LASTEXITCODE = 0 }

# Etape 5: Attendre l'initialisation
Write-Host "[5/6] Attente initialisation des services (30s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verifier la sante
$postgresReady = docker exec AgriLogistic-postgres pg_isready -U AgriLogistic 2>&1 | Out-String
$redisReady = docker exec AgriLogistic-redis redis-cli --no-auth-warning -a redis_secure_2026 ping 2>&1 | Out-String

if ($postgresReady -like "*accepting connections*") {
    Write-Host "  OK - PostgreSQL pret" -ForegroundColor Green
} else {
    Write-Host "  ATTENTION - PostgreSQL pas encore pret" -ForegroundColor Yellow
}

if ($redisReady -like "*PONG*") {
    Write-Host "  OK - Redis pret" -ForegroundColor Green
} else {
    Write-Host "  ATTENTION - Redis pas encore pret" -ForegroundColor Yellow
}

Write-Host ""

# Etape 6: Verifier PostgreSQL (SANS abaisser la securite)
Write-Host "[6/6] Verification PostgreSQL..." -ForegroundColor Yellow

$testConnection = docker exec AgriLogistic-postgres psql -U AgriLogistic -d AgriLogistic_auth -c "SELECT 1;" 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK - Connexion PostgreSQL OK (AgriLogistic_auth)" -ForegroundColor Green
} else {
    Write-Host "  ATTENTION - Connexion PostgreSQL Ã©chouÃ©e" -ForegroundColor Yellow
    Write-Host "  DÃ©tails: $testConnection" -ForegroundColor Gray
    Write-Host "  Conseil: vÃ©rifiez DB_PASSWORD/POSTGRES_PASSWORD et relancez: docker-compose down && docker-compose up -d postgres" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Configuration terminee!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Etat des services:" -ForegroundColor Cyan
docker ps --filter "name=AgriLogistic" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>$null
Write-Host ""
Write-Host "Services disponibles:" -ForegroundColor Cyan
$postgresPort = if ($env:POSTGRES_PORT) { $env:POSTGRES_PORT } else { "5433" }
Write-Host "  - PostgreSQL:  localhost:$postgresPort" -ForegroundColor White
Write-Host "  - Redis:       localhost:6379" -ForegroundColor White
Write-Host "  - Kong:        localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Prochaine etape:" -ForegroundColor Yellow
Write-Host "  cd services" -ForegroundColor White
Write-Host "  .\start-dev.ps1" -ForegroundColor White
Write-Host "  (ou: cd services\identity\auth-service-legacy puis .\start-dev.ps1)" -ForegroundColor Gray
Write-Host ""
Write-Host "Ou utilisez le script complet:" -ForegroundColor Yellow
Write-Host "  .\scripts\start-all.ps1" -ForegroundColor White
Write-Host ""

