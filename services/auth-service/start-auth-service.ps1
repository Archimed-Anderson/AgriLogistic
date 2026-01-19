# Script PowerShell pour démarrer le service d'authentification
# Usage: .\start-auth-service.ps1 [command]
# Commands: seed, dev, build, start, test

param(
    [Parameter(Position=0)]
    [ValidateSet('seed', 'dev', 'build', 'start', 'test', 'help')]
    [string]$Command = 'help'
)

# Vérifier qu'on est dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: Vous devez être dans le répertoire AgroDeep/services/auth-service" -ForegroundColor Red
    Write-Host "📁 Répertoire actuel: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "💡 Naviguez vers: cd AgroDeep/services/auth-service" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Répertoire correct: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Définir les variables d'environnement si elles n'existent pas
if (-not $env:JWT_ACCESS_SECRET) {
    $env:JWT_ACCESS_SECRET = "agrodeep_secure_jwt_access_secret_2026"
    Write-Host "⚠️  JWT_ACCESS_SECRET non défini, utilisation de la valeur par défaut" -ForegroundColor Yellow
}

if (-not $env:JWT_REFRESH_SECRET) {
    $env:JWT_REFRESH_SECRET = "agrodeep_secure_jwt_refresh_secret_2026"
    Write-Host "⚠️  JWT_REFRESH_SECRET non défini, utilisation de la valeur par défaut" -ForegroundColor Yellow
}

if (-not $env:NODE_ENV) {
    $env:NODE_ENV = "development"
}

switch ($Command) {
    'seed' {
        Write-Host "🔐 Initialisation de l'utilisateur admin..." -ForegroundColor Cyan
        npm run seed:admin
    }
    'dev' {
        Write-Host "🚀 Démarrage en mode développement..." -ForegroundColor Cyan
        npm run dev
    }
    'build' {
        Write-Host "🔨 Compilation de l'application..." -ForegroundColor Cyan
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Compilation réussie!" -ForegroundColor Green
        }
    }
    'start' {
        Write-Host "🚀 Démarrage en mode production..." -ForegroundColor Cyan
        if (-not (Test-Path "dist/index.js")) {
            Write-Host "⚠️  L'application n'est pas compilée. Compilation en cours..." -ForegroundColor Yellow
            npm run build
        }
        npm start
    }
    'test' {
        Write-Host "🧪 Exécution des tests..." -ForegroundColor Cyan
        npm test
    }
    'help' {
        Write-Host "📚 Commandes disponibles:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  .\start-auth-service.ps1 seed   - Initialiser l'utilisateur admin" -ForegroundColor White
        Write-Host "  .\start-auth-service.ps1 dev    - Démarrer en mode développement" -ForegroundColor White
        Write-Host "  .\start-auth-service.ps1 build  - Compiler l'application" -ForegroundColor White
        Write-Host "  .\start-auth-service.ps1 start  - Démarrer en mode production" -ForegroundColor White
        Write-Host "  .\start-auth-service.ps1 test   - Exécuter les tests" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 Ou utilisez directement npm:" -ForegroundColor Yellow
        Write-Host "   npm run seed:admin" -ForegroundColor White
        Write-Host "   npm run dev" -ForegroundColor White
        Write-Host "   npm run build" -ForegroundColor White
        Write-Host "   npm start" -ForegroundColor White
    }
}
