@echo off
echo ========================================
echo Agri-Rentals Test Environment Setup
echo ========================================
echo.

REM Clean up existing test containers
echo Cleaning up existing containers...
docker rm -f agrilogistic-postgres-test 2>nul
docker rm -f agrilogistic-redis-test 2>nul
echo.

REM Start PostgreSQL with PostGIS
echo Starting PostgreSQL with PostGIS (port 5436)...
docker run -d --name agrilogistic-postgres-test -e POSTGRES_USER=AgriLogistic -e POSTGRES_PASSWORD=AgriLogistic_secure_2026 -e POSTGRES_DB=AgriLogistic -p 5436:5432 postgis/postgis:15-3.3

echo Waiting for PostgreSQL to be ready...
timeout /t 10 /nobreak >nul

echo Enabling PostGIS extension...
docker exec agrilogistic-postgres-test psql -U AgriLogistic -d AgriLogistic -c "CREATE EXTENSION IF NOT EXISTS postgis;"
echo.

REM Start Redis
echo Starting Redis (port 6380)...
docker run -d --name agrilogistic-redis-test -p 6380:6379 redis:7-alpine

timeout /t 3 /nobreak >nul
echo.

REM Create .env.test file
echo Creating .env.test file...
(
echo NODE_ENV=test
echo PORT=3007
echo DATABASE_URL=postgresql://AgriLogistic:AgriLogistic_secure_2026@localhost:5436/AgriLogistic
echo REDIS_HOST=localhost
echo REDIS_PORT=6380
echo REDIS_PASSWORD=
echo REDIS_DB=0
echo JWT_SECRET=test_secret
echo LOG_LEVEL=debug
echo CORS_ORIGIN=http://localhost:3000
) > .env.test
echo.

REM Run migrations
echo Running PostGIS migration...
type prisma\migrations\001_add_postgis.sql | docker exec -i agrilogistic-postgres-test psql -U AgriLogistic -d AgriLogistic
echo.

REM Verify services
echo Verifying services...
docker exec agrilogistic-postgres-test psql -U AgriLogistic -d AgriLogistic -t -c "SELECT PostGIS_Version();"
docker exec agrilogistic-redis-test redis-cli PING
echo.

echo ========================================
echo Test environment ready!
echo ========================================
echo PostgreSQL: localhost:5436
echo Redis: localhost:6380
echo.
echo To run tests: npm test
echo To cleanup: docker rm -f agrilogistic-postgres-test agrilogistic-redis-test
