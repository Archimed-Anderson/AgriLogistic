# =============================================================================
# Script de Test Simplifié pour les Corrections Prisma 7
# =============================================================================

$ErrorActionPreference = "Continue"
$ServiceRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

$TESTS_PASSED = 0
$TESTS_FAILED = 0
$FAILED_TESTS = @()

function Test-File {
    param([string]$File, [string]$Description)
    $filePath = Join-Path $ServiceRoot $File
    if (Test-Path $filePath) {
        Write-Host "✓ $Description" -ForegroundColor Green
        $script:TESTS_PASSED++
        return $true
    } else {
        Write-Host "✗ $Description - Fichier manquant: $File" -ForegroundColor Red
        $script:TESTS_FAILED++
        $script:FAILED_TESTS += "$Description - $File"
        return $false
    }
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Tests des Corrections Prisma 7" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Fichiers
Write-Host "`n[Test 1] Vérification des fichiers:" -ForegroundColor Yellow
Test-File "prisma.config.ts" "prisma.config.ts existe"
Test-File "prisma\schema.prisma" "schema.prisma existe"
Test-File ".env.example" ".env.example existe"
Test-File "PRISMA_7_FIX.md" "PRISMA_7_FIX.md existe"

# Test 2: Schema Prisma
Write-Host "`n[Test 2] Vérification du schema.prisma:" -ForegroundColor Yellow
$schemaPath = Join-Path $ServiceRoot "prisma\schema.prisma"
if (Test-Path $schemaPath) {
    $schemaContent = Get-Content $schemaPath -Raw
    if ($schemaContent -match 'url\s*=\s*env') {
        Write-Host "✗ Le schema contient encore 'url = env()'" -ForegroundColor Red
        $TESTS_FAILED++
        $FAILED_TESTS += "Schema contient url"
    } else {
        Write-Host "✓ Le schema ne contient pas 'url = env()' (correct)" -ForegroundColor Green
        $TESTS_PASSED++
    }
    
    if ($schemaContent -match 'provider\s*=\s*"postgresql"') {
        Write-Host "✓ Provider PostgreSQL défini" -ForegroundColor Green
        $TESTS_PASSED++
    } else {
        Write-Host "✗ Provider PostgreSQL manquant" -ForegroundColor Red
        $TESTS_FAILED++
        $FAILED_TESTS += "Provider manquant"
    }
}

# Test 3: prisma.config.ts
Write-Host "`n[Test 3] Vérification de prisma.config.ts:" -ForegroundColor Yellow
$configPath = Join-Path $ServiceRoot "prisma.config.ts"
if (Test-Path $configPath) {
    $configContent = Get-Content $configPath -Raw
    if ($configContent -match 'defineConfig') {
        Write-Host "✓ Utilise defineConfig" -ForegroundColor Green
        $TESTS_PASSED++
    } else {
        Write-Host "✗ N'utilise pas defineConfig" -ForegroundColor Red
        $TESTS_FAILED++
        $FAILED_TESTS += "defineConfig manquant"
    }
    
    if ($configContent -match 'datasource.*url') {
        Write-Host "✓ Contient datasource.url" -ForegroundColor Green
        $TESTS_PASSED++
    } else {
        Write-Host "✗ Ne contient pas datasource.url" -ForegroundColor Red
        $TESTS_FAILED++
        $FAILED_TESTS += "datasource.url manquant"
    }
}

# Test 4: package.json
Write-Host "`n[Test 4] Vérification de package.json:" -ForegroundColor Yellow
$packagePath = Join-Path $ServiceRoot "package.json"
if (Test-Path $packagePath) {
    $packageJson = Get-Content $packagePath | ConvertFrom-Json
    
    # Scripts Prisma
    $scripts = @("prisma:generate", "prisma:migrate", "prisma:studio")
    foreach ($script in $scripts) {
        if ($packageJson.scripts.PSObject.Properties.Name -contains $script) {
            Write-Host "✓ Script trouvé: $script" -ForegroundColor Green
            $TESTS_PASSED++
        } else {
            Write-Host "✗ Script manquant: $script" -ForegroundColor Red
            $TESTS_FAILED++
            $FAILED_TESTS += "Script manquant: $script"
        }
    }
    
    # Build script
    if ($packageJson.scripts.build -match "prisma generate") {
        Write-Host '✓ Script build inclut prisma generate' -ForegroundColor Green
        $TESTS_PASSED++
    } else {
        Write-Host '✗ Script build n inclut pas prisma generate' -ForegroundColor Red
        $TESTS_FAILED++
        $FAILED_TESTS += "Build script incorrect"
    }
    
    # dotenv
    $hasDotenv = ($packageJson.dependencies.PSObject.Properties.Name -contains "dotenv") -or 
                  ($packageJson.devDependencies.PSObject.Properties.Name -contains "dotenv")
    if ($hasDotenv) {
        Write-Host "✓ dotenv présent dans les dépendances" -ForegroundColor Green
        $TESTS_PASSED++
    } else {
        Write-Host "✗ dotenv manquant" -ForegroundColor Red
        $TESTS_FAILED++
        $FAILED_TESTS += "dotenv manquant"
    }
}

# Test 5: .env.example
Write-Host "`n[Test 5] Vérification de .env.example:" -ForegroundColor Yellow
$envExamplePath = Join-Path $ServiceRoot ".env.example"
if (Test-Path $envExamplePath) {
    $envContent = Get-Content $envExamplePath -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "✓ Contient DATABASE_URL" -ForegroundColor Green
        $TESTS_PASSED++
    } else {
        Write-Host "✗ Ne contient pas DATABASE_URL" -ForegroundColor Red
        $TESTS_FAILED++
        $FAILED_TESTS += "DATABASE_URL manquant"
    }
}

# Résumé
Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Résumé des Tests" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Tests réussis: $TESTS_PASSED" -ForegroundColor Green
Write-Host "Tests échoués: $TESTS_FAILED" -ForegroundColor $(if ($TESTS_FAILED -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($TESTS_FAILED -eq 0) {
    Write-Host "✓ Tous les tests sont passés !" -ForegroundColor Green
    Write-Host "Les corrections Prisma 7 sont validées." -ForegroundColor Green
    exit 0
} else {
    Write-Host "✗ Certains tests ont échoué:" -ForegroundColor Red
    foreach ($test in $FAILED_TESTS) {
        Write-Host "  - $test" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Veuillez corriger les problèmes identifiés." -ForegroundColor Yellow
    exit 1
}
