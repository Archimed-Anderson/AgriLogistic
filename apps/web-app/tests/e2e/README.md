# Tests E2E Playwright - Auth & Connexion

## 📋 Vue d'ensemble

Cette suite de tests E2E utilise Playwright pour valider l'authentification (Better Auth), l'inscription, les redirections par rôle et le dashboard de connexion de l'application AgroLogistic.

## 🧪 Fichiers de tests

### `auth.spec.ts` — Scénarios E2E Auth (A à E)

Scénarios détaillés :

- **Scénario A** : Inscription & Connexion Agriculteur → `/register`, formulaire, redirection `/dashboard/agriculteur`, utilisateur connecté (Déconnexion ou contenu dashboard).
- **Scénario B** : Connexion Administrateur → Accès Rapide Admin, `/admin/dashboard`, éléments War Room visibles.
- **Scénario C** : Connexion Transporteur → Accès Rapide Transporteur, `/dashboard/transporter`, missions/flotte visibles.
- **Scénario D** : Erreur de Connexion → mauvais mot de passe, message d’erreur, formulaire visible, pas de redirection.
- **Scénario E** : Google Auth → clic « Se connecter avec Google », message explicite si non configuré (ou bouton désactivé).
- **Étape 4 — Performance** : Clic « Se connecter » (Accès Rapide Admin) → Dashboard affiché en **< 2 secondes**.
- **Étape 4 — Stabilité** : Après connexion Admin, clic « Déconnexion » → session détruite, retour sur page Login.

### `auth-complete.spec.ts` — Suite Auth complète (recommandé)

Valide **Sign In / Sign Up**, **redirections vers les bons dashboards** et **flux E2E** :

- ✅ **Redirections par rôle (Accès Rapide)** : Admin → `/admin/dashboard`, Agriculteur → `/dashboard/agriculteur`, Transporteur → `/dashboard/transporter`, Acheteur → `/dashboard/buyer`
- ✅ **Sign In** : erreur mauvais mot de passe ; connexion avec identifiants valides → redirection dashboard
- ✅ **Sign Up** : inscription Agriculteur / Acheteur / Transporteur → redirection vers le bon dashboard
- ✅ **OAuth** : message gracieux si Google non configuré
- ✅ **Déconnexion** : Accès Rapide Admin puis Déconnexion → `/login`

### `login-dashboard.spec.ts`

Tests complets du dashboard de connexion :

- ✅ Affichage et structure de la page
- ✅ Validation des champs (email, mot de passe)
- ✅ Soumission du formulaire
- ✅ Gestion des erreurs
- ✅ Formulaire mot de passe oublié
- ✅ Interactions utilisateur
- ✅ Design et UI

### `login-api-integration.spec.ts`

Tests d'intégration avec l'API backend :

- ✅ Envoi des données correctes à l'API
- ✅ Gestion des erreurs API (401, 429, 500)
- ✅ Stockage des tokens après connexion
- ✅ Intégration mot de passe oublié

### `login-accessibility.spec.ts`

Tests d'accessibilité (WCAG AA) :

- ✅ Contraste des couleurs
- ✅ Labels accessibles
- ✅ Navigation au clavier
- ✅ Attributs ARIA
- ✅ Messages d'erreur accessibles
- ✅ Compatibilité lecteurs d'écran

## 🚀 Exécution des tests

### Installation

```bash
cd apps/web-app
pnpm install
pnpm exec playwright install
```

Les dépendances Playwright sont déjà déclarées dans `package.json` (`@playwright/test`). La configuration se trouve dans `playwright.config.ts` (racine de `apps/web-app`).

### Exécuter tous les tests

```bash
pnpm test:e2e
```

### Exécuter avec l'interface UI

```bash
pnpm test:e2e:ui
```

### Exécuter en mode headed (avec navigateur visible)

```bash
pnpm test:e2e:headed
```

### Exécuter en mode debug

```bash
pnpm test:e2e:debug
```

### Exécuter un fichier spécifique

```bash
pnpm exec playwright test tests/e2e/login-dashboard.spec.ts
```

### Exécuter un test spécifique

```bash
pnpm exec playwright test tests/e2e/login-dashboard.spec.ts -g "devrait afficher la page de connexion"
```

## 📊 Rapports

Après l'exécution des tests, un rapport HTML est généré dans `playwright-report/`.

Pour visualiser le rapport :

```bash
pnpm test:e2e:report
```

## 🔧 Configuration

La configuration Playwright se trouve dans `playwright.config.ts`.

### Navigateurs testés

- ✅ Chromium (Desktop Chrome)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

### Variables d'environnement

- `PLAYWRIGHT_BASE_URL` : URL de base (défaut : `http://localhost:3000`, utilisé dans `playwright.config.ts`)
- `CI` : Mode CI/CD (retries, workers, pas de `reuseExistingServer`)

## 📝 Écriture de nouveaux tests

### Structure d'un test

```typescript
import { test, expect } from '@playwright/test';

test('description du test', async ({ page }) => {
  await page.goto('/login');

  // Actions
  await page.getByLabel('Email').fill('test@example.com');

  // Assertions
  await expect(page.getByText('Succès')).toBeVisible();
});
```

### Bonnes pratiques

1. **Utiliser des sélecteurs accessibles** : `getByRole`, `getByLabel`, `getByText`
2. **Attendre les éléments** : Utiliser `toBeVisible()`, `toBeEnabled()`, etc.
3. **Gérer les timeouts** : Spécifier des timeouts appropriés pour les actions asynchrones
4. **Isoler les tests** : Chaque test doit être indépendant
5. **Mock les API** : Utiliser `page.route()` pour intercepter les requêtes API

## 🐛 Débogage

### Mode debug interactif

```bash
pnpm test:e2e:debug
```

### Captures d'écran et vidéos

Les captures d'écran et vidéos sont automatiquement sauvegardées en cas d'échec dans `test-results/`.

### Traces

Les traces Playwright sont collectées en cas d'échec. Pour les visualiser :

```bash
pnpm exec playwright show-trace test-results/path-to-trace.zip
```

## 🔍 Tests de régression visuelle

Pour ajouter des tests de régression visuelle, utilisez `toHaveScreenshot()` :

```typescript
await expect(page).toHaveScreenshot('login-page.png');
```

## 📚 Ressources

- [Documentation Playwright](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-test)
