# 🧪 TESTS EXHAUSTIFS - Phase 1

**Date:** 26 Janvier 2026  
**Version:** 1.0  
**Statut:** ✅ **PRÊT POUR TESTS**

---

## 📋 CHECKLIST DE VALIDATION

### ✅ 1. BUILD ET COMPILATION

- [x] **Build Next.js réussi** - `pnpm build` passe sans erreur
- [x] **TypeScript valide** - Aucune erreur de type
- [x] **Routes générées** - Toutes les pages sont compilées :
  - `/` (Landing Page)
  - `/login`
  - `/register`
  - `/dashboard/admin`
  - `/dashboard/buyer`
  - `/dashboard/farmer`
  - `/dashboard/transporter`

**Résultat:** ✅ **PASSÉ**

---

### ✅ 2. LANCEMENT DE L'APPLICATION

#### Test 2.1: Démarrage du serveur de développement

```bash
cd apps/web-app
pnpm dev
```

**Vérifications:**

- [ ] Le serveur démarre sans erreur
- [ ] Aucune erreur dans la console
- [ ] Le serveur écoute sur le port attendu (3000 ou 3002)
- [ ] Message "Ready" affiché

**Résultat:** ⏳ **À TESTER**

---

### ✅ 3. LANDING PAGE (Route `/`)

#### Test 3.1: Affichage de la Landing Page

**Actions:**

1. Ouvrir `http://localhost:3000` (ou `http://localhost:3002`)
2. Vérifier l'affichage de la page

**Vérifications:**

- [ ] La page se charge sans erreur
- [ ] Le logo "AgroLogistic" est visible en haut à gauche
- [ ] La navbar est visible avec les liens (Fonctionnalités, Comment ça marche, Tarifs, Contact)
- [ ] Le bouton "Connexion" est visible en haut à droite
- [ ] Le bouton "Créer un compte" est visible (peut être masqué sur mobile)
- [ ] La section Hero est visible avec le titre principal
- [ ] Les boutons "Commencer" et "Se connecter" sont visibles dans le Hero
- [ ] La section "Fonctionnalités" est visible avec 4 cartes
- [ ] La section "Comment ça marche" est visible
- [ ] Le footer est visible en bas de page
- [ ] Aucune erreur dans la console du navigateur

**Résultat:** ⏳ **À TESTER**

#### Test 3.2: Navigation depuis la Landing Page

**Actions:**

1. Cliquer sur le bouton "Connexion" dans la navbar (en haut à droite)
2. Vérifier la redirection

**Vérifications:**

- [ ] La redirection vers `/login` fonctionne
- [ ] L'URL change pour `http://localhost:3000/login`
- [ ] La page de login s'affiche correctement
- [ ] Aucune erreur 404

**Résultat:** ⏳ **À TESTER**

#### Test 3.3: Navigation vers l'inscription

**Actions:**

1. Depuis la landing page, cliquer sur "Commencer" ou "Créer un compte"
2. Vérifier la redirection

**Vérifications:**

- [ ] La redirection vers `/register` fonctionne
- [ ] L'URL change pour `http://localhost:3000/register`
- [ ] La page d'inscription s'affiche correctement

**Résultat:** ⏳ **À TESTER**

---

### ✅ 4. PAGE DE LOGIN (Route `/login`)

#### Test 4.1: Affichage de la Page de Login

**Actions:**

1. Naviguer vers `http://localhost:3000/login`
2. Vérifier l'affichage

**Vérifications:**

- [ ] La page se charge sans erreur
- [ ] Le design split-screen est visible (bannière à gauche sur desktop, masquée sur mobile)
- [ ] Le formulaire de connexion est visible à droite (ou centré sur mobile)
- [ ] Le sélecteur de type de compte (RoleSelector) est visible avec 4 options :
  - [ ] Administrateur
  - [ ] Agriculteur
  - [ ] Acheteur
  - [ ] Transporteur
- [ ] Le champ "Email" est visible avec son icône
- [ ] Le champ "Mot de passe" est visible avec son icône
- [ ] Le lien "Mot de passe oublié ?" est visible
- [ ] Le bouton "Se connecter" est visible
- [ ] Le lien "Créer un compte exploitation" est visible en bas
- [ ] Aucune erreur dans la console

