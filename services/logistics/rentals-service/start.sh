#!/bin/bash

# Agri-Rentals Service - Quick Start Script
# Linux/Mac bash script to start PostgreSQL, Redis, and the Rentals service

echo "🚜 Starting Agri-Rentals Service with PostGIS & Redis..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Function to check if a Docker container exists and is running
check_container() {
    local container_name=$1
    
    if docker ps -a --filter "name=$container_name" --format "{{.Names}}" | grep -q "^${container_name}$"; then
        if docker ps --filter "name=$container_name" --format "{{.Names}}" | grep -q "^${container_name}$"; then
            echo "running"
        else
            echo "stopped"
        fi
    else
        echo "not_found"
    fi
}

# Step 1: Start PostgreSQL with PostGIS
echo -e "${YELLOW}📊 Setting up PostgreSQL with PostGIS...${NC}"

postgres_status=$(check_container "agrilogistic-postgres")

if [ "$postgres_status" == "running" ]; then
    echo -e "${GREEN}✅ PostgreSQL is already running${NC}"
elif [ "$postgres_status" == "stopped" ]; then
    echo -e "${YELLOW}▶️  Starting existing PostgreSQL container...${NC}"
    docker start agrilogistic-postgres
    sleep 3
    echo -e "${GREEN}✅ PostgreSQL started${NC}"
else
    echo -e "${YELLOW}🆕 Creating new PostgreSQL container with PostGIS...${NC}"
    docker run -d \
        --name agrilogistic-postgres \
        -e POSTGRES_USER=AgriLogistic \
        -e POSTGRES_PASSWORD=AgriLogistic_secure_2026 \
        -e POSTGRES_DB=AgriLogistic \
        -p 5435:5432 \
        postgis/postgis:15-3.3
    
    echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
    sleep 5
    
    # Enable PostGIS extension
    echo -e "${YELLOW}🔧 Enabling PostGIS extension...${NC}"
    docker exec agrilogistic-postgres psql -U AgriLogistic -d AgriLogistic -c "CREATE EXTENSION IF NOT EXISTS postgis;"
    
    echo -e "${GREEN}✅ PostgreSQL with PostGIS created${NC}"
fi

echo ""

# Step 2: Start Redis
echo -e "${YELLOW}🔴 Setting up Redis...${NC}"

redis_status=$(check_container "agrilogistic-redis")

if [ "$redis_status" == "running" ]; then
    echo -e "${GREEN}✅ Redis is already running${NC}"
elif [ "$redis_status" == "stopped" ]; then
    echo -e "${YELLOW}▶️  Starting existing Redis container...${NC}"
    docker start agrilogistic-redis
    sleep 2
    echo -e "${GREEN}✅ Redis started${NC}"
else
    echo -e "${YELLOW}🆕 Creating new Redis container...${NC}"
    docker run -d \
        --name agrilogistic-redis \
        -p 6379:6379 \
        redis:7-alpine
    
    sleep 2
    echo -e "${GREEN}✅ Redis created${NC}"
fi

echo ""

# Step 3: Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Copying from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

echo ""

# Step 4: Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

echo ""

# Step 5: Run migrations
echo -e "${YELLOW}🗃️  Running database migrations...${NC}"

# Check if migration has already been run
migration_check=$(docker exec agrilogistic-postgres psql -U AgriLogistic -d AgriLogistic -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Equipment');" 2>/dev/null | tr -d ' ')

if [ "$migration_check" == "t" ]; then
    echo -e "${CYAN}⏭️  Database schema already exists${NC}"
else
    echo -e "${YELLOW}📝 Applying PostGIS migration...${NC}"
    docker exec -i agrilogistic-postgres psql -U AgriLogistic -d AgriLogistic < prisma/migrations/001_add_postgis.sql
    echo -e "${GREEN}✅ Migration complete${NC}"
fi

echo ""

# Step 6: Verify services
echo -e "${YELLOW}🔍 Verifying services...${NC}"

# Test PostgreSQL
pg_test=$(docker exec agrilogistic-postgres psql -U AgriLogistic -d AgriLogistic -t -c "SELECT PostGIS_Version();" 2>/dev/null)
if [ -n "$pg_test" ]; then
    echo -e "${GREEN}✅ PostgreSQL + PostGIS: OK${NC}"
    echo -e "${GRAY}   PostGIS version: $(echo $pg_test | xargs)${NC}"
else
    echo -e "${RED}❌ PostgreSQL: FAILED${NC}"
fi

# Test Redis
redis_test=$(docker exec agrilogistic-redis redis-cli PING 2>/dev/null)
if [ "$redis_test" == "PONG" ]; then
    echo -e "${GREEN}✅ Redis: OK${NC}"
else
    echo -e "${RED}❌ Redis: FAILED${NC}"
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🚀 Infrastructure Ready! Starting NestJS service...${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}📍 Service will be available at: http://localhost:3007${NC}"
echo -e "${GREEN}📚 API Documentation: See POSTGIS_REDIS_GUIDE.md${NC}"
echo ""

# Step 7: Start the NestJS service
npm run start:dev

echo ""
echo -e "${YELLOW}👋 Service stopped${NC}"
