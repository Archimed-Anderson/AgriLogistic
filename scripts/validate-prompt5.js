#!/usr/bin/env node
/**
 * 🧪 TESTS DE VALIDATION - PROMPT 5 (Pont de Communication)
 * 
 * Objectif: Valider que le client API et l'Error Boundary sont opérationnels
 */

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
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
  step: (num, total, msg) => console.log(`\n${colors.bright}[${num}/${total}]${colors.reset} ${msg}`),
};

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    log.success(`${name}`);
    testsPassed++;
    return true;
  } catch (err) {
    log.error(`${name}: ${err.message}`);
    testsFailed++;
    return false;
  }
}

/**
 * Test 1: Package Structure
 */
function testPackageStructure() {
  log.step(1, 5, 'Validation structure du package');

  test('package.json existe', () => {
    if (!fs.existsSync('packages/api-client/package.json')) {
      throw new Error('package.json manquant');
    }
  });

  test('package.json est valide', () => {
    const content = fs.readFileSync('packages/api-client/package.json', 'utf8');
    const pkg = JSON.parse(content);
    
    if (pkg.name !== '@agrologistic/api-client') {
      throw new Error('Nom du package incorrect');
    }
    
    if (!pkg.dependencies.axios) {
      throw new Error('Dépendance axios manquante');
    }
    
    if (!pkg.dependencies['axios-retry']) {
      throw new Error('Dépendance axios-retry manquante');
    }
  });

  test('tsconfig.json existe', () => {
    if (!fs.existsSync('packages/api-client/tsconfig.json')) {
      throw new Error('tsconfig.json manquant');
    }
  });

  test('README.md existe', () => {
    if (!fs.existsSync('packages/api-client/README.md')) {
      throw new Error('README.md manquant');
    }
  });

  test('src/ directory existe', () => {
    if (!fs.existsSync('packages/api-client/src')) {
      throw new Error('src/ directory manquant');
    }
  });
}

/**
 * Test 2: Types & Interfaces
 */
function testTypes() {
  log.step(2, 5, 'Validation types.ts');

  test('types.ts existe', () => {
    if (!fs.existsSync('packages/api-client/src/types.ts')) {
      throw new Error('types.ts manquant');
    }
  });

  test('types.ts contient ApiClientConfig', () => {
    const content = fs.readFileSync('packages/api-client/src/types.ts', 'utf8');
    if (!content.includes('interface ApiClientConfig')) {
      throw new Error('ApiClientConfig manquant');
    }
  });

  test('types.ts contient ApiResponse', () => {
    const content = fs.readFileSync('packages/api-client/src/types.ts', 'utf8');
    if (!content.includes('interface ApiResponse')) {
      throw new Error('ApiResponse manquant');
    }
  });

  test('types.ts contient ApiError', () => {
    const content = fs.readFileSync('packages/api-client/src/types.ts', 'utf8');
    if (!content.includes('interface ApiError')) {
      throw new Error('ApiError manquant');
    }
  });

  test('types.ts contient RequestOptions', () => {
    const content = fs.readFileSync('packages/api-client/src/types.ts', 'utf8');
    if (!content.includes('interface RequestOptions')) {
      throw new Error('RequestOptions manquant');
    }
  });

  test('types.ts contient ApiClientStats', () => {
    const content = fs.readFileSync('packages/api-client/src/types.ts', 'utf8');
    if (!content.includes('interface ApiClientStats')) {
      throw new Error('ApiClientStats manquant');
    }
  });
}

/**
 * Test 3: Client API
 */
