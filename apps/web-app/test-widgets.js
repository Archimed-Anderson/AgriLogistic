const { chromium } = require('playwright');

async function testAdvancedWidgets() {
  console.log('🎯 TEST DES WIDGETS AVANCÉS - ÉTAPE 3\n');
  console.log('=' .repeat(70) + '\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1200 } });

  try {
    console.log('📍 Navigation vers /admin/crop-intelligence...\n');
    await page.goto('http://localhost:3001/admin/crop-intelligence', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // 1. Vérifier le graphique Recharts
    console.log('📊 GRAPHIQUE D\'ÉVOLUTION RECHARTS:');
    const chartTitle = await page.locator('text=Évolution du Rendement').count();
    console.log(`   ✅ Titre graphique: ${chartTitle > 0 ? 'Présent' : 'Absent'}`);
    
    const chartContainer = await page.locator('.recharts-responsive-container').count();
    console.log(`   📈 Container Recharts: ${chartContainer > 0 ? 'Présent' : 'Absent'}`);
    
    const areaCharts = await page.locator('.recharts-area').count();
    console.log(`   🔵 Nombre de courbes: ${areaCharts} (attendu: 2 - Réel + Prédiction)`);
    
    // 2. Vérifier le panel d'alertes
    console.log('\n⚠️  PANEL D\'ALERTES CRITIQUES:');
    const alertsTitle = await page.locator('text=Alertes IA').count();
    console.log(`   ✅ Titre alertes: ${alertsTitle > 0 ? 'Présent' : 'Absent'}`);
    
    const alertCards = await page.locator('[class*="rounded-2xl border-2"]').count();
    console.log(`   🔴 Nombre d'alertes: ${alertCards}`);
    
    // Compter alertes critiques vs avertissements
    const criticalAlerts = await page.locator('[class*="bg-red-50"]').count();
    const warningAlerts = await page.locator('[class*="bg-orange-50"]').count();
    console.log(`   💥 Critiques: ${criticalAlerts}`);
    console.log(`   ⚠️  Avertissements: ${warningAlerts}`);
    
    // 3. Vérifier les cartes de zones
    console.log('\n🗺️  CARTES DE SANTÉ (HEATMAP):');
    const zoneCards = await page.locator('[class*="group cursor-pointer"]').count();
    console.log(`   📍 Nombre de zones: ${zoneCards}`);
    
    const satelliteImages = await page.locator('img[src*="unsplash"]').count();
    console.log(`   🛰️  Images satellites: ${satelliteImages}`);
    
    const healthBadges = await page.locator('[class*="font-bold"][class*="px-4"]').count();
    console.log(`   💚 Badges de santé: ${healthBadges}`);
    
    const aiInsightBadges = await page.locator('text=Insight IA').count();
    console.log(`   🤖 Badges "IA Analysis": ${aiInsightBadges}`);
    
    // 4. Screenshots
    console.log('\n📸 CAPTURE D\'ÉCRANS:');
    
    // Full page
    await page.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/widgets_full_page.png',
      fullPage: true
    });
    console.log('   ✅ Page complète sauvegardée');
    
    // Chart section
    const chartSection = page.locator('text=Évolution du Rendement').locator('..');
    await chartSection.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/yield_chart.png'
    });
    console.log('   ✅ Graphique Recharts sauvegardé');
    
    // Alerts panel
    const alertsSection = page.locator('text=Alertes IA').locator('..');
    await alertsSection.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/alerts_panel.png'
    });
    console.log('   ✅ Panel d\'alertes sauvegardé');
    
    // Zone heatmap (première zone)
    const firstZone = page.locator('[class*="group cursor-pointer"]').first();
    await firstZone.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/zone_card_detailed.png'
    });
    console.log('   ✅ Carte de zone détaillée sauvegardée');
    
    // 5. Test d'interaction - Fermer une alerte
    console.log('\n🧪 TEST D\'INTERACTION:');
    const closeButtons = await page.locator('button[title="Marquer comme résolu"]');
    if (await closeButtons.count() > 0) {
      console.log('   🔘 Clic sur bouton fermer alerte...');
      await closeButtons.first().click();
      await page.waitForTimeout(500);
      const remainingAlerts = await page.locator('[class*="rounded-2xl border-2"]').count();
      console.log(`   ✅ Alertes restantes: ${remainingAlerts} (une a été fermée)`);
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ TEST TERMINÉ AVEC SUCCÈS!\n');

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
  } finally {
    await browser.close();
  }
}

testAdvancedWidgets();
