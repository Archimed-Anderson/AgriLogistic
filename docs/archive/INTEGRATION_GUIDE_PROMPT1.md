# 🛠️ GUIDE D'INTÉGRATION - Configuration Centralisée

## 📋 PROMPT 1 : Harmonisation Nucléaire - LIVRABLES

### ✅ Livrables Créés

1. **Script de Migration** : `scripts/upgrade-nestjs-v11.js`
2. **Package Config** : `packages/config/`
   - `package.json`
   - `tsconfig.json`
   - `src/index.ts`
   - `src/config.module.ts`
   - `src/config.schema.ts`
   - `src/config.interface.ts`
   - `.env.example`
   - `README.md`

---

## 🚀 ÉTAPE 1 : Exécuter le Script de Migration

```bash
# Depuis la racine du projet
cd c:\Users\ander\Downloads\Agrodeepwebapp-main\AgroDeep

# Exécuter le script de migration
node scripts/upgrade-nestjs-v11.js
```

**Résultat attendu:**
```
⚛️ QUANTUM SYNCHRONIZATION - NestJS v11 Migration

ℹ Scanning services for package.json files...
ℹ Found 21 package.json files

✓ Upgraded: services/identity/user-service
  @nestjs/common: ^10.0.0 → ^11.0.1
  @nestjs/core: ^10.0.0 → ^11.0.1
  typescript: ^5.3.0 → ^5.7.2

...

📊 RAPPORT DE MIGRATION
Total services scannés:    21
Services mis à jour:       18
Services déjà à jour:      3
Échecs:                    0
Total changements:         54

✨ Migration terminée avec succès!
```

---

## 🔧 ÉTAPE 2 : Installer le Package Config

```bash
# Installer les dépendances du package config
cd packages/config
pnpm install

# Build le package
pnpm build

# Retour à la racine
cd ../..

# Installer dans tous les services (via workspace)
pnpm install
```

---

## 📝 ÉTAPE 3 : Créer le .env Principal

```bash
# Copier le template
cp packages/config/.env.example .env

# Générer des secrets sécurisés
# JWT Secret
openssl rand -base64 32

# Redis Password
openssl rand -base64 24
```

**Éditer `.env` et remplir:**

```env
# Application
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000

# Database (REMPLACER avec votre vraie URL)
DATABASE_URL=postgresql://user:password@localhost:5432/agrodeep
DB_POOL_SIZE=10

# JWT (REMPLACER avec secret généré)
JWT_SECRET=votre-secret-genere-avec-openssl-rand-base64-32
JWT_EXPIRES_IN=1h

# Redis (OPTIONNEL)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=votre-password-redis-genere
```

---

## 🔄 ÉTAPE 4 : Intégrer dans un Service (Exemple: user-service)

### 4.1 Modifier `app.module.ts`

```typescript
// services/identity/user-service/src/app.module.ts

import { Module } from '@nestjs/common';
import { AgroDeepConfigModule } from '@agrologistic/config'; // ✅ AJOUTER

@Module({
  imports: [
    AgroDeepConfigModule, // ✅ AJOUTER EN PREMIER
    
    // ... autres imports existants
    TypeOrmModule.forRoot({
      // ... config existante
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
```

### 4.2 Modifier `main.ts`

```typescript
// services/identity/user-service/src/main.ts

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config'; // ✅ AJOUTER
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ AJOUTER: Récupérer ConfigService
  const configService = app.get(ConfigService);
  
  // ✅ REMPLACER: process.env.PORT par configService
  const port = configService.get<number>('PORT', 3001);
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  
  // ✅ AJOUTER: CORS configuré
  app.enableCors({ origin: corsOrigin });
  
  await app.listen(port);
  console.log(`🚀 User Service running on port ${port}`);
}

bootstrap();
```

### 4.3 Migrer les Services (Exemple: database.service.ts)

**❌ AVANT:**

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  private readonly dbUrl = process.env.DATABASE_URL || 'postgresql://default:password@localhost/db';
  private readonly poolSize = parseInt(process.env.DB_POOL_SIZE || '20');
  
  getConnection() {
    // ...
  }
}
```

**✅ APRÈS:**

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // ✅ AJOUTER

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {} // ✅ INJECT
  
  getConnection() {
    // ✅ Type-safe et validé
    const dbUrl = this.configService.get<string>('DATABASE_URL');
    const poolSize = this.configService.get<number>('DB_POOL_SIZE', 10);
    
    // ...
  }
}
```

