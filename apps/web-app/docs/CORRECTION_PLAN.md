# 📋 PLAN DE CORRECTION - Système de Login Multi-Utilisateur

**Date:** 26 Janvier 2026  
**Version:** 1.0  
**Statut:** ⚠️ À IMPLÉMENTER

---

## 🎯 OBJECTIFS

Corriger les 5 problèmes critiques identifiés dans l'audit pour rendre le système d'authentification multi-utilisateur pleinement opérationnel.

---

## 📅 PHASE 1: CORRECTIONS CRITIQUES (Jours 1-3)

### ✅ Tâche 1.1: Implémenter la Redirection par Rôle

**Fichier:** `src/lib/hooks/use-auth.tsx`

**Modifications:**

1. Créer une fonction `getDashboardPath(role: string)`
2. Remplacer la redirection hardcodée ligne 93
3. Ajouter la gestion des cas d'erreur (rôle inconnu)

**Code à ajouter:**

```typescript
const getDashboardPath = (role: string): string => {
  const roleMap: Record<string, string> = {
    admin: '/dashboard/admin',
    farmer: '/dashboard/farmer',
    buyer: '/dashboard/buyer',
    transporter: '/dashboard/transporter',
  };
  const normalizedRole = role.toLowerCase();
  return roleMap[normalizedRole] || '/dashboard/farmer'; // Fallback
};
```

**Estimation:** 2 heures

---

### ✅ Tâche 1.2: Ajouter la Sélection de Rôle dans le Formulaire

**Fichier:** `src/components/auth/LoginForm.tsx`

**Modifications:**

1. Ajouter un état pour le rôle sélectionné
2. Créer un composant de sélection de rôle (Radio buttons ou Select)
3. Valider que le rôle correspond à l'utilisateur connecté
4. Mettre à jour le schéma de validation Zod

**Composant à créer:** `src/components/auth/RoleSelector.tsx`

**Estimation:** 4 heures

---

### ✅ Tâche 1.3: Créer les Routes Dashboard Manquantes

**Fichiers à créer:**

1. `src/app/dashboard/admin/page.tsx`
2. `src/app/dashboard/buyer/page.tsx`
3. `src/app/dashboard/transporter/page.tsx`
4. `src/components/dashboard/AdminDashboard.tsx`
5. `src/components/dashboard/BuyerDashboard.tsx`
6. `src/components/dashboard/TransporterDashboard.tsx`

**Estimation:** 8 heures (2h par dashboard)

---

## 📅 PHASE 2: SÉCURITÉ ET MIDDLEWARE (Jours 4-5)

### ✅ Tâche 2.1: Créer le Middleware de Protection

**Fichier:** `src/middleware.ts` (nouveau)

**Fonctionnalités:**

- Vérification de l'authentification
- Vérification des permissions par rôle
- Redirection vers login si non authentifié
- Redirection vers dashboard approprié si accès non autorisé

**Estimation:** 6 heures

---

### ✅ Tâche 2.2: Implémenter la Validation du Token

**Fichier:** `src/lib/hooks/use-auth.tsx`

**Modifications:**

1. Créer une fonction `fetchUserProfile()`
2. Appeler `/auth/me` pour valider le token
3. Gérer le refresh token automatiquement
4. Gérer les tokens expirés

**Estimation:** 4 heures

---

## 📅 PHASE 3: LAYOUTS ET UX (Jours 6-7)

### ✅ Tâche 3.1: Créer des Layouts Spécifiques par Rôle

**Fichiers à créer:**

1. `src/app/dashboard/admin/layout.tsx`
2. `src/app/dashboard/buyer/layout.tsx`
3. `src/app/dashboard/transporter/layout.tsx`

**Fonctionnalités:**

- Sidebar avec navigation spécifique au rôle
- Header avec informations utilisateur
- Menu contextuel selon les permissions

**Estimation:** 8 heures

---

### ✅ Tâche 3.2: Améliorer le Design du Formulaire de Login

**Fichier:** `src/components/auth/LoginForm.tsx`

**Améliorations:**

- Design moderne avec icônes pour chaque rôle
- Cartes interactives pour la sélection de rôle
- Descriptions pour chaque type de compte
- Animations et transitions

**Estimation:** 4 heures

---

## 📊 RÉCAPITULATIF

| Phase     | Tâches       | Estimation    | Priorité    |
| --------- | ------------ | ------------- | ----------- |
| Phase 1   | 3 tâches     | 14 heures     | 🔴 Critique |
| Phase 2   | 2 tâches     | 10 heures     | 🟡 Majeur   |
| Phase 3   | 2 tâches     | 12 heures     | 🟡 Majeur   |
| **TOTAL** | **7 tâches** | **36 heures** |             |

**Durée estimée:** 5-7 jours de développement

---

## ✅ CHECKLIST DE VALIDATION

### Phase 1

- [ ] Redirection fonctionnelle pour tous les rôles
- [ ] Sélection de rôle dans le formulaire
- [ ] Routes dashboard créées et accessibles
- [ ] Tests E2E passants pour chaque rôle

### Phase 2

- [ ] Middleware de protection implémenté
- [ ] Validation du token fonctionnelle
- [ ] Tests de sécurité validés
- [ ] Gestion des tokens expirés

### Phase 3

- [ ] Layouts spécifiques créés
- [ ] Navigation adaptée par rôle
- [ ] Design du formulaire amélioré
- [ ] Tests d'accessibilité validés

---

## 🧪 TESTS À EFFECTUER

### Tests E2E (Playwright)

- [ ] Connexion Admin → Redirection `/dashboard/admin`
- [ ] Connexion Agriculteur → Redirection `/dashboard/farmer`
- [ ] Connexion Acheteur → Redirection `/dashboard/buyer`
- [ ] Connexion Transporteur → Redirection `/dashboard/transporter`
- [ ] Tentative d'accès non autorisé → Redirection appropriée

### Tests de Sécurité

- [ ] Token expiré → Déconnexion automatique
- [ ] Accès dashboard non autorisé → Refusé
- [ ] Protection CSRF → Validée
- [ ] Rate limiting → Fonctionnel

### Tests d'Accessibilité

- [ ] Navigation au clavier → Complète
- [ ] Lecteurs d'écran → Compatible
- [ ] Contraste des couleurs → WCAG AA

---

## 📝 NOTES IMPORTANTES

1. **Compatibilité:** S'assurer que les modifications sont rétrocompatibles avec les utilisateurs existants
2. **Migration:** Prévoir une migration pour les utilisateurs sans rôle défini
3. **Documentation:** Mettre à jour la documentation utilisateur et développeur
4. **Monitoring:** Ajouter des logs pour tracer les redirections et les accès

---

**Fin du Plan de Correction**
