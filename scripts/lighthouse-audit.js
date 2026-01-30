/**
 * Script d'audit Lighthouse pour la Landing Page AgriLogistic
 * GÃ©nÃ¨re un rapport de performance, accessibilitÃ©, SEO et best practices
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'http://localhost:5173';
const REPORT_DIR = path.join(process.cwd(), 'lighthouse-reports');

// CrÃ©er le dossier de rapports s'il n'existe pas
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

async function runLighthouse() {
  console.log('ðŸš€ Lancement de l\'audit Lighthouse...\n');

  // Lancer Chrome
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: ['html', 'json'],
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  try {
    // ExÃ©cuter Lighthouse
    const runnerResult = await lighthouse(TARGET_URL, options);

    // Extraire les scores
    const { lhr } = runnerResult;
    const scores = {
      performance: lhr.categories.performance.score * 100,
      accessibility: lhr.categories.accessibility.score * 100,
      bestPractices: lhr.categories['best-practices'].score * 100,
      seo: lhr.categories.seo.score * 100,
    };

    // Afficher les rÃ©sultats
    console.log('ðŸ“Š Scores Lighthouse:\n');
    console.log(`  Performance:      ${scores.performance.toFixed(0)}/100 ${getScoreEmoji(scores.performance)}`);
    console.log(`  Accessibility:    ${scores.accessibility.toFixed(0)}/100 ${getScoreEmoji(scores.accessibility)}`);
    console.log(`  Best Practices:   ${scores.bestPractices.toFixed(0)}/100 ${getScoreEmoji(scores.bestPractices)}`);
    console.log(`  SEO:              ${scores.seo.toFixed(0)}/100 ${getScoreEmoji(scores.seo)}\n`);

    // VÃ©rifier les objectifs
    const allAbove90 = Object.values(scores).every(score => score >= 90);
    if (allAbove90) {
      console.log('âœ… Tous les scores sont >= 90! Objectif atteint! ðŸŽ‰\n');
    } else {
      console.log('âš ï¸  Certains scores sont < 90. AmÃ©liorations nÃ©cessaires.\n');
    }

    // Sauvegarder les rapports
    const timestamp = Date.now();
    const htmlReport = runnerResult.report[0];
    const jsonReport = runnerResult.report[1];

    const htmlPath = path.join(REPORT_DIR, `lighthouse-${timestamp}.html`);
    const jsonPath = path.join(REPORT_DIR, `lighthouse-${timestamp}.json`);

    fs.writeFileSync(htmlPath, htmlReport);
    fs.writeFileSync(jsonPath, jsonReport);

    console.log(`ðŸ“„ Rapport HTML: ${htmlPath}`);
    console.log(`ðŸ“„ Rapport JSON: ${jsonPath}\n`);

    // Afficher les principales opportunitÃ©s d'amÃ©lioration
    const opportunities = lhr.audits['diagnostics'] || {};
    if (opportunities.details) {
      console.log('ðŸ’¡ Principales opportunitÃ©s d\'amÃ©lioration:\n');
      // Afficher les 5 premiÃ¨res opportunitÃ©s
      Object.entries(lhr.audits)
        .filter(([key, audit]) => 
          audit.score !== null && 
          audit.score < 1 && 
          audit.details?.type === 'opportunity'
        )
        .slice(0, 5)
        .forEach(([key, audit]) => {
          console.log(`  - ${audit.title}`);
        });
      console.log('');
    }

    await chrome.kill();
    process.exit(allAbove90 ? 0 : 1);

  } catch (error) {
    console.error('âŒ Erreur lors de l\'audit Lighthouse:', error);
    await chrome.kill();
    process.exit(1);
  }
}

function getScoreEmoji(score) {
  if (score >= 90) return 'ðŸŸ¢';
  if (score >= 50) return 'ðŸŸ¡';
  return 'ðŸ”´';
}

// VÃ©rifier que l'application est dÃ©marrÃ©e
console.log(`ðŸ” VÃ©rification de l'application sur ${TARGET_URL}...\n`);

require('http').get(TARGET_URL, (res) => {
  if (res.statusCode === 200) {
    console.log('âœ… Application accessible, lancement de l\'audit...\n');
    runLighthouse();
  } else {
    console.error('âŒ Application non accessible. Assurez-vous qu\'elle est dÃ©marrÃ©e (npm run dev).');
    process.exit(1);
  }
}).on('error', (err) => {
  console.error('âŒ Impossible de se connecter Ã  l\'application.');
  console.error('   Assurez-vous qu\'elle est dÃ©marrÃ©e avec: npm run dev');
  process.exit(1);
});

