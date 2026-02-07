#!/usr/bin/env node
/**
 * 🧪 TESTS DE VALIDATION - PROMPT 4 (Stabilisation Services AI)
 * 
 * Objectif: Valider que tous les livrables AI sont opérationnels
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
 * Test 1: Docker Compose AI
 */
function testDockerComposeAI() {
  log.step(1, 6, 'Validation Docker Compose AI');

  test('docker-compose.ai.yml existe', () => {
    if (!fs.existsSync('docker-compose.ai.yml')) {
      throw new Error('docker-compose.ai.yml manquant');
    }
  });

  test('docker-compose.ai.yml est valide YAML', () => {
    const content = fs.readFileSync('docker-compose.ai.yml', 'utf8');
    
    // Vérifications basiques de structure YAML
    if (!content.includes('version:')) {
      throw new Error('Pas de version spécifiée');
    }
    if (!content.includes('services:')) {
      throw new Error('Pas de services définis');
    }
  });

  test('Service ai-main configuré', () => {
    const content = fs.readFileSync('docker-compose.ai.yml', 'utf8');
    if (!content.includes('ai-main:')) {
      throw new Error('Service ai-main manquant');
    }
  });

  test('Service ai-llm configuré', () => {
    const content = fs.readFileSync('docker-compose.ai.yml', 'utf8');
    if (!content.includes('ai-llm:')) {
      throw new Error('Service ai-llm manquant');
    }
  });

  test('Service ai-vision configuré', () => {
    const content = fs.readFileSync('docker-compose.ai.yml', 'utf8');
    if (!content.includes('ai-vision:')) {
      throw new Error('Service ai-vision manquant');
    }
  });

  test('Fix UTF-8 dans environment', () => {
    const content = fs.readFileSync('docker-compose.ai.yml', 'utf8');
    if (!content.includes('PYTHONIOENCODING=utf-8')) {
      throw new Error('PYTHONIOENCODING=utf-8 manquant');
    }
  });

  test('Volumes persistants configurés', () => {
    const content = fs.readFileSync('docker-compose.ai.yml', 'utf8');
    if (!content.includes('volumes:')) {
      throw new Error('Volumes non configurés');
    }
    if (!content.includes('ai-models:')) {
      throw new Error('Volume ai-models manquant');
    }
  });

  test('Health checks configurés', () => {
    const content = fs.readFileSync('docker-compose.ai.yml', 'utf8');
    const healthCheckCount = (content.match(/healthcheck:/g) || []).length;
    if (healthCheckCount < 3) {
      throw new Error(`Seulement ${healthCheckCount} health-checks, attendu: 3`);
    }
  });

  test('Network isolation configurée', () => {
    const content = fs.readFileSync('docker-compose.ai.yml', 'utf8');
    if (!content.includes('networks:')) {
      throw new Error('Networks non configurés');
    }
    if (!content.includes('ai-network:')) {
      throw new Error('Network ai-network manquant');
    }
  });
}

/**
 * Test 2: Dockerfile
 */
function testDockerfile() {
  log.step(2, 6, 'Validation Dockerfile');

  test('Dockerfile existe', () => {
    if (!fs.existsSync('services/ai-service/Dockerfile')) {
      throw new Error('Dockerfile manquant');
    }
  });

  test('Dockerfile contient fix UTF-8', () => {
    const content = fs.readFileSync('services/ai-service/Dockerfile', 'utf8');
    if (!content.includes('PYTHONIOENCODING=utf-8')) {
      throw new Error('PYTHONIOENCODING=utf-8 manquant');
    }
    if (!content.includes('LANG=C.UTF-8')) {
      throw new Error('LANG=C.UTF-8 manquant');
    }
  });

  test('Dockerfile utilise Python 3.11', () => {
    const content = fs.readFileSync('services/ai-service/Dockerfile', 'utf8');
    if (!content.includes('python:3.11')) {
      throw new Error('Python 3.11 non utilisé');
    }
  });

  test('Dockerfile a ARG SERVICE_DIR', () => {
    const content = fs.readFileSync('services/ai-service/Dockerfile', 'utf8');
    if (!content.includes('ARG SERVICE_DIR')) {
      throw new Error('ARG SERVICE_DIR manquant');
    }
  });

  test('Dockerfile crée répertoires models/cache', () => {
    const content = fs.readFileSync('services/ai-service/Dockerfile', 'utf8');
    if (!content.includes('mkdir') || !content.includes('models')) {
      throw new Error('Création répertoires models/cache manquante');
    }
  });

  test('Dockerfile a HEALTHCHECK', () => {
    const content = fs.readFileSync('services/ai-service/Dockerfile', 'utf8');
    if (!content.includes('HEALTHCHECK')) {
      throw new Error('HEALTHCHECK manquant');
    }
  });
}

