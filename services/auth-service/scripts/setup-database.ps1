# Script PowerShell pour configurer la base de données PostgreSQL
# Usage: .\scripts\setup-database.ps1

param(
    [switch]$UseDocker = $false,
    [string]$DbUser = "agrodeep",
    [string]$DbPassword = "agrodeep_password",
    [string]$DbName = "agrodeep_auth"
)

Write-Host "🗄️  Configuration de la Base de Données PostgreSQL" -ForegroundColor Cyan
Write-Host ""

if ($UseDocker) {
    Write-Host "🐳 Utilisation de Docker Compose..." -ForegroundColor Yellow
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Services Docker démarrés" -ForegroundColor Green
        Write-Host "⏳ Attente du démarrage de PostgreSQL..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        # Mettre à jour le .env pour Docker
        $envContent = @"
DB_HOST=localhost
DB_PORT=5433
DB_NAME=$DbName
DB_USER=$DbUser
DB_PASSWORD=$DbPassword
JWT_ACCESS_SECRET=agrodeep_secure_jwt_access_secret_2026
JWT_REFRESH_SECRET=agrodeep_secure_jwt_refresh_secret_2026
REDIS_HOST=localhost
REDIS_PORT=6380
REDIS_PASSWORD=redis_password
"@
        Set-Content -Path ".env" -Value $envContent
        Write-Host "✅ Fichier .env mis à jour pour Docker" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Ports:" -ForegroundColor Cyan
        Write-Host "   PostgreSQL: 5433 (externe) -> 5432 (interne)" -ForegroundColor White
        Write-Host "   Redis: 6380 (externe) -> 6379 (interne)" -ForegroundColor White
    } else {
        Write-Host "❌ Erreur lors du démarrage de Docker" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "📝 Configuration PostgreSQL locale..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Exécutez les commandes suivantes dans psql (en tant qu'administrateur):" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "CREATE DATABASE $DbName;" -ForegroundColor White
    Write-Host "CREATE USER $DbUser WITH PASSWORD '$DbPassword';" -ForegroundColor White
    Write-Host "GRANT ALL PRIVILEGES ON DATABASE $DbName TO $DbUser;" -ForegroundColor White
    Write-Host "ALTER USER $DbUser CREATEDB;" -ForegroundColor White
    Write-Host ""
    
    $response = Read-Host "Avez-vous créé la base de données et l'utilisateur? (O/N)"
    if ($response -ne "O" -and $response -ne "o") {
        Write-Host "❌ Veuillez créer la base de données d'abord" -ForegroundColor Red
        exit 1
    }
    
    # Créer/mettre à jour le .env
    $envContent = @"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=$DbName
DB_USER=$DbUser
DB_PASSWORD=$DbPassword
JWT_ACCESS_SECRET=agrodeep_secure_jwt_access_secret_2026
JWT_REFRESH_SECRET=agrodeep_secure_jwt_refresh_secret_2026
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password
"@
    Set-Content -Path ".env" -Value $envContent
    Write-Host "✅ Fichier .env créé/mis à jour" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Cyan
Write-Host "  1. npm run seed:admin" -ForegroundColor White
Write-Host "  2. npm run dev" -ForegroundColor White
