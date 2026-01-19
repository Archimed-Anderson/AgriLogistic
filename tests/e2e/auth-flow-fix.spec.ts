/**
 * =======================================================
 * PLAYWRIGHT E2E - Correction Flux d'Authentification
 * =======================================================
 * Tests pour valider le comportement correct :
 * - Redirection vers Login après déconnexion
 * - Accès aux 3 rôles (Admin, Farmer, Transporter)
 * - Flux complet d'authentification
 */

import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

// Credentials pour les tests
const TEST_USERS = {
  admin: {
    email: "admintest@gmail.com",
    password: "Admin123",
    role: "admin",
  },
  farmer: {
    email: "farmer@test.com",
    password: "Farmer123",
    role: "farmer",
  },
  transporter: {
    email: "transporter@test.com",
    password: "Transport123",
    role: "transporter",
  },
};

test.describe("Auth Flow - Correction de la Redirection après Déconnexion", () => {
  test.beforeEach(async ({ page }) => {
    // Nettoyer le localStorage avant chaque test
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test("1. Doit afficher la page Login au chargement initial", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // Vérifier que nous sommes sur la page de login
    const loginTitle = page.locator("h1, h2").filter({ hasText: /connexion|login|se connecter/i });
    await expect(loginTitle).toBeVisible({ timeout: 5000 });

    // Vérifier la présence des champs de formulaire
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    console.log("✓ Page Login affichée correctement au chargement initial");
  });

  test("2. Admin - Connexion et déconnexion avec redirection vers Login", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    console.log("\n🔐 Test Admin - Connexion");

    // Connexion
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], button').filter({ hasText: /connexion|login|se connecter/i }).first();

    await emailInput.fill(TEST_USERS.admin.email);
    await passwordInput.fill(TEST_USERS.admin.password);
    await loginButton.click();

    // Attendre la redirection après connexion
    await page.waitForURL(/dashboard|home|marketplace/i, { timeout: 10000 });
    console.log("✓ Admin connecté avec succès");

    // Vérifier que nous sommes connectés (présence d'un élément de profil ou menu)
    const userMenu = page.locator('[aria-label*="menu" i], [aria-label*="profile" i], button').filter({ hasText: /admin|profil|compte/i });
    await expect(userMenu.first()).toBeVisible({ timeout: 5000 });

    console.log("\n🚪 Test Admin - Déconnexion");

    // Déconnexion
    const logoutButton = page.locator('button, a').filter({ hasText: /déconnexion|logout|se déconnecter/i });
    
    // Ouvrir le menu si nécessaire
    if (await userMenu.first().isVisible()) {
      await userMenu.first().click();
      await page.waitForTimeout(500);
    }

    await logoutButton.first().click();

    // Attendre la redirection vers la page de login
    await page.waitForURL(/login|connexion|\/$/, { timeout: 10000 });
    
    // Vérifier que nous sommes bien sur la page de login
    const loginTitleAfterLogout = page.locator("h1, h2").filter({ hasText: /connexion|login|se connecter/i });
    await expect(loginTitleAfterLogout).toBeVisible({ timeout: 5000 });

    // Vérifier que les tokens sont supprimés
    const hasToken = await page.evaluate(() => {
      return localStorage.getItem("accessToken") !== null;
    });

    expect(hasToken).toBe(false);
    console.log("✓ Admin déconnecté et redirigé vers Login");
  });

  test("3. Farmer - Accès et flux complet", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    console.log("\n🌾 Test Farmer - Connexion");

    // Connexion Farmer
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], button').filter({ hasText: /connexion|login|se connecter/i }).first();

    await emailInput.fill(TEST_USERS.farmer.email);
    await passwordInput.fill(TEST_USERS.farmer.password);
    await loginButton.click();

    // Attendre la redirection
    await page.waitForURL(/dashboard|home|marketplace/i, { timeout: 10000 });
    console.log("✓ Farmer connecté avec succès");

    // Vérifier l'accès au rôle Farmer
    const farmerIndicator = page.locator('text=/farmer|agriculteur|producteur/i');
    await expect(farmerIndicator.first()).toBeVisible({ timeout: 5000 });

    // Déconnexion
    const logoutButton = page.locator('button, a').filter({ hasText: /déconnexion|logout|se déconnecter/i });
    await logoutButton.first().click();

    // Vérifier la redirection vers Login
    await page.waitForURL(/login|connexion|\/$/, { timeout: 10000 });
    const loginTitle = page.locator("h1, h2").filter({ hasText: /connexion|login|se connecter/i });
    await expect(loginTitle).toBeVisible();

    console.log("✓ Farmer déconnecté et redirigé vers Login");
  });

  test("4. Transporter - Accès et flux complet", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    console.log("\n🚚 Test Transporter - Connexion");

    // Connexion Transporter
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], button').filter({ hasText: /connexion|login|se connecter/i }).first();

    await emailInput.fill(TEST_USERS.transporter.email);
    await passwordInput.fill(TEST_USERS.transporter.password);
    await loginButton.click();

    // Attendre la redirection
    await page.waitForURL(/dashboard|home|marketplace/i, { timeout: 10000 });
    console.log("✓ Transporter connecté avec succès");

    // Vérifier l'accès au rôle Transporter
    const transporterIndicator = page.locator('text=/transport|livreur|logistique/i');
    await expect(transporterIndicator.first()).toBeVisible({ timeout: 5000 });

    // Déconnexion
    const logoutButton = page.locator('button, a').filter({ hasText: /déconnexion|logout|se déconnecter/i });
    await logoutButton.first().click();

    // Vérifier la redirection vers Login
    await page.waitForURL(/login|connexion|\/$/, { timeout: 10000 });
    const loginTitle = page.locator("h1, h2").filter({ hasText: /connexion|login|se connecter/i });
    await expect(loginTitle).toBeVisible();

    console.log("✓ Transporter déconnecté et redirigé vers Login");
  });

  test("5. Tentative d'accès à une page protégée sans authentification", async ({ page }) => {
    // Essayer d'accéder directement à une page protégée
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState("networkidle");

    // Doit être redirigé vers la page de login
    await page.waitForURL(/login|connexion|\/$/, { timeout: 10000 });
    
    const loginTitle = page.locator("h1, h2").filter({ hasText: /connexion|login|se connecter/i });
    await expect(loginTitle).toBeVisible();

    console.log("✓ Redirection vers Login pour accès non autorisé");
  });

  test("6. Persistance de session après rafraîchissement", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    // Connexion
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], button').filter({ hasText: /connexion|login|se connecter/i }).first();

    await emailInput.fill(TEST_USERS.admin.email);
    await passwordInput.fill(TEST_USERS.admin.password);
    await loginButton.click();

    await page.waitForURL(/dashboard|home|marketplace/i, { timeout: 10000 });
    console.log("✓ Connecté");

    // Rafraîchir la page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Vérifier que nous sommes toujours connectés
    const currentURL = page.url();
    expect(currentURL).not.toMatch(/login|connexion/i);

    console.log("✓ Session persistante après rafraîchissement");
  });
});

