# 🚀 PROMPT COMPLET - Système d'Authentification AgriLogistic

## 📋 CONTEXTE

Tu dois implémenter un **système d'authentification robuste et enterprise-grade** pour **AgriLogistic**, une plateforme de logistique agricole. Ce système doit être sécurisé, scalable et prêt pour la production.

---

## 🎯 OBJECTIF

Créer un système d'authentification complet avec :
- Backend API REST (NestJS + TypeScript)
- Frontend moderne (Next.js 14 + TypeScript)
- Base de données PostgreSQL + Redis
- Docker containerization
- Documentation complète

---

## 🏗️ ARCHITECTURE GLOBALE

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STACK TECHNIQUE AGRI-LOGISTIC                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   FRONTEND                    BACKEND                   DATA             │
│   ┌─────────────┐            ┌─────────────┐          ┌─────────────┐   │
│   │  Next.js 14 │◄──────────►│   NestJS    │◄────────►│ PostgreSQL  │   │
│   │  TypeScript │   HTTP/REST│  TypeScript │          │   + PostGIS │   │
│   │  Tailwind   │            │   Prisma ORM│          │             │   │
│   │  Zustand    │            │   JWT Auth  │          │    Redis    │   │
│   └─────────────┘            └─────────────┘          │   (Cache)   │   │
│                                                        └─────────────┘   │
│                                                                          │
│   DOCKER: docker-compose.yml (tout le stack en containers)               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 STRUCTURE DES DOSSIERS À CRÉER

```
agri-logistic/
├── docker-compose.yml              # Stack Docker complet
├── .env.example                    # Variables d'environnement
├── README.md                       # Documentation
│
├── backend/                        # API NestJS
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   │
│   ├── src/
│   │   ├── main.ts                 # Point d'entrée
│   │   ├── app.module.ts           # Module racine
│   │   │
│   │   ├── auth/                   # MODULE AUTHENTIFICATION
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts  # Endpoints auth
│   │   │   ├── auth.service.ts     # Logique métier auth
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── refresh-token.dto.ts
│   │   │   │   ├── password-reset.dto.ts
│   │   │   │   └── two-factor.dto.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   │
│   │   ├── users/                  # MODULE UTILISATEURS
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── common/                 # SERVICES PARTAGÉS
│   │   │   ├── common.module.ts
│   │   │   ├── services/
│   │   │   │   ├── password.service.ts      # Hash bcrypt
│   │   │   │   ├── token.service.ts         # JWT tokens
│   │   │   │   ├── redis.service.ts         # Cache Redis
│   │   │   │   ├── encryption.service.ts    # Chiffrement AES
│   │   │   │   └── audit.service.ts         # Logs d'audit
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts        # Protection JWT
│   │   │   │   └── roles.guard.ts           # Protection rôles
│   │   │   └── decorators/
│   │   │       ├── public.decorator.ts
│   │   │       ├── roles.decorator.ts
│   │   │       └── current-user.decorator.ts
│   │   │
│   │   ├── prisma/                 # CONFIGURATION PRISMA
│   │   │   ├── prisma.module.ts
│   │   │   ├── prisma.service.ts
│   │   │   └── seed.ts             # Données de test
│   │   │
│   │   └── config/
│   │       └── config.module.ts    # Configuration globale
│   │
│   └── prisma/
│       └── schema.prisma           # SCHÉMA BASE DE DONNÉES
│
└── frontend/                       # Application Next.js
    ├── Dockerfile
    ├── package.json
    ├── next.config.js
    ├── tsconfig.json
    ├── tailwind.config.ts
    │
    ├── src/
    │   ├── app/                    # ROUTES NEXT.JS 14
    │   │   ├── layout.tsx          # Layout racine
    │   │   ├── page.tsx            # Page d'accueil (redirection)
    │   │   ├── globals.css
    │   │   │
    │   │   ├── login/
    │   │   │   └── page.tsx        # Page connexion
    │   │   ├── register/
    │   │   │   └── page.tsx        # Page inscription
    │   │   ├── forgot-password/
    │   │   │   └── page.tsx        # Mot de passe oublié
    │   │   ├── reset-password/
    │   │   │   └── page.tsx        # Réinitialisation
    │   │   ├── verify-email/
    │   │   │   └── page.tsx        # Vérification email
    │   │   │
    │   │   ├── dashboard/
    │   │   │   └── page.tsx        # Dashboard (redirection rôle)
    │   │   ├── admin/
    │   │   │   └── dashboard/
    │   │   │       └── page.tsx    # Dashboard Admin
    │   │   ├── farmer/
    │   │   │   └── dashboard/
    │   │   │       └── page.tsx    # Dashboard Agriculteur
    │   │   ├── transporter/
    │   │   │   └── dashboard/
    │   │   │       └── page.tsx    # Dashboard Transporteur
    │   │   └── buyer/
    │   │       └── dashboard/
    │   │           └── page.tsx    # Dashboard Acheteur
    │   │
    │   ├── components/             # COMPOSANTS RÉUTILISABLES
    │   │   ├── ui/
    │   │   │   ├── Button.tsx
    │   │   │   ├── Input.tsx
    │   │   │   ├── Card.tsx
    │   │   │   ├── Modal.tsx
    │   │   │   ├── Toaster.tsx
    │   │   │   └── index.ts
    │   │   ├── forms/
    │   │   │   ├── LoginForm.tsx
    │   │   │   ├── RegisterForm.tsx
    │   │   │   └── TwoFAForm.tsx
    │   │   └── layout/
    │   │       ├── Header.tsx
    │   │       ├── Sidebar.tsx
    │   │       └── ProtectedLayout.tsx
    │   │
    │   ├── hooks/                  # HOOKS PERSONNALISÉS
    │   │   ├── useAuth.ts
    │   │   ├── useUser.ts
    │   │   └── useToast.ts
    │   │
    │   ├── lib/                    # UTILITAIRES
    │   │   ├── api.ts              # Client API Axios
    │   │   ├── utils.ts            # Fonctions utilitaires
    │   │   └── constants.ts        # Constantes
    │   │
    │   ├── stores/                 # ÉTAT GLOBAL (Zustand)
    │   │   ├── authStore.ts        # Store authentification
    │   │   └── userStore.ts        # Store utilisateur
    │   │
    │   ├── types/                  # TYPES TYPESCRIPT
    │   │   ├── auth.ts
    │   │   ├── user.ts
    │   │   └── index.ts
    │   │
    │   └── middleware.ts           # MIDDLEWARE NEXT.JS (protection routes)
    │
    └── public/                     # ASSETS STATIQUES
        └── images/
```