**Résultat:** ⏳ **À TESTER**

#### Test 4.2: Sélection du Type de Compte

**Actions:**

1. Cliquer sur chaque carte de type de compte (Administrateur, Agriculteur, Acheteur, Transporteur)
2. Vérifier l'interaction

**Vérifications:**

- [ ] La carte sélectionnée change visuellement (bordure, fond)
- [ ] Une seule carte peut être sélectionnée à la fois
- [ ] La sélection est persistante jusqu'à changement
- [ ] L'animation de sélection est fluide

**Résultat:** ⏳ **À TESTER**

#### Test 4.3: Validation des Champs

**Actions:**

1. Laisser le champ email vide et cliquer ailleurs (blur)
2. Entrer un email invalide (ex: "test")
3. Entrer un mot de passe trop court (ex: "12345")
4. Entrer des données valides

**Vérifications:**

- [ ] Message d'erreur "L'email est requis" apparaît si email vide
- [ ] Message d'erreur "Format d'email invalide" apparaît pour email invalide
- [ ] Message d'erreur "Le mot de passe doit contenir au moins 6 caractères" apparaît
- [ ] Les erreurs disparaissent quand les champs sont corrigés
- [ ] Les champs valides n'affichent pas d'erreur

**Résultat:** ⏳ **À TESTER**

#### Test 4.4: Lien "Créer un compte exploitation"

**Actions:**

1. Cliquer sur le lien "Créer un compte exploitation" en bas du formulaire
2. Vérifier la redirection

**Vérifications:**

- [ ] La redirection vers `/register` fonctionne
- [ ] L'URL change pour `http://localhost:3000/register`
- [ ] La page d'inscription s'affiche

**Résultat:** ⏳ **À TESTER**

#### Test 4.5: Formulaire "Mot de passe oublié"

**Actions:**

1. Cliquer sur "Mot de passe oublié ?"
2. Vérifier l'ouverture du dialog

**Vérifications:**

- [ ] Le dialog s'ouvre avec une animation
- [ ] Le champ email est visible dans le dialog
- [ ] Les boutons "Annuler" et "Envoyer" sont visibles
- [ ] Le dialog se ferme avec "Annuler"
- [ ] La validation de l'email fonctionne dans le dialog

**Résultat:** ⏳ **À TESTER**

---

### ✅ 5. PAGE D'INSCRIPTION (Route `/register`)

#### Test 5.1: Affichage de la Page d'Inscription

**Actions:**

1. Naviguer vers `http://localhost:3000/register`
2. Vérifier l'affichage

**Vérifications:**

- [ ] La page se charge sans erreur
- [ ] Le design split-screen est visible (identique au login)
- [ ] Les 3 types de comptes sont affichés :
  - [ ] Agriculteur
  - [ ] Acheteur
  - [ ] Transporteur
- [ ] Le bouton "Continuer" est visible mais désactivé
- [ ] Le lien "Se connecter" est visible en bas
- [ ] Aucune erreur dans la console

**Résultat:** ⏳ **À TESTER**

#### Test 5.2: Sélection du Type de Compte

**Actions:**

1. Cliquer sur chaque type de compte
2. Vérifier l'interaction

**Vérifications:**

- [ ] La carte sélectionnée change visuellement
- [ ] Le bouton "Continuer" devient actif après sélection
- [ ] Une seule carte peut être sélectionnée à la fois

**Résultat:** ⏳ **À TESTER**

#### Test 5.3: Navigation vers le Login

**Actions:**

1. Cliquer sur "Se connecter" en bas de la page
2. Vérifier la redirection

**Vérifications:**

- [ ] La redirection vers `/login` fonctionne
- [ ] La page de login s'affiche correctement

**Résultat:** ⏳ **À TESTER**

---

### ✅ 6. REDIRECTIONS APRÈS CONNEXION

#### Test 6.1: Connexion en tant qu'Administrateur

**Prérequis:** Avoir un compte admin valide ou mocker l'API

