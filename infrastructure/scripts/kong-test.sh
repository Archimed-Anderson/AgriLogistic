#!/bin/bash

# ============================================================
# Kong API Gateway Test Suite
# AgroLogistic 2.0 - Comprehensive Testing
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
readonly KONGA_URL="http://localhost:1337"
readonly PROMETHEUS_URL="http://localhost:9090"
readonly GRAFANA_URL="http://localhost:3001"

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓ PASS]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗ FAIL]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Test function wrapper
run_test() {
    local test_name=$1
    local test_command=$2
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    echo ""
    log_info "Test ${TESTS_TOTAL}: ${test_name}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        log_success "${test_name}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        log_error "${test_name}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# ============================================================
# Infrastructure Tests
# ============================================================

test_kong_admin_api() {
    log_info "Testing Kong Admin API..."
    curl -sf "${KONG_ADMIN_URL}/status" > /dev/null
}

test_kong_proxy() {
    log_info "Testing Kong Proxy..."
    curl -s -o /dev/null -w "%{http_code}" "${KONG_PROXY_URL}" | grep -q "404\|401"
}

test_konga_ui() {
    log_info "Testing Konga UI..."
    curl -sf "${KONGA_URL}" > /dev/null
}

test_prometheus() {
    log_info "Testing Prometheus..."
    curl -sf "${PROMETHEUS_URL}/-/healthy" > /dev/null
}

test_grafana() {
    log_info "Testing Grafana..."
    curl -sf "${GRAFANA_URL}/api/health" > /dev/null
}

# ============================================================
# Configuration Tests
# ============================================================

test_services_configured() {
    log_info "Testing services configuration..."
    local service_count=$(curl -sf "${KONG_ADMIN_URL}/services" | jq '.data | length')
    [ "$service_count" -eq 11 ]
}

test_routes_configured() {
    log_info "Testing routes configuration..."
    local route_count=$(curl -sf "${KONG_ADMIN_URL}/routes" | jq '.data | length')
    [ "$route_count" -ge 30 ]
}

test_consumers_configured() {
    log_info "Testing consumers configuration..."
    local consumer_count=$(curl -sf "${KONG_ADMIN_URL}/consumers" | jq '.data | length')
    [ "$consumer_count" -ge 3 ]
}

test_plugins_configured() {
    log_info "Testing plugins configuration..."
    local plugin_count=$(curl -sf "${KONG_ADMIN_URL}/plugins" | jq '.data | length')
    [ "$plugin_count" -ge 5 ]
}

# ============================================================
# Security Tests
# ============================================================

test_unauthenticated_request_blocked() {
    log_info "Testing unauthenticated request is blocked..."
    local status=$(curl -s -o /dev/null -w "%{http_code}" "${KONG_PROXY_URL}/api/v1/products")
    [ "$status" == "401" ]
}

test_cors_headers() {
    log_info "Testing CORS headers..."
    curl -sf -X OPTIONS "${KONG_PROXY_URL}/api/v1/products" \
        -H "Origin: http://localhost:3000" \
        -H "Access-Control-Request-Method: GET" \
        -I | grep -q "Access-Control-Allow-Origin"
}

test_rate_limiting_headers() {
    log_info "Testing rate limiting headers..."
    curl -s -I "${KONG_PROXY_URL}/api/v1/products" | grep -qi "X-RateLimit"
}

# ============================================================
# Service-Specific Tests
# ============================================================

test_auth_service_route() {
    log_info "Testing auth service route..."
    local status=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST "${KONG_PROXY_URL}/api/v1/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"test@test.com","password":"test"}')
    # Should return 502 (service not running) or 200/400 (service running)
    [[ "$status" =~ ^(502|200|400|401)$ ]]
}

test_product_service_route() {
    log_info "Testing product service route..."
    local status=$(curl -s -o /dev/null -w "%{http_code}" \
        "${KONG_PROXY_URL}/api/v1/products")
    # Should return 401 (JWT required) or 502 (service not running)
    [[ "$status" =~ ^(401|502)$ ]]
}

# ============================================================
# Monitoring Tests
# ============================================================

test_prometheus_metrics() {
    log_info "Testing Prometheus metrics endpoint..."
    curl -sf "http://localhost:8100/metrics" | grep -q "kong_http_requests_total"
}

test_kong_metrics() {
    log_info "Testing Kong metrics..."
    curl -sf "${KONG_ADMIN_URL}/metrics" | grep -q "http_subsystem"
}

# ============================================================
# Performance Tests
# ============================================================

test_response_time() {
    log_info "Testing response time..."
    local response_time=$(curl -sf -o /dev/null -w "%{time_total}" "${KONG_ADMIN_URL}/status")
    # Should be less than 1 second
    awk -v rt="$response_time" 'BEGIN {exit !(rt < 1.0)}'
}

# ============================================================
# Database Tests
# ============================================================

test_postgres_connectivity() {
    log_info "Testing PostgreSQL connectivity..."
    docker exec agrologistic-kong-db pg_isready -U kong -d kong > /dev/null
}

# ============================================================
# Main Test Suite
# ============================================================

main() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}  Kong API Gateway Test Suite${NC}"
    echo -e "${BLUE}  AgroLogistic 2.0${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
    
    log_info "Starting comprehensive test suite..."
    echo ""
    
    # Infrastructure Tests
    echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Infrastructure Tests${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
    
    run_test "Kong Admin API is accessible" "test_kong_admin_api"
    run_test "Kong Proxy is accessible" "test_kong_proxy"
    run_test "Konga UI is accessible" "test_konga_ui"
    run_test "Prometheus is accessible" "test_prometheus"
    run_test "Grafana is accessible" "test_grafana"
    run_test "PostgreSQL connectivity" "test_postgres_connectivity"
    
    # Configuration Tests
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Configuration Tests${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
    
    run_test "All 11 services configured" "test_services_configured"
    run_test "All routes configured (36+)" "test_routes_configured"
    run_test "JWT consumers configured (3+)" "test_consumers_configured"
    run_test "Plugins configured (5+)" "test_plugins_configured"
    
    # Security Tests
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Security Tests${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
    
    run_test "Unauthenticated requests blocked" "test_unauthenticated_request_blocked"
    run_test "CORS headers present" "test_cors_headers"
    run_test "Rate limiting headers present" "test_rate_limiting_headers"
    
    # Service Tests
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Service Route Tests${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
    
    run_test "Auth service route configured" "test_auth_service_route"
    run_test "Product service route configured" "test_product_service_route"
    
    # Monitoring Tests
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Monitoring Tests${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
    
    run_test "Prometheus metrics available" "test_prometheus_metrics"
    run_test "Kong metrics available" "test_kong_metrics"
    
    # Performance Tests
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Performance Tests${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
    
    run_test "Response time < 1s" "test_response_time"
    
    # Summary
    echo ""
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}  Test Summary${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
    echo -e "Total Tests:  ${TESTS_TOTAL}"
    echo -e "${GREEN}Passed:       ${TESTS_PASSED}${NC}"
    echo -e "${RED}Failed:       ${TESTS_FAILED}${NC}"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo ""
        echo -e "${GREEN}════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}  ✓ ALL TESTS PASSED!${NC}"
        echo -e "${GREEN}  Kong Gateway is fully operational${NC}"
        echo -e "${GREEN}════════════════════════════════════════════════${NC}"
        exit 0
    else
        echo ""
        echo -e "${RED}════════════════════════════════════════════════${NC}"
        echo -e "${RED}  ✗ SOME TESTS FAILED${NC}"
        echo -e "${RED}  Please check the failures above${NC}"
        echo -e "${RED}════════════════════════════════════════════════${NC}"
        exit 1
    fi
}

# Run main script
main "$@"
