# =============================================================================
# Script de Test PowerShell pour les Corrections Prisma 7
# =============================================================================
# Ce script teste toutes les corrections apportées pour résoudre l'erreur P1012

$ErrorActionPreference = "Stop"

# Colors - Définir les fonctions avant leur utilisation
function Write-Success { 
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green 
}

function Write-ErrorMsg { 
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red 
}

function Write-Info { 
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue 
}

function Write-Warning { 
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow 
}

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host "$Message" -ForegroundColor Cyan
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host ""
}

# Script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ServiceRoot = Split-Path -Parent $ScriptDir

# Test results
$script:TESTS_PASSED = 0
$script:TESTS_FAILED = 0
$script:FAILED_TESTS = @()

function Test-FileExistence {
    Write-Header "Test 1: Vérification de l'existence des fichiers"

    $files = @(
        "prisma.config.ts",
        "prisma\schema.prisma",
        ".env.example",
        "PRISMA_7_FIX.md"
    )

    foreach ($file in $files) {
        $filePath = Join-Path $ServiceRoot $file
        if (Test-Path $filePath) {
            Write-Success -Message "Fichier trouvé: $file"
            $script:TESTS_PASSED++
        } else {
            Write-ErrorMsg -Message "Fichier manquant: $file"
            $script:TESTS_FAILED++
            $script:FAILED_TESTS += "Fichier manquant: $file"
        }
    }
}

function Test-SchemaSyntax {
    Write-Header "Test 2: Vérification de la syntaxe du schema.prisma"

    Push-Location $ServiceRoot

    $schemaPath = Join-Path $ServiceRoot "prisma\schema.prisma"
    $schemaContent = Get-Content $schemaPath -Raw

    # Vérifier que le schema.prisma n'a pas la propriété url dans datasource
    if ($schemaContent -match 'url\s*=\s*env') {
        Write-ErrorMsg -Message "Le schema.prisma contient encore la propriété 'url' dans datasource"
        $script:TESTS_FAILED++
        $script:FAILED_TESTS += "Schema contient 'url'"
    } else {
        Write-Success -Message "Le schema.prisma ne contient pas la propriété 'url' (correct pour Prisma 7)"
        $script:TESTS_PASSED++
    }

    # Vérifier que le provider est défini
    if ($schemaContent -match 'provider\s*=\s*"postgresql"') {
        Write-Success -Message "Le provider PostgreSQL est correctement défini"
        $script:TESTS_PASSED++
    } else {
        Write-ErrorMsg -Message "Le provider PostgreSQL n'est pas défini dans schema.prisma"
        $script:TESTS_FAILED++
        $script:FAILED_TESTS += "Provider PostgreSQL manquant"
    }

    Pop-Location
}

function Test-ConfigSyntax {
    Write-Header "Test 3: Vérification de la syntaxe TypeScript de prisma.config.ts"

    Push-Location $ServiceRoot

    $configPath = Join-Path $ServiceRoot "prisma.config.ts"
    if (-not (Test-Path $configPath)) {
        Write-ErrorMsg -Message "prisma.config.ts n'existe pas"
        $script:TESTS_FAILED++
        $script:FAILED_TESTS += "prisma.config.ts manquant"
        Pop-Location
        return
    }

    $configContent = Get-Content $configPath -Raw

    # Vérifier la présence de defineConfig
    if ($configContent -match 'defineConfig') {
        Write-Success -Message "prisma.config.ts utilise defineConfig"
        $script:TESTS_PASSED++
    } else {
        Write-ErrorMsg -Message "prisma.config.ts n'utilise pas defineConfig"
        $script:TESTS_FAILED++
        $script:FAILED_TESTS += "defineConfig manquant"
    }

    # Vérifier la présence de datasource.url
    if ($configContent -match 'datasource.*url') {
        Write-Success -Message "prisma.config.ts contient la configuration datasource.url"
        $script:TESTS_PASSED++
    } else {
        Write-ErrorMsg -Message "prisma.config.ts ne contient pas la configuration datasource.url"
        $script:TESTS_FAILED++
        $script:FAILED_TESTS += "datasource.url manquant"
    }

    Pop-Location
}

