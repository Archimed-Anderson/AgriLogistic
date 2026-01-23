# Plan d'Intégration - Admin Service Backend

## Vue d'Ensemble

Ce document décrit le plan d'intégration du nouveau microservice `admin-service` avec l'architecture existante AgroLogistic.

## Architecture Proposée

```
┌─────────────────┐
│   Kong Gateway  │
│   (Port 8000)   │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
    ┌────▼─────┐    ┌─────▼──────┐
    │   Auth   │    │   Admin    │
    │ Service  │    │  Service   │
    │ (5001)   │    │  (5005)    │
    └──────────┘    └────┬───────┘
                         │
                    ┌────▼────────┐
                    │  PostgreSQL │
                    │  (Admin DB) │
                    └─────────────┘
```

## 1. Création du Admin Service

### 1.1 Initialisation du Projet

```bash
cd backend
mkdir admin-service
cd admin-service
npm init -y
```

### 1.2 Installation des Dépendances

```bash
npm install express cors helmet morgan
npm install pg pg-hstore sequelize
npm install jsonwebtoken bcryptjs
npm install dotenv express-validator
npm install --save-dev typescript @types/node @types/express
npm install --save-dev @types/jsonwebtoken @types/bcryptjs
npm install --save-dev nodemon ts-node
```

### 1.3 Structure du Projet

```
admin-service/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── jwt.ts
│   ├── models/
│   │   ├── AdminUser.ts
│   │   ├── AuditLog.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── users.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── system.routes.ts
│   │   └── index.ts
│   ├── controllers/
│   │   ├── users.controller.ts
│   │   ├── dashboard.controller.ts
│   │   └── system.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── permissions.middleware.ts
│   │   └── audit.middleware.ts
│   ├── services/
│   │   ├── users.service.ts
│   │   ├── dashboard.service.ts
│   │   └── system.service.ts
│   └── app.ts
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── docker-compose.yml
```

## 2. Endpoints API à Implémenter

### 2.1 Users Management (`/admin/users`)

- `GET /admin/users` - Liste des utilisateurs (avec pagination et filtres)
- `GET /admin/users/:id` - Détails d'un utilisateur
- `POST /admin/users` - Créer un utilisateur
- `PATCH /admin/users/:id` - Modifier un utilisateur
- `DELETE /admin/users/:id` - Supprimer un utilisateur
- `POST /admin/users/:id/suspend` - Suspendre un utilisateur
- `POST /admin/users/:id/activate` - Activer un utilisateur
- `POST /admin/users/:id/role` - Assigner un rôle
- `POST /admin/users/:id/reset-password` - Réinitialiser le mot de passe

### 2.2 Dashboard (`/admin/dashboard`)

- `GET /admin/dashboard/metrics` - Métriques du dashboard
- `GET /admin/dashboard/alerts` - Alertes système
- `POST /admin/dashboard/alerts/:id/dismiss` - Dismiss une alerte
- `GET /admin/dashboard/activity` - Activité récente

### 2.3 System Monitoring (`/admin/system`)

- `GET /admin/system/health` - Health checks des services
- `GET /admin/system/metrics` - Métriques système (CPU, RAM, etc.)
- `GET /admin/system/logs` - Logs système
- `POST /admin/system/services/:name/restart` - Redémarrer un service

## 3. Modèles de Données

### 3.1 AdminUser

```typescript
interface AdminUser {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'SUPPORT';
  is_active: boolean;
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  phone?: string;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}
```

### 3.2 AuditLog

```typescript
interface AuditLog {
  id: string;
  admin_user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  status: 'success' | 'failure';
  ip_address: string;
  user_agent: string;
  metadata?: object;
  timestamp: Date;
}
```

## 4. Configuration Kong

### 4.1 Ajouter le Service

```yaml
# kong.yml
services:
  - name: admin-service
    url: http://admin-service:5005
    routes:
      - name: admin-routes
        paths:
          - /api/v1/admin
        strip_path: false
    plugins:
      - name: jwt
        config:
          key_claim_name: kid
          secret_is_base64: false
      - name: rate-limiting
        config:
          minute: 100
          policy: local
```

### 4.2 Déclarer dans docker-compose

```yaml
# infrastructure/docker-compose.kong.yml
services:
  admin-service:
    build: ../backend/admin-service
    container_name: admin-service
    ports:
      - "5005:5005"
    environment:
      - NODE_ENV=development
      - PORT=5005
      - DATABASE_URL=postgresql://admin:admin@admin-db:5432/admin_db
      - JWT_PUBLIC_KEY_PATH=/keys/public.pem
    volumes:
      - ../backend/admin-service:/app
      - ../backend/auth-service/keys:/keys:ro
    depends_on:
      - admin-db
    networks:
      - kong-net

  admin-db:
    image: postgres:15-alpine
    container_name: admin-db
    environment:
      - POSTGRES_DB=admin_db
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=admin
    volumes:
      - admin-db-data:/var/lib/postgresql/data
    networks:
      - kong-net

volumes:
  admin-db-data:
```

## 5. Authentification et Autorisations

### 5.1 Middleware d'Authentification

Le service doit :
1. Vérifier le JWT fourni par `auth-service`
2. Extraire les claims (user_id, roles, permissions)
3. Vérifier que l'utilisateur a un rôle admin

### 5.2 Middleware de Permissions

Le service doit :
1. Vérifier que l'utilisateur a la permission requise
2. Logger toutes les actions dans `AuditLog`
3. Implémenter le 2FA pour les actions critiques

## 6. Intégration avec les Services Existants

### 6.1 Auth Service

- Utiliser la clé publique JWT partagée pour valider les tokens
- Synchroniser les utilisateurs admin avec la table users du auth-service

### 6.2 Autres Services

- Appeler les APIs des autres services pour récupérer les métriques
- Implémenter un système de cache pour les données agrégées

## 7. Tests

### 7.1 Tests Unitaires

```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

### 7.2 Tests d'Intégration

- Tester tous les endpoints avec des données réelles
- Vérifier les permissions et l'authentification
- Valider les logs d'audit

## 8. Déploiement

### 8.1 Variables d'Environnement

```env
NODE_ENV=production
PORT=5005
DATABASE_URL=postgresql://user:pass@host:5432/admin_db
JWT_PUBLIC_KEY_PATH=/keys/public.pem
CORS_ORIGIN=https://app.agrologistic.com
LOG_LEVEL=info
```

### 8.2 Commandes de Démarrage

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 9. Monitoring et Logs

- Implémenter Winston pour les logs structurés
- Exposer des métriques Prometheus
- Configurer des alertes pour les erreurs critiques

## 10. Sécurité

- [ ] Rate limiting sur tous les endpoints
- [ ] Validation des inputs avec express-validator
- [ ] Sanitization des données
- [ ] CORS configuré strictement
- [ ] Helmet.js pour les headers de sécurité
- [ ] Audit logging complet
- [ ] 2FA obligatoire pour Super Admin

## Timeline Estimée

- **Jour 1-2** : Setup du projet et configuration
- **Jour 3-4** : Implémentation des modèles et routes
- **Jour 5-6** : Middleware et services
- **Jour 7-8** : Tests et intégration Kong
- **Jour 9-10** : Documentation et déploiement

## Prochaines Étapes Immédiates

1. Créer la structure du projet admin-service
2. Configurer la base de données PostgreSQL
3. Implémenter les modèles Sequelize
4. Créer les endpoints de base
5. Tester l'intégration avec Kong
