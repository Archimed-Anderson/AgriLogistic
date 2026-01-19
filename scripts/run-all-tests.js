#!/usr/bin/env node

/**
 * Script pour exécuter tous les tests
 * - Tests unitaires frontend (Vitest)
 * - Tests unitaires backend (Jest)
 * - Tests d'intégration
 * - Tests E2E (Playwright)
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const results = {
  frontend: { passed: false, output: '' },
  backend: { passed: false, output: '' },
  integration: { passed: false, output: '' },
  e2e: { passed: false, output: '' },
};

console.log('🧪 Exécution de tous les tests...\n');

// 1. Tests unitaires frontend
console.log('📦 Tests unitaires frontend (Vitest)...');
try {
  const output = execSync('npm run test:ci', {
    cwd: rootDir,
    encoding: 'utf-8',
    stdio: 'pipe',
  });
  results.frontend.passed = true;
  results.frontend.output = output;
  console.log('✅ Tests unitaires frontend: PASSÉ\n');
} catch (error) {
  results.frontend.output = error.stdout || error.message;
  console.log('❌ Tests unitaires frontend: ÉCHOUÉ\n');
}

// 2. Tests unitaires backend (auth-service)
console.log('🔐 Tests unitaires backend (auth-service)...');
const authServiceDir = join(rootDir, 'services', 'auth-service');
if (existsSync(join(authServiceDir, 'package.json'))) {
  try {
    const output = execSync('npm test', {
      cwd: authServiceDir,
      encoding: 'utf-8',
      stdio: 'pipe',
    });
    results.backend.passed = true;
    results.backend.output = output;
    console.log('✅ Tests unitaires backend: PASSÉ\n');
  } catch (error) {
    results.backend.output = error.stdout || error.message;
    console.log('❌ Tests unitaires backend: ÉCHOUÉ\n');
  }
} else {
  console.log('⏭️  Auth-service non trouvé, tests backend ignorés\n');
}

// 3. Tests d'intégration (inclus dans Vitest)
console.log('🔗 Tests d'intégration...');
// Les tests d'intégration sont dans tests/integration/ et sont exécutés avec Vitest
results.integration.passed = results.frontend.passed;
if (results.integration.passed) {
  console.log('✅ Tests d'intégration: PASSÉ\n');
} else {
  console.log('❌ Tests d'intégration: ÉCHOUÉ\n');
}

// 4. Tests E2E (Playwright)
console.log('🎭 Tests E2E (Playwright)...');
try {
  const output = execSync('npm run test:e2e', {
    cwd: rootDir,
    encoding: 'utf-8',
    stdio: 'pipe',
  });
  results.e2e.passed = true;
  results.e2e.output = output;
  console.log('✅ Tests E2E: PASSÉ\n');
} catch (error) {
  results.e2e.output = error.stdout || error.message;
  console.log('❌ Tests E2E: ÉCHOUÉ\n');
}

// Résumé
console.log('\n📊 RÉSUMÉ DES TESTS\n');
console.log('═══════════════════════════════════════\n');

const allPassed = Object.values(results).every(r => r.passed);

Object.entries(results).forEach(([name, result]) => {
  const icon = result.passed ? '✅' : '❌';
  console.log(`${icon} ${name}: ${result.passed ? 'PASSÉ' : 'ÉCHOUÉ'}`);
});

console.log('\n═══════════════════════════════════════\n');

if (allPassed) {
  console.log('🎉 Tous les tests sont passés!\n');
  process.exit(0);
} else {
  console.log('⚠️  Certains tests ont échoué. Vérifiez les logs ci-dessus.\n');
  process.exit(1);
}
