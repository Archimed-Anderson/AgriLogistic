# 🚀 AgriLogistic 4.0 - Start All New Services
# This script starts all the new microservices in development mode

Write-Host "🌾 Starting AgriLogistic 4.0 Microservices..." -ForegroundColor Green
Write-Host ""

$services = @(
    @{Name="Rentals Service"; Path="logistics\rentals-service"; Port=3007; Icon="🚜"},
    @{Name="Credit Service"; Path="fintech\credit-service"; Port=3008; Icon="💳"},
    @{Name="Cold Chain Service"; Path="logistics\coldchain-service"; Port=3009; Icon="❄️"},
    @{Name="Coop Service"; Path="coop-service"; Port=3010; Icon="🤝"},
    @{Name="Vision AI Service"; Path="ai-service\vision-service"; Port=3011; Icon="🔬"},
    @{Name="Weather Service"; Path="intelligence\weather-service"; Port=3012; Icon="🌦️"}
)

foreach ($service in $services) {
    $servicePath = Join-Path $PSScriptRoot $service.Path
    
    if (Test-Path $servicePath) {
        Write-Host "$($service.Icon) Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Cyan
        
        # Check if node_modules exists
        if (-not (Test-Path (Join-Path $servicePath "node_modules"))) {
            Write-Host "   📦 Installing dependencies..." -ForegroundColor Yellow
            Push-Location $servicePath
            npm install
            Pop-Location
        }
        
        # Start service in new terminal
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$servicePath'; npm run start:dev"
        
        Write-Host "   ✅ $($service.Name) started" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } else {
        Write-Host "   ⚠️  Service path not found: $servicePath" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✨ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Service Dashboard:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
foreach ($service in $services) {
    Write-Host "$($service.Icon) $($service.Name.PadRight(25)) → http://localhost:$($service.Port)" -ForegroundColor White
}
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
