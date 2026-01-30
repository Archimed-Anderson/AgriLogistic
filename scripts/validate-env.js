#!/usr/bin/env node

/**
 * Script de validation des variables d'environnement
 * VÃ©rifie que toutes les variables requises sont prÃ©sentes et valides
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const errors = [];
const warnings = [];

// Variables requises pour le frontend
const frontendRequired = {
  VITE_API_GATEWAY_URL: 'http://localhost:8000/api/v1',
  VITE_AUTH_PROVIDER: 'real',
};

// Variables requises pour auth-service
const authServiceRequired = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_NAME: 'AgriLogistic_auth',
  DB_USER: 'AgriLogistic',
  DB_PASSWORD: 'AgriLogistic_password',
  JWT_ACCESS_SECRET: 'AgriLogistic_secure_jwt_access_secret_2026',
  JWT_REFRESH_SECRET: 'AgriLogistic_secure_jwt_refresh_secret_2026',
  PORT: '3001',
  CORS_ORIGIN: 'http://localhost:5173',
};

function checkEnvFile(filePath, requiredVars, serviceName) {
  if (!existsSync(filePath)) {
    warnings.push(`âš ï¸  ${serviceName}: Fichier .env non trouvÃ©: ${filePath}`);
    return;
  }

  const content = readFileSync(filePath, 'utf-8');
  const envVars = {};
  
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  Object.keys(requiredVars).forEach(key => {
    if (!envVars[key] || envVars[key] === '') {
      errors.push(`âŒ ${serviceName}: Variable manquante ou vide: ${key}`);
    } else if (envVars[key].includes('your_') || envVars[key].includes('change_me')) {
      warnings.push(`âš ï¸  ${serviceName}: Variable ${key} contient une valeur par dÃ©faut, veuillez la modifier`);
    }
  });
}

console.log('ðŸ” Validation des variables d\'environnement...\n');

// VÃ©rifier le frontend
const frontendEnvPath = join(rootDir, '.env');
checkEnvFile(frontendEnvPath, frontendRequired, 'Frontend');

// VÃ©rifier auth-service
const authServiceEnvPath = join(rootDir, 'services', 'auth-service', '.env');
checkEnvFile(authServiceEnvPath, authServiceRequired, 'Auth Service');

// Afficher les rÃ©sultats
if (errors.length > 0) {
  console.log('âŒ ERREURS:');
  errors.forEach(err => console.log(err));
  console.log('');
}

if (warnings.length > 0) {
  console.log('âš ï¸  AVERTISSEMENTS:');
  warnings.forEach(warn => console.log(warn));
  console.log('');
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('âœ… Toutes les variables d\'environnement sont correctement configurÃ©es!\n');
  process.exit(0);
} else if (errors.length > 0) {
  console.log('âŒ Des erreurs doivent Ãªtre corrigÃ©es avant de continuer.\n');
  process.exit(1);
} else {
  console.log('âš ï¸  Des avertissements ont Ã©tÃ© dÃ©tectÃ©s, mais vous pouvez continuer.\n');
  process.exit(0);
}

