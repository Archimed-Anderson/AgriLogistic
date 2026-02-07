#!/usr/bin/env node
/**
 * 🧪 TESTS DE VALIDATION - PROMPT 3 (Chirurgie de Sécurité)
 * 
 * Objectif: Valider que tous les livrables de sécurité sont opérationnels
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
 * Test 1: Scripts de sécurité
 */
function testSecurityScripts() {
  log.step(1, 5, 'Validation des scripts de sécurité');

  test('generate-secrets.js existe', () => {
    if (!fs.existsSync('scripts/generate-secrets.js')) {
      throw new Error('generate-secrets.js manquant');
    }
  });

  test('audit-credentials.js existe', () => {
    if (!fs.existsSync('scripts/audit-credentials.js')) {
      throw new Error('audit-credentials.js manquant');
    }
  });

  test('generate-secrets.js est exécutable', () => {
    try {
      const output = execSync('node scripts/generate-secrets.js uuid', { encoding: 'utf8', stdio: 'pipe' });
      const uuid = output.trim();
      
      // Vérifier que c'est un UUID valide (format flexible)
      const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
      if (!uuidRegex.test(uuid)) {
        throw new Error(`UUID invalide généré: ${uuid}`);
      }
    } catch (err) {
      throw new Error(`Script non exécutable: ${err.message}`);
    }
  });

  test('generate-secrets.js génère des secrets forts', () => {
    try {
      const output = execSync('node scripts/generate-secrets.js secret 32', { encoding: 'utf8', stdio: 'pipe' });
      const secret = output.trim();
      
      // Vérifier longueur minimale (base64 de 32 bytes ≈ 44 chars)
      if (secret.length < 40) {
        throw new Error(`Secret trop court: ${secret.length} chars`);
      }
    } catch (err) {
      throw new Error(`Génération échouée: ${err.message}`);
    }
  });
}

/**
 * Test 2: Package common
 */
function testCommonPackage() {
  log.step(2, 5, 'Validation du package common');

  test('packages/common/package.json existe', () => {
    if (!fs.existsSync('packages/common/package.json')) {
      throw new Error('package.json manquant');
    }
  });

  test('packages/common/package.json est valide', () => {
    const content = fs.readFileSync('packages/common/package.json', 'utf8');
    const pkg = JSON.parse(content);
    
    if (!pkg.dependencies['@nestjs/common']) {
      throw new Error('@nestjs/common manquant');
    }
    if (!pkg.dependencies['class-validator']) {
      throw new Error('class-validator manquant');
    }
  });

  test('global-validation.pipe.ts existe', () => {
    if (!fs.existsSync('packages/common/src/validation/global-validation.pipe.ts')) {
      throw new Error('global-validation.pipe.ts manquant');
    }
  });

  test('secure-cors.config.ts existe', () => {
    if (!fs.existsSync('packages/common/src/cors/secure-cors.config.ts')) {
      throw new Error('secure-cors.config.ts manquant');
    }
  });

  test('index.ts exporte les modules', () => {
    const content = fs.readFileSync('packages/common/src/index.ts', 'utf8');
    
    if (!content.includes('globalValidationPipe')) {
      throw new Error('globalValidationPipe non exporté');
    }
    if (!content.includes('secureCorsOptions')) {
      throw new Error('secureCorsOptions non exporté');
    }
  });
}

/**
 * Test 3: Validation pipe
 */
function testValidationPipe() {
  log.step(3, 5, 'Validation du middleware de validation');

  test('Validation pipe contient transform', () => {
    const content = fs.readFileSync('packages/common/src/validation/global-validation.pipe.ts', 'utf8');
    if (!content.includes('transform: true')) {
      throw new Error('transform non configuré');
    }
  });

  test('Validation pipe contient whitelist', () => {
    const content = fs.readFileSync('packages/common/src/validation/global-validation.pipe.ts', 'utf8');
    if (!content.includes('whitelist: true')) {
      throw new Error('whitelist non configuré');
    }
  });

  test('Validation pipe contient forbidNonWhitelisted', () => {
    const content = fs.readFileSync('packages/common/src/validation/global-validation.pipe.ts', 'utf8');
    if (!content.includes('forbidNonWhitelisted: true')) {
      throw new Error('forbidNonWhitelisted non configuré');
    }
  });

  test('Validation pipe a exceptionFactory', () => {
    const content = fs.readFileSync('packages/common/src/validation/global-validation.pipe.ts', 'utf8');
    if (!content.includes('exceptionFactory')) {
      throw new Error('exceptionFactory manquant');
    }
  });
}

