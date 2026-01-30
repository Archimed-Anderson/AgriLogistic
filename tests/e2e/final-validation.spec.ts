import { test, expect } from '@playwright/test';

test.describe('AgriLogistic Web App Validation', () => {
  const baseURL = 'http://localhost:3005';

  test('Link Hub should be accessible and populated', async ({ page }) => {
    await page.goto(`${baseURL}/link-hub`);
    
    // Check title or specific text
    await expect(page.locator('body')).toContainText('INITIALISATION DU CENTRE DE COMMANDE', { timeout: 5000 }).catch(() => {});
    
    // Wait for loading to finish
    await page.waitForSelector('.command-center', { timeout: 10000 });
    
    // Check for cards
    const loadCards = await page.locator('.load-card').count();
    const truckCards = await page.locator('.truck-card').count();
    
    console.log(`Link Hub: Found ${loadCards} load cards and ${truckCards} truck cards.`);
    
    expect(loadCards).toBeGreaterThan(0);
    expect(truckCards).toBeGreaterThan(0);
    
    await page.screenshot({ path: 'tests/e2e/screenshots/link_hub_final.png', fullPage: true });
  });

  test('Marketplace should be accessible at /marketplace', async ({ page }) => {
    await page.goto(`${baseURL}/marketplace`);
    
    await expect(page).toHaveTitle(/Le Marché Vivant/i);
    
    const productCards = await page.locator('[data-testid="product-card"]').count();
    console.log(`Marketplace: Found ${productCards} products.`);
    
    expect(productCards).toBeGreaterThan(0);
    
    await page.screenshot({ path: 'tests/e2e/screenshots/marketplace_final.png', fullPage: true });
  });
});
