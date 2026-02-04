# Demarrage du service Auth en mode dev
# Utilise Docker Compose (postgres, redis, auth-service) depuis la racine du projet.

$ErrorActionPreference = "Stop"
$scriptDir = $PSScriptRoot
$projectRoot = (Resolve-Path (Join-Path $scriptDir "..")).Path

Set-Location $projectRoot

Write-Host "=== Demarrage Auth Service (Docker Compose) ===" -ForegroundColor Cyan
Write-Host "  Racine projet: $projectRoot" -ForegroundColor Gray
Write-Host ""

# [1/4] Demarrer Postgres et Redis (en arriere-plan pour ne pas bloquer le terminal)
Write-Host "[1/4] Demarrage Postgres et Redis..." -ForegroundColor Yellow
$job = Start-Job -ScriptBlock {
    Set-Location $using:projectRoot
    docker compose up -d postgres redis 2>&1
}
$done = Wait-Job $job -Timeout 25
if (-not $done) {
    Stop-Job $job; Remove-Job $job -Force
    Write-Host "  AVERTISSEMENT - Timeout; les conteneurs sont peut-etre deja en cours" -ForegroundColor Yellow
} else {
    Remove-Job $job -Force
}
Start-Sleep -Seconds 2

$postgresRunning = docker ps --filter "name=AgriLogistic-postgres" --filter "status=running" -q
$redisRunning = docker ps --filter "name=AgriLogistic-redis" --filter "status=running" -q
if (!$postgresRunning) { Write-Host "  ERREUR - Postgres non demarre" -ForegroundColor Red; exit 1 }
if (!$redisRunning) { Write-Host "  ERREUR - Redis non demarre" -ForegroundColor Red; exit 1 }
Write-Host "  OK - Postgres et Redis actifs" -ForegroundColor Green
Write-Host ""

# [2/4] Attendre que Postgres soit pret
Write-Host "[2/4] Attente Postgres (sante)..." -ForegroundColor Yellow
$maxWait = 30
$waited = 0
while ($waited -lt $maxWait) {
    $ready = docker exec AgriLogistic-postgres pg_isready -U AgriLogistic 2>&1
    if ($ready -match "accepting") { break }
    Start-Sleep -Seconds 2
    $waited += 2
}
Write-Host "  OK - Postgres pret" -ForegroundColor Green
Write-Host ""

# [3/4] Creer les bases manquantes (AgriLogistic_auth, etc.)
Write-Host "[3/4] Verification / creation des bases PostgreSQL..." -ForegroundColor Yellow
& (Join-Path $projectRoot "scripts\ensure-databases.ps1")
if ($LASTEXITCODE -ne 0) { $LASTEXITCODE = 0 }
Write-Host ""

# [4/4] Lancer le service auth
Write-Host "[4/4] Demarrage Auth Service sur http://localhost:3001 ..." -ForegroundColor Yellow
Write-Host "  (Ctrl+C pour arreter)" -ForegroundColor Gray
Write-Host ""
docker compose up auth-service
