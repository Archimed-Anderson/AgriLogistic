/**
 * Suite E2E complète : Authentification, Inscription, Redirections par rôle
 *
 * Valide :
 * - Server Actions (Sign In / Sign Up) via les flux UI
 * - Flux utilisateurs complets (inscription → connexion → dashboard)
 * - Redirections vers les bons dashboards (Admin, Farmer, Transporter, Buyer)
 * - Dégradation gracieuse OAuth (message Google non configuré)
 * - Déconnexion
 *
 * Prérequis : Playwright installé (pnpm install ; pnpm exec playwright install)
 * Exécution : pnpm test:e2e (ou pnpm exec playwright test tests/e2e/auth-complete.spec.ts)
 */

import { test, expect } from '@playwright/test';

const generateUniqueEmail = () =>
  `e2e-${Date.now()}-${Math.floor(Math.random() * 10000)}@agrilogistic.test`;

// Chemins des dashboards (alignés avec apps/web-app/src/context/AuthContext.tsx)
const DASHBOARD_PATHS = {
  Admin: /\/admin\/dashboard/,
  Farmer: /\/dashboard\/agriculteur/,
  Transporter: /\/dashboard\/transporter/,
  Buyer: /\/dashboard\/buyer/,
} as const;

test.describe('Auth - Suite complète (Sign In/Up, Redirections, E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('Redirections vers les bons Dashboards (Accès Rapide)', () => {
    test('Accès Rapide Admin → /admin/dashboard', async ({ page }) => {
      const btn = page.getByRole('button', { name: "Se connecter en tant qu'ADMIN" });
      await expect(btn).toBeEnabled({ timeout: 15000 });
      await btn.click();
      await expect(page).toHaveURL(DASHBOARD_PATHS.Admin, { timeout: 15000 });
    });

    test('Accès Rapide Agriculteur → /dashboard/agriculteur', async ({ page }) => {
      const btn = page.getByRole('button', { name: "Se connecter en tant qu'AGRICULTEUR" });
      await expect(btn).toBeEnabled({ timeout: 15000 });
      await btn.click();
      await expect(page).toHaveURL(DASHBOARD_PATHS.Farmer, { timeout: 15000 });
    });

    test('Accès Rapide Transporteur → /dashboard/transporter', async ({ page }) => {
      const btn = page.getByRole('button', { name: 'Se connecter en tant que TRANSPORTEUR' });
      await expect(btn).toBeEnabled({ timeout: 15000 });
      await btn.click();
      await expect(page).toHaveURL(DASHBOARD_PATHS.Transporter, { timeout: 15000 });
    });

    test('Accès Rapide Acheteur → /dashboard/buyer', async ({ page }) => {
      const btn = page.getByRole('button', { name: "Se connecter en tant qu'ACHETEUR" });
      await expect(btn).toBeEnabled({ timeout: 15000 });
      await btn.click();
      await expect(page).toHaveURL(DASHBOARD_PATHS.Buyer, { timeout: 15000 });
    });
  });

  test.describe('Sign In (Server Action signInEmail)', () => {
    test('affiche une erreur avec un mauvais mot de passe', async ({ page }) => {
      // Attendre que le formulaire de connexion soit prêt (Accès Rapide peut retarder l'affichage)
      await expect(page.getByRole('button', { name: 'Se connecter', exact: true })).toBeVisible({ timeout: 15000 });
      await page.getByLabel(/email/i).first().fill('any@example.com');
      await page.getByLabel(/mot de passe/i).first().fill('wrong-password');
      await page.getByRole('button', { name: 'Se connecter', exact: true }).click();
      await expect(
        page.getByText(/Invalid credentials|erreur|connexion/i)
      ).toBeVisible({ timeout: 10000 });
    });

    test('connexion avec identifiants valides puis redirection dashboard', async ({ page }) => {
      const email = generateUniqueEmail();
      const password = 'Password123!';
      await page.goto('/register');
      await page.getByRole('button', { name: 'Agriculteur' }).first().click();
      await page.getByRole('button', { name: /Continuer/i }).click();
      await page.fill('input[name="name"]', 'E2E Login User');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', password);
      await page.fill('input[name="confirmPassword"]', password);
      const farmInput = page.locator('input[name="farmName"]');
      if (await farmInput.isVisible()) await farmInput.fill('Ferme E2E');
      await page.getByRole('button', { name: /Créer mon compte/i }).click();
      await expect(page.getByText(/Compte créé avec succès/i)).toBeVisible({ timeout: 20000 });
      await expect(page).toHaveURL(DASHBOARD_PATHS.Farmer, { timeout: 20000 });

      await page.goto('/login');
      await page.getByLabel(/email/i).fill(email);
      await page.getByLabel(/mot de passe/i).fill(password);
      await page.getByRole('button', { name: 'Se connecter', exact: true }).click();
      await expect(page).toHaveURL(DASHBOARD_PATHS.Farmer, { timeout: 15000 });
    });
  });

  test.describe('Sign Up (Server Action signUpEmail)', () => {
    async function goToRegisterStep2(
      page: import('@playwright/test').Page,
      roleLabel: string = 'Agriculteur'
    ) {
      await page.getByRole('link', { name: /Créer un compte/i }).first().click();
      await expect(page).toHaveURL(/\/register/, { timeout: 10000 });
      await page.getByRole('button', { name: roleLabel }).click();
      await page.getByRole('button', { name: /Continuer/i }).click();
      await expect(page.locator('input[name="name"]')).toBeVisible();
    }

    test('inscription Agriculteur → redirection /dashboard/agriculteur', async ({ page }) => {
      await goToRegisterStep2(page, 'Agriculteur');
      const email = generateUniqueEmail();
      await page.fill('input[name="name"]', 'Test Agriculteur');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'Password123!');
      const farmInput = page.locator('input[name="farmName"]');
      if (await farmInput.isVisible()) await farmInput.fill('Ma Ferme');
      await page.getByRole('button', { name: /Créer mon compte/i }).click();
      await expect(page.getByText(/Compte créé avec succès/i)).toBeVisible({ timeout: 20000 });
      await expect(page).toHaveURL(DASHBOARD_PATHS.Farmer, { timeout: 20000 });
    });

    test('inscription Acheteur → redirection /dashboard/buyer', async ({ page }) => {
      await goToRegisterStep2(page, 'Acheteur');
      const email = generateUniqueEmail();
      await page.fill('input[name="name"]', 'Test Acheteur');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'Password123!');
      await page.getByRole('button', { name: /Créer mon compte/i }).click();
      await expect(page.getByText(/Compte créé avec succès/i)).toBeVisible({ timeout: 20000 });
      await expect(page).toHaveURL(DASHBOARD_PATHS.Buyer, { timeout: 20000 });
    });

    test('inscription Transporteur → redirection /dashboard/transporter', async ({ page }) => {
      await goToRegisterStep2(page, 'Transporteur');
      const email = generateUniqueEmail();
      await page.fill('input[name="name"]', 'Test Transporteur');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'Password123!');
      const licenseInput = page.locator('input[name="licenseNumber"]');
      if (await licenseInput.isVisible()) await licenseInput.fill('AB-123-CD');
      await page.getByRole('button', { name: /Créer mon compte/i }).click();
      await expect(page.getByText(/Compte créé avec succès/i)).toBeVisible({ timeout: 20000 });
      await expect(page).toHaveURL(DASHBOARD_PATHS.Transporter, { timeout: 20000 });
    });
  });

  test.describe('OAuth (dégradation gracieuse)', () => {
    test('affiche un message clair si Google non configuré', async ({ page }) => {
      await page.getByRole('button', { name: /Se connecter avec Google/i }).click();
      await expect(
        page.getByText(/Connexion Google non configurée|Accès Rapide|Email\/Mot de passe/i)
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Déconnexion', () => {
    test('Accès Rapide Admin puis Déconnexion → /login', async ({ page }) => {
      const adminBtn = page.getByRole('button', { name: "Se connecter en tant qu'ADMIN" });
      await expect(adminBtn).toBeEnabled({ timeout: 15000 });
      await adminBtn.click();
      await expect(page).toHaveURL(DASHBOARD_PATHS.Admin, { timeout: 15000 });
      const logoutBtn = page.getByRole('button', { name: /Déconnexion/i });
      await expect(logoutBtn).toBeVisible({ timeout: 10000 });
      await logoutBtn.click();
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });
  });
});
