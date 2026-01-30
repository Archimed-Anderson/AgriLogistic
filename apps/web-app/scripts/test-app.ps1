# Script de Test pour Web App Next.js

$ServiceRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$TestsPassed = 0
$TestsFailed = 0

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Test de l'Application Next.js Web App" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Fichiers essentiels
Write-Host "[Test 1] Fichiers essentiels:" -ForegroundColor Yellow
$files = @("package.json", "next.config.mjs", "tailwind.config.ts", "tsconfig.json", "components.json")
foreach ($file in $files) {
    if (Test-Path (Join-Path $ServiceRoot $file)) {
        Write-Host "  OK $file" -ForegroundColor Green
        $TestsPassed++
    } else {
        Write-Host "  FAIL $file" -ForegroundColor Red
        $TestsFailed++
    }
}

# Test 2: Structure
Write-Host "`n[Test 2] Structure:" -ForegroundColor Yellow
$dirs = @("src/app", "src/components", "src/lib", "src/types")
foreach ($dir in $dirs) {
    if (Test-Path (Join-Path $ServiceRoot $dir)) {
        Write-Host "  OK $dir/" -ForegroundColor Green
        $TestsPassed++
    } else {
        Write-Host "  FAIL $dir/" -ForegroundColor Red
        $TestsFailed++
    }
}

# Test 3: Routes
Write-Host "`n[Test 3] Routes:" -ForegroundColor Yellow
$routes = @(
    "src/app/page.tsx",
    "src/app/login/page.tsx",
    "src/app/dashboard/farmer/page.tsx"
)
foreach ($route in $routes) {
    if (Test-Path (Join-Path $ServiceRoot $route)) {
        Write-Host "  OK $route" -ForegroundColor Green
        $TestsPassed++
    } else {
        Write-Host "  FAIL $route" -ForegroundColor Red
        $TestsFailed++
    }
}

# Test 4: Composants
Write-Host "`n[Test 4] Composants:" -ForegroundColor Yellow
$components = @(
    "src/components/ui/button.tsx",
    "src/components/layout/Sidebar.tsx",
    "src/components/dashboard/Field3D.tsx"
)
foreach ($comp in $components) {
    if (Test-Path (Join-Path $ServiceRoot $comp)) {
        Write-Host "  OK $comp" -ForegroundColor Green
        $TestsPassed++
    } else {
        Write-Host "  FAIL $comp" -ForegroundColor Red
        $TestsFailed++
    }
}

# Résumé
Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Resume des Tests" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Tests reussis: $TestsPassed" -ForegroundColor Green
Write-Host "Tests echoues: $TestsFailed" -ForegroundColor $(if ($TestsFailed -eq 0) { "Green" } else { "Red" })

if ($TestsFailed -eq 0) {
    Write-Host ""
    Write-Host "Tous les tests sont passes !" -ForegroundColor Green
    Write-Host "Pour demarrer: pnpm dev" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host ""
    Write-Host "Certains tests ont echoue" -ForegroundColor Red
    exit 1
}
