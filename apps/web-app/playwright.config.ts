import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E — Auth, Login, Dashboards, etc.
 * Fichiers de test : tests/ (récursif) *.spec.ts, ex. tests/e2e/*.spec.ts
 * Lancer : pnpm test:e2e
 */
export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.(ts|js)/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30000,

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm run dev',
    url: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
