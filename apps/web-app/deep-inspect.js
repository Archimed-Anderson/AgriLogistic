const { chromium } = require('playwright');

async function deepInspection() {
  console.log('🔬 INSPECTION APPROFONDIE DES STYLES CSS\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    await page.locator('text=Performance & Innovation').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Analyser la première image en détail
    const firstImg = page.locator('img[alt="Analytics en Temps Réel"]').first();
    
    const imgDetails = await firstImg.evaluate(img => {
      const computedStyle = window.getComputedStyle(img);
      const parent = img.parentElement;
      const parentStyle = window.getComputedStyle(parent);
      
      return {
        // Image properties
        src: img.src,
        currentSrc: img.currentSrc,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.width,
        displayHeight: img.height,
        
        // Image computed styles
        imgOpacity: computedStyle.opacity,
        imgFilter: computedStyle.filter,
        imgBackdropFilter: computedStyle.backdropFilter,
        imgDisplay: computedStyle.display,
        imgVisibility: computedStyle.visibility,
        
        // Parent computed styles
        parentOpacity: parentStyle.opacity,
        parentFilter: parentStyle.filter,
        parentBackdropFilter: parentStyle.backdropFilter,
        parentOverflow: parentStyle.overflow,
        
        // HTML structure
        imgHTML: img.outerHTML.substring(0, 300),
        parentHTML: parent.outerHTML.substring(0, 500)
      };
    });
    
    console.log('📊 DÉTAILS DE L\'IMAGE:\n');
    console.log(`   src: ${imgDetails.src}`);
    console.log(`   currentSrc: ${imgDetails.currentSrc}`);
    console.log(`   complete: ${imgDetails.complete}`);
    console.log(`   naturalWidth x naturalHeight: ${imgDetails.naturalWidth} x ${imgDetails.naturalHeight}`);
    console.log(`   displayWidth x displayHeight: ${imgDetails.displayWidth} x ${imgDetails.displayHeight}`);
    console.log('');
    
    console.log('🎨 STYLES CSS DE L\'IMAGE:\n');
    console.log(`   opacity: ${imgDetails.imgOpacity}`);
    console.log(`   filter: ${imgDetails.imgFilter}`);
    console.log(`   backdropFilter: ${imgDetails.imgBackdropFilter}`);
    console.log(`   display: ${imgDetails.imgDisplay}`);
    console.log(`   visibility: ${imgDetails.imgVisibility}`);
    console.log('');
    
    console.log('🎨 STYLES CSS DU PARENT:\n');
    console.log(`   opacity: ${imgDetails.parentOpacity}`);
    console.log(`   filter: ${imgDetails.parentFilter}`);
    console.log(`   backdropFilter: ${imgDetails.parentBackdropFilter}`);
    console.log(`   overflow: ${imgDetails.parentOverflow}`);
    console.log('');
    
    console.log('📝 HTML:\n');
    console.log(`   Image: ${imgDetails.imgHTML}`);
    console.log(`   Parent: ${imgDetails.parentHTML}`);
    console.log('');
    
    // Chercher tous les éléments avec backdrop-blur
    const blurElements = await page.locator('[class*="backdrop-blur"]').count();
    console.log(`🔍 Éléments avec backdrop-blur: ${blurElements}\n`);
    
    // Screenshot de la carte spécifique
    const card = page.locator('.group').first();
    await card.screenshot({ 
      path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/card_detail.png'
    });

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
  } finally {
    await browser.close();
  }
}

deepInspection();
