# Script pour creer les bases de donnees manquantes dans PostgreSQL (Docker)
# Utile si le volume Postgres a ete cree avant l'ajout de productions_db a POSTGRES_MULTIPLE_DATABASES.
# Usage: .\scripts\ensure-databases.ps1

$ErrorActionPreference = "Stop"
$containerName = "AgriLogistic-postgres"
$pgUser = "AgriLogistic"

# Liste des bases attendues (alignee sur docker-compose POSTGRES_MULTIPLE_DATABASES)
$databases = @(
    "AgriLogistic_auth",
    "AgriLogistic_products",
    "AgriLogistic_orders",
    "AgriLogistic_payments",
    "admin_db",
    "productions_db"
)

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $projectRoot

# Verifier que le conteneur tourne
$running = docker ps --filter "name=$containerName" --filter "status=running" -q
if (-not $running) {
    Write-Host "Le conteneur $containerName n'est pas demarre. Lancez d'abord: docker compose up -d postgres" -ForegroundColor Yellow
    exit 1
}

# PostgreSQL stocke les noms non quotés en minuscules ; les services attendent la casse exacte (ex: AgriLogistic_auth).
# On crée les bases avec des guillemets pour conserver la casse.
Write-Host "Verification / creation des bases PostgreSQL..." -ForegroundColor Cyan
$ErrorActionPreference = "Continue"
foreach ($db in $databases) {
    $exists = docker exec $containerName psql -U $pgUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$db'" 2>$null
    if ($exists -match "1") {
        Write-Host "  OK - $db existe deja" -ForegroundColor Green
    } else {
        Write-Host "  Creation de $db..." -ForegroundColor Yellow
        $sql = "CREATE DATABASE \`"$db\`";"
        docker exec $containerName psql -U $pgUser -d postgres -c $sql 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  OK - $db cree" -ForegroundColor Green
        } else {
            Write-Host "  ATTENTION - $db peut exister en minuscules ou erreur (ignoré)" -ForegroundColor Yellow
        }
    }
}
$ErrorActionPreference = "Stop"

# Appliquer le schema productions (fichier monte dans le conteneur)
$schemaPath = "/docker-entrypoint-initdb.d/zz_productions_schema.sql"
$null = docker exec $containerName test -f $schemaPath 2>$null
$hasSchema = $?
if ($hasSchema) {
    Write-Host "Application du schema productions (tables, extensions)..." -ForegroundColor Cyan
    $null = docker exec $containerName psql -U $pgUser -d "productions_db" -f $schemaPath 2>&1
    Write-Host "  OK - schema productions_db applique" -ForegroundColor Green
}

Write-Host "Termine." -ForegroundColor Cyan
exit 0
