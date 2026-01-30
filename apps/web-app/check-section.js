const { chromium } = require('playwright');

async function checkSectionExists() {
  console.log('🔍 VÉRIFICATION DE L\'EXISTENCE DE LA SECTION\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Chercher TOUTES les sections
    console.log('📋 TOUTES LES SECTIONS SUR LA PAGE:\n');
    const sections = await page.locator('section').all();
    console.log(`   Total sections: ${sections.length}\n`);
    
    for (let i = 0; i < sections.length; i++) {
      const text = await sections[i].innerText();
      const firstLine = text.split('\n')[0].substring(0, 80);
      console.log(`   Section ${i + 1}: ${firstLine}...`);
    }
    
    // Chercher spécifiquement "Performance & Innovation"
    console.log('\n\n🎯 RECHERCHE DE "Performance & Innovation":\n');
    const perfSection = await page.locator('text=Performance & Innovation').count();
    console.log(`   Occurrences trouvées: ${perfSection}`);
    
    if (perfSection > 0) {
      console.log('\n   ✅ LA SECTION EXISTE!\n');
      
      // Scroller vers elle
      await page.locator('text=Performance & Innovation').first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      
      // Compter les images dans cette section
      const section = page.locator('section').filter({ hasText: 'Performance & Innovation' });
      const imagesInSection = await section.locator('img').count();
      console.log(`   Images dans la section: ${imagesInSection}\n`);
      
      // Récupérer les src de toutes les images
      const imageSrcs = await section.locator('img').evaluateAll(imgs => 
        imgs.map(img => ({ src: img.src, alt: img.alt, complete: img.complete, naturalWidth: img.naturalWidth }))
      );
      
      console.log('   DÉTAILS DES IMAGES:\n');
      imageSrcs.forEach((img, i) => {
        console.log(`   ${i + 1}. ${img.alt || 'Sans alt'}`);
        console.log(`      src: ${img.src}`);
        console.log(`      chargée: ${img.complete && img.naturalWidth > 0 ? 'OUI' : 'NON'}`);
        console.log('');
      });
      
      // Screenshot
      await section.screenshot({ 
        path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/section_check.png'
      });
      
    } else {
      console.log('\n   ❌ LA SECTION N\'EXISTE PAS SUR LA PAGE!\n');
    }

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
  } finally {
    await browser.close();
  }
}

checkSectionExists();
