# Tests E2E Playwright - Dashboard de Connexion

## 📋 Vue d'ensemble

Cette suite de tests E2E utilise Playwright pour valider complètement le dashboard de connexion de l'application AgroLogistic.

## 🧪 Fichiers de tests

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

- `BASE_URL`: URL de base de l'application (défaut: `http://localhost:3002`)
- `CI`: Mode CI/CD (définit les retries et workers)

## 📝 Écriture de nouveaux tests

### Structure d'un test

```typescript
import { test, expect } from '@playwright/test'

test('description du test', async ({ page }) => {
  await page.goto('/login')
  
  // Actions
  await page.getByLabel('Email').fill('test@example.com')
  
  // Assertions
  await expect(page.getByText('Succès')).toBeVisible()
})
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
await expect(page).toHaveScreenshot('login-page.png')
```

## 📚 Ressources

- [Documentation Playwright](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-test)
