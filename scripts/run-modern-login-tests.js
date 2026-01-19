/**
 * Script d'exécution des tests Modern Login Page
 * Génère un rapport détaillé des résultats
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEST_FILE = 'tests/e2e/modern-login-complete.spec.ts';
const REPORT_DIR = path.join(process.cwd(), 'test-results', 'modern-login', 'reports');
const SCREENSHOTS_DIR = path.join(process.cwd(), 'test-results', 'modern-login', 'screenshots');

console.log('🚀 Exécution des tests Modern Login Page...\n');

// Créer les dossiers nécessaires
[REPORT_DIR, SCREENSHOTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

try {
  // Exécuter les tests en mode headless et UI
  console.log('📋 Exécution des tests en mode headless...');
  
  const testCommand = process.argv.includes('--ui') 
    ? `npx playwright test ${TEST_FILE} --ui`
    : `npx playwright test ${TEST_FILE} --reporter=json,html,list`;
  
  execSync(testCommand, { stdio: 'inherit', cwd: process.cwd() });
  
  console.log('\n✅ Tests terminés!');
  
  // Lire le rapport JSON généré
  const resultsFile = path.join(process.cwd(), 'test-results', 'results.json');
  if (fs.existsSync(resultsFile)) {
    const results = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
    
    // Générer un rapport markdown
    const markdownReport = generateMarkdownReport(results);
    const reportPath = path.join(REPORT_DIR, `test-report-${Date.now()}.md`);
    fs.writeFileSync(reportPath, markdownReport);
    
    console.log(`\n📊 Rapport détaillé généré: ${reportPath}`);
    console.log(`📸 Screenshots disponibles dans: ${SCREENSHOTS_DIR}`);
    console.log(`\n💡 Pour voir le rapport HTML interactif:`);
    console.log(`   npx playwright show-report`);
  }
  
} catch (error) {
  console.error('\n❌ Erreur lors de l\'exécution des tests:', error.message);
  
  // Générer un rapport même en cas d'erreur
  const resultsFile = path.join(process.cwd(), 'test-results', 'results.json');
  if (fs.existsSync(resultsFile)) {
    const results = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
    const markdownReport = generateMarkdownReport(results);
    const reportPath = path.join(REPORT_DIR, `test-report-${Date.now()}.md`);
    fs.writeFileSync(reportPath, markdownReport);
    console.log(`\n📊 Rapport partiel généré: ${reportPath}`);
  }
  
  process.exit(1);
}

function generateMarkdownReport(results) {
  const timestamp = new Date().toISOString();
  const total = results.stats?.total || 0;
  const passed = results.stats?.passed || 0;
  const failed = results.stats?.failed || 0;
  const skipped = results.stats?.skipped || 0;
  const duration = results.stats?.duration || 0;
  
  let report = `# 📊 Rapport de Tests - Modern Login Page\n\n`;
  report += `**Date**: ${timestamp}\n`;
  report += `**Durée totale**: ${(duration / 1000).toFixed(2)}s\n\n`;
  
  report += `## 📈 Résumé\n\n`;
  report += `| Métrique | Valeur |\n`;
  report += `|----------|--------|\n`;
  report += `| **Total** | ${total} |\n`;
  report += `| **✅ Passés** | ${passed} |\n`;
  report += `| **❌ Échoués** | ${failed} |\n`;
  report += `| **⏭️  Ignorés** | ${skipped} |\n`;
  report += `| **Taux de réussite** | ${total > 0 ? ((passed / total) * 100).toFixed(1) : 0}% |\n\n`;
  
  if (failed > 0) {
    report += `## ❌ Tests Échoués\n\n`;
    
    let failureCount = 1;
    if (results.suites) {
      results.suites.forEach(suite => {
        if (suite.specs) {
          suite.specs.forEach(spec => {
            spec.tests.forEach(test => {
              const status = test.results[0]?.status || 'unknown';
              if (status === 'failed') {
                report += `### ${failureCount}. ${test.title}\n\n`;
                test.results.forEach(result => {
                  if (result.error) {
                    report += `**Erreur**: \`${result.error.message}\`\n\n`;
                    if (result.error.stack) {
                      report += `\`\`\`\n${result.error.stack}\n\`\`\`\n\n`;
                    }
                  }
                });
                failureCount++;
              }
            });
          });
        }
      });
    }
  }
  
  if (results.suites) {
    report += `## 📋 Détails des Tests\n\n`;
    
    results.suites.forEach(suite => {
      report += `### ${suite.title}\n\n`;
      
      if (suite.specs) {
        suite.specs.forEach(spec => {
          spec.tests.forEach(test => {
            const status = test.results[0]?.status || 'unknown';
            const duration = test.results[0]?.duration || 0;
            const statusIcon = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⏭️';
            report += `${statusIcon} **${test.title}** (${(duration / 1000).toFixed(2)}s)\n`;
            
            if (status === 'failed') {
              test.results.forEach(result => {
                if (result.error) {
                  report += `  - ⚠️ ${result.error.message}\n`;
                }
              });
            }
            report += `\n`;
          });
        });
      }
    });
  }
  
  report += `## 📸 Screenshots\n\n`;
  report += `Les screenshots des échecs sont disponibles dans: \`${SCREENSHOTS_DIR}\`\n\n`;
  
  report += `## 🔍 Prochaines Étapes\n\n`;
  if (failed > 0) {
    report += `1. Consulter les screenshots pour identifier les problèmes visuels\n`;
    report += `2. Vérifier les logs de la console pour les erreurs JavaScript\n`;
    report += `3. Vérifier que l'application est bien démarrée sur http://localhost:5173\n`;
    report += `4. Vérifier que le service d'authentification est opérationnel\n`;
  } else {
    report += `✅ Tous les tests sont passés avec succès!\n`;
  }
  
  return report;
}
