import { test, expect } from '@playwright/test';

const PORTS = [3000, 3003, 5173];
const ROUTES = ['/link-hub', '/admin/link-monitor', '/solutions/marketplace'];

for (const port of PORTS) {
  for (const route of ROUTES) {
    test(`Check ${route} on port ${port}`, async ({ page }) => {
      const url = `http://localhost:${port}${route}`;
      console.log(`Checking ${url}...`);
      
      try {
        const response = await page.goto(url, { timeout: 10000 });
        console.log(`Response status for ${url}: ${response?.status()}`);
        
        // Wait for potential loading state
        await page.waitForTimeout(2000);
        
        const title = await page.title();
        console.log(`Page title for ${url}: ${title}`);
        
        const bodyContent = await page.evaluate(() => document.body.innerText);
        console.log(`Body text length for ${url}: ${bodyContent.length}`);
        
        await page.screenshot({ path: `tests/e2e/screenshots/discovery_${port}_${route.replace(/\//g, '_')}.png`, fullPage: true });
        
        if (response?.status() === 200) {
          console.log(`FOUND ACTIVE PAGE AT ${url}`);
          // Check for "empty" state (missing cards)
          const cardsCount = await page.locator('.load-card, .truck-card, .product-card').count();
          console.log(`Found ${cardsCount} data cards at ${url}`);
        }
      } catch (err) {
        console.log(`Failed to reach ${url}: ${err.message}`);
      }
    });
  }
}
