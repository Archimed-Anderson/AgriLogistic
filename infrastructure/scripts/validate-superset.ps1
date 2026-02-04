# =============================================================================
# Validation Monitoring Métier - Apache Superset (Cahier des charges)
# =============================================================================
# Usage: .\infrastructure\scripts\validate-superset.ps1
# Prérequis : stack Superset démarrée (docker compose -f infrastructure/docker-compose.superset.yml up -d)
# =============================================================================
$ErrorActionPreference = "Continue"
$SupersetUrl = "http://localhost:8088"
$FlowerUrl = "http://localhost:5555"

Write-Host "=== Validation Apache Superset (Monitoring Métier) ===" -ForegroundColor Cyan
Write-Host ""

# 1. Health Superset
Write-Host "1. Health Superset (http://localhost:8088/health)..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$SupersetUrl/health" -UseBasicParsing -TimeoutSec 10
    Write-Host "   OK - Superset répond ($($r.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ERREUR ou non démarré : $_" -ForegroundColor Red
    Write-Host "   Lancez : docker compose -f infrastructure/docker-compose.superset.yml up -d" -ForegroundColor Gray
}
Write-Host ""

# 2. Page login
Write-Host "2. Page login (http://localhost:8088/login)..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$SupersetUrl/login" -UseBasicParsing -TimeoutSec 5
    if ($r.Content -match "Superset|Login") {
        Write-Host "   OK - Page login accessible" -ForegroundColor Green
    } else {
        Write-Host "   Réponse reçue ($($r.StatusCode))" -ForegroundColor Green
    }
} catch {
    Write-Host "   Non joignable" -ForegroundColor Gray
}
Write-Host ""

# 3. Flower (Celery)
Write-Host "3. Flower (http://localhost:5555)..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri $FlowerUrl -UseBasicParsing -TimeoutSec 3
    Write-Host "   OK - Flower répond ($($r.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   Non joignable (optionnel)" -ForegroundColor Gray
}
Write-Host ""

# 4. Conteneurs
Write-Host "4. Conteneurs Superset..." -ForegroundColor Yellow
$containers = docker ps -a --filter "name=superset" --format "{{.Names}}: {{.Status}}" 2>$null
if ($containers) {
    $containers | ForEach-Object { Write-Host "   $_" }
} else {
    Write-Host "   Aucun conteneur superset trouvé" -ForegroundColor Gray
}
Write-Host ""

Write-Host "=== Fin validation ===" -ForegroundColor Cyan
Write-Host "Login par défaut : admin / admin" -ForegroundColor Gray
Write-Host "Test SQL (après connexion datasource) : SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '7 days'" -ForegroundColor Gray
