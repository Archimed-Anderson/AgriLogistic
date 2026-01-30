import { test, expect, type Page } from '@playwright/test';

async function dismissConsentBanner(page: Page) {
  const banner = page.locator('text=/Cookies & mesure d\\x27audience|Cookies & mesure d'audience/i').first();
  if (await banner.count()) {
    const refuse = page.getByRole('button', { name: /Refuser/i }).first();
    if (await refuse.isVisible().catch(() => false)) {
      await refuse.click({ timeout: 5000, force: true });
    }
  }
}

async function loginAsAdmin(page: Page) {
  const adminId = 'admin-001'; // From mock-auth.adapter.ts
  const token = `mock-jwt-token-${adminId}-${Date.now()}`;
  
  await page.addInitScript((t) => {
    window.localStorage.setItem('accessToken', t);
  }, token);

  const url = '/admin/dashboard';
  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Wait for the animation to settle
  await page.waitForTimeout(1000);
  await dismissConsentBanner(page);
}

test.describe('Admin Modernization Full Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('Module 1: Overview Dashboard Validation', async ({ page }) => {
    // Wait for any specific dashboard element to be sure we are there
    await page.waitForSelector('h1:has-text("Console")', { timeout: 15000 });
    
    console.log('[E2E] Page content snippet:', (await page.content()).substring(0, 1000));
    
    // Check KPIs using more specific locators
    await expect(page.locator('p:has-text("Revenus")')).toBeVisible();
    await expect(page.locator('p:has-text("Transactions")')).toBeVisible();
    await expect(page.locator('p:has-text("Utilisateurs Actifs")')).toBeVisible();
    
    // Check Activity Timeline
    await expect(page.locator('h3:has-text("Flux d\'Activité")')).toBeVisible();
  });

  test('Module 2: Logistics Dashboard Validation', async ({ page }) => {
    await page.getByRole('tab', { name: /Logistique/i }).click();
    
    await expect(page.getByText(/Centre d'Opérations Flotte/i)).toBeVisible();
    await expect(page.getByText(/Véhicules en temps réel/i)).toBeVisible();
    
    // Verify View Toggle
    await expect(page.getByRole('button', { name: /Carte/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Flotte/i })).toBeVisible();
    
    // Switch to Fleet view
    await page.getByRole('button', { name: /Flotte/i }).click();
    await expect(page.getByText(/ID VÉHICULE/i)).toBeVisible();
  });

  test('Module 3: Health Monitoring Validation', async ({ page }) => {
    await page.getByRole('tab', { name: /Santé Système/i }).click();
    
    await expect(page.getByText(/Console de Commandement/i)).toBeVisible();
    await expect(page.getByText(/Charge CPU/i)).toBeVisible();
    
    // Check Process Monitor
    await expect(page.getByText(/Moniteur de Processus/i)).toBeVisible();
    await expect(page.getByText(/AgriLogistic-api/i)).toBeVisible();
    
    // Check Disk Analysis
    await expect(page.getByText(/Analyseur de Stockage/i)).toBeVisible();
  });

  test('Module 4: User Governance & Impersonation', async ({ page }) => {
    await page.goto('/admin/users', { waitUntil: 'networkidle' });
    
    await expect(page.getByText(/Gestion des Utilisateurs/i)).toBeVisible();
    await expect(page.getByText(/Répertoire Gouvernance/i)).toBeVisible();
    
    // Test Search
    const searchInput = page.getByPlaceholder(/Rechercher un utilisateur/i);
    await searchInput.fill('Sophie');
    await expect(page.getByText(/Sophie Leroy/i)).toBeVisible();
    
    // Test Role Manager Dialog
    await page.getByTitle(/Gérer les Permissions/i).first().click();
    await expect(page.getByText(/Gestionnaire RBAC/i)).toBeVisible();
    await page.getByRole('button', { name: /Annuler/i }).click();
    
    // Test Impersonation (God Mode)
    await page.getByTitle(/Impersonner/i).first().click();
    
    // Verify Banner
    await expect(page.getByText(/Mode Impersonation/i)).toBeVisible();
    await expect(page.getByText(/Quitter la session/i)).toBeVisible();
    
    // Exit Impersonation
    await page.getByRole('button', { name: /Quitter la session/i }).click();
    await expect(page.getByText(/Mode Impersonation/i)).not.toBeVisible();
  });

  test('Module 5: Audit Trail Validation', async ({ page }) => {
    await page.goto('/admin/users', { waitUntil: 'networkidle' });
    
    await page.getByRole('tab', { name: /Journal d'Audit/i }).click();
    await expect(page.getByText(/Journal d'Audit Système/i)).toBeVisible();
    await expect(page.getByText(/IMPERSONATE START/i)).toBeVisible();
  });

});


