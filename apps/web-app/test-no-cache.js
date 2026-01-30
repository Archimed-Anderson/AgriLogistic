const { chromium } = require('playwright');

async function testWithCacheClear() {
  console.log('🧹 TEST AVEC NETTOYAGE DU CACHE\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--disable-cache', '--disable-application-cache', '--disable-offline-load-stale-cache']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    // Désactiver le cache
    ignoreHTTPSErrors: true,
  });
  
  const page = await context.newPage();
  
  // Désactiver le cache
  await page.route('**/*', route => {
    route.continue({
      headers: {
        ...route.request().headers(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  });

  try {
    console.log('📍 Navigation vers http://localhost:3001 (SANS CACHE)...\n');
    await page.goto('http://localhost:3001', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);
    
    // Forcer un hard refresh
    console.log('🔄 Hard refresh (Ctrl+Shift+R)...\n');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Scroller vers la section
    console.log('📜 Scroll vers Performance & Innovation...\n');
    await page.locator('text=Performance & Innovation').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Analyser les images
    console.log('🖼️  VÉRIFICATION DES IMAGES:\n');
    const innovationImages = await page.locator('img[alt*="Analytics"], img[alt*="Blockchain"], img[alt*="Logistique"], img[alt*="Réseau"], img[alt*="Edge"], img[alt*="Confidentialité"]').all();
    
    console.log(`   Images trouvées: ${innovationImages.length}\n`);
    
    for (let i = 0; i < innovationImages.length; i++) {
      const img = innovationImages[i];
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      const currentSrc = await img.evaluate(img => img.currentSrc);
      const complete = await img.evaluate(img => img.complete);
      const naturalWidth = await img.evaluate(img => img.naturalWidth);
      const naturalHeight = await img.evaluate(img => img.naturalHeight);
      
      console.log(`${i + 1}. ${alt}`);
      console.log(`   src: ${src}`);
      console.log(`   currentSrc: ${currentSrc}`);
      console.log(`   dimensions: ${naturalWidth}x${naturalHeight}`);
      console.log(`   statut: ${naturalWidth > 0 ? '✅ CHARGÉE' : '❌ ÉCHEC'}`);
      console.log('');
    }
    
    // Screenshot final
    console.log('📸 Capture d\'écran finale...\n');
    await page.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/test_no_cache.png',
      fullPage: true 
    });
    
    const section = page.locator('section').filter({ hasText: 'Performance & Innovation' });
    await section.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/section_no_cache.png'
    });
    
    console.log('✅ Test terminé! Vérifiez les screenshots.\n');

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
  } finally {
    await browser.close();
  }
}

testWithCacheClear();