---

## 📊 SCHÉMA PRISMA (À IMPLÉMENTER)

```prisma
// =============================================================================
// ENUMS
// =============================================================================

enum UserRole {
  ADMIN
  FARMER
  TRANSPORTER
  BUYER
}

enum UserStatus {
  PENDING
  ACTIVE
  SUSPENDED
  BANNED
  DELETED
}

enum KycLevel {
  NONE
  BASIC
  VERIFIED
  ENTERPRISE
}

enum TwoFactorMethod {
  NONE
  TOTP
  SMS
  EMAIL
}

enum Gender {
  MALE
  FEMALE
  OTHER
  PREFER_NOT_TO_SAY
}

// =============================================================================
// MODÈLES PRINCIPAUX
// =============================================================================

model User {
  id                    String          @id @default(uuid())
  email                 String          @unique
  password              String
  
  role                  UserRole        @default(BUYER)
  status                UserStatus      @default(PENDING)
  kycLevel              KycLevel        @default(NONE)
  
  isEmailVerified       Boolean         @default(false)
  emailVerifiedAt       DateTime?
  
  twoFactorMethod       TwoFactorMethod @default(NONE)
  twoFactorSecret       String?
  twoFactorEnabledAt    DateTime?
  
  failedLoginAttempts   Int             @default(0)
  lockedUntil           DateTime?
  lastLoginAt           DateTime?
  lastLoginIp           String?
  
  passwordChangedAt     DateTime?
  mustChangePassword    Boolean         @default(false)
  
  refreshTokens         RefreshToken[]
  passwordResetTokens   PasswordResetToken[]
  emailVerificationTokens EmailVerificationToken[]
  
  profile               UserProfile?
  sessions              UserSession[]
  auditLogs             AuditLog[]
  notifications         Notification[]
  
  farmerProfile         FarmerProfile?
  transporterProfile    TransporterProfile?
  buyerProfile          BuyerProfile?
  adminProfile          AdminProfile?
  
  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt
  deletedAt             DateTime?
  
  @@index([email])
  @@index([role])
  @@index([status])
  @@map("users")
}

model UserProfile {
  id              String    @id @default(uuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  firstName       String?
  lastName        String?
  displayName     String?
  phoneNumber     String?
  phoneVerified   Boolean   @default(false)
  
  dateOfBirth     DateTime?
  gender          Gender?
  
  address         String?
  city            String?
  region          String?
  country         String?   @default("CI")
  postalCode      String?
  latitude        Float?
  longitude       Float?
  
  avatarUrl       String?
  coverImageUrl   String?
  
  language        String    @default("fr")
  timezone        String    @default("Africa/Abidjan")
  currency        String    @default("XOF")
  
  emailNotifications Boolean @default(true)
  smsNotifications   Boolean @default(false)
  pushNotifications  Boolean @default(true)
  
  bio             String?   @db.Text
  website         String?
  socialLinks     Json?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@map("user_profiles")
}

model RefreshToken {
  id                String    @id @default(uuid())
  userId            String
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  token             String    @unique
  expiresAt         DateTime
  
  createdAt         DateTime  @default(now())
  revokedAt         DateTime?
  revokedByIp       String?
  replacedByToken   String?
  
  deviceInfo        String?
  ipAddress         String?
  
  @@index([userId])
  @@index([token])
  @@map("refresh_tokens")
}

model PasswordResetToken {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  token       String    @unique
  expiresAt   DateTime
  
  createdAt   DateTime  @default(now())
  usedAt      DateTime?
  ipAddress   String?
  
  @@index([userId])
  @@map("password_reset_tokens")
}

model EmailVerificationToken {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  token       String    @unique
  expiresAt   DateTime
  
  createdAt   DateTime  @default(now())
  usedAt      DateTime?
  
  @@index([userId])
  @@map("email_verification_tokens")
}

model UserSession {
  id                String    @id @default(uuid())
  userId            String
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  sessionToken      String    @unique
  expiresAt         DateTime
  
  deviceType        String?
  deviceName        String?
  browser           String?
  browserVersion    String?
  os                String?
  osVersion         String?
  userAgent         String?   @db.Text
  
  ipAddress         String?
  country           String?
  city              String?
  
  isActive          Boolean   @default(true)
  lastActivityAt    DateTime  @default(now())
  
  createdAt         DateTime  @default(now())
  revokedAt         DateTime?
  
  @@index([userId])
  @@map("user_sessions")
}

model AuditLog {
  id              String    @id @default(uuid())
  
  userId          String?
  user            User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  action          String
  entity          String?
  entityId        String?
  
  description     String?   @db.Text
  metadata        Json?
  
  ipAddress       String?
  userAgent       String?   @db.Text
  requestMethod   String?
  requestUrl      String?
  requestBody     Json?
  
  success         Boolean   @default(true)
  errorMessage    String?   @db.Text
  
  createdAt       DateTime  @default(now())
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
  @@map("audit_logs")
}

model Notification {
  id              String    @id @default(uuid())
  
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type            String
  title           String
  message         String    @db.Text
  
  imageUrl        String?
  actionUrl       String?
  
  isRead          Boolean   @default(false)
  readAt          DateTime?
  
  sentViaEmail    Boolean   @default(false)
  sentViaPush     Boolean   @default(false)
  sentViaSms      Boolean   @default(false)
  
  createdAt       DateTime  @default(now())
  
  @@index([userId])
  @@index([isRead])
  @@map("notifications")
}

// Profils spécifiques par rôle
model FarmerProfile {
  id                  String    @id @default(uuid())
  userId              String    @unique
  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  farmName            String?
  farmSize            Float?
  farmType            String?
  certifications      String[]
  mainProducts        String[]
  annualProduction    Json?
  
  hasIrrigation       Boolean   @default(false)
  hasStorage          Boolean   @default(false)
  storageCapacity     Float?
  
  isCooperative       Boolean   @default(false)
  cooperativeName     String?
  membersCount        Int?
  
  rating              Float     @default(0)
  reviewsCount        Int       @default(0)
  
  identityDocumentUrl String?
  landTitleUrl        String?
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  @@map("farmer_profiles")
}

model TransporterProfile {
  id                  String    @id @default(uuid())
  userId              String    @unique
  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  companyName         String?
  registrationNumber  String?
  taxId               String?
  
  fleetSize           Int       @default(0)
  vehicleTypes        String[]
  coverageRegions     String[]
  
  maxCapacity         Float?
  hasRefrigerated     Boolean   @default(false)
  hasGpsTracking      Boolean   @default(false)
  
  rating              Float     @default(0)
  reviewsCount        Int       @default(0)
  onTimeRate          Float     @default(0)
  
  licenseUrl          String?
  insuranceUrl        String?
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  @@map("transporter_profiles")
}

model BuyerProfile {
  id                  String    @id @default(uuid())
  userId              String    @unique
  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  companyName         String?
  companyType         String?
  registrationNumber  String?
  taxId               String?
  
  preferredProducts   String[]
  monthlyVolume       Float?
  
  isExportLicensed    Boolean   @default(false)
  exportLicenseUrl    String?
  
  paymentTerms        String    @default("immediate")
  deliveryPreference  String    @default("pickup")
  
  rating              Float     @default(0)
  reviewsCount        Int       @default(0)
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  @@map("buyer_profiles")
}

model AdminProfile {
  id              String    @id @default(uuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  department      String?
  level           Int       @default(1)
  permissions     String[]
  
  internalPhone   String?
  employeeId      String?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@map("admin_profiles")
}
```

