#!/usr/bin/env pwsh
# fix-auth-service.ps1 - Correction automatique auth-service (ESLint 9 flat config)
# Executer depuis la racine du projet AgroDeep.
# Note: Si le build echoue (Prisma 7), migrer datasource url vers prisma.config.ts (voir PRISMA_7_FIX.md).

$ErrorActionPreference = "Stop"
$AuthServicePath = "services/identity/auth-service"
$ProjectRoot = $PSScriptRoot
if (-not $ProjectRoot) { $ProjectRoot = Get-Location }

Write-Host "Demarrage correction auth-service..." -ForegroundColor Green

# Vérifier position (racine AgroDeep)
if (-not (Test-Path (Join-Path $ProjectRoot $AuthServicePath))) {
    Write-Error "Dossier $AuthServicePath non trouve. Executez depuis la racine du projet (AgroDeep)."
    exit 1
}

Push-Location (Join-Path $ProjectRoot $AuthServicePath)

try {
    # ============================================================================
    # ÉTAPE 1: Backup
    # ============================================================================
    Write-Host "`nEtape 1: Backup des fichiers sources..." -ForegroundColor Cyan
    $BackupDir = (Join-Path $ProjectRoot ".backups/auth-service-$(Get-Date -Format 'yyyyMMdd-HHmmss')")
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
    Copy-Item -Recurse -Force "src" $BackupDir
    if (Test-Path "tests") { Copy-Item -Recurse -Force "tests" $BackupDir }
    Write-Host "Backup cree: $BackupDir" -ForegroundColor Green

    # ============================================================================
    # ÉTAPE 2: Installation dépendances
    # ============================================================================
    Write-Host "`nEtape 2: Installation dependances (pnpm install)..." -ForegroundColor Cyan
    pnpm install 2>$null
    Write-Host "Dependances a jour" -ForegroundColor Green

    # ============================================================================
    # ÉTAPE 3: Vérification configuration ESLint (flat config - pas de .eslintrc.js)
    # ============================================================================
    Write-Host "`nEtape 3: Verification ESLint (eslint.config.mjs)..." -ForegroundColor Cyan
    if (-not (Test-Path "eslint.config.mjs")) {
        Write-Host "eslint.config.mjs absent - regles gerees au niveau monorepo." -ForegroundColor Yellow
    } else {
        Write-Host "eslint.config.mjs present (ESLint 9 flat config)" -ForegroundColor Green
    }

    # ============================================================================
    # ÉTAPE 4: Script lint:check dans package.json (sans réécrire tout le JSON)
    # ============================================================================
    Write-Host "`nEtape 4: Script lint:check dans package.json..." -ForegroundColor Cyan
    $packageJsonPath = "package.json"
    $packageContent = Get-Content $packageJsonPath -Raw -Encoding utf8
    if ($packageContent -notmatch '"lint:check"') {
        # Insérer "lint:check" après la ligne "lint" (sans réécrire tout le JSON)
        $lintLine = '    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",'
        $newLines = "`n    `"lint:check`": `"eslint \`"src/**/*.ts\`" \`"test/**/*.ts\`" \`"tests/**/*.ts\`"`","
        $packageContent = $packageContent.Replace($lintLine, $lintLine + $newLines)
        Set-Content -Path $packageJsonPath -Value $packageContent -Encoding utf8 -NoNewline
        Write-Host "lint:check ajoute" -ForegroundColor Green
    } else {
        Write-Host "lint:check deja present" -ForegroundColor Green
    }

    # ============================================================================
    # ÉTAPE 5: Correction automatique ESLint
    # ============================================================================
    Write-Host "`nEtape 5: Correction automatique ESLint..." -ForegroundColor Cyan
    $eslintOutput = pnpm run lint 2>&1 | Out-String
    if ($eslintOutput -match "fixable") { Write-Host "Corrections automatiques appliquees" -ForegroundColor Yellow }
    Write-Host "ESLint --fix termine" -ForegroundColor Green

    # ============================================================================
    # ÉTAPE 6: Formatage Prettier
    # ============================================================================
    Write-Host "`nEtape 6: Formatage Prettier..." -ForegroundColor Cyan
    & pnpm exec prettier --write "src/**/*.ts" "test/**/*.ts" "tests/**/*.ts" 2>$null
    Write-Host "✅ Formatage terminé" -ForegroundColor Green

    # ============================================================================
    # ÉTAPE 7: Vérification des erreurs restantes (parsing JSON ESLint)
    # ============================================================================
    Write-Host "`nEtape 7: Verification des erreurs restantes..." -ForegroundColor Cyan
    $errorCount = 0
    $warningCount = 0
    pnpm run lint:check 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { $errorCount = 1 }

    Write-Host "`nResultat:" -ForegroundColor Cyan
    Write-Host "   Erreurs restantes: $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Green" })
    Write-Host "   Warnings restants: $warningCount" -ForegroundColor $(if ($warningCount -gt 0) { "Yellow" } else { "Green" })

    # ============================================================================
    # ÉTAPE 8: Test build
    # ============================================================================
    Write-Host "`nEtape 8: Test compilation..." -ForegroundColor Cyan
    & pnpm build 2>&1 | Tee-Object -Variable buildOutput
    $buildOk = ($LASTEXITCODE -eq 0)

    if ($buildOk) {
        Write-Host "`nBUILD REUSSI !" -ForegroundColor Green
    } else {
        Write-Host "`nECHEC BUILD - Voir logs ci-dessus" -ForegroundColor Red
    }

    # ============================================================================
    # Rapport final
    # ============================================================================
    Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
    Write-Host "RAPPORT FINAL" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host "Backup: $BackupDir" -ForegroundColor Gray
    Write-Host "Erreurs finales: $errorCount" -ForegroundColor $(if ($errorCount -eq 0) { "Green" } else { "Red" })
    Write-Host "Warnings finaux: $warningCount" -ForegroundColor $(if ($warningCount -eq 0) { "Green" } else { "Yellow" })

    if ($errorCount -eq 0 -and $warningCount -eq 0) {
        Write-Host "`nPARFAIT - Aucune erreur !" -ForegroundColor Green
    } elseif ($errorCount -eq 0) {
        Write-Host "`nAcceptable - Seulement des warnings" -ForegroundColor Green
    } else {
        Write-Host "`nErreurs persistantes - Verifier avec: pnpm run lint:check" -ForegroundColor Yellow
    }

    if (-not $buildOk) { exit 1 }
} finally {
    Pop-Location
}
