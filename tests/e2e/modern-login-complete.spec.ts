/**
 * =======================================================
 * PLAYWRIGHT E2E - Tests Complets Page Login Moderne
 * =======================================================
 * Tests exhaustifs pour valider la nouvelle page ModernAuthPage
 * - Configuration environnement isolé
 * - Tests avec identifiants admin
 * - Création et test de différents types de comptes
 * - Tests de cas limites
 * - Validation sécurité et performance
 * - Rapports détaillés
 */

import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { TEST_ACCOUNTS, INVALID_CREDENTIALS, INVALID_EMAIL_FORMATS, WEAK_PASSWORDS } from './test-data/modern-login-accounts';

// ============================================
// CONFIGURATION INITIALE
// ============================================

const BASE_URL = 'http://localhost:5173';
const TEST_RESULTS_DIR = path.join(process.cwd(), 'test-results', 'modern-login');
const SCREENSHOTS_DIR = path.join(TEST_RESULTS_DIR, 'screenshots');
const REPORTS_DIR = path.join(TEST_RESULTS_DIR, 'reports');

// Créer les dossiers nécessaires
[TEST_RESULTS_DIR, SCREENSHOTS_DIR, REPORTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Interface pour les résultats de test
interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshot?: string;
  metrics?: {
    loadTime?: number;
    responseTime?: number;
    domContentLoaded?: number;
  };
}

const testResults: TestResult[] = [];

// ============================================
// CREDENTIALS DE TEST
// ============================================

const ADMIN_CREDENTIALS = {
  email: 'admintest@gmail.com',
  password: 'Admin@123', // Essayer d'abord Admin@123, puis Admin123 en fallback
  role: 'admin',
  expectedRedirect: '/admin/overview',
};

// Les données de test sont importées depuis test-data/modern-login-accounts.ts

// ============================================
// HELPERS - Configuration et Utilitaires
// ============================================

/**
 * Créer un contexte de navigateur isolé pour chaque test
 * Note: Cette fonction est utilisée dans beforeEach mais le contexte est géré par Playwright
 */
async function setupIsolatedTest(page: Page): Promise<void> {
  // Le contexte est déjà isolé par Playwright
  // On peut ajouter des configurations spécifiques ici si nécessaire
  await page.setViewportSize({ width: 1920, height: 1080 });
}

/**
 * Nettoyer complètement l'état de l'application
 */
async function cleanupState(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    // Supprimer tous les cookies
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
  });
}

/**
 * Naviguer vers la page d'authentification moderne
 */
async function navigateToAuthPage(page: Page): Promise<void> {
  const startTime = Date.now();
  await page.goto(`${BASE_URL}/auth`, { waitUntil: 'networkidle' });
  const loadTime = Date.now() - startTime;
  
  // Attendre que la page soit complètement chargée
  await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
  await page.waitForLoadState('domcontentloaded');
  
  return;
}

/**
 * Prendre une capture d'écran avec timestamp
 */
async function takeScreenshot(page: Page, testName: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${testName.replace(/\s+/g, '-')}-${timestamp}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  
  await page.screenshot({
    path: filepath,
    fullPage: true,
  });
  
  return filepath;
}

/**
 * Mesurer les métriques de performance
 */
async function measurePerformance(page: Page): Promise<TestResult['metrics']> {
  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      loadTime: perfData.loadEventEnd - perfData.fetchStart,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      responseTime: perfData.responseEnd - perfData.requestStart,
    };
  });
  
  return metrics;
}

/**
 * Enregistrer un résultat de test
 */
function recordTestResult(result: TestResult): void {
  testResults.push(result);
}

/**
 * Générer le rapport final
 */
function generateReport(): void {
  const reportPath = path.join(REPORTS_DIR, `test-report-${Date.now()}.json`);
  const summary = {
    timestamp: new Date().toISOString(),
    total: testResults.length,
    passed: testResults.filter(r => r.status === 'passed').length,
    failed: testResults.filter(r => r.status === 'failed').length,
    skipped: testResults.filter(r => r.status === 'skipped').length,
    results: testResults,
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`\n📊 Rapport généré: ${reportPath}`);
  console.log(`✅ Passés: ${summary.passed}/${summary.total}`);
  console.log(`❌ Échoués: ${summary.failed}/${summary.total}`);
}

