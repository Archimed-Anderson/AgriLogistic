import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard E2E', () => {

  test('Admin Login and War Room Access', async ({ page }) => {
    // 1. Intercept and mock the Login API to return an Admin user
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'mock-admin-token',
          user: {
            id: 'admin-1',
            email: 'admin@agrodeep.com',
            role: 'admin',
            name: 'Super Admin'
          }
        })
      });
    });

    // 2. Navigate to Login Page
    await page.goto('/login');

    // 3. Click Admin Quick Access (Direct login in dev/mock mode)
    await page.getByRole('button', { name: "Se connecter en tant qu'ADMIN" }).click();

    // 5. Verify Redirection to Admin Dashboard
    // We expect the URL to switch to something under /admin
    await expect(page).toHaveURL(/\/admin/, { timeout: 15000 });

    // 6. Verify Sidebar contains "War Room"
    // We look for a link or text in the sidebar navigation
    const warRoomLink = page.getByRole('link', { name: /war room/i }).first();
    await expect(warRoomLink).toBeVisible();

    // 7. Navigate to War Room
    await warRoomLink.click();
    
    // Verify URL
    await expect(page).toHaveURL(/.*\/admin\/war-room/);

    // 8. Verify War Room Content
    // Check for the main title
    await expect(page.getByRole('heading', { name: /war room/i }).first()).toBeVisible();
    
    // Check for "Active Threats" or "Critical Alerts" to ensure widgets loaded
    // (Based on common War Room designs)
    // We'll look for generic critical indicators usually present
    await expect(page.getByText('Incidents active')).toBeVisible();
    await expect(page.getByText('War Room Alpha')).toBeVisible();

    // 9. Take Screenshot
    // Ensure directory exists or let playwright handle it. Playwright usually creates directories.
    await page.screenshot({ path: 'tests/e2e/screenshots/admin-war-room.png', fullPage: true });
  });
});
