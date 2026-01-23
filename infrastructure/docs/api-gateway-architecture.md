# API Gateway Architecture (Kong) - AgroLogistic 2.0

## Entry points

- **Proxy**: `http://localhost:8000` (HTTP) / `https://localhost:8443` (HTTPS)
- **Admin API**: `http://localhost:8001` (bind localhost)

## Routing model

- Kong expose un **single entry point** et route vers 11 microservices via:\n  - **Services**: `auth-service`, `product-service`, ...\n  - **Routes**: `/api/v1/auth/*`, `/api/v1/products/*`, etc.\n  - **Upstreams**: `auth-upstream`, `product-upstream`, ... (health checks + LB)

## Security layers

- **JWT RS256**:\n  - l’auth-service signe (clé privée)\n  - Kong valide (clé publique `rsa_public_key`)\n  - identification du consumer via claim `kid` (config `key_claim_name: kid`)
- **Rate limiting**:\n  - global (par IP)\n  - par service (par consumer) pour endpoints sensibles
- **Admin hardening**: Admin API exposée uniquement en localhost via mapping `127.0.0.1:8001:8001`

## Observability

- **Prometheus**: métriques Kong sur `GET /metrics` (proxy)\n- **Tracing**: Jaeger via plugin `zipkin` (profile `tracing`)