---

## 🔌 ENDPOINTS API À IMPLÉMENTER

### Authentification (Public)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/register` | Inscription avec validation email |
| POST | `/api/v1/auth/login` | Connexion (JWT + refresh) |
| POST | `/api/v1/auth/refresh` | Rafraîchir access token |
| POST | `/api/v1/auth/password-reset-request` | Demande reset password |
| POST | `/api/v1/auth/password-reset` | Confirmer reset password |
| POST | `/api/v1/auth/verify-email` | Vérifier email |
| POST | `/api/v1/auth/2fa/verify-login` | Vérifier 2FA lors login |

### Authentification (Protégé)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/logout` | Déconnexion |
| POST | `/api/v1/auth/logout-all` | Déconnexion toutes sessions |
| POST | `/api/v1/auth/change-password` | Changer mot de passe |
| POST | `/api/v1/auth/2fa/setup` | Configurer 2FA |
| POST | `/api/v1/auth/2fa/verify` | Vérifier et activer 2FA |
| POST | `/api/v1/auth/2fa/disable` | Désactiver 2FA |
| GET | `/api/v1/auth/2fa/status` | Statut 2FA |
| POST | `/api/v1/auth/resend-verification` | Renvoyer email vérif |
| GET | `/api/v1/auth/sessions` | Liste sessions actives |
| POST | `/api/v1/auth/sessions/revoke` | Révoquer une session |

