# Déploiement AgroLogistic Web App sur Vercel

Ce document décrit la configuration pour déployer **apps/web-app** (Next.js) sur Vercel, en environnement **Preview** (branches / PR) et **Production** (branche principale).

---

## 1. Configuration projet Vercel

### 1.1 Importer le dépôt

1. [Vercel](https://vercel.com) → **Add New** → **Project**.
2. Importer le dépôt GitHub (AgroLogistic / agrodeepwebapp ou équivalent).
3. **Root Directory** : définir `apps/web-app` (obligatoire pour ce monorepo).
4. **Framework Preset** : Next.js (détecté automatiquement si `vercel.json` présent).
5. **Build Command** : `pnpm run build` (ou laisser vide pour utiliser `vercel.json`).
6. **Output Directory** : laisser par défaut (Next.js gère).
7. **Install Command** : `pnpm install`.

### 1.2 Fichier `vercel.json`

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

### 2.1 Production (Production)

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

### 2.2 Preview (Preview / Déploiements de branches)

Mêmes variables que Production, avec des valeurs dédiées :

- **BETTER_AUTH_URL** / **NEXTAUTH_URL** : URL du déploiement Preview (ex. `https://agrologistic-xxx.vercel.app`).  
  Vous pouvez utiliser la variable Vercel **VERCEL_URL** :  
  `BETTER_AUTH_URL=https://$VERCEL_URL` et cocher “Expose to Browser” si besoin, ou définir une URL fixe par branche.
- **DATABASE_URL** : base dédiée Preview (recommandé) ou même base avec préfixe de schéma.
- **BETTER_AUTH_SECRET** : secret différent pour Preview (recommandé).

### 2.3 Variables sensibles

- Ne jamais committer `DATABASE_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, etc.
- Les définir uniquement dans l’interface Vercel (ou via Vercel CLI / API).
- Pour Google OAuth en Preview, ajouter l’URL de callback Preview dans la Console Google (ex. `https://*-xxx.vercel.app/api/auth/callback/google`).

---

## 3. Migrations base de données

Better Auth utilise des tables créées par ses migrations.

1. En local (avec la même `DATABASE_URL` que celle utilisée en prod / preview) :  
   `cd apps/web-app && npx @better-auth/cli@latest migrate`
2. En production / preview : exécuter les migrations une fois la base disponible (script CI, ou manuellement vers la base cible).
3. Vercel ne lance pas les migrations automatiquement ; prévoir un job (GitHub Actions, cron, ou manuel) si besoin.

---

## 4. Environnements recommandés (résumé)

| Environnement | Branche | BETTER_AUTH_URL | DATABASE_URL |
|---------------|---------|------------------|--------------|
| Production | `main` / `master` | `https://votredomaine.com` | Base de prod |
| Preview | Autres branches | `https://<deployment>.vercel.app` ou `https://$VERCEL_URL` | Base preview ou prod (avec précaution) |

---

## 5. Vérifications après déploiement

- Page d’accueil et navigation.
- Connexion / inscription (email + optionnel Google).
- Redirection après login selon le rôle (Admin, Agriculteur, etc.).
- Appels API si `NEXT_PUBLIC_API_URL` est configuré.
- War Room / WebSocket si utilisé (nécessite une URL WebSocket accessible depuis le navigateur).

---

## 6. Références

- [Vercel – Monorepos](https://vercel.com/docs/monorepos)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Better Auth – Deployment](https://www.better-auth.com/docs/deployment)
- `.env.example` dans `apps/web-app` pour la liste des variables.
