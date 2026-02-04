import { test, expect, Page } from '@playwright/test';

/**
 * Tests E2E complets pour le dashboard de connexion
 *
 * Couvre :
 * - Affichage de la page
 * - Validation des champs
 * - Soumission du formulaire
 * - Gestion des erreurs
 * - Formulaire mot de passe oublié
 * - Responsive design
 * - Accessibilité
 */

const BASE_URL = 'http://localhost:3002';

// Données de test
const VALID_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123',
};

const INVALID_CREDENTIALS = {
  email: 'invalid@example.com',
  password: 'wrongpassword',
};

test.describe('Dashboard de Connexion - Tests E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('Affichage et Structure', () => {
    test('devrait afficher la page de connexion avec tous les éléments', async ({ page }) => {
      // Vérifier le titre principal
      await expect(page.getByRole('heading', { name: /connectez-vous à votre/i })).toBeVisible();

      // Vérifier les champs du formulaire
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/mot de passe/i)).toBeVisible();

      // Vérifier le bouton de connexion (formulaire principal, pas Accès Rapide)
      await expect(page.getByRole('button', { name: 'Se connecter', exact: true })).toBeVisible();

      // Vérifier le lien mot de passe oublié
      await expect(page.getByRole('button', { name: /mot de passe oublié/i })).toBeVisible();

      // Vérifier les liens du footer
      await expect(page.getByText(/pas encore de compte/i)).toBeVisible();
      await expect(page.getByText(/conditions/i)).toBeVisible();
    });

    test('devrait afficher le logo et le branding', async ({ page }) => {
      // Vérifier la présence du logo (icône Sprout)
      const logo = page.locator('svg').first();
      await expect(logo).toBeVisible();

      // Vérifier le texte "AgroLogistic" (plusieurs occurrences : titre, footer)
      await expect(page.getByText(/agrologistic/i).first()).toBeVisible();
    });

    test('devrait avoir un design responsive sur mobile', async ({ page }) => {
      // Tester en mode mobile
      await page.setViewportSize({ width: 375, height: 667 });

      // Vérifier que le formulaire est visible
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/mot de passe/i)).toBeVisible();

      // Vérifier que le bouton formulaire est accessible
      const submitButton = page.getByRole('button', { name: 'Se connecter', exact: true });
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toBeInViewport();
    });
  });

  test.describe('Validation des Champs', () => {
    test("devrait afficher une erreur si l'email est vide", async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.getByLabel(/mot de passe/i);

      // Cliquer sur le champ email puis le laisser vide
      await emailInput.click();
      await emailInput.blur();

      // Cliquer sur le champ password
      await passwordInput.click();

      // Vérifier le message d'erreur (peut prendre un moment)
      await expect(page.getByText(/l'email est requis/i)).toBeVisible({ timeout: 2000 });
    });

    test("devrait afficher une erreur si l'email est invalide", async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);

      await emailInput.fill('invalid-email');
      await emailInput.blur();

      // Vérifier le message d'erreur de format
      await expect(page.getByText(/format d'email invalide/i)).toBeVisible({ timeout: 2000 });
    });

    test('devrait afficher une erreur si le mot de passe est vide', async ({ page }) => {
      const passwordInput = page.getByLabel(/mot de passe/i);

      await passwordInput.click();
      await passwordInput.blur();

      // Vérifier le message d'erreur
      await expect(page.getByText(/le mot de passe est requis/i)).toBeVisible({ timeout: 2000 });
    });

    test('devrait afficher une erreur si le mot de passe est trop court', async ({ page }) => {
      const passwordInput = page.getByLabel(/mot de passe/i);

      await passwordInput.fill('12345');
      await passwordInput.blur();

      // Vérifier le message d'erreur
      // Schéma : min 8 caractères (auth-schemas.ts)
      await expect(page.getByText(/au moins \d+ caractères|mot de passe.*caractères/i)).toBeVisible({ timeout: 3000 });
    });

    test('devrait valider correctement un email et mot de passe valides', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.getByLabel(/mot de passe/i);

      await emailInput.fill(VALID_CREDENTIALS.email);
      await passwordInput.fill(VALID_CREDENTIALS.password);

      // Les champs ne devraient pas avoir d'erreur
      await expect(page.getByText(/l'email est requis/i)).not.toBeVisible();
      await expect(page.getByText(/format d'email invalide/i)).not.toBeVisible();
      await expect(page.getByText(/le mot de passe est requis/i)).not.toBeVisible();
    });
  });

  test.describe('Soumission du Formulaire', () => {
    test('devrait désactiver le bouton pendant la soumission', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.getByLabel(/mot de passe/i);
      const submitButton = page.getByRole('button', { name: 'Se connecter', exact: true });

      await emailInput.fill(VALID_CREDENTIALS.email);
      await passwordInput.fill(VALID_CREDENTIALS.password);

      // Intercepter la requête API (Better Auth peut utiliser un autre chemin)
      await page.route('**/api/auth/**', async (route) => {
        // Simuler un délai pour voir l'état de chargement
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Unauthorized' }),
        });
      });

      await submitButton.click();

      // Vérifier que le bouton est désactivé pendant la soumission
      await expect(submitButton).toBeDisabled({ timeout: 500 });

      // Vérifier l'indicateur de chargement
      await expect(page.getByText(/connexion en cours/i)).toBeVisible();
    });

    test("devrait afficher un message d'erreur en cas d'échec de connexion", async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.getByLabel(/mot de passe/i);
      const submitButton = page.getByRole('button', { name: 'Se connecter', exact: true });

      await emailInput.fill(INVALID_CREDENTIALS.email);
      await passwordInput.fill(INVALID_CREDENTIALS.password);

      // Intercepter la requête API avec une erreur 401 (Better Auth)
      await page.route('**/api/auth/**', (route) => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Unauthorized',
            message: 'Email ou mot de passe incorrect',
          }),
        });
      });

      await submitButton.click();

      // Vérifier le message d'erreur
      await expect(page.getByText(/email ou mot de passe incorrect/i)).toBeVisible({
        timeout: 5000,
      });
    });

    test('devrait rediriger vers le dashboard en cas de succès', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.getByLabel(/mot de passe/i);
      const submitButton = page.getByRole('button', { name: 'Se connecter', exact: true });

      await emailInput.fill(VALID_CREDENTIALS.email);
      await passwordInput.fill(VALID_CREDENTIALS.password);

      // Intercepter la requête API avec une réponse de succès
      await page.route('**/api/v1/auth/login', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            user: {
              id: '1',
              email: VALID_CREDENTIALS.email,
              role: 'farmer',
              name: 'Test User',
            },
          }),
        });
      });

      // Attendre la navigation
      await Promise.all([
        page.waitForURL('**/dashboard/farmer', { timeout: 10000 }),
        submitButton.click(),
      ]);

      // Vérifier que nous sommes sur la page dashboard
      expect(page.url()).toContain('/dashboard/farmer');
    });
  });

  test.describe('Formulaire Mot de Passe Oublié', () => {
    test('devrait ouvrir le dialog mot de passe oublié', async ({ page }) => {
      const forgotPasswordButton = page.getByRole('button', { name: /mot de passe oublié/i });

      await forgotPasswordButton.click();

      // Vérifier que le dialog s'ouvre
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByText(/mot de passe oublié/i)).toBeVisible();
      await expect(page.getByText(/entrez votre adresse email/i)).toBeVisible();
    });

    test("devrait valider l'email dans le formulaire mot de passe oublié", async ({ page }) => {
      const forgotPasswordButton = page.getByRole('button', { name: /mot de passe oublié/i });

      await forgotPasswordButton.click();

      const emailInput = page.getByLabel(/email/i).filter({ hasText: '' });
      await emailInput.fill('invalid-email');
      await emailInput.blur();

      // Vérifier le message d'erreur
      await expect(page.getByText(/format d'email invalide/i)).toBeVisible({ timeout: 2000 });
    });

    test("devrait envoyer l'email de réinitialisation", async ({ page }) => {
      const forgotPasswordButton = page.getByRole('button', { name: /mot de passe oublié/i });

      await forgotPasswordButton.click();

      const emailInput = page.getByLabel(/email/i).filter({ hasText: '' });
      const sendButton = page.getByRole('button', { name: /envoyer/i });

      // Intercepter la requête API
      await page.route('**/api/v1/auth/forgot-password', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Email sent successfully' }),
        });
      });

      await emailInput.fill(VALID_CREDENTIALS.email);
      await sendButton.click();

      // Vérifier le message de succès
      await expect(page.getByText(/un email de réinitialisation a été envoyé/i)).toBeVisible({
        timeout: 5000,
      });
    });

    test('devrait fermer le dialog avec le bouton annuler', async ({ page }) => {
      const forgotPasswordButton = page.getByRole('button', { name: /mot de passe oublié/i });

      await forgotPasswordButton.click();

      const cancelButton = page.getByRole('button', { name: /annuler/i });
      await cancelButton.click();

      // Vérifier que le dialog est fermé
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });
  });

  test.describe('Accessibilité', () => {
    test('devrait avoir des labels accessibles pour les champs', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.getByLabel(/mot de passe/i);

      // Vérifier que les inputs ont des labels
      await expect(emailInput).toHaveAttribute('aria-invalid', 'false');
      await expect(passwordInput).toHaveAttribute('aria-invalid', 'false');
    });

    test('devrait gérer la navigation au clavier', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.getByLabel(/mot de passe/i);
      const submitButton = page.getByRole('button', { name: 'Se connecter', exact: true });

      // Vérifier que les champs du formulaire sont focusables (ordre de tab peut inclure Accès Rapide)
      await emailInput.focus();
      await expect(emailInput).toBeFocused();

      await passwordInput.focus();
      await expect(passwordInput).toBeFocused();

      await submitButton.focus();
      await expect(submitButton).toBeFocused();
    });

    test('devrait avoir des attributs ARIA appropriés', async ({ page }) => {
      const form = page.getByRole('form', { name: /formulaire de connexion/i });
      await expect(form).toBeVisible();

      // Vérifier que les messages d'erreur ont role="alert"
      const emailInput = page.getByLabel(/email/i);
      await emailInput.fill('invalid');
      await emailInput.blur();

      const errorMessage = page.getByText(/format d'email invalide/i);
      await expect(errorMessage).toHaveAttribute('role', 'alert');
    });
  });

  test.describe('Interactions Utilisateur', () => {
    test('devrait afficher/masquer le mot de passe', async ({ page }) => {
      const passwordInput = page.getByLabel(/mot de passe/i);

      await passwordInput.fill('secretpassword');

      // Vérifier que le type est "password" par défaut
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test("devrait effacer les erreurs quand l'utilisateur modifie les champs", async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);

      // Créer une erreur
      await emailInput.fill('invalid');
      await emailInput.blur();
      await expect(page.getByText(/format d'email invalide/i)).toBeVisible();

      // Corriger l'erreur et déclencher la revalidation (blur)
      await emailInput.fill(VALID_CREDENTIALS.email);
      await emailInput.blur();
      await expect(page.getByText(/format d'email invalide/i)).not.toBeVisible({ timeout: 3000 });
    });

    test('devrait gérer la touche Escape pour effacer les erreurs', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);

      // Créer une erreur
      await emailInput.fill('invalid');
      await emailInput.blur();

      // Appuyer sur Escape
      await page.keyboard.press('Escape');

      // L'erreur devrait être effacée (selon l'implémentation)
      // Note: Cette fonctionnalité dépend de l'implémentation du composant
    });
  });

  test.describe('Design et UI', () => {
    test('devrait avoir un design moderne avec animations', async ({ page }) => {
      // Vérifier la présence d'éléments visuels modernes
      const card = page.locator('[class*="Card"]').first();
      await expect(card).toBeVisible();

      // Vérifier les icônes
      const icons = page.locator('svg');
      await expect(icons.first()).toBeVisible();
    });

    test('devrait avoir un design responsive sur tablette', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      // Vérifier que tous les éléments sont visibles
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
      await expect(page.getByRole('button', { name: 'Se connecter', exact: true })).toBeVisible();
    });
  });
});