---

## 🔍 ÉTAPE 5 : Vérifier la Migration

### 5.1 Vérifier les changements

```bash
# Voir les fichiers modifiés
git status

# Voir les changements dans package.json
git diff services/*/package.json
```

### 5.2 Tester la compilation

```bash
# Build tous les services
pnpm build

# Si erreurs, vérifier les peer dependencies
pnpm install --force
```

### 5.3 Tester un service individuellement

```bash
# Exemple: user-service
cd services/identity/user-service

# Installer les dépendances
pnpm install

# Démarrer en mode dev
pnpm dev
```

**Résultat attendu:**

```
[Nest] 12345  - 2026-02-07 16:30:00     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 2026-02-07 16:30:00     LOG [InstanceLoader] ConfigModule dependencies initialized
[Nest] 12345  - 2026-02-07 16:30:00     LOG [InstanceLoader] AppModule dependencies initialized
🚀 User Service running on port 3001
```

---

## ⚠️ PROBLÈMES COURANTS ET SOLUTIONS

### Problème 1: "Cannot find module '@agrologistic/config'"

**Solution:**

```bash
# Rebuild le package config
cd packages/config
pnpm build

# Réinstaller dans le workspace
cd ../..
pnpm install
```

### Problème 2: "DATABASE_URL is REQUIRED"

**Solution:**

```bash
# Vérifier que .env existe à la racine
ls -la .env

# Si absent, copier le template
cp packages/config/.env.example .env

# Éditer et remplir DATABASE_URL
nano .env
```

### Problème 3: Peer dependency warnings

**Solution:**

```bash
# Forcer l'installation
pnpm install --force

# Ou nettoyer et réinstaller
rm -rf node_modules
pnpm install
```

### Problème 4: "secretOrPrivateKey must have a value"

**Solution:**

```bash
# Générer un JWT_SECRET
openssl rand -base64 32

# Ajouter dans .env
echo "JWT_SECRET=votre-secret-genere" >> .env
```

---

## 📊 CHECKLIST DE MIGRATION PAR SERVICE

Pour chaque service, vérifier:

- [ ] `package.json` : NestJS v11.0.1 ✅
- [ ] `package.json` : TypeScript v5.7.2 ✅
- [ ] `app.module.ts` : Import `AgroDeepConfigModule` ✅
- [ ] `main.ts` : Utilise `ConfigService` au lieu de `process.env.PORT` ✅
- [ ] Services : Injectent `ConfigService` au lieu de `process.env` ✅
- [ ] Aucun credential hard-codé restant ✅
- [ ] Build réussit sans erreur ✅
- [ ] Service démarre correctement ✅

---

## 🎯 SERVICES À MIGRER (21 total)

### Identity (3)
- [ ] user-service
- [ ] admin-service
- [ ] auth-service-legacy

### Marketplace (3)
- [ ] product-service
- [ ] order-service
- [ ] inventory-service

### Logistics (6)
- [ ] mission-service
- [ ] rentals-service
- [ ] coldchain-service
- [ ] iot-service
- [ ] production-service
- [ ] delivery-service

### Intelligence (4)
- [ ] ai-service
- [ ] analytics-service
- [ ] incident-service
- [ ] weather-service

### Finance (1)
- [ ] credit-service

### Communication (1)
- [ ] notification-service

### Trust (1)
- [ ] blockchain-service

### Coop (1)
- [ ] coop-service

### AI Vision (1)
- [ ] vision-service (NestJS)

---

## 🚀 PROCHAINES ÉTAPES

Après cette migration:

1. **Tester tous les services** : `pnpm dev` depuis la racine
2. **Vérifier health-checks** : `.\health-check.ps1 -Detailed`
3. **Commit les changements** :
   ```bash
   git add .
   git commit -m "feat: migrate to NestJS v11 + centralized config"
   ```
4. **Passer au PROMPT 2** : Fixer les services Python (AI)

---

## 📚 DOCUMENTATION

- **Package Config**: `packages/config/README.md`
- **Audit Technique**: `TECHNICAL_AUDIT_COMPLETE.md`
- **NestJS Expert Skill**: `.agent/skills/skills/nestjs-expert/SKILL.md`

---

**✨ Fin du Guide d'Intégration - PROMPT 1**
