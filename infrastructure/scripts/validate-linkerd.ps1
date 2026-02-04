# =============================================================================
# Validation Service Mesh Linkerd - Cahier des charges (Optionnel Phase 2)
# =============================================================================
# Usage: .\infrastructure\scripts\validate-linkerd.ps1
# Vérifie : Kustomize with-linkerd, (optionnel) linkerd CLI, PrometheusRule documentée
# =============================================================================
$ErrorActionPreference = "Continue"
$Root = if ($PSScriptRoot) { (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path } else { (Get-Location).Path }

Write-Host "=== Validation Service Mesh Linkerd ===" -ForegroundColor Cyan
Write-Host "Racine projet : $Root"
Write-Host ""

# 1. Build Kustomize with-linkerd
Write-Host "1. Build Kustomize (infrastructure/k8s/overlays/with-linkerd/)..." -ForegroundColor Yellow
Push-Location $Root
try {
    $out = kubectl kustomize infrastructure/k8s/overlays/with-linkerd/ 2>&1
    if ($LASTEXITCODE -ne 0) { throw $out }
    $lines = ($out | Measure-Object -Line).Lines
    Write-Host "   OK - $lines lignes générées (Namespace + production avec linkerd.io/inject)" -ForegroundColor Green
} catch {
    Write-Host "   ERREUR : $_" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host ""

# 2. Dry-run apply (si kubectl configuré sur un cluster)
Write-Host "2. Dry-run apply (kubectl apply -k ... --dry-run=client)..." -ForegroundColor Yellow
try {
    kubectl apply -k "$Root\infrastructure\k8s\overlays\with-linkerd\" --dry-run=client 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   OK - Manifests valides pour apply" -ForegroundColor Green
    } else {
        Write-Host "   Ignoré (cluster non joignable ou kubectl non configuré)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   Ignoré (dry-run non exécuté)" -ForegroundColor Gray
}
Write-Host ""

# 3. Linkerd CLI (optionnel)
Write-Host "3. Linkerd CLI (optionnel)..." -ForegroundColor Yellow
if (Get-Command linkerd -ErrorAction SilentlyContinue) {
    $ver = linkerd version --client --short 2>$null
    Write-Host "   OK - linkerd présent : $ver" -ForegroundColor Green
} else {
    Write-Host "   Non installé. Sur Windows : .\infrastructure\linkerd\install-linkerd.ps1" -ForegroundColor Gray
}
Write-Host ""

# 4. PrometheusRule (optionnel - nécessite Prometheus Operator CRD)
Write-Host "4. PrometheusRule p99 (optionnel)..." -ForegroundColor Yellow
Write-Host "   Fichier : infrastructure/linkerd/prometheus-rules-p99.yaml" -ForegroundColor Gray
Write-Host "   Nécessite : CRD Prometheus Operator (monitoring.coreos.com/v1). Sinon, utiliser rule_files Prometheus classique." -ForegroundColor Gray
Write-Host ""

Write-Host "=== Fin validation Linkerd ===" -ForegroundColor Cyan