function testClient() {
  log.step(3, 5, 'Validation client.ts');

  test('client.ts existe', () => {
    if (!fs.existsSync('packages/api-client/src/client.ts')) {
      throw new Error('client.ts manquant');
    }
  });

  test('client.ts contient classe ApiClient', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('class ApiClient')) {
      throw new Error('Classe ApiClient manquante');
    }
  });

  test('client.ts importe axios', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes("from 'axios'")) {
      throw new Error('Import axios manquant');
    }
  });

  test('client.ts importe axios-retry', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes("from 'axios-retry'")) {
      throw new Error('Import axios-retry manquant');
    }
  });

  test('client.ts configure retry', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('setupRetry') || !content.includes('axiosRetry')) {
      throw new Error('Configuration retry manquante');
    }
  });

  test('client.ts configure interceptors', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('setupInterceptors') || !content.includes('interceptors.request')) {
      throw new Error('Configuration interceptors manquante');
    }
  });

  test('client.ts gère les tokens JWT', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('getAuthToken') || !content.includes('Authorization')) {
      throw new Error('Gestion tokens JWT manquante');
    }
  });

  test('client.ts gère erreurs 401', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('401') || !content.includes('onAuthError')) {
      throw new Error('Gestion erreurs 401 manquante');
    }
  });

  test('client.ts normalise les erreurs', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('normalizeError')) {
      throw new Error('Normalisation erreurs manquante');
    }
  });

  test('client.ts a méthode GET', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('async get')) {
      throw new Error('Méthode GET manquante');
    }
  });

  test('client.ts a méthode POST', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('async post')) {
      throw new Error('Méthode POST manquante');
    }
  });

  test('client.ts a méthode PUT', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('async put')) {
      throw new Error('Méthode PUT manquante');
    }
  });

  test('client.ts a méthode PATCH', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('async patch')) {
      throw new Error('Méthode PATCH manquante');
    }
  });

  test('client.ts a méthode DELETE', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('async delete')) {
      throw new Error('Méthode DELETE manquante');
    }
  });

  test('client.ts a getStats', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('getStats')) {
      throw new Error('Méthode getStats manquante');
    }
  });

  test('client.ts a createApiClient factory', () => {
    const content = fs.readFileSync('packages/api-client/src/client.ts', 'utf8');
    if (!content.includes('function createApiClient')) {
      throw new Error('Factory createApiClient manquante');
    }
  });
}

/**
 * Test 4: Error Boundary
 */
function testErrorBoundary() {
  log.step(4, 5, 'Validation error-boundary.tsx');

  test('error-boundary.tsx existe', () => {
    if (!fs.existsSync('packages/api-client/src/error-boundary.tsx')) {
      throw new Error('error-boundary.tsx manquant');
    }
  });

  test('error-boundary.tsx contient GlobalErrorBoundary', () => {
    const content = fs.readFileSync('packages/api-client/src/error-boundary.tsx', 'utf8');
    if (!content.includes('class GlobalErrorBoundary')) {
      throw new Error('Classe GlobalErrorBoundary manquante');
    }
  });

  test('error-boundary.tsx a "use client"', () => {
    const content = fs.readFileSync('packages/api-client/src/error-boundary.tsx', 'utf8');
    if (!content.includes("'use client'")) {
      throw new Error('Directive "use client" manquante');
    }
  });

  test('error-boundary.tsx a getDerivedStateFromError', () => {
    const content = fs.readFileSync('packages/api-client/src/error-boundary.tsx', 'utf8');
    if (!content.includes('getDerivedStateFromError')) {
      throw new Error('getDerivedStateFromError manquant');
    }
  });

  test('error-boundary.tsx a componentDidCatch', () => {
    const content = fs.readFileSync('packages/api-client/src/error-boundary.tsx', 'utf8');
    if (!content.includes('componentDidCatch')) {
      throw new Error('componentDidCatch manquant');
    }
  });

  test('error-boundary.tsx a DefaultErrorFallback', () => {
    const content = fs.readFileSync('packages/api-client/src/error-boundary.tsx', 'utf8');
    if (!content.includes('DefaultErrorFallback')) {
      throw new Error('DefaultErrorFallback manquant');
    }
  });

  test('error-boundary.tsx a useErrorHandler hook', () => {
    const content = fs.readFileSync('packages/api-client/src/error-boundary.tsx', 'utf8');
    if (!content.includes('function useErrorHandler')) {
      throw new Error('Hook useErrorHandler manquant');
    }
  });

  test('error-boundary.tsx a bouton Réessayer', () => {
    const content = fs.readFileSync('packages/api-client/src/error-boundary.tsx', 'utf8');
    if (!content.includes('Réessayer') && !content.includes('reset')) {
      throw new Error('Bouton Réessayer manquant');
    }
  });

  test('error-boundary.tsx a bouton Retour accueil', () => {
    const content = fs.readFileSync('packages/api-client/src/error-boundary.tsx', 'utf8');
    if (!content.includes('accueil') || !content.includes('window.location')) {
      throw new Error('Bouton Retour accueil manquant');
    }
  });

  test('error-boundary.tsx a callback onError', () => {
    const content = fs.readFileSync('packages/api-client/src/error-boundary.tsx', 'utf8');
    if (!content.includes('onError')) {
      throw new Error('Callback onError manquant');
    }
  });
}

