const { chromium } = require('playwright');

async function testEnhancedUI() {
  console.log('🎨 TEST DE L\'UI/UX AMÉLIORÉE\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  try {
    console.log('📍 Navigation vers /admin/crop-intelligence...\n');
    await page.goto('http://localhost:3001/admin/crop-intelligence', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);
    
    // Vérifier le bouton "Lancer Scan Global"
    const scanButton = page.locator('button:has-text("Lancer Scan Global")');
    const buttonExists = await scanButton.count() > 0;
    console.log(`✅ Bouton "Lancer Scan Global": ${buttonExists ? 'Présent' : 'Absent'}\n`);
    
    // Vérifier les 3 KPIs
    const kpiCards = await page.locator('[class*="bg-white rounded-3xl p-8"]').count();
    console.log(`📊 Nombre de KPIs: ${kpiCards}\n`);
    
    // Lire les valeurs des KPIs
    const zonesValue = await page.locator('text=Zones Surveillées').locator('..').locator('p.text-5xl').first().textContent();
    const alertesValue = await page.locator('text=Alertes Actives').locator('..').locator('p.text-5xl').first().textContent();
    const rendementValue = await page.locator('text=Rendement Moyen Prévu').locator('..').locator('p.text-5xl').first().textContent();
    
    console.log(`📈 KPI Zones Surveillées: ${zonesValue?.trim()}`);
    console.log(`⚠️  KPI Alertes Actives: ${alertesValue?.trim()}`);
    console.log(`🌾 KPI Rendement Moyen: ${rendementValue?.trim()}\n`);
    
    // Screenshot du header avec bouton
    console.log('📸 Capture du header avec bouton...\n');
    const header = page.locator('h1').first().locator('..');
    await header.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/crop_header_enhanced.png'
    });
    
    // Screenshot des 3 KPIs
    console.log('📸 Capture des KPIs...\n');
    const kpisSection = page.locator('[class*="grid grid-cols-1 md:grid-cols-3"]').first();
    await kpisSection.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/crop_kpis_enhanced.png'
    });
    
    // Tester le bouton de scan
    console.log('🔄 Test du bouton "Lancer Scan Global"...\n');
    await scanButton.click();
    await page.waitForTimeout(1000);
    
    // Vérifier que le texte change
    const scanningText = await scanButton.textContent();
    console.log(`   État du bouton après clic: "${scanningText?.trim()}"\n`);
    
    await page.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/crop_scanning.png'
    });
    
    // Attendre la fin du scan
    await page.waitForTimeout(3500);
    
    console.log('✅ Test UI/UX terminé avec succès!\n');

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
  } finally {
    await browser.close();
  }
}

testEnhancedUI();
