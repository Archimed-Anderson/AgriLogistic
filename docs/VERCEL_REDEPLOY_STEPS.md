# Refaire le déploiement Vercel – Étapes à suivre (build qui échoue)

Si le build Vercel échoue à chaque fois, suivez **ces étapes dans l’ordre**. Chaque étape est à cocher avant de passer à la suivante.

---

## Avant de commencer

- Repo GitHub à jour (ex. **Archimed-Anderson/AgriLogistic**), branche **main** (ou celle que vous déployez).
- Vous avez une **connection string Neon** (voir [docs/NEON_SETUP.md](NEON_SETUP.md)) et un **BETTER_AUTH_SECRET** (≥ 32 caractères, ex. `openssl rand -base64 32`).

---

## Étape 1 : Accéder au projet Vercel

1. Allez sur **[vercel.com](https://vercel.com)** et connectez-vous.
2. Ouvrez le projet qui correspond à votre repo (ex. **agrilogistic** ou **AgriLogistic**).
3. Allez dans **Settings** (onglet en haut).

---

## Étape 2 : Vérifier le Root Directory (cause #1 des échecs)

1. Dans le menu de gauche : **Settings** → **General**.
2. Descendez jusqu’à **Root Directory**.
3. Cliquez sur **Edit** à côté de **Root Directory**.
4. **Cochez** la case **« Include source files outside of the Root Directory »** (pour que le monorepo soit pris en compte).
5. Dans le champ, saisissez **exactement** :  
   `apps/web-app`  
   (pas de slash au début, pas de slash à la fin, pas d’espace).
6. Cliquez sur **Save**.

Si Root Directory était vide ou incorrect, c’est souvent la cause du message **« package.json not found »** ou **« Cannot find module »**. Après correction, passez à l’étape 3.

---

## Étape 3 : Vérifier Build & Development Settings

1. Toujours dans **Settings** → **General**, section **Build & Development Settings**.
2. Vérifiez :
   - **Framework Preset** : **Next.js**.
   - **Build Command** : `pnpm run build` (ou laisser vide pour utiliser `vercel.json`).
   - **Output Directory** : laisser **vide**.
   - **Install Command** : `pnpm install` (ou laisser vide pour utiliser `vercel.json`).
3. **Node.js Version** : **20.x** (si le champ existe, sinon par défaut).
4. Enregistrez si vous avez modifié quelque chose.

---

## Étape 4 : Renseigner les variables d’environnement (obligatoires)

1. **Settings** → **Environment Variables** (menu de gauche).
2. Ajoutez ou modifiez **chaque** variable ci-dessous pour l’environnement **Production** (et **Preview** si vous déployez des branches).

| Name | Value | Environnement |
|------|--------|----------------|
| `DATABASE_URL` | Votre connection string **Neon** (ex. `postgresql://neondb_owner:xxx@ep-xxx-pooler.xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`) | Production, Preview |
| `BETTER_AUTH_SECRET` | Une chaîne d’au moins 32 caractères (générer : `openssl rand -base64 32`) | Production, Preview |
| `BETTER_AUTH_URL` | **Production :** `https://votre-projet.vercel.app` (remplacer par l’URL réelle de votre projet, ex. `https://agrilogistic.vercel.app`) | Production |
| `BETTER_AUTH_URL` | **Preview :** `https://$VERCEL_URL` | Preview |
| `NEXTAUTH_URL` | **Même valeur** que `BETTER_AUTH_URL` pour chaque environnement | Production, Preview |

3. Pour **BETTER_AUTH_URL** en Production : si vous ne connaissez pas encore l’URL, utilisez d’abord celle proposée par Vercel après le premier déploiement (ex. `https://votre-projet-xxx.vercel.app`), puis vous pourrez la corriger après le premier déploiement réussi.
4. Cliquez sur **Save** après chaque variable (ou après le groupe).

**Important** : Sans `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` et `NEXTAUTH_URL`, l’app peut planter au build ou au runtime. Vérifiez qu’elles sont bien présentes et sans faute de frappe.

---

## Étape 5 : Déclencher un nouveau déploiement

1. Allez dans l’onglet **Deployments** (en haut).
2. Cliquez sur les **trois points** (⋮) du dernier déploiement (ou sur **Redeploy**).
3. Choisissez **Redeploy** (ou **Redeploy with existing Build Cache** désactivé si vous voulez un build from scratch).
4. Validez. Attendez la fin du build (1 à 3 minutes).

---

## Étape 6 : Consulter les logs en cas d’échec

Si le build échoue encore :

1. Dans **Deployments**, cliquez sur le déploiement qui a échoué.
2. Ouvrez l’onglet **Building** (ou **Logs**).
3. Repérez la **première ligne d’erreur** (en rouge ou après « Error »).

Utilisez le tableau ci-dessous pour cibler la cause et la correction :

| Message d’erreur (exemple) | Cause probable | Action |
|----------------------------|----------------|--------|
| `package.json not found` / `No such file or directory` | Root Directory incorrect ou non défini | Refaire l’**Étape 2** : Root Directory = `apps/web-app`, cocher « Include source files outside... ». |
| `Cannot find module '...'` | Mauvais répertoire de build ou dépendances manquantes | Vérifier **Étape 2** et **Étape 3** ; relancer un déploiement **sans** cache (Redeploy sans cache). |
| `pnpm: command not found` | pnpm non disponible | Dans **Settings → General**, **Install Command** = `pnpm install` (ou ajouter un script d’install qui installe pnpm). Vercel supporte pnpm si un `pnpm-lock.yaml` est présent. |
| `Error: Cannot find module 'next'` | Install lancé dans un mauvais répertoire | Root Directory = `apps/web-app` et « Include source files outside... » coché ; **Install Command** = `pnpm install`. |
| Erreur liée à `DATABASE_URL` / auth au **runtime** | Variables d’environnement manquantes ou mal copiées | Refaire l’**Étape 4** ; vérifier qu’il n’y a pas d’espace en trop dans les valeurs. |
| Build réussit mais la page blanche / 500 | Souvent `BETTER_AUTH_URL` ou `NEXTAUTH_URL` incorrects | Mettre **BETTER_AUTH_URL** et **NEXTAUTH_URL** = l’URL réelle du déploiement (ex. `https://votre-projet.vercel.app`), puis **Redeploy**. |

---

## Étape 7 : Après un déploiement réussi

1. Ouvrez l’URL du déploiement (ex. `https://votre-projet.vercel.app`).
2. Testez : **page d’accueil** → **Inscription** / **Connexion** (avec la base Neon).
3. Si vous n’aviez pas encore mis la bonne **BETTER_AUTH_URL** / **NEXTAUTH_URL** : allez dans **Settings → Environment Variables**, modifiez-les avec l’URL réelle du projet, puis **Redeploy** une dernière fois.

---

## Récapitulatif (checklist)

- [ ] **Étape 1** : Projet Vercel ouvert, onglet Settings.
- [ ] **Étape 2** : Root Directory = `apps/web-app`, case **« Include source files outside of the Root Directory »** cochée.
- [ ] **Étape 3** : Framework = Next.js, Build = `pnpm run build`, Install = `pnpm install`, Node 20.x.
- [ ] **Étape 4** : Variables **DATABASE_URL**, **BETTER_AUTH_SECRET**, **BETTER_AUTH_URL**, **NEXTAUTH_URL** définies pour Production (et Preview si besoin).
- [ ] **Étape 5** : Redeploy lancé.
- [ ] **Étape 6** : En cas d’échec, logs lus et correction appliquée selon le tableau.
- [ ] **Étape 7** : Test de l’app et ajustement de BETTER_AUTH_URL / NEXTAUTH_URL si besoin.

---

## Erreur DEPLOYMENT_NOT_FOUND (404)

Cette erreur **ne vient pas du code** de l’application. Elle est renvoyée par **Vercel** quand une requête demande un **déploiement qui n’existe pas** (ID ou URL incorrect, ou déploiement supprimé).

**À faire :**
- Utiliser l’**URL de production** du projet (ex. `https://votre-projet.vercel.app`) et non l’URL d’un déploiement précis (ex. `https://xxx-abc123-équipe.vercel.app`).
- Si vous aviez un lien vers un **preview** ou un **ancien déploiement** : aller dans le dashboard Vercel → **Deployments** → ouvrir le déploiement actuel (Production ou le dernier réussi) et utiliser l’URL indiquée.
- Si le déploiement a été supprimé : déclencher un nouveau déploiement (push sur la branche ou **Redeploy** dans Vercel), puis utiliser la nouvelle URL.

**Cause typique :** lien sauvegardé ou partagé vers un déploiement **Preview** ou **ancien** qui a été purgé ou dont l’ID a changé. Vercel conserve un nombre limité de déploiements ; les plus anciens peuvent disparaître.

Voir aussi : [Vercel – DEPLOYMENT_NOT_FOUND](https://vercel.com/docs/errors/DEPLOYMENT_NOT_FOUND).

---

## Références

- Configuration détaillée : [docs/VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- Configuration Neon (DATABASE_URL) : [docs/NEON_SETUP.md](NEON_SETUP.md)
