# Kong Gateway Initialization Script for Windows
# AgroLogistic 2.0 - PowerShell Version

$ErrorActionPreference = "Stop"

# Configuration - Ports (aligned with docker-compose.kong.yml)
$KONG_ADMIN_URL = "http://localhost:8001"
$KONG_PROXY_URL = "http://localhost:8000"

Write-Host "================================================" -ForegroundColor Blue
Write-Host "  Kong API Gateway Initialization" -ForegroundColor Blue
Write-Host "  AgroLogistic 2.0" -ForegroundColor Blue
Write-Host "================================================" -ForegroundColor Blue
Write-Host ""

# Wait for Kong
Write-Host "[INFO] Waiting for Kong Admin API..." -ForegroundColor Blue
$retries = 0
while ($retries -lt 30) {
    try {
        $response = Invoke-WebRequest -Uri "$KONG_ADMIN_URL/status" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "[SUCCESS] Kong Admin API is ready!" -ForegroundColor Green
            break
        }
    }
    catch {}
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 2
    $retries++
}
Write-Host ""

if ($retries -ge 30) {
    Write-Host "[ERROR] Kong did not become ready" -ForegroundColor Red
    exit 1
}

# Get Kong version
try {
    $versionResp = Invoke-WebRequest -Uri "$KONG_ADMIN_URL/" -UseBasicParsing
    $versionJson = $versionResp.Content | ConvertFrom-Json
    Write-Host "[INFO] Kong version: $($versionJson.version)" -ForegroundColor Blue
}
catch {}

Write-Host ""
Write-Host "[INFO] Creating services..." -ForegroundColor Blue

# Create services
$services = @(
    @{name = "auth-service"; url = "http://auth-service:8001" },
    @{name = "product-service"; url = "http://product-service:8002" },
    @{name = "order-service"; url = "http://order-service:8003" },
    @{name = "logistics-service"; url = "http://logistics-service:8004" },
    @{name = "payment-service"; url = "http://payment-service:8005" },
    @{name = "notification-service"; url = "http://notification-service:8006" },
    @{name = "analytics-service"; url = "http://analytics-service:8007" },
    @{name = "ai-service"; url = "http://ai-service:8008" },
    @{name = "blockchain-service"; url = "http://blockchain-service:8009" },
    @{name = "inventory-service"; url = "http://inventory-service:8010" },
    @{name = "user-service"; url = "http://user-service:8011" }
)

foreach ($service in $services) {
    Write-Host "[INFO] Creating service: $($service.name)" -ForegroundColor Blue
    
    $body = @{
        name            = $service.name
        url             = $service.url
        connect_timeout = 60000
        write_timeout   = 60000
        read_timeout    = 60000
        retries         = 3
    } | ConvertTo-Json
    
    try {
        Invoke-WebRequest -Uri "$KONG_ADMIN_URL/services" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing | Out-Null
        Write-Host "[SUCCESS] Service $($service.name) created" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "[WARNING] Service $($service.name) already exists" -ForegroundColor Yellow
        }
        else {
            Write-Host "[ERROR] Failed to create service $($service.name)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "[INFO] Creating routes..." -ForegroundColor Blue

# Create basic routes for each service
$routes = @(
    @{service = "auth-service"; name = "auth-routes"; paths = @("/api/v1/auth"); methods = @("GET", "POST", "PUT", "DELETE") },
    @{service = "product-service"; name = "product-routes"; paths = @("/api/v1/products"); methods = @("GET", "POST", "PUT", "DELETE") },
    @{service = "order-service"; name = "order-routes"; paths = @("/api/v1/orders"); methods = @("GET", "POST", "PUT", "DELETE") },
    @{service = "logistics-service"; name = "logistics-routes"; paths = @("/api/v1/logistics"); methods = @("GET", "POST") },
    @{service = "payment-service"; name = "payment-routes"; paths = @("/api/v1/payments"); methods = @("GET", "POST") },
    @{service = "notification-service"; name = "notification-routes"; paths = @("/api/v1/notifications"); methods = @("GET", "POST") },
    @{service = "analytics-service"; name = "analytics-routes"; paths = @("/api/v1/analytics"); methods = @("GET", "POST") },
    @{service = "ai-service"; name = "ai-routes"; paths = @("/api/v1/ai"); methods = @("POST") },
    @{service = "blockchain-service"; name = "blockchain-routes"; paths = @("/api/v1/blockchain"); methods = @("GET", "POST") },
    @{service = "inventory-service"; name = "inventory-routes"; paths = @("/api/v1/inventory"); methods = @("GET", "PUT", "PATCH") },
    @{service = "user-service"; name = "user-routes"; paths = @("/api/v1/users"); methods = @("GET", "POST", "PUT") }
)

foreach ($route in $routes) {
    Write-Host "[INFO] Creating route: $($route.name)" -ForegroundColor Blue
    
    $body = @{
        name       = $route.name
        paths      = $route.paths
        methods    = $route.methods
        strip_path = $false
    } | ConvertTo-Json
    
    try {
        Invoke-WebRequest -Uri "$KONG_ADMIN_URL/services/$($route.service)/routes" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing | Out-Null
        Write-Host "[SUCCESS] Route $($route.name) created" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "[WARNING] Route $($route.name) already exists" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Kong Gateway Configuration Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Endpoints:" -ForegroundColor Blue
Write-Host "  Kong Proxy:     $KONG_PROXY_URL" -ForegroundColor Yellow
Write-Host "  Kong Admin API: $KONG_ADMIN_URL" -ForegroundColor Yellow
Write-Host "  Konga UI:       http://localhost:1337" -ForegroundColor Yellow
Write-Host ""

Write-Host "Test Commands:" -ForegroundColor Blue
Write-Host "  curl $KONG_ADMIN_URL/status" -ForegroundColor White
Write-Host "  curl $KONG_PROXY_URL/api/v1/products" -ForegroundColor White
Write-Host ""

Write-Host "[SUCCESS] Initialization completed!" -ForegroundColor Green
