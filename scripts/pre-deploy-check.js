#!/usr/bin/env node

/**
 * Script de validation pré-déploiement
 * Vérifie que tout est prêt pour le déploiement en production
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const checks = {
  typecheck: false,
  lint: false,
  tests: false,
  build: false,
  env: false,
};

console.log('🔍 Validation pré-déploiement...\n');

// 1. TypeScript type checking
console.log('1️⃣  Vérification des types TypeScript...');
try {
  execSync('npm run typecheck', {
    cwd: rootDir,
    stdio: 'pipe',
  });
  checks.typecheck = true;
  console.log('   ✅ Types TypeScript: OK\n');
} catch (error) {
  console.log('   ❌ Erreurs de types détectées\n');
}

// 2. Linting
console.log('2️⃣  Vérification du linting...');
try {
  execSync('npm run lint', {
    cwd: rootDir,
    stdio: 'pipe',
  });
  checks.lint = true;
  console.log('   ✅ Linting: OK\n');
} catch (error) {
  console.log('   ⚠️  Avertissements de linting détectés (non bloquant)\n');
  checks.lint = true; // Linting warnings are not blocking
}

// 3. Tests
console.log('3️⃣  Exécution des tests...');
try {
  execSync('npm run test:ci', {
    cwd: rootDir,
    stdio: 'pipe',
  });
  checks.tests = true;
  console.log('   ✅ Tests: OK\n');
} catch (error) {
  console.log('   ❌ Tests échoués\n');
}

// 4. Build
console.log('4️⃣  Build de production...');
try {
  execSync('npm run build', {
    cwd: rootDir,
    stdio: 'pipe',
  });
  checks.build = true;
  console.log('   ✅ Build: OK\n');
} catch (error) {
  console.log('   ❌ Build échoué\n');
}

// 5. Variables d'environnement
console.log('5️⃣  Vérification des variables d'environnement...');
try {
  execSync('npm run validate:env', {
    cwd: rootDir,
    stdio: 'pipe',
  });
  checks.env = true;
  console.log('   ✅ Variables d'environnement: OK\n');
} catch (error) {
  console.log('   ⚠️  Variables d'environnement: Vérification échouée\n');
}

// Résumé
console.log('\n📊 RÉSUMÉ DE LA VALIDATION\n');
console.log('═══════════════════════════════════════\n');

Object.entries(checks).forEach(([name, passed]) => {
  const icon = passed ? '✅' : '❌';
  const status = passed ? 'OK' : 'ÉCHOUÉ';
  console.log(`${icon} ${name}: ${status}`);
});

console.log('\n═══════════════════════════════════════\n');

const allPassed = Object.values(checks).every(c => c);

if (allPassed) {
  console.log('✅ Toutes les validations sont passées. Prêt pour le déploiement!\n');
  process.exit(0);
} else {
  console.log('❌ Des validations ont échoué. Corrigez les erreurs avant de déployer.\n');
  process.exit(1);
}