/**
 * Test 5: Documentation
 */
function testDocumentation() {
  log.step(5, 5, 'Validation de la documentation');

  test('PROMPT5_GUIDE.md existe', () => {
    if (!fs.existsSync('docs/archive/PROMPT5_GUIDE.md')) {
      throw new Error('PROMPT5_GUIDE.md manquant');
    }
  });

  test('PROMPT5_GUIDE.md contient Client API', () => {
    const content = fs.readFileSync('docs/archive/PROMPT5_GUIDE.md', 'utf8');
    if (!content.includes('Client API')) {
      throw new Error('Section Client API manquante');
    }
  });

  test('PROMPT5_GUIDE.md contient Error Boundary', () => {
    const content = fs.readFileSync('docs/archive/PROMPT5_GUIDE.md', 'utf8');
    if (!content.includes('Error Boundary')) {
      throw new Error('Section Error Boundary manquante');
    }
  });

  test('PROMPT5_GUIDE.md contient exemples', () => {
    const content = fs.readFileSync('docs/archive/PROMPT5_GUIDE.md', 'utf8');
    const exampleCount = (content.match(/```typescript/g) || []).length;
    if (exampleCount < 5) {
      throw new Error(`Seulement ${exampleCount} exemples, attendu: 5+`);
    }
  });

  test('README.md du package contient utilisation', () => {
    const content = fs.readFileSync('packages/api-client/README.md', 'utf8');
    if (!content.includes('Utilisation')) {
      throw new Error('Section Utilisation manquante');
    }
  });

  test('README.md du package contient configuration', () => {
    const content = fs.readFileSync('packages/api-client/README.md', 'utf8');
    if (!content.includes('Configuration')) {
      throw new Error('Section Configuration manquante');
    }
  });

  test('index.ts exporte ApiClient', () => {
    const content = fs.readFileSync('packages/api-client/src/index.ts', 'utf8');
    if (!content.includes('ApiClient')) {
      throw new Error('Export ApiClient manquant');
    }
  });

  test('index.ts exporte GlobalErrorBoundary', () => {
    const content = fs.readFileSync('packages/api-client/src/index.ts', 'utf8');
    if (!content.includes('GlobalErrorBoundary')) {
      throw new Error('Export GlobalErrorBoundary manquant');
    }
  });

  test('index.ts exporte types', () => {
    const content = fs.readFileSync('packages/api-client/src/index.ts', 'utf8');
    if (!content.includes('ApiClientConfig') || !content.includes('ApiError')) {
      throw new Error('Export types manquant');
    }
  });
}

/**
 * Rapport final
 */
function generateReport() {
  log.title('📊 RAPPORT DE VALIDATION - PROMPT 5');
  
  const total = testsPassed + testsFailed;
  const successRate = ((testsPassed / total) * 100).toFixed(1);
  
  console.log(`Tests réussis:  ${colors.green}${testsPassed}${colors.reset}/${total}`);
  console.log(`Tests échoués:  ${testsFailed > 0 ? colors.red : colors.green}${testsFailed}${colors.reset}/${total}`);
  console.log(`Taux de succès: ${successRate >= 90 ? colors.green : colors.yellow}${successRate}%${colors.reset}`);

  if (testsFailed === 0) {
    log.title('✨ TOUS LES TESTS SONT PASSÉS !');
    console.log('✅ PROMPT 5 validé avec succès');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Installer dépendances: cd packages/api-client && pnpm install');
    console.log('2. Build package: pnpm build');
    console.log('3. Intégrer dans Frontend: import { createApiClient } from "@agrologistic/api-client"');
    console.log('4. Configurer Error Boundary dans layout\n');
  } else {
    log.title('⚠️ CERTAINS TESTS ONT ÉCHOUÉ');
    console.log('Vérifier les erreurs ci-dessus.\n');
    process.exit(1);
  }
}

/**
 * Main
 */
async function main() {
  log.title('🧪 VALIDATION - PROMPT 5 (Pont de Communication)');
  log.info('Démarrage des tests...\n');

  try {
    testPackageStructure();
    testTypes();
    testClient();
    testErrorBoundary();
    testDocumentation();
    
    generateReport();
  } catch (err) {
    log.error(`Erreur fatale: ${err.message}`);
    process.exit(1);
  }
}

main().catch(err => {
  log.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
