const { chromium } = require('playwright');

async function testCropIntelligencePage() {
  console.log('🌾 TEST DE LA PAGE CROP INTELLIGENCE\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  try {
    console.log('📍 Navigation vers /admin/crop-intelligence...\n');
    await page.goto('http://localhost:3001/admin/crop-intelligence', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // Vérifier le titre
    const title = await page.locator('h1').first().textContent();
    console.log(`✅ Titre de la page: ${title}\n`);
    
    // Compter les cartes de zones
    const zoneCards = await page.locator('[class*="group relative bg-white rounded-3xl"]').count();
    console.log(`📊 Nombre de zones affichées: ${zoneCards}\n`);
    
    // Vérifier les statistiques
    const stats = await page.locator('[class*="bg-white rounded-2xl p-6 border"]').count();
    console.log(`📈 Nombre de cartes statistiques: ${stats}\n`);
    
    // Compter les images satellites
    const images = await page.locator('img[alt*="Delta"], img[alt*="Plateau"], img[alt*="Vallée"], img[alt*="Bassin"], img[alt*="Plaine"], img[alt*="Région"], img[alt*="Savane"], img[alt*="Hauts"]').count();
    console.log(`🛰️  Images satellites: ${images}\n`);
    
    // Screenshot de la page complète
    console.log('📸 Capture de la page complète...\n');
    await page.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/crop_intelligence_full.png',
      fullPage: true 
    });
    
    // Screenshot de la section header
    const header = page.locator('h1').first();
    await header.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/crop_intelligence_header.png'
    });
    
    // Tester les filtres
    console.log('🔍 Test des filtres...\n');
    const criticalButton = page.locator('button:has-text("Critiques")');
    await criticalButton.click();
    await page.waitForTimeout(1000);
    
    const criticalZones = await page.locator('[class*="group relative bg-white rounded-3xl"]').count();
    console.log(`   Zones critiques affichées: ${criticalZones}\n`);
    
    await page.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/crop_intelligence_critical.png',
      fullPage: false 
    });
    
    // Reset au filtre "Toutes"
    await page.locator('button:has-text("Toutes")').click();
    await page.waitForTimeout(1000);
    
    // Screenshot d'une carte individuelle
    const firstCard = page.locator('[class*="group relative bg-white rounded-3xl"]').first();
    await firstCard.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/crop_zone_card.png'
    });
    
    console.log('✅ Test terminé avec succès!\n');
    console.log('📁 Screenshots sauvegardés dans le dossier brain/\n');

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
  } finally {
    await browser.close();
  }
}

testCropIntelligencePage();
