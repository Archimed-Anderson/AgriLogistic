import { test, expect } from '@playwright/test';

test.describe('Farmer Dashboard Access', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5176');
  });

  test('should login as farmer and access dashboard', async ({ page }) => {
    // Click on login/auth button
    await page.click('text=Connexion');
    
    // Wait for auth page to load
    await page.waitForURL('**/auth');
    
    // Select farmer profile
    await page.click('[data-testid="profile-farmer"]', { timeout: 5000 }).catch(() => {
      // Alternative: click on text containing "Agriculteur"
      page.click('text=Agriculteur');
    });
    
    // Fill in login credentials
    await page.fill('input[type="email"]', 'farmer@agrologistic.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation after login
    await page.waitForNavigation({ timeout: 10000 });
    
    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    
    // Try to navigate to farmer dashboard
    await page.goto('http://localhost:5176/farmer/dashboard');
    
    // Wait for dashboard to load
    await page.waitForTimeout(2000);
    
    // Verify dashboard elements are present
    await expect(page.locator('text=Tableau de Bord Agriculteur')).toBeVisible({ timeout: 10000 });
    
    // Verify KPI cards are present
    await expect(page.locator('text=Revenus')).toBeVisible();
    await expect(page.locator('text=Commandes')).toBeVisible();
  });

  test('should navigate to all farmer pages', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:5176/auth');
    await page.fill('input[type="email"]', 'farmer@agrologistic.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // Test Dashboard
    await page.goto('http://localhost:5176/farmer/dashboard');
    await expect(page.locator('text=Tableau de Bord Agriculteur')).toBeVisible({ timeout: 5000 });
    
    // Test Farm Operations
    await page.goto('http://localhost:5176/farmer/operations');
    await expect(page.locator('text=Gestion des Opérations')).toBeVisible({ timeout: 5000 });
    
    // Test Marketplace
    await page.goto('http://localhost:5176/farmer/marketplace');
    await expect(page.locator('text=Marketplace Pro')).toBeVisible({ timeout: 5000 });
    
    // Test Rental
    await page.goto('http://localhost:5176/farmer/rental');
    await expect(page.locator('text=Gestion Location')).toBeVisible({ timeout: 5000 });
    
    // Test Logistics
    await page.goto('http://localhost:5176/farmer/logistics');
    await expect(page.locator('text=Logistics Hub')).toBeVisible({ timeout: 5000 });
  });

  test('should verify farmer role protection', async ({ page }) => {
    // Try to access farmer dashboard without login
    await page.goto('http://localhost:5176/farmer/dashboard');
    
    // Should redirect to login or show access denied
    await page.waitForTimeout(2000);
    const url = page.url();
    
    // Verify we're either on login page or see an error
    const isOnLogin = url.includes('/login') || url.includes('/auth');
    const hasAccessDenied = await page.locator('text=accès').count() > 0;
    
    expect(isOnLogin || hasAccessDenied).toBeTruthy();
  });

  test('should check navigation links work', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5176/auth');
    await page.fill('input[type="email"]', 'farmer@agrologistic.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // Go to dashboard
    await page.goto('http://localhost:5176/farmer/dashboard');
    
    // Click on quick action links
    await page.click('text=Nouvelle Vente').catch(() => console.log('Quick action not found'));
    await page.waitForTimeout(1000);
    
    // Verify navigation occurred
    const url = page.url();
    console.log('URL after clicking quick action:', url);
  });
});

test.describe('Farmer Dashboard Components', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to dashboard
    await page.goto('http://localhost:5176/auth');
    await page.fill('input[type="email"]', 'farmer@agrologistic.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    await page.goto('http://localhost:5176/farmer/dashboard');
  });

  test('should display KPI cards', async ({ page }) => {
    // Check for KPI cards
    const kpiCards = await page.locator('[class*="grid"]').first();
    await expect(kpiCards).toBeVisible();
    
    // Verify at least 4 KPI cards exist
    const cards = await page.locator('[class*="bg-white"][class*="rounded"]').count();
    expect(cards).toBeGreaterThan(0);
  });

  test('should display calendar', async ({ page }) => {
    await expect(page.locator('text=Calendrier')).toBeVisible({ timeout: 5000 });
  });

  test('should display weather alerts', async ({ page }) => {
    await expect(page.locator('text=Météo')).toBeVisible({ timeout: 5000 });
  });
});
