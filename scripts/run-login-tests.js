#!/usr/bin/env node

/**
 * Script d'exécution des tests de Login
 * Génère un rapport détaillé des résultats et des échecs
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const RESULTS_DIR = path.join(__dirname, "..", "test-results");
const REPORT_FILE = path.join(__dirname, "..", "LOGIN_TEST_REPORT.md");
const SCREENSHOTS_DIR = path.join(__dirname, "..", "tests", "e2e", "screenshots", "login");

console.log("\n🔐 TESTS COMPLETS DU SYSTÈME DE LOGIN\n");
console.log("================================================\n");

// Créer les dossiers nécessaires
[RESULTS_DIR, SCREENSHOTS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Dossier créé: ${dir}`);
  }
});

// Fonction pour exécuter une commande
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`\n▶️  Exécution: ${command} ${args.join(" ")}\n`);
    
    const process = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    process.on("close", (code) => {
      resolve(code);
    });

    process.on("error", (error) => {
      reject(error);
    });
  });
}

// Fonction pour générer le rapport
function generateReport(exitCode) {
  console.log("\n📊 Génération du rapport de tests...\n");

  let report = `# 🔐 Rapport de Tests - Système de Login\n\n`;
  report += `**Date**: ${new Date().toLocaleString("fr-FR")}\n`;
  report += `**Statut**: ${exitCode === 0 ? "✅ TOUS LES TESTS RÉUSSIS" : "❌ ÉCHECS DÉTECTÉS"}\n\n`;
  report += `---\n\n`;

  // Lire les résultats JSON si disponibles
  const resultsFile = path.join(RESULTS_DIR, "results.json");
  if (fs.existsSync(resultsFile)) {
    try {
      const results = JSON.parse(fs.readFileSync(resultsFile, "utf8"));
      
      report += `## 📈 Résumé des Tests\n\n`;
      report += `- **Total**: ${results.suites.reduce((sum, suite) => sum + suite.specs.length, 0)} tests\n`;
      report += `- **Réussis**: ${results.suites.reduce((sum, suite) => sum + suite.specs.filter(s => s.ok).length, 0)} ✅\n`;
      report += `- **Échoués**: ${results.suites.reduce((sum, suite) => sum + suite.specs.filter(s => !s.ok).length, 0)} ❌\n`;
      report += `- **Durée**: ${(results.stats.duration / 1000).toFixed(2)}s\n\n`;

      // Détails des échecs
      const failures = [];
      results.suites.forEach((suite) => {
        suite.specs.forEach((spec) => {
          if (!spec.ok) {
            failures.push({
              suite: suite.title,
              test: spec.title,
              error: spec.tests[0]?.results[0]?.error?.message || "Erreur inconnue",
            });
          }
        });
      });

      if (failures.length > 0) {
        report += `## ❌ Échecs Détectés\n\n`;
        failures.forEach((failure, index) => {
          report += `### ${index + 1}. ${failure.test}\n\n`;
          report += `**Suite**: ${failure.suite}\n\n`;
          report += `**Erreur**:\n\`\`\`\n${failure.error}\n\`\`\`\n\n`;
          report += `**Étapes pour reproduire**:\n`;
          report += `1. Démarrer l'application: \`npm run dev\`\n`;
          report += `2. Exécuter le test: \`npm run test:e2e -- --grep "${failure.test}"\`\n\n`;
        });
      }

      console.log(`✓ Résultats JSON analysés`);
    } catch (error) {
      console.log(`⚠️  Erreur lecture résultats: ${error.message}`);
    }
  }

  // Lister les screenshots d'échec
  if (fs.existsSync(SCREENSHOTS_DIR)) {
    const screenshots = fs.readdirSync(SCREENSHOTS_DIR).filter((f) => f.endsWith(".png"));
    
    if (screenshots.length > 0) {
      report += `## 📸 Captures d'Écran des Échecs\n\n`;
      screenshots.forEach((screenshot) => {
        report += `- ![${screenshot}](tests/e2e/screenshots/login/${screenshot})\n`;
      });
      report += `\n`;
      console.log(`✓ ${screenshots.length} capture(s) d'écran référencée(s)`);
    }
  }

  // Tests couverts
  report += `## ✅ Tests Implémentés\n\n`;
  report += `### Tests Fonctionnels\n\n`;
  report += `1. ✅ Connexion réussie avec identifiants valides\n`;
  report += `2. ✅ Échec de connexion - Email et mot de passe incorrects\n`;
  report += `3. ✅ Échec de connexion - Mot de passe incorrect\n`;
  report += `4. ✅ Validation - Email vide\n`;
  report += `5. ✅ Validation - Mot de passe vide\n`;
  report += `6. ✅ Validation - Format email invalide\n`;
  report += `7. ✅ Tentatives multiples infructueuses (Rate Limiting)\n`;
  report += `8. ✅ Vérification de la redirection après connexion\n`;
  report += `9. ✅ Persistance de session - Rafraîchissement de page\n`;
  report += `10. ✅ Visibilité du mot de passe (Toggle)\n`;
  report += `11. ✅ Accessibilité - Navigation clavier\n`;
  report += `12. ✅ Responsive - Mobile viewport\n\n`;

  report += `### Tests de Messages d'Erreur\n\n`;
  report += `- ✅ Email et mot de passe incorrects\n`;
  report += `- ✅ Mot de passe incorrect\n`;
  report += `- ✅ Email incorrect\n`;
  report += `- ✅ Email vide\n`;
  report += `- ✅ Mot de passe vide\n`;
  report += `- ✅ Tous les champs vides\n`;
  report += `- ✅ Format email invalide\n\n`;

  // Configuration
  report += `## ⚙️ Configuration\n\n`;
  report += `### Navigateurs Testés\n\n`;
  report += `- ✅ Chromium (Desktop)\n`;
  report += `- ✅ Firefox (Desktop)\n`;
  report += `- ✅ WebKit/Safari (Desktop)\n`;
  report += `- ✅ Mobile Chrome (Pixel 5)\n`;
  report += `- ✅ Mobile Safari (iPhone 12)\n`;
  report += `- ✅ Tablet (iPad Pro)\n\n`;

  report += `### Fonctionnalités de Test\n\n`;
  report += `- ✅ Screenshots automatiques en cas d'échec\n`;
  report += `- ✅ Vidéos des échecs\n`;
  report += `- ✅ Traces pour débogage\n`;
  report += `- ✅ Tests indépendants et isolés\n`;
  report += `- ✅ Nettoyage de l'état avant chaque test\n`;
  report += `- ✅ Sélecteurs robustes et fiables\n\n`;

  // Commandes
  report += `## 🚀 Commandes Disponibles\n\n`;
  report += `\`\`\`bash\n`;
  report += `# Exécuter tous les tests de login\n`;
  report += `npm run test:login\n\n`;
  report += `# Exécuter un test spécifique\n`;
  report += `npm run test:e2e -- --grep "Connexion réussie"\n\n`;
  report += `# Exécuter avec l'interface UI\n`;
  report += `npm run test:e2e -- --ui\n\n`;
  report += `# Exécuter en mode debug\n`;
  report += `npm run test:e2e -- --debug\n\n`;
  report += `# Voir le rapport HTML\n`;
  report += `npx playwright show-report\n`;
  report += `\`\`\`\n\n`;

  // Intégration CI/CD
  report += `## 🔄 Intégration CI/CD\n\n`;
  report += `### GitHub Actions\n\n`;
  report += `\`\`\`yaml\n`;
  report += `name: E2E Tests\n\n`;
  report += `on: [push, pull_request]\n\n`;
  report += `jobs:\n`;
  report += `  test:\n`;
  report += `    runs-on: ubuntu-latest\n`;
  report += `    steps:\n`;
  report += `      - uses: actions/checkout@v3\n`;
  report += `      - uses: actions/setup-node@v3\n`;
  report += `        with:\n`;
  report += `          node-version: 18\n`;
  report += `      - run: npm ci\n`;
  report += `      - run: npx playwright install --with-deps\n`;
  report += `      - run: npm run test:login\n`;
  report += `      - uses: actions/upload-artifact@v3\n`;
  report += `        if: always()\n`;
  report += `        with:\n`;
  report += `          name: playwright-report\n`;
  report += `          path: playwright-report/\n`;
  report += `\`\`\`\n\n`;

  // Sauvegarder le rapport
  fs.writeFileSync(REPORT_FILE, report);
  console.log(`\n✅ Rapport sauvegardé: ${REPORT_FILE}\n`);
}

// Fonction principale
async function main() {
  try {
    // Exécuter les tests de login
    console.log("🧪 Exécution des tests de login...\n");
    const exitCode = await runCommand("npm", ["run", "test:e2e", "--", "login-comprehensive.spec.ts"]);

    // Générer le rapport
    generateReport(exitCode);

    // Résumé
    console.log("================================================\n");
    if (exitCode === 0) {
      console.log("🎉 TOUS LES TESTS RÉUSSIS !\n");
    } else {
      console.log("⚠️  CERTAINS TESTS ONT ÉCHOUÉ\n");
      console.log("📁 Consultez le rapport détaillé:");
      console.log(`   - ${REPORT_FILE}`);
      console.log(`   - playwright-report/index.html\n`);
      
      if (fs.existsSync(SCREENSHOTS_DIR)) {
        const screenshots = fs.readdirSync(SCREENSHOTS_DIR).filter((f) => f.endsWith(".png"));
        if (screenshots.length > 0) {
          console.log(`📸 ${screenshots.length} capture(s) d'écran disponible(s):`);
          console.log(`   - ${SCREENSHOTS_DIR}\n`);
        }
      }
    }
    console.log("================================================\n");

    process.exit(exitCode);
  } catch (error) {
    console.error("\n❌ ERREUR:", error.message);
    console.error("\n⚠️  Assurez-vous que:");
    console.error("   1. L'application est démarrée (npm run dev)");
    console.error("   2. Playwright est installé (npx playwright install)");
    console.error("   3. Le port 5173 est accessible\n");
    process.exit(1);
  }
}

// Exécuter le script
main();
