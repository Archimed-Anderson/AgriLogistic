# Kong API Gateway - Table de routage

Document de référence pour l’API Gateway Kong (cahier des charges 1.1). Les ports et noms de services correspondent à l’implémentation actuelle (non modifiés).

---

## 1. Services et ports (upstreams)

| Service                | Port  | Upstream (target)           | Rôle                    |
|------------------------|-------|-----------------------------|-------------------------|
| auth-service           | 8001  | agrologistic-auth-service:8001 | Authentification, JWT   |
| product-service        | 8002  | product-service:8002        | Catalogue / marketplace |
| order-service          | 8003  | order-service:8003          | Commandes               |
| logistics-service      | 8004  | logistics-service:8004      | Logistique              |
| payment-service        | 8005  | payment-service:8005        | Paiements               |
| notification-service   | 8006  | notification-service:8006   | Notifications           |
| analytics-service      | 8007  | analytics-service:8007      | Analytiques             |
| ai-service             | 8008  | ai-service:8008            | IA (FastAPI)            |
| blockchain-service     | 8009  | blockchain-service:8009     | Blockchain              |
| inventory-service      | 8010  | inventory-service:8010      | Stock                   |
| user-service           | 8011  | user-service:8011           | Utilisateurs / profils  |

---

## 2. Routes principales (préfixes Gateway)

| Préfixe route      | Service              | Auth    | Rate limit      |
|--------------------|----------------------|---------|-----------------|
| `/api/v1/auth`     | auth-service         | Public (login/register) ou JWT | 100/min (IP) sur auth public |
| `/api/v1/products` | product-service      | JWT     | 1000/min (consumer) |
| `/api/v1/orders`   | order-service        | JWT     | 1000/min (consumer) |
| `/api/v1/logistics`| logistics-service    | JWT     | 1000/min (consumer) |
| `/api/v1/payments`  | payment-service      | JWT     | 1000/min (consumer) |
| `/api/v1/notifications` | notification-service | JWT  | 1000/min (consumer) |
| `/api/v1/contact`   | notification-service | Public | 100/min (IP)    |
| `/api/v1/analytics` | analytics-service    | JWT     | 1000/min (consumer) |
| `/api/v1/events`    | analytics-service    | JWT     | 1000/min (consumer) |
| `/api/v1/ai`        | ai-service           | JWT     | 1000/min (consumer) |
| `/api/v1/blockchain`| blockchain-service  | JWT     | 1000/min (consumer) |
| `/api/v1/inventory`  | inventory-service    | JWT     | 1000/min (consumer) |
| `/api/v1/users`     | user-service         | JWT     | 1000/min (consumer) |

- **Anonyme (par IP)** : 100 requêtes/minute (routes publiques : auth login/register, contact, health).
- **Authentifié (par consumer)** : 1000 requêtes/minute (routes protégées JWT).

---

## 3. Plugins actifs

| Plugin            | Scope    | Rôle                                      |
|-------------------|----------|-------------------------------------------|
| jwt               | Service/Route | Authentification JWT centralisée       |
| rate-limiting     | Global + Service | 100/min IP (anon), 1000/min consumer (auth) |
| file-log          | Global   | Logs JSON vers `/var/log/kong/access.log` |
| cors              | Global   | Origines whitelistées (localhost, agrologistic.app) |
| request-transformer | Global | Headers X-Gateway-Version, X-Request-ID   |
| response-transformer | Global | Headers X-Response-Time, X-Kong-Latency  |
| prometheus        | Global   | Métriques                                |
| correlation-id    | Global   | X-Request-ID                              |
| key-auth          | Optionnel | Appels inter-services (API Key)         |

---

## 4. Consumers

### JWT (clients frontend / mobile / admin)

| Username                 | custom_id        | Usage        |
|--------------------------|------------------|--------------|
| agrologistic-web-app     | web-client-v1    | Application web |
| agrologistic-mobile-app  | mobile-client-v1 | Application mobile |
| agrologistic-admin       | admin-client-v1  | Back-office admin |

### API Key (services internes – appels service-to-service)

| Consumer         | Usage                    | Header / Query     |
|------------------|--------------------------|--------------------|
| user-service     | Appels internes user     | `apikey: <key>` ou `X-Api-Key: <key>` |
| product-service  | Appels internes product   | idem               |
| logistics-service| Appels internes logistics | idem               |
| payment-service  | Appels internes payment   | idem               |
| ai-service       | Appels internes ai        | idem               |

Les clés API sont définies dans la configuration déclarative Kong (`kong/kong.yml`). Pour les appels internes via le gateway, utiliser par exemple :  
`curl -H "apikey: <API_KEY>" http://localhost:8000/api/v1/users`.

---

## 5. Fichiers de configuration

| Fichier                    | Rôle                                      |
|----------------------------|-------------------------------------------|
| `infrastructure/docker-compose.kong.yml` | Stack Kong (PostgreSQL, Kong, Konga) |
| `infrastructure/kong/kong.conf`          | Paramètres Kong (logs, listen, DB, plugins) |
| `infrastructure/kong/kong.yml`           | Config déclarative (services, routes, plugins, consumers) |
| `infrastructure/scripts/init-kong.sh`    | Initialisation (appelle kong-init.sh)     |
| `infrastructure/scripts/kong-init.sh`    | Création services/routes/plugins via Admin API |

---

## 6. Commandes de validation

### Admin API (liste des services)

```bash
curl -i http://localhost:8001/services
```

### Proxy – route protégée JWT (users)

```bash
# Récupérer un JWT via login
curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@agrologistic.app","password":"admin123"}' | jq -r '.access_token'

# Appel avec JWT
curl -i http://localhost:8000/api/v1/users --header "Authorization: Bearer <JWT>"
```

Sous PowerShell :

```powershell
curl -i http://localhost:8000/api/v1/users -H "Authorization: Bearer <JWT>"
```

### Vérification santé Kong

```bash
curl -i http://localhost:8001/status
```

### Script de validation (cahier des charges)

Exécuter tous les tests de validation en une fois (après avoir démarré la stack Kong) :

```bash
cd infrastructure
chmod +x scripts/validate-kong-cahier.sh
./scripts/validate-kong-cahier.sh
```

Sous Windows (WSL) :

```bash
wsl bash -c "cd /mnt/c/chemin/vers/AgroDeep/infrastructure && bash scripts/validate-kong-cahier.sh"
```

Le script vérifie : disponibilité Kong, `GET /services`, `GET /api/v1/users` avec JWT (obtenu via login), `GET /status`.

---

*Dernière mise à jour : conformité cahier des charges 1.1 – ports actuels 8001–8011 conservés et documentés.*
