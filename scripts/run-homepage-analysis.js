#!/usr/bin/env node

/**
 * Script d'analyse et de modernisation de la page d'accueil
 * ExÃ©cute les tests Playwright et gÃ©nÃ¨re un rapport complet
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ANALYSIS_DIR = path.join(__dirname, "..", "tests", "e2e", "analysis-reports");
const REPORT_FILE = path.join(__dirname, "..", "HOMEPAGE_ANALYSIS_REPORT.md");

console.log("\nðŸŽ¨ ANALYSE ET MODERNISATION DE LA PAGE D'ACCUEIL\n");
console.log("================================================\n");

// CrÃ©er le dossier de rapports s'il n'existe pas
if (!fs.existsSync(ANALYSIS_DIR)) {
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
  console.log(`âœ“ Dossier de rapports crÃ©Ã©: ${ANALYSIS_DIR}\n`);
}

// Fonction pour exÃ©cuter une commande
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`\nâ–¶ï¸  ExÃ©cution: ${command} ${args.join(" ")}\n`);
    
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

// Fonction pour gÃ©nÃ©rer le rapport final
function generateFinalReport() {
  console.log("\nðŸ“Š GÃ©nÃ©ration du rapport final...\n");

  let report = `# ðŸ“Š Rapport d'Analyse - Page d'Accueil AgriLogistic\n\n`;
  report += `**Date**: ${new Date().toLocaleString("fr-FR")}\n\n`;
  report += `---\n\n`;

  // Lire les rapports JSON
  const reports = [
    { file: "structure-analysis.json", title: "Structure HTML" },
    { file: "performance-analysis.json", title: "Performance" },
    { file: "accessibility-analysis.json", title: "AccessibilitÃ©" },
    { file: "responsive-analysis.json", title: "Responsive Design" },
    { file: "modernization-needs.json", title: "Ã‰lÃ©ments Ã  Moderniser" },
  ];

  reports.forEach(({ file, title }) => {
    const filePath = path.join(ANALYSIS_DIR, file);
    
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        report += `## ${title}\n\n`;
        report += `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\n`;
        console.log(`âœ“ Rapport ${title} intÃ©grÃ©`);
      } catch (error) {
        console.log(`âš ï¸  Erreur lecture ${file}: ${error.message}`);
      }
    } else {
      console.log(`âš ï¸  Fichier ${file} non trouvÃ©`);
    }
  });

  // Ajouter les captures d'Ã©cran
  report += `## Captures d'Ã‰cran\n\n`;
  
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
      console.log(`âœ“ Capture ${title} rÃ©fÃ©rencÃ©e`);
    }
  });

  // Sauvegarder le rapport
  fs.writeFileSync(REPORT_FILE, report);
  console.log(`\nâœ… Rapport final sauvegardÃ©: ${REPORT_FILE}\n`);
}

// Fonction principale
async function main() {
  try {
    // Ã‰tape 1: Analyser la page d'accueil
    console.log("ðŸ“‹ Ã‰TAPE 1: Analyse de la page d'accueil\n");
    await runCommand("npm", ["run", "test:e2e", "--", "homepage-analysis.spec.ts"]);
    console.log("\nâœ… Analyse terminÃ©e\n");

    // Ã‰tape 2: Tester le flux d'authentification
    console.log("ðŸ” Ã‰TAPE 2: Test du flux d'authentification\n");
    await runCommand("npm", ["run", "test:e2e", "--", "auth-flow-fix.spec.ts"]);
    console.log("\nâœ… Tests d'authentification terminÃ©s\n");

    // Ã‰tape 3: GÃ©nÃ©rer le rapport final
    generateFinalReport();

    // RÃ©sumÃ©
    console.log("================================================\n");
    console.log("ðŸŽ‰ ANALYSE COMPLÃˆTE TERMINÃ‰E AVEC SUCCÃˆS !\n");
    console.log("ðŸ“ Rapports disponibles dans:");
    console.log(`   - ${ANALYSIS_DIR}`);
    console.log(`   - ${REPORT_FILE}\n`);
    console.log("ðŸ“¸ Captures d'Ã©cran gÃ©nÃ©rÃ©es:");
    console.log("   - screenshot-mobile.png");
    console.log("   - screenshot-tablet.png");
    console.log("   - screenshot-desktop.png\n");
    console.log("================================================\n");

  } catch (error) {
    console.error("\nâŒ ERREUR:", error.message);
    console.error("\nâš ï¸  Assurez-vous que:");
    console.error("   1. L'application est dÃ©marrÃ©e (npm run dev)");
    console.error("   2. Playwright est installÃ© (npx playwright install)");
    console.error("   3. Le port 5173 est accessible\n");
    process.exit(1);
  }
}

// ExÃ©cuter le script
main();

