# Script pour verifier et creer le fichier .env
# Usage: .\scripts\check-env.ps1

Write-Host "Verification de la configuration..." -ForegroundColor Cyan
Write-Host ""

$envFile = ".env"
$needsUpdate = $false

if (Test-Path $envFile) {
    Write-Host "Fichier .env existe" -ForegroundColor Green
    $content = Get-Content $envFile -Raw
    
    # Verifier les variables critiques
    if ($content -match "DB_PASSWORD=your_secure_db_password" -or 
        $content -match "DB_PASSWORD=\s*`$" -or 
        -not ($content -match "DB_PASSWORD=")) {
        Write-Host "ATTENTION: DB_PASSWORD n'est pas configure correctement" -ForegroundColor Yellow
        $needsUpdate = $true
    }
    
    if (-not ($content -match "JWT_ACCESS_SECRET=")) {
        Write-Host "ATTENTION: JWT_ACCESS_SECRET manquant" -ForegroundColor Yellow
        $needsUpdate = $true
    }
    
    if (-not ($content -match "JWT_REFRESH_SECRET=")) {
        Write-Host "ATTENTION: JWT_REFRESH_SECRET manquant" -ForegroundColor Yellow
        $needsUpdate = $true
    }
} else {
    Write-Host "Fichier .env n'existe pas" -ForegroundColor Red
    $needsUpdate = $true
}

if ($needsUpdate) {
    Write-Host ""
    Write-Host "Creation/mise a jour du fichier .env..." -ForegroundColor Yellow
    
    $useDocker = Read-Host "Utilisez-vous Docker Compose? (O/N)"
    
    if ($useDocker -eq "O" -or $useDocker -eq "o") {
        $envContent = @"
# Database Configuration (Docker)
DB_HOST=localhost
DB_PORT=5433
DB_NAME=AgriLogistic_auth
DB_USER=AgriLogistic
DB_PASSWORD=AgriLogistic_password

# JWT Configuration
JWT_ACCESS_SECRET=AgriLogistic_secure_jwt_access_secret_2026_change_in_production
JWT_REFRESH_SECRET=AgriLogistic_secure_jwt_refresh_secret_2026_change_in_production
JWT_ACCESS_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# Redis Configuration (Docker)
REDIS_HOST=localhost
REDIS_PORT=6380
REDIS_PASSWORD=redis_password

# Server Configuration
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173

# Password Hashing
BCRYPT_SALT_ROUNDS=12

# Admin Default Credentials
ADMIN_EMAIL=admintest@gmail.com
ADMIN_PASSWORD=Admin123
ADMIN_ROLE=admin
"@
    } else {
        $dbPassword = Read-Host "Mot de passe PostgreSQL (ou appuyez sur EntrÃ©e pour 'AgriLogistic_password')"
        if ([string]::IsNullOrWhiteSpace($dbPassword)) {
            $dbPassword = "AgriLogistic_password"
        }
        
        $envContent = @"
# Database Configuration (Local)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=AgriLogistic_auth
DB_USER=AgriLogistic
DB_PASSWORD=$dbPassword

# JWT Configuration
JWT_ACCESS_SECRET=AgriLogistic_secure_jwt_access_secret_2026_change_in_production
JWT_REFRESH_SECRET=AgriLogistic_secure_jwt_refresh_secret_2026_change_in_production
JWT_ACCESS_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# Redis Configuration (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# Server Configuration
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173

# Password Hashing
BCRYPT_SALT_ROUNDS=12

# Admin Default Credentials
ADMIN_EMAIL=admintest@gmail.com
ADMIN_PASSWORD=Admin123
ADMIN_ROLE=admin
"@
    }
    
    Set-Content -Path $envFile -Value $envContent
    Write-Host "Fichier .env cree/mis a jour" -ForegroundColor Green
} else {
    Write-Host "Configuration .env semble correcte" -ForegroundColor Green
}

Write-Host ""
Write-Host "Variables d'environnement actuelles:" -ForegroundColor Cyan
Get-Content $envFile | Select-String -Pattern "^[A-Z_]+=" | ForEach-Object {
    $line = $_.Line
    if ($line -match "PASSWORD|SECRET") {
        $parts = $line -split "=", 2
        Write-Host "  $($parts[0])=***" -ForegroundColor Gray
    } else {
        Write-Host "  $line" -ForegroundColor White
    }
}

