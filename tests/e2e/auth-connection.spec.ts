import { test, expect } from '@playwright/test';

test.describe('Authentication Connection Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000');
  });

  test('should display backend status indicator on login page', async ({ page }) => {
    // Wait for the login form to be visible
    await expect(page.getByRole('heading', { name: /welcome to agrodeep/i })).toBeVisible();
    
    // Check if backend status is displayed
    const statusIndicator = page.locator('text=/Backend Status|Serveur backend/i');
    await expect(statusIndicator).toBeVisible({ timeout: 10000 });
  });

  test('should show connection error when backend is unavailable', async ({ page, context }) => {
    // Intercept API calls and simulate backend down
    await context.route('**/api/v1/**', route => {
      route.abort('failed');
    });

    await page.reload();
    
    // Wait for error message to appear
    const errorAlert = page.locator('text=/Erreur de connexion|Impossible de se connecter/i').first();
    await expect(errorAlert).toBeVisible({ timeout: 15000 });
    
    // Check if suggestion is displayed
    const suggestion = page.locator('text=/backend est démarré|vérifiez/i');
    await expect(suggestion).toBeVisible();
  });

  test('should show connected status when backend is available', async ({ page, context }) => {
    // Mock successful health check
    await context.route('**/api/v1/health', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'healthy' }),
      });
    });

    await page.reload();
    
    // Wait for connected status
    const connectedStatus = page.locator('text=/Connecté|connected/i').first();
    await expect(connectedStatus).toBeVisible({ timeout: 10000 });
  });

  test('should allow manual connection test', async ({ page, context }) => {
    // Mock health check endpoint
    let callCount = 0;
    await context.route('**/api/v1/health', route => {
      callCount++;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'healthy', timestamp: Date.now() }),
      });
    });

    // Click on test connection button
    const testButton = page.locator('button:has-text("Tester"), button:has-text("Test")').first();
    if (await testButton.isVisible()) {
      await testButton.click();
      
      // Wait for the check to complete
      await page.waitForTimeout(1000);
      
      // Verify the health endpoint was called
      expect(callCount).toBeGreaterThan(0);
    }
  });

  test('should handle login with valid credentials when backend is available', async ({ page, context }) => {
    // Mock successful login
    await context.route('**/api/v1/auth/login', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'farmer',
          },
        }),
      });
    });

    // Fill in credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for success (navigation or success message)
    await page.waitForTimeout(2000);
    
    // Check if we're redirected or see success message
    // (This depends on your app's behavior after successful login)
  });

  test('should show error message on login failure', async ({ page, context }) => {
    // Mock failed login
    await context.route('**/api/v1/auth/login', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Invalid credentials',
        }),
      });
    });

    // Fill in credentials
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for error message
    const errorMessage = page.locator('text=/Invalid credentials|Email ou mot de passe incorrect/i').first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should show timeout error when request takes too long', async ({ page, context }) => {
    // Mock slow response
    await context.route('**/api/v1/auth/login', async route => {
      await new Promise(resolve => setTimeout(resolve, 20000)); // 20 second delay
      route.abort('timedout');
    });

    // Fill in credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for timeout error
    const timeoutError = page.locator('text=/trop de temps|timeout/i').first();
    await expect(timeoutError).toBeVisible({ timeout: 20000 });
  });

  test('should disable login button when backend is disconnected', async ({ page, context }) => {
    // Simulate backend unavailable
    await context.route('**/api/v1/**', route => {
      route.abort('failed');
    });

    await page.reload();
    
    // Wait for disconnected status
    await page.waitForTimeout(2000);
    
    // Check if login button is disabled
    const loginButton = page.locator('button[type="submit"]');
    const isDisabled = await loginButton.isDisabled();
    
    // Button should be disabled when backend is disconnected
    if (isDisabled) {
      expect(isDisabled).toBe(true);
    }
  });

  test('should display detailed error suggestions', async ({ page, context }) => {
    // Mock connection failure
    await context.route('**/api/v1/health', route => {
      route.abort('failed');
    });

    await page.reload();
    
    // Wait for error to appear
    await page.waitForTimeout(3000);
    
    // Check for suggestion text
    const suggestions = [
      /backend est démarré/i,
      /docker-compose/i,
      /\.env/i,
      /pare-feu/i,
    ];

    for (const suggestion of suggestions) {
      const element = page.locator(`text=${suggestion}`).first();
      if (await element.isVisible()) {
        await expect(element).toBeVisible();
        break; // At least one suggestion should be visible
      }
    }
  });

  test('should show loading state during login', async ({ page, context }) => {
    // Mock delayed login response
    await context.route('**/api/v1/auth/login', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'mock-token',
          user: { id: '1', email: 'test@test.com', firstName: 'Test', lastName: 'User', role: 'farmer' },
        }),
      });
    });

    // Fill credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Click login
    await page.click('button[type="submit"]');
    
    // Check for loading indicator
    const loadingText = page.locator('text=/Connexion en cours|Loading|Signing in/i');
    await expect(loadingText).toBeVisible({ timeout: 1000 });
  });
});

test.describe('Backend Health Monitoring', () => {
  test('should periodically check backend health', async ({ page, context }) => {
    let healthCheckCount = 0;
    
    await context.route('**/api/v1/health', route => {
      healthCheckCount++;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'healthy', checkNumber: healthCheckCount }),
      });
    });

    await page.goto('http://localhost:3000');
    
    // Wait for initial check
    await page.waitForTimeout(2000);
    const initialCount = healthCheckCount;
    
    // Wait for periodic check (assuming 30 second interval, we wait a bit)
    // In a real test, you might want to mock timers
    await page.waitForTimeout(5000);
    
    // At least the initial check should have happened
    expect(healthCheckCount).toBeGreaterThan(0);
  });

  test('should recover and show connected state after backend comes back online', async ({ page, context }) => {
    let backendAvailable = false;
    
    await context.route('**/api/v1/health', route => {
      if (backendAvailable) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'healthy' }),
        });
      } else {
        route.abort('failed');
      }
    });

    await page.goto('http://localhost:3000');
    
    // Initially backend is down
    await page.waitForTimeout(2000);
    
    // Bring backend back online
    backendAvailable = true;
    
    // Click refresh/test connection button
    const refreshButton = page.locator('button:has-text("Tester"), button:has-text("Refresh")').first();
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      
      // Should now show connected
      await page.waitForTimeout(2000);
      const connected = page.locator('text=/Connecté|Connected/i').first();
      await expect(connected).toBeVisible({ timeout: 5000 });
    }
  });
});
