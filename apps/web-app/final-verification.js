const { chromium } = require('playwright');

async function finalVerification() {
  console.log('✅ VÉRIFICATION FINALE - IMAGES SANS OVERLAY\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  try {
    console.log('📍 Navigation vers http://localhost:3001...\n');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Hard refresh pour s'assurer d'avoir la dernière version
    console.log('🔄 Hard refresh...\n');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Scroller vers la section
    console.log('📜 Scroll vers Performance & Innovation...\n');
    await page.locator('text=Performance & Innovation').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Vérifier les images
    const section = page.locator('section').filter({ hasText: 'Performance & Innovation' });
    const images = await section.locator('img').all();
    
    console.log(`🖼️  Images trouvées: ${images.length}\n`);
    
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const alt = await img.getAttribute('alt');
      const naturalWidth = await img.evaluate(img => img.naturalWidth);
      const naturalHeight = await img.evaluate(img => img.naturalHeight);
      
      console.log(`${i + 1}. ${alt}: ${naturalWidth}x${naturalHeight} ${naturalWidth > 0 ? '✅' : '❌'}`);
    }
    
    // Screenshots finaux
    console.log('\n📸 Capture des screenshots finaux...\n');
    
    await section.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/final_section_fixed.png'
    });
    
    await page.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/final_page_fixed.png',
      fullPage: true 
    });
    
    console.log('✅ Vérification terminée!\n');
    console.log('Les images devraient maintenant être nettes et claires.\n');

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
  } finally {
    await browser.close();
  }
}

finalVerification();