**Actions:**

1. Aller sur `/login`
2. Sélectionner "Administrateur"
3. Entrer les identifiants admin
4. Cliquer sur "Se connecter"

**Vérifications:**

- [ ] Le bouton affiche "Connexion en cours..." pendant le chargement
- [ ] Après succès, redirection vers `/dashboard/admin`
- [ ] Le dashboard admin s'affiche correctement
- [ ] Les KPIs admin sont visibles

**Résultat:** ⏳ **À TESTER** (nécessite backend ou mock)

#### Test 6.2: Connexion en tant qu'Agriculteur

**Actions:**

1. Aller sur `/login`
2. Sélectionner "Agriculteur"
3. Entrer les identifiants farmer
4. Cliquer sur "Se connecter"

**Vérifications:**

- [ ] Redirection vers `/dashboard/farmer`
- [ ] Le dashboard farmer s'affiche correctement

**Résultat:** ⏳ **À TESTER**

#### Test 6.3: Connexion en tant qu'Acheteur

**Actions:**

1. Aller sur `/login`
2. Sélectionner "Acheteur"
3. Entrer les identifiants buyer
4. Cliquer sur "Se connecter"

**Vérifications:**

- [ ] Redirection vers `/dashboard/buyer`
- [ ] Le dashboard buyer s'affiche correctement

**Résultat:** ⏳ **À TESTER**

#### Test 6.4: Connexion en tant que Transporteur

**Actions:**

1. Aller sur `/login`
2. Sélectionner "Transporteur"
3. Entrer les identifiants transporter
4. Cliquer sur "Se connecter"

**Vérifications:**

- [ ] Redirection vers `/dashboard/transporter`
- [ ] Le dashboard transporter s'affiche correctement

**Résultat:** ⏳ **À TESTER**

---

### ✅ 7. RESPONSIVE DESIGN

#### Test 7.1: Mobile (< 768px)

**Actions:**

1. Ouvrir les DevTools (F12)
2. Activer le mode responsive
3. Sélectionner un appareil mobile (ex: iPhone 12)
4. Tester toutes les pages

**Vérifications:**

- [ ] La landing page s'adapte correctement
- [ ] La navbar devient un menu hamburger (si applicable)
- [ ] Le formulaire de login est centré et lisible
- [ ] Le sélecteur de rôle s'affiche en 2 colonnes
- [ ] Les textes sont lisibles
- [ ] Les boutons sont facilement cliquables

**Résultat:** ⏳ **À TESTER**

#### Test 7.2: Tablette (768px - 1024px)

**Actions:**

1. Tester avec une résolution tablette

**Vérifications:**

- [ ] Le layout s'adapte correctement
- [ ] Les éléments sont bien espacés
- [ ] La navigation est accessible

**Résultat:** ⏳ **À TESTER**

#### Test 7.3: Desktop (> 1024px)

**Actions:**

1. Tester avec une résolution desktop

**Vérifications:**

- [ ] Le design split-screen est visible sur login/register
- [ ] Tous les éléments sont visibles
- [ ] Les animations fonctionnent

**Résultat:** ⏳ **À TESTER**

---

### ✅ 8. ACCESSIBILITÉ

#### Test 8.1: Navigation au Clavier

**Actions:**

1. Utiliser uniquement le clavier (Tab, Enter, Escape)
2. Naviguer dans le formulaire de login

**Vérifications:**

- [ ] Le focus est visible sur tous les éléments interactifs
- [ ] La navigation Tab fonctionne dans l'ordre logique
- [ ] Le formulaire peut être soumis avec Enter
- [ ] Escape ferme les dialogs/erreurs

**Résultat:** ⏳ **À TESTER**

#### Test 8.2: Lecteurs d'Écran

**Actions:**

1. Activer un lecteur d'écran (NVDA, JAWS, VoiceOver)
2. Naviguer dans les pages

**Vérifications:**

- [ ] Les labels sont annoncés correctement
- [ ] Les messages d'erreur sont annoncés
- [ ] Les boutons ont des noms accessibles
- [ ] La structure sémantique est correcte

