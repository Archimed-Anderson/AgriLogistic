#!/bin/bash
# =============================================================================
# AgroLogistic Web App - Production Deployment Script
# =============================================================================

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Production Deployment for Web App...${NC}"

# Navigate to app directory if not already there
# SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# cd "$SCRIPT_DIR"

# 1. Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install --frozen-lockfile

# 2. Build the application
echo -e "${BLUE}🏗️ Building Next.js application...${NC}"
pnpm build

# 3. Final Check
echo -e "${GREEN}✅ Build successful!${NC}"
echo -e "${BLUE}ℹ️ To start the application in production mode, run:${NC}"
echo -e "${GREEN}pnpm start${NC}"
