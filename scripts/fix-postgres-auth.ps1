# Script de correction de l'authentification PostgreSQL
# Resout le probleme "password authentication failed"

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Fix PostgreSQL Authentication" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Verification que PostgreSQL est actif..." -ForegroundColor Yellow
$postgresRunning = docker ps --filter "name=agrodeep-postgres" --filter "status=running" -q

if (!$postgresRunning) {
    Write-Host "  ERREUR - PostgreSQL n'est pas demarre" -ForegroundColor Red
    Write-Host "  Lancez: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}
Write-Host "  OK - PostgreSQL actif" -ForegroundColor Green
Write-Host ""

Write-Host "[2/4] Reinitialisation du mot de passe..." -ForegroundColor Yellow
try {
    docker exec agrodeep-postgres psql -U agrodeep -d agrodeep -c "ALTER USER agrodeep WITH PASSWORD 'agrodeep_secure_2026';" | Out-Null
    Write-Host "  OK - Mot de passe reinitialise" -ForegroundColor Green
} catch {
    Write-Host "  ERREUR lors de la reinitialisation du mot de passe" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[3/4] Configuration de pg_hba.conf..." -ForegroundColor Yellow
try {
    docker exec agrodeep-postgres sh -c "sed -i 's/host    all             all             127.0.0.1\/32            trust/host    all             all             127.0.0.1\/32            scram-sha-256/' /var/lib/postgresql/data/pg_hba.conf && sed -i 's/host    all             all             ::1\/128                 trust/host    all             all             ::1\/128                 scram-sha-256/' /var/lib/postgresql/data/pg_hba.conf" | Out-Null
    Write-Host "  OK - pg_hba.conf configure" -ForegroundColor Green
} catch {
    Write-Host "  AVERTISSEMENT - Erreur lors de la modification de pg_hba.conf" -ForegroundColor Yellow
    Write-Host "  Cela peut etre normal si deja configure" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "[4/4] Rechargement de la configuration..." -ForegroundColor Yellow
try {
    $result = docker exec agrodeep-postgres psql -U agrodeep -c "SELECT pg_reload_conf();" | Select-String -Pattern "t"
    if ($result) {
        Write-Host "  OK - Configuration rechargee" -ForegroundColor Green
    }
} catch {
    Write-Host "  ERREUR lors du rechargement de la configuration" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Configuration terminee avec succes!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Vous pouvez maintenant lancer le service auth:" -ForegroundColor Cyan
Write-Host "  cd services\auth-service" -ForegroundColor White
Write-Host "  .\start-dev.ps1" -ForegroundColor White
Write-Host ""
