/**
 * 🛡️ Configuration Validation Schema
 * Joi schema pour validation stricte des variables d'environnement
 * 
 * ⚠️ RÈGLE D'OR: Aucun vrai mot de passe en valeur par défaut
 * Utiliser des placeholders comme 'CHANGE_ME_IN_PRODUCTION'
 */

import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🚀 APPLICATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development')
    .description('Environment mode'),

  PORT: Joi.number()
    .port()
    .default(3000)
    .description('Application port'),

  API_PREFIX: Joi.string()
    .default('api')
    .description('API route prefix'),

  CORS_ORIGIN: Joi.alternatives()
    .try(
      Joi.string().uri(),
      Joi.string().pattern(/^https?:\/\/.+/),
      Joi.string().valid('*'),
    )
    .default('http://localhost:3000')
    .description('CORS allowed origins (comma-separated or single)'),

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🗄️ DATABASE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required()
    .description('PostgreSQL connection URL')
    .messages({
      'any.required': '🔴 DATABASE_URL is REQUIRED. Set it in your .env file.',
      'string.uriCustomScheme': '🔴 DATABASE_URL must be a valid PostgreSQL URL (postgres:// or postgresql://)',
    }),

  DB_POOL_SIZE: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .description('Database connection pool size'),

  DB_SSL: Joi.boolean()
    .default(false)
    .description('Enable SSL for database connection'),

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔴 REDIS (Optional)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  REDIS_HOST: Joi.string()
    .hostname()
    .default('localhost')
    .description('Redis host'),

  REDIS_PORT: Joi.number()
    .port()
    .default(6379)
    .description('Redis port'),

  REDIS_PASSWORD: Joi.string()
    .min(8)
    .optional()
    .description('Redis password (REQUIRED in production)')
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required().messages({
        'any.required': '🔴 REDIS_PASSWORD is REQUIRED in production',
      }),
    }),

  REDIS_DB: Joi.number()
    .integer()
    .min(0)
    .max(15)
    .default(0)
    .description('Redis database number'),

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔐 JWT AUTHENTICATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .description('JWT signing secret (min 32 characters)')
    .messages({
      'any.required': '🔴 JWT_SECRET is REQUIRED. Generate with: openssl rand -base64 32',
      'string.min': '🔴 JWT_SECRET must be at least 32 characters for security',
    }),

  JWT_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .default('1h')
    .description('JWT token expiration (e.g., 1h, 7d, 30m)'),

  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .default('7d')
    .description('JWT refresh token expiration'),

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ☁️ CLOUD SERVICES (Optional)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  R2_ACCOUNT_ID: Joi.string()
    .optional()
    .description('Cloudflare R2 account ID'),

  R2_ACCESS_KEY: Joi.string()
    .optional()
    .description('Cloudflare R2 access key'),

  R2_SECRET_KEY: Joi.string()
    .optional()
    .description('Cloudflare R2 secret key'),

  R2_BUCKET_NAME: Joi.string()
    .optional()
    .description('Cloudflare R2 bucket name'),

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📊 MONITORING (Optional)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SLACK_WEBHOOK_URL: Joi.string()
    .uri()
    .optional()
    .description('Slack webhook URL for alerts'),

  PAGERDUTY_ROUTING_KEY: Joi.string()
    .optional()
    .description('PagerDuty routing key for incidents'),

  SENTRY_DSN: Joi.string()
    .uri()
    .optional()
    .description('Sentry DSN for error tracking'),

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔧 SERVICE-SPECIFIC (Optional)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  OPENWEATHERMAP_API_KEY: Joi.string()
    .optional()
    .description('OpenWeatherMap API key (for weather service)'),

  FABRIC_ENABLED: Joi.boolean()
    .default(false)
    .description('Enable Hyperledger Fabric (for blockchain service)'),

  FABRIC_CHANNEL: Joi.string()
    .default('AgroLogistic-channel')
    .description('Hyperledger Fabric channel name'),

  ELASTICSEARCH_URL: Joi.string()
    .uri()
    .optional()
    .description('Elasticsearch URL (for product search)'),

  ELASTICSEARCH_USERNAME: Joi.string()
    .optional()
    .description('Elasticsearch username'),

  ELASTICSEARCH_PASSWORD: Joi.string()
    .optional()
    .description('Elasticsearch password'),
});

/**
 * 🎯 Validation Options
 */
export const validationOptions: Joi.ValidationOptions = {
  // Arrêter à la première erreur pour un feedback rapide
  abortEarly: false,
  
  // Permettre les variables non définies dans le schema (pour flexibilité)
  allowUnknown: true,
  
  // Supprimer les variables inconnues du résultat
  stripUnknown: false,
  
  // Messages d'erreur détaillés
  errors: {
    wrap: {
      label: '',
    },
  },
};