/**
 * Test 4: Configuration CORS
 */
function testCorsConfig() {
  log.step(4, 5, 'Validation de la configuration CORS');

  test('CORS config contient origin function', () => {
    const content = fs.readFileSync('packages/common/src/cors/secure-cors.config.ts', 'utf8');
    if (!content.includes('origin: (origin, callback)')) {
      throw new Error('origin function manquante');
    }
  });

  test('CORS config contient credentials', () => {
    const content = fs.readFileSync('packages/common/src/cors/secure-cors.config.ts', 'utf8');
    if (!content.includes('credentials: true')) {
      throw new Error('credentials non configuré');
    }
  });

  test('CORS config contient methods restreintes', () => {
    const content = fs.readFileSync('packages/common/src/cors/secure-cors.config.ts', 'utf8');
    if (!content.includes('methods:')) {
      throw new Error('methods non configurées');
    }
  });

  test('CORS config rejette wildcard', () => {
    const content = fs.readFileSync('packages/common/src/cors/secure-cors.config.ts', 'utf8');
    
    // Supprimer les commentaires pour ne tester que le code réel
    const codeOnly = content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Commentaires multi-lignes
      .replace(/\/\/.*/g, '');            // Commentaires single-line
    
    // Vérifier qu'il n'y a pas de origin: '*' dans le code
    if (codeOnly.includes("origin: '*'") || codeOnly.includes('origin: "*"')) {
      throw new Error('Wildcard (*) détecté dans le code - NON SÉCURISÉ');
    }
  });

  test('CORS config a getAllowedOrigins', () => {
    const content = fs.readFileSync('packages/common/src/cors/secure-cors.config.ts', 'utf8');
    if (!content.includes('getAllowedOrigins')) {
      throw new Error('getAllowedOrigins function manquante');
    }
  });
}

/**
 * Test 5: Documentation
 */
function testDocumentation() {
  log.step(5, 5, 'Validation de la documentation');

  test('PROMPT3_GUIDE.md existe', () => {
    if (!fs.existsSync('docs/archive/PROMPT3_GUIDE.md')) {
      throw new Error('PROMPT3_GUIDE.md manquant');
    }
  });

  test('PROMPT3_GUIDE.md contient procédure', () => {
    const content = fs.readFileSync('docs/archive/PROMPT3_GUIDE.md', 'utf8');
    if (!content.includes('PROCÉDURE D\'APPLICATION')) {
      throw new Error('Procédure d\'application manquante');
    }
  });

  test('PROMPT3_GUIDE.md contient exemples', () => {
    const content = fs.readFileSync('docs/archive/PROMPT3_GUIDE.md', 'utf8');
    if (!content.includes('```typescript')) {
      throw new Error('Exemples de code manquants');
    }
  });

  test('README.md existe', () => {
    if (!fs.existsSync('README.md')) {
      throw new Error('README.md manquant');
    }
  });
}

/**
 * Rapport final
 */
function generateReport() {
  log.title('📊 RAPPORT DE VALIDATION - PROMPT 3');
  
  const total = testsPassed + testsFailed;
  const successRate = ((testsPassed / total) * 100).toFixed(1);
  
  console.log(`Tests réussis:  ${colors.green}${testsPassed}${colors.reset}/${total}`);
  console.log(`Tests échoués:  ${testsFailed > 0 ? colors.red : colors.green}${testsFailed}${colors.reset}/${total}`);
  console.log(`Taux de succès: ${successRate >= 90 ? colors.green : colors.yellow}${successRate}%${colors.reset}`);

  if (testsFailed === 0) {
    log.title('✨ TOUS LES TESTS SONT PASSÉS !');
    console.log('✅ PROMPT 3 validé avec succès');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Générer des secrets: node scripts/generate-secrets.js');
    console.log('2. Auditer credentials: node scripts/audit-credentials.js');
    console.log('3. Build package common: cd packages/common && pnpm build');
    console.log('4. Intégrer dans services\n');
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
  log.title('🧪 VALIDATION - PROMPT 3 (Chirurgie de Sécurité)');
  log.info('Démarrage des tests...\n');

  try {
    testSecurityScripts();
    testCommonPackage();
    testValidationPipe();
    testCorsConfig();
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
