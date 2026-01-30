const { chromium } = require('playwright');

async function deepDiagnostic() {
  console.log('🔍 DIAGNOSTIC APPROFONDI DES IMAGES\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Capturer TOUTES les requêtes réseau
  const allRequests = [];
  const failedRequests = [];
  
  page.on('request', request => {
    if (request.url().includes('landing') || request.url().includes('innovation')) {
      allRequests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('landing') || url.includes('innovation')) {
      const status = response.status();
      const headers = response.headers();
      
      if (status !== 200) {
        failedRequests.push({
          url,
          status,
          statusText: response.statusText()
        });
      }
      
      console.log(`📡 ${status} - ${url.split('/').slice(-2).join('/')}`);
      if (url.includes('.png') || url.includes('.jpg') || url.includes('.webp')) {
        console.log(`   Content-Type: ${headers['content-type']}`);
        console.log(`   Content-Length: ${headers['content-length']}`);
      }
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });

  try {
    console.log('📍 Navigation vers http://localhost:3001...\n');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
    
    await page.waitForTimeout(3000);
    
    // Chercher la section
    console.log('\n🔍 Recherche de la section Performance & Innovation...');
    const sectionCount = await page.locator('text=Performance & Innovation').count();
    console.log(`   Sections trouvées: ${sectionCount}\n`);
    
    if (sectionCount > 0) {
      // Scroller vers la section
      await page.locator('text=Performance & Innovation').first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      
      // Analyser TOUTES les images sur la page
      console.log('\n🖼️  ANALYSE DES IMAGES:\n');
      const allImages = await page.locator('img').all();
      
      for (let i = 0; i < allImages.length; i++) {
        const img = allImages[i];
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');
        
        if (src && (src.includes('innovation') || src.includes('landing'))) {
          const complete = await img.evaluate(img => img.complete);
          const naturalWidth = await img.evaluate(img => img.naturalWidth);
          const naturalHeight = await img.evaluate(img => img.naturalHeight);
          const currentSrc = await img.evaluate(img => img.currentSrc);
          
          console.log(`Image ${i + 1}:`);
          console.log(`   alt: ${alt}`);
          console.log(`   src: ${src}`);
          console.log(`   currentSrc: ${currentSrc}`);
          console.log(`   complete: ${complete}`);
          console.log(`   dimensions naturelles: ${naturalWidth}x${naturalHeight}`);
          console.log(`   statut: ${naturalWidth > 0 ? '✅ CHARGÉE' : '❌ NON CHARGÉE'}`);
          console.log('');
        }
      }
      
      // Screenshot de la section
      console.log('📸 Capture de la section...');
      const section = page.locator('section').filter({ hasText: 'Performance & Innovation' });
      await section.screenshot({ 
        path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/diagnostic_section.png'
      });
      
      // Screenshot complet
      await page.screenshot({ 
        path: 'C:/Users/ander/.gemini/antigravity/brain/f62b54ad-c185-47f2-99ff-99c8ef60e6b5/diagnostic_full.png',
        fullPage: true 
      });
    }
    
    console.log('\n📊 RÉSUMÉ DES REQUÊTES:\n');
    console.log(`   Total requêtes: ${allRequests.length}`);
    console.log(`   Requêtes échouées: ${failedRequests.length}\n`);
    
    if (failedRequests.length > 0) {
      console.log('❌ REQUÊTES ÉCHOUÉES:\n');
      failedRequests.forEach(req => {
        console.log(`   ${req.status} ${req.statusText} - ${req.url}`);
      });
    }
    
    console.log('\n✅ Diagnostic terminé!');

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
  } finally {
    await browser.close();
  }
}

deepDiagnostic();
