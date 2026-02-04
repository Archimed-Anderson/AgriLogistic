# 🔧 Correction Erreur Runtime - Context Provider

**Date :** 1er Février 2025  
**Erreur :** `TypeError: Cannot read properties of undefined (reading 'call')`  
**Cause :** Conflit Server Component / Client Component dans `layout.tsx`

---

## 1. PROBLÈME IDENTIFIÉ

### Erreur originale
```
TypeError: Cannot read properties of undefined (reading 'call')
Source: src/context/CartContext.tsx
Call Stack: webpack.js → CartContext.tsx → layout.js
```

### Cause racine
- `layout.tsx` est un **Server Component** par défaut (Next.js 14 App Router)
- `CartContext.tsx` et `AuthContext.tsx` utilisent `'use client'` (Client Components)
- Importation directe de Client Components dans un Server Component cause des erreurs webpack
- Utilisation de `localStorage` sans vérification `typeof window` peut causer des problèmes d'hydratation

---

## 2. SOLUTION IMPLÉMENTÉE

### 2.1 Création d'un wrapper Client Provider

**Fichier créé :** `src/components/providers/ClientProviders.tsx`

```typescript
'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'sonner';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster position="top-right" richColors />
      </CartProvider>
    </AuthProvider>
  );
}
```

**Avantages :**
- Isolation complète des Client Components (AuthProvider, CartProvider, Toaster)
- Boundary claire entre Server et Client
- Facilite l'ajout de futurs providers (Theme, Notifications, etc.)
- Toaster de Sonner correctement placé dans le contexte client

### 2.2 Mise à jour de `layout.tsx`

**Avant :**
```typescript
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Après :**
```typescript
import { ClientProviders } from '@/components/providers/ClientProviders';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
```

**Note :** Le `Toaster` de Sonner est maintenant dans `ClientProviders.tsx` car c'est un Client Component.

### 2.3 Sécurisation de `CartContext.tsx`

**Ajout de vérifications `typeof window`** pour éviter les erreurs SSR :

```typescript
// Load cart from local storage on mount
useEffect(() => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('agromarket-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }
}, []);

// Save cart to local storage when it changes
useEffect(() => {
  if (typeof window !== 'undefined' && cart.length >= 0) {
    localStorage.setItem('agromarket-cart', JSON.stringify(cart));
  }
}, [cart]);
```

---

## 3. FICHIERS MODIFIÉS

| Fichier | Action | Raison |
|---------|--------|--------|
| `src/components/providers/ClientProviders.tsx` | ✅ Créé | Wrapper pour tous les Client Providers (Auth, Cart, Toaster) |
| `src/app/layout.tsx` | 🔧 Modifié | Utilise `ClientProviders` au lieu d'imports directs, suppression import Toaster |
| `src/context/CartContext.tsx` | 🔧 Modifié | Ajout de vérifications `typeof window` pour localStorage |

---

## 4. BONNES PRATIQUES NEXT.JS 14

### Server Components vs Client Components

| Type | Usage | Exemples |
|------|-------|----------|
| **Server Component** | Par défaut, pas d'interactivité | `layout.tsx`, pages de contenu statique |
| **Client Component** | `'use client'`, hooks React, événements | Contexts, formulaires, états interactifs |

### Règles d'import
1. ❌ Ne pas importer de Client Component directement dans un Server Component
2. ✅ Créer un wrapper Client Component pour isoler les providers
3. ✅ Utiliser `typeof window !== 'undefined'` pour les APIs du navigateur

### Pattern recommandé pour les Providers

```
layout.tsx (Server Component)
  └─ ClientProviders.tsx ('use client')
      ├─ AuthProvider
      ├─ CartProvider
      ├─ children
      ├─ Toaster (Sonner)
      └─ ThemeProvider (futur)
```

**Important :** Tous les composants qui utilisent des hooks React (`useState`, `useEffect`, `useContext`) ou des APIs du navigateur (`localStorage`, `window`) doivent être dans le wrapper Client ou marqués avec `'use client'`.

---

## 5. VÉRIFICATION

### Tests de compilation
```bash
✓ Compiled / in 12.5s (1843 modules)
✓ Compiled /admin/governance/rbac in 1119ms (1887 modules)
✓ Ready in 1952ms
```

### Tests fonctionnels
- ✅ Authentification (login/logout)
- ✅ Panier (add/remove/update)
- ✅ Navigation entre pages
- ✅ Hydratation SSR sans erreurs

---

## 6. PRÉVENTION FUTURE

### Checklist pour nouveaux Contexts
- [ ] Marquer avec `'use client'` si utilise hooks React
- [ ] Vérifier `typeof window` pour APIs navigateur
- [ ] Ajouter au `ClientProviders.tsx` au lieu de `layout.tsx`
- [ ] Tester en mode production (`pnpm build`)

### Commandes de diagnostic
```bash
# Vérifier les erreurs de build
pnpm build

# Analyser les bundles
pnpm analyze

# Tester en mode production
pnpm start
```

---

## 7. RESSOURCES

- [Next.js 14 Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Context in Server Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#using-context-providers)

---

**Statut :** ✅ Résolu  
**Impact :** Aucune régression fonctionnelle, amélioration de la structure
