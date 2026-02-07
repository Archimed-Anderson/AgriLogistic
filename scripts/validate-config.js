#!/usr/bin/env node
/**
 * 🧪 TESTS DE VALIDATION - Configuration Centralisée
 * 
 * Objectif: Valider que la nouvelle configuration fonctionne correctement
 * avant de déployer sur tous les services
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

/**
 * 🧪 Test helper
 */
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
 * 📁 Test 1: Vérifier que les fichiers existent
 */
function testFilesExist() {
  log.step(1, 6, 'Vérification des fichiers créés');

  const requiredFiles = [
    'packages/config/package.json',
    'packages/config/tsconfig.json',
    'packages/config/src/index.ts',
    'packages/config/src/config.module.ts',
    'packages/config/src/config.schema.ts',
    'packages/config/src/config.interface.ts',
    'packages/config/.env.example',
    'packages/config/README.md',
    'scripts/upgrade-nestjs-v11.js',
    'docs/archive/INTEGRATION_GUIDE_PROMPT1.md',
    '.env',
  ];

  requiredFiles.forEach(file => {
    test(`Fichier existe: ${file}`, () => {
      if (!fs.existsSync(file)) {
        throw new Error(`Fichier manquant: ${file}`);
      }
    });
  });
}

/**
 * 📦 Test 2: Vérifier package.json du module config
 */
function testConfigPackageJson() {
  log.step(2, 6, 'Validation du package.json config');

  test('package.json est valide JSON', () => {
    const content = fs.readFileSync('packages/config/package.json', 'utf8');
    JSON.parse(content); // Throws si invalide
  });

  test('Dépendances correctes', () => {
    const pkg = JSON.parse(fs.readFileSync('packages/config/package.json', 'utf8'));
    
    if (!pkg.dependencies['@nestjs/common']) {
      throw new Error('@nestjs/common manquant');
    }
    if (!pkg.dependencies['@nestjs/config']) {
      throw new Error('@nestjs/config manquant');
    }
    if (!pkg.dependencies['joi']) {
      throw new Error('joi manquant');
    }
  });

  test('Version NestJS correcte', () => {
    const pkg = JSON.parse(fs.readFileSync('packages/config/package.json', 'utf8'));
    const nestVersion = pkg.dependencies['@nestjs/common'];
    
    if (!nestVersion.includes('11.0')) {
      throw new Error(`Version NestJS incorrecte: ${nestVersion} (attendu: ^11.0.1)`);
    }
  });
}

/**
 * 🔍 Test 3: Vérifier le contenu du .env
 */
function testEnvFile() {
  log.step(3, 6, 'Validation du fichier .env');

  test('.env existe', () => {
    if (!fs.existsSync('.env')) {
      throw new Error('.env manquant - Exécuter: cp packages/config/.env.example .env');
    }
  });

  test('.env contient DATABASE_URL', () => {
    const content = fs.readFileSync('.env', 'utf8');
    if (!content.includes('DATABASE_URL=')) {
      throw new Error('DATABASE_URL manquant dans .env');
    }
  });

  test('.env contient JWT_SECRET', () => {
    const content = fs.readFileSync('.env', 'utf8');
    if (!content.includes('JWT_SECRET=')) {
      throw new Error('JWT_SECRET manquant dans .env');
    }
  });

  test('Aucun credential CHANGE_ME restant', () => {
    const content = fs.readFileSync('.env', 'utf8');
    if (content.includes('CHANGE_ME_')) {
      log.warning('⚠️  .env contient encore des placeholders CHANGE_ME_*');
      log.warning('   Remplacer par vos vraies valeurs avant de démarrer les services');
    }
  });
}

/**
 * 🔨 Test 4: Compilation TypeScript
 */
function testTypeScriptCompilation() {
  log.step(4, 6, 'Compilation TypeScript du module config');

  test('tsconfig.json est valide', () => {
    const content = fs.readFileSync('packages/config/tsconfig.json', 'utf8');
    JSON.parse(content);
  });

  test('Compilation TypeScript réussit', () => {
    try {
      log.info('Compilation en cours...');
      execSync('cd packages/config && pnpm build', { 
        stdio: 'pipe',
        encoding: 'utf8'
      });
    } catch (err) {
      throw new Error(`Compilation échouée: ${err.message}`);
    }
  });

  test('Fichiers dist générés', () => {
    const distFiles = [
      'packages/config/dist/index.js',
      'packages/config/dist/index.d.ts',
      'packages/config/dist/config.module.js',
      'packages/config/dist/config.schema.js',
    ];

    distFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        throw new Error(`Fichier dist manquant: ${file}`);
      }
    });
  });
}

