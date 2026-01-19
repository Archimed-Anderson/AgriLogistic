# Script pour resoudre les problemes de base de donnees
# Usage: .\scripts\fix-database.ps1

Write-Host "Resolution des problemes de base de donnees" -ForegroundColor Cyan
Write-Host ""

# Verifier si le port 5432 est utilise
$port5432 = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue
if ($port5432) {
    Write-Host "ATTENTION: Le port 5432 est deja utilise" -ForegroundColor Yellow
    Write-Host "  Processus: $($port5432.OwningProcess)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "  1. Utiliser Docker Compose (port 5433) - RECOMMANDE" -ForegroundColor White
    Write-Host "  2. Creer l'utilisateur PostgreSQL local" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "Votre choix (1 ou 2)"
    
    if ($choice -eq "1") {
        Write-Host ""
        Write-Host "Demarrage de Docker Compose..." -ForegroundColor Yellow
        
        # Creer le reseau si necessaire
        docker network create agrodeep-network 2>$null
        
        # Demarrer les services
        docker-compose up -d
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Attente du demarrage des services..." -ForegroundColor Yellow
            Start-Sleep -Seconds 15
            
            # Mettre a jour le .env pour Docker
            if (Test-Path .env) {
                $content = Get-Content .env -Raw
                $content = $content -replace "DB_PORT=5432", "DB_PORT=5433"
                $content = $content -replace "DB_PASSWORD=.*", "DB_PASSWORD=agrodeep_password"
                Set-Content .env -Value $content
                Write-Host "Fichier .env mis a jour pour Docker (port 5433)" -ForegroundColor Green
            }
            
            Write-Host ""
            Write-Host "Verification des conteneurs..." -ForegroundColor Yellow
            docker ps --filter "name=agrodeep" --format "table {{.Names}}\t{{.Status}}"
            
            Write-Host ""
            Write-Host "Prochaines etapes:" -ForegroundColor Cyan
            Write-Host "  npm run seed:admin" -ForegroundColor White
            Write-Host "  npm run dev" -ForegroundColor White
        } else {
            Write-Host "Erreur lors du demarrage de Docker" -ForegroundColor Red
        }
    } else {
        Write-Host ""
        Write-Host "Creation de l'utilisateur PostgreSQL local..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Executez ces commandes dans psql (en tant qu'administrateur):" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  psql -U postgres" -ForegroundColor White
        Write-Host "  CREATE DATABASE agrodeep_auth;" -ForegroundColor White
        Write-Host "  CREATE USER agrodeep WITH PASSWORD 'agrodeep_password';" -ForegroundColor White
        Write-Host "  GRANT ALL PRIVILEGES ON DATABASE agrodeep_auth TO agrodeep;" -ForegroundColor White
        Write-Host "  ALTER USER agrodeep CREATEDB;" -ForegroundColor White
        Write-Host "  \q" -ForegroundColor White
        Write-Host ""
        
        $done = Read-Host "Avez-vous cree l'utilisateur et la base de donnees? (O/N)"
        if ($done -eq "O" -or $done -eq "o") {
            # Verifier le .env
            if (Test-Path .env) {
                $content = Get-Content .env -Raw
                $content = $content -replace "DB_PORT=5433", "DB_PORT=5432"
                $content = $content -replace "DB_PASSWORD=.*", "DB_PASSWORD=agrodeep_password"
                Set-Content .env -Value $content
                Write-Host "Fichier .env mis a jour pour PostgreSQL local (port 5432)" -ForegroundColor Green
            }
            
            Write-Host ""
            Write-Host "Test de la connexion..." -ForegroundColor Yellow
            Write-Host "  npm run seed:admin" -ForegroundColor White
        }
    }
} else {
    Write-Host "Le port 5432 est libre" -ForegroundColor Green
    Write-Host "Vous pouvez utiliser PostgreSQL local ou Docker" -ForegroundColor Cyan
}