/**
 * Test 3: Health Check Module
 */
function testHealthModule() {
  log.step(3, 6, 'Validation module health.py');

  test('health.py existe', () => {
    if (!fs.existsSync('services/ai-service/src/health.py')) {
      throw new Error('health.py manquant');
    }
  });

  test('health.py contient register_health_endpoints', () => {
    const content = fs.readFileSync('services/ai-service/src/health.py', 'utf8');
    if (!content.includes('def register_health_endpoints')) {
      throw new Error('register_health_endpoints manquant');
    }
  });

  test('health.py a endpoint /health', () => {
    const content = fs.readFileSync('services/ai-service/src/health.py', 'utf8');
    if (!content.includes('"/health"')) {
      throw new Error('Endpoint /health manquant');
    }
  });

  test('health.py a endpoint /health/detailed', () => {
    const content = fs.readFileSync('services/ai-service/src/health.py', 'utf8');
    if (!content.includes('"/health/detailed"')) {
      throw new Error('Endpoint /health/detailed manquant');
    }
  });

  test('health.py a endpoint /health/ready', () => {
    const content = fs.readFileSync('services/ai-service/src/health.py', 'utf8');
    if (!content.includes('"/health/ready"')) {
      throw new Error('Endpoint /health/ready manquant');
    }
  });

  test('health.py a endpoint /health/live', () => {
    const content = fs.readFileSync('services/ai-service/src/health.py', 'utf8');
    if (!content.includes('"/health/live"')) {
      throw new Error('Endpoint /health/live manquant');
    }
  });

  test('health.py vérifie model_ready', () => {
    const content = fs.readFileSync('services/ai-service/src/health.py', 'utf8');
    if (!content.includes('model_ready')) {
      throw new Error('Vérification model_ready manquante');
    }
  });

  test('health.py monitore CPU et RAM', () => {
    const content = fs.readFileSync('services/ai-service/src/health.py', 'utf8');
    if (!content.includes('cpu_percent') || !content.includes('memory_usage')) {
      throw new Error('Monitoring CPU/RAM manquant');
    }
  });

  test('health.py a ModelState class', () => {
    const content = fs.readFileSync('services/ai-service/src/health.py', 'utf8');
    if (!content.includes('class ModelState')) {
      throw new Error('ModelState class manquante');
    }
  });
}

/**
 * Test 4: Scripts de démarrage
 */
function testStartupScripts() {
  log.step(4, 6, 'Validation scripts de démarrage');

  test('start-ai-main.sh existe', () => {
    if (!fs.existsSync('services/ai-service/start-ai-main.sh')) {
      throw new Error('start-ai-main.sh manquant');
    }
  });

  test('start-ai-main.ps1 existe', () => {
    if (!fs.existsSync('services/ai-service/start-ai-main.ps1')) {
      throw new Error('start-ai-main.ps1 manquant');
    }
  });

  test('start-ai-main.sh a fix UTF-8', () => {
    const content = fs.readFileSync('services/ai-service/start-ai-main.sh', 'utf8');
    if (!content.includes('export PYTHONIOENCODING=utf-8')) {
      throw new Error('export PYTHONIOENCODING=utf-8 manquant');
    }
  });

  test('start-ai-main.ps1 a fix UTF-8', () => {
    const content = fs.readFileSync('services/ai-service/start-ai-main.ps1', 'utf8');
    // Check more flexible (allow spaces, quotes variations)
    if (!content.includes('PYTHONIOENCODING') || !content.includes('utf-8')) {
      throw new Error('$env:PYTHONIOENCODING manquant');
    }
  });

  test('start-ai-main.sh lance uvicorn', () => {
    const content = fs.readFileSync('services/ai-service/start-ai-main.sh', 'utf8');
    if (!content.includes('uvicorn')) {
      throw new Error('Commande uvicorn manquante');
    }
  });

  test('start-ai-main.ps1 lance uvicorn', () => {
    const content = fs.readFileSync('services/ai-service/start-ai-main.ps1', 'utf8');
    if (!content.includes('uvicorn')) {
      throw new Error('Commande uvicorn manquante');
    }
  });
}

