import { test, expect } from '@playwright/test';

test.describe('Modern Auth Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to auth page
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
  });

  test('should display login form by default', async ({ page }) => {
    // Check that login form is visible
    await expect(page.locator('text=Bienvenue sur AgriLogistic')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Se connecter")')).toBeVisible();
  });

  test('should switch to register form', async ({ page }) => {
    // Click on inscription button
    await page.click('button:has-text("Inscription")');
    
    // Wait for transition
    await page.waitForTimeout(300);
    
    // Check that register form is visible
    await expect(page.locator('text=Créer un compte')).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
  });

  test('should validate email format in real-time', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    
    // Enter invalid email
    await emailInput.fill('invalid-email');
    await emailInput.blur();
    
    // Check for error message
    await expect(page.locator('text=/Format d\'email invalide/i')).toBeVisible();
    
    // Enter valid email
    await emailInput.fill('test@example.com');
    await emailInput.blur();
    
    // Error should disappear
    await expect(page.locator('text=/Format d\'email invalide/i')).not.toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first();
    const toggleButton = page.locator('button[aria-label*="mot de passe"]').first();
    
    await passwordInput.fill('testpassword');
    
    // Password should be hidden
    expect(await passwordInput.getAttribute('type')).toBe('password');
    
    // Click toggle
    await toggleButton.click();
    
    // Password should be visible
    expect(await passwordInput.getAttribute('type')).toBe('text');
  });

  test('should show password strength indicator', async ({ page }) => {
    // Switch to register form
    await page.click('button:has-text("Inscription")');
    await page.waitForTimeout(300);
    
    const passwordInput = page.locator('input[name="password"]');
    
    // Enter weak password
    await passwordInput.fill('weak');
    
    // Check for strength indicator
    await expect(page.locator('text=/Force du mot de passe/i')).toBeVisible();
    await expect(page.locator('text=/Faible/i')).toBeVisible();
    
    // Enter strong password
    await passwordInput.fill('StrongPassword123!');
    
    // Check for improved strength
    await expect(page.locator('text=/Excellent/i')).toBeVisible();
  });

  test('should validate password confirmation match', async ({ page }) => {
    // Switch to register form
    await page.click('button:has-text("Inscription")');
    await page.waitForTimeout(300);
    
    const passwordInput = page.locator('input[name="password"]');
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    
    await passwordInput.fill('Password123!');
    await confirmPasswordInput.fill('Different123!');
    await confirmPasswordInput.blur();
    
    // Check for mismatch error
    await expect(page.locator('text=/ne correspondent pas/i')).toBeVisible();
    
    // Fix confirmation
    await confirmPasswordInput.fill('Password123!');
    await confirmPasswordInput.blur();
    
    // Error should disappear
    await expect(page.locator('text=/ne correspondent pas/i')).not.toBeVisible();
  });

  test('should show validation icons for fields', async ({ page }) => {
    // Switch to register form
    await page.click('button:has-text("Inscription")');
    await page.waitForTimeout(300);
    
    const firstNameInput = page.locator('input[name="firstName"]');
    
    // Enter invalid value
    await firstNameInput.fill('A');
    await firstNameInput.blur();
    
    // Should show error icon
    await expect(page.locator('svg[class*="XCircle"]').first()).toBeVisible();
    
    // Enter valid value
    await firstNameInput.fill('Jean');
    await firstNameInput.blur();
    
    // Should show success icon
    await expect(page.locator('svg[class*="CheckCircle"]').first()).toBeVisible();
  });

  test('should handle login with valid credentials', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button:has-text("Se connecter")');
    
    // Fill form
    await emailInput.fill('admintest@gmail.com');
    await passwordInput.fill('Admin123');
    
    // Submit
    await submitButton.click();
    
    // Should redirect to dashboard
    await page.waitForURL(/\/admin\/overview|\/customer\/overview/, { timeout: 10000 });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button:has-text("Se connecter")');
    
    // Fill form with invalid credentials
    await emailInput.fill('invalid@example.com');
    await passwordInput.fill('wrongpassword');
    
    // Submit
    await submitButton.click();
    
    // Should show error message
    await expect(page.locator('text=/incorrect|erreur/i')).toBeVisible({ timeout: 5000 });
  });

  test('should remember email with "Se souvenir de moi"', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]').first();
    const rememberCheckbox = page.locator('input[type="checkbox"][id="remember"]');
    const submitButton = page.locator('button:has-text("Se connecter")');
    
    // Fill form and check remember me
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    await rememberCheckbox.check();
    
    // Note: Actual login test would require valid credentials
    // This test verifies the checkbox functionality
    expect(await rememberCheckbox.isChecked()).toBe(true);
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab'); // Email input
    await expect(page.locator('input[type="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Password input
    await expect(page.locator('input[type="password"]').first()).toBeFocused();
    
    await page.keyboard.press('Tab'); // Remember me checkbox
    await expect(page.locator('input[type="checkbox"][id="remember"]')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Submit button
    await expect(page.locator('button:has-text("Se connecter")')).toBeFocused();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that form is still visible and usable
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Se connecter")')).toBeVisible();
    
    // Check that toggle buttons are accessible
    await expect(page.locator('button:has-text("Connexion")')).toBeVisible();
    await expect(page.locator('button:has-text("Inscription")')).toBeVisible();
  });
});


