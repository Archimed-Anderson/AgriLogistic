const { chromium } = require('playwright');

async function verifyImageFix() {
  console.log('🎯 Vérification finale après correction...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    console.log('📍 Navigation vers http://localhost:3001...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    console.log('✅ Page chargée\n');

    await page.waitForTimeout(3000);

    // Scroller vers la section
    console.log('📜 Scroll vers la section Performance & Innovation...');
    await page.locator('text=Performance & Innovation').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Vérifier les images
    console.log('\n🖼️  Vérification du chargement des images:\n');
    const images = await page.locator('img[alt*="Analytics"], img[alt*="Blockchain"], img[alt*="Logistique"], img[alt*="Réseau"], img[alt*="Edge"], img[alt*="Confidentialité"]').all();
    
    console.log(`   Nombre d'images trouvées: ${images.length}\n`);
    
    let loadedCount = 0;
    for (let i = 0; i < images.length; i++) {
      const alt = await images[i].getAttribute('alt');
      const src = await images[i].getAttribute('src');
      const complete = await images[i].evaluate(img => img.complete);
      const naturalWidth = await images[i].evaluate(img => img.naturalWidth);
      
      const isLoaded = complete && naturalWidth > 0;
      if (isLoaded) loadedCount++;
      
      console.log(`   ${isLoaded ? '✅' : '❌'} ${alt}`);
      console.log(`      src: ${src}`);
      console.log(`      dimensions: ${naturalWidth}x${await images[i].evaluate(img => img.naturalHeight)}`);
      console.log('');
    }
    
    console.log(`\n📊 Résultat: ${loadedCount}/${images.length} images chargées correctement\n`);
    
    // Screenshot final
    console.log('📸 Capture d\'écran finale...');
    await page.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/final_verification.png',
      fullPage: true 
    });
    
    if (loadedCount === images.length) {
      console.log('🎉 SUCCÈS! Toutes les images sont chargées correctement!');
    } else {
      console.log(`⚠️  ATTENTION: ${images.length - loadedCount} image(s) ne se charge(nt) pas.`);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await browser.close();
  }
}

verifyImageFix();