/**
 * Test 5: Intégration main.py
 */
function testMainIntegration() {
  log.step(5, 6, 'Validation intégration main.py');

  test('main.py existe', () => {
    if (!fs.existsSync('services/ai-service/src/main.py')) {
      throw new Error('main.py manquant');
    }
  });

  test('main.py importe register_health_endpoints', () => {
    const content = fs.readFileSync('services/ai-service/src/main.py', 'utf8');
    if (!content.includes('from health import register_health_endpoints') && 
        !content.includes('from .health import register_health_endpoints')) {
      throw new Error('Import register_health_endpoints manquant');
    }
  });

  test('main.py appelle register_health_endpoints', () => {
    const content = fs.readFileSync('services/ai-service/src/main.py', 'utf8');
    if (!content.includes('register_health_endpoints(app)')) {
      throw new Error('Appel register_health_endpoints manquant');
    }
  });

  test('main.py a FastAPI app', () => {
    const content = fs.readFileSync('services/ai-service/src/main.py', 'utf8');
    if (!content.includes('app = FastAPI')) {
      throw new Error('FastAPI app manquante');
    }
  });
}

/**
 * Test 6: Documentation
 */
function testDocumentation() {
  log.step(6, 6, 'Validation de la documentation');

  test('PROMPT4_GUIDE.md existe', () => {
    if (!fs.existsSync('docs/archive/PROMPT4_GUIDE.md')) {
      throw new Error('PROMPT4_GUIDE.md manquant');
    }
  });

  test('PROMPT4_GUIDE.md contient fix UTF-8', () => {
    const content = fs.readFileSync('docs/archive/PROMPT4_GUIDE.md', 'utf8');
    if (!content.includes('FIX ENCODAGE UTF-8')) {
      throw new Error('Section fix UTF-8 manquante');
    }
  });

  test('PROMPT4_GUIDE.md contient Docker Compose', () => {
    const content = fs.readFileSync('docs/archive/PROMPT4_GUIDE.md', 'utf8');
    if (!content.includes('docker-compose.ai.yml')) {
      throw new Error('Section Docker Compose manquante');
    }
  });

  test('PROMPT4_GUIDE.md contient health checks', () => {
    const content = fs.readFileSync('docs/archive/PROMPT4_GUIDE.md', 'utf8');
    if (!content.includes('HEALTH CHECKS')) {
      throw new Error('Section health checks manquante');
    }
  });

  test('PROMPT4_GUIDE.md contient volumes', () => {
    const content = fs.readFileSync('docs/archive/PROMPT4_GUIDE.md', 'utf8');
    if (!content.includes('VOLUMES PERSISTANTS')) {
      throw new Error('Section volumes manquante');
    }
  });

  test('PROMPT4_GUIDE.md contient troubleshooting', () => {
    const content = fs.readFileSync('docs/archive/PROMPT4_GUIDE.md', 'utf8');
    if (!content.includes('TROUBLESHOOTING')) {
      throw new Error('Section troubleshooting manquante');
    }
  });
}

/**
 * Rapport final
 */
function generateReport() {
  log.title('📊 RAPPORT DE VALIDATION - PROMPT 4');
  
  const total = testsPassed + testsFailed;
  const successRate = ((testsPassed / total) * 100).toFixed(1);
  
  console.log(`Tests réussis:  ${colors.green}${testsPassed}${colors.reset}/${total}`);
  console.log(`Tests échoués:  ${testsFailed > 0 ? colors.red : colors.green}${testsFailed}${colors.reset}/${total}`);
  console.log(`Taux de succès: ${successRate >= 90 ? colors.green : colors.yellow}${successRate}%${colors.reset}`);

  if (testsFailed === 0) {
    log.title('✨ TOUS LES TESTS SONT PASSÉS !');
    console.log('✅ PROMPT 4 validé avec succès');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Créer répertoires: mkdir -p data/{ai,llm,vision}-{models,cache}');
    console.log('2. Démarrer services: docker-compose -f docker-compose.ai.yml up -d');
    console.log('3. Vérifier health: curl http://localhost:8000/health');
    console.log('4. Voir logs: docker-compose -f docker-compose.ai.yml logs -f\n');
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
  log.title('🧪 VALIDATION - PROMPT 4 (Stabilisation Services AI)');
  log.info('Démarrage des tests...\n');

  try {
    testDockerComposeAI();
    testDockerfile();
    testHealthModule();
    testStartupScripts();
    testMainIntegration();
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
