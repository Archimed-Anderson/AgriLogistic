# @agrologistic/config

> 🛠️ **OPÉRATION RÉSURRECTION - PHASE 1**  
> Module de Configuration Centralisée pour AgroDeep

## 🎯 Objectif

Fournir une **configuration validée, type-safe et centralisée** pour TOUS les microservices AgroDeep, éliminant les `process.env` fragmentés et les credentials hard-codés.

## ✨ Fonctionnalités

- ✅ **Validation stricte** avec Joi au démarrage
- ✅ **Type-safety** TypeScript complet
- ✅ **Messages d'erreur clairs** pour debugging rapide
- ✅ **Multi-environnement** (.env.development, .env.production)
- ✅ **Aucun credential hard-codé** (placeholders sécurisés)
- ✅ **Global module** (disponible partout sans import répété)
- ✅ **Testable** (mock ConfigService facilement)

## 📦 Installation

```bash
# Depuis la racine du projet
cd packages/config
pnpm install
pnpm build
```

## 🚀 Utilisation

### 1. Importer dans votre service

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { AgroDeepConfigModule } from '@agrologistic/config';

@Module({
  imports: [
    AgroDeepConfigModule, // ✅ Ajouter cette ligne
    // ... autres imports
  ],
})
export class AppModule {}
```

### 2. Utiliser dans vos services

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  getConnectionString(): string {
    // ✅ Type-safe et validé
    return this.configService.get<string>('DATABASE_URL');
  }

  getPoolSize(): number {
    // ✅ Avec valeur par défaut
    return this.configService.get<number>('DB_POOL_SIZE', 10);
  }
}
```

### 3. Utiliser dans main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  const port = configService.get<number>('PORT', 3000);
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  
  app.enableCors({ origin: corsOrigin });
  await app.listen(port);
}

bootstrap();
```

## 🔐 Configuration .env

1. **Copier le template**:
   ```bash
   cp packages/config/.env.example .env
   ```

2. **Générer des secrets sécurisés**:
   ```bash
   # JWT Secret (min 32 caractères)
   openssl rand -base64 32
   
   # Redis Password
   openssl rand -base64 24
   ```

3. **Remplir les valeurs**:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/agrodeep
   JWT_SECRET=votre-secret-genere-avec-openssl
   REDIS_PASSWORD=votre-password-redis
   ```

## 📋 Variables Disponibles

### Application
- `NODE_ENV` - Environment (development/staging/production/test)
- `PORT` - Port du service
- `CORS_ORIGIN` - Origins autorisées pour CORS
- `API_PREFIX` - Préfixe des routes API

### Database
- `DATABASE_URL` - **REQUIRED** - URL PostgreSQL
- `DB_POOL_SIZE` - Taille du pool de connexions (default: 10)
- `DB_SSL` - Activer SSL (default: false)

### Redis (Optional)
- `REDIS_HOST` - Host Redis (default: localhost)
- `REDIS_PORT` - Port Redis (default: 6379)
- `REDIS_PASSWORD` - **REQUIRED en production**
- `REDIS_DB` - Numéro de DB (default: 0)

### JWT
- `JWT_SECRET` - **REQUIRED** - Secret de signature (min 32 chars)
- `JWT_EXPIRES_IN` - Expiration token (default: 1h)
- `JWT_REFRESH_EXPIRES_IN` - Expiration refresh (default: 7d)

### Cloud (Optional)
- `R2_ACCOUNT_ID` - Cloudflare R2 account
- `R2_ACCESS_KEY` - R2 access key
- `R2_SECRET_KEY` - R2 secret key
- `R2_BUCKET_NAME` - R2 bucket name

### Monitoring (Optional)
- `SLACK_WEBHOOK_URL` - Webhook Slack pour alertes
- `PAGERDUTY_ROUTING_KEY` - Clé PagerDuty
- `SENTRY_DSN` - Sentry DSN pour error tracking

## ⚠️ Migration depuis process.env

### ❌ AVANT (Dangereux)

```typescript
// ❌ Non validé, credentials hard-codés
const dbUrl = process.env.DATABASE_URL || 'postgresql://default:password@localhost/db';
const port = parseInt(process.env.PORT || '3000');
const jwtSecret = process.env.JWT_SECRET || 'insecure-default-secret';
```

### ✅ APRÈS (Sécurisé)

```typescript
// ✅ Validé, type-safe, aucun credential hard-codé
constructor(private configService: ConfigService) {}

const dbUrl = this.configService.get<string>('DATABASE_URL'); // Fail si absent
const port = this.configService.get<number>('PORT', 3000);
const jwtSecret = this.configService.get<string>('JWT_SECRET'); // Fail si absent
```

## 🧪 Tests

```typescript
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

describe('MyService', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          // ✅ Mock config pour tests
          ignoreEnvFile: true,
          load: [() => ({
            DATABASE_URL: 'postgresql://test:test@localhost/test',
            JWT_SECRET: 'test-secret-32-characters-long',
          })],
        }),
      ],
      providers: [MyService],
    }).compile();
  });
});
```

## 🔒 Sécurité

### ✅ Bonnes Pratiques

1. **Jamais de credentials en dur**
   ```typescript
   // ❌ DANGEREUX
   const password = 'AgroLogistic_secure_2026';
   
   // ✅ CORRECT
   const password = this.configService.get<string>('DB_PASSWORD');
   ```

2. **Secrets forts**
   ```bash
   # ✅ Générer avec OpenSSL
   openssl rand -base64 32
   
   # ❌ Ne jamais utiliser
   JWT_SECRET=secret123
   ```

3. **Validation au démarrage**
   ```typescript
   // ✅ L'app ne démarre PAS si DATABASE_URL manque
   // Fail-fast au lieu de crasher en production
   ```

4. **Environnements séparés**
   ```
   .env.development  ← Dev local
   .env.staging      ← Staging
   .env.production   ← Production (jamais committé)
   ```

## 📚 Documentation Complète

Voir `src/config.module.ts` pour la documentation exhaustive avec tous les exemples d'utilisation.

## 🤝 Contribution

Pour ajouter une nouvelle variable:

1. Ajouter dans `config.schema.ts` avec validation Joi
2. Ajouter dans `config.interface.ts` pour type-safety
3. Documenter dans `.env.example`
4. Mettre à jour ce README

## 📄 License

MIT
