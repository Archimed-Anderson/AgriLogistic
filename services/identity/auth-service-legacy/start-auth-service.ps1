# Script PowerShell pour dÃ©marrer le service d'authentification
# Usage: .\start-auth-service.ps1 [command]
# Commands: seed, dev, build, start, test

param(
    [Parameter(Position=0)]
    [ValidateSet('seed', 'dev', 'build', 'start', 'test', 'help')]
    [string]$Command = 'help'
)

# VÃ©rifier qu'on est dans le bon rÃ©pertoire
if (-not (Test-Path "package.json")) {
    Write-Host "âŒ Erreur: Vous devez Ãªtre dans le rÃ©pertoire AgriLogistic/services/auth-service" -ForegroundColor Red
    Write-Host "ðŸ“ RÃ©pertoire actuel: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "ðŸ’¡ Naviguez vers: cd AgriLogistic/services/auth-service" -ForegroundColor Cyan
    exit 1
}

Write-Host "âœ… RÃ©pertoire correct: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# DÃ©finir les variables d'environnement si elles n'existent pas
if (-not $env:JWT_ACCESS_SECRET) {
    $env:JWT_ACCESS_SECRET = "AgriLogistic_secure_jwt_access_secret_2026"
    Write-Host "âš ï¸  JWT_ACCESS_SECRET non dÃ©fini, utilisation de la valeur par dÃ©faut" -ForegroundColor Yellow
}

if (-not $env:JWT_REFRESH_SECRET) {
    $env:JWT_REFRESH_SECRET = "AgriLogistic_secure_jwt_refresh_secret_2026"
    Write-Host "âš ï¸  JWT_REFRESH_SECRET non dÃ©fini, utilisation de la valeur par dÃ©faut" -ForegroundColor Yellow
}

if (-not $env:NODE_ENV) {
    $env:NODE_ENV = "development"
}

switch ($Command) {
    'seed' {
        Write-Host "ðŸ” Initialisation de l'utilisateur admin..." -ForegroundColor Cyan
        npm run seed:admin
    }
    'dev' {
        Write-Host "ðŸš€ DÃ©marrage en mode dÃ©veloppement..." -ForegroundColor Cyan
        npm run dev
    }
    'build' {
        Write-Host "ðŸ”¨ Compilation de l'application..." -ForegroundColor Cyan
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Host "âœ… Compilation rÃ©ussie!" -ForegroundColor Green
        }
    }
    'start' {
        Write-Host "ðŸš€ DÃ©marrage en mode production..." -ForegroundColor Cyan
        if (-not (Test-Path "dist/index.js")) {
            Write-Host "âš ï¸  L'application n'est pas compilÃ©e. Compilation en cours..." -ForegroundColor Yellow
            npm run build
        }
        npm start
    }
    'test' {
        Write-Host "ðŸ§ª ExÃ©cution des tests..." -ForegroundColor Cyan
        npm test
    }
    'help' {
        Write-Host "ðŸ“š Commandes disponibles:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  .\start-auth-service.ps1 seed   - Initialiser l'utilisateur admin" -ForegroundColor White
        Write-Host "  .\start-auth-service.ps1 dev    - DÃ©marrer en mode dÃ©veloppement" -ForegroundColor White
        Write-Host "  .\start-auth-service.ps1 build  - Compiler l'application" -ForegroundColor White
        Write-Host "  .\start-auth-service.ps1 start  - DÃ©marrer en mode production" -ForegroundColor White
        Write-Host "  .\start-auth-service.ps1 test   - ExÃ©cuter les tests" -ForegroundColor White
        Write-Host ""
        Write-Host "ðŸ’¡ Ou utilisez directement npm:" -ForegroundColor Yellow
        Write-Host "   npm run seed:admin" -ForegroundColor White
        Write-Host "   npm run dev" -ForegroundColor White
        Write-Host "   npm run build" -ForegroundColor White
        Write-Host "   npm start" -ForegroundColor White
    }
}

