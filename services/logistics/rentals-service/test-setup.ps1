# Test Setup Script - Simplified version for validation
Write-Host "🧪 Setting up test environment for Agri-Rentals..." -ForegroundColor Cyan
Write-Host ""

# Use different ports to avoid conflicts
$POSTGRES_PORT = 5436
$REDIS_PORT = 6380

# Step 1: Start PostgreSQL with PostGIS
Write-Host "📊 Starting PostgreSQL with PostGIS (port $POSTGRES_PORT)..." -ForegroundColor Yellow

docker rm -f agrilogistic-postgres-test 2>$null

docker run -d `
    --name agrilogistic-postgres-test `
    -e POSTGRES_USER=AgriLogistic `
    -e POSTGRES_PASSWORD=AgriLogistic_secure_2026 `
    -e POSTGRES_DB=AgriLogistic `
    -p ${POSTGRES_PORT}:5432 `
    postgis/postgis:15-3.3

Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Enable PostGIS
Write-Host "🔧 Enabling PostGIS extension..." -ForegroundColor Yellow
docker exec agrilogistic-postgres-test psql -U AgriLogistic -d AgriLogistic -c "CREATE EXTENSION IF NOT EXISTS postgis;"

Write-Host "✅ PostgreSQL ready" -ForegroundColor Green
Write-Host ""

# Step 2: Start Redis
Write-Host "🔴 Starting Redis (port $REDIS_PORT)..." -ForegroundColor Yellow

docker rm -f agrilogistic-redis-test 2>$null

docker run -d `
    --name agrilogistic-redis-test `
    -p ${REDIS_PORT}:6379 `
    redis:7-alpine

Start-Sleep -Seconds 2
Write-Host "✅ Redis ready" -ForegroundColor Green
Write-Host ""

# Step 3: Create .env for tests
Write-Host "📝 Creating test .env file..." -ForegroundColor Yellow

$envContent = @"
NODE_ENV=test
PORT=3007
DATABASE_URL=postgresql://AgriLogistic:AgriLogistic_secure_2026@localhost:$POSTGRES_PORT/AgriLogistic
REDIS_HOST=localhost
REDIS_PORT=$REDIS_PORT
REDIS_PASSWORD=
REDIS_DB=0
JWT_SECRET=test_secret
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
"@

$envContent | Out-File -FilePath ".env.test" -Encoding UTF8
Write-Host "✅ .env.test created" -ForegroundColor Green
Write-Host ""

# Step 4: Run migrations
Write-Host "🗃️  Running PostGIS migration..." -ForegroundColor Yellow
Get-Content "prisma\migrations\001_add_postgis.sql" | docker exec -i agrilogistic-postgres-test psql -U AgriLogistic -d AgriLogistic
Write-Host "✅ Migration complete" -ForegroundColor Green
Write-Host ""

# Step 5: Verify services
Write-Host "🔍 Verifying services..." -ForegroundColor Yellow

$pgTest = docker exec agrilogistic-postgres-test psql -U AgriLogistic -d AgriLogistic -t -c "SELECT PostGIS_Version();" 2>$null
if ($pgTest) {
    Write-Host "✅ PostgreSQL + PostGIS: OK" -ForegroundColor Green
    Write-Host "   Version: $($pgTest.Trim())" -ForegroundColor Gray
}
else {
    Write-Host "❌ PostgreSQL: FAILED" -ForegroundColor Red
    exit 1
}

$redisTest = docker exec agrilogistic-redis-test redis-cli PING 2>$null
if ($redisTest -eq "PONG") {
    Write-Host "✅ Redis: OK" -ForegroundColor Green
}
else {
    Write-Host "❌ Redis: FAILED" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ Test environment ready!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "PostgreSQL: localhost:$POSTGRES_PORT" -ForegroundColor Cyan
Write-Host "Redis: localhost:$REDIS_PORT" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run tests:" -ForegroundColor Yellow
Write-Host "  npm test" -ForegroundColor White
Write-Host ""
Write-Host "To cleanup:" -ForegroundColor Yellow
Write-Host "  docker rm -f agrilogistic-postgres-test agrilogistic-redis-test" -ForegroundColor White
