#!/usr/bin/env node

/**
 * Script d'analyse et de modernisation de la page d'accueil
 * Exécute les tests Playwright et génère un rapport complet
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ANALYSIS_DIR = path.join(__dirname, "..", "tests", "e2e", "analysis-reports");
const REPORT_FILE = path.join(__dirname, "..", "HOMEPAGE_ANALYSIS_REPORT.md");

console.log("\n🎨 ANALYSE ET MODERNISATION DE LA PAGE D'ACCUEIL\n");
console.log("================================================\n");

// Créer le dossier de rapports s'il n'existe pas
if (!fs.existsSync(ANALYSIS_DIR)) {
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
  console.log(`✓ Dossier de rapports créé: ${ANALYSIS_DIR}\n`);
}

// Fonction pour exécuter une commande
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`\n▶️  Exécution: ${command} ${args.join(" ")}\n`);
    
    const process = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    process.on("error", (error) => {
      reject(error);
    });
  });
}

// Fonction pour générer le rapport final
function generateFinalReport() {
  console.log("\n📊 Génération du rapport final...\n");

  let report = `# 📊 Rapport d'Analyse - Page d'Accueil AgroDeep\n\n`;
  report += `**Date**: ${new Date().toLocaleString("fr-FR")}\n\n`;
  report += `---\n\n`;

  // Lire les rapports JSON
  const reports = [
    { file: "structure-analysis.json", title: "Structure HTML" },
    { file: "performance-analysis.json", title: "Performance" },
    { file: "accessibility-analysis.json", title: "Accessibilité" },
    { file: "responsive-analysis.json", title: "Responsive Design" },
    { file: "modernization-needs.json", title: "Éléments à Moderniser" },
  ];

  reports.forEach(({ file, title }) => {
    const filePath = path.join(ANALYSIS_DIR, file);
    
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        report += `## ${title}\n\n`;
        report += `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\n`;
        console.log(`✓ Rapport ${title} intégré`);
      } catch (error) {
        console.log(`⚠️  Erreur lecture ${file}: ${error.message}`);
      }
    } else {
      console.log(`⚠️  Fichier ${file} non trouvé`);
    }
  });

  // Ajouter les captures d'écran
  report += `## Captures d'Écran\n\n`;
  
  const screenshots = [
    { file: "screenshot-mobile.png", title: "Mobile (375x667)" },
    { file: "screenshot-tablet.png", title: "Tablet (768x1024)" },
    { file: "screenshot-desktop.png", title: "Desktop (1920x1080)" },
  ];

  screenshots.forEach(({ file, title }) => {
    const filePath = path.join(ANALYSIS_DIR, file);
    if (fs.existsSync(filePath)) {
      report += `### ${title}\n\n`;
      report += `![${title}](tests/e2e/analysis-reports/${file})\n\n`;
      console.log(`✓ Capture ${title} référencée`);
    }
  });

  // Sauvegarder le rapport
  fs.writeFileSync(REPORT_FILE, report);
  console.log(`\n✅ Rapport final sauvegardé: ${REPORT_FILE}\n`);
}

// Fonction principale
async function main() {
  try {
    // Étape 1: Analyser la page d'accueil
    console.log("📋 ÉTAPE 1: Analyse de la page d'accueil\n");
    await runCommand("npm", ["run", "test:e2e", "--", "homepage-analysis.spec.ts"]);
    console.log("\n✅ Analyse terminée\n");

    // Étape 2: Tester le flux d'authentification
    console.log("🔐 ÉTAPE 2: Test du flux d'authentification\n");
    await runCommand("npm", ["run", "test:e2e", "--", "auth-flow-fix.spec.ts"]);
    console.log("\n✅ Tests d'authentification terminés\n");

    // Étape 3: Générer le rapport final
    generateFinalReport();

    // Résumé
    console.log("================================================\n");
    console.log("🎉 ANALYSE COMPLÈTE TERMINÉE AVEC SUCCÈS !\n");
    console.log("📁 Rapports disponibles dans:");
    console.log(`   - ${ANALYSIS_DIR}`);
    console.log(`   - ${REPORT_FILE}\n`);
    console.log("📸 Captures d'écran générées:");
    console.log("   - screenshot-mobile.png");
    console.log("   - screenshot-tablet.png");
    console.log("   - screenshot-desktop.png\n");
    console.log("================================================\n");

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
