import { test, expect, type Page } from '@playwright/test';
import { TEST_ACCOUNTS } from './test-data/modern-login-accounts';

async function dismissConsentBanner(page: Page) {
  // Consent banner can intercept clicks on mobile.
  const banner = page.locator('text=/Cookies & mesure d\\x27audience|Cookies & mesure d'audience/i').first();
  if (await banner.count()) {
    const accept = page.getByRole('button', { name: /Accepter/i }).first();
    const refuse = page.getByRole('button', { name: /Refuser/i }).first();
    if (await accept.isVisible().catch(() => false)) {
      // Prefer refusing to keep analytics disabled in tests
      if (await refuse.isVisible().catch(() => false)) {
        await refuse.click({ timeout: 5000, force: true });
      } else {
        await accept.click({ timeout: 5000, force: true });
      }
    }
  }
}

async function waitForAdminDashboard(page: Page) {
  const adminPanel = page.locator('aside').first().getByText('Admin Panel');
  const dashboardMarker = page.getByText('Bonjour !');
  try {
    await Promise.any([
      adminPanel.waitFor({ state: 'visible', timeout: 15000 }),
      dashboardMarker.waitFor({ state: 'visible', timeout: 15000 }),
    ]);
  } catch {
    const asideCount = await page.locator('aside').count();
    const hasLoginCTA = await page.getByRole('button', { name: /^Connexion$/ }).count();
    const bodyText = await page.evaluate(() => (document.body?.innerText || '').slice(0, 400));
    throw new Error(
      `Admin dashboard not reached (timeout). asideCount=${asideCount} loginCtaCount=${hasLoginCTA} bodyText=${JSON.stringify(bodyText)}`
    );
  }
}

async function clickAgroLogisticLogo(page: Page) {
  const logoBtn = page.getByRole('button', { name: /AgroLogistic/i }).first();
  if (await logoBtn.isVisible().catch(() => false)) {
    await logoBtn.click({ timeout: 15000 });
  }
}

async function gotoAuthViaNavbar(page: Page) {
  // Assumes we are not authenticated.
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await dismissConsentBanner(page);
  // App uses internal routing; URL may not change, so navigate via UI.
  const nav = page.locator('nav');
  const loginCta = nav.getByRole('button', { name: /^Connexion$/ }).first();
  await expect(loginCta).toBeVisible();
  await loginCta.click();

  // Auth screen should be visible (ModernAuthPage), but if a session is restored it may redirect immediately.
  const passwordInput = page.locator('#login-password');
  const redirectedToDashboard = page.locator('aside').first().getByText('Admin Panel');
  await Promise.race([
    passwordInput.waitFor({ state: 'visible', timeout: 15000 }),
    redirectedToDashboard.waitFor({ state: 'visible', timeout: 15000 }),
  ]);
}

async function loginAsAdmin(page: Page) {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(`[pageerror] ${err?.message || String(err)}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      pageErrors.push(`[console.error] ${msg.text()}`);
    }
  });

  // Isolated E2E: bypass UI login by injecting a MockAuth token.
  // MockAuthAdapter can reconstruct the user from this token after refresh.
  await page.addInitScript(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('accessToken', `mock-jwt-token-admin-001-${Date.now()}`);
    } catch {
      // ignore
    }
  });

  // With real URL routing, we can go straight to the admin dashboard route.
  await page.goto('/admin/overview', { waitUntil: 'domcontentloaded' });
  await dismissConsentBanner(page);

  // If the app crashes before rendering, surface console/page errors.
  if (pageErrors.length) {
    throw new Error(pageErrors.slice(0, 8).join('\n'));
  }

  await waitForAdminDashboard(page);
  await expect(page.locator('aside').first().getByText('Admin Panel')).toBeVisible();
}

async function openSidebarIfMobile(page: Page) {
  const hamburger = page.getByLabel('Ouvrir le menu');
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await expect(page.getByLabel('Fermer le menu')).toBeVisible();
  }
}

test.describe('Dashboard après connexion (admin) - UI & régressions', () => {
  test('login admin -> dashboard visible + sidebar footer présent', async ({ page }) => {
    await loginAsAdmin(page);

    // Dashboard (FarmVista) must be visible
    await expect(page.getByText('Bonjour !')).toBeVisible();
    await expect(page.getByText('Production Overview')).toBeVisible();
    await expect(page.getByText('Analyse de rendement mensuel')).toBeVisible();

    // Sidebar checks
    await openSidebarIfMobile(page);
    const sidebar = page.locator('aside').first();
    await expect(sidebar.getByText('AgriLogistic')).toBeVisible();

    // Core modules
    await expect(sidebar.getByRole('button', { name: /^Dashboard$/ })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /Météo/i })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /Sol & Irrigation/i })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /Rapports/i })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /Mon compte/i })).toBeVisible();

    // Footer (FarmVista-like)
    await expect(sidebar.getByRole('button', { name: /Aide & Support/i })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /Déconnexion/i })).toBeVisible();
  });

  test('interactions clés: favoris + collapse/tooltip + Ctrl/Cmd+K search', async ({ page }, testInfo) => {
    await loginAsAdmin(page);

    await openSidebarIfMobile(page);
    const sidebar = page.locator('aside').first();

    // Favorite toggle should work (hover reveals star)
    const usersItem = sidebar.getByRole('button', { name: /Gestion Utilisateurs/i }).first();
    await usersItem.hover();
    const favAdd = sidebar.getByTitle('Ajouter aux favoris').first();
    await expect(favAdd).toBeVisible();
    await favAdd.click();
    const favRemove = sidebar.getByTitle('Retirer des favoris').first();
    await expect(favRemove).toBeVisible();

    // Desktop-only: collapse + tooltip
    if (!/Mobile/i.test(testInfo.project.name)) {
      const collapseBtn = sidebar.getByLabel(/Réduire le menu|Étendre le menu/i).first();
      if (await collapseBtn.isVisible()) {
        await collapseBtn.click();

        // Label should not be visible inside sidebar when collapsed
        await expect(sidebar.getByText('Gestion Utilisateurs')).not.toBeVisible();

        // Tooltip should appear on hover (skip on webkit: flaky hover CSS in headless)
        if (!/webkit/i.test(testInfo.project.name)) {
          const iconBtn = sidebar.locator('button[title="Gestion Utilisateurs"]').first();
          await iconBtn.hover();
          await expect(page.getByText('Gestion Utilisateurs')).toBeVisible();
        }

        // Expand back for next checks
        await collapseBtn.click();
        await expect(sidebar.getByText('Gestion Utilisateurs')).toBeVisible();
      }
    }

    // Ctrl/Cmd+K search palette should open and navigate to Weather
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    await expect(page.getByPlaceholder('Rechercher un moduleâ€¦')).toBeVisible();
    await page.getByPlaceholder('Rechercher un moduleâ€¦').fill('météo');
    await page.getByRole('button', { name: /Météo/i }).first().click();

    // Weather module should render
    await expect(page.getByRole('heading', { name: /Météo Agricole/i })).toBeVisible();
  });

  test('responsive: hamburger ouvre/ferme le sidebar (mobile)', async ({ page }) => {
    await loginAsAdmin(page);

    const hamburger = page.getByLabel('Ouvrir le menu');
    if (!(await hamburger.isVisible())) {
      test.skip(true, 'Hamburger only visible on mobile viewports.');
    }

    await hamburger.click();
    await expect(page.getByLabel('Fermer le menu')).toBeVisible();
    await expect(page.locator('aside').first()).toBeVisible();

    // Close using ESC (more reliable than clicking overlay coordinates)
    await page.keyboard.press('Escape');
    await expect(page.getByLabel('Fermer le menu')).toBeHidden();
    // Sidebar stays in DOM but should be off-canvas
    await expect(page.locator('aside').first()).toHaveClass(/-translate-x-full/);
  });
});



