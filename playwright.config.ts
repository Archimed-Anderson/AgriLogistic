import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests E2E
 * Documentation: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Timeout maximum par test */
  timeout: 60 * 1000,
  
  /* Timeout pour chaque assertion */
  expect: {
    timeout: 10000,
  },
  
  /* Exécuter les tests en parallèle */
  fullyParallel: true,
  
  /* Échouer le build si vous avez accidentellement laissé test.only */
  forbidOnly: !!process.env.CI,
  
  /* Réessayer sur CI uniquement */
  retries: process.env.CI ? 2 : 0,
  
  /* Nombre de workers en parallèle */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter pour les résultats de test */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  
  /* Configuration partagée pour tous les projets */
  use: {
    /* URL de base pour les tests */
    baseURL: 'http://localhost:5173',
    
    /* Collecter les traces lors de la première tentative */
    trace: 'on-first-retry',
    
    /* Capturer des screenshots en cas d'échec */
    screenshot: 'only-on-failure',
    
    /* Capturer des vidéos en cas d'échec */
    video: 'retain-on-failure',
    
    /* Timeout pour les actions */
    actionTimeout: 15000,
    
    /* Timeout pour la navigation */
    navigationTimeout: 30000,
  },

  /* Configuration des projets pour différents navigateurs */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Tests sur mobile */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Tests sur tablette */
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  /* Serveur de développement local */
  /*
  webServer: {
    // Use Mock Auth to make E2E tests fully isolated/deterministic.
    // Force port 5173 so baseURL stays stable across runs.
    command:
      process.platform === 'win32'
        ? 'cmd /c "set VITE_AUTH_PROVIDER=mock&& npm run dev -- --port 5173 --strictPort"'
        : "VITE_AUTH_PROVIDER='mock' npm run dev -- --port 5173 --strictPort",
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  */
});
