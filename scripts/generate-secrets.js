#!/usr/bin/env node
/**
 * 🛡️ FORCE FIELD RESTORATION - Générateur de Secrets Sécurisés
 * 
 * Objectif: Générer des secrets cryptographiques forts pour tous les services
 * Capacité: Établissement d'un champ de protection contre les failles de sécurité
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 🎨 Couleurs console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
  secret: (label, value) => console.log(`${colors.magenta}${label}:${colors.reset} ${colors.bright}${value}${colors.reset}`),
};

/**
 * 🔐 Génère un secret cryptographique fort
 */
function generateSecret(length = 32, encoding = 'base64') {
  return crypto.randomBytes(length).toString(encoding);
}

/**
 * 🔑 Génère un UUID v4
 */
function generateUUID() {
  return crypto.randomUUID();
}

/**
 * 🎲 Génère un secret alphanumérique
 */
function generateAlphanumeric(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  
  return result;
}

/**
 * 📝 Génère un fichier .env avec secrets
 */
function generateEnvFile(serviceName, outputPath) {
  const secrets = {
    DATABASE_URL: `postgresql://agrodeep:${generateSecret(24)}@localhost:5432/agrodeep_${serviceName}`,
    DB_PASSWORD: generateSecret(32),
    REDIS_PASSWORD: generateSecret(24),
    JWT_SECRET: generateSecret(48),
    JWT_REFRESH_SECRET: generateSecret(48),
    API_KEY: generateAlphanumeric(32),
    ENCRYPTION_KEY: generateSecret(32, 'hex'),
    SESSION_SECRET: generateSecret(32),
  };

  const envContent = `# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🛡️ SECRETS SÉCURISÉS - ${serviceName.toUpperCase()}
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# ⚠️ IMPORTANT:
# 1. NE JAMAIS commit ce fichier dans Git
# 2. Utiliser un gestionnaire de secrets en production (Vault, AWS Secrets Manager)
# 3. Régénérer tous les secrets pour la production
# 4. Activer la rotation automatique des secrets
#
# Généré le: ${new Date().toISOString()}
# Service: ${serviceName}
#
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🚀 APPLICATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NODE_ENV=development
PORT=3000
API_PREFIX=api

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🗄️ DATABASE (PostgreSQL)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATABASE_URL=${secrets.DATABASE_URL}
DB_PASSWORD=${secrets.DB_PASSWORD}
DB_POOL_SIZE=10
DB_SSL=false

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔴 REDIS (Cache & Sessions)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=${secrets.REDIS_PASSWORD}
REDIS_DB=0

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔐 JWT AUTHENTICATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JWT_SECRET=${secrets.JWT_SECRET}
JWT_REFRESH_SECRET=${secrets.JWT_REFRESH_SECRET}
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔒 ENCRYPTION & SECURITY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENCRYPTION_KEY=${secrets.ENCRYPTION_KEY}
SESSION_SECRET=${secrets.SESSION_SECRET}
API_KEY=${secrets.API_KEY}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🌐 CORS & SECURITY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CORS_ORIGIN=http://localhost:3000,https://agrodeep.vercel.app
ALLOWED_HOSTS=localhost,agrodeep.vercel.app

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 📊 MONITORING (Optional)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SENTRY_DSN=
SLACK_WEBHOOK_URL=
`;

  fs.writeFileSync(outputPath, envContent, 'utf8');
  return secrets;
}

/**
 * 🚀 Main execution
 */
async function main() {
  log.title('🛡️ FORCE FIELD RESTORATION - Générateur de Secrets');

  const args = process.argv.slice(2);
  const mode = args[0] || 'display';

  if (mode === 'display') {
    // Mode affichage: génère et affiche les secrets
    log.info('Génération de secrets sécurisés...\n');

    log.title('🔐 SECRETS GÉNÉRÉS');
    
    log.secret('DATABASE_PASSWORD (32 bytes)', generateSecret(32));
    log.secret('REDIS_PASSWORD (24 bytes)   ', generateSecret(24));
    log.secret('JWT_SECRET (48 bytes)       ', generateSecret(48));
    log.secret('JWT_REFRESH_SECRET (48 bytes)', generateSecret(48));
    log.secret('ENCRYPTION_KEY (hex, 32 bytes)', generateSecret(32, 'hex'));
    log.secret('SESSION_SECRET (32 bytes)   ', generateSecret(32));
    log.secret('API_KEY (alphanumeric, 32)  ', generateAlphanumeric(32));
    log.secret('UUID                        ', generateUUID());

    log.title('📋 COMMANDES UTILES');
    console.log('Générer un secret spécifique:');
    console.log(`  ${colors.cyan}node scripts/generate-secrets.js secret 32${colors.reset}  # 32 bytes base64`);
    console.log(`  ${colors.cyan}node scripts/generate-secrets.js hex 32${colors.reset}     # 32 bytes hex`);
    console.log(`  ${colors.cyan}node scripts/generate-secrets.js alpha 32${colors.reset}   # 32 chars alphanum`);
    console.log(`  ${colors.cyan}node scripts/generate-secrets.js uuid${colors.reset}       # UUID v4`);
    console.log('\nGénérer un fichier .env pour un service:');
    console.log(`  ${colors.cyan}node scripts/generate-secrets.js env user-service${colors.reset}`);
    console.log(`  ${colors.cyan}node scripts/generate-secrets.js env product-service${colors.reset}`);

  } else if (mode === 'secret') {
    const length = parseInt(args[1]) || 32;
    console.log(generateSecret(length));

  } else if (mode === 'hex') {
    const length = parseInt(args[1]) || 32;
    console.log(generateSecret(length, 'hex'));

  } else if (mode === 'alpha') {
    const length = parseInt(args[1]) || 32;
    console.log(generateAlphanumeric(length));

  } else if (mode === 'uuid') {
    console.log(generateUUID());

  } else if (mode === 'env') {
    const serviceName = args[1];
    if (!serviceName) {
      log.error('Service name required: node scripts/generate-secrets.js env <service-name>');
      process.exit(1);
    }

    const outputPath = `.env.${serviceName}`;
    const secrets = generateEnvFile(serviceName, outputPath);

    log.success(`Fichier .env généré: ${outputPath}`);
    log.warning('⚠️  Ce fichier contient des secrets sensibles !');
    log.info('Actions requises:');
    console.log(`  1. Copier vers le service: cp ${outputPath} services/*/$ {serviceName}/.env`);
    console.log(`  2. Ajouter au .gitignore: echo ".env.${serviceName}" >> .gitignore`);
    console.log(`  3. Sauvegarder les secrets dans un gestionnaire sécurisé`);

  } else {
    log.error(`Mode inconnu: ${mode}`);
    log.info('Modes disponibles: display, secret, hex, alpha, uuid, env');
    process.exit(1);
  }

  log.title('✨ Génération terminée !');
}

// Execute
main().catch(err => {
  console.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
