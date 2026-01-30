# AgriLogistic API Gateway

Kong-based API Gateway for the AgriLogistic microservices platform.

## Overview

This API Gateway acts as the single entry point for all client requests, providing:
- **Routing:** Intelligent request routing to backend microservices
- **Authentication:** JWT token validation
- **Rate Limiting:** Protect services from abuse
- **CORS:** Cross-origin resource sharing support
- **Request/Response Transformation:** Add headers, modify requests
- **Monitoring:** Request logging and metrics

## Architecture

```
Client â†’ Kong Gateway (Port 8000) â†’ Microservices
                â†“
         Kong Admin API (Port 8001)
                â†“
         Konga UI (Port 1337)
                â†“
         PostgreSQL Database
```

## Quick Start

### 1. Prerequisites

- Docker & Docker Compose installed
- Ports 8000, 8001, 8443, 1337 available

### 2. Configuration

```bash
# Copy environment file
cp .env.example .env

# Edit .env and update passwords
nano .env
```

### 3. Start Services

```bash
# Start Kong Gateway
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f kong
```

### 4. Access Points

- **Gateway Proxy:** http://localhost:8000
- **Admin API:** http://localhost:8001
- **Konga UI:** http://localhost:1337

### 5. Konga Setup (First Time Only)

1. Open http://localhost:1337
2. Create admin account
3. Connect to Kong:
   - Name: AgriLogistic Kong
   - Kong Admin URL: http://kong:8001

## Service Routes

### Authentication Service
- **Endpoint:** `http://localhost:8000/api/v1/auth`
- **Methods:** POST, GET, PUT, DELETE
- **Rate Limit:** 100/min, 1000/hour
- **Auth Required:** No

**Endpoints:**
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/password-reset
GET    /api/v1/auth/oauth/google
POST   /api/v1/auth/oauth/google/callback
```

### Product Service
- **Endpoint:** `http://localhost:8000/api/v1/products`
- **Methods:** GET, POST, PUT, DELETE
- **Rate Limit:** 200/min, 5000/hour
- **Auth Required:** Yes (JWT)

**Endpoints:**
```
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products           (Admin only)
PUT    /api/v1/products/:id       (Admin only)
DELETE /api/v1/products/:id       (Admin only)
GET    /api/v1/products/search
GET    /api/v1/products/categories
```

### Order Service
- **Endpoint:** `http://localhost:8000/api/v1/orders`
- **Methods:** GET, POST, PUT, DELETE
- **Rate Limit:** 150/min, 3000/hour
- **Auth Required:** Yes (JWT)

**Endpoints:**
```
GET    /api/v1/orders
GET    /api/v1/orders/:id
POST   /api/v1/orders
PUT    /api/v1/orders/:id/status
DELETE /api/v1/orders/:id
```

### Payment Service
- **Endpoint:** `http://localhost:8000/api/v1/payments`
- **Methods:** GET, POST, PUT
- **Rate Limit:** 50/min, 500/hour
- **Auth Required:** Yes (JWT)

**Endpoints:**
```
POST   /api/v1/payments/intent
POST   /api/v1/payments/confirm
POST   /api/v1/payments/refund
GET    /api/v1/payments/:id/status
POST   /api/v1/payments/webhook/stripe
```

## Authentication Flow

### 1. Login/Register
```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response
{
  "user": {...},
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900
}
```

### 2. Use Access Token
```bash
curl -X GET http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### 3. Refresh Token
```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIs..."}'
```

## Rate Limiting

Rate limits are enforced per IP address:

| Service | Per Minute | Per Hour |
|---------|------------|----------|
| Auth    | 100        | 1,000    |
| Product | 200        | 5,000    |
| Order   | 150        | 3,000    |
| Payment | 50         | 500      |

**Response Headers:**
```
X-RateLimit-Limit-Minute: 200
X-RateLimit-Remaining-Minute: 195
X-RateLimit-Limit-Hour: 5000
X-RateLimit-Remaining-Hour: 4998
```

**Rate Limit Exceeded:**
```json
{
  "error": "API rate limit exceeded",
  "message": "Rate limit exceeded. Try again in 42 seconds."
}
```

## Kong Admin API

### Add a New Service

```bash
curl -i -X POST http://localhost:8001/services \
  --data name=my-service \
  --data url=http://my-service:3000
```

### Add a Route

```bash
curl -i -X POST http://localhost:8001/services/my-service/routes \
  --data paths[]=/api/v1/my-service \
  --data strip_path=true
```

### Add Rate Limiting Plugin

```bash
curl -i -X POST http://localhost:8001/services/my-service/plugins \
  --data "name=rate-limiting" \
  --data "config.minute=100" \
  --data "config.hour=1000"
```

### Add JWT Plugin

```bash
curl -i -X POST http://localhost:8001/services/my-service/plugins \
  --data "name=jwt"
```

## Monitoring

### Health Check

```bash
# Kong health
curl http://localhost:8001/status

# Services health
curl http://localhost:8000/api/v1/auth/health
curl http://localhost:8000/api/v1/products/health
```

### Logs

```bash
# Gateway logs
docker-compose logs -f kong

# Database logs
docker-compose logs -f kong-database

# Admin UI logs
docker-compose logs -f konga
```

### Metrics

Access Prometheus metrics:
```bash
curl http://localhost:8001/metrics
```

## Troubleshooting

### Kong won't start

```bash
# Check database connection
docker-compose logs kong-database

# Run migrations manually
docker-compose run --rm kong kong migrations bootstrap
```

### Routes not working

```bash
# List all services
curl http://localhost:8001/services

# List all routes
curl http://localhost:8001/routes

# Check specific service
curl http://localhost:8001/services/auth-service
```

### Rate limit issues

```bash
# Check rate limiting plugin
curl http://localhost:8001/plugins

# Adjust rate limits
curl -i -X PATCH http://localhost:8001/plugins/{plugin-id} \
  --data "config.minute=500"
```

## Cleanup

```bash
# Stop services
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## Security Considerations

1. **Change Default Passwords:** Update `.env` with strong passwords
2. **TLS/SSL:** Configure SSL certificates for production
3. **Admin API:** Restrict access to admin API (port 8001)
4. **CORS:** Update CORS origins to specific domains
5. **Rate Limits:** Adjust based on expected traffic
6. **JWT Secrets:** Use strong, randomly generated secrets

## Production Deployment

### Use HTTPS

Update `docker-compose.yml`:
```yaml
kong:
  environment:
    KONG_SSL_CERT: /path/to/cert.pem
    KONG_SSL_CERT_KEY: /path/to/key.pem
```

### Restrict Admin API

```yaml
kong:
  environment:
    KONG_ADMIN_LISTEN: 127.0.0.1:8001
```

### Use Database Encryption

```yaml
kong-database:
  command: >
    -c ssl=on
    -c ssl_cert_file=/path/to/cert.pem
    -c ssl_key_file=/path/to/key.pem
```

## Next Steps

1. âœ… API Gateway configured
2. â­ï¸ Implement Authentication Service (Week 3-4)
3. â­ï¸ Implement Product Service (Week 5-6)
4. â­ï¸ Implement Order Service (Week 7-8)
5. â­ï¸ Implement Payment Service (Week 9-10)

## Support

For issues or questions:
- Check Kong documentation: https://docs.konghq.com/
- Review logs: `docker-compose logs -f`
- Contact technical lead

---

**Version:** 1.0  
**Last Updated:** January 2026  
**Status:** âœ… Ready for Development


