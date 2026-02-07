#!/usr/bin/env node
/**
 * 🛸 LIFT-OFF PROTOCOL - Script de Normalisation des Ports
 * 
 * Objectif: Éliminer TOUS les conflits de ports entre services
 * Capacité: Suppression des forces qui maintiennent le système au sol
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
};

/**
 * 🗺️ TABLEAU DE CORRESPONDANCE SERVICE → PORT
 * Basé sur ARCHITECTURE_DIAGRAM.md
 */
const PORT_MAPPING = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // IDENTITY & SECURITY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'identity/user-service': 3013,
  'identity/admin-service': 3014,
  'identity/auth-service-legacy': 3001,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MARKETPLACE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'marketplace/product-service': 3002,
  'marketplace/order-service': 3003,
  'marketplace/inventory-service': 3016,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LOGISTICS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'logistics/mission-service': 3004,
  'logistics/production-service': 3005,
  'logistics/iot-service': 3006,
  'logistics/rentals-service': 3007,
  'logistics/coldchain-service': 3009,
  'logistics/delivery-service': 3017,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FINTECH
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'finance/credit-service': 3008,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COOPERATIVE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'coop-service': 3010,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AI & INTELLIGENCE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'ai-service/vision-service': 3011,
  'intelligence/weather-service': 3012,
  'intelligence/analytics-service': 3015,
  'intelligence/incident-service': 3018,
  'intelligence/ai-service': 8000, // Python AI Main

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COMMUNICATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'communication/notification-service': 3019,

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TRUST
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  'trust/blockchain-service': 3020,
};

/**
 * 🔍 Détecte les conflits de ports
 */
function detectConflicts() {
  log.title('🔍 DÉTECTION DES CONFLITS DE PORTS');

  const conflicts = [];
  const portUsage = {};

  // Scanner tous les services
  Object.entries(PORT_MAPPING).forEach(([servicePath, expectedPort]) => {
    const fullPath = path.join('services', servicePath);
    
    // Chercher main.ts ou index.ts
    const mainFiles = ['src/main.ts', 'src/index.ts'];
    let actualPort = null;
    let filePath = null;

    for (const file of mainFiles) {
      const testPath = path.join(fullPath, file);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        const content = fs.readFileSync(testPath, 'utf8');
        
        // Extraire le port actuel
        const portMatch = content.match(/(?:const\s+(?:port|PORT)\s*=\s*process\.env\.PORT\s*\|\|\s*(\d+))|(?:process\.env\.PORT\s*\|\|\s*(\d+))/);
        if (portMatch) {
          actualPort = parseInt(portMatch[1] || portMatch[2]);
        }
        break;
      }
    }

    if (actualPort) {
      // Enregistrer l'usage du port
      if (!portUsage[actualPort]) {
        portUsage[actualPort] = [];
      }
      portUsage[actualPort].push(servicePath);

      // Vérifier si le port correspond
      if (actualPort !== expectedPort) {
        conflicts.push({
          service: servicePath,
          file: filePath,
          actualPort,
          expectedPort,
          type: 'mismatch'
        });
      }
    } else {
      log.warning(`Service non trouvé ou port non détecté: ${servicePath}`);
    }
  });

  // Détecter les doublons
  Object.entries(portUsage).forEach(([port, services]) => {
    if (services.length > 1) {
      log.error(`🔴 CONFLIT: Port ${port} utilisé par ${services.length} services:`);
      services.forEach(s => console.log(`   - ${s}`));
      
      services.forEach(service => {
        const existing = conflicts.find(c => c.service === service);
        if (existing) {
          existing.type = 'duplicate';
        } else {
          conflicts.push({
            service,
            actualPort: parseInt(port),
            expectedPort: PORT_MAPPING[service],
            type: 'duplicate'
          });
        }
      });
    }
  });

  return conflicts;
}

/**
 * 🔧 Corrige un fichier de service
 */
function fixServicePort(conflict) {
  if (!conflict.file) {
    log.error(`Fichier non trouvé pour ${conflict.service}`);
    return false;
  }

  try {
    let content = fs.readFileSync(conflict.file, 'utf8');
    
    // Remplacer le port
    const oldPattern = new RegExp(`((?:const\\s+(?:port|PORT)\\s*=\\s*)?process\\.env\\.PORT\\s*\\|\\|\\s*)${conflict.actualPort}`, 'g');
    const newContent = content.replace(oldPattern, `$1${conflict.expectedPort}`);
    
    if (content !== newContent) {
      fs.writeFileSync(conflict.file, newContent, 'utf8');
      log.success(`${conflict.service}: ${conflict.actualPort} → ${conflict.expectedPort}`);
      return true;
    } else {
      log.warning(`Aucun changement pour ${conflict.service}`);
      return false;
    }
  } catch (err) {
    log.error(`Erreur lors de la correction de ${conflict.service}: ${err.message}`);
    return false;
  }
}

/**
 * 📊 Génère un rapport
 */
function generateReport(conflicts, fixed) {
  log.title('📊 RAPPORT DE NORMALISATION');

  console.log(`Conflits détectés:  ${colors.yellow}${conflicts.length}${colors.reset}`);
  console.log(`Conflits corrigés:  ${colors.green}${fixed}${colors.reset}`);
  console.log(`Taux de succès:     ${fixed === conflicts.length ? colors.green : colors.yellow}${((fixed / conflicts.length) * 100).toFixed(1)}%${colors.reset}`);

  // Tableau récapitulatif
  log.title('📋 TABLEAU DES PORTS FINAUX');
  console.log('Service                              | Port');
  console.log('-------------------------------------|------');
  
  Object.entries(PORT_MAPPING).sort((a, b) => a[1] - b[1]).forEach(([service, port]) => {
    const paddedService = service.padEnd(36);
    console.log(`${paddedService} | ${port}`);
  });
}

/**
 * 🚀 Main execution
 */
async function main() {
  log.title('🛸 LIFT-OFF PROTOCOL - Normalisation des Ports');

  // Détecter les conflits
  const conflicts = detectConflicts();

  if (conflicts.length === 0) {
    log.success('✨ Aucun conflit détecté ! Tous les ports sont alignés.');
    return;
  }

  log.warning(`\n${conflicts.length} conflit(s) détecté(s). Correction en cours...\n`);

  // Corriger les conflits
  let fixed = 0;
  conflicts.forEach(conflict => {
    if (fixServicePort(conflict)) {
      fixed++;
    }
  });

  // Générer le rapport
  generateReport(conflicts, fixed);

  if (fixed === conflicts.length) {
    log.title('✨ TOUS LES CONFLITS ONT ÉTÉ CORRIGÉS !');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Vérifier les changements: git diff');
    console.log('2. Tester le démarrage: pnpm dev');
    console.log('3. Vérifier health-checks: .\\health-check.ps1\n');
  } else {
    log.error('\n⚠️ Certains conflits n\'ont pas pu être corrigés automatiquement.');
    log.info('Vérifier manuellement les fichiers concernés.\n');
  }
}

// Execute
main().catch(err => {
  log.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