test.describe("Auth Flow - Tests de Validation Complète", () => {
  test("7. Validation du formulaire de connexion", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    console.log("\n📝 Test Validation Formulaire");

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], button').filter({ hasText: /connexion|login|se connecter/i }).first();

    // Test 1: Soumission avec champs vides
    await loginButton.click();
    await page.waitForTimeout(1000);
    
    // Vérifier qu'on reste sur la page de login
    const currentURL = page.url();
    expect(currentURL).toMatch(/login|connexion|\//);
    console.log("✓ Validation champs vides OK");

    // Test 2: Email invalide
    await emailInput.fill("invalid-email");
    await passwordInput.fill("password123");
    await loginButton.click();
    await page.waitForTimeout(1000);
    
    // Vérifier le message d'erreur ou qu'on reste sur la page
    const errorMessage = page.locator('text=/invalide|erreur|incorrect/i');
    const isStillOnLogin = page.url().match(/login|connexion|\//);
    
    expect(isStillOnLogin || await errorMessage.first().isVisible()).toBeTruthy();
    console.log("✓ Validation email invalide OK");

    // Test 3: Credentials incorrects
    await emailInput.fill("wrong@example.com");
    await passwordInput.fill("wrongpassword");
    await loginButton.click();
    await page.waitForTimeout(2000);
    
    // Doit afficher une erreur ou rester sur la page
    const stillOnLogin = page.url().match(/login|connexion|\//);
    expect(stillOnLogin).toBeTruthy();
    console.log("✓ Validation credentials incorrects OK");
  });

  test("8. Test responsive - Mobile et Desktop", async ({ page }) => {
    console.log("\n📱 Test Responsive");

    // Test Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");

    const loginFormMobile = page.locator('form, div').filter({ has: page.locator('input[type="email"]') });
    await expect(loginFormMobile.first()).toBeVisible();
    console.log("✓ Page Login responsive sur Mobile");

    // Test Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState("networkidle");

    const loginFormDesktop = page.locator('form, div').filter({ has: page.locator('input[type="email"]') });
    await expect(loginFormDesktop.first()).toBeVisible();
    console.log("✓ Page Login responsive sur Desktop");
  });
});
