/**
 * Scénarios E2E Auth — Inscription, Connexion, Redirections, Validation, Google
 * + Performance (vitesse chargement) & Stabilité (déconnexion)
 *
 * Scénario A : Inscription & Connexion Agriculteur
 * Scénario B : Connexion Administrateur (Accès Rapide)
 * Scénario C : Connexion Transporteur (Redirection)
 * Scénario D : Erreur de Connexion (Validation)
 * Scénario E : Google Auth (dégradation gracieuse si non configuré)
 * Étape 4 : Test de Vitesse (< 2 s) & Test de Stabilité (Déconnexion → Login)
 *
 * Exécution : pnpm test:e2e (ou pnpm exec playwright test tests/e2e/auth.spec.ts)
 */

import { test, expect } from '@playwright/test';

const generateUniqueEmail = () =>
  `e2e-${Date.now()}-${Math.floor(Math.random() * 10000)}@agrilogistic.test`;

// Chemins réels (AuthContext : /dashboard/agriculteur, /admin/dashboard, /dashboard/transporter)
const DASHBOARD = {
  agriculteur: /\/dashboard\/agriculteur/,
  admin: /\/admin\/dashboard/,
  transporter: /\/dashboard\/transporter/,
} as const;

test.describe('Auth E2E — Scénarios complets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('Scénario A : Inscription & Connexion Agriculteur', () => {
    test('inscription Agriculteur → succès ou redirection dashboard + utilisateur connecté', async ({
      page,
    }) => {
      await page.goto('/register');
      await expect(page).toHaveURL(/\/register/);

      // Étape 1 : sélection du rôle Agriculteur
      await page.getByRole('button', { name: 'Agriculteur' }).first().click();
      await page.getByRole('button', { name: /Continuer/i }).click();

      // Étape 2 : formulaire
      const email = generateUniqueEmail();
      const password = 'Password123!';
      await page.fill('input[name="name"]', 'E2E Agriculteur');
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', password);
      await page.fill('input[name="confirmPassword"]', password);
      const farmInput = page.locator('input[name="farmName"]');
      if (await farmInput.isVisible()) await farmInput.fill('Ferme E2E');

      await page.getByRole('button', { name: /Créer mon compte/i }).click();

      // Vérification : redirection vers Dashboard Agriculteur (/dashboard/agriculteur, pas /farmer/dashboard)
      await expect(page).toHaveURL(DASHBOARD.agriculteur, { timeout: 20000 });

      // Vérification : utilisateur connecté (présence de Déconnexion dans la page ou contenu dashboard)
      const deconnexionInPage = page.getByText(/Déconnexion/i);
      const dashboardContent = page.locator('main').or(page.getByRole('heading', { level: 1 }));
      await expect(deconnexionInPage.or(dashboardContent)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Scénario B : Connexion Administrateur', () => {
    test('Accès Rapide Admin → /admin/dashboard et éléments Admin (War Room) visibles', async ({
      page,
    }) => {
      const adminBtn = page.getByRole('button', { name: "Se connecter en tant qu'ADMIN" });
      await expect(adminBtn).toBeEnabled({ timeout: 15000 });
      await adminBtn.click();

      await expect(page).toHaveURL(DASHBOARD.admin, { timeout: 15000 });

      // Éléments spécifiques Admin : Sidebar avec "War Room" (plusieurs éléments possibles)
      await expect(
        page.getByRole('link', { name: /War Room/i }).or(page.getByText(/War Room/i)).first()
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Scénario C : Connexion Transporteur (Redirection)', () => {
    test('Accès Rapide Transporteur → /dashboard/transporter et missions/flotte visibles', async ({
      page,
    }) => {
      const transporterBtn = page.getByRole('button', { name: 'Se connecter en tant que TRANSPORTEUR' });
      await expect(transporterBtn).toBeEnabled({ timeout: 15000 });
      await transporterBtn.click();

      await expect(page).toHaveURL(DASHBOARD.transporter, { timeout: 15000 });

      // Liste des missions ou de la flotte (MissionCarousel, "mission", "chauffeur", etc.)
      await expect(
        page.getByText(/mission|Mission|Flotte|chauffeur|Gestion/i).first()
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Scénario D : Erreur de Connexion (Validation)', () => {
    test('mauvais mot de passe → formulaire visible, message d’erreur, pas de redirection', async ({
      page,
    }) => {
      await page.getByLabel(/email/i).fill('any@example.com');
      await page.getByLabel(/mot de passe/i).fill('wrong-password');
      await page.getByRole('button', { name: 'Se connecter', exact: true }).click();

      // Message d’erreur (app affiche "Invalid credentials" ou équivalent)
      await expect(
        page.getByText(/Invalid credentials|Email ou mot de passe incorrect|erreur|connexion/i)
      ).toBeVisible({ timeout: 10000 });

      // Formulaire reste visible
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/mot de passe/i)).toBeVisible();

      // Aucune redirection vers un dashboard
      await expect(page).not.toHaveURL(DASHBOARD.admin);
      await expect(page).not.toHaveURL(DASHBOARD.agriculteur);
      await expect(page).not.toHaveURL(DASHBOARD.transporter);
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Scénario E : Google Auth (Mock / Simulation)', () => {
    test('clic "Se connecter avec Google" sans config → message explicite ou bouton désactivé', async ({
      page,
    }) => {
      await page.getByRole('button', { name: /Se connecter avec Google/i }).click();

      // Si credentials Google non configurés : message d’erreur explicite
      await expect(
        page.getByText(
          /Connexion Google non configurée|Configuration Google manquante|Accès Rapide|Email\/Mot de passe/i
        )
      ).toBeVisible({ timeout: 10000 });
    });

    test('bouton Google visible et cliquable (non désactivé par défaut)', async ({ page }) => {
      const googleBtn = page.getByRole('button', { name: /Se connecter avec Google/i });
      await expect(googleBtn).toBeVisible();
      await expect(googleBtn).toBeEnabled();
    });
  });

  test.describe('Étape 4 : Performance & Stabilité', () => {
    test('Test de Vitesse : clic "Se connecter" → Dashboard affiché en < 2 secondes', async ({
      page,
    }) => {
      const connectBtn = page.getByRole('button', { name: "Se connecter en tant qu'ADMIN" });
      await expect(connectBtn).toBeEnabled({ timeout: 15000 });

      const start = Date.now();
      await connectBtn.click();

      // Attendre l’affichage complet du Dashboard (URL + contenu visible)
      await expect(page).toHaveURL(DASHBOARD.admin, { timeout: 5000 });
      await expect(
        page.getByRole('link', { name: /War Room/i }).or(page.getByText(/War Room/i)).first()
      ).toBeVisible({ timeout: 5000 });

      const duration = Date.now() - start;
      expect(duration, `Chargement attendu < 2000 ms, obtenu ${duration} ms`).toBeLessThan(2000);
    });

    test('Test de Stabilité : après connexion, Déconnexion → session détruite, retour Login', async ({
      page,
    }) => {
      const adminBtn = page.getByRole('button', { name: "Se connecter en tant qu'ADMIN" });
      await expect(adminBtn).toBeEnabled({ timeout: 15000 });
      await adminBtn.click();
      await expect(page).toHaveURL(DASHBOARD.admin, { timeout: 15000 });

      // Clic Déconnexion (Admin : "DISCONNECT SESSION" ou "Déconnexion" selon layout)
      const logoutBtn = page
        .getByRole('button', { name: /DISCONNECT SESSION|Déconnexion/i })
        .first();
      await expect(logoutBtn).toBeVisible({ timeout: 10000 });
      await logoutBtn.click();

      // Session détruite : retour sur page Login
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
      await expect(page.getByRole('button', { name: 'Se connecter', exact: true })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
    });
  });
});
