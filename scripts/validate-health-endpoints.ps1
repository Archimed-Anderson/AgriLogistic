# AgroLogistic Platform - Script de Validation des Health Endpoints
# Usage: .\scripts\validate-health-endpoints.ps1

param(
    [switch]$Verbose,
    [switch]$JsonOutput
)

$services = @(
    @{Name="Frontend Dev"; Url="http://localhost:5173"; Critical=$true},
    @{Name="Auth Service"; Url="http://localhost:3001/health"; Critical=$true},
    @{Name="Product Service"; Url="http://localhost:3002/health"; Critical=$true},
    @{Name="Order Service"; Url="http://localhost:3003/health"; Critical=$true},
    @{Name="Payment Service"; Url="http://localhost:3004/health"; Critical=$false},
    @{Name="Delivery Service"; Url="http://localhost:3005/health"; Critical=$false},
    @{Name="Notification Service"; Url="http://localhost:3006/health"; Critical=$false},
    @{Name="AI Service"; Url="http://localhost:3007/health"; Critical=$false},
    @{Name="Kong Gateway Admin"; Url="http://localhost:8001/status"; Critical=$true},
    @{Name="Kong Gateway Proxy"; Url="http://localhost:8000"; Critical=$true},
    @{Name="Prometheus"; Url="http://localhost:9090/-/healthy"; Critical=$false},
    @{Name="Grafana"; Url="http://localhost:4001/api/health"; Critical=$false},
    @{Name="Jaeger"; Url="http://localhost:16686"; Critical=$false},
    @{Name="Kibana"; Url="http://localhost:5601/api/status"; Critical=$false},
    @{Name="Redis"; Url="http://localhost:6379"; Critical=$true; TcpCheck=$true},
    @{Name="PostgreSQL"; Url="http://localhost:5433"; Critical=$true; TcpCheck=$true},
    @{Name="MongoDB"; Url="http://localhost:27017"; Critical=$false; TcpCheck=$true},
    @{Name="Elasticsearch"; Url="http://localhost:9200/_cluster/health"; Critical=$false}
)

$results = @()
$totalServices = $services.Count
$healthyServices = 0
$criticalDown = 0

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  AgroLogistic Platform - Health Check Validation" -ForegroundColor Cyan
Write-Host "  Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

foreach ($svc in $services) {
    $status = "DOWN"
    $statusCode = 0
    $responseTime = 0
    $details = ""
    
    try {
        if ($svc.TcpCheck) {
            # TCP port check for databases
            $uri = [System.Uri]$svc.Url
            $port = if ($uri.Port -eq -1) { 80 } else { $uri.Port }
            $hostname = if ($uri.Host) { $uri.Host } else { "localhost" }
            
            $tcpClient = New-Object System.Net.Sockets.TcpClient
            $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
            
            try {
                $asyncResult = $tcpClient.BeginConnect($hostname, $port, $null, $null)
                $wait = $asyncResult.AsyncWaitHandle.WaitOne(3000, $false)
                
                if ($wait -and $tcpClient.Connected) {
                    $stopwatch.Stop()
                    $status = "UP"
                    $statusCode = 1
                    $responseTime = $stopwatch.ElapsedMilliseconds
                    $healthyServices++
                }
                $tcpClient.Close()
            } catch {
                $status = "DOWN"
            }
        } else {
            # HTTP check
            $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
            $response = Invoke-WebRequest -Uri $svc.Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
            $stopwatch.Stop()
            
            $status = "UP"
            $statusCode = $response.StatusCode
            $responseTime = $stopwatch.ElapsedMilliseconds
            $healthyServices++
            
            # Try to parse health response
            if ($response.Content -match '"status"') {
                try {
                    $healthData = $response.Content | ConvertFrom-Json
                    $details = if ($healthData.status) { $healthData.status } else { "" }
                } catch {}
            }
        }
    } catch {
        $status = "DOWN"
        $details = $_.Exception.Message
        if ($svc.Critical) {
            $criticalDown++
        }
    }
    
    # Format output
    $icon = if ($status -eq "UP") { "✅" } else { "❌" }
    $criticalLabel = if ($svc.Critical) { "[CRITICAL]" } else { "" }
    $colorStatus = if ($status -eq "UP") { "Green" } else { "Red" }
    
    $outputLine = "$icon $($svc.Name.PadRight(25)) $status"
    if ($responseTime -gt 0) {
        $outputLine += " (${responseTime}ms)"
    }
    if ($details -and $Verbose) {
        $outputLine += " - $details"
    }
    if ($criticalLabel) {
        Write-Host $outputLine -ForegroundColor $colorStatus -NoNewline
        Write-Host " $criticalLabel" -ForegroundColor Yellow
    } else {
        Write-Host $outputLine -ForegroundColor $colorStatus
    }
    
    $results += @{
        Name = $svc.Name
        Url = $svc.Url
        Status = $status
        StatusCode = $statusCode
        ResponseTime = $responseTime
        Critical = $svc.Critical
        Details = $details
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$healthPercentage = [math]::Round(($healthyServices / $totalServices) * 100, 1)
Write-Host "  Total Services:    $totalServices" -ForegroundColor White
Write-Host "  Healthy:           $healthyServices" -ForegroundColor Green
Write-Host "  Down:              $($totalServices - $healthyServices)" -ForegroundColor $(if ($totalServices - $healthyServices -gt 0) { "Red" } else { "White" })
Write-Host "  Critical Down:     $criticalDown" -ForegroundColor $(if ($criticalDown -gt 0) { "Red" } else { "White" })
Write-Host "  Health Score:      $healthPercentage%" -ForegroundColor $(if ($healthPercentage -ge 80) { "Green" } elseif ($healthPercentage -ge 50) { "Yellow" } else { "Red" })
Write-Host ""

if ($JsonOutput) {
    $summary = @{
        timestamp = Get-Date -Format "o"
        totalServices = $totalServices
        healthyServices = $healthyServices
        downServices = $totalServices - $healthyServices
        criticalDown = $criticalDown
        healthPercentage = $healthPercentage
        services = $results
    }
    $summary | ConvertTo-Json -Depth 3
}

# Exit code based on critical services
if ($criticalDown -gt 0) {
    Write-Host "⚠️  WARNING: $criticalDown critical service(s) are down!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All critical services are healthy!" -ForegroundColor Green
exit 0
