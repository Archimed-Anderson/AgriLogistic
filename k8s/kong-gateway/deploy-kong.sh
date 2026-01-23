#!/bin/bash

# ============================================================
# Kong API Gateway Deployment Script for AgroLogistic 2.0
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="agrologistic-gateway"
HELM_RELEASE="kong-gateway"
KONG_VERSION="2.32.0"  # Kong Helm chart version
KUBECTL_CONTEXT=$(kubectl config current-context)

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Kong API Gateway Deployment for AgroLogistic  ${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "${YELLOW}Current kubectl context: ${KUBECTL_CONTEXT}${NC}"
echo -e "${YELLOW}Target namespace: ${NAMESPACE}${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v kubectl &> /dev/null; then
    print_error "kubectl not found. Please install kubectl."
    exit 1
fi
print_status "kubectl found"

if ! command -v helm &> /dev/null; then
    print_error "Helm not found. Please install Helm 3+."
    exit 1
fi
print_status "Helm found"

# Verify cluster connectivity
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster. Check your kubeconfig."
    exit 1
fi
print_status "Kubernetes cluster accessible"

echo ""

# Add Kong Helm repository
echo -e "${BLUE}Adding Kong Helm repository...${NC}"
helm repo add kong https://charts.konghq.com
helm repo update
print_status "Kong Helm repository added"

echo ""

# Create namespace
echo -e "${BLUE}Creating namespace: ${NAMESPACE}...${NC}"
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
print_status "Namespace created/verified"

# Label namespace
kubectl label namespace ${NAMESPACE} name=agrologistic-gateway environment=production --overwrite
print_status "Namespace labeled"

echo ""

# Create secrets
echo -e "${BLUE}Creating secrets...${NC}"

# Generate JWT secrets if not exist
if ! kubectl get secret kong-jwt-secrets -n ${NAMESPACE} &> /dev/null; then
    JWT_SECRET=$(openssl rand -base64 32)
    JWT_MOBILE_SECRET=$(openssl rand -base64 32)
    JWT_ADMIN_SECRET=$(openssl rand -base64 32)
    
    kubectl create secret generic kong-jwt-secrets \
        --from-literal=JWT_SECRET=${JWT_SECRET} \
        --from-literal=JWT_MOBILE_SECRET=${JWT_MOBILE_SECRET} \
        --from-literal=JWT_ADMIN_SECRET=${JWT_ADMIN_SECRET} \
        -n ${NAMESPACE}
    
    print_status "JWT secrets created"
else
    print_info "JWT secrets already exist"
fi

# Create PostgreSQL password secret
if ! kubectl get secret kong-postgresql -n ${NAMESPACE} &> /dev/null; then
    PG_PASSWORD=$(openssl rand -base64 16)
    
    kubectl create secret generic kong-postgresql \
        --from-literal=password=${PG_PASSWORD} \
        -n ${NAMESPACE}
    
    print_status "PostgreSQL password created"
else
    print_info "PostgreSQL secret already exists"
fi

echo ""

# Create ConfigMap with declarative config
echo -e "${BLUE}Creating Kong declarative configuration...${NC}"

# Substitute environment variables in declarative config
JWT_SECRET=$(kubectl get secret kong-jwt-secrets -n ${NAMESPACE} -o jsonpath='{.data.JWT_SECRET}' | base64 -d)
JWT_MOBILE_SECRET=$(kubectl get secret kong-jwt-secrets -n ${NAMESPACE} -o jsonpath='{.data.JWT_MOBILE_SECRET}' | base64 -d)
JWT_ADMIN_SECRET=$(kubectl get secret kong-jwt-secrets -n ${NAMESPACE} -o jsonpath='{.data.JWT_ADMIN_SECRET}' | base64 -d)

# Create temporary file with substituted values
sed -e "s/\${JWT_SECRET}/${JWT_SECRET}/g" \
    -e "s/\${JWT_MOBILE_SECRET}/${JWT_MOBILE_SECRET}/g" \
    -e "s/\${JWT_ADMIN_SECRET}/${JWT_ADMIN_SECRET}/g" \
    declarative_config.yaml > /tmp/kong_config_final.yaml

# Create ConfigMap
kubectl create configmap kong-declarative-config \
    --from-file=kong.yml=/tmp/kong_config_final.yaml \
    -n ${NAMESPACE} \
    --dry-run=client -o yaml | kubectl apply -f -

# Cleanup
rm -f /tmp/kong_config_final.yaml

print_status "Declarative configuration created"

echo ""

# Install/Upgrade Kong using Helm
echo -e "${BLUE}Deploying Kong Gateway via Helm...${NC}"
echo -e "${YELLOW}This may take several minutes...${NC}"

helm upgrade --install ${HELM_RELEASE} kong/kong \
    --version ${KONG_VERSION} \
    --namespace ${NAMESPACE} \
    --values values.yaml \
    --wait \
    --timeout 10m

print_status "Kong Gateway deployed"

echo ""

# Wait for Kong to be ready
echo -e "${BLUE}Waiting for Kong pods to be ready...${NC}"
kubectl wait --for=condition=ready pod \
    -l app.kubernetes.io/name=kong \
    -n ${NAMESPACE} \
    --timeout=300s

print_status "Kong pods are ready"

echo ""

# Get Kong service endpoints
echo -e "${BLUE}Kong Gateway endpoints:${NC}"
echo ""

PROXY_SERVICE=$(kubectl get svc -n ${NAMESPACE} ${HELM_RELEASE}-kong-proxy -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
ADMIN_SERVICE=$(kubectl get svc -n ${NAMESPACE} ${HELM_RELEASE}-kong-admin -o jsonpath='{.spec.clusterIP}')

if [ -z "$PROXY_SERVICE" ]; then
    PROXY_SERVICE=$(kubectl get svc -n ${NAMESPACE} ${HELM_RELEASE}-kong-proxy -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
fi

echo -e "  ${GREEN}Proxy (Public):${NC} http://${PROXY_SERVICE}:80"
echo -e "  ${GREEN}Proxy SSL:${NC} https://${PROXY_SERVICE}:443"
echo -e "  ${GREEN}Admin API (Internal):${NC} http://${ADMIN_SERVICE}:8001"
echo -e "  ${GREEN}Manager UI:${NC} Access via kubectl port-forward"
echo ""

# Print port-forward command for admin access
printf "To access Kong Manager UI locally, run:\n"
printf "  ${YELLOW}kubectl port-forward -n ${NAMESPACE} svc/${HELM_RELEASE}-kong-manager 8002:8002${NC}\n"
printf "  Then open: ${BLUE}http://localhost:8002${NC}\n"
echo ""

# Verify deployment
echo -e "${BLUE}Verifying deployment...${NC}"

# Check Kong status
if kubectl exec -n ${NAMESPACE} deployment/${HELM_RELEASE}-kong -- kong health &> /dev/null; then
    print_status "Kong health check passed"
else
    print_error "Kong health check failed"
    exit 1
fi

# List services configured in Kong
echo ""
echo -e "${BLUE}Configured services in Kong:${NC}"
kubectl exec -n ${NAMESPACE} deployment/${HELM_RELEASE}-kong -- kong config db_export | grep -A 2 "services:" | head -20

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Kong Gateway deployed successfully! 🎉${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

# Save connection info
cat > kong-connection-info.txt << EOF
Kong API Gateway - Connection Information
==========================================

Generated: $(date)
Cluster: ${KUBECTL_CONTEXT}
Namespace: ${NAMESPACE}

Endpoints:
----------
Proxy (Public):  http://${PROXY_SERVICE}:80
Proxy SSL:       https://${PROXY_SERVICE}:443
Admin API:       http://${ADMIN_SERVICE}:8001 (internal)

Access Admin UI:
----------------
kubectl port-forward -n ${NAMESPACE} svc/${HELM_RELEASE}-kong-manager 8002:8002

Test Endpoints:
---------------
# Health Check
curl http://${PROXY_SERVICE}/api/v1/auth/health

# Test Auth Login
curl -X POST http://${PROXY_SERVICE}/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@agrlogistic.com","password":"test123"}'

Secrets:
--------
kubectl get secret kong-jwt-secrets -n ${NAMESPACE} -o yaml
kubectl get secret kong-postgresql -n ${NAMESPACE} -o yaml

Monitoring:
-----------
# View Kong logs
kubectl logs -n ${NAMESPACE} -l app.kubernetes.io/name=kong -f

# Check metrics
kubectl port-forward -n ${NAMESPACE} svc/${HELM_RELEASE}-kong-proxy 8100:8100
curl http://localhost:8100/metrics

Troubleshooting:
----------------
# Check pod status
kubectl get pods -n ${NAMESPACE}

# Describe Kong deployment
kubectl describe deployment -n ${NAMESPACE} ${HELM_RELEASE}-kong

# View recent events
kubectl get events -n ${NAMESPACE} --sort-by='.lastTimestamp'
EOF

print_status "Connection info saved to kong-connection-info.txt"

echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Configure your frontend to use: http://${PROXY_SERVICE}"
echo "  2. Update microservices to run at their designated ports"
echo "  3. Run health checks: ./test-kong-endpoints.sh"
echo "  4. Monitor Kong metrics in Grafana"
echo ""
