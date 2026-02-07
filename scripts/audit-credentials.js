#!/usr/bin/env node
/**
 * 🛡️ FORCE FIELD RESTORATION - Audit & Nettoyage de Credentials
 * 
 * Objectif: Trouver et remplacer TOUS les credentials hard-codés
 * Capacité: Élimination des failles de sécurité
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
};

/**
 * 🔍 Patterns de credentials à détecter
 */
const CREDENTIAL_PATTERNS = [
  'secure_2026',
  'AgroLogistic_secure',
  'AgriLogistic_secure',
  'redis_secure',
  'password.*=.*["\'](?!process\\.env)',
  'secret.*=.*["\'](?!process\\.env)',
];

/**
 * 🔍 Scan du codebase
 */
function scanCredentials() {
  log.title('🔍 SCAN DES CREDENTIALS HARD-CODÉS');

  const results = [];

  CREDENTIAL_PATTERNS.forEach(pattern => {
    try {
      log.info(`Recherche du pattern: ${pattern}`);
      
      const cmd = `grep -r -n -i "${pattern}" services/ --include="*.ts" --include="*.js" --exclude-dir=node_modules --exclude-dir=dist`;
      const output = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
      
      if (output) {
        const lines = output.trim().split('\n');
        lines.forEach(line => {
          const match = line.match(/^([^:]+):(\d+):(.+)$/);
          if (match) {
            results.push({
              file: match[1],
              line: parseInt(match[2]),
              content: match[3].trim(),
              pattern,
            });
          }
        });
      }
    } catch (err) {
      // Pas de résultat (exit code 1 de grep)
      if (err.status !== 1) {
        log.warning(`Erreur lors de la recherche de ${pattern}: ${err.message}`);
      }
    }
  });

  return results;
}

/**
 * 🔧 Génère les snippets de remplacement
 */
function generateReplacementSnippets(results) {
  log.title('🔧 SNIPPETS DE REMPLACEMENT');

  const grouped = {};
  
  results.forEach(result => {
    if (!grouped[result.file]) {
      grouped[result.file] = [];
    }
    grouped[result.file].push(result);
  });

  Object.entries(grouped).forEach(([file, occurrences]) => {
    console.log(`\n${colors.bright}${file}${colors.reset}`);
    console.log('─'.repeat(80));

    occurrences.forEach(occ => {
      console.log(`${colors.yellow}Ligne ${occ.line}:${colors.reset} ${occ.content}`);
      
      // Générer le snippet de remplacement
      if (occ.content.includes('DB_PASSWORD')) {
        console.log(`${colors.green}Remplacer par:${colors.reset}`);
        console.log(`  password: this.configService.get<string>('DB_PASSWORD'),`);
      } else if (occ.content.includes('REDIS_PASSWORD')) {
        console.log(`${colors.green}Remplacer par:${colors.reset}`);
        console.log(`  password: this.configService.get<string>('REDIS_PASSWORD'),`);
      } else if (occ.content.includes('DATABASE_URL')) {
        console.log(`${colors.green}Remplacer par:${colors.reset}`);
        console.log(`  url: this.configService.get<string>('DATABASE_URL'),`);
      }
      console.log('');
    });
  });
}

/**
 * 🔧 Remplace automatiquement les credentials
 */
