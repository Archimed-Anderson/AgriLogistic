# 🚀 Guide de Redéploiement Vercel - AgriLogistic

Ce guide détaille les étapes pour connecter et déployer la **web-app** AgriLogistic sur Vercel.

## 1. Connexion GitHub
1. Allez sur le [Dashboard Vercel](https://vercel.com/dashboard).
2. Cliquez sur **"Add New..."** > **"Project"**.
3. Importez le dépôt `Agrodeepwebapp-main`.

## 2. Configuration du Projet
Lors de l'importation, configurez les paramètres suivants :

- **Framework Preset** : `Next.js`
- **Root Directory** : `apps/web-app` (TRÈS IMPORTANT car c'est un monorepo).
- **Build Command** : `pnpm build`
- **Install Command** : `pnpm install`
- **Output Directory** : `.next`

## 3. Variables d'Environnement (Environment Variables)
Ajoutez les variables suivantes dans l'onglet **Settings > Environment Variables** :

| Variable | Description | Exemple |
| :--- | :--- | :--- |
| `DATABASE_URL` | URL de connexion Postgres (utilisez Neon ou Supabase en prod) | `postgresql://user:pass@ep-cool-ice-123.aws.neon.tech/db?sslmode=require` |
| `BETTER_AUTH_SECRET` | Secret pour la signature des sessions (Générez avec `openssl rand -base64 32`) | `votre_secret_32_chars_min` |
| `BETTER_AUTH_URL` | URL de production de votre app | `https://votre-domaine.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Identique à `BETTER_AUTH_URL` | `https://votre-domaine.vercel.app` |
| `GOOGLE_CLIENT_ID` | Client ID Google OAuth (Optionnel) | `12345-abcde.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET`| Client Secret Google OAuth (Optionnel) | `GOCSPX-votre_secret` |

## 4. Stabilisation du Build
En cas d'échec de build dû au pré-rendu statique :
- Les layouts critiques sont déjà configurés avec `export const dynamic = 'force-dynamic';`.
- Assurez-vous que la `DATABASE_URL` est accessible pendant le build si vous faites du rendu statique (non recommandé pour les zones auth).

## 5. Déploiement
1. Cliquez sur **Deploy**.
2. Une fois le build terminé, exécutez la migration de la base de données (si ce n'est pas fait automatiquement via un script de post-build) :
   ```bash
   npx @better-auth/cli@latest migrate --config src/auth.ts --yes
   ```
   *(Vous pouvez exécuter cette commande localement en pointant vers la base de prod de Vercel si nécessaire).*
