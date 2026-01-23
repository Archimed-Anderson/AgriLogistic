#!/bin/bash

# ============================================================
# Kong API Gateway Startup Script
# AgroLogistic 2.0 - Complete Setup \u0026 Deployment
# ============================================================

set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly INFRASTRUCTURE_DIR="$(dirname "$SCRIPT_DIR")"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Print banner
print_banner() {
    echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Kong API Gateway - AgroLogistic 2.0${NC}"
    echo -e "${BLUE}  Phase 1: Complete Setup \u0026 Deployment${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    log_success "Docker found: $(docker --version | head -n1)"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    log_success "Docker Compose found: $(docker-compose --version)"
    
    # Check jq
    if ! command -v jq &> /dev/null; then
        log_warning "jq is not installed. Some features may not work."
    else
        log_success "jq found"
    fi
    
    # Check curl
    if ! command -v curl &> /dev/null; then
        log_error "curl is not installed. Please install curl first."
        exit 1
    fi
    log_success "curl found"
    
    echo ""
}

# Check if Kong is already running
check_kong_status() {
    log_info "Checking Kong status..."
    
    if docker ps | grep -q "agrologistic-kong-gateway"; then
        log_warning "Kong is already running!"
        read -p "Do you want to restart it? (y/N): " -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Stopping existing Kong containers..."
            cd "$INFRASTRUCTURE_DIR"
            docker-compose -f docker-compose.kong.yml down
            log_success "Kong stopped"
        else
            log_info "Keeping existing Kong instance"
            return 1
        fi
    fi
    echo ""
}

# Start Kong stack
start_kong() {
    log_info "Starting Kong API Gateway stack..."
    
    cd "$INFRASTRUCTURE_DIR"
    
    # Start with docker-compose
    log_info "Launching Docker Compose..."
    docker-compose -f docker-compose.kong.yml up -d
    
    log_success "Kong stack started"
    echo ""
}

# Wait for Kong to be ready
wait_for_kong() {
    log_info "Waiting for Kong to be ready..."
    
    local retries=0
    local max_retries=60
    
    while [ $retries -lt $max_retries ]; do
        if curl -sf http://localhost:8001/status > /dev/null 2>&1; then
            log_success "Kong Admin API is ready!"
            echo ""
            return 0
        fi
        
        retries=$((retries + 1))
        echo -n "."
        sleep 2
    done
    
    echo ""
    log_error "Kong did not become ready in time"
    return 1
}

# Initialize Kong configuration
initialize_kong() {
    log_info "Initializing Kong configuration..."
    
    cd "$INFRASTRUCTURE_DIR"
    
    if [ -f "scripts/kong-init.sh" ]; then
        bash scripts/kong-init.sh
        log_success "Kong initialized"
    else
        log_warning "kong-init.sh not found, skipping initialization"
    fi
    
    echo ""
}

# Run tests
run_tests() {
    log_info "Running test suite..."
    
    cd "$INFRASTRUCTURE_DIR"
    
    if [ -f "scripts/kong-test.sh" ]; then
        bash scripts/kong-test.sh
    else
        log_warning "kong-test.sh not found, skipping tests"
    fi
    
    echo ""
}

# Display connection info
display_info() {
    echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Kong Gateway Successfully Deployed!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
    echo ""
    
    echo -e "${BLUE}Available Endpoints:${NC}"
    echo -e "  ${YELLOW}Kong Proxy (HTTP):${NC}    http://localhost:8000"
    echo -e "  ${YELLOW}Kong Proxy (HTTPS):${NC}   https://localhost:8443"
    echo -e "  ${YELLOW}Kong Admin API:${NC}       http://localhost:8001"
    echo -e "  ${YELLOW}Kong Manager:${NC}         http://localhost:8002"
    echo -e "  ${YELLOW}Konga UI:${NC}             http://localhost:1337"
    echo -e "  ${YELLOW}Prometheus:${NC}           http://localhost:9090"
    echo -e "  ${YELLOW}Grafana:${NC}              http://localhost:3001"
    echo ""
    
    echo -e "${BLUE}Quick Test:${NC}"
    echo -e "  curl http://localhost:8001/status"
    echo -e "  curl http://localhost:8000/api/v1/products"
    echo ""
    
    echo -e "${BLUE}View Logs:${NC}"
    echo -e "  docker-compose -f $INFRASTRUCTURE_DIR/docker-compose.kong.yml logs -f"
    echo ""
    
    echo -e "${BLUE}Useful Commands:${NC}"
    echo -e "  ${YELLOW}Stop Kong:${NC}   docker-compose -f $INFRASTRUCTURE_DIR/docker-compose.kong.yml down"
    echo -e "  ${YELLOW}Restart:${NC}     docker-compose -f $INFRASTRUCTURE_DIR/docker-compose.kong.yml restart"
    echo -e "  ${YELLOW}Status:${NC}      docker-compose -f $INFRASTRUCTURE_DIR/docker-compose.kong.yml ps"
    echo ""
    
    if [ -f "$INFRASTRUCTURE_DIR/kong-tokens.txt" ]; then
        echo -e "${BLUE}JWT Tokens:${NC}"
        echo -e "  Saved to: ${YELLOW}$INFRASTRUCTURE_DIR/kong-tokens.txt${NC}"
        echo ""
    fi
}

# Main execution
main() {
    print_banner
    
    # Step 1: Prerequisites
    check_prerequisites
    
    # Step 2: Check status
    if check_kong_status; then
        # Continue with fresh start
        :
    else
        # Kong is running, show info and exit
        display_info
        exit 0
    fi
    
    # Step 3: Start Kong
    start_kong
    
    # Step 4: Wait for Kong
    if ! wait_for_kong; then
        log_error "Failed to start Kong. Check logs with:"
        echo "  docker-compose -f $INFRASTRUCTURE_DIR/docker-compose.kong.yml logs"
        exit 1
    fi
    
    # Step 5: Initialize
    initialize_kong
    
    # Step 6: Run tests (optional)
    read -p "Do you want to run the test suite? (Y/n): " -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        run_tests
    fi
    
    # Step 7: Display info
    display_info
    
    log_success "Kong Gateway Phase 1 deployment completed!"
}

# Run main
main "$@"
