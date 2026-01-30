# Script de Démarrage "Simple" pour AgriLogistic V3.0 (Monorepo)
# Orchestration moderne avec pnpm et TurboRepo

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  AgriLogistic V3.0 - Démarrage Automatique" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérification des prérequis
Write-Host "[1/4] Vérification de l'environnement..." -ForegroundColor Yellow

# Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  ERREUR: Node.js n'est pas installé." -ForegroundColor Red
    exit 1
}
# pnpm (Required for V3)
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "  ATTENTION: 'pnpm' n'est pas détecté." -ForegroundColor Yellow
    Write-Host "  Installation automatique via npm..." -ForegroundColor Gray
    try {
        npm install -g pnpm
    } catch {
        Write-Host "  ERREUR: Impossible d'installer pnpm. Veuillez l'installer manuellement." -ForegroundColor Red
        exit 1
    }
}
# Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "  ERREUR: Docker Desktop n'est pas installé/détecté." -ForegroundColor Red
    exit 1
}
try {
    docker ps | Out-Null
} catch {
    Write-Host "  ERREUR: Le daemon Docker n'est pas lancé. Démarrez Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "  OK - Environnement Validé (Node, pnpm, Docker)" -ForegroundColor Green

# 2. Emplacement et Dépendances
$scriptPath = $PSScriptRoot
Set-Location $scriptPath

Write-Host ""
Write-Host "[2/4] Installation des dépendances (High Performance)..." -ForegroundColor Yellow
pnpm install
Write-Host "  OK - Node Modules hydratés" -ForegroundColor Green

# 3. Infrastructure
Write-Host ""
Write-Host "[3/4] Démarrage de l'infrastructure Docker..." -ForegroundColor Yellow
# On lance uniquement les services essentiels (Postgres, Redis, Kong)
docker-compose up -d postgres redis kong
Write-Host "  OK - Infrastructure active" -ForegroundColor Green

# 4. Lancement unifié (TurboRepo)
Write-Host ""
Write-Host "[4/4] Lancement de l'écosystème (TurboRepo)..." -ForegroundColor Yellow
Write-Host "  - Frontend : http://localhost:3000" -ForegroundColor Cyan
Write-Host "  - Backend  : Microservices via Turbo" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur 'q' pour quitter proprement le script." -ForegroundColor Gray
Write-Host ""

# Lancement de la commande dev racine qui orchestre tout
pnpm dev
