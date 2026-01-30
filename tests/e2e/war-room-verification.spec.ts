import { test, expect, type Page } from '@playwright/test';

async function dismissConsentBanner(page: Page) {
  const banner = page.locator('text=/Cookies & mesure d\\x27audience|Cookies & mesure d’audience/i').first();
  if (await banner.count()) {
    const refuse = page.getByRole('button', { name: /Refuser/i }).first();
    if (await refuse.isVisible().catch(() => false)) {
      await refuse.click({ timeout: 5000, force: true });
    }
  }
}

async function loginAsAdmin(page: Page) {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('accessToken', `mock-jwt-token-admin-001-${Date.now()}`);
  });

  await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
  await dismissConsentBanner(page);
}

test.describe('War Room Dashboard Verification', () => {
  test('should display the new futuristic War Room dashboard for admin', async ({ page }) => {
    await loginAsAdmin(page);

    // Verify Title
    await expect(page.getByText('Console de Commandement')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('v2.1.0-STABLE', { exact: true }).first()).toBeVisible();

    // Verify Tabs are present
    await expect(page.getByRole('tab', { name: /Vue d'ensemble/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Logistique/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Santé Système/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Terminal/i })).toBeVisible();

    // Verify Overview Content (Default Tab)
    await expect(page.getByText('Revenus (Global)')).toBeVisible();
    await expect(page.getByText('Avg Latency')).toBeVisible();
    
    // Switch to Logistics Tab
    await page.getByRole('tab', { name: /Logistique/i }).click();
    await expect(page.getByRole('heading', { name: 'Flux Logistiques' })).toBeVisible();
    
    // Switch to Health Tab
    await page.getByRole('tab', { name: /Santé Système/i }).click();
    await expect(page.getByText('Service Mesh Interaction Graph')).toBeVisible();
    await expect(page.getByText('API Gateway')).toBeVisible();
    
    // Verify Live indicator in health tab or overview
    await expect(page.locator('.bg-emerald-500.animate-pulse')).toBeVisible();
  });

  test('admin console should react to help command', async ({ page }) => {
    await loginAsAdmin(page);

    // Switch to Terminal Tab to see the console properly
    await page.getByRole('tab', { name: /Terminal/i }).click();

    const consoleInput = page.getByLabel('Admin command input');
    await expect(consoleInput).toBeVisible();

    await consoleInput.fill('help');
    await consoleInput.press('Enter');

    await expect(page.getByText('Available commands: help, status, clear, restart [svc], whoami')).toBeVisible();
  });
});
