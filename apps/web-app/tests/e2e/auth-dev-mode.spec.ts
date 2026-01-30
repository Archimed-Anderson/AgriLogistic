import { test, expect } from '@playwright/test';

test.describe('Authentication - Dev Mode / Quick Access', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login as Admin via dev mode button', async ({ page }) => {
    // Click the Admin dev button
    const adminButton = page.getByRole('button', { name: "Se connecter en tant qu'ADMIN", exact: true });
    await expect(adminButton).toBeVisible();
    await adminButton.click();

    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/.*\/admin\/dashboard/, { timeout: 15000 });
    await expect(page.getByText('Tableau de Bord')).toBeVisible();
  });

  test('should login as Farmer via dev mode button', async ({ page }) => {
    const farmerButton = page.getByRole('button', { name: "Se connecter en tant qu'AGRICULTEUR", exact: true });
    await expect(farmerButton).toBeVisible();
    await farmerButton.click();

    // Should redirect to farmer dashboard (using the path defined in context)
    await expect(page).toHaveURL(/.*\/dashboard\/farmer/, { timeout: 15000 });
  });

  test('should persist authentication after reload', async ({ page, isMobile }) => {
    if (isMobile) test.skip();
    
    await page.getByRole('button', { name: "Se connecter en tant qu'ADMIN", exact: true }).click();
    await expect(page).toHaveURL(/.*\/admin\/dashboard/, { timeout: 15000 });
    
    // Small wait to ensure cookies are settled
    await page.waitForTimeout(1000);
    
    // Reload page
    await page.reload({ waitUntil: 'networkidle' });
    
    // Should still be on dashboard and authenticated
    await expect(page.getByText('Tableau de Bord')).toBeVisible({ timeout: 15000 });
  });

  test('should logout correctly', async ({ page, isMobile }) => {
    if (isMobile) test.skip();
    
    await page.getByRole('button', { name: "Se connecter en tant qu'ADMIN", exact: true }).click();
    await expect(page).toHaveURL(/.*\/admin\/dashboard/, { timeout: 15000 });

    // Ensure sidebar is visible and find logout button
    const logoutButton = page.locator('button:has-text("Déconnexion")');
    await expect(logoutButton).toBeVisible({ timeout: 10000 });
    await logoutButton.click();

    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
  });
});
