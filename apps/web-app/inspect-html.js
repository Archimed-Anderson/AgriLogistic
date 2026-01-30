const { chromium } = require('playwright');

async function inspectHTML() {
  console.log('🔍 INSPECTION DU HTML ET DES CHEMINS\n');
  console.log('=' .repeat(60) + '\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Scroller vers la section
    await page.locator('text=Performance & Innovation').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Récupérer le HTML de la section
    console.log('📄 HTML DE LA SECTION:\n');
    const sectionHTML = await page.locator('section').filter({ hasText: 'Performance & Innovation' }).innerHTML();
    console.log(sectionHTML.substring(0, 2000) + '...\n');
    
    // Analyser chaque image
    console.log('\n🖼️  ANALYSE DÉTAILLÉE DES IMAGES:\n');
    const images = await page.locator('img[alt*="Analytics"], img[alt*="Blockchain"], img[alt*="Logistique"], img[alt*="Réseau"], img[alt*="Edge"], img[alt*="Confidentialité"]').all();
    
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      
      const details = await img.evaluate(img => ({
        alt: img.alt,
        src: img.src,
        currentSrc: img.currentSrc,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        width: img.width,
        height: img.height,
        loading: img.loading,
        className: img.className,
        outerHTML: img.outerHTML
      }));
      
      console.log(`IMAGE ${i + 1}:`);
      console.log(`   alt: ${details.alt}`);
      console.log(`   src attribute: ${details.src}`);
      console.log(`   currentSrc: ${details.currentSrc}`);
      console.log(`   complete: ${details.complete}`);
      console.log(`   naturalWidth x naturalHeight: ${details.naturalWidth} x ${details.naturalHeight}`);
      console.log(`   displayed width x height: ${details.width} x ${details.height}`);
      console.log(`   loading: ${details.loading}`);
      console.log(`   className: ${details.className}`);
      console.log(`   outerHTML: ${details.outerHTML.substring(0, 200)}`);
      console.log('');
    }
    
    // Tester l'accès direct à une image
    console.log('\n🌐 TEST D\'ACCÈS DIRECT AUX IMAGES:\n');
    const testURLs = [
      'http://localhost:3001/landing/innovation/analytics.png',
      '/landing/innovation/analytics.png'
    ];
    
    for (const url of testURLs) {
      try {
        const response = await page.goto(url, { timeout: 5000 });
        console.log(`   ${url}: ${response.status()} ${response.statusText()}`);
        console.log(`   Content-Type: ${response.headers()['content-type']}`);
      } catch (error) {
        console.log(`   ${url}: ❌ ${error.message}`);
      }
    }

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
  } finally {
    await browser.close();
  }
}

inspectHTML();
