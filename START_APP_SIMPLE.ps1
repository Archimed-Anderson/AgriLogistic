# ==============================================================================
# DEMARRAGE COMPLET - AGRILOGISTIC PLATFORM (CLOUD NATIVE 6.0.0)
# Updated 2026-02-07 - "The Final Orchestrator"
# ==============================================================================
# Ce script orchestre le démarrage de l'écosystème complet (Prompts 1-Final) :
# 1. Validation de l'environnement (Node, pnpm, Docker)
# 2. Démarrage de l'Infrastructure (Postgres, Redis, Kong, Auth, AI) via Docker
# 3. Démarrage du Frontend (Next.js)
# 4. Validation Globale (Checklist Prompts 1-8)
# ==============================================================================

param(
    [switch]$SkipInstall,
    [switch]$NoBrowser,
    [switch]$FullStack,  # Démarre l'infrastructure Docker complète
    [switch]$Validate,   # Lance la validation globale des prompts
    [switch]$Help
)

if ($Help) {
    Write-Host "Usage: .\START_APP_SIMPLE.ps1 [Options]"
    Write-Host "  -FullStack    : Lance toute l'infrastructure (Docker DB, Redis, Auth, AI)"
    Write-Host "  -Validate     : Lance les scripts de validation (Prompts 1-8)"
    Write-Host "  -SkipInstall  : Saute l'étape pnpm install"
    Write-Host "  -NoBrowser    : N'ouvre pas le navigateur à la fin"
    exit 0
}

$Host.UI.RawUI.WindowTitle = "AgriLogistic Cloud Native v6.0.0"

# ==============================================================================
# CONFIGURATION
# ==============================================================================
$RootPath = $PSScriptRoot
$WebAppPath = (Join-Path $RootPath "apps\web-app")
$ScriptsPath = (Join-Path $RootPath "scripts")

function Write-Header { 
    param($Text) 
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host " $Text" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan 
}

function Write-Step { 
    param($Num, $Text) 
    Write-Host "`n[$Num] $Text`n" -ForegroundColor Cyan 
}

function Write-Success { param($Text) Write-Host "  ✓ $Text" -ForegroundColor Green }
function Write-ErrorMsg { param($Text) Write-Host "  ✗ $Text" -ForegroundColor Red }
function Write-Info { param($Text) Write-Host "  ℹ $Text" -ForegroundColor Yellow }

Write-Header "DEMARRAGE AGRILOGISTIC CLOUD NATIVE v6.0.0"

# ==============================================================================
# 1. INSTALLATION DEPENDANCES
# ==============================================================================

if (-not $SkipInstall) {
    Write-Step 1 "Installation des dépendances (pnpm install)"
    Set-Location $RootPath
    try {
        pnpm install
        Write-Success "Dépendances installées"
    }
    catch {
        Write-ErrorMsg "Erreur installation. Continue..."
    }
}
else {
    Write-Step 1 "Installation (IGNORÉE)"
}

# ==============================================================================
# 2. VALIDATION GLOBALE (OPTIONNEL)
# ==============================================================================

if ($Validate) {
    Write-Step 2 "Validation Globale (Prompts 1-8)"
    Set-Location $RootPath
    try {
        node scripts/validate-all-prompts.js
        Write-Success "Validation Terminée"
    }
    catch {
        Write-ErrorMsg "Echecs détectés lors de la validation"
    }
    Read-Host "Appuyez sur Entrée pour continuer le démarrage..."
}

# ==============================================================================
# 3. DEMARRAGE INFRASTRUCTURE (FULLSTACK)
# ==============================================================================

if ($FullStack) {
    Write-Step 3 "Démarrage Infrastructure (Docker)"
    Write-Info "Lancement de scripts/start-all.ps1..."
    
    # Lancer start-all.ps1 dans une nouvelle fenêtre pour ne pas bloquer
    $StartAllPath = (Join-Path $ScriptsPath "start-all.ps1")
    if (Test-Path $StartAllPath) {
        Start-Process powershell -ArgumentList "-NoExit", "-File", "`"$StartAllPath`"" -WindowStyle Normal
        Write-Success "Fenêtre Infrastructure lancée (DB, Redis, Auth, AI)"
    }
    else {
        Write-ErrorMsg "Script start-all.ps1 introuvable: $StartAllPath"
    }
}
else {
    Write-Step 3 "Infrastructure Backend (IGNORÉE - Mode Frontend Only)"
}

# ==============================================================================
# 4. DEMARRAGE FRONTEND & MICROSERVICES
# ==============================================================================

Write-Step 4 "Démarrage Frontend & Microservices (Turbo)"

if (Test-Path $WebAppPath) {
    # On lance Turbo au root pour démarrer tous les services filtrés
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootPath'; pnpm dev; Read-Host 'Services Stopped'" -WindowStyle Normal
    Write-Success "Fenêtre Services lancée (Web-App + Microservices)"
}
else {
    Write-ErrorMsg "Dossier Frontend introuvable: $WebAppPath"
}

# ==============================================================================
# 5. CONCLUSION
# ==============================================================================

Write-Header "PLATFORME EN COURS DE DÉMARRAGE"

Write-Host "`n📍 ACCÈS :" -ForegroundColor Cyan
Write-Host "   Frontend:      http://localhost:3000" -ForegroundColor White
if ($FullStack) {
    Write-Host "   Auth API:      http://localhost:3001" -ForegroundColor White
    Write-Host "   User Service:  http://localhost:3013" -ForegroundColor White
    Write-Host "   AI Main:       http://localhost:8003" -ForegroundColor White
    Write-Host "   AI LLM:        http://localhost:8004" -ForegroundColor White
    Write-Host "   AI Vision:     http://localhost:8005" -ForegroundColor White
}

if (-not $NoBrowser) {
    Write-Info "Ouverture du navigateur dans 5s..."
    Start-Sleep -Seconds 5
    Start-Process "http://localhost:3000"
}

Set-Location $RootPath
Write-Host "`n✅ Terminé. Les services tournent en arrière-plan." -ForegroundColor Green
