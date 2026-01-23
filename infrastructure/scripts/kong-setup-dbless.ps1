# ============================================================
# Kong DB-less Setup Script for Windows
# AgroLogistic 2.0 - PowerShell Version
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║   Kong DB-less Setup - AgroLogistic   ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

# 1. Vérifier Docker
Write-Host "[INFO] Vérification Docker..." -ForegroundColor Blue
try {
    $dockerVersion = docker --version
    Write-Host "[SUCCESS] Docker trouvé: $dockerVersion" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Docker n'est pas installé!" -ForegroundColor Red
    exit 1
}

# 2. Créer le réseau Docker
Write-Host "[INFO] Création du réseau Docker..." -ForegroundColor Blue
docker network create agrologistic-network 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Réseau créé" -ForegroundColor Green
}
else {
    Write-Host "[INFO] Réseau déjà existant" -ForegroundColor Yellow
}

# 3. Créer les répertoires
Write-Host "[INFO] Création des répertoires..." -ForegroundColor Blue
New-Item -ItemType Directory -Force -Path "kong\logs" | Out-Null
Write-Host "[SUCCESS] Répertoires créés" -ForegroundColor Green

# 4. Générer des secrets JWT sécurisés
if (-not (Test-Path ".env.kong")) {
    Write-Host "[INFO] Génération des secrets JWT..." -ForegroundColor Blue
    
    function Generate-Secret {
        $bytes = New-Object byte[] 32
        $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
        $rng.GetBytes($bytes)
        return [Convert]::ToBase64String($bytes)
    }
    
    $adminSecret = Generate-Secret
    $farmerSecret = Generate-Secret
    $buyerSecret = Generate-Secret
    $serviceSecret = Generate-Secret
    
    @"
# Generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
ADMIN_JWT_SECRET=$adminSecret
FARMER_JWT_SECRET=$farmerSecret
BUYER_JWT_SECRET=$buyerSecret
SERVICE_JWT_SECRET=$serviceSecret

# Grafana (Optional)
GRAFANA_USER=admin
GRAFANA_PASSWORD=Gr@f@n@_P@ss_Ch@ng3_M3!
"@ | Out-File -FilePath ".env.kong" -Encoding UTF8
    
    Write-Host "[SUCCESS] Secrets générés dans .env.kong" -ForegroundColor Green
}
else {
    Write-Host "[SUCCESS] .env.kong existe déjà" -ForegroundColor Green
}

# 5. Valider kong.yml
Write-Host "[INFO] Validation de kong.yml..." -ForegroundColor Blue
try {
    docker run --rm -v "${PWD}/kong:/kong" kong:3.4 kong config parse /kong/kong.yml 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Configuration valide!" -ForegroundColor Green
    }
    else {
        Write-Host "[ERROR] Erreur dans kong.yml!" -ForegroundColor Red
        docker run --rm -v "${PWD}/kong:/kong" kong:3.4 kong config parse /kong/kong.yml
        exit 1
    }
}
catch {
    Write-Host "[WARNING] Impossible de valider (Docker issue)" -ForegroundColor Yellow
}

# 6. Démarrer Kong
Write-Host "[INFO] Démarrage de Kong..." -ForegroundColor Blue
docker-compose -f docker-compose.kong-dbless.yml up -d

# 7. Attendre que Kong soit prêt
Write-Host "[INFO] Attente de Kong (max 60s)..." -ForegroundColor Blue
$retries = 0
$maxRetries = 60

while ($retries -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8001/status" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host ""
            Write-Host "[SUCCESS] Kong est prêt!" -ForegroundColor Green
            break
        }
    }
    catch {
        # Continue waiting
    }
    
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 1
    $retries++
}

if ($retries -ge $maxRetries) {
    Write-Host ""
    Write-Host "[ERROR] Kong n'a pas démarré dans les temps" -ForegroundColor Red
    Write-Host "[INFO] Vérifiez les logs:" -ForegroundColor Yellow
    Write-Host "  docker logs kong-gateway" -ForegroundColor White
    exit 1
}

# 8. Vérifier la configuration
Write-Host ""
Write-Host "[INFO] Vérification de la configuration..." -ForegroundColor Blue

try {
    $servicesResp = Invoke-WebRequest -Uri "http://localhost:8001/services" -UseBasicParsing
    $services = ($servicesResp.Content | ConvertFrom-Json).data
    $serviceCount = $services.Count
    
    Write-Host "[SUCCESS] $serviceCount services configurés" -ForegroundColor Green
    
    $routesResp = Invoke-WebRequest -Uri "http://localhost:8001/routes" -UseBasicParsing
    $routes = ($routesResp.Content | ConvertFrom-Json).data
    $routeCount = $routes.Count
    
    Write-Host "[SUCCESS] $routeCount routes configurées" -ForegroundColor Green
}
catch {
    Write-Host "[WARNING] Impossible de vérifier la configuration" -ForegroundColor Yellow
}

# 9. Afficher les informations
Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║        🎉 Setup Terminé! 🎉           ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📍 URLs:" -ForegroundColor Blue
Write-Host "   Proxy HTTP:  http://localhost:8000" -ForegroundColor White
Write-Host "   Proxy HTTPS: https://localhost:8443" -ForegroundColor White
Write-Host "   Admin API:   http://localhost:8001" -ForegroundColor White
Write-Host ""

Write-Host "🧪 Tests:" -ForegroundColor Blue
Write-Host "   Health:      curl http://localhost:8001/status" -ForegroundColor White
Write-Host "   Services:    curl http://localhost:8001/services" -ForegroundColor White
Write-Host "   Routes:      curl http://localhost:8001/routes" -ForegroundColor White
Write-Host "   Metrics:     curl http://localhost:8000/metrics" -ForegroundColor White
Write-Host ""

Write-Host "📚 Commandes Management:" -ForegroundColor Blue
Write-Host "   cd kong" -ForegroundColor White
Write-Host "   make validate    - Valider configuration" -ForegroundColor White
Write-Host "   make test        - Tester endpoints" -ForegroundColor White
Write-Host "   make status      - Voir status complet" -ForegroundColor White
Write-Host "   make logs        - Voir logs" -ForegroundColor White
Write-Host ""

Write-Host "🔐 JWT Secrets:" -ForegroundColor Blue
Write-Host "   Voir fichier .env.kong" -ForegroundColor White
Write-Host ""

Write-Host "✨ Prêt pour la Phase 2 (Backend Services)! ✨" -ForegroundColor Green
Write-Host ""

# 10. Test rapide final
Write-Host "📊 Test Rapide Final:" -ForegroundColor Blue
try {
    $statusResp = Invoke-WebRequest -Uri "http://localhost:8001/status" -UseBasicParsing
    Write-Host "   ✅ Admin API accessible" -ForegroundColor Green
    
    $metricsResp = Invoke-WebRequest -Uri "http://localhost:8000/metrics" -UseBasicParsing
    Write-Host "   ✅ Métriques Prometheus disponibles" -ForegroundColor Green
}
catch {
    Write-Host "   ⚠️  Certains endpoints non accessibles" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Phase 1: Kong API Gateway - COMPLÈTE!" -ForegroundColor Green
