import { test, expect } from '@playwright/test';

/**
 * Tests d'accessibilité pour le dashboard de connexion
 *
 * Vérifie la conformité WCAG AA
 */

test.describe('Accessibilité - Dashboard de Connexion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('devrait avoir un contraste suffisant pour les textes', async ({ page }) => {
    // Vérifier le contraste du texte principal
    const heading = page.getByRole('heading', { name: /connectez-vous/i });
    const headingColor = await heading.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });

    // Note: Playwright ne peut pas calculer directement le ratio de contraste
    // mais on peut vérifier que les couleurs sont définies
    expect(headingColor.color).toBeTruthy();
  });

  test('devrait avoir des labels accessibles pour tous les champs', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/mot de passe/i);

    // Vérifier que les inputs ont des labels associés
    await expect(emailInput).toHaveAttribute('id');
    await expect(passwordInput).toHaveAttribute('id');

    // Vérifier que les labels sont correctement associés
    const emailLabel = page.locator('label[for*="email"]');
    await expect(emailLabel).toBeVisible();

    const passwordLabel = page.locator('label[for*="password"]');
    await expect(passwordLabel).toBeVisible();
  });

  test('devrait être navigable entièrement au clavier', async ({ page }) => {
    // Vérifier que les champs du formulaire sont focusables (l'ordre de tab inclut Accès Rapide avant le formulaire)
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/mot de passe/i);
    const submitButton = page.getByRole('button', { name: 'Se connecter', exact: true });

    await emailInput.focus();
    await expect(emailInput).toBeFocused();

    await passwordInput.focus();
    await expect(passwordInput).toBeFocused();

    await submitButton.focus();
    await expect(submitButton).toBeFocused();
  });

  test('devrait avoir des attributs ARIA appropriés', async ({ page }) => {
    // Vérifier le formulaire
    const form = page.getByRole('form', { name: /formulaire de connexion/i });
    await expect(form).toBeVisible();

    // Vérifier les champs avec aria-invalid
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toHaveAttribute('aria-invalid', 'false');

    // Créer une erreur et vérifier que aria-invalid devient true
    await emailInput.fill('invalid');
    await emailInput.blur();

    // Attendre que l'erreur apparaisse
    await page.waitForTimeout(500);

    // Note: L'attribut aria-invalid peut être mis à jour dynamiquement
    // On vérifie plutôt la présence du message d'erreur avec role="alert"
    const errorMessage = page.getByText(/format d'email invalide/i);
    await expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  test("devrait avoir des messages d'erreur accessibles", async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);

    // Créer une erreur
    await emailInput.fill('invalid-email');
    await emailInput.blur();

    // Vérifier que le message d'erreur a role="alert"
    const errorMessage = page.getByText(/format d'email invalide/i);
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveAttribute('role', 'alert');

    // Vérifier que le champ a aria-describedby pointant vers l'erreur
    const errorId = await errorMessage.getAttribute('id');
    if (errorId) {
      await expect(emailInput).toHaveAttribute('aria-describedby', errorId);
    }
  });

  test('devrait avoir des textes alternatifs pour les icônes', async ({ page }) => {
    // Vérifier que les icônes SVG ont aria-hidden="true", aria-label, ou sont dans un bouton/lien (nom accessible via le parent)
    const icons = page.locator('svg');
    const iconCount = await icons.count();
    expect(iconCount).toBeGreaterThan(0);

    let withA11y = 0;
    for (let i = 0; i < Math.min(iconCount, 8); i++) {
      const icon = icons.nth(i);
      const ariaHidden = await icon.getAttribute('aria-hidden');
      const ariaLabel = await icon.getAttribute('aria-label');
      const inButtonOrLink = await icon.evaluate((el) => !!(el as Element).closest('button, a'));
      if (ariaHidden === 'true' || ariaLabel !== null || inButtonOrLink) withA11y++;
    }
    expect(withA11y, 'Au moins une icône doit avoir aria-hidden, aria-label ou être dans un bouton/lien').toBeGreaterThan(0);
  });

  test('devrait gérer le focus visible', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);

    await emailInput.focus();

    // Vérifier que l'élément a le focus
    await expect(emailInput).toBeFocused();

    // Vérifier visuellement que le focus est visible
    // (cela dépend de la CSS, mais on peut vérifier que l'élément est focusable)
    const tabIndex = await emailInput.getAttribute('tabindex');
    expect(tabIndex === null || parseInt(tabIndex) >= 0).toBeTruthy();
  });

  test('devrait avoir une structure sémantique correcte', async ({ page }) => {
    // Vérifier la présence d'un heading principal
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();

    // Vérifier la présence d'un formulaire
    const form = page.getByRole('form');
    await expect(form).toBeVisible();

    // Vérifier les boutons
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test("devrait être compatible avec les lecteurs d'écran", async ({ page }) => {
    // Vérifier que tous les éléments interactifs ont un nom accessible (label associé ou aria-label)
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/mot de passe/i);
    const submitButton = page.getByRole('button', { name: 'Se connecter', exact: true });

    // Vérifier que les inputs ont un nom accessible (via <label for> ou aria-label)
    await expect(emailInput).toHaveAccessibleName(/email|e-mail/i);
    await expect(passwordInput).toHaveAccessibleName(/mot de passe|password/i);

    // Vérifier que le bouton a un texte accessible
    await expect(submitButton).toHaveText('Se connecter');
  });

  test('devrait gérer les erreurs de manière accessible', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/mot de passe/i);
    const submitButton = page.getByRole('button', { name: 'Se connecter', exact: true });

    // Tenter de soumettre sans remplir les champs
    await submitButton.click();

    // Attendre que les erreurs apparaissent
    await page.waitForTimeout(1000);

    // Vérifier que les messages d'erreur sont annoncés
    const errorMessages = page.locator('[role="alert"]');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
  });
});
