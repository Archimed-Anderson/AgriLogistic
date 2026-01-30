import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the admin dashboard
    await page.goto('/admin/dashboard', { waitUntil: 'load' });
  });

  test('should render the admin layout with sidebar (on desktop)', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }

    // Check for the sidebar by checking for unique text in it
    // Wait for the sidebar text to appear
    await expect(page.getByText('Menu Principal')).toBeVisible({ timeout: 15000 });

    // Check for the navbar
    const navbar = page.locator('header');
    await expect(navbar).toBeVisible();
  });

  test('should display dashboard KPIs and title', async ({ page }) => {
    // Check for the main title
    await expect(page.getByText('Tableau de Bord')).toBeVisible({ timeout: 15000 });

    // Check for some KPI labels
    await expect(page.getByText('Utilisateurs Actifs')).toBeVisible();
  });

  test('should navigate to different admin modules via sidebar (on desktop)', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }

    // Click on "Sol & Eau" link in the sidebar
    // Sometimes getByRole fails with complex link content, so we use getByText inside the sidebar
    const sidebar = page.locator('div.bg-slate-900');
    await sidebar.getByText('Sol & Eau').click();

    // Verify navigation to the correct URL
    await expect(page).toHaveURL(/.*\/admin\/soil-water/);

    // Verify placeholder content
    await expect(page.getByText('Sol & Eau', { exact: true }).first()).toBeVisible();
  });

  test('should navigate to settings page (on desktop)', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }

    const sidebar = page.locator('div.bg-slate-900');
    await sidebar.getByText('Paramètres').click();

    // Verify URL
    await expect(page).toHaveURL(/.*\/admin\/settings/);

    // Verify settings content
    await expect(page.getByText('Paramètres', { exact: true }).first()).toBeVisible();
  });

  test('should redirect /admin to /admin/dashboard', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
  });

  test('logo in sidebar should link back to homepage (on desktop)', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
    }
    
    // The logo link contains "AgriLogisticAdmin"
    const logoLink = page.locator('a').filter({ hasText: 'AgriLogistic' }).first();
    await expect(logoLink).toHaveAttribute('href', '/');
    
    await logoLink.click();
    await expect(page).toHaveURL('/');
  });
});


