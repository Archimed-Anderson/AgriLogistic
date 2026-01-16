# 🤝 Contributing to AgroDeep

Merci de contribuer à AgroDeep ! Ce document vous guide dans le processus de contribution.

## 📋 Table des Matières

1. [Code de Conduite](#code-de-conduite)
2. [Comment Contribuer](#comment-contribuer)
3. [Setup Développement](#setup-développement)
4. [Standards de Code](#standards-de-code)
5. [Process de Pull Request](#process-de-pull-request)
6. [Reporting Bugs](#reporting-bugs)
7. [Suggesting Enhancements](#suggesting-enhancements)

---

## 📜 Code de Conduite

En participant à ce projet, vous acceptez de respecter notre [Code de Conduite](./CODE_OF_CONDUCT.md).

Soyez respectueux, inclusif et professionnel dans toutes vos interactions.

---

## 🚀 Comment Contribuer

### Types de Contributions

Nous accueillons les contributions suivantes :

- 🐛 **Bug Fixes** - Correction de bugs
- ✨ **Features** - Nouvelles fonctionnalités
- 📚 **Documentation** - Amélioration de la documentation
- 🎨 **UI/UX** - Améliorations d'interface
- ⚡ **Performance** - Optimisations
- 🧪 **Tests** - Ajout ou amélioration de tests
- ♻️ **Refactoring** - Amélioration du code existant

---

## 🛠️ Setup Développement

### 1. Fork & Clone

```bash
# Fork le repository sur GitHub
# Puis clone ton fork

git clone https://github.com/TON-USERNAME/agrodeep-platform.git
cd agrodeep-platform

# Ajoute le repository original comme remote
git remote add upstream https://github.com/agrodeep/agrodeep-platform.git
```

### 2. Installation

```bash
# Installe les dépendances
pnpm install

# Copie les variables d'environnement
cp .env.example .env

# Lance le dev server
pnpm dev
```

### 3. Créer une Branche

```bash
# Sync avec upstream
git fetch upstream
git checkout main
git merge upstream/main

# Crée une nouvelle branche
git checkout -b feature/ma-nouvelle-fonctionnalite
```

---

## 📐 Standards de Code

### Git Commit Messages

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/).

#### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types

| Type | Description | Exemple |
|------|-------------|---------|
| `feat` | Nouvelle fonctionnalité | `feat(auth): add password reset` |
| `fix` | Correction de bug | `fix(cart): resolve quantity update bug` |
| `docs` | Documentation uniquement | `docs(readme): update installation steps` |
| `style` | Formatting, semicolons, etc | `style(button): fix spacing` |
| `refactor` | Refactoring de code | `refactor(order): extract validation logic` |
| `test` | Ajout de tests | `test(auth): add login tests` |
| `chore` | Maintenance, deps | `chore(deps): update react to 18.3` |
| `perf` | Performance | `perf(list): optimize rendering` |
| `ci` | CI/CD changes | `ci(github): add deploy workflow` |

#### Exemples

```bash
# Good ✅
git commit -m "feat(transport): add cost calculator component"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(api): update endpoint documentation"

# Bad ❌
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "Update file.tsx"
```

### TypeScript

#### Types Stricts

```typescript
// ✅ GOOD
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = (id: string): Promise<User> => {
  // ...
};

// ❌ BAD
const getUser = (id: any): any => {
  // ...
};
```

#### Éviter any

```typescript
// ✅ GOOD
const processData = <T>(data: T[]): T[] => {
  return data.filter(item => item !== null);
};

// ❌ BAD
const processData = (data: any): any => {
  return data.filter(item => item !== null);
};
```

### React Components

#### Functional Components

```typescript
// ✅ GOOD
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart
}) => {
  return (
    <Card>
      <h3>{product.name}</h3>
      <button onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </button>
    </Card>
  );
};

// ❌ BAD
export const ProductCard = (props) => {
  return (
    <div>
      <h3>{props.product.name}</h3>
      <button onClick={() => props.onAddToCart(props.product.id)}>
        Add to Cart
      </button>
    </div>
  );
};
```

#### Hooks

```typescript
// ✅ GOOD
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load products
  }, []);

  return { products, loading };
};

// ❌ BAD
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Missing dependencies
  useEffect(() => {
    loadProducts();
  }, []);

  return { products, loading };
};
```

### CSS / Tailwind

```tsx
// ✅ GOOD - Tailwind avec classes lisibles
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <Avatar />
  <div>
    <h3 className="text-lg font-semibold">{name}</h3>
    <p className="text-sm text-gray-600">{role}</p>
  </div>
</div>

// ❌ BAD - Classes inline trop longues
<div className="flex items-center justify-between gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
  {/* ... */}
</div>
```

### Testing

#### Tous les Tests Doivent Passer

```bash
# Avant de commit
pnpm test

# Tests E2E
pnpm test:e2e
```

#### Coverage Minimum

```
Domain Layer: 100%
Application Layer: 90%
Presentation Layer: 80%
```

---

## 🔄 Process de Pull Request

### 1. Checklist Avant PR

- [ ] Code compile sans erreurs
- [ ] Tous les tests passent (`pnpm test`)
- [ ] Lint passe (`pnpm lint`)
- [ ] Format respecté (`pnpm format`)
- [ ] Documentation mise à jour si nécessaire
- [ ] Commits suivent Conventional Commits
- [ ] Branch à jour avec `main`

### 2. Créer la Pull Request

```bash
# Push ta branche
git push origin feature/ma-fonctionnalite

# Crée la PR sur GitHub
# Remplis le template de PR
```

### 3. Template de PR

```markdown
## Description
Brève description de ce que fait cette PR.

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Pas de warnings ESLint
- [ ] Tests passent localement

## Screenshots (si applicable)
[Ajoute des screenshots]

## Contexte additionnel
Plus de détails si nécessaire.
```

### 4. Code Review

- Un reviewer assigné examinera ton code
- Réponds aux commentaires de manière constructive
- Effectue les changements demandés
- Re-demande une review après modifications

### 5. Merge

- La PR sera mergée par un mainteneur après approbation
- Squash merge par défaut
- Delete branch après merge

---

## 🐛 Reporting Bugs

### Avant de Reporter

1. Vérifie que le bug n'a pas déjà été reporté
2. Assure-toi d'utiliser la dernière version
3. Vérifie que ce n'est pas un problème de configuration

### Template de Bug Report

```markdown
## Description du Bug
Description claire du bug.

## Steps to Reproduce
1. Va sur '...'
2. Clique sur '...'
3. Scroll jusqu'à '...'
4. Vois l'erreur

## Comportement Attendu
Ce qui devrait se passer.

## Comportement Actuel
Ce qui se passe réellement.

## Screenshots
Si applicable.

## Environnement
- OS: [e.g., macOS 13.2]
- Browser: [e.g., Chrome 110]
- Node: [e.g., 18.14.0]
- Version: [e.g., 2.1.0]

## Logs
```
Colle les logs d'erreur ici
```

## Contexte Additionnel
Autres informations pertinentes.
```

---

## ✨ Suggesting Enhancements

### Template de Feature Request

```markdown
## Résumé de la Fonctionnalité
Description brève de la fonctionnalité.

## Motivation
Pourquoi cette fonctionnalité est nécessaire ?

## Cas d'Utilisation
Comment cette fonctionnalité serait utilisée ?

## Solution Proposée
Comment imagines-tu l'implémentation ?

## Alternatives Considérées
Quelles autres solutions as-tu envisagées ?

## Impact
- [ ] Breaking change
- [ ] Nouvel endpoint API
- [ ] Nouvelle dépendance
- [ ] Migration nécessaire

## Mockups (si applicable)
Ajoute des designs ou wireframes.
```

---

## 📚 Documentation

### Quand Mettre à Jour la Documentation

- Nouvelle fonctionnalité ajoutée
- API publique modifiée
- Configuration changée
- Nouveaux concepts introduits

### Où Documenter

```
docs/
├── ARCHITECTURE.md      # Architecture overview
├── DEVELOPMENT_GUIDE.md # Guide développement
├── API_DOCUMENTATION.md # Documentation API
└── guides/             # Guides spécifiques
```

---

## 🎨 Style Guide

### Naming Conventions

```typescript
// Components: PascalCase
export const ProductCard = () => {};

// Hooks: camelCase with "use" prefix
export const useAuth = () => {};

// Functions: camelCase
export const calculateTotal = () => {};

// Constants: UPPER_SNAKE_CASE
export const API_BASE_URL = '';

// Types/Interfaces: PascalCase
export interface User {}
export type Status = 'active' | 'inactive';
```

### File Naming

```
// Components
ProductCard.tsx
UserProfile.tsx

// Hooks
useAuth.ts
useProducts.ts

// Utils
string.helper.ts
date.helper.ts

// Tests
ProductCard.spec.tsx
useAuth.spec.ts
```

---

## 🔍 Code Review Guidelines

### Pour les Reviewers

- Sois constructif et respectueux
- Explique le "pourquoi" des changements suggérés
- Approuve si c'est bon, demande des changements sinon
- Réponds rapidement (< 48h)

### Pour les Contributeurs

- Ne prends pas les commentaires personnellement
- Demande des clarifications si nécessaire
- Résous tous les commentaires
- Re-demande une review après changements

---

## 🏆 Recognition

Les contributeurs seront reconnus :

- Dans le [CHANGELOG](../CHANGELOG.md)
- Dans le [README](../README.md) (contributeurs majeurs)
- Badge "Contributor" sur GitHub

---

## 📞 Besoin d'Aide ?

- 💬 **Discord**: [Lien Discord]
- 📧 **Email**: dev@agrodeep.com
- 📖 **Documentation**: [docs.agrodeep.com](https://docs.agrodeep.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/agrodeep/agrodeep-platform/issues)

---

## 📝 License

En contribuant, vous acceptez que vos contributions soient licensées sous la [MIT License](../LICENSE).

---

**Merci pour votre contribution ! 🙏🌾**
