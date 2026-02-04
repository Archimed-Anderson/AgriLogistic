import { test, expect } from '@playwright/test';

test.describe('Validation Finale - AgriLogistic V3', () => {
  test('Landing Page - Vérification visuelle et contenu', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/AgriLogistic/);

    // Test Navbar
    await expect(page.locator('nav').getByText('AgriLogistic')).toBeVisible();
    await expect(page.getByRole('link', { name: /Demander une Démo/i }).first()).toBeVisible();

    // Test Hero
    await expect(page.getByText(/Générez de la Valeur/i)).toBeVisible();
  });

  test('Demo Flow - Validation du Formulaire B2B', async ({ page }) => {
    await page.goto('/request-demo');

    // Vérification présence titre et form
    await expect(page.getByText(/Voir AgriLogistic en action/i)).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();

    // Test validation email professionnel
    await page.fill('input[name="firstName"]', 'Audit');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', 'test@gmail.com');
    await page.fill('input[name="company"]', 'Audit Corp');
    await page.selectOption('select[name="actorType"]', 'buyer');
    await page.fill('textarea[name="message"]', 'Ceci est un test de validation technique.');

    await page.click('button[type="submit"]');

    // Devrait afficher l'erreur pour email pro
    await expect(page.getByText(/Veuillez utiliser un email professionnel/i)).toBeVisible();
  });

  test('AuthFlow - Basculement Login/Register avec Tabs', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Créer un compte' })).toBeVisible();

    await page.getByRole('link', { name: 'Créer un compte' }).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByText(/Choisissez votre type d'activité/i)).toBeVisible();
  });

  test('Registration - Champs Conditionnels (Agriculteur)', async ({ page }) => {
    await page.goto('/register');

    // Sélectionner Agriculteur (déjà sélectionné par défaut mais on clique pour être sûr)
    await page.getByText(/Agriculteur/i).click();
    await page.getByRole('button', { name: /Continuer/i }).click();

    // Étape 2 : Vérifier le champ conditionnel dans le formulaire
    await expect(page.locator('input[name="farmName"]')).toBeVisible();
    await expect(page.locator('input[name="licenseNumber"]')).not.toBeVisible();
  });

  test('Registration - Champs Conditionnels (Transporteur)', async ({ page }) => {
    await page.goto('/register');

    // Sélectionner Transporteur
    await page.getByText(/Transporteur/i).click();
    await page.getByRole('button', { name: /Continuer/i }).click();

    // Étape 2 : Vérifier le champ conditionnel
    await expect(page.locator('input[name="licenseNumber"]')).toBeVisible();
    await expect(page.locator('input[name="farmName"]')).not.toBeVisible();
  });
});
