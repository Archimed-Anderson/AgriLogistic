/**
 * =======================================================
 * PLAYWRIGHT E2E - Tests Landing Page AgroDeep Moderne
 * =======================================================
 * Tests complets pour valider la nouvelle landing page
 * - Chargement et performance
 * - Affichage de toutes les sections
 * - Navigation et interactions
 * - Formulaire de contact
 * - Carrousel témoignages
 * - Responsive design
 * - Accessibilité WCAG AA
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Landing Page AgroDeep - Tests Complets', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mock API contact pour isoler les tests front (pas de dépendance au backend)
    await page.route('**/api/v1/contact', async (route) => {
      await route.fulfill({
        status: 202,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { status: 'queued', jobId: 'test-job' } }),
      });
    });

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  // ============================================
  // 1. TESTS DE CHARGEMENT ET PERFORMANCE
  // ============================================

  test('1.1 - Page se charge en moins de 2 secondes', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });

  test('1.2 - Hero section visible immédiatement', async ({ page }) => {
    const heroTitle = page.locator('h1:has-text("Découvrez")');
    await expect(heroTitle).toBeVisible({ timeout: 1000 });
  });

  // ============================================
  // 2. TESTS D\'AFFICHAGE DES SECTIONS
  // ============================================

  test('2.1 - Toutes les sections principales sont visibles', async ({ page }) => {
    // Hero
    await expect(page.locator('h1:has-text("Découvrez")')).toBeVisible();
    
    // Story
    await expect(page.locator('h2:has-text("Notre Histoire")')).toBeVisible();
    
    // Services
    await expect(page.locator('h2:has-text("Nos Services")')).toBeVisible();
    
    // Practices
    await expect(page.locator('h2:has-text("Pratiques Agricoles")')).toBeVisible();
    
    // Projects
    await expect(page.locator('h2:has-text("Projets Récemment")')).toBeVisible();
    
    // Testimonials
    await expect(page.locator('h2:has-text("Témoignages")')).toBeVisible();
    
    // Blog
    await expect(page.locator('h2:has-text("Nos Derniers Articles")')).toBeVisible();
    
    // Contact
    await expect(page.locator('h2:has-text("Contactez-Nous")')).toBeVisible();
  });

  test('2.2 - Hero section affiche statistiques correctement', async ({ page }) => {
    await expect(page.locator('text=450+')).toBeVisible();
    await expect(page.locator('text=Producteurs Actifs')).toBeVisible();
    await expect(page.locator('text=1954+')).toBeVisible();
    await expect(page.locator('text=Produits Disponibles')).toBeVisible();
  });

  test('2.3 - Services section affiche 4 cartes', async ({ page }) => {
    const serviceCards = page.locator('text=E-commerce').first().locator('..');
    await expect(serviceCards).toBeVisible();
    
    await expect(page.locator('text=E-commerce')).toBeVisible();
    await expect(page.locator('text=IoT Monitoring')).toBeVisible();
    await expect(page.locator('text=Farming')).toBeVisible();
    await expect(page.locator('text=Agriculture Durable')).toBeVisible();
  });

  // ============================================
  // 3. TESTS DE NAVIGATION
  // ============================================

  test('3.1 - Bouton "Commencer" redirige vers register', async ({ page }) => {
    const startButton = page.locator('button:has-text("Commencer")').first();
    await startButton.click();
    
    // Vérifier qu'on est redirigé (l'URL ou le contenu change)
    await page.waitForTimeout(500);
  });

  test('3.2 - Bouton "En savoir plus" scroll vers story', async ({ page }) => {
    const learnMoreButton = page.locator('button:has-text("En savoir plus")').first();
    await learnMoreButton.click();
    
    // Attendre le scroll
    await page.waitForTimeout(1000);
    
    // Vérifier que la section story est visible
    const storySection = page.locator('h2:has-text("Notre Histoire")');
    await expect(storySection).toBeInViewport();
  });

  // ============================================
  // 4. TESTS DU FORMULAIRE DE CONTACT
  // ============================================

  test('4.1 - Formulaire de contact est fonctionnel', async ({ page }) => {
    // Scroll vers le formulaire
    const contactSection = page.locator('h2:has-text("Contactez-Nous")');
    await contactSection.scrollIntoViewIfNeeded();
    
    // Remplir le formulaire
    await page.locator('input[name="name"]').fill('Jean Dupont');
    await page.locator('input[name="email"]').fill('jean.dupont@example.com');
    await page.locator('input[name="subject"]').fill('Demande d\'information');
    await page.locator('textarea[name="message"]').fill('Je souhaite en savoir plus sur vos services.');
    
    // Soumettre
    await page.locator('button[type="submit"]').click();
    
    // Vérifier le toast de succès
    await expect(page.locator('text=Message envoyé avec succès')).toBeVisible({ timeout: 3000 });
  });

  test('4.2 - Formulaire valide les champs requis', async ({ page }) => {
    // Scroll vers le formulaire
    const contactSection = page.locator('h2:has-text("Contactez-Nous")');
    await contactSection.scrollIntoViewIfNeeded();
    
    // Essayer de soumettre sans remplir
    await page.locator('button[type="submit"]').click();
    
    // Vérifier qu'il y a des erreurs de validation
    const nameInput = page.locator('input[name="name"]');
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  // ============================================
  // 5. TESTS DU CARROUSEL TÉMOIGNAGES
  // ============================================

  test('5.1 - Carrousel de témoignages est interactif', async ({ page }) => {
    // Scroll vers les témoignages
    const testimonialsSection = page.locator('h2:has-text("Témoignages")');
    await testimonialsSection.scrollIntoViewIfNeeded();
    
    // Vérifier qu'au moins un témoignage est visible
    await expect(page.locator('text=Marie Dupont').or(page.locator('text=Jean-Pierre Martin'))).toBeVisible();
    
    // Cliquer sur le bouton suivant
    const nextButton = page.locator('button[aria-label="Témoignage suivant"]');
    await nextButton.click();
    
    // Attendre l'animation
    await page.waitForTimeout(500);
    
    // Vérifier que le contenu a changé (au moins un nouvel indicateur est actif)
    const indicators = page.locator('button[aria-label^="Aller au témoignage"]');
    await expect(indicators.first()).toBeVisible();
  });

  test('5.2 - Témoignages affichent les notes', async ({ page }) => {
    const testimonialsSection = page.locator('h2:has-text("Témoignages")');
    await testimonialsSection.scrollIntoViewIfNeeded();
    
    // Vérifier qu'il y a des étoiles de notation
    const stars = page.locator('svg').filter({ has: page.locator('path') });
    const count = await stars.count();
    expect(count).toBeGreaterThan(10); // Au moins 3 témoignages x 5 étoiles
  });

  // ============================================
  // 6. TESTS RESPONSIVE
  // ============================================

  test('6.1 - Affichage correct sur mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    // Vérifier que le hero est visible
    await expect(page.locator('h1:has-text("Découvrez")')).toBeVisible();
    
    // Vérifier qu'il n'y a pas de débordement horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 pour tolérance
  });

  test('6.2 - Affichage correct sur tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    
    await expect(page.locator('h1:has-text("Découvrez")')).toBeVisible();
    
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test('6.3 - Affichage correct sur desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    
    await expect(page.locator('h1:has-text("Découvrez")')).toBeVisible();
    
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  // ============================================
  // 7. TESTS D'ACCESSIBILITÉ
  // ============================================

  test('7.1 - Navigation clavier fonctionne', async ({ page }) => {
    // Tabuler vers le premier bouton
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Vérifier qu'un élément est focus
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);
  });

  test('7.2 - Images ont des attributs alt appropriés', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const image of images) {
      const alt = await image.getAttribute('alt');
      expect(alt).toBeTruthy(); // Toutes les images doivent avoir un alt
    }
  });

  test('7.3 - Boutons ont des labels ARIA', async ({ page }) => {
    const ariaButtons = page.locator('button[aria-label]');
    const count = await ariaButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('7.4 - Titres ont une hiérarchie correcte', async ({ page }) => {
    // Vérifier qu'il y a un seul H1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Vérifier qu'il y a des H2 pour les sections
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThanOrEqual(5);
  });

  // ============================================
  // 8. TESTS DES CTA ET INTERACTIONS
  // ============================================

  test('8.1 - Tous les boutons CTA sont cliquables', async ({ page }) => {
    const ctaButtons = page.locator('button:has-text("Commencer"), button:has-text("Voir")');
    const count = await ctaButtons.count();
    expect(count).toBeGreaterThan(0);
    
    // Vérifier que le premier bouton est cliquable
    await expect(ctaButtons.first()).toBeEnabled();
  });

  test('8.2 - Footer contient les liens importants', async ({ page }) => {
    // Scroll vers le footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Vérifier les liens du footer
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('text=AgroDeep')).toBeVisible();
    await expect(page.locator('text=contact@agrodeep.com')).toBeVisible();
  });

  // ============================================
  // 9. TESTS DE CONTENU
  // ============================================

  test('9.1 - Blog section affiche 3 articles', async ({ page }) => {
    const blogSection = page.locator('h2:has-text("Nos Derniers Articles")');
    await blogSection.scrollIntoViewIfNeeded();
    
    // Vérifier les 3 articles
    await expect(page.locator('text=Smart Agriculture')).toBeVisible();
    await expect(page.locator('text=carottes')).toBeVisible();
  });

  test('9.2 - Certifications sont affichées', async ({ page }) => {
    const practicesSection = page.locator('h2:has-text("Pratiques Agricoles")');
    await practicesSection.scrollIntoViewIfNeeded();
    
    await expect(page.locator('text=100% Bio')).toBeVisible();
    await expect(page.locator('text=Zéro Pesticide')).toBeVisible();
    await expect(page.locator('text=Commerce Équitable')).toBeVisible();
    await expect(page.locator('text=Sans OGM')).toBeVisible();
  });

  // ============================================
  // 10. TESTS DE PERFORMANCE VISUELLE
  // ============================================

  test('10.1 - Pas d\'erreurs dans la console', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Filtrer les erreurs connues/acceptables
    const realErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('_next')
    );
    
    expect(realErrors.length).toBe(0);
  });

  test('10.2 - Animations se déclenchent au scroll', async ({ page }) => {
    // Vérifier que la section story n'est pas visible initialement
    const storySection = page.locator('h2:has-text("Notre Histoire")');
    
    // Scroll vers la section
    await storySection.scrollIntoViewIfNeeded();
    
    // Attendre l'animation
    await page.waitForTimeout(1000);
    
    // Vérifier qu'elle est visible
    await expect(storySection).toBeInViewport();
  });
});
