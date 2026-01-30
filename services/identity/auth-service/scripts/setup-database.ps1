# Script PowerShell pour configurer la base de donnÃ©es PostgreSQL
# Usage: .\scripts\setup-database.ps1

param(
    [switch]$UseDocker = $false,
    [string]$DbUser = "AgriLogistic",
    [string]$DbPassword = "AgriLogistic_password",
    [string]$DbName = "AgriLogistic_auth"
)

Write-Host "ðŸ—„ï¸  Configuration de la Base de DonnÃ©es PostgreSQL" -ForegroundColor Cyan
Write-Host ""

if ($UseDocker) {
    Write-Host "ðŸ³ Utilisation de Docker Compose..." -ForegroundColor Yellow
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "âœ… Services Docker dÃ©marrÃ©s" -ForegroundColor Green
        Write-Host "â³ Attente du dÃ©marrage de PostgreSQL..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        # Mettre Ã  jour le .env pour Docker
        $envContent = @"
DB_HOST=localhost
DB_PORT=5433
DB_NAME=$DbName
DB_USER=$DbUser
DB_PASSWORD=$DbPassword
JWT_ACCESS_SECRET=AgriLogistic_secure_jwt_access_secret_2026
JWT_REFRESH_SECRET=AgriLogistic_secure_jwt_refresh_secret_2026
REDIS_HOST=localhost
REDIS_PORT=6380
REDIS_PASSWORD=redis_password
"@
        Set-Content -Path ".env" -Value $envContent
        Write-Host "âœ… Fichier .env mis Ã  jour pour Docker" -ForegroundColor Green
        Write-Host ""
        Write-Host "ðŸ“ Ports:" -ForegroundColor Cyan
        Write-Host "   PostgreSQL: 5433 (externe) -> 5432 (interne)" -ForegroundColor White
        Write-Host "   Redis: 6380 (externe) -> 6379 (interne)" -ForegroundColor White
    } else {
        Write-Host "âŒ Erreur lors du dÃ©marrage de Docker" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ðŸ“ Configuration PostgreSQL locale..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ExÃ©cutez les commandes suivantes dans psql (en tant qu'administrateur):" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "CREATE DATABASE $DbName;" -ForegroundColor White
    Write-Host "CREATE USER $DbUser WITH PASSWORD '$DbPassword';" -ForegroundColor White
    Write-Host "GRANT ALL PRIVILEGES ON DATABASE $DbName TO $DbUser;" -ForegroundColor White
    Write-Host "ALTER USER $DbUser CREATEDB;" -ForegroundColor White
    Write-Host ""
    
    $response = Read-Host "Avez-vous crÃ©Ã© la base de donnÃ©es et l'utilisateur? (O/N)"
    if ($response -ne "O" -and $response -ne "o") {
        Write-Host "âŒ Veuillez crÃ©er la base de donnÃ©es d'abord" -ForegroundColor Red
        exit 1
    }
    
    # CrÃ©er/mettre Ã  jour le .env
    $envContent = @"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=$DbName
DB_USER=$DbUser
DB_PASSWORD=$DbPassword
JWT_ACCESS_SECRET=AgriLogistic_secure_jwt_access_secret_2026
JWT_REFRESH_SECRET=AgriLogistic_secure_jwt_refresh_secret_2026
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password
"@
    Set-Content -Path ".env" -Value $envContent
    Write-Host "âœ… Fichier .env crÃ©Ã©/mis Ã  jour" -ForegroundColor Green
}

Write-Host ""
Write-Host "âœ… Configuration terminÃ©e!" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines Ã©tapes:" -ForegroundColor Cyan
Write-Host "  1. npm run seed:admin" -ForegroundColor White
Write-Host "  2. npm run dev" -ForegroundColor White

