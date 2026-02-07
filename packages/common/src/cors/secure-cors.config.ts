/**
 * 🛡️ FORCE FIELD RESTORATION - Configuration CORS Sécurisée
 * 
 * Objectif: Configurer CORS avec whitelist stricte
 * Usage: Importer dans main.ts de chaque service NestJS
 */

import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/**
 * 🌐 Liste blanche des origines autorisées
 * 
 * ⚠️ IMPORTANT:
 * - NE JAMAIS utiliser '*' en production
 * - Ajouter uniquement les domaines de confiance
 * - Utiliser des variables d'environnement pour la configuration
 */
const getAllowedOrigins = (): string[] => {
  const env = process.env.NODE_ENV || 'development';
  
  // Origines de base depuis .env
  const corsOrigin = process.env.CORS_ORIGIN || '';
  const envOrigins = corsOrigin
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0);

  // Origines par défaut selon l'environnement
  const defaultOrigins: Record<string, string[]> = {
    development: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173', // Vite
      'http://127.0.0.1:3000',
    ],
    staging: [
      'https://staging.agrodeep.com',
      'https://agrodeep-staging.vercel.app',
    ],
    production: [
      'https://agrodeep.com',
      'https://www.agrodeep.com',
      'https://agrodeep.vercel.app',
    ],
  };

  // Combiner les origines .env et les origines par défaut
  const origins = [
    ...envOrigins,
    ...(defaultOrigins[env] || defaultOrigins.development),
  ];

  // Dédupliquer
  return [...new Set(origins)];
};

/**
 * 🔒 Configuration CORS sécurisée
 * 
 * Fonctionnalités:
 * - Whitelist stricte des origines
 * - Support des credentials (cookies, auth headers)
 * - Headers autorisés configurables
 * - Méthodes HTTP restreintes
 * - Preflight cache optimisé
 */
export const secureCorsOptions: CorsOptions = {
  /**
   * Fonction de validation dynamique des origines
   * Rejette toutes les requêtes d'origines non whitelistées
   */
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    // Autoriser les requêtes sans origin (ex: mobile apps, Postman)
    if (!origin) {
      return callback(null, true);
    }

    // Vérifier si l'origin est dans la whitelist
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS: Origin bloquée: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },

  /**
   * Méthodes HTTP autorisées
   * Restreindre aux méthodes nécessaires
   */
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  /**
   * Headers autorisés dans les requêtes
   */
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key',
    'X-Request-ID',
    'Accept',
    'Accept-Language',
  ],

  /**
   * Headers exposés dans les réponses
   * Permet au client d'accéder à ces headers
   */
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Request-ID',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],

  /**
   * Autoriser les credentials (cookies, auth headers)
   * Nécessaire pour les sessions et JWT dans cookies
   */
  credentials: true,

  /**
   * Durée de cache du preflight (OPTIONS)
   * 1 heure = 3600 secondes
   * Réduit le nombre de requêtes OPTIONS
   */
  maxAge: 3600,

  /**
   * Préflight continue même si OPTIONS échoue
   * false = plus sécurisé
   */
  preflightContinue: false,

  /**
   * Status code pour les requêtes OPTIONS réussies
   */
  optionsSuccessStatus: 204,
};

/**
 * 🎯 Exemple d'utilisation dans main.ts:
 * 
 * ```typescript
 * import { NestFactory } from '@nestjs/core';
 * import { AppModule } from './app.module';
 * import { secureCorsOptions } from '@agrologistic/common';
 * 
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   
 *   // ✅ Appliquer CORS sécurisé
 *   app.enableCors(secureCorsOptions);
 *   
 *   await app.listen(3000);
 * }
 * 
 * bootstrap();
 * ```
 * 
 * 📋 Configuration .env requise:
 * 
 * ```env
 * # Origines autorisées (séparées par des virgules)
 * CORS_ORIGIN=http://localhost:3000,https://agrodeep.vercel.app
 * 
 * # Environnement
 * NODE_ENV=development
 * ```
 * 
 * 🔒 Exemples de requêtes:
 * 
 * ✅ AUTORISÉE:
 * ```
 * Origin: http://localhost:3000
 * → 200 OK avec headers CORS
 * ```
 * 
 * ❌ BLOQUÉE:
 * ```
 * Origin: https://malicious-site.com
 * → Error: Origin not allowed by CORS policy
 * ```
 * 
 * 🧪 Test CORS:
 * 
 * ```bash
 * # Test depuis une origin autorisée
 * curl -H "Origin: http://localhost:3000" \
 *      -H "Access-Control-Request-Method: POST" \
 *      -H "Access-Control-Request-Headers: Content-Type" \
 *      -X OPTIONS \
 *      http://localhost:3001/api/users
 * 
 * # Résultat attendu:
 * # Access-Control-Allow-Origin: http://localhost:3000
 * # Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
 * # Access-Control-Allow-Credentials: true
 * ```
 * 
 * ⚠️ SÉCURITÉ:
 * 
 * 1. ❌ NE JAMAIS faire:
 *    ```typescript
 *    app.enableCors({ origin: '*' }); // DANGEREUX !
 *    ```
 * 
 * 2. ✅ TOUJOURS faire:
 *    ```typescript
 *    app.enableCors(secureCorsOptions); // SÉCURISÉ
 *    ```
 * 
 * 3. 🔐 En production:
 *    - Utiliser HTTPS uniquement
 *    - Activer HSTS (Strict-Transport-Security)
 *    - Configurer CSP (Content-Security-Policy)
 *    - Activer rate limiting
 */

/**
 * 🛡️ Helper: Vérifier si une origin est autorisée
 */
export function isOriginAllowed(origin: string): boolean {
  const allowedOrigins = getAllowedOrigins();
  return allowedOrigins.includes(origin);
}

/**
 * 📊 Helper: Logger les origines configurées
 */
export function logAllowedOrigins(): void {
  const origins = getAllowedOrigins();
  console.log('🌐 CORS - Origines autorisées:');
  origins.forEach(origin => console.log(`  ✓ ${origin}`));
}