// ============================================
// HELPERS - Actions sur le Formulaire
// ============================================

/**
 * Remplir le formulaire de connexion
 */
async function fillLoginForm(page: Page, email: string, password: string): Promise<void> {
  // S'assurer qu'on est en mode login
  const loginButton = page.locator('button:has-text("Connexion")');
  if (await loginButton.count() > 0) {
    await loginButton.click();
    await page.waitForTimeout(200); // Attendre la transition
  }
  
  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  
  await emailInput.clear();
  await emailInput.fill(email);
  
  await passwordInput.clear();
  await passwordInput.fill(password);
}

/**
 * Soumettre le formulaire de connexion
 */
async function submitLoginForm(page: Page): Promise<void> {
  const submitButton = page.locator('button[type="submit"]:has-text("Se connecter")').first();
  await submitButton.click();
}

/**
 * Remplir le formulaire d'inscription
 */
async function fillRegisterForm(
  page: Page,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
): Promise<void> {
  // Basculer vers le mode inscription
  const registerButton = page.locator('button:has-text("Inscription")');
  if (await registerButton.count() > 0) {
    await registerButton.click();
    await page.waitForTimeout(300); // Attendre la transition
  }
  
  const firstNameInput = page.locator('input[name="firstName"]').first();
  const lastNameInput = page.locator('input[name="lastName"]').first();
  const emailInput = page.locator('input[name="email"]').first();
  const passwordInput = page.locator('input[name="password"]').first();
  const confirmPasswordInput = page.locator('input[name="confirmPassword"]').first();
  
  await firstNameInput.fill(data.firstName);
  await lastNameInput.fill(data.lastName);
  await emailInput.fill(data.email);
  await passwordInput.fill(data.password);
  await confirmPasswordInput.fill(data.confirmPassword);
}

/**
 * Soumettre le formulaire d'inscription
 */
async function submitRegisterForm(page: Page): Promise<void> {
  const submitButton = page.locator('button[type="submit"]:has-text("Créer mon compte")').first();
  await submitButton.click();
}

/**
 * Vérifier qu'on est connecté et redirigé
 */
async function verifyLoginSuccess(page: Page, expectedPath: string): Promise<void> {
  // Attendre la redirection
  await page.waitForURL(new RegExp(expectedPath), { timeout: 15000 });
  
  // Vérifier que le token est stocké
  const token = await page.evaluate(() => localStorage.getItem('accessToken'));
  expect(token).toBeTruthy();
  
  // Vérifier qu'on n'est plus sur la page de login
  expect(page.url()).not.toMatch(/\/auth|\/login/);
}

// ============================================
// SUITE DE TESTS PRINCIPALE
// ============================================

test.describe('Modern Login Page - Tests Complets', () => {
  let startTime: number;
  
  test.beforeAll(() => {
    startTime = Date.now();
    console.log('🚀 Démarrage des tests Modern Login Page');
  });
  
  test.afterAll(() => {
    const totalTime = Date.now() - startTime;
    console.log(`\n⏱️  Temps total d'exécution: ${totalTime}ms`);
    generateReport();
  });
  
  test.beforeEach(async ({ page }) => {
    // Configurer la page pour le test isolé
    await setupIsolatedTest(page);
    
    // Nettoyer l'état
    await cleanupState(page);
    
    // Naviguer vers la page d'auth
    await navigateToAuthPage(page);
  });
  
  test.afterEach(async ({ page }, testInfo) => {
    const duration = testInfo.duration || 0;
    const metrics = await measurePerformance(page);
    
    const result: TestResult = {
      testName: testInfo.title,
      status: testInfo.status === 'passed' ? 'passed' : testInfo.status === 'skipped' ? 'skipped' : 'failed',
      duration,
      metrics,
    };
    
    if (testInfo.status !== 'passed') {
      const screenshotPath = await takeScreenshot(page, testInfo.title);
      result.screenshot = screenshotPath;
      result.error = testInfo.error?.message;
    }
    
    recordTestResult(result);
  });
  
  // ============================================
  // 1. TESTS AVEC IDENTIFIANTS ADMIN
  // ============================================
  
  test.describe('Tests Admin Account', () => {
    test('1.1 - Connexion réussie avec identifiants admin', async ({ page }) => {
      // Essayer d'abord avec Admin@123, puis Admin123 si ça échoue
      let loginSuccess = false;
      
      for (const password of ['Admin@123', 'Admin123']) {
        await cleanupState(page);
        await navigateToAuthPage(page);
        
        await fillLoginForm(page, ADMIN_CREDENTIALS.email, password);
        await submitLoginForm(page);
        
        try {
          await verifyLoginSuccess(page, ADMIN_CREDENTIALS.expectedRedirect);
          loginSuccess = true;
          break;
        } catch (error) {
          // Continuer avec le prochain mot de passe
          continue;
        }
      }
      
      expect(loginSuccess).toBe(true);
      
      // Vérifier le chargement du dashboard admin
      await expect(page.locator('text=/dashboard|overview|admin/i').first()).toBeVisible({ timeout: 5000 });
      
      // Vérifier les permissions (présence d'éléments admin)
      const adminElements = page.locator('text=/admin|gestion|utilisateurs/i');
      await expect(adminElements.first()).toBeVisible({ timeout: 5000 });
    });
    
    test('1.2 - Vérification des permissions admin après connexion', async ({ page }) => {
      await fillLoginForm(page, ADMIN_CREDENTIALS.email, 'Admin123');
      await submitLoginForm(page);
      await verifyLoginSuccess(page, ADMIN_CREDENTIALS.expectedRedirect);
      
      // Vérifier l'accès aux fonctionnalités admin
      const adminFeatures = [
        /admin|gestion/i,
        /utilisateurs|users/i,
        /produits|products/i,
        /commandes|orders/i,
      ];
      
      for (const feature of adminFeatures) {
        const element = page.locator(`text=${feature}`).first();
        // Au moins un élément admin doit être visible
        const count = await element.count();
        expect(count).toBeGreaterThan(0);
      }
    });
    
    test('1.3 - Performance de connexion admin (< 2s)', async ({ page }) => {
      const startTime = Date.now();
      
      await fillLoginForm(page, ADMIN_CREDENTIALS.email, 'Admin123');
      await submitLoginForm(page);
      await verifyLoginSuccess(page, ADMIN_CREDENTIALS.expectedRedirect);
      
      const loginTime = Date.now() - startTime;
      expect(loginTime).toBeLessThan(2000);
    });
  });
  
  // ============================================
  // 2. CRÉATION ET TEST D'AUTRES COMPTES
  // ============================================
  
  test.describe('Création et Test de Comptes Utilisateurs', () => {
    test('2.1 - Créer et tester un compte buyer', async ({ page }) => {
      // Créer le compte
      const timestamp = Date.now();
      const testEmail = `buyer-${timestamp}@test.com`;
      
      await fillRegisterForm(page, {
        firstName: 'Test',
        lastName: 'Buyer',
        email: testEmail,
        password: 'Buyer123!',
        confirmPassword: 'Buyer123!',
      });
      
      await submitRegisterForm(page);
      
      // Attendre la redirection ou le message de succès
      await page.waitForTimeout(2000);
      
      // Vérifier le succès de l'inscription
      const successMessage = page.locator('text=/succès|bienvenue|créé/i');
      await expect(successMessage.first()).toBeVisible({ timeout: 10000 });
      
      // Se connecter avec le nouveau compte
      await cleanupState(page);
      await navigateToAuthPage(page);
      
      await fillLoginForm(page, testEmail, 'Buyer123!');
      await submitLoginForm(page);
      
      // Vérifier la redirection vers le dashboard buyer
      await page.waitForURL(/\/customer\/overview|\/admin\/overview/, { timeout: 15000 });
    });
    
    test('2.2 - Créer et tester un compte farmer', async ({ page }) => {
      const timestamp = Date.now();
      const testEmail = `farmer-${timestamp}@test.com`;
      
      await fillRegisterForm(page, {
        firstName: 'Test',
        lastName: 'Farmer',
        email: testEmail,
        password: 'Farmer123!',
        confirmPassword: 'Farmer123!',
      });
      
      await submitRegisterForm(page);
      await page.waitForTimeout(2000);
      
      // Vérifier le succès
      const successMessage = page.locator('text=/succès|bienvenue/i');
      await expect(successMessage.first()).toBeVisible({ timeout: 10000 });
    });
    
    test('2.3 - Test avec compte existant (buyer)', async ({ page }) => {
      // Utiliser un compte buyer existant si disponible
      const buyerEmail = TEST_ACCOUNTS.buyer.email;
      
      await fillLoginForm(page, buyerEmail, TEST_ACCOUNTS.buyer.password);
      await submitLoginForm(page);
      
      // Soit succès, soit message d'erreur approprié
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      if (currentUrl.includes('/auth') || currentUrl.includes('/login')) {
        // Vérifier qu'un message d'erreur approprié est affiché
        const errorMessage = page.locator('text=/incorrect|erreur|invalid/i');
        await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
      } else {
        // Connexion réussie
        await verifyLoginSuccess(page, TEST_ACCOUNTS.buyer.expectedRedirect);
      }
    });
  });
  
  // ============================================
  // 3. TESTS DE CAS LIMITES
  // ============================================
  
  test.describe('Tests de Cas Limites - Validation', () => {
    test('3.1 - Format email invalide', async ({ page }) => {
      for (const invalidEmail of INVALID_EMAIL_FORMATS) {
        await cleanupState(page);
        await navigateToAuthPage(page);
        
        await fillLoginForm(page, invalidEmail, 'Password123!');
        
        // Vérifier le message d'erreur en temps réel
        const errorMessage = page.locator('text=/invalide|format|email/i');
        await expect(errorMessage.first()).toBeVisible({ timeout: 2000 });
        
        // Le bouton de soumission doit être désactivé ou afficher une erreur
        const submitButton = page.locator('button[type="submit"]').first();
        const isDisabled = await submitButton.isDisabled();
        expect(isDisabled).toBe(true);
      }
    });
    
    test('3.2 - Champs vides', async ({ page }) => {
      const emptyCases = [
        { email: '', password: 'test123', description: 'Email vide' },
        { email: 'test@example.com', password: '', description: 'Mot de passe vide' },
        { email: '', password: '', description: 'Tous les champs vides' },
      ];
      
      for (const emptyCase of emptyCases) {
        await cleanupState(page);
        await navigateToAuthPage(page);
        
        await fillLoginForm(page, emptyCase.email, emptyCase.password);
        
        // Essayer de soumettre
        const submitButton = page.locator('button[type="submit"]').first();
        
        if (emptyCase.email === '' && emptyCase.password === '') {
          // Le bouton doit être désactivé
          expect(await submitButton.isDisabled()).toBe(true);
        } else {
          // Soumettre et vérifier l'erreur
          await submitButton.click();
          const errorMessage = page.locator('text=/requis|vide|obligatoire/i');
          await expect(errorMessage.first()).toBeVisible({ timeout: 3000 });
        }
      }
    });
    
    test('3.3 - Mot de passe incorrect', async ({ page }) => {
      await fillLoginForm(page, ADMIN_CREDENTIALS.email, INVALID_CREDENTIALS.wrongPassword.password);
      await submitLoginForm(page);
      
      // Attendre le message d'erreur
      const errorMessage = page.locator(`text=${INVALID_CREDENTIALS.wrongPassword.expectedError}`);
      await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
      
      // Vérifier qu'on reste sur la page de login
      expect(page.url()).toMatch(/\/auth|\/login/);
    });
    
    test('3.4 - Email incorrect', async ({ page }) => {
      await fillLoginForm(page, INVALID_CREDENTIALS.wrongEmail.email, 'Password123!');
      await submitLoginForm(page);
      
      // Attendre le message d'erreur
      const errorMessage = page.locator(`text=${INVALID_CREDENTIALS.wrongEmail.expectedError}`);
      await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
    });
  });
  
  // ============================================
  // 4. TESTS DE SÉCURITÉ
  // ============================================
  
  test.describe('Tests de Sécurité', () => {
    test('4.1 - Masquage du mot de passe par défaut', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      await passwordInput.fill('TestPassword123!');
      
      // Vérifier que le type est password
      const inputType = await passwordInput.getAttribute('type');
      expect(inputType).toBe('password');
      
      // Vérifier que la valeur n'est pas visible dans le DOM
      const value = await passwordInput.inputValue();
      expect(value).toBe('TestPassword123!'); // La valeur est là mais masquée visuellement
    });
    
    test('4.2 - Toggle visibilité mot de passe', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      const toggleButton = page.locator('button[aria-label*="mot de passe"], button[aria-label*="password"]').first();
      
      await passwordInput.fill('TestPassword123!');
      
      // Vérifier que c'est masqué
      expect(await passwordInput.getAttribute('type')).toBe('password');
      
      // Cliquer sur le toggle
      await toggleButton.click();
      
      // Vérifier que c'est visible
      expect(await passwordInput.getAttribute('type')).toBe('text');
      
      // Re-cliquer pour masquer
      await toggleButton.click();
      expect(await passwordInput.getAttribute('type')).toBe('password');
    });
    
    test('4.3 - Protection CSRF (vérification token)', async ({ page }) => {
      // Vérifier que le token CSRF est présent dans sessionStorage
      const csrfToken = await page.evaluate(() => sessionStorage.getItem('csrf_token'));
      expect(csrfToken).toBeTruthy();
      
      // Vérifier que le token est inclus dans les requêtes
      const requests: string[] = [];
      page.on('request', request => {
        if (request.url().includes('/auth/login')) {
          const headers = request.headers();
          if (headers['x-csrf-token']) {
            requests.push(headers['x-csrf-token']);
          }
        }
      });
      
      await fillLoginForm(page, ADMIN_CREDENTIALS.email, 'Admin123');
      await submitLoginForm(page);
      
      // Attendre un peu pour la requête
      await page.waitForTimeout(2000);
      
      // Le token CSRF devrait être présent dans au moins une requête
      expect(requests.length).toBeGreaterThan(0);
    });
    
    test('4.4 - Limitation des tentatives (rate limiting)', async ({ page }) => {
      // Effectuer plusieurs tentatives infructueuses
      for (let i = 0; i < 6; i++) {
        await cleanupState(page);
        await navigateToAuthPage(page);
        
        await fillLoginForm(page, ADMIN_CREDENTIALS.email, 'WrongPassword123!');
        await submitLoginForm(page);
        
        await page.waitForTimeout(1000);
      }
      
      // Après 5 tentatives, un message de rate limiting devrait apparaître
      const rateLimitMessage = page.locator('text=/trop|tentatives|rate limit|15 minutes/i');
      await expect(rateLimitMessage.first()).toBeVisible({ timeout: 5000 });
    });
  });
  
  // ============================================
  // 5. TESTS DE PERFORMANCE
  // ============================================
  
  test.describe('Tests de Performance', () => {
    test('5.1 - Temps de chargement de la page (< 1s)', async ({ page }) => {
      const startTime = Date.now();
      await navigateToAuthPage(page);
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(1000);
    });
    
    test('5.2 - Temps de réponse de connexion (< 2s)', async ({ page }) => {
      const startTime = Date.now();
      
      await fillLoginForm(page, ADMIN_CREDENTIALS.email, 'Admin123');
      await submitLoginForm(page);
      await page.waitForURL(/\/admin\/overview/, { timeout: 15000 });
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(2000);
    });
    
    test('5.3 - Performance de validation en temps réel', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]').first();
      
      const startTime = Date.now();
      await emailInput.fill('test@example.com');
      await emailInput.blur();
      
      // Attendre la validation
      await page.waitForTimeout(100);
      
      const validationTime = Date.now() - startTime;
      expect(validationTime).toBeLessThan(500); // Validation doit être instantanée
    });
  });
  
  // ============================================
  // 6. TESTS DE COMPATIBILITÉ MULTI-NAVIGATEURS
  // ============================================
  
  test.describe('Compatibilité Multi-Navigateurs', () => {
    test('6.1 - Affichage correct sur Chrome', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'Test spécifique à Chromium');
      
      await expect(page.locator('text=/Bienvenue|Connexion/i').first()).toBeVisible();
      await expect(page.locator('input[type="email"]').first()).toBeVisible();
      await expect(page.locator('input[type="password"]').first()).toBeVisible();
    });
    
    test('6.2 - Affichage correct sur Firefox', async ({ page, browserName }) => {
      test.skip(browserName !== 'firefox', 'Test spécifique à Firefox');
      
      await expect(page.locator('text=/Bienvenue|Connexion/i').first()).toBeVisible();
      await expect(page.locator('input[type="email"]').first()).toBeVisible();
    });
    
    test('6.3 - Affichage correct sur Safari/WebKit', async ({ page, browserName }) => {
      test.skip(browserName !== 'webkit', 'Test spécifique à WebKit');
      
      await expect(page.locator('text=/Bienvenue|Connexion/i').first()).toBeVisible();
      await expect(page.locator('input[type="email"]').first()).toBeVisible();
    });
  });
  
  // ============================================
  // 7. TESTS D'ACCESSIBILITÉ
  // ============================================
  
  test.describe('Tests d\'Accessibilité', () => {
    test('7.1 - Navigation au clavier', async ({ page }) => {
      // Tab pour naviguer
      await page.keyboard.press('Tab'); // Email input
      const emailFocused = await page.evaluate(() => document.activeElement?.tagName === 'INPUT');
      expect(emailFocused).toBe(true);
      
      await page.keyboard.press('Tab'); // Password input
      await page.keyboard.press('Tab'); // Checkbox ou autre élément
      await page.keyboard.press('Tab'); // Submit button
      
      const buttonFocused = await page.evaluate(() => {
        const active = document.activeElement;
        return active?.tagName === 'BUTTON' || active?.getAttribute('type') === 'submit';
      });
      expect(buttonFocused).toBe(true);
    });
    
    test('7.2 - ARIA labels présents', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      const toggleButton = page.locator('button[aria-label*="mot de passe"], button[aria-label*="password"]').first();
      
      // Vérifier que le toggle a un aria-label
      const ariaLabel = await toggleButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });
    
    test('7.3 - Messages d\'erreur accessibles', async ({ page }) => {
      await fillLoginForm(page, 'invalid-email', 'password');
      await page.locator('input[type="email"]').first().blur();
      
      // Attendre le message d'erreur
      await page.waitForTimeout(500);
      
      const errorMessage = page.locator('[role="alert"], [aria-live]').first();
      await expect(errorMessage).toBeVisible({ timeout: 2000 });
    });
  });
  
  // ============================================
  // 8. TESTS DE TRANSITION LOGIN/SIGNUP
  // ============================================
  
  test.describe('Tests de Transition', () => {
    test('8.1 - Transition fluide entre login et signup', async ({ page }) => {
      // Vérifier qu'on est en mode login par défaut
      const loginForm = page.locator('text=/Bienvenue sur AgroDeep/i');
      await expect(loginForm.first()).toBeVisible();
      
      // Cliquer sur le bouton Inscription
      const registerButton = page.locator('button:has-text("Inscription")');
      await registerButton.click();
      
      // Attendre la transition
      await page.waitForTimeout(300);
      
      // Vérifier qu'on est en mode inscription
      const registerForm = page.locator('text=/Créer un compte/i');
      await expect(registerForm.first()).toBeVisible();
      
      // Revenir en mode login
      const loginButton = page.locator('button:has-text("Connexion")');
      await loginButton.click();
      await page.waitForTimeout(300);
      
      await expect(loginForm.first()).toBeVisible();
    });
    
    test('8.2 - Préservation des données lors de la transition', async ({ page }) => {
      // Remplir le formulaire de login
      await fillLoginForm(page, 'test@example.com', 'password123');
      
      // Basculer vers inscription
      await page.locator('button:has-text("Inscription")').click();
      await page.waitForTimeout(300);
      
      // Revenir en login
      await page.locator('button:has-text("Connexion")').click();
      await page.waitForTimeout(300);
      
      // Les champs devraient être vides (nouveau formulaire)
      const emailInput = page.locator('input[type="email"]').first();
      const emailValue = await emailInput.inputValue();
      expect(emailValue).toBe(''); // Les données ne sont pas préservées (comportement attendu)
    });
  });
  
  // ============================================
  // 9. TESTS DE "SE SOUVENIR DE MOI"
  // ============================================
  
  test.describe('Tests "Se souvenir de moi"', () => {
    test('9.1 - Cookie "Se souvenir de moi" créé', async ({ page, context }) => {
      await fillLoginForm(page, ADMIN_CREDENTIALS.email, 'Admin123');
      
      // Cocher "Se souvenir de moi"
      const rememberCheckbox = page.locator('input[type="checkbox"][id="remember"]');
      await rememberCheckbox.check();
      
      await submitLoginForm(page);
      await verifyLoginSuccess(page, ADMIN_CREDENTIALS.expectedRedirect);
      
      // Vérifier que le cookie est créé
      const cookies = await context.cookies();
      const rememberCookie = cookies.find(c => c.name === 'rememberMe');
      expect(rememberCookie).toBeTruthy();
    });
    
    test('9.2 - Email pré-rempli avec "Se souvenir de moi"', async ({ page, context }) => {
      // D'abord se connecter avec "Se souvenir de moi"
      await fillLoginForm(page, ADMIN_CREDENTIALS.email, 'Admin123');
      await page.locator('input[type="checkbox"][id="remember"]').check();
      await submitLoginForm(page);
      await verifyLoginSuccess(page, ADMIN_CREDENTIALS.expectedRedirect);
      
      // Se déconnecter
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      // Retourner à la page de login
      await navigateToAuthPage(page);
      
      // Vérifier que l'email est pré-rempli
      const emailInput = page.locator('input[type="email"]').first();
      const emailValue = await emailInput.inputValue();
      // L'email devrait être pré-rempli depuis le cookie
      expect(emailValue).toBeTruthy();
    });
  });
  
  // ============================================
  // 10. TESTS DE VALIDATION EN TEMPS RÉEL
  // ============================================
  
  test.describe('Validation en Temps Réel', () => {
    test('10.1 - Validation email en temps réel', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]').first();
      
      // Email invalide
      await emailInput.fill('invalid');
      await emailInput.blur();
      
      await page.waitForTimeout(300);
      const errorMessage = page.locator('text=/invalide|format/i');
      await expect(errorMessage.first()).toBeVisible({ timeout: 2000 });
      
      // Email valide
      await emailInput.fill('valid@example.com');
      await emailInput.blur();
      
      await page.waitForTimeout(300);
      await expect(errorMessage.first()).not.toBeVisible({ timeout: 1000 });
    });
    
    test('10.2 - Validation mot de passe en temps réel (inscription)', async ({ page }) => {
      // Basculer vers inscription
      await page.locator('button:has-text("Inscription")').click();
      await page.waitForTimeout(300);
      
      const passwordInput = page.locator('input[name="password"]').first();
      
      // Tester les mots de passe faibles
      for (const weakPassword of WEAK_PASSWORDS) {
        await passwordInput.fill(weakPassword.value);
        await passwordInput.blur();
        
        await page.waitForTimeout(300);
        const errorMessage = page.locator('text=/faible|trop court|majuscule|minuscule|chiffre|spécial/i');
        await expect(errorMessage.first()).toBeVisible({ timeout: 2000 });
      }
      
      // Mot de passe fort
      await passwordInput.fill('StrongPassword123!');
      await passwordInput.blur();
      
      await page.waitForTimeout(300);
      // L'indicateur de force devrait montrer "Excellent"
      const strengthIndicator = page.locator('text=/Excellent|Bon/i');
      await expect(strengthIndicator.first()).toBeVisible({ timeout: 2000 });
    });
    
    test('10.3 - Icônes de validation visuelles', async ({ page }) => {
      // Basculer vers inscription
      await page.locator('button:has-text("Inscription")').click();
      await page.waitForTimeout(300);
      
      const firstNameInput = page.locator('input[name="firstName"]').first();
      
      // Entrer une valeur invalide
      await firstNameInput.fill('A');
      await firstNameInput.blur();
      
      await page.waitForTimeout(300);
      // Vérifier l'icône d'erreur
      const errorIcon = page.locator('svg[class*="XCircle"], svg[class*="error"]').first();
      await expect(errorIcon).toBeVisible({ timeout: 2000 });
      
      // Entrer une valeur valide
      await firstNameInput.fill('Jean');
      await firstNameInput.blur();
      
      await page.waitForTimeout(300);
      // Vérifier l'icône de succès
      const successIcon = page.locator('svg[class*="CheckCircle"], svg[class*="check"]').first();
      await expect(successIcon).toBeVisible({ timeout: 2000 });
    });
  });
});
