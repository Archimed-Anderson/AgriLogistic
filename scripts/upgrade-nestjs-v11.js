#!/usr/bin/env node
/**
 * 🛠️ OPÉRATION RÉSURRECTION - PHASE 1
 * Script d'Harmonisation Nucléaire des Versions NestJS
 * 
 * Objectif: Aligner TOUS les microservices sur NestJS v11.0.1 + TypeScript 5.7.2
 * Capacité: ⚛️ Quantum Synchronization
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 🎯 Versions cibles (Quantum Frequency)
const TARGET_VERSIONS = {
  '@nestjs/common': '^11.0.1',
  '@nestjs/core': '^11.0.1',
  '@nestjs/platform-express': '^11.0.1',
  '@nestjs/config': '^4.0.2',
  '@nestjs/microservices': '^11.0.1',
  '@nestjs/websockets': '^11.0.1',
  '@nestjs/platform-socket.io': '^11.0.1',
  '@nestjs/schedule': '^4.0.0',
  '@nestjs/swagger': '^8.0.0',
  '@nestjs/axios': '^3.1.2',
  '@nestjs/cli': '^11.0.0',
  '@nestjs/schematics': '^11.0.0',
  '@nestjs/testing': '^11.0.1',
  'typescript': '^5.7.2',
  'reflect-metadata': '^0.2.0',
  'rxjs': '^7.8.1',
};

// 📁 Services à scanner
const SERVICES_DIRS = [
  'services/identity',
  'services/marketplace',
  'services/logistics',
  'services/intelligence',
  'services/finance',
  'services/communication',
  'services/trust',
  'services/coop-service',
  'services/ai-service/vision-service',
];

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
 * 🔍 Trouve tous les package.json dans les services
 */
function findPackageJsonFiles(baseDir) {
  const packageFiles = [];

  function scan(dir) {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
          scan(fullPath);
        } else if (item.name === 'package.json') {
          packageFiles.push(fullPath);
        }
      }
    } catch (err) {
      // Ignore inaccessible directories
    }
  }

  SERVICES_DIRS.forEach(serviceDir => {
    const fullPath = path.join(baseDir, serviceDir);
    if (fs.existsSync(fullPath)) {
      scan(fullPath);
    }
  });

  return packageFiles;
}

/**
 * 🔄 Met à jour un package.json avec les nouvelles versions
 */
function upgradePackageJson(packagePath) {
  try {
    const content = fs.readFileSync(packagePath, 'utf8');
    const pkg = JSON.parse(content);
    
    let updated = false;
    const changes = [];

    // Mise à jour des dependencies
    ['dependencies', 'devDependencies'].forEach(depType => {
      if (pkg[depType]) {
        Object.keys(TARGET_VERSIONS).forEach(pkgName => {
          if (pkg[depType][pkgName]) {
            const oldVersion = pkg[depType][pkgName];
            const newVersion = TARGET_VERSIONS[pkgName];
            
            if (oldVersion !== newVersion) {
              pkg[depType][pkgName] = newVersion;
              changes.push(`  ${pkgName}: ${oldVersion} → ${newVersion}`);
              updated = true;
            }
          }
        });
      }
    });

    if (updated) {
      // Écrire le fichier avec indentation propre
      fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
      
      const serviceName = path.relative(process.cwd(), path.dirname(packagePath));
      log.success(`Upgraded: ${serviceName}`);
      changes.forEach(change => console.log(change));
      
      return { path: packagePath, changes: changes.length };
    } else {
      const serviceName = path.relative(process.cwd(), path.dirname(packagePath));
      log.info(`Already up-to-date: ${serviceName}`);
      return { path: packagePath, changes: 0 };
    }
  } catch (err) {
    log.error(`Failed to upgrade ${packagePath}: ${err.message}`);
    return { path: packagePath, changes: 0, error: err.message };
  }
}

/**
 * 📊 Génère un rapport de migration
 */
function generateReport(results) {
  const totalServices = results.length;
  const upgradedServices = results.filter(r => r.changes > 0).length;
  const failedServices = results.filter(r => r.error).length;
  const totalChanges = results.reduce((sum, r) => sum + (r.changes || 0), 0);

  log.title('📊 RAPPORT DE MIGRATION');
  console.log(`Total services scannés:    ${totalServices}`);
  console.log(`Services mis à jour:       ${colors.green}${upgradedServices}${colors.reset}`);
  console.log(`Services déjà à jour:      ${totalServices - upgradedServices - failedServices}`);
  console.log(`Échecs:                    ${failedServices > 0 ? colors.red : colors.green}${failedServices}${colors.reset}`);
  console.log(`Total changements:         ${colors.cyan}${totalChanges}${colors.reset}`);

  if (failedServices > 0) {
    log.warning('\nServices en échec:');
    results.filter(r => r.error).forEach(r => {
      console.log(`  - ${path.relative(process.cwd(), r.path)}: ${r.error}`);
    });
  }
}

/**
 * 🚀 Main execution
 */
async function main() {
  log.title('⚛️ QUANTUM SYNCHRONIZATION - NestJS v11 Migration');
  log.info('Scanning services for package.json files...\n');

  const baseDir = process.cwd();
  const packageFiles = findPackageJsonFiles(baseDir);

  if (packageFiles.length === 0) {
    log.warning('No package.json files found in services directories.');
    log.info('Make sure you are running this script from the project root.');
    process.exit(1);
  }

  log.info(`Found ${packageFiles.length} package.json files\n`);

  // Upgrade all packages
  const results = packageFiles.map(upgradePackageJson);

  // Generate report
  generateReport(results);

  // Next steps
  log.title('📋 PROCHAINES ÉTAPES');
  console.log('1. Vérifier les changements avec: git diff');
  console.log('2. Installer les dépendances: pnpm install');
  console.log('3. Tester la compilation: pnpm build');
  console.log('4. Lancer les tests: pnpm test');
  
  log.success('\n✨ Migration terminée avec succès!\n');
}

// Execute
main().catch(err => {
  log.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
