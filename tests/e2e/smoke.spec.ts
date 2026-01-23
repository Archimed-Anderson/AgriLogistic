import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('app loads and shows login entry point', async ({ page }) => {
    await page.goto('/');

    // App should render something stable without backend (mock auth in webServer).
    // We keep selectors broad to avoid fragile UI coupling.
    await expect(page).toHaveTitle(/Agro/i);

    // Common login entry points in this app.
    await expect(
      page.getByRole('button', { name: /se connecter|connexion|login/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });
});

