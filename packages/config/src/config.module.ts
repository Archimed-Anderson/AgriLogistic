/**
 * 🛠️ OPÉRATION RÉSURRECTION - PHASE 1
 * Configuration Module Centralisé
 * 
 * Capacité: ⚛️ Quantum Synchronization
 * 
 * Ce module fournit une configuration validée et type-safe pour TOUS les microservices.
 * Il remplace les process.env fragmentés et non validés.
 */

import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configValidationSchema, validationOptions } from './config.schema';

/**
 * 🌐 Global Configuration Module
 * 
 * Usage dans n'importe quel service:
 * 
 * ```typescript
 * import { AgroDeepConfigModule } from '@agrologistic/config';
 * 
 * @Module({
 *   imports: [AgroDeepConfigModule],
 *   // ...
 * })
 * export class AppModule {}
 * ```
 * 
 * Puis dans vos services:
 * 
 * ```typescript
 * import { ConfigService } from '@nestjs/config';
 * 
 * constructor(private configService: ConfigService) {}
 * 
 * getDatabaseUrl() {
 *   return this.configService.get<string>('DATABASE_URL');
 * }
 * ```
 */
@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      // 🔒 Validation stricte avec Joi
      validationSchema: configValidationSchema,
      validationOptions: validationOptions,
      
      // 📁 Charger .env depuis la racine du projet
      envFilePath: [
        '.env.local',           // Priorité 1: Local overrides
        `.env.${process.env.NODE_ENV}`, // Priorité 2: Environment-specific
        '.env',                 // Priorité 3: Default
      ],
      
      // 🌍 Rendre disponible globalement
      isGlobal: true,
      
      // 📦 Expand variables (e.g., ${PORT})
      expandVariables: true,
      
      // ⚠️ Ne pas ignorer les fichiers .env manquants en production
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      
      // 🔄 Cache la configuration
      cache: true,
    }),
  ],
  exports: [NestConfigModule],
})
export class AgroDeepConfigModule {}

/**
 * 📚 DOCUMENTATION D'UTILISATION
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 1. INSTALLATION DANS UN SERVICE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * // app.module.ts
 * import { Module } from '@nestjs/common';
 * import { AgroDeepConfigModule } from '@agrologistic/config';
 * 
 * @Module({
 *   imports: [
 *     AgroDeepConfigModule, // ✅ Ajouter cette ligne
 *     // ... autres imports
 *   ],
 * })
 * export class AppModule {}
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 2. UTILISATION DANS UN SERVICE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * import { Injectable } from '@nestjs/common';
 * import { ConfigService } from '@nestjs/config';
 * 
 * @Injectable()
 * export class DatabaseService {
 *   constructor(private configService: ConfigService) {}
 * 
 *   getConnectionString(): string {
 *     // ✅ Type-safe et validé
 *     return this.configService.get<string>('DATABASE_URL');
 *   }
 * 
 *   getPoolSize(): number {
 *     // ✅ Avec valeur par défaut
 *     return this.configService.get<number>('DB_POOL_SIZE', 10);
 *   }
 * 
 *   isProduction(): boolean {
 *     return this.configService.get<string>('NODE_ENV') === 'production';
 *   }
 * }
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 3. UTILISATION DANS main.ts
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * import { NestFactory } from '@nestjs/core';
 * import { ConfigService } from '@nestjs/config';
 * import { AppModule } from './app.module';
 * 
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   
 *   // ✅ Récupérer ConfigService
 *   const configService = app.get(ConfigService);
 *   
 *   // ✅ Utiliser les variables validées
 *   const port = configService.get<number>('PORT', 3000);
 *   const corsOrigin = configService.get<string>('CORS_ORIGIN');
 *   
 *   app.enableCors({ origin: corsOrigin });
 *   
 *   await app.listen(port);
 *   console.log(`🚀 Application running on port ${port}`);
 * }
 * 
 * bootstrap();
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 4. MIGRATION DEPUIS process.env
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ❌ AVANT (NON VALIDÉ, DANGEREUX):
 * const dbUrl = process.env.DATABASE_URL || 'postgresql://default';
 * const port = parseInt(process.env.PORT || '3000');
 * 
 * ✅ APRÈS (VALIDÉ, TYPE-SAFE):
 * constructor(private configService: ConfigService) {}
 * 
 * const dbUrl = this.configService.get<string>('DATABASE_URL');
 * const port = this.configService.get<number>('PORT');
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 5. AVANTAGES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ✅ Validation au démarrage (fail-fast)
 * ✅ Messages d'erreur clairs
 * ✅ Type-safety avec TypeScript
 * ✅ Aucun credential hard-codé
 * ✅ Configuration centralisée
 * ✅ Support multi-environnement (.env.development, .env.production)
 * ✅ Testable (mock ConfigService facilement)
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 6. EXEMPLE .env
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * # Application
 * NODE_ENV=development
 * PORT=3001
 * CORS_ORIGIN=http://localhost:3000
 * 
 * # Database
 * DATABASE_URL=postgresql://user:password@localhost:5432/agrodeep
 * DB_POOL_SIZE=10
 * 
 * # JWT
 * JWT_SECRET=your-super-secret-key-min-32-chars-long
 * JWT_EXPIRES_IN=1h
 * 
 * # Redis (optional)
 * REDIS_HOST=localhost
 * REDIS_PORT=6379
 * REDIS_PASSWORD=your-redis-password
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
