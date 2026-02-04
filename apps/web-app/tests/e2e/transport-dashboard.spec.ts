import { test, expect } from '@playwright/test';

test.describe('Transport Mission Management Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page de gestion des missions
    // On suppose que l'utilisateur est déjà authentifié ou en mode dev sans auth stricte
    await page.goto('/admin/logistics/missions');
  });

  test('should display the mission orchestration header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Mission Orchestration');
  });

  test('should open the new mission wizard', async ({ page }) => {
    await page.click('button:has-text("Démarrer Nouvelle Mission")');
    // Use regex to handle potential line breaks or spacing issues
    await expect(page.locator('h2')).toContainText(/Inertia Intelligent/);
    await expect(page.locator('h2')).toContainText(/Dispatch/);
    // Be more specific about the step label
    await expect(page.locator('span:has-text("Entities & Origin")')).toBeVisible();
  });

  test('should validate mission creation wizard steps', async ({ page }) => {
    await page.click('button:has-text("Démarrer Nouvelle Mission")');

    // Step 1: Fill basic info
    // Use more robust selectors for selects in the creation overlay
    await page.selectOption('select:below(label:has-text("Expéditeur"))', { index: 1 });
    await page.selectOption('select:below(label:has-text("Destinataire"))', { index: 1 });
    await page.fill('input[placeholder*="CACAO"]', 'Test Product');
    await page.fill('input[placeholder*="25,000"]', '1000');

    await page.click('button:has-text("Confirmer & Continuer")');

    // Step 2: Driver suggestion
    await expect(page.locator('text=Recommendations Algorithmiques')).toBeVisible();
    // Wait for the specific driver name to be visible as it might be loaded dynamically
    await page.waitForSelector('text=Moussa Sylla');
    await page.click('text=Moussa Sylla');

    await page.click('button:has-text("Confirmer & Continuer")');

    // Step 3: Finalize (Audit & Finalize)
    await expect(page.locator('span:has-text("Audit & Finalize")')).toBeVisible();
    await expect(page.locator('button:has-text("Finaliser & Publier")')).toBeVisible();
  });

  test('should display mission details when a mission is selected', async ({ page }) => {
    // Attendre que les missions soient chargées (mock ou réel)
    const missionItem = page.locator('div[role="button"]').first();
    if (await missionItem.isVisible()) {
      await missionItem.click();
      await expect(page.locator('h2')).toContainText('#MS-');
      await expect(page.locator('text=Live Tracking Active')).toBeVisible();
    }
  });
});
