#!/usr/bin/env node
/**
 * 🧪 TESTS DE VALIDATION - PROMPT 2 (Résurrection Services)
 * 
 * Objectif: Valider que les corrections de ports et Turbo fonctionnent
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
 * Test 1: Vérifier turbo.json
 */
function testTurboJson() {
  log.step(1, 5, 'Validation turbo.json');

  test('turbo.json existe', () => {
    if (!fs.existsSync('turbo.json')) {
      throw new Error('turbo.json manquant');
    }
  });

  test('turbo.json est valide JSON', () => {
    const content = fs.readFileSync('turbo.json', 'utf8');
    JSON.parse(content);
  });

  test('Concurrency réduite à 10', () => {
    const turbo = JSON.parse(fs.readFileSync('turbo.json', 'utf8'));
    if (turbo.concurrency !== '10' && turbo.concurrency !== 10) {
      throw new Error(`Concurrency = ${turbo.concurrency}, attendu: 10`);
    }
  });

  test('dev task a dependsOn', () => {
    const turbo = JSON.parse(fs.readFileSync('turbo.json', 'utf8'));
    if (!turbo.tasks.dev.dependsOn) {
      throw new Error('dev task sans dependsOn');
    }
  });

  test('globalEnv configuré', () => {
    const turbo = JSON.parse(fs.readFileSync('turbo.json', 'utf8'));
    if (!turbo.globalEnv || turbo.globalEnv.length === 0) {
      throw new Error('globalEnv manquant ou vide');
    }
  });
}

/**
 * Test 2: Vérifier les ports normalisés
 */
function testPortsNormalized() {
  log.step(2, 5, 'Validation des ports normalisés');

  const expectedPorts = {
    'services/identity/user-service/src/index.ts': 3013,
    'services/marketplace/inventory-service/src/index.ts': 3016,
    'services/logistics/mission-service/src/main.ts': 3004,
    'services/logistics/production-service/src/index.ts': 3005,
    'services/logistics/iot-service/src/main.ts': 3006,
    'services/communication/notification-service/src/index.ts': 3019,
    'services/trust/blockchain-service/src/index.ts': 3020,
  };

  Object.entries(expectedPorts).forEach(([filePath, expectedPort]) => {
    test(`${path.basename(path.dirname(path.dirname(filePath)))} port = ${expectedPort}`, () => {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Fichier non trouvé: ${filePath}`);
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const portMatch = content.match(/(?:const\s+(?:port|PORT)\s*=\s*process\.env\.PORT\s*\|\|\s*(\d+))|(?:process\.env\.PORT\s*\|\|\s*(\d+))/);
      
      if (!portMatch) {
        throw new Error('Port non trouvé dans le fichier');
      }

      const actualPort = parseInt(portMatch[1] || portMatch[2]);
      if (actualPort !== expectedPort) {
        throw new Error(`Port = ${actualPort}, attendu: ${expectedPort}`);
      }
    });
  });
}

/**
 * Test 3: Vérifier docker-compose.dev.yml
 */
function testDockerCompose() {
  log.step(3, 5, 'Validation docker-compose.dev.yml');

  test('docker-compose.dev.yml existe', () => {
    if (!fs.existsSync('docker-compose.dev.yml')) {
      throw new Error('docker-compose.dev.yml manquant');
    }
  });

  test('Contient service postgres', () => {
    const content = fs.readFileSync('docker-compose.dev.yml', 'utf8');
    if (!content.includes('postgres:')) {
      throw new Error('Service postgres manquant');
    }
  });

  test('Contient service user-service', () => {
    const content = fs.readFileSync('docker-compose.dev.yml', 'utf8');
    if (!content.includes('user-service:')) {
      throw new Error('Service user-service manquant');
    }
  });

  test('Contient service product-service', () => {
    const content = fs.readFileSync('docker-compose.dev.yml', 'utf8');
    if (!content.includes('product-service:')) {
      throw new Error('Service product-service manquant');
    }
  });

  test('Contient service auth-service', () => {
    const content = fs.readFileSync('docker-compose.dev.yml', 'utf8');
    if (!content.includes('auth-service:')) {
      throw new Error('Service auth-service manquant');
    }
  });

  test('Health-checks configurés', () => {
    const content = fs.readFileSync('docker-compose.dev.yml', 'utf8');
    const healthCheckCount = (content.match(/healthcheck:/g) || []).length;
    if (healthCheckCount < 4) {
      throw new Error(`Seulement ${healthCheckCount} health-checks, attendu: 4+`);
    }
  });
}

/**
 * Test 4: Vérifier les scripts
 */
function testScripts() {
  log.step(4, 5, 'Validation des scripts');

  test('normalize-ports.js existe', () => {
    if (!fs.existsSync('scripts/normalize-ports.js')) {
      throw new Error('normalize-ports.js manquant');
    }
  });

  test('validate-config.js existe', () => {
    if (!fs.existsSync('scripts/validate-config.js')) {
      throw new Error('validate-config.js manquant');
    }
  });

  test('upgrade-nestjs-v11.js existe', () => {
    if (!fs.existsSync('scripts/upgrade-nestjs-v11.js')) {
      throw new Error('upgrade-nestjs-v11.js manquant');
    }
  });
}

/**
 * Test 5: Vérifier la documentation
 */
function testDocumentation() {
  log.step(5, 5, 'Validation de la documentation');

  test('PROMPT2_GUIDE.md existe', () => {
    if (!fs.existsSync('docs/archive/PROMPT2_GUIDE.md')) {
      throw new Error('PROMPT2_GUIDE.md manquant');
    }
  });

  test('INTEGRATION_GUIDE_PROMPT1.md existe', () => {
    if (!fs.existsSync('docs/archive/INTEGRATION_GUIDE_PROMPT1.md')) {
      throw new Error('INTEGRATION_GUIDE_PROMPT1.md manquant');
    }
  });

  test('VALIDATION_REPORT.md existe', () => {
    if (!fs.existsSync('docs/archive/VALIDATION_REPORT.md')) {
      throw new Error('VALIDATION_REPORT.md manquant');
    }
  });
}

/**
 * Rapport final
 */
function generateReport() {
  log.title('📊 RAPPORT DE VALIDATION - PROMPT 2');
  
  const total = testsPassed + testsFailed;
  const successRate = ((testsPassed / total) * 100).toFixed(1);
  
  console.log(`Tests réussis:  ${colors.green}${testsPassed}${colors.reset}/${total}`);
  console.log(`Tests échoués:  ${testsFailed > 0 ? colors.red : colors.green}${testsFailed}${colors.reset}/${total}`);
  console.log(`Taux de succès: ${successRate >= 90 ? colors.green : colors.yellow}${successRate}%${colors.reset}`);

  if (testsFailed === 0) {
    log.title('✨ TOUS LES TESTS SONT PASSÉS !');
    console.log('✅ PROMPT 2 validé avec succès');
    console.log('\n📋 Prochaine étape:');
    console.log('   docker-compose -f docker-compose.dev.yml up\n');
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
  log.title('🧪 VALIDATION - PROMPT 2 (Résurrection Services)');
  log.info('Démarrage des tests...\n');

  try {
    testTurboJson();
    testPortsNormalized();
    testDockerCompose();
    testScripts();
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