### Utilisateurs

| Méthode | Endpoint | Description | Rôle |
|---------|----------|-------------|------|
| GET | `/api/v1/users/me` | Mon profil | * |
| PATCH | `/api/v1/users/me` | Modifier profil | * |
| GET | `/api/v1/users/dashboard` | Dashboard perso | * |
| GET | `/api/v1/users` | Liste users | Admin |
| GET | `/api/v1/users/:id` | Détails user | Admin |
| PATCH | `/api/v1/users/:id/status` | Changer statut | Admin |

---

## 🐳 DOCKER-COMPOSE (À IMPLÉMENTER)

```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:15-3.4-alpine
    container_name: agri-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER:-agrilogic}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-SecurePass123!}
      POSTGRES_DB: ${DB_NAME:-agri_logistic}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "${DB_PORT:-5432}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-agrilogic}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - agri-network

  redis:
    image: redis:7-alpine
    container_name: agri-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD:-RedisSecure456!}
    volumes:
      - redis_data:/data
    ports:
      - "${REDIS_PORT:-6379}:6379"
    networks:
      - agri-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    container_name: agri-backend
    restart: unless-stopped
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: ${BACKEND_PORT:-3001}
      DATABASE_URL: postgresql://${DB_USER:-agrilogic}:${DB_PASSWORD:-SecurePass123!}@postgres:5432/${DB_NAME:-agri_logistic}?schema=public
      REDIS_URL: redis://:${REDIS_PASSWORD:-RedisSecure456!}@redis:6379
      JWT_SECRET: ${JWT_SECRET:-YourSuperSecretJWTKey}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET:-YourSuperSecretRefreshKey}
      JWT_ACCESS_EXPIRATION: ${JWT_ACCESS_EXPIRATION:-15m}
      JWT_REFRESH_EXPIRATION: ${JWT_REFRESH_EXPIRATION:-7d}
      BCRYPT_ROUNDS: ${BCRYPT_ROUNDS:-12}
      FRONTEND_URL: ${FRONTEND_URL:-http://localhost:3000}
    volumes:
      - ./backend:/app
      - /app/node_modules
    ports:
      - "${BACKEND_PORT:-3001}:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - agri-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    container_name: agri-frontend
    restart: unless-stopped
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:3001}
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "${FRONTEND_PORT:-3000}:3000"
    depends_on:
      - backend
    networks:
      - agri-network

  ollama:
    image: ollama/ollama:latest
    container_name: agri-ollama
    restart: unless-stopped
    volumes:
      - ollama_data:/root/.ollama
    ports:
      - "${OLLAMA_PORT:-11434}:11434"
    networks:
      - agri-network
    profiles:
      - with-ai

  adminer:
    image: adminer:latest
    container_name: agri-adminer
    restart: unless-stopped
    ports:
      - "${ADMINER_PORT:-8080}:8080"
    depends_on:
      - postgres
    networks:
      - agri-network
    profiles:
      - dev-tools

volumes:
  postgres_data:
  redis_data:
  ollama_data:

networks:
  agri-network:
    driver: bridge
```

