#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Health Check Script for AgroDeep Services
.DESCRIPTION
    Vérifie le statut de tous les services via leurs endpoints /health
#>

param(
    [switch]$Detailed,
    [int]$Timeout = 5
)

$ErrorActionPreference = "Continue"

# Liste des services à vérifier
$services = @(
    @{ Name = "AI Service (Main)"; URL = "http://localhost:8000/health" },
    @{ Name = "AI Service (LLM)"; URL = "http://localhost:8001/health" },
    @{ Name = "AI Service (Vision)"; URL = "http://localhost:8002/health" },
    @{ Name = "User Service"; URL = "http://localhost:3001/health" },
    @{ Name = "Admin Service"; URL = "http://localhost:3002/health" },
    @{ Name = "Product Service"; URL = "http://localhost:3003/health" },
    @{ Name = "Order Service"; URL = "http://localhost:3004/health" },
    @{ Name = "Inventory Service"; URL = "http://localhost:3005/health" },
    @{ Name = "Delivery Service"; URL = "http://localhost:3006/health" },
    @{ Name = "Analytics Service"; URL = "http://localhost:3007/health" },
    @{ Name = "Notification Service"; URL = "http://localhost:3008/health" },
    @{ Name = "Production Service"; URL = "http://localhost:3009/health" },
    @{ Name = "Blockchain Service"; URL = "http://localhost:3010/health" },
    @{ Name = "Web App (Next.js)"; URL = "http://localhost:3000" }
)

Write-Host "`n🏥 AgroDeep Health Check Report" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "Started at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n" -ForegroundColor Gray

$healthyCount = 0
$unhealthyCount = 0
$results = @()

foreach ($service in $services) {
    Write-Host "Checking $($service.Name)... " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $service.URL -Method Get -TimeoutSec $Timeout -UseBasicParsing -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ HEALTHY" -ForegroundColor Green
            $healthyCount++
            
            if ($Detailed) {
                try {
                    $body = $response.Content | ConvertFrom-Json
                    Write-Host "   Response: $($body | ConvertTo-Json -Compress)" -ForegroundColor DarkGray
                }
                catch {
                    Write-Host "   Status: OK (non-JSON response)" -ForegroundColor DarkGray
                }
            }
            
            $results += [PSCustomObject]@{
                Service      = $service.Name
                Status       = "HEALTHY"
                URL          = $service.URL
                ResponseTime = $response.Headers.'X-Response-Time'
            }
        }
        else {
            Write-Host "⚠️  WARNING (Status: $($response.StatusCode))" -ForegroundColor Yellow
            $unhealthyCount++
            
            $results += [PSCustomObject]@{
                Service      = $service.Name
                Status       = "WARNING"
                URL          = $service.URL
                ResponseTime = "N/A"
            }
        }
    }
    catch {
        Write-Host "❌ UNHEALTHY" -ForegroundColor Red
        $unhealthyCount++
        
        if ($Detailed) {
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor DarkRed
        }
        
        $results += [PSCustomObject]@{
            Service      = $service.Name
            Status       = "UNHEALTHY"
            URL          = $service.URL
            ResponseTime = "N/A"
        }
    }
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Healthy:   $healthyCount" -ForegroundColor Green
Write-Host "  ❌ Unhealthy: $unhealthyCount" -ForegroundColor Red
Write-Host "  📊 Total:     $($services.Count)`n" -ForegroundColor White

$healthPercentage = [math]::Round(($healthyCount / $services.Count) * 100, 2)
Write-Host "Health Score: $healthPercentage%" -ForegroundColor $(if ($healthPercentage -ge 80) { "Green" } elseif ($healthPercentage -ge 50) { "Yellow" } else { "Red" })

# Export results to JSON
$reportPath = "health-check-report.json"
$results | ConvertTo-Json | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "`n📄 Report saved to: $reportPath" -ForegroundColor Gray

# Exit code based on health
if ($unhealthyCount -eq 0) {
    Write-Host "`n✅ All services are healthy!`n" -ForegroundColor Green
    exit 0
}
elseif ($healthyCount -gt 0) {
    Write-Host "`n⚠️  Some services are down but system is partially operational`n" -ForegroundColor Yellow
    exit 1
}
else {
    Write-Host "`n❌ All services are down!`n" -ForegroundColor Red
    exit 2
}