function Test-PackageScripts {
    Write-Header "Test 7: Vérification des scripts package.json"

    Push-Location $ServiceRoot

    $packageJson = Get-Content "package.json" | ConvertFrom-Json

    # Vérifier que les scripts Prisma existent
    $scriptsToCheck = @("prisma:generate", "prisma:migrate", "prisma:studio")
    foreach ($script in $scriptsToCheck) {
        if ($packageJson.scripts.PSObject.Properties.Name -contains $script) {
            Write-Success -Message "Script trouvé: $script"
            $script:TESTS_PASSED++
        } else {
            Write-ErrorMsg -Message "Script manquant: $script"
            $script:TESTS_FAILED++
            $script:FAILED_TESTS += "Script manquant: $script"
        }
    }

    # Vérifier que le script build inclut prisma generate
    if ($packageJson.scripts.build -match "prisma generate") {
        Write-Success -Message "Le script build inclut 'prisma generate'"
        $script:TESTS_PASSED++
    } else {
        Write-ErrorMsg -Message "Le script build n'inclut pas 'prisma generate'"
        $script:TESTS_FAILED++
        $script:FAILED_TESTS += "Script build incorrect"
    }

    # Vérifier que dotenv est dans les dépendances
    $hasDotenv = $false
    if ($packageJson.dependencies.PSObject.Properties.Name -contains "dotenv") {
        $hasDotenv = $true
    }
    if ($packageJson.devDependencies.PSObject.Properties.Name -contains "dotenv") {
        $hasDotenv = $true
    }

    if ($hasDotenv) {
        Write-Success -Message "dotenv est présent dans les dépendances"
        $script:TESTS_PASSED++
    } else {
        Write-ErrorMsg -Message "dotenv n'est pas présent dans les dépendances"
        $script:TESTS_FAILED++
        $script:FAILED_TESTS += "dotenv manquant"
    }

    Pop-Location
}

function Test-EnvExample {
    Write-Header "Test 8: Vérification de .env.example"

    Push-Location $ServiceRoot

    $envExamplePath = Join-Path $ServiceRoot ".env.example"
    if (-not (Test-Path $envExamplePath)) {
        Write-ErrorMsg -Message ".env.example n'existe pas"
        $script:TESTS_FAILED++
        $script:FAILED_TESTS += ".env.example manquant"
        Pop-Location
        return
    }

    $envContent = Get-Content $envExamplePath -Raw

    # Vérifier la présence de DATABASE_URL
    if ($envContent -match "DATABASE_URL") {
        Write-Success -Message ".env.example contient DATABASE_URL"
        $script:TESTS_PASSED++
    } else {
        Write-ErrorMsg -Message ".env.example ne contient pas DATABASE_URL"
        $script:TESTS_FAILED++
        $script:FAILED_TESTS += "DATABASE_URL manquant dans .env.example"
    }

    # Vérifier la présence des variables individuelles
    $varsToCheck = @("DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD")
    foreach ($var in $varsToCheck) {
        if ($envContent -match $var) {
            Write-Success -Message ".env.example contient $var"
            $script:TESTS_PASSED++
        } else {
            Write-Warning -Message ".env.example ne contient pas $var (optionnel)"
        }
    }

    Pop-Location
}

function Test-PrismaValidate {
    Write-Header "Test 9: Validation du schema Prisma"

    Push-Location $ServiceRoot

    try {
        $output = npx prisma validate --schema=./prisma/schema.prisma 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success -Message "Le schema Prisma est valide"
            $script:TESTS_PASSED++
        } else {
            Write-ErrorMsg -Message "Le schema Prisma a des erreurs de validation"
            Write-Host $output
            $script:TESTS_FAILED++
            $script:FAILED_TESTS += "Schema Prisma invalide"
        }
    } catch {
        Write-Warning "Impossible d'exécuter prisma validate (prisma peut ne pas être installé)"
    }

    Pop-Location
}

function Print-Summary {
    Write-Header "Résumé des Tests"

    Write-Host "Tests réussis: $script:TESTS_PASSED"
    Write-Host "Tests échoués: $script:TESTS_FAILED"
    Write-Host ""

    if ($script:TESTS_FAILED -eq 0) {
        Write-Success -Message "Tous les tests sont passés !"
        Write-Host ""
        Write-Host "Les corrections Prisma 7 sont validées."
        return 0
    } else {
        Write-ErrorMsg -Message "Certains tests ont échoué :"
        foreach ($test in $script:FAILED_TESTS) {
            Write-Host "  - $test"
        }
        Write-Host ""
        Write-Host "Veuillez corriger les problèmes identifiés."
        return 1
    }
}

# =============================================================================
# Exécution des tests
# =============================================================================
function Main {
    Write-Header "Tests des Corrections Prisma 7"

    Write-Info "Répertoire du service: $ServiceRoot"
    Write-Host ""

    # Vérifier que nous sommes dans le bon répertoire
    $packageJsonPath = Join-Path $ServiceRoot "package.json"
    if (-not (Test-Path $packageJsonPath)) {
        Write-ErrorMsg -Message "package.json non trouvé. Êtes-vous dans le bon répertoire ?"
        exit 1
    }

    # Exécuter tous les tests
    Test-FileExistence
    Test-SchemaSyntax
    Test-ConfigSyntax
    Test-PackageScripts
    Test-EnvExample
    Test-PrismaValidate

    # Afficher le résumé
    Print-Summary
}

# Exécuter les tests
Main
