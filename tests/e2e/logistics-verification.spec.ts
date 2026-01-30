import { test, expect } from '@playwright/test';

test.describe('AgriLogistic Link Verification', () => {
  
  test('Landing Page has AgriLogistic Link in "Nos Logiciels"', async ({ page }) => {
    // 1. Visit Landing Page
    // Using relative path assuming baseURL is set correctly (e.g. localhost:5173 or 3000)
    // The user mentioned 3001, so if this fails we might need to adjust env params
    await page.goto('/');
    
    // Check title to ensure app loaded
    await expect(page).toHaveTitle(/Agro/i);

    // 2. Open "Nos Logiciels" dropdown
    // Finding the button by text content
    const softwareMenu = page.getByRole('button', { name: /Nos Logiciels/i });
    await expect(softwareMenu).toBeVisible();
    await softwareMenu.click(); // Click to open if it's click-triggered or hover

    // 3. Verify "AgriLogistic Link" is present and visible
    const linkItem = page.getByRole('button', { name: /AgriLogistic Link/i });
    await expect(linkItem).toBeVisible();
    
    // 4. Click it and verify navigation (it goes to /link-hub)
    await linkItem.click();
    await expect(page).toHaveURL(/\/link-hub/);
  });

  test('Admin Dashboard has AgriLogistic Link tab in Products', async ({ page }) => {
    // 1. Login as Admin
    await page.goto('/auth'); // Directly go to auth page to be sure
    
    // Check if we are already logged in (skip login if so)
    const loginButton = page.getByRole('button', { name: /Connexion|Login/i }).first();
    if (await loginButton.isVisible()) {
        // Toggle to login mode if needed (default is login usually)
        // Fill credentials
        await page.getByPlaceholder(/email/i).fill('admin@AgroLogistic.com');
        await page.getByPlaceholder(/mot de passe|password/i).fill('admin123');
        await page.getByRole('button', { name: /se connecter|sign in/i }).first().click();
    }

    // Wait for dashboard redirection
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15000 });

    // 2. Navigate to Products page
    // Using direct URL navigation to be robust
    await page.goto('/admin/products');
    
    // 3. Check for specific text indicating the page loaded
    await expect(page.getByText('Gestion des Stocks')).toBeVisible();

    // 4. Check for "AgriLogistic Link" tab
    const logisticsTab = page.getByRole('button', { name: /AgriLogistic Link/i });
    await expect(logisticsTab).toBeVisible();

    // 5. Click tab
    await logisticsTab.click();

    // 6. Verify tab content loaded (Check for KPI cards unique to that component)
    await expect(page.getByText('Chargements Actifs')).toBeVisible();
    await expect(page.getByText('Flotte Totale')).toBeVisible();
  });

});