---

## 🔐 EXIGENCES DE SÉCURITÉ

### Authentification
- [ ] JWT avec access token (15 min) + refresh token (7 jours)
- [ ] Blacklist des refresh tokens révoqués dans Redis
- [ ] 2FA TOTP avec QR code et backup codes
- [ ] Rate limiting: 5 tentatives de login/minute

### Passwords
- [ ] Hash bcrypt avec 12 rounds minimum
- [ ] Validation force mot de passe (8+ caractères, majuscule, minuscule, chiffre, spécial)
- [ ] Historique des mots de passe (optionnel)

### Encryption
- [ ] Secrets 2FA chiffrés avec AES-256-GCM
- [ ] Variables sensibles dans .env (jamais dans le code)

### Protection
- [ ] Helmet.js pour les headers de sécurité
- [ ] CORS configuré strictement
- [ ] CSRF protection
- [ ] XSS protection (échappement des entrées)
- [ ] SQL injection protection (Prisma ORM)

---

## 🎨 EXIGENCES FRONTEND

### Pages Publiques
- [ ] `/login` - Formulaire connexion avec 2FA
- [ ] `/register` - Formulaire inscription multi-étapes
- [ ] `/forgot-password` - Demande reset password
- [ ] `/reset-password` - Nouveau mot de passe
- [ ] `/verify-email` - Confirmation email

### Pages Protégées (par rôle)
- [ ] `/dashboard` - Redirection selon rôle
- [ ] `/admin/dashboard` - Dashboard administrateur
- [ ] `/farmer/dashboard` - Dashboard agriculteur
- [ ] `/transporter/dashboard` - Dashboard transporteur
- [ ] `/buyer/dashboard` - Dashboard acheteur

### Composants UI
- [ ] Button (variants: primary, secondary, outline, danger)
- [ ] Input (avec icône, password toggle, validation)
- [ ] Card (header, body, footer)
- [ ] Modal (confirmation, formulaires)
- [ ] Toast notifications (success, error, info)
- [ ] Form validation visuelle

### State Management
- [ ] Zustand pour auth store (persisté dans localStorage)
- [ ] Gestion automatique des tokens
- [ ] Refresh token silencieux
- [ ] Logout automatique sur 401

---

## 🧪 UTILISATEURS DE TEST (SEED)

