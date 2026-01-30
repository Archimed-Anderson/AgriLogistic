# ============================================================
# Kong API Gateway Startup Script for Windows
# AgroLogistic 2. - PowerShell Version
# ============================================================

$ErrorActionPreference = "Stop"

# Colors
function Write-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor Blue
}

function Write-Success($message) {
    Write-Host "[SUCCESS] $message" -ForegroundColor Green
}

function Write-Error($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

function Write-Warning($message) {
    Write-Host "[WARNING] $message" -ForegroundColor Yellow
}

# Print banner
function Show-Banner {
    Write-Host "===================================================" -ForegroundColor Blue
    Write-Host "  Kong API Gateway - AgroLogistic 2.0" -ForegroundColor Blue
    Write-Host "  Phase 1: Complete Setup & Deployment" -ForegroundColor Blue
    Write-Host "===================================================" -ForegroundColor Blue
    Write-Host ""
}

# Check prerequisites
function Test-Prerequisites {
    Write-Info "Checking prerequisites..."
    
    # Check Docker
    try {
        $dockerVersion = docker --version
        Write-Success "Docker found: $dockerVersion"
    }
    catch {
        Write-Error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    }
    
    # Check Docker Compose
    try {
        $composeVersion = docker-compose --version
        Write-Success "Docker Compose found: $composeVersion"
    }
    catch {
        Write-Error "Docker Compose is not installed."
        exit 1
    }
    
    Write-Host ""
}

# Check if Kong is running
function Test-KongStatus {
    Write-Info "Checking Kong status..."
    
    $kongRunning = docker ps --format "{{.Names}}" | Select-String "agrologistic-kong-gateway"
    
    if ($kongRunning) {
        Write-Warning "Kong is already running!"
        $restart = Read-Host "Do you want to restart it? (y/N)"
        
        if ($restart -eq "y" -or $restart -eq "Y") {
            Write-Info "Stopping existing Kong containers..."
            docker-compose -f docker-compose.kong.yml down
            Write-Success "Kong stopped"
            return $true
        }
        else {
            Write-Info "Keeping existing Kong instance"
            return $false
        }
    }
    
    Write-Host ""
    return $true
}

# Start Kong
function Start-Kong {
    Write-Info "Starting Kong API Gateway stack..."
    
    docker-compose -f docker-compose.kong.yml up -d
    
    Write-Success "Kong stack started"
    Write-Host ""
}

# Wait for Kong
function Wait-ForKong {
    Write-Info "Waiting for Kong to be ready..."
    
    $retries = 0
    $maxRetries = 60
    
    while ($retries -lt $maxRetries) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8001/status" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Success "Kong Admin API is ready!"
                Write-Host ""
                return $true
            }
        }
        catch {
            # Continue waiting
        }
        
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
        $retries++
    }
    
    Write-Host ""
    Write-Error "Kong did not become ready in time"
    return $false
}

# Initialize Kong
function Initialize-Kong {
    Write-Info "Initializing Kong configuration..."
    
    if (Test-Path "scripts\kong-init.sh") {
        Write-Info "Running initialization via WSL..."
        wsl bash -c "cd /mnt/c/Users/$env:USERNAME/Downloads/AgriLogisticwebapp-main/AgriLogistic/infrastructure && bash scripts/kong-init.sh"
        Write-Success "Kong initialized"
    }
    else {
        Write-Warning "kong-init.sh not found, skipping initialization"
    }
    
    Write-Host ""
}

# Display info
function Write-ConnectionInfo {
    Write-Host "===================================================" -ForegroundColor Green
    Write-Host "  Kong Gateway Successfully Deployed!" -ForegroundColor Green
    Write-Host "===================================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Available Endpoints:" -ForegroundColor Blue
    Write-Host "  Kong Proxy (HTTP):    http://localhost:8000" -ForegroundColor Yellow
    Write-Host "  Kong Proxy (HTTPS):   https://localhost:8443" -ForegroundColor Yellow
    Write-Host "  Kong Admin API:       http://localhost:8001" -ForegroundColor Yellow
    Write-Host "  Kong Manager:         http://localhost:8002" -ForegroundColor Yellow
    Write-Host "  Konga UI:             http://localhost:1337" -ForegroundColor Yellow
    Write-Host "  Prometheus:           http://localhost:9090" -ForegroundColor Yellow
    Write-Host "  Grafana:              http://localhost:3001" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "Quick Test:" -ForegroundColor Blue
    Write-Host "  curl http://localhost:8001/status" -ForegroundColor White
    Write-Host "  curl http://localhost:8000/api/v1/products" -ForegroundColor White
    Write-Host ""
    
    Write-Host "View Logs:" -ForegroundColor Blue
    Write-Host "  docker-compose -f docker-compose.kong.yml logs -f" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Useful Commands:" -ForegroundColor Blue
    Write-Host "  Stop Kong:   docker-compose -f docker-compose.kong.yml down" -ForegroundColor Yellow
    Write-Host "  Restart:     docker-compose -f docker-compose.kong.yml restart" -ForegroundColor Yellow
    Write-Host "  Status:      docker-compose -f docker-compose.kong.yml ps" -ForegroundColor Yellow
    Write-Host ""
}

# Main
function Main {
    Show-Banner
    
    # Step 1: Prerequisites
    Test-Prerequisites
    
    # Step 2: Check status
    if (-not (Test-KongStatus)) {
        Write-ConnectionInfo
        exit 0
    }
    
    # Step 3: Start Kong
    Start-Kong
    
    # Step 4: Wait for Kong
    if (-not (Wait-ForKong)) {
        Write-Error "Failed to start Kong. Check logs with:"
        Write-Host "  docker-compose -f docker-compose.kong.yml logs" -ForegroundColor Yellow
        exit 1
    }
    
    # Step 5: Initialize
    Initialize-Kong
    
    # Step 6: Display info
    Write-ConnectionInfo
    
    Write-Success "Kong Gateway Phase 1 deployment completed!"
}

# Run
Main

