# Agri-Rentals Service - Quick Start Script
# Windows PowerShell script to start Postgre SQL, Redis, and the Rentals service

Write-Host "🚜 Starting Agri-Rentals Service with PostGIS & Redis..." -ForegroundColor Cyan
Write-Host ""

# Function to check if a Docker container exists and is running
function Test-DockerContainer {
    param([string]$ContainerName)
    
    $container = docker ps -a --filter "name=$ContainerName" --format "{{.Names}}" 2>$null
    if ($container -eq $ContainerName) {
        $running = docker ps --filter "name=$ContainerName" --format "{{.Names}}" 2>$null
        if ($running -eq $ContainerName) {
            return "running"
        }
        else {
            return "stopped"
        }
    }
    return "not_found"
}

# Step 1: Start PostgreSQL with PostGIS
Write-Host "📊 Setting up PostgreSQL with PostGIS..." -ForegroundColor Yellow

$postgresStatus = Test-DockerContainer "agrilogistic-postgres"

if ($postgresStatus -eq "running") {
    Write-Host "✅ PostgreSQL is already running" -ForegroundColor Green
}
elseif ($postgresStatus -eq "stopped") {
    Write-Host "▶️  Starting existing PostgreSQL container..." -ForegroundColor Yellow
    docker start agrilogistic-postgres
    Start-Sleep -Seconds 3
    Write-Host "✅ PostgreSQL started" -ForegroundColor Green
}
else {
    Write-Host "🆕 Creating new PostgreSQL container with PostGIS..." -ForegroundColor Yellow
    docker run -d `
        --name agrilogistic-postgres `
        -e POSTGRES_USER=AgriLogistic `
        -e POSTGRES_PASSWORD=AgriLogistic_secure_2026 `
        -e POSTGRES_DB=AgriLogistic `
        -p 5435:5432 `
        postgis/postgis:15-3.3
    
    Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Enable PostGIS extension
    Write-Host "🔧 Enabling PostGIS extension..." -ForegroundColor Yellow
    docker exec agrilogistic-postgres psql -U AgriLogistic -d AgriLogistic -c "CREATE EXTENSION IF NOT EXISTS postgis;"
    
    Write-Host "✅ PostgreSQL with PostGIS created" -ForegroundColor Green
}

Write-Host ""

# Step 2: Start Redis
Write-Host "🔴 Setting up Redis..." -ForegroundColor Yellow

$redisStatus = Test-DockerContainer "agrilogistic-redis"

if ($redisStatus -eq "running") {
    Write-Host "✅ Redis is already running" -ForegroundColor Green
}
elseif ($redisStatus -eq "stopped") {
    Write-Host "▶️  Starting existing Redis container..." -ForegroundColor Yellow
    docker start agrilogistic-redis
    Start-Sleep -Seconds 2
    Write-Host "✅ Redis started" -ForegroundColor Green
}
else {
    Write-Host "🆕 Creating new Redis container..." -ForegroundColor Yellow
    docker run -d `
        --name agrilogistic-redis `
        -p 6379:6379 `
        redis:7-alpine
    
    Start-Sleep -Seconds 2
    Write-Host "✅ Redis created" -ForegroundColor Green
}

Write-Host ""

# Step 3: Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created" -ForegroundColor Green
}
else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

Write-Host ""

# Step 4: Install dependencies if node_modules doesn't exist
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""

# Step 5: Run migrations
Write-Host "🗃️  Running database migrations..." -ForegroundColor Yellow

# Check if migration has already been run
$migrationCheck = docker exec agrilogistic-postgres psql -U AgriLogistic -d AgriLogistic -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Equipment');" 2>$null

if ($migrationCheck -match "t") {
    Write-Host "⏭️  Database schema already exists" -ForegroundColor Cyan
}
else {
    Write-Host "📝 Applying PostGIS migration..." -ForegroundColor Yellow
    Get-Content "prisma\migrations\001_add_postgis.sql" | docker exec -i agrilogistic-postgres psql -U AgriLogistic -d AgriLogistic
    Write-Host "✅ Migration complete" -ForegroundColor Green
}

Write-Host ""

# Step 6: Verify services
Write-Host "🔍 Verifying services..." -ForegroundColor Yellow

# Test PostgreSQL
$pgTest = docker exec agrilogistic-postgres psql -U AgriLogistic -d AgriLogistic -t -c "SELECT PostGIS_Version();" 2>$null
if ($pgTest) {
    Write-Host "✅ PostgreSQL + PostGIS: OK" -ForegroundColor Green
    Write-Host "   PostGIS version: $($pgTest.Trim())" -ForegroundColor Gray
}
else {
    Write-Host "❌ PostgreSQL: FAILED" -ForegroundColor Red
}

# Test Redis
$redisTest = docker exec agrilogistic-redis redis-cli PING 2>$null
if ($redisTest -eq "PONG") {
    Write-Host "✅ Redis: OK" -ForegroundColor Green
}
else {
    Write-Host "❌ Redis: FAILED" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🚀 Infrastructure Ready! Starting NestJS service..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "📍 Service will be available at: http://localhost:3007" -ForegroundColor Green
Write-Host "📚 API Documentation: See POSTGIS_REDIS_GUIDE.md" -ForegroundColor Green
Write-Host ""

# Step 7: Start the NestJS service
npm run start:dev

Write-Host ""
Write-Host "👋 Service stopped" -ForegroundColor Yellow