**Résultat:** ⏳ **À TESTER**

---

### ✅ 9. PERFORMANCE

#### Test 9.1: Temps de Chargement

**Actions:**

1. Ouvrir les DevTools > Network
2. Recharger la page avec cache désactivé
3. Mesurer les temps de chargement

**Vérifications:**

- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Taille des bundles raisonnable

**Résultat:** ⏳ **À TESTER**

---

### ✅ 10. ERREURS ET CAS LIMITES

#### Test 10.1: Gestion des Erreurs API

**Actions:**

1. Mocker une erreur 401 (identifiants incorrects)
2. Mocker une erreur 429 (rate limit)
3. Mocker une erreur 500 (serveur)

**Vérifications:**

- [ ] Les messages d'erreur appropriés s'affichent
- [ ] Les erreurs sont claires pour l'utilisateur
- [ ] Le formulaire reste utilisable après une erreur

**Résultat:** ⏳ **À TESTER**

#### Test 10.2: Navigation Directe

**Actions:**

1. Accéder directement à `/dashboard/admin` sans être connecté
2. Accéder directement à `/dashboard/buyer` sans être connecté

**Vérifications:**

- [ ] Redirection vers `/login` (à implémenter dans Phase 2)
- [ ] Ou affichage d'un message d'erreur approprié

**Résultat:** ⏳ **À TESTER** (Phase 2 - Middleware)

---

## 📊 RÉSUMÉ DES TESTS

| Catégorie             | Tests        | Statut          |
| --------------------- | ------------ | --------------- |
| Build & Compilation   | 1            | ✅ PASSÉ        |
| Lancement Application | 1            | ⏳ À TESTER     |
| Landing Page          | 3            | ⏳ À TESTER     |
| Page de Login         | 5            | ⏳ À TESTER     |
| Page d'Inscription    | 3            | ⏳ À TESTER     |
| Redirections          | 4            | ⏳ À TESTER     |
| Responsive Design     | 3            | ⏳ À TESTER     |
| Accessibilité         | 2            | ⏳ À TESTER     |
| Performance           | 1            | ⏳ À TESTER     |
| Erreurs & Cas Limites | 2            | ⏳ À TESTER     |
| **TOTAL**             | **25 tests** | **1/25 passés** |

---

## 🚀 INSTRUCTIONS DE TEST

### 1. Lancer l'Application

```bash
cd apps/web-app
pnpm dev
```

L'application devrait démarrer sur `http://localhost:3000` (ou un autre port si 3000 est occupé).

### 2. Tests Manuels Recommandés

1. **Test de la Landing Page:**
   - Ouvrir `http://localhost:3000`
   - Vérifier l'affichage complet
   - Cliquer sur "Connexion" → doit rediriger vers `/login`
   - Cliquer sur "Commencer" → doit rediriger vers `/register`

2. **Test de la Page de Login:**
   - Ouvrir `http://localhost:3000/login`
   - Tester la sélection de chaque type de compte
   - Tester la validation des champs
   - Cliquer sur "Créer un compte exploitation" → doit rediriger vers `/register`
   - Tester "Mot de passe oublié"

3. **Test de la Page d'Inscription:**
   - Ouvrir `http://localhost:3000/register`
   - Sélectionner un type de compte
   - Cliquer sur "Se connecter" → doit rediriger vers `/login`

4. **Test des Redirections (nécessite backend ou mock):**
   - Se connecter avec chaque type de compte
   - Vérifier la redirection vers le bon dashboard

### 3. Tests Automatisés (Playwright)

Une fois les tests manuels validés, exécuter :

```bash
pnpm test:e2e
```

---

## 📝 NOTES IMPORTANTES

1. **Backend Requis:** Les tests de connexion nécessitent un backend fonctionnel ou des mocks API
2. **Variables d'Environnement:** Vérifier que `.env.local` contient `NEXT_PUBLIC_API_URL`
3. **Console du Navigateur:** Surveiller les erreurs JavaScript dans la console
4. **Network Tab:** Vérifier que les requêtes API sont correctement formatées

---

**Fin du Document de Tests**
