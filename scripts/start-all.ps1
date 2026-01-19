# Script de demarrage complet de AgroDeep
# Demarre Docker Desktop, l'infrastructure et le service auth

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  AgroDeep - Demarrage Complet du Backend" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Etape 1: Verifier Docker Desktop
Write-Host "[1/6] Verification Docker Desktop..." -ForegroundColor Yellow

$dockerRunning = $false
$ErrorActionPreference = "Continue"
$dockerTest = docker ps 2>&1 | Out-String
$ErrorActionPreference = "Stop"

if ($dockerTest -notlike "*cannot find the file*" -and $dockerTest -notlike "*error*") {
    $dockerRunning = $true
    Write-Host "  OK - Docker Desktop est actif" -ForegroundColor Green
} else {
    Write-Host "  AVERTISSEMENT - Docker Desktop n'est pas actif" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Tentative de demarrage de Docker Desktop..." -ForegroundColor Yellow
    
    # Chercher Docker Desktop
    $dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerPath) {
        Start-Process $dockerPath
        Write-Host "  Docker Desktop lance. Attente de demarrage (60s)..." -ForegroundColor Yellow
        
        $timeout = 60
        $elapsed = 0
        while ($elapsed -lt $timeout) {
            Start-Sleep -Seconds 5
            $elapsed += 5
            $ErrorActionPreference = "Continue"
            $testDocker = docker ps 2>&1 | Out-String
            $ErrorActionPreference = "Stop"
            
            if ($testDocker -notlike "*cannot find the file*" -and $testDocker -notlike "*error*") {
                $dockerRunning = $true
                Write-Host "  OK - Docker Desktop est maintenant actif" -ForegroundColor Green
                break
            } else {
                Write-Host "  Attente... ($elapsed/$timeout secondes)" -ForegroundColor Gray
            }
        }
        
        if (-not $dockerRunning) {
            Write-Host ""
            Write-Host "  ERREUR - Docker Desktop n'a pas demarre" -ForegroundColor Red
            Write-Host "  Veuillez lancer Docker Desktop manuellement et reessayer" -ForegroundColor Yellow
            Write-Host ""
            exit 1
        }
    } else {
        Write-Host ""
        Write-Host "  ERREUR - Docker Desktop n'est pas installe" -ForegroundColor Red
        Write-Host "  Installez Docker Desktop depuis: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
}

Write-Host ""

# Etape 2: Nettoyer les conteneurs existants si necessaire
Write-Host "[2/6] Nettoyage des conteneurs obsoletes..." -ForegroundColor Yellow
$oldContainers = docker ps -a --filter "status=exited" --filter "name=agrodeep" -q
if ($oldContainers) {
    docker rm $oldContainers | Out-Null
    Write-Host "  OK - Conteneurs obsoletes supprimes" -ForegroundColor Green
} else {
    Write-Host "  OK - Aucun nettoyage necessaire" -ForegroundColor Green
}

Write-Host ""

# Etape 3: Demarrer l'infrastructure principale
Write-Host "[3/6] Demarrage infrastructure (PostgreSQL, Redis, Kong)..." -ForegroundColor Yellow

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$ErrorActionPreference = "Continue"
docker-compose up -d postgres redis kong 2>&1 | Out-Null
$ErrorActionPreference = "Stop"

# Verifier que les conteneurs sont bien demarres
Start-Sleep -Seconds 3
$postgresRunning = docker ps --filter "name=agrodeep-postgres" --filter "status=running" -q
$redisRunning = docker ps --filter "name=agrodeep-redis" --filter "status=running" -q
$kongRunning = docker ps --filter "name=agrodeep-kong" --filter "status=running" -q

if ($postgresRunning -and $redisRunning -and $kongRunning) {
    Write-Host "  OK - Infrastructure demarree" -ForegroundColor Green
} else {
    Write-Host "  ERREUR - Certains services n'ont pas demarre" -ForegroundColor Red
    docker ps --filter "name=agrodeep"
    exit 1
}

Write-Host ""

# Etape 4: Attendre que les services soient prets
Write-Host "[4/6] Attente initialisation des services (30s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

$postgresReady = docker exec agrodeep-postgres pg_isready -U agrodeep 2>&1
$redisReady = docker exec agrodeep-redis redis-cli --no-auth-warning -a redis_secure_2026 ping 2>&1

if ($postgresReady -like "*accepting connections*") {
    Write-Host "  OK - PostgreSQL pret" -ForegroundColor Green
} else {
    Write-Host "  AVERTISSEMENT - PostgreSQL pas encore pret" -ForegroundColor Yellow
}

if ($redisReady -like "*PONG*") {
    Write-Host "  OK - Redis pret" -ForegroundColor Green
} else {
    Write-Host "  AVERTISSEMENT - Redis pas encore pret" -ForegroundColor Yellow
}

