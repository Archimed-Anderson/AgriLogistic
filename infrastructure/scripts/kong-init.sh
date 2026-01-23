#!/bin/bash

# ============================================================
# Kong API Gateway Initialization Script
# AgroLogistic 2.0 - Docker Compose Version
# ============================================================

set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Configuration
readonly KONG_ADMIN_URL="http://localhost:8001"
readonly KONG_PROXY_URL="http://localhost:8000"
readonly MAX_RETRIES=30
readonly RETRY_INTERVAL=2

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

# Wait for Kong Admin API to be ready
wait_for_kong() {
    log_info "Waiting for Kong Admin API to be ready..."
    local retries=0
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -sf "${KONG_ADMIN_URL}/status" > /dev/null 2>&1; then
            log_success "Kong Admin API is ready!"
            return 0
        fi
        
        retries=$((retries + 1))
        echo -n "."
        sleep $RETRY_INTERVAL
    done
    
    log_error "Kong Admin API did not become ready in time"
    return 1
}

# Get Kong version
get_kong_version() {
    local version
    version=$(curl -sf "${KONG_ADMIN_URL}/" | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
    log_info "Kong version: ${version}"
}

# Create or update a service
create_service() {
    local service_name=$1
    local service_url=$2
    local service_tags=${3:-""}
    
    log_info "Creating service: ${service_name}"
    
    local response
    response=$(curl -sf -X POST "${KONG_ADMIN_URL}/services" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"${service_name}\",
            \"url\": \"${service_url}\",
            \"tags\": [${service_tags}],
            \"connect_timeout\": 60000,
            \"write_timeout\": 60000,
            \"read_timeout\": 60000,
            \"retries\": 3
        }" 2>&1)
    
    if echo "$response" | grep -q "conflict"; then
        log_warning "Service ${service_name} already exists"
    else
        log_success "Service ${service_name} created"
    fi
}

# Create route for a service
create_route() {
    local service_name=$1
    local route_name=$2
    local route_paths=$3
    local route_methods=${4:-"GET,POST,PUT,DELETE"}
    
    log_info "Creating route: ${route_name} for service ${service_name}"
    
    # Convert comma-separated methods to JSON array
    local methods_json=$(echo "$route_methods" | jq -R 'split(",") | map(. | ascii_upcase)')
    # Convert comma-separated paths to JSON array
    local paths_json=$(echo "$route_paths" | jq -R 'split(",")')
    
    local response
    response=$(curl -sf -X POST "${KONG_ADMIN_URL}/services/${service_name}/routes" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"${route_name}\",
            \"paths\": ${paths_json},
            \"methods\": ${methods_json},
            \"strip_path\": false,
            \"preserve_host\": false
        }" 2>&1)
    
    if echo "$response" | grep -q "conflict"; then
        log_warning "Route ${route_name} already exists"
    else
        log_success "Route ${route_name} created"
    fi
}

# Enable plugin on service
enable_plugin() {
    local service_name=$1
    local plugin_name=$2
    local plugin_config=${3:-"{}"}
    
    log_info "Enabling plugin ${plugin_name} on service ${service_name}"
    
    local response
    response=$(curl -sf -X POST "${KONG_ADMIN_URL}/services/${service_name}/plugins" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"${plugin_name}\",
            \"config\": ${plugin_config}
        }" 2>&1)
    
    if echo "$response" | grep -q "conflict"; then
        log_warning "Plugin ${plugin_name} already enabled on ${service_name}"
    else
        log_success "Plugin ${plugin_name} enabled on ${service_name}"
    fi
}

# Create JWT consumer
create_consumer() {
    local username=$1
    local custom_id=$2
    
    log_info "Creating consumer: ${username}"
    
    local response
    response=$(curl -sf -X POST "${KONG_ADMIN_URL}/consumers" \
        -H "Content-Type: application/json" \
        -d "{
            \"username\": \"${username}\",
            \"custom_id\": \"${custom_id}\"
        }" 2>&1)
    
    if echo "$response" | grep -q "conflict"; then
        log_warning "Consumer ${username} already exists"
    else
        log_success "Consumer ${username} created"
    fi
}

#
# NOTE RS256:
# Les credentials JWT (RS256) sont déclarés dans `kong/kong.yml` et importés via
# `kong config db_import` pendant le bootstrap. Le token de test doit être obtenu
# auprès de l'auth-service (signature RSA privée côté service).

# ============================================================
# Main Script
# ============================================================

main() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}  Kong API Gateway Initialization${NC}"
    echo -e "${BLUE}  AgroLogistic 2.0${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
    
    # Wait for Kong to be ready
    if ! wait_for_kong; then
        log_error "Failed to connect to Kong Admin API"
        exit 1
    fi
    
    echo ""
    get_kong_version
    echo ""
    
    # ========================================
    # Create Services
    # ========================================
    log_info "Creating services..."
    
    create_service "auth-service" "http://auth-service:8001" "\"auth\",\"critical\""
    create_service "product-service" "http://product-service:8002" "\"marketplace\""
    create_service "order-service" "http://order-service:8003" "\"order\""
    create_service "logistics-service" "http://logistics-service:8004" "\"logistics\""
    create_service "payment-service" "http://payment-service:8005" "\"payment\",\"critical\""
    create_service "notification-service" "http://notification-service:8006" "\"notification\""
    create_service "analytics-service" "http://analytics-service:8007" "\"analytics\""
    create_service "ai-service" "http://ai-service:8008" "\"ai\""
    create_service "blockchain-service" "http://blockchain-service:8009" "\"blockchain\""
    create_service "inventory-service" "http://inventory-service:8010" "\"inventory\""
    create_service "user-service" "http://user-service:8011" "\"user\""
    
    echo ""
    
    # ========================================
    # Create Routes
    # ========================================
    log_info "Creating routes..."
    
    # Auth Service Routes
    create_route "auth-service" "auth-login" "/api/v1/auth/login" "POST"
    create_route "auth-service" "auth-register" "/api/v1/auth/register" "POST"
    create_route "auth-service" "auth-refresh" "/api/v1/auth/refresh" "POST"
    
    # Product Service Routes
    create_route "product-service" "products-list" "/api/v1/products" "GET"
    create_route "product-service" "product-search" "/api/v1/products/search" "POST"
    
    # Order Service Routes
    create_route "order-service" "orders-create" "/api/v1/orders" "POST"
    create_route "order-service" "orders-list" "/api/v1/orders" "GET"
    
    # Other services (simplified)
    create_route "logistics-service" "logistics-track" "/api/v1/logistics" "GET,POST"
    create_route "payment-service" "payments" "/api/v1/payments" "GET,POST"
    create_route "notification-service" "notifications" "/api/v1/notifications" "GET,POST"
    create_route "analytics-service" "analytics" "/api/v1/analytics" "GET,POST"
    create_route "ai-service" "ai-endpoints" "/api/v1/ai" "POST"
    create_route "blockchain-service" "blockchain" "/api/v1/blockchain" "GET,POST"
    create_route "inventory-service" "inventory" "/api/v1/inventory" "GET,PUT,PATCH"
    create_route "user-service" "users" "/api/v1/users" "GET,POST,PUT"
    
    echo ""
    
    # ========================================
    # Enable Plugins
    # ========================================
    log_info "Enabling plugins..."
    
    # Rate limiting on auth service
    enable_plugin "auth-service" "rate-limiting" '{"minute":100,"hour":1000,"policy":"local"}'
    
    # JWT on protected services
    for service in product-service order-service logistics-service payment-service notification-service analytics-service ai-service blockchain-service inventory-service user-service; do
        enable_plugin "$service" "jwt" '{"key_claim_name":"kid"}'
    done
    
    # CORS (global)
    log_info "Enabling global CORS plugin..."
    curl -sf -X POST "${KONG_ADMIN_URL}/plugins" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "cors",
            "config": {
                "origins": ["http://localhost:3000","http://localhost:5173"],
                "methods": ["GET","POST","PUT","DELETE","OPTIONS"],
                "headers": ["Authorization","Content-Type"],
                "credentials": true,
                "max_age": 3600
            }
        }' > /dev/null
    
    echo ""
    
    # ========================================
    # Create Consumers (optional in DB mode)
    # ========================================
    log_info "Ensuring consumers exist (optional - may already be imported from kong.yml)..."

    create_consumer "agrologistic-web-app" "web-client-v1"
    create_consumer "agrologistic-mobile-app" "mobile-client-v1"
    create_consumer "agrologistic-admin" "admin-client-v1"

    echo ""

    # ========================================
    # Obtain a Test Token (from auth-service)
    # ========================================
    log_info "Obtaining a test JWT token from auth-service (/api/v1/auth/login)..."

    # Default credentials from mock DB in backend/auth-service/app/main.py
    # NOTE: This endpoint expects JSON {\"email\",\"password\"}
    local login_response
    login_response=$(curl -s -X POST "${KONG_PROXY_URL}/api/v1/auth/login" \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@agrologistic.app","password":"admin123"}' || true)

    local web_token
    web_token=$(echo "$login_response" | jq -r '.access_token // empty')

    if [ -z "$web_token" ]; then
      log_warning "Could not extract access_token from auth-service response."
      log_warning "Raw response: $login_response"
    fi

    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}  Kong Gateway Initial Configuration Complete!${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    
    # ========================================
    # Display Information
    # ========================================
    echo -e "${BLUE}Endpoints:${NC}"
    echo -e "  Kong Proxy:     ${KONG_PROXY_URL}"
    echo -e "  Kong Admin API: ${KONG_ADMIN_URL}"
    echo -e "  Konga UI:       http://localhost:1337"
    echo ""
    
    echo -e "${BLUE}Test Token (RS256):${NC}"
    echo -e "${YELLOW}Web App Token:${NC}"
    echo "$web_token"
    echo ""
    
    echo -e "${BLUE}Test Commands:${NC}"
    echo -e "${YELLOW}# Health check${NC}"
    echo "curl ${KONG_PROXY_URL}/api/v1/products"
    echo ""
    echo -e "${YELLOW}# Authenticated request${NC}"
    echo "curl ${KONG_PROXY_URL}/api/v1/products \\"
    echo "  -H \"Authorization: Bearer ${web_token}\""
    echo ""
    
    # Save tokens to file
    cat > kong-tokens.txt << EOF
Kong Gateway - JWT Test Tokens
================================

Web App Token:
${web_token}

Usage:
curl http://localhost:8000/api/v1/products \\
  -H "Authorization: Bearer \${TOKEN}"
EOF
    
    log_success "Test tokens saved to kong-tokens.txt"
    echo ""
}

# Run main script
main "$@"
