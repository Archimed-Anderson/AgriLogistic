import { test, expect } from '@playwright/test';

test.describe('AgriLogistic Link Hub Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Link Hub page
    await page.goto('http://localhost:3020/link-hub');
  });

  test('should load the Link Hub page', async ({ page }) => {
    // Check if the title is present - targeting specifically the main page title
    await expect(page.locator('main h1').first()).toContainText('AgriLogistic Link');
    
    // Check for the map container
    await expect(page.locator('.map-wrapper, .map-container')).toBeVisible(); 
  });

  test('should display active loads in the sidebar', async ({ page, isMobile }) => {
    if (isMobile) test.skip(true, 'Sidebars are hidden on mobile');

    // Check if the sidebar header for loads is present - use class selectors from legacy CSS
    await expect(page.locator('aside.left-sidebar h2')).toContainText('Requêtes Actives');
    
    // Check if at least one load card is visible (wait for loading)
    await page.waitForTimeout(4000); // Wait for simulation loading
    const loadCards = page.locator('.load-card-premium');
    await expect(loadCards.first()).toBeVisible();
  });

  test('should display transporters in the right sidebar', async ({ page, isMobile }) => {
    if (isMobile) test.skip(true, 'Sidebars are hidden on mobile');

    // Check if the sidebar header for trucks is present
    await expect(page.locator('aside.right-sidebar h2')).toContainText('Transporteurs');
    
    // Check if at least one truck badge is visible
    const truckBadges = page.locator('.truck-badge-premium');
    await expect(truckBadges.first()).toBeVisible();
  });
});

test.describe('Marketplace Validation', () => {
  test('should navigate to marketplace from Navbar', async ({ page, isMobile }) => {
    if (isMobile) test.skip(true, 'Mobile navigation flow distinct');

    await page.goto('http://localhost:3020/');
    
    // Desktop: Click "Produits" trigger first
    await page.getByRole('button', { name: /Produits/i }).click();
    
    // Find the marketplace link in the dropdown
    const marketplaceLink = page.getByRole('link', { name: /AgroMarket/i });
    await marketplaceLink.click();
    
    // Verify URL
    await expect(page).toHaveURL(/.*marketplace/);
    
    // Check if marketplace content is present
    await expect(page.locator('h1')).toContainText(/Le Marché Vivant/i);
  });
});
