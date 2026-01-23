# Kong API Gateway for AgroLogistic 2.0

This directory contains the complete Kong API Gateway configuration for orchestrating 11 microservices in the AgroLogistic platform.

## 📁 Files Overview

```
k8s/kong-gateway/
├── namespace.yaml              # Kubernetes namespace definition
├── values.yaml                 # Helm chart values for Kong
├── declarative_config.yaml     # Kong declarative configuration (services, routes, plugins)
├── deploy-kong.sh             # Automated deployment script
├── test-kong-endpoints.sh     # Health check and endpoint testing
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Kubernetes cluster (v1.24+)
- Helm 3.x installed
- kubectl configured with cluster access
- `openssl` for secret generation
- `jq` for JSON parsing (optional, for testing)

### Deployment

1. **Navigate to the Kong Gateway directory:**
   ```bash
   cd k8s/kong-gateway
   ```

2. **Make scripts executable:**
   ```bash
   chmod +x deploy-kong.sh test-kong-endpoints.sh
   ```

3. **Deploy Kong:**
   ```bash
   ./deploy-kong.sh
   ```

   The script will:
   - ✅ Verify prerequisites (kubectl, Helm)
   - ✅ Add Kong Helm repository
   - ✅ Create namespace `agrologistic-gateway`
   - ✅ Generate JWT secrets
   - ✅ Create PostgreSQL credentials
   - ✅ Deploy Kong with PostgreSQL backend
   - ✅ Configure all 11 microservices

4. **Verify deployment:**
   ```bash
   kubectl get pods -n agrologistic-gateway
   kubectl get svc -n agrologistic-gateway
   ```

5. **Test endpoints:**
   ```bash
   ./test-kong-endpoints.sh
   ```

## 🔧 Configuration Details

### Services Configured

The gateway exposes the following microservices:

| Service | Port | Routes | Authentication | Rate Limit |
|---------|------|--------|---------------|------------|
| **auth-service** | 3001 | `/api/v1/auth/*` | Public (login/register) | 100/min |
| **user-service** | 3002 | `/api/v1/users/*` | JWT Required | 200/min |
| **marketplace-service** | 3003 | `/api/v1/marketplace/*` | JWT Required | 300/min |
| **payment-service** | 3004 | `/api/v1/payments/*` | JWT Required | 50/min |
| **logistic-service** | 3005 | `/api/v1/logistics/*` | JWT Required | 300/min |
| **rental-service** | 3006 | `/api/v1/rentals/*` | JWT Required | 150/min |
| **notification-service** | 3007 | `/api/v1/notifications/*` | JWT Required | 100/min |
| **ai-service** | 3008 | `/api/v1/ai/*` | JWT Required | 30/min |
| **blockchain-service** | 3009 | `/api/v1/blockchain/*` | JWT Required | 50/min |
| **inventory-service** | 3010 | `/api/v1/inventory/*` | JWT Required | 200/min |
| **analytics-service** | 3011 | `/api/v1/analytics/*` | JWT Required | 100/min |

### Global Plugins

- **Prometheus**: Metrics collection
- **CORS**: Cross-origin resource sharing
- **JWT Authentication**: Token validation
- **Rate Limiting**: Per-consumer limits
- **Request/Response Transformers**: Header manipulation
- **Proxy Cache**: Response caching for GET requests

### JWT Configuration

Three JWT consumers are configured:

1. **Web App** (`agrologistic-web-app`)
   - For SPA/frontend applications
   - Secret: Auto-generated during deployment

2. **Mobile App** (`agrologistic-mobile-app`)
   - For iOS/Android applications
   - Separate secret for mobile clients

3. **Admin** (`agrologistic-admin`)
   - For privileged administrative operations
   - Enhanced security secret

## 📊 Monitoring & Observability

###  Prometheus Metrics

Kong exposes Prometheus metrics at `:8100/metrics`

**Access metrics locally:**
```bash
kubectl port-forward -n agrologistic-gateway svc/kong-gateway-kong-proxy 8100:8100
curl http://localhost:8100/metrics
```

### Kong Manager UI

Access the Kong Admin UI:

```bash
kubectl port-forward -n agrologistic-gateway svc/kong-gateway-kong-manager 8002:8002
```

Then open: http://localhost:8002

### Logs

**View Kong logs:**
```bash
kubectl logs -n agrologistic-gateway -l app.kubernetes.io/name=kong -f
```

**View recent events:**
```bash
kubectl get events -n agrologistic-gateway --sort-by='.lastTimestamp'
```

## 🔐 Security

### Secrets Management

The deployment script creates the following secrets:

- `kong-jwt-secrets`: JWT signing keys for all consumers
- `kong-postgresql`: PostgreSQL database password

**View secrets:**
```bash
kubectl get secrets -n agrologistic-gateway
kubectl describe secret kong-jwt-secrets -n agrologistic-gateway
```

### TLS/SSL

Kong is configured to accept both HTTP (port 8000) and HTTPS (port 8443).

**To enable TLS:**
1. Create a Kubernetes secret with your TLS certificate
2. Update `values.yaml` with certificate references
3. Redeploy using `helm upgrade`

## 🧪 Testing

### Manual Testing

**1. Health Check:**
```bash
KONG_URL=$(kubectl get svc -n agrologistic-gateway kong-gateway-kong-proxy -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
curl http://${KONG_URL}/api/v1/auth/login
```

**2. Test with JWT:**
```bash
# Get JWT token from auth service
TOKEN=$(curl -X POST http://${KONG_URL}/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@agrologistic.com","password":"password123"}' \
  | jq -r '.accessToken')

# Use token to access protected endpoint
curl http://${KONG_URL}/api/v1/marketplace/products \
  -H "Authorization: Bearer ${TOKEN}"
```

### Automated Testing

Run the comprehensive test suite:

```bash
./test-kong-endpoints.sh
```

This will test all 11 microservices and their routes.

## 🐛 Troubleshooting

### Pod not starting

```bash
# Check pod status
kubectl describe pod -n agrologistic-gateway -l app.kubernetes.io/name=kong

# Check logs
kubectl logs -n agrologistic-gateway -l app.kubernetes.io/name=kong --tail=100
```

### Database migration issues

```bash
# Check PostgreSQL pods
kubectl get pods -n agrologistic-gateway -l app.kubernetes.io/name=postgresql

# Run migrations manually
kubectl exec -n agrologistic-gateway deployment/kong-gateway-kong -- kong migrations bootstrap
```

### Service not accessible

```bash
# Verify services are registered in Kong
kubectl exec -n agrologistic-gateway deployment/kong-gateway-kong -- kong config db_export

# Check if backend service is running
kubectl get pods -n agrologistic-services
kubectl get svc -n agrologistic-services
```

### Rate limiting issues

Check rate limit counters:

```bash
kubectl exec -n agrologistic-gateway deployment/kong-gateway-kong -- \
  curl -s http://localhost:8001/status
```

## 🔄 Updates & Maintenance

### Update Kong Configuration

After modifying `declarative_config.yaml`:

```bash
# Recreate ConfigMap
kubectl create configmap kong-declarative-config \
  --from-file=kong.yml=declarative_config.yaml \
  -n agrologistic-gateway \
  --dry-run=client -o yaml | kubectl apply -f -

# Reload Kong configuration
kubectl rollout restart deployment/kong-gateway-kong -n agrologistic-gateway
```

### Upgrade Kong Version

```bash
helm upgrade kong-gateway kong/kong \
  --version NEW_VERSION \
  --namespace agrologistic-gateway \
  --values values.yaml \
  --wait
```

### Scale Kong

**Manually:**
```bash
kubectl scale deployment/kong-gateway-kong -n agrologistic-gateway --replicas=5
```

**Auto-scaling is configured in `values.yaml`:**
- Min replicas: 2
- Max replicas: 10
- CPU target: 70%

## 📚 Additional Resources

- [Kong Documentation](https://docs.konghq.com/)
- [Kong Helm Chart](https://github.com/Kong/charts)
- [Kong Plugins](https://docs.konghq.com/hub/)
- [Declarative Configuration](https://docs.konghq.com/gateway/latest/production/deployment-topologies/db-less-and-declarative-config/)

## 🆘 Support

For issues or questions:

1. Check Kong logs: `kubectl logs -n agrologistic-gateway -l app.kubernetes.io/name=kong`
2. Review deployment events: `kubectl get events -n agrologistic-gateway`
3. Consult the gap analysis report for architecture details
4. Open an issue in the project repository

---

**Deployment Date:** {{DATE}}  
**Kong Version:** 3.5  
**Helm Chart Version:** 2.32.0  
**Configured Services:** 11
