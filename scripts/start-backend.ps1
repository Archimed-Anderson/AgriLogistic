# Script de demarrage des services backend AgriLogistic
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  AgriLogistic Backend Services - Demarrage" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $PSScriptRoot

# Fonction pour verifier si un port est occupe
function Test-PortInUse {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Verification Docker
Write-Host "[1/5] Verification Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "  OK - Docker installe: $dockerVersion" -ForegroundColor Green
}
catch {
    Write-Host "  ERREUR - Docker n'est pas installe ou n'est pas dans PATH" -ForegroundColor Red
    Write-Host "  Installez Docker Desktop depuis: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

try {
    docker ps | Out-Null
    Write-Host "  OK - Docker daemon actif" -ForegroundColor Green
}
catch {
    Write-Host "  ERREUR - Docker daemon n'est pas demarre" -ForegroundColor Red
    Write-Host "  Lancez Docker Desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Demarrage de l'infrastructure principale
Write-Host "[2/5] Demarrage infrastructure (Kong, PostgreSQL, Redis...)..." -ForegroundColor Yellow
Set-Location $projectRoot
try {
    docker-compose up -d
    Write-Host "  OK - Infrastructure demarree" -ForegroundColor Green
}
catch {
    Write-Host "  ERREUR lors du demarrage de l'infrastructure" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""

# Attente que l'infrastructure soit prete
Write-Host "[3/5] Attente initialisation infrastructure (30s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30
Write-Host "  OK - Infrastructure initialisee" -ForegroundColor Green

Write-Host ""

# Demarrage du service d'authentification
Write-Host "[4/5] Demarrage service d'authentification..." -ForegroundColor Yellow
Set-Location "$projectRoot\services\identity\auth-service"

if (Test-Path "docker-compose.yml") {
    try {
        docker-compose up -d
        Write-Host "  OK - Service d'authentification demarre" -ForegroundColor Green
    }
    catch {
        Write-Host "  AVERTISSEMENT - Erreur lors du demarrage" -ForegroundColor Yellow
        Write-Host "  Vous pouvez le demarrer manuellement avec: npm run dev" -ForegroundColor Yellow
    }
}
else {
    Write-Host "  INFO - Pas de docker-compose.yml trouve" -ForegroundColor Yellow
    Write-Host "  Utilisez 'npm run dev' pour demarrer en mode developpement" -ForegroundColor Yellow
}

Write-Host ""

# Verification des services
Write-Host "[5/5] Verification des services..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

$servicesOK = $true

# Check Kong API Gateway
if (Test-PortInUse -Port 8000) {
    Write-Host "  OK - Kong API Gateway (port 8000)" -ForegroundColor Green
}
else {
    Write-Host "  ERREUR - Kong API Gateway non accessible" -ForegroundColor Red
    $servicesOK = $false
}

# Check PostgreSQL
if (Test-PortInUse -Port 5432) {
    Write-Host "  OK - PostgreSQL (port 5432)" -ForegroundColor Green
}
else {
    Write-Host "  AVERTISSEMENT - PostgreSQL non accessible" -ForegroundColor Yellow
}

# Check Redis
if (Test-PortInUse -Port 6379) {
    Write-Host "  OK - Redis (port 6379)" -ForegroundColor Green
}
else {
    Write-Host "  AVERTISSEMENT - Redis non accessible" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan

if ($servicesOK) {
    Write-Host "  Services demarres avec succes!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines etapes:" -ForegroundColor Cyan
    Write-Host "  1. Lancez le frontend: npm run dev" -ForegroundColor White
    Write-Host "  2. Ouvrez: http://localhost:5173" -ForegroundColor White
    Write-Host ""
    Write-Host "Logs des services:" -ForegroundColor Cyan
    Write-Host "  docker-compose logs -f" -ForegroundColor White
}
else {
    Write-Host "  ATTENTION - Certains services ont des problemes" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commandes utiles:" -ForegroundColor Cyan
    Write-Host "  docker-compose ps     # Voir l'etat des services" -ForegroundColor White
    Write-Host "  docker-compose logs   # Voir les logs" -ForegroundColor White
    Write-Host "  docker-compose down   # Arreter les services" -ForegroundColor White
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $projectRoot