Write-Host ""

# Etape 5: Corriger l'authentification PostgreSQL si necessaire
Write-Host "[5/6] Configuration PostgreSQL..." -ForegroundColor Yellow

$testConnection = docker exec agrodeep-postgres psql -U agrodeep -d agrodeep_auth -c "SELECT 1;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Configuration de l'authentification PostgreSQL..." -ForegroundColor Yellow
    
    # Configurer pg_hba.conf pour accepter les connexions
    docker exec agrodeep-postgres sh -c "cat > /var/lib/postgresql/data/pg_hba.conf << 'EOF'
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    all             all             172.16.0.0/12           trust
host    all             all             10.0.0.0/8              trust
host    all             all             192.168.0.0/16          trust
host    all             all             0.0.0.0/0               md5
EOF
" | Out-Null
    
    docker exec agrodeep-postgres psql -U agrodeep -d agrodeep -c "ALTER USER agrodeep WITH PASSWORD 'agrodeep_secure_2026';" | Out-Null
    docker restart agrodeep-postgres | Out-Null
    Start-Sleep -Seconds 10
    
    Write-Host "  OK - PostgreSQL configure" -ForegroundColor Green
} else {
    Write-Host "  OK - PostgreSQL configure" -ForegroundColor Green
}

Write-Host ""

# Etape 6: Demarrer le service d'authentification
Write-Host "[6/6] Demarrage service d'authentification..." -ForegroundColor Yellow

Set-Location "$projectRoot\services\auth-service"

# Arreter tout processus existant sur le port 3001
$process = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process) {
    Stop-Process -Id $process -Force 2>$null
}

# Demarrer avec Docker
Write-Host "  Lancement avec Docker (reseau agrodeep-network)..." -ForegroundColor Cyan

$env:NODE_ENV = "development"
$env:PORT = "3001"
$env:DB_HOST = "agrodeep-postgres"
$env:DB_PORT = "5432"
$env:DB_NAME = "agrodeep_auth"
$env:DB_USER = "agrodeep"
$env:DB_PASSWORD = "agrodeep_secure_2026"
$env:REDIS_HOST = "agrodeep-redis"
$env:REDIS_PORT = "6379"
$env:REDIS_PASSWORD = "redis_secure_2026"
$env:JWT_ACCESS_SECRET = "dev_jwt_access_secret_change_in_production"
$env:JWT_REFRESH_SECRET = "dev_jwt_refresh_secret_change_in_production"
$env:CORS_ORIGIN = "http://localhost:5173"

# Lancer en arriere-plan
$dockerCmd = @"
docker run --rm -d ``
  --name agrodeep-auth-service-dev ``
  --network agrodeep-network ``
  -p 3001:3001 ``
  -v "${PWD}:/app" ``
  -w /app ``
  -e NODE_ENV=$env:NODE_ENV ``
  -e PORT=$env:PORT ``
  -e DB_HOST=$env:DB_HOST ``
  -e DB_PORT=$env:DB_PORT ``
  -e DB_NAME=$env:DB_NAME ``
  -e DB_USER=$env:DB_USER ``
  -e DB_PASSWORD=$env:DB_PASSWORD ``
  -e REDIS_HOST=$env:REDIS_HOST ``
  -e REDIS_PORT=$env:REDIS_PORT ``
  -e REDIS_PASSWORD=$env:REDIS_PASSWORD ``
  -e JWT_ACCESS_SECRET=$env:JWT_ACCESS_SECRET ``
  -e JWT_REFRESH_SECRET=$env:JWT_REFRESH_SECRET ``
  -e CORS_ORIGIN=$env:CORS_ORIGIN ``
  node:20-alpine sh -c "npm install && npm run dev"
"@

Invoke-Expression $dockerCmd | Out-Null

Write-Host "  Attente demarrage du service (20s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Demarrage termine!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services actifs:" -ForegroundColor Cyan
Write-Host "  - PostgreSQL:  localhost:5432" -ForegroundColor White
Write-Host "  - Redis:       localhost:6379" -ForegroundColor White
Write-Host "  - Kong:        localhost:8000" -ForegroundColor White
Write-Host "  - Auth Service: localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Verification de l'etat:" -ForegroundColor Cyan
docker ps --filter "name=agrodeep" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
Write-Host ""
Write-Host "Pour voir les logs du service auth:" -ForegroundColor Yellow
Write-Host "  docker logs -f agrodeep-auth-service-dev" -ForegroundColor White
Write-Host ""
Write-Host "Pour arreter tous les services:" -ForegroundColor Yellow
Write-Host "  docker-compose down && docker stop agrodeep-auth-service-dev" -ForegroundColor White
Write-Host ""
