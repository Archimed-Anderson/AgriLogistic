# Déploiement AgroLogistic Web App sur Vercel

Ce document décrit la configuration pour déployer **apps/web-app** (Next.js) sur Vercel, en environnement **Preview** (branches / PR) et **Production** (branche principale). Il correspond aux écrans **Configure Project** (Root Directory, Build/Install) et **Environment Variables** de l’interface Vercel.

---

**Si le build Vercel échoue à chaque fois** : suivez la procédure pas à pas **[docs/VERCEL_REDEPLOY_STEPS.md](VERCEL_REDEPLOY_STEPS.md)** (Root Directory, variables d'environnement, redeploy, dépannage).

---

## 1. Configuration projet Vercel (écran par écran)

### 1.1 Écran « Configure Project » (première configuration)

Remplir **exactement** comme suit :

| Champ Vercel | Valeur à saisir | Note |
|--------------|-----------------|------|
| **Project Name** | `agrilogistic` (ou le nom souhaité) | Optionnel, Vercel propose un nom. |
| **Root Directory** | `apps/web-app` | **Obligatoire.** Cliquer sur « Edit », cocher « Include source files outside of the Root Directory », puis saisir `apps/web-app`. |
| **Framework Preset** | `Next.js` | Détecté automatiquement si Root Directory = `apps/web-app`. |
| **Build Command** | `pnpm run build` | Ou laisser vide (le `vercel.json` du repo le définit). |
| **Output Directory** | *(laisser vide)* | Next.js gère tout seul. |
| **Install Command** | `pnpm install` | Ou laisser vide (idem `vercel.json`). |
| **Development Command** | *(vide ou)* `pnpm run dev` | Optionnel. |
| **Node.js Version** | `20.x` (recommandé) | Dans **Settings → General → Node.js Version** si besoin. |

**Important :** Si « Root Directory » n’est pas configuré, le build échouera (Vercel cherchera un `package.json` à la racine du monorepo). Toujours définir **Root Directory** = **`apps/web-app`**.

### 1.2 Environment Variables (avant ou après le premier déploiement)

**Settings** → **Environment Variables**. Ajouter au minimum pour **Production** :

| Name | Value | Environment |
|------|--------|-------------|
| `DATABASE_URL` | `postgresql://USER:PASSWORD@HOST:5432/DATABASE` | Production (et Preview si vous utilisez une DB) |
| `BETTER_AUTH_SECRET` | Une chaîne ≥ 32 caractères (ex. `openssl rand -base64 32`) | Production, Preview |
| `BETTER_AUTH_URL` | **Production :** `https://votre-domaine.vercel.app` — **Preview :** `https://$VERCEL_URL` | Production / Preview |
| `NEXTAUTH_URL` | Même valeur que `BETTER_AUTH_URL` | Production / Preview |

Pour **Preview**, vous pouvez définir `BETTER_AUTH_URL` = `https://$VERCEL_URL` et `NEXTAUTH_URL` = `https://$VERCEL_URL` (Vercel remplace `$VERCEL_URL` par l’URL du déploiement, ex. `votre-projet-xxx.vercel.app`).

### 1.3 Importer le dépôt (rappel)

1. [Vercel](https://vercel.com) → **Add New** → **Project**.
2. Importer le dépôt GitHub (ex. **Archimed-Anderson/AgriLogistic**).
3. **Root Directory** : `apps/web-app` (voir tableau ci-dessus).
4. **Build / Install** : `pnpm run build` et `pnpm install` (ou laisser vides si `vercel.json` est utilisé).
5. Cliquer sur **Deploy**.

### 1.4 Fichier `vercel.json`

Le fichier `apps/web-app/vercel.json` contient déjà :

- `framework`: nextjs  
- `buildCommand`: pnpm run build  
- `installCommand`: pnpm install  
- `regions`: cdg1 (Paris)  
- En-têtes de sécurité (X-Frame-Options, X-Content-Type-Options)

Aucune modification nécessaire sauf besoin spécifique (domaine, redirections, etc.).

---

## 2. Variables d’environnement

À configurer dans **Vercel** → **Project** → **Settings** → **Environment Variables**.

### 2.1 Checklist rapide (en suivant vos écrans Vercel)

- [ ] **Root Directory** = `apps/web-app` (pas de slash au début, pas de slash à la fin).
- [ ] **Framework** = Next.js.
- [ ] **Build Command** = `pnpm run build` (ou vide).
- [ ] **Install Command** = `pnpm install` (ou vide).
- [ ] **Environment Variables** : au moins `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXTAUTH_URL` pour l'environnement ciblé (Production / Preview).

**Si le build échoue** avec « Cannot find module » ou « package.json not found », c'est en général que **Root Directory** n'est pas `apps/web-app`. Vérifier dans **Settings → General → Root Directory**.

---

### 2.2 Production (Production)

| Variable | Obligatoire | Description | Exemple |
|----------|-------------|-------------|--------|
| `DATABASE_URL` | Oui | PostgreSQL (Better Auth) | `postgresql://user:pass@host:5432/db` |
| `BETTER_AUTH_SECRET` | Oui | Secret de session (≥ 32 caractères) | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Oui | URL publique de l’app | `https://votre-domaine.vercel.app` |
| `NEXTAUTH_URL` | Oui | Idem (Better Auth le lit) | `https://votre-domaine.vercel.app` |
| `NEXT_PUBLIC_API_URL` | Recommandé | API Gateway / Backend | `https://api.votredomaine.com/api/v1` |
| `GOOGLE_CLIENT_ID` | Optionnel | OAuth Google | Client ID Web |
| `GOOGLE_CLIENT_SECRET` | Optionnel | OAuth Google | Client Secret |
| `NEXT_PUBLIC_DEV_LOGIN_DELAY_MS` | Optionnel | Délai accès rapide (ms) | `250` |

### 2.3 Preview (Preview / Déploiements de branches)

Mêmes variables que Production, avec des valeurs dédiées :

- **BETTER_AUTH_URL** / **NEXTAUTH_URL** : URL du déploiement Preview (ex. `https://agrologistic-xxx.vercel.app`).  
  Vous pouvez utiliser la variable Vercel **VERCEL_URL** :  
  `BETTER_AUTH_URL=https://$VERCEL_URL` et cocher “Expose to Browser” si besoin, ou définir une URL fixe par branche.
- **DATABASE_URL** : base dédiée Preview (recommandé) ou même base avec préfixe de schéma.
- **BETTER_AUTH_SECRET** : secret différent pour Preview (recommandé).

### 2.4 Variables sensibles

- Ne jamais committer `DATABASE_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, etc.
- Les définir uniquement dans l’interface Vercel (ou via Vercel CLI / API).
- Pour Google OAuth en Preview, ajouter l’URL de callback Preview dans la Console Google (ex. `https://*-xxx.vercel.app/api/auth/callback/google`).

---

## 4. Migrations base de données

Better Auth utilise des tables créées par ses migrations.

1. En local (avec la même `DATABASE_URL` que celle utilisée en prod / preview) :  
   `cd apps/web-app && npx @better-auth/cli@latest migrate`
2. En production / preview : exécuter les migrations une fois la base disponible (script CI, ou manuellement vers la base cible).
3. Vercel ne lance pas les migrations automatiquement ; prévoir un job (GitHub Actions, cron, ou manuel) si besoin.

---

## 5. Environnements recommandés (résumé)

| Environnement | Branche | BETTER_AUTH_URL | DATABASE_URL |
|---------------|---------|------------------|--------------|
| Production | `main` / `master` | `https://votredomaine.com` | Base de prod |
| Preview | Autres branches | `https://<deployment>.vercel.app` ou `https://$VERCEL_URL` | Base preview ou prod (avec précaution) |

---

## 6. Vérifications après déploiement

- Page d’accueil et navigation.
- Connexion / inscription (email + optionnel Google).
- Redirection après login selon le rôle (Admin, Agriculteur, etc.).
- Appels API si `NEXT_PUBLIC_API_URL` est configuré.
- War Room / WebSocket si utilisé (nécessite une URL WebSocket accessible depuis le navigateur).

---

## 7. Références

- [Vercel – Monorepos](https://vercel.com/docs/monorepos)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Better Auth – Deployment](https://www.better-auth.com/docs/deployment)
- `.env.example` dans `apps/web-app` pour la liste des variables.
