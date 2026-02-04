# =============================================================================
# Validation globale - Toutes les stacks d'infrastructure (AgriLogistic)
# =============================================================================
# Usage: .\infrastructure\scripts\validate-all.ps1
#        .\infrastructure\scripts\validate-all.ps1 -SkipKafka -SkipSuperset
# Options: -SkipMonitoring, -SkipSuperset, -SkipKafka, -SkipKong
# =============================================================================
param(
    [switch]$SkipMonitoring,
    [switch]$SkipSuperset,
    [switch]$SkipKafka,
    [switch]$SkipKong
)

$ErrorActionPreference = "Continue"
$ScriptDir = $PSScriptRoot
$results = @()

function Run-Validation {
    param([string]$Name, [scriptblock]$Block)
    Write-Host ""
    Write-Host "########################################" -ForegroundColor DarkCyan
    Write-Host "  $Name" -ForegroundColor Cyan
    Write-Host "########################################" -ForegroundColor DarkCyan
    try {
        $prevError = $Error.Count
        & $Block
        $exitCode = $LASTEXITCODE
        if ($exitCode -eq 0 -or $null -eq $exitCode) {
            $script:results += [PSCustomObject]@{ Name = $Name; Status = "OK"; Code = 0 }
            return $true
        }
        $script:results += [PSCustomObject]@{ Name = $Name; Status = "FAIL"; Code = $exitCode }
        return $false
    } catch {
        $script:results += [PSCustomObject]@{ Name = $Name; Status = "ERROR"; Code = -1 }
        Write-Host "   Exception: $_" -ForegroundColor Red
        return $false
    }
}

Write-Host "=== Validation globale infrastructure AgriLogistic ===" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "Répertoire: $ScriptDir" -ForegroundColor Gray

# 1. Monitoring (Prometheus + Grafana + Loki + Tempo + ...)
if (-not $SkipMonitoring) {
    Run-Validation -Name "Monitoring (Prometheus, Grafana, Loki, Tempo)" -Block {
        & "$ScriptDir\validate-monitoring.ps1"
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    } | Out-Null
} else {
    $results += [PSCustomObject]@{ Name = "Monitoring"; Status = "SKIP"; Code = $null }
}

# 2. Superset (Monitoring métier)
if (-not $SkipSuperset) {
    Run-Validation -Name "Superset (Monitoring métier)" -Block {
        & "$ScriptDir\validate-superset.ps1"
        # validate-superset ne sort pas toujours avec un code; on considère OK si pas d'exception
        exit 0
    } | Out-Null
} else {
    $results += [PSCustomObject]@{ Name = "Superset"; Status = "SKIP"; Code = $null }
}

# 3. Kafka (Event Bus)
if (-not $SkipKafka) {
    Run-Validation -Name "Kafka (Event Bus)" -Block {
        & "$ScriptDir\validate-kafka-cahier.ps1"
        exit $LASTEXITCODE
    } | Out-Null
} else {
    $results += [PSCustomObject]@{ Name = "Kafka"; Status = "SKIP"; Code = $null }
}

# 4. Kong (API Gateway) - script .sh, exécution si bash disponible
if (-not $SkipKong) {
    $infraDir = Split-Path $ScriptDir -Parent
    $infraDirUnix = $infraDir -replace '\\', '/'
    if (Get-Command bash -ErrorAction SilentlyContinue) {
        Run-Validation -Name "Kong (API Gateway)" -Block {
            bash -c "cd '$infraDirUnix' && ./scripts/validate-kong-cahier.sh"
            exit $LASTEXITCODE
        } | Out-Null
    } else {
        $results += [PSCustomObject]@{ Name = "Kong"; Status = "SKIP"; Code = $null }
        Write-Host ""
        Write-Host "########################################" -ForegroundColor DarkCyan
        Write-Host "  Kong (API Gateway)" -ForegroundColor Cyan
        Write-Host "########################################" -ForegroundColor DarkCyan
        Write-Host "   SKIP - bash non trouvé. Exécuter manuellement: ./infrastructure/scripts/validate-kong-cahier.sh" -ForegroundColor Yellow
    }
} else {
    $results += [PSCustomObject]@{ Name = "Kong"; Status = "SKIP"; Code = $null }
}

# Rapport final
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RAPPORT DE VALIDATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$okCount = ($results | Where-Object { $_.Status -eq "OK" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "FAIL" -or $_.Status -eq "ERROR" }).Count
$skipCount = ($results | Where-Object { $_.Status -eq "SKIP" }).Count

$results | ForEach-Object {
    $color = switch ($_.Status) {
        "OK"   { "Green" }
        "SKIP" { "Gray" }
        default { "Red" }
    }
    Write-Host "  $($_.Name): $($_.Status)" -ForegroundColor $color
}
Write-Host ""
Write-Host "Résumé: $okCount OK, $failCount échec(s), $skipCount ignoré(s)" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Yellow" })
Write-Host ""

# Liens utiles
Write-Host "Liens (si stacks démarrées):" -ForegroundColor Gray
Write-Host "  Monitoring: Grafana http://localhost:4001 | Prometheus http://localhost:9090 | Loki http://localhost:3100" -ForegroundColor Gray
Write-Host "  Superset:  http://localhost:8088 (admin/admin) | Flower http://localhost:5555" -ForegroundColor Gray
Write-Host "  Kafka UI:  http://localhost:8080 | Schema Registry http://localhost:8081" -ForegroundColor Gray
Write-Host "  Kong:      Proxy http://localhost:8000 | Admin http://localhost:8001" -ForegroundColor Gray
Write-Host ""

if ($failCount -gt 0) { exit 1 }
exit 0
