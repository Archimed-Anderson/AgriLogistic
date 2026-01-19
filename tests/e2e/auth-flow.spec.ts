/**
 * End-to-End Tests for Authentication Flow with Playwright
 * Tests login, registration, and error handling with actual backend
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow - E2E Tests', () => {
  const baseURL = 'http://localhost:5173';
  const apiURL = 'http://localhost:3001/api/v1';

  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
  });

  test.describe('Login Flow', () => {
    test('should open login modal', async ({ page }) => {
      // Click on "Connexion" button
      await page.click('button:has-text("Connexion")');
      
      // Wait for modal to appear
      await page.waitForSelector('[data-testid="login-modal"], .modal, [role="dialog"]', { timeout: 5000 });
      
      // Check if email and password fields are visible
      await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    });

    test('should successfully login with admin credentials', async ({ page }) => {
      // Open login modal
      await page.click('button:has-text("Connexion")');
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      // Fill in credentials
      await page.fill('input[type="email"]', 'admintest@gmail.com');
      await page.fill('input[type="password"]', 'Admin@123');
      
      // Submit login form
      await page.click('button:has-text("Se connecter"), button[type="submit"]');
      
      // Wait for success (either toast or redirect to dashboard)
      await page.waitForTimeout(2000);
      
      // Check for success indicators
      const hasSuccessToast = await page.locator('.sonner-toast, .toast').count() > 0;
      const isOnDashboard = page.url().includes('/dashboard') || page.url().includes('/admin');
      
      expect(hasSuccessToast || isOnDashboard).toBeTruthy();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      // Open login modal
      await page.click('button:has-text("Connexion")');
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      // Fill in invalid credentials
      await page.fill('input[type="email"]', 'invalid@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      
      // Submit login form
      await page.click('button:has-text("Se connecter"), button[type="submit"]');
      
      // Wait for error message
      await page.waitForTimeout(2000);
      
      // Check for error message (toast or inline)
      const errorVisible = await page.locator('text=/invalide|incorrect|erreur|failed/i').count() > 0;
      expect(errorVisible).toBeTruthy();
    });

    test('should show error for empty fields', async ({ page }) => {
      // Open login modal
      await page.click('button:has-text("Connexion")');
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      // Try to submit without filling fields
      await page.click('button:has-text("Se connecter"), button[type="submit"]');
      
      // Check for validation error
      await page.waitForTimeout(1000);
      const hasValidationError = await page.locator('[aria-invalid="true"], .error, .invalid').count() > 0;
      
      expect(hasValidationError).toBeTruthy();
    });
  });

  test.describe('Registration Flow', () => {
    test('should open registration modal', async ({ page }) => {
      // Click on "Connexion" button
      await page.click('button:has-text("Connexion")');
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      // Switch to registration mode
      await page.click('button:has-text("Inscription"), button:has-text("Créer un compte")');
      
      // Check if registration fields are visible
      await page.waitForTimeout(500);
      const emailField = await page.locator('input[type="email"]').isVisible();
      expect(emailField).toBeTruthy();
    });

    test('should successfully register a new user', async ({ page }) => {
      // Open login modal
      await page.click('button:has-text("Connexion")');
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      // Switch to registration
      await page.click('button:has-text("Inscription"), button:has-text("Créer un compte")');
      await page.waitForTimeout(500);
      
      // Generate unique email
      const timestamp = Date.now();
      const testEmail = `test-${timestamp}@example.com`;
      
      // Fill Step 1: Credentials
      await page.fill('input[type="email"]', testEmail);
      const passwordFields = await page.locator('input[type="password"]').all();
      if (passwordFields.length >= 2) {
        await passwordFields[0].fill('TestPassword123!');
        await passwordFields[1].fill('TestPassword123!');
      }
      
      // Go to next step
      await page.click('button:has-text("Suivant"), button:has-text("Continuer")');
      await page.waitForTimeout(500);
      
      // Fill Step 2: Profile
      await page.fill('input[name="firstName"], input[placeholder*="prénom" i]', 'Test');
      await page.fill('input[name="lastName"], input[placeholder*="nom" i]', 'User');
      await page.fill('input[name="phone"], input[type="tel"]', '+33612345678');
      
      // Select account type (if available)
      const buyerOption = page.locator('input[value="buyer"], button:has-text("Acheteur")');
      if (await buyerOption.count() > 0) {
        await buyerOption.first().click();
      }
      
      // Go to next step
      await page.click('button:has-text("Suivant"), button:has-text("Continuer")');
      await page.waitForTimeout(500);
      
      // Step 3: Accept terms
      const termsCheckbox = page.locator('input[type="checkbox"]').first();
      await termsCheckbox.check();
      
      // Submit registration
      await page.click('button:has-text("Créer"), button:has-text("S\'inscrire"), button[type="submit"]');
      
      // Wait for response
      await page.waitForTimeout(3000);
      
      // Check for success (toast or redirect)
      const hasSuccessIndicator = await page.locator('text=/bienvenue|success|réussi/i').count() > 0;
      expect(hasSuccessIndicator).toBeTruthy();
    });
  });

  test.describe('Network Error Handling', () => {
    test('should handle network timeout gracefully', async ({ page, context }) => {
      // Simulate slow network by setting timeout
      await context.route('**/api/v1/auth/login', async route => {
        await page.waitForTimeout(20000); // Longer than API timeout
        await route.continue();
      });

      // Open login modal
      await page.click('button:has-text("Connexion")');
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      // Fill credentials
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      
      // Submit
      await page.click('button:has-text("Se connecter")');
      
      // Wait and check for timeout error
      await page.waitForTimeout(16000);
      
      const hasTimeoutError = await page.locator('text=/timeout|délai|trop de temps/i').count() > 0;
      expect(hasTimeoutError).toBeTruthy();
    });

    test('should handle server error (500) gracefully', async ({ page, context }) => {
      // Intercept and return 500 error
      await context.route('**/api/v1/auth/login', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, error: 'Internal server error' }),
        });
      });

      // Open login modal
      await page.click('button:has-text("Connexion")');
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      // Fill credentials
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      
      // Submit
      await page.click('button:has-text("Se connecter")');
      
      // Wait for error message
      await page.waitForTimeout(2000);
      
      const hasServerError = await page.locator('text=/serveur|erreur|server/i').count() > 0;
      expect(hasServerError).toBeTruthy();
    });
  });

  test.describe('Retry Mechanism', () => {
    test('should automatically retry on temporary network failure', async ({ page, context }) => {
      let attemptCount = 0;
      
      // Fail first 2 attempts, succeed on 3rd
      await context.route('**/api/v1/auth/login', async route => {
        attemptCount++;
        if (attemptCount < 3) {
          route.abort('failed');
        } else {
          route.continue();
        }
      });

      // Open login modal
      await page.click('button:has-text("Connexion")');
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      // Fill valid credentials
      await page.fill('input[type="email"]', 'admintest@gmail.com');
      await page.fill('input[type="password"]', 'Admin@123');
      
      // Submit
      await page.click('button:has-text("Se connecter")');
      
      // Wait for retries to complete
      await page.waitForTimeout(10000);
      
      // Should eventually succeed
      expect(attemptCount).toBeGreaterThanOrEqual(3);
    });
  });

  test.describe('Multi-browser Compatibility', () => {
    test('should work on different viewports', async ({ page }) => {
      // Test on mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(baseURL);
      
      await page.click('button:has-text("Connexion")');
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      const emailVisible = await page.locator('input[type="email"]').isVisible();
      expect(emailVisible).toBeTruthy();
      
      // Test on tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      
      await page.click('button:has-text("Connexion")');
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      const emailVisibleTablet = await page.locator('input[type="email"]').isVisible();
      expect(emailVisibleTablet).toBeTruthy();
    });
  });
});
