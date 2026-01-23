# AgroLogistic Auth Service (OAuth2 / OIDC)

Ce service fournit un **Authorization Server OAuth2** + une couche **OpenID Connect** (OIDC) compatible avec l’API Gateway Kong (JWT **RS256** + `kid`).

## Démarrage (Docker)

Depuis `AgroDeep/backend/auth-service`:

1. Copier l’exemple d’environnement:
   - Crée un fichier `env.auth` basé sur `env.auth.example` (le fichier `.env*` est filtré dans cet environnement Cursor).

2. Démarrer Postgres + Redis + auth-service:

```bash
docker-compose -f docker-compose.auth.yml --env-file env.auth up -d --build
```

3. Appliquer les migrations:

```bash
docker-compose -f docker-compose.auth.yml --env-file env.auth run --rm auth-service alembic upgrade head
```

## Endpoints principaux

### OAuth2
- `GET /oauth/authorize` (Authorization Code + PKCE)
- `POST /oauth/token` (authorization_code, refresh_token, client_credentials)
- `POST /oauth/revoke`
- `POST /oauth/introspect`

### OIDC
- `GET /.well-known/openid-configuration`
- `GET /.well-known/jwks.json`
- `GET /oauth/userinfo` (Bearer token)

### Auth (first-party)
- `POST /api/v1/auth/register`
- `GET /api/v1/auth/verify-email/{token}`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/sessions`
- `DELETE /api/v1/auth/sessions/{session_id}`

### MFA (TOTP)
- `POST /api/v1/auth/mfa/enable`
- `POST /api/v1/auth/mfa/verify-setup`
- `POST /api/v1/auth/mfa/login`
- `POST /api/v1/auth/mfa/disable`

### Social login
- `GET /api/v1/auth/google` + `GET /api/v1/auth/google/callback`
- `GET /api/v1/auth/github` + `GET /api/v1/auth/github/callback`

## Exemples curl (dev)

### Register + verify email

```bash
curl -s -X POST http://localhost:8005/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!","full_name":"John Doe"}'
```

### Login

```bash
curl -s -X POST http://localhost:8005/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'
```

### OIDC discovery

```bash
curl -s http://localhost:8005/.well-known/openid-configuration
```

## Tests

Les tests s’exécutent **dans le conteneur** (Python 3.11). Exemple:

```bash
docker-compose -f docker-compose.auth.yml --env-file env.auth run --rm auth-service pytest -q
```