function replaceCredentials(dryRun = true) {
  log.title(dryRun ? '🔍 MODE DRY-RUN (Simulation)' : '🔧 REMPLACEMENT AUTOMATIQUE');

  const replacements = [
    {
      pattern: /password:\s*process\.env\.DB_PASSWORD\s*\|\|\s*['"]AgroLogistic_secure_2026['"]/g,
      replacement: "password: this.configService.get<string>('DB_PASSWORD')",
      description: 'DB_PASSWORD hard-codé',
    },
    {
      pattern: /password:\s*process\.env\.DB_PASSWORD\s*\|\|\s*['"]AgriLogistic_secure_2026['"]/g,
      replacement: "password: this.configService.get<string>('DB_PASSWORD')",
      description: 'DB_PASSWORD hard-codé (AgriLogistic)',
    },
    {
      pattern: /process\.env\.REDIS_PASSWORD\s*\|\|\s*['"]redis_secure_2026['"]/g,
      replacement: "this.configService.get<string>('REDIS_PASSWORD')",
      description: 'REDIS_PASSWORD hard-codé',
    },
    {
      pattern: /['"]postgresql:\/\/[^:]+:[^@]+@[^'"]+['"]/g,
      replacement: "this.configService.get<string>('DATABASE_URL')",
      description: 'DATABASE_URL hard-codé',
    },
  ];

  let totalReplacements = 0;

  // Scanner tous les fichiers .ts dans services/
  const files = execSync('find services/ -name "*.ts" -type f ! -path "*/node_modules/*" ! -path "*/dist/*"', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(f => f);

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    let fileReplacements = 0;

    replacements.forEach(({ pattern, replacement, description }) => {
      const matches = content.match(pattern);
      if (matches) {
        if (dryRun) {
          log.info(`${file}: ${matches.length} occurrence(s) de "${description}"`);
        } else {
          content = content.replace(pattern, replacement);
          modified = true;
        }
        fileReplacements += matches ? matches.length : 0;
      }
    });

    if (modified && !dryRun) {
      fs.writeFileSync(file, content, 'utf8');
      log.success(`${file}: ${fileReplacements} remplacement(s)`);
    }

    totalReplacements += fileReplacements;
  });

  if (dryRun) {
    log.warning(`\n${totalReplacements} remplacement(s) seraient effectués`);
    log.info('Pour appliquer les changements: node scripts/audit-credentials.js --fix');
  } else {
    log.success(`\n${totalReplacements} remplacement(s) effectués !`);
  }

  return totalReplacements;
}

/**
 * 📊 Génère un rapport
 */
function generateReport(results) {
  log.title('📊 RAPPORT D\'AUDIT');

  console.log(`Total de credentials trouvés: ${colors.red}${results.length}${colors.reset}`);
  
  const byFile = {};
  results.forEach(r => {
    byFile[r.file] = (byFile[r.file] || 0) + 1;
  });

  console.log(`\nFichiers affectés: ${Object.keys(byFile).length}`);
  console.log('\nTop 5 fichiers:');
  
  Object.entries(byFile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([file, count]) => {
      console.log(`  ${count}× ${file}`);
    });

  log.title('⚠️ ACTIONS REQUISES');
  console.log('1. Générer des secrets sécurisés:');
  console.log(`   ${colors.cyan}node scripts/generate-secrets.js${colors.reset}`);
  console.log('\n2. Remplacer les credentials (dry-run):');
  console.log(`   ${colors.cyan}node scripts/audit-credentials.js --dry-run${colors.reset}`);
  console.log('\n3. Appliquer les changements:');
  console.log(`   ${colors.cyan}node scripts/audit-credentials.js --fix${colors.reset}`);
  console.log('\n4. Mettre à jour .env avec les nouveaux secrets');
  console.log('\n5. Vérifier avec git diff et tester');
}

/**
 * 🚀 Main execution
 */
async function main() {
  log.title('🛡️ FORCE FIELD RESTORATION - Audit Credentials');

  const args = process.argv.slice(2);
  const mode = args[0];

  if (mode === '--fix') {
    // Mode remplacement automatique
    replaceCredentials(false);
  } else if (mode === '--dry-run') {
    // Mode dry-run
    replaceCredentials(true);
  } else {
    // Mode scan par défaut
    const results = scanCredentials();
    
    if (results.length === 0) {
      log.success('✨ Aucun credential hard-codé trouvé !');
    } else {
      generateReplacementSnippets(results);
      generateReport(results);
    }
  }

  log.title('✨ Audit terminé !');
}

// Execute
main().catch(err => {
  log.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
