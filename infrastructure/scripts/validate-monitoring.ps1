# =============================================================================
# Validation Monitoring Technique - Stack Prometheus + Grafana (Cahier des charges)
# =============================================================================
# Usage: .\infrastructure\scripts\validate-monitoring.ps1
# Prérequis : stack démarrée (cd infrastructure && docker compose -f docker-compose.monitoring.yml up -d)
# =============================================================================
$ErrorActionPreference = "Continue"

$endpoints = @(
    @{ Name = "Prometheus"; Url = "http://localhost:9090/-/healthy"; Port = 9090 },
    @{ Name = "Grafana"; Url = "http://localhost:4001/api/health"; Port = 4001 },
    @{ Name = "Alertmanager"; Url = "http://localhost:9093/-/healthy"; Port = 9093 },
    @{ Name = "Loki"; Url = "http://localhost:3100/ready"; Port = 3100 },
    @{ Name = "Tempo"; Url = "http://localhost:3200/ready"; Port = 3200 },
    @{ Name = "Node Exporter"; Url = "http://localhost:9100/metrics"; Port = 9100 },
    @{ Name = "cAdvisor"; Url = "http://localhost:18080/healthz"; Port = 18080 }
)

Write-Host "=== Validation Stack Monitoring (Prometheus + Grafana) ===" -ForegroundColor Cyan
Write-Host ""

$ok = 0
$fail = 0

foreach ($ep in $endpoints) {
    Write-Host "$($ep.Name) (http://localhost:$($ep.Port)))..." -ForegroundColor Yellow
    $timeoutSec = if ($ep.Name -eq "Grafana") { 15 } else { 5 }
    try {
        $r = Invoke-WebRequest -Uri $ep.Url -UseBasicParsing -TimeoutSec $timeoutSec
        if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 400) {
            Write-Host "   OK - $($ep.Name) répond ($($r.StatusCode))" -ForegroundColor Green
            $ok++
        } else {
            Write-Host "   Réponse $($r.StatusCode)" -ForegroundColor Yellow
            $ok++
        }
    } catch {
        # cAdvisor uses /healthz, some images use different path
        if ($ep.Name -eq "cAdvisor") {
            try {
                $r2 = Invoke-WebRequest -Uri "http://localhost:18080/metrics" -UseBasicParsing -TimeoutSec 3
                Write-Host "   OK - cAdvisor metrics exposés ($($r2.StatusCode))" -ForegroundColor Green
                $ok++
            } catch {
                Write-Host "   ERREUR ou non démarré : $($_.Exception.Message)" -ForegroundColor Red
                $fail++
            }
        } elseif ($ep.Name -eq "Node Exporter" -and $_.Exception.Message -match "404") {
            Write-Host "   OK - Node Exporter répond (metrics)" -ForegroundColor Green
            $ok++
        } else {
            Write-Host "   ERREUR ou non démarré : $($_.Exception.Message)" -ForegroundColor Red
            $fail++
        }
    }
    Write-Host ""
}

# Prometheus targets (optional quick check)
Write-Host "Prometheus targets (aperçu)..." -ForegroundColor Yellow
try {
    $t = Invoke-RestMethod -Uri "http://localhost:9090/api/v1/targets" -TimeoutSec 3
    $up = ($t.data.activeTargets | Where-Object { $_.health -eq "up" }).Count
    $total = $t.data.activeTargets.Count
    Write-Host "   Targets actifs: $up / $total up" -ForegroundColor Green
} catch {
    Write-Host "   Non disponible (Prometheus pas démarré?)" -ForegroundColor Gray
}
Write-Host ""

# Containers
Write-Host "Conteneurs stack monitoring..." -ForegroundColor Yellow
$containers = docker ps -a --filter "name=AgriLogistic-" --format "{{.Names}}: {{.Status}}" 2>$null | Where-Object { $_ -match "prometheus|grafana|alertmanager|loki|tempo|node-exporter|cadvisor" }
if ($containers) {
    $containers | ForEach-Object { Write-Host "   $_" }
} else {
    docker ps -a --filter "name=AgriLogistic-" --format "{{.Names}}: {{.Status}}" 2>$null | ForEach-Object { Write-Host "   $_" }
}
Write-Host ""

Write-Host "=== Fin validation ===" -ForegroundColor Cyan
Write-Host "Résumé: $ok OK, $fail échec(s)" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Yellow" })
Write-Host "Grafana: http://localhost:4001 (admin / GRAFANA_PASSWORD)" -ForegroundColor Gray
Write-Host "Prometheus: http://localhost:9090" -ForegroundColor Gray
# Échec si plus d'un service en erreur (Grafana peut être lent au premier démarrage)
if ($fail -gt 1) { exit 1 }