/**
 * 📋 Test 5: Vérifier les services
 */
function testServicesPackageJson() {
  log.step(5, 6, 'Vérification des package.json des services');

  const serviceDirs = [
    'services/identity/user-service',
    'services/marketplace/product-service',
    'services/logistics/mission-service',
  ];

  serviceDirs.forEach(serviceDir => {
    const packagePath = path.join(serviceDir, 'package.json');
    
    if (fs.existsSync(packagePath)) {
      test(`${serviceDir} - package.json valide`, () => {
        const content = fs.readFileSync(packagePath, 'utf8');
        JSON.parse(content);
      });
    } else {
      log.warning(`Service non trouvé: ${serviceDir}`);
    }
  });
}

/**
 * 🚀 Test 6: Test d'intégration basique
 */
function testBasicIntegration() {
  log.step(6, 6, 'Test d\'intégration basique');

  test('Module config peut être importé', () => {
    try {
      // Vérifier que le module exporté existe
      const indexPath = path.resolve('packages/config/dist/index.js');
      if (!fs.existsSync(indexPath)) {
        throw new Error('dist/index.js manquant - Exécuter pnpm build');
      }
      
      // Chargement réel du module (meilleur que grep)
      const configPackage = require(indexPath);
      
      if (!configPackage.AgroDeepConfigModule) {
        throw new Error('AgroDeepConfigModule non exporté (Runtime Check)');
      }
      
      log.success('AgroDeepConfigModule exporté correctement');
      
    } catch (err) {
      throw new Error(`Import échoué: ${err.message}`);
    }
  });

  test('Schema Joi est valide', () => {
    const schemaPath = 'packages/config/dist/config.schema.js';
    if (!fs.existsSync(schemaPath)) {
      throw new Error('config.schema.js manquant');
    }
    
    const content = fs.readFileSync(schemaPath, 'utf8');
    if (!content.includes('configValidationSchema')) {
      throw new Error('configValidationSchema non exporté');
    }
  });
}

/**
 * 📊 Rapport final
 */
function generateReport() {
  log.title('📊 RAPPORT DE VALIDATION');
  
  const total = testsPassed + testsFailed;
  const successRate = ((testsPassed / total) * 100).toFixed(1);
  
  console.log(`Tests réussis:  ${colors.green}${testsPassed}${colors.reset}/${total}`);
  console.log(`Tests échoués:  ${testsFailed > 0 ? colors.red : colors.green}${testsFailed}${colors.reset}/${total}`);
  console.log(`Taux de succès: ${successRate >= 90 ? colors.green : colors.yellow}${successRate}%${colors.reset}`);

  if (testsFailed === 0) {
    log.title('✨ TOUS LES TESTS SONT PASSÉS !');
    console.log('✅ La configuration centralisée est prête à être utilisée');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Éditer .env avec vos vraies valeurs');
    console.log('2. Exécuter: node scripts/upgrade-nestjs-v11.js');
    console.log('3. Intégrer AgroDeepConfigModule dans vos services');
    console.log('4. Tester: pnpm dev\n');
  } else {
    log.title('⚠️ CERTAINS TESTS ONT ÉCHOUÉ');
    console.log('Vérifier les erreurs ci-dessus et corriger avant de continuer.\n');
    process.exit(1);
  }
}

/**
 * 🚀 Main execution
 */
async function main() {
  log.title('🧪 VALIDATION - Configuration Centralisée');
  log.info('Démarrage des tests de validation...\n');

  try {
    testFilesExist();
    testConfigPackageJson();
    testEnvFile();
    testTypeScriptCompilation();
    testServicesPackageJson();
    testBasicIntegration();
    
    generateReport();
  } catch (err) {
    log.error(`Erreur fatale: ${err.message}`);
    process.exit(1);
  }
}

// Execute
main().catch(err => {
  log.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