```typescript
// À créer dans backend/prisma/seed.ts
const users = [
  {
    email: 'admin@agri-logistic.com',
    password: 'Password123!',
    role: 'ADMIN',
    status: 'ACTIVE',
    kycLevel: 'ENTERPRISE',
    profile: { firstName: 'Super', lastName: 'Admin' }
  },
  {
    email: 'farmer@example.com',
    password: 'Password123!',
    role: 'FARMER',
    status: 'ACTIVE',
    kycLevel: 'VERIFIED',
    profile: { firstName: 'Amadou', lastName: 'Koné', city: 'Bouaké' }
  },
  {
    email: 'transporter@example.com',
    password: 'Password123!',
    role: 'TRANSPORTER',
    status: 'ACTIVE',
    kycLevel: 'ENTERPRISE',
    profile: { firstName: 'Kouassi', lastName: 'Yao', city: 'Abidjan' }
  },
  {
    email: 'buyer@example.com',
    password: 'Password123!',
    role: 'BUYER',
    status: 'ACTIVE',
    kycLevel: 'ENTERPRISE',
    profile: { firstName: 'Marie', lastName: 'Dupont', city: 'Abidjan' }
  }
];
```

---

## 📚 DOCUMENTATION À PRODUIRE

1. **README.md** - Instructions d'installation et démarrage
2. **API.md** - Documentation des endpoints (Swagger généré)
3. **ENV.md** - Description des variables d'environnement
4. **DEPLOYMENT.md** - Guide de déploiement production

---

## ✅ CHECKLIST DE LIVRAISON

### Backend
- [ ] NestJS configuré avec TypeScript strict
- [ ] Prisma ORM avec schéma complet
- [ ] Migrations et seed fonctionnels
- [ ] Auth service complet (register, login, logout, refresh)
- [ ] 2FA TOTP fonctionnel
- [ ] JWT guards et RBAC guards
- [ ] Password service avec bcrypt
- [ ] Token service avec JWT
- [ ] Redis service pour cache/sessions
- [ ] Encryption service pour secrets
- [ ] Audit service pour logs
- [ ] Rate limiting configuré
- [ ] Swagger documentation auto-générée
- [ ] Tests unitaires (auth service)
- [ ] Tests e2e (auth flow)

### Frontend
- [ ] Next.js 14 avec App Router
- [ ] TypeScript strict
- [ ] Tailwind CSS configuré
- [ ] Zustand stores (auth, user)
- [ ] API client Axios avec intercepteurs
- [ ] Middleware Next.js pour protection routes
- [ ] Pages login/register fonctionnelles
- [ ] Formulaires avec validation Zod
- [ ] 2FA flow complet
- [ ] Dashboards par rôle (UI basique)
- [ ] Gestion des erreurs (toast notifications)
- [ ] Loading states
- [ ] Responsive design

### Docker
- [ ] Dockerfile backend multi-stage
- [ ] Dockerfile frontend multi-stage
- [ ] docker-compose.yml complet
- [ ] Variables d'environnement documentées
- [ ] Health checks configurés

### Sécurité
- [ ] Helmet.js configuré
- [ ] CORS strict
- [ ] Rate limiting actif
- [ ] Password hashing (bcrypt 12+)
- [ ] JWT sécurisé (secrets forts)
- [ ] 2FA TOTP fonctionnel
- [ ] Audit logs en place

---

## 🎯 COMMANDES DE DÉMARRAGE FINALES

```bash
# 1. Cloner et naviguer
cd agri-logistic

# 2. Configuration environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 3. Démarrer le stack
docker-compose --profile dev-tools up -d

# 4. Initialiser la base de données
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma db seed

# 5. Vérifier les services
curl http://localhost:3001/api/v1/auth/health

# 6. Accéder à l'application
open http://localhost:3000
```

---

## 📞 IDENTIFIANTS DE TEST

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@agri-logistic.com | Password123! |
| Agriculteur | farmer@example.com | Password123! |
| Transporteur | transporter@example.com | Password123! |
| Acheteur | buyer@example.com | Password123! |

---

<p align="center">
  <strong>🚀 OBJECTIF: Système d'authentification production-ready en 1 commande docker-compose up</strong>
</p>
