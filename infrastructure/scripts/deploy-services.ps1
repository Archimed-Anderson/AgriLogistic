
# Script to deploy backend microservices
# Usage: .\deploy-services.ps1

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "       AgroLogistic 2.0 - Backend Services Deployment       " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Check Network
$NetworkName = "agrologistic-network"
if (!(docker network ls | Select-String $NetworkName)) {
    Write-Host "Creating Docker network: $NetworkName" -ForegroundColor Yellow
    docker network create $NetworkName
}
else {
    Write-Host "Network $NetworkName exists." -ForegroundColor Green
}

# 2. Deploy Services
# IMPORTANT:
# - The legacy `docker-compose.services.yml` auth-service is now under profile `legacy-auth`.
# - The production-ready OAuth2/OIDC auth stack lives in `backend/auth-service/docker-compose.auth.yml`.

$AuthDir = Resolve-Path (Join-Path $ScriptDir "..\\..\\backend\\auth-service")
Write-Host "Building and Starting OAuth2/OIDC Auth Stack..." -ForegroundColor Yellow

Push-Location $AuthDir

# Generate ephemeral dev credentials (do NOT commit)
$AuthPgPassword = ([guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N'))
$OAuthSessionSecret = ([guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N'))
$FirstPartySecret = ([guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N'))

$env:AUTH_PG_PASSWORD = $AuthPgPassword
$env:AUTH_PG_USER = "auth"
$env:AUTH_PG_DATABASE = "agrologistic_auth"
$env:DATABASE_URL = "postgresql+asyncpg://auth:$AuthPgPassword@auth-postgres:5432/agrologistic_auth"
$env:REDIS_URL = "redis://auth-redis:6379/0"
$env:OAUTH_SESSION_SECRET = $OAuthSessionSecret
$env:FIRST_PARTY_CLIENT_SECRET = $FirstPartySecret

docker-compose -f .\\docker-compose.auth.yml down -v --remove-orphans
docker-compose -f .\\docker-compose.auth.yml up -d --build

# Apply migrations
docker-compose -f .\\docker-compose.auth.yml run --rm auth-service alembic upgrade head

if ($?) {
    Write-Host "Deployment Successful!" -ForegroundColor Green
    Write-Host "Auth Service logs:" -ForegroundColor Gray
    docker logs --tail 30 agrologistic-auth-service
}
else {
    Write-Host "Deployment Failed!" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Access URLs:" -ForegroundColor White
Write-Host "Auth Service (Direct, localhost only): http://localhost:8005" -ForegroundColor White
Write-Host "Auth Service (via Kong): http://localhost:8000/api/v1/auth" -ForegroundColor White
Write-Host "OIDC Discovery (via Kong): http://localhost:8000/.well-known/openid-configuration" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan
