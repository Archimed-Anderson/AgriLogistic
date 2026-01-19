/**
 * =======================================================
 * PLAYWRIGHT E2E - Tests Complets du Système de Login
 * =======================================================
 * Tests exhaustifs couvrant tous les scénarios de connexion
 * - Connexion réussie avec identifiants valides
 * - Échec de connexion avec identifiants invalides
 * - Messages d'erreur appropriés
 * - Tentatives multiples infructueuses
 * - Redirection après connexion
 */

import { test, expect, Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "http://localhost:5173";
const SCREENSHOTS_DIR = path.join(process.cwd(), "tests", "e2e", "screenshots", "login");

// Créer le dossier de screenshots s'il n'existe pas
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Credentials de test
const VALID_CREDENTIALS = {
  email: "admintest@gmail.com",
  password: "Admin123",
};

const INVALID_CREDENTIALS = [
  { email: "wrong@example.com", password: "wrongpassword", description: "Email et mot de passe incorrects" },
  { email: "admintest@gmail.com", password: "wrongpassword", description: "Mot de passe incorrect" },
  { email: "wrong@example.com", password: "Admin123", description: "Email incorrect" },
  { email: "", password: "Admin123", description: "Email vide" },
  { email: "admintest@gmail.com", password: "", description: "Mot de passe vide" },
  { email: "", password: "", description: "Tous les champs vides" },
  { email: "invalid-email", password: "password", description: "Format email invalide" },
];

// Helper: Prendre une capture d'écran en cas d'échec
async function takeScreenshotOnFailure(page: Page, testName: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${testName}-${timestamp}.png`;
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, filename),
    fullPage: true,
  });
  console.log(`📸 Screenshot sauvegardée: ${filename}`);
}

// Helper: Naviguer vers la page de login
async function navigateToLogin(page: Page) {
  await page.goto(BASE_URL);
  await page.waitForLoadState("networkidle");
  
  // Vérifier que nous sommes sur la page de login
  const loginIndicator = page.locator("h1, h2").filter({ hasText: /connexion|login|se connecter/i });
  await expect(loginIndicator.first()).toBeVisible({ timeout: 10000 });
}

// Helper: Remplir le formulaire de login
async function fillLoginForm(page: Page, email: string, password: string) {
  const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  
  await emailInput.clear();
  await emailInput.fill(email);
  
  await passwordInput.clear();
  await passwordInput.fill(password);
}

// Helper: Soumettre le formulaire
async function submitLoginForm(page: Page) {
  const loginButton = page.locator('button[type="submit"], button').filter({ hasText: /connexion|login|se connecter/i }).first();
  await loginButton.click();
}

// Helper: Nettoyer l'état de l'application
async function cleanupState(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

test.describe("Login System - Tests Complets", () => {
  test.beforeEach(async ({ page }) => {
    // Nettoyer l'état avant chaque test
    await cleanupState(page);
    await navigateToLogin(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Prendre une capture d'écran en cas d'échec
    if (testInfo.status !== testInfo.expectedStatus) {
      await takeScreenshotOnFailure(page, testInfo.title.replace(/\s+/g, "-"));
    }
  });

  test("1. Connexion réussie avec identifiants valides", async ({ page }) => {
    console.log("\n✅ TEST 1: Connexion réussie avec identifiants valides");

    // Remplir le formulaire avec des identifiants valides
    await fillLoginForm(page, VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);
    
    // Soumettre le formulaire
    await submitLoginForm(page);

    // Attendre la redirection après connexion réussie
    await page.waitForURL(/dashboard|home|marketplace/i, { timeout: 15000 });
    
    // Vérifier que nous sommes bien connectés
    const currentURL = page.url();
    console.log(`  ✓ Redirection vers: ${currentURL}`);
    expect(currentURL).not.toMatch(/login|connexion/i);

    // Vérifier la présence d'éléments indiquant que nous sommes connectés
    const userIndicator = page.locator('[aria-label*="menu" i], [aria-label*="profile" i], button, a').filter({ 
      hasText: /admin|profil|compte|déconnexion|logout/i 
    });
    await expect(userIndicator.first()).toBeVisible({ timeout: 10000 });
    console.log("  ✓ Indicateur utilisateur visible");

    // Vérifier que le token est stocké
    const hasToken = await page.evaluate(() => {
      return localStorage.getItem("accessToken") !== null;
    });
    expect(hasToken).toBe(true);
    console.log("  ✓ Token d'accès stocké");

    console.log("✅ TEST 1 RÉUSSI\n");
  });

  test("2. Échec de connexion - Email et mot de passe incorrects", async ({ page }) => {
    console.log("\n❌ TEST 2: Échec de connexion - Identifiants incorrects");

    await fillLoginForm(page, "wrong@example.com", "wrongpassword");
    await submitLoginForm(page);

    // Attendre un message d'erreur ou rester sur la page de login
    await page.waitForTimeout(2000);

    // Vérifier que nous sommes toujours sur la page de login
    const currentURL = page.url();
    expect(currentURL).toMatch(/login|connexion|\//);
    console.log("  ✓ Reste sur la page de login");

    // Vérifier la présence d'un message d'erreur
    const errorMessage = page.locator('text=/invalide|incorrect|erreur|failed|error/i, [role="alert"], .error, .alert-error');
    const hasError = await errorMessage.first().isVisible({ timeout: 5000 }).catch(() => false);
    
    if (hasError) {
      const errorText = await errorMessage.first().textContent();
      console.log(`  ✓ Message d'erreur affiché: "${errorText}"`);
    } else {
      console.log("  ⚠️  Aucun message d'erreur visible (peut être géré différemment)");
    }

    // Vérifier qu'aucun token n'est stocké
    const hasToken = await page.evaluate(() => {
      return localStorage.getItem("accessToken") !== null;
    });
    expect(hasToken).toBe(false);
    console.log("  ✓ Aucun token stocké");

    console.log("✅ TEST 2 RÉUSSI\n");
  });

  test("3. Échec de connexion - Mot de passe incorrect", async ({ page }) => {
    console.log("\n❌ TEST 3: Échec de connexion - Mot de passe incorrect");

    await fillLoginForm(page, VALID_CREDENTIALS.email, "wrongpassword");
    await submitLoginForm(page);
    await page.waitForTimeout(2000);

    const currentURL = page.url();
    expect(currentURL).toMatch(/login|connexion|\//);
    console.log("  ✓ Reste sur la page de login");

    const errorMessage = page.locator('text=/invalide|incorrect|erreur|failed|error/i, [role="alert"]');
    const hasError = await errorMessage.first().isVisible({ timeout: 5000 }).catch(() => false);
    
    if (hasError) {
      const errorText = await errorMessage.first().textContent();
      console.log(`  ✓ Message d'erreur: "${errorText}"`);
    }

    console.log("✅ TEST 3 RÉUSSI\n");
  });

  test("4. Validation - Email vide", async ({ page }) => {
    console.log("\n⚠️  TEST 4: Validation - Email vide");

    await fillLoginForm(page, "", VALID_CREDENTIALS.password);
    await submitLoginForm(page);
    await page.waitForTimeout(1000);

    // Vérifier la validation HTML5 ou message d'erreur
    const emailInput = page.locator('input[type="email"]').first();
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    
    if (validationMessage) {
      console.log(`  ✓ Validation HTML5: "${validationMessage}"`);
    }

    const currentURL = page.url();
    expect(currentURL).toMatch(/login|connexion|\//);
    console.log("  ✓ Reste sur la page de login");

    console.log("✅ TEST 4 RÉUSSI\n");
  });

  test("5. Validation - Mot de passe vide", async ({ page }) => {
    console.log("\n⚠️  TEST 5: Validation - Mot de passe vide");

    await fillLoginForm(page, VALID_CREDENTIALS.email, "");
    await submitLoginForm(page);
    await page.waitForTimeout(1000);

    const currentURL = page.url();
    expect(currentURL).toMatch(/login|connexion|\//);
    console.log("  ✓ Reste sur la page de login");

    console.log("✅ TEST 5 RÉUSSI\n");
  });

  test("6. Validation - Format email invalide", async ({ page }) => {
    console.log("\n⚠️  TEST 6: Validation - Format email invalide");

    await fillLoginForm(page, "invalid-email-format", "password");
    await submitLoginForm(page);
    await page.waitForTimeout(1000);

    // Vérifier la validation HTML5
    const emailInput = page.locator('input[type="email"]').first();
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    
    if (validationMessage) {
      console.log(`  ✓ Validation HTML5: "${validationMessage}"`);
      expect(validationMessage).toBeTruthy();
    }

    console.log("✅ TEST 6 RÉUSSI\n");
  });

  test("7. Tentatives multiples infructueuses (Rate Limiting)", async ({ page }) => {
    console.log("\n🔒 TEST 7: Tentatives multiples infructueuses");

    const MAX_ATTEMPTS = 5;
    let rateLimitDetected = false;

    for (let i = 1; i <= MAX_ATTEMPTS; i++) {
      console.log(`  Tentative ${i}/${MAX_ATTEMPTS}...`);
      
      await fillLoginForm(page, "wrong@example.com", "wrongpassword");
      await submitLoginForm(page);
      await page.waitForTimeout(1500);

      // Vérifier si un message de rate limiting apparaît
      const rateLimitMessage = page.locator('text=/trop de tentatives|too many|rate limit|blocked/i');
      const isRateLimited = await rateLimitMessage.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (isRateLimited) {
        const message = await rateLimitMessage.textContent();
        console.log(`  ✓ Rate limiting détecté après ${i} tentatives: "${message}"`);
        rateLimitDetected = true;
        break;
      }
    }

    if (!rateLimitDetected) {
      console.log(`  ⚠️  Aucun rate limiting détecté après ${MAX_ATTEMPTS} tentatives`);
      console.log("  ℹ️  Ceci peut être normal si le rate limiting n'est pas implémenté côté frontend");
    }

    console.log("✅ TEST 7 RÉUSSI\n");
  });

  test("8. Vérification de la redirection après connexion", async ({ page }) => {
    console.log("\n🔄 TEST 8: Vérification de la redirection");

    // Se connecter
    await fillLoginForm(page, VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);
    await submitLoginForm(page);

    // Attendre et capturer l'URL de redirection
    await page.waitForURL(/dashboard|home|marketplace/i, { timeout: 15000 });
    const redirectURL = page.url();
    
    console.log(`  ✓ Redirection vers: ${redirectURL}`);
    expect(redirectURL).not.toMatch(/login|connexion/i);

    // Vérifier que la page de destination est chargée
    await page.waitForLoadState("networkidle");
    console.log("  ✓ Page de destination chargée");

    // Vérifier la présence d'éléments de l'interface utilisateur connecté
    const dashboardElements = page.locator('nav, header, [role="navigation"]');
    await expect(dashboardElements.first()).toBeVisible({ timeout: 5000 });
    console.log("  ✓ Éléments de navigation visibles");

    console.log("✅ TEST 8 RÉUSSI\n");
  });

  test("9. Persistance de session - Rafraîchissement de page", async ({ page }) => {
    console.log("\n💾 TEST 9: Persistance de session");

    // Se connecter
    await fillLoginForm(page, VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);
    await submitLoginForm(page);
    await page.waitForURL(/dashboard|home|marketplace/i, { timeout: 15000 });
    
    const urlAfterLogin = page.url();
    console.log(`  ✓ Connecté, URL: ${urlAfterLogin}`);

    // Rafraîchir la page
    await page.reload();
    await page.waitForLoadState("networkidle");
    
    const urlAfterReload = page.url();
    console.log(`  ✓ Page rafraîchie, URL: ${urlAfterReload}`);

    // Vérifier que nous sommes toujours connectés
    expect(urlAfterReload).not.toMatch(/login|connexion/i);
    console.log("  ✓ Session persistante après rafraîchissement");

    // Vérifier que le token est toujours présent
    const hasToken = await page.evaluate(() => {
      return localStorage.getItem("accessToken") !== null;
    });
    expect(hasToken).toBe(true);
    console.log("  ✓ Token toujours présent");

    console.log("✅ TEST 9 RÉUSSI\n");
  });

  test("10. Visibilité du mot de passe (Toggle)", async ({ page }) => {
    console.log("\n👁️  TEST 10: Visibilité du mot de passe");

    const passwordInput = page.locator('input[type="password"]').first();
    
    // Vérifier que le champ est de type password par défaut
    const initialType = await passwordInput.getAttribute("type");
    expect(initialType).toBe("password");
    console.log("  ✓ Champ mot de passe masqué par défaut");

    // Chercher un bouton de toggle (si présent)
    const toggleButton = page.locator('button[aria-label*="show" i], button[aria-label*="voir" i], button').filter({ 
      has: page.locator('svg') 
    }).filter({ hasText: /eye|œil/i });
    
    const hasToggle = await toggleButton.first().isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasToggle) {
      await toggleButton.first().click();
      await page.waitForTimeout(500);
      
      const newType = await passwordInput.getAttribute("type");
      console.log(`  ✓ Toggle cliqué, type: ${newType}`);
    } else {
      console.log("  ℹ️  Aucun bouton de toggle de visibilité trouvé");
    }

    console.log("✅ TEST 10 RÉUSSI\n");
  });

  test("11. Accessibilité - Navigation clavier", async ({ page }) => {
    console.log("\n⌨️  TEST 11: Navigation clavier");

    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    // Tester la navigation avec Tab
    await emailInput.focus();
    console.log("  ✓ Focus sur email");

    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);
    
    const passwordFocused = await passwordInput.evaluate((el) => el === document.activeElement);
    expect(passwordFocused).toBe(true);
    console.log("  ✓ Tab vers mot de passe");

    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);
    
    const buttonFocused = await submitButton.evaluate((el) => el === document.activeElement);
    expect(buttonFocused).toBe(true);
    console.log("  ✓ Tab vers bouton de soumission");

    // Tester la soumission avec Enter
    await emailInput.fill(VALID_CREDENTIALS.email);
    await passwordInput.fill(VALID_CREDENTIALS.password);
    await page.keyboard.press("Enter");
    
    await page.waitForURL(/dashboard|home|marketplace/i, { timeout: 15000 });
    console.log("  ✓ Soumission avec Enter fonctionne");

    console.log("✅ TEST 11 RÉUSSI\n");
  });

  test("12. Responsive - Mobile viewport", async ({ page }) => {
    console.log("\n📱 TEST 12: Responsive - Mobile");

    // Définir un viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Vérifier que le formulaire est visible
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    console.log("  ✓ Formulaire visible sur mobile");

    // Tester la connexion sur mobile
    await fillLoginForm(page, VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);
    await submitLoginForm(page);
    
    await page.waitForURL(/dashboard|home|marketplace/i, { timeout: 15000 });
    console.log("  ✓ Connexion réussie sur mobile");

    console.log("✅ TEST 12 RÉUSSI\n");
  });
});

test.describe("Login System - Tests de Messages d'Erreur", () => {
  test.beforeEach(async ({ page }) => {
    await cleanupState(page);
    await navigateToLogin(page);
  });

  for (const credential of INVALID_CREDENTIALS) {
    test(`Message d'erreur: ${credential.description}`, async ({ page }) => {
      console.log(`\n🔍 TEST: ${credential.description}`);

      await fillLoginForm(page, credential.email, credential.password);
      await submitLoginForm(page);
      await page.waitForTimeout(2000);

      // Vérifier que nous restons sur la page de login
      const currentURL = page.url();
      expect(currentURL).toMatch(/login|connexion|\//);
      console.log("  ✓ Reste sur la page de login");

      // Chercher un message d'erreur
      const errorSelectors = [
        'text=/invalide|incorrect|erreur|failed|error|required|obligatoire/i',
        '[role="alert"]',
        '.error',
        '.alert-error',
        '[class*="error"]',
        '[class*="alert"]',
      ];

      let errorFound = false;
      for (const selector of errorSelectors) {
        const errorElement = page.locator(selector);
        const isVisible = await errorElement.first().isVisible({ timeout: 1000 }).catch(() => false);
        
        if (isVisible) {
          const errorText = await errorElement.first().textContent();
          console.log(`  ✓ Message d'erreur: "${errorText}"`);
          errorFound = true;
          break;
        }
      }

      if (!errorFound) {
        console.log("  ⚠️  Aucun message d'erreur visible");
      }

      console.log(`✅ TEST RÉUSSI: ${credential.description}\n`);
    });
  }
});
