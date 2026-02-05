# Configuration Neon (PostgreSQL) – Étapes détaillées

Ce guide décrit **étape par étape** comment créer une base PostgreSQL sur [Neon](https://neon.tech) et l’utiliser avec l’application **apps/web-app** (Better Auth).

---

## Étape 1 : Créer un compte Neon

1. Ouvrez **[neon.tech](https://neon.tech)**.
2. Cliquez sur **Sign up** (ou **Get started**).
3. Inscrivez-vous avec :
   - **GitHub**, **Google**, ou **email**.
4. Aucune carte bancaire n’est demandée pour le plan gratuit.

---

## Étape 2 : Créer un projet

1. Une fois connecté, vous arrivez sur le **dashboard**.
2. Cliquez sur **New Project** (ou **Create a project**).
3. Renseignez :
   - **Project name** : par ex. `agrilogistic` ou `agrilogistic-test`.
   - **Region** : choisissez la plus proche (ex. **Europe (Frankfurt)** ou **US East**).
   - **PostgreSQL version** : laisser **16** (recommandé).
4. Cliquez sur **Create project**.

---

## Étape 3 : Récupérer la connection string

1. Une fois le projet créé, Neon affiche un écran avec la **connection string**.
2. Repérez la chaîne au format :
   ```text
   postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
   ```
   Neon peut ajouter `&channel_binding=require` ; c’est compatible, gardez-le si présent.
3. **Copiez** cette chaîne (bouton **Copy** à côté).
4. Si vous ne la voyez plus :
   - Allez dans **Dashboard** → votre projet.
   - Onglet **Connection details** (ou **SQL Editor** / **Connect**).
   - Choisissez **Connection string** (avec **pooler** pour un usage serverless) et copiez la valeur (avec mot de passe inclus).

**Exemple** (format Neon avec pooler, région eu-central-1) :
```text
postgresql://neondb_owner:VOTRE_MOT_DE_PASSE@ep-xxx-pooler.xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Important** : ne partagez pas cette chaîne (elle contient le mot de passe). Vous l’utiliserez uniquement dans les variables d’environnement (local, Vercel, etc.).

---

## Étape 4 : Configurer l’application en local

1. Dans le monorepo, allez dans **apps/web-app** :
   ```bash
   cd apps/web-app
   ```
2. Copiez le fichier d’exemple des variables d’environnement (si ce n’est pas déjà fait) :
   ```bash
   cp .env.example .env.local
   ```
3. Ouvrez **`.env.local`** et définissez :
   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
   ```
   Collez la **connection string** Neon copiée à l’étape 3 (remplacez tout l’ancien `DATABASE_URL`).
4. Gardez ou complétez les autres variables (Better Auth) :
   ```env
   BETTER_AUTH_URL=http://localhost:3000
   NEXTAUTH_URL=http://localhost:3000
   BETTER_AUTH_SECRET=votre_secret_32_caracteres_minimum
   ```
   Pour générer un secret : `openssl rand -base64 32`
5. Sauvegardez le fichier. L’app utilisera Neon au prochain `pnpm dev` ou `pnpm start`.

---

## Étape 5 : Exécuter les migrations Better Auth

Better Auth a besoin de ses tables (user, session, account, etc.) dans la base Neon.

1. Toujours dans **apps/web-app**, avec **DATABASE_URL** pointant vers Neon dans `.env.local` :
   ```bash
   cd apps/web-app
   npx @better-auth/cli@latest migrate
   ```
2. Vérifiez qu’il n’y a pas d’erreur. Les tables sont créées dans la base Neon.
3. (Optionnel) Dans le dashboard Neon → **Tables**, vous pouvez vérifier la présence des tables Better Auth.

---

## Étape 6 : Utiliser Neon avec Vercel (ou autre hébergement)

1. **Vercel** : Projet → **Settings** → **Environment Variables**.
2. Ajoutez (ou modifiez) :
   - **Name** : `DATABASE_URL`
   - **Value** : la même **connection string** Neon (avec `?sslmode=require`).
   - **Environment** : Production (et Preview si vous voulez la même DB pour les préviews).
3. Redéployez l’application pour que la nouvelle variable soit prise en compte.
4. **Une seule fois** : les migrations Better Auth doivent avoir été exécutées vers cette base (étape 5). Si la base Neon est la même que en local, c’est déjà fait. Sinon, exécutez `npx @better-auth/cli@latest migrate` une fois avec `DATABASE_URL` = la chaîne Neon de prod.

Pour **Render**, **AWS Amplify**, **Google Cloud Run** : ajoutez la même variable **DATABASE_URL** (connection string Neon) dans les variables d’environnement de la plateforme.

---

## Finalisation (votre projet Neon)

Une fois la connection string Neon en place dans **apps/web-app/.env.local** (ex. base **neondb**, région **eu-central-1**, host **pooler**) :

1. **Vérifier** que `.env.local` contient bien :
   ```env
   DATABASE_URL="postgresql://neondb_owner:VOTRE_MOT_DE_PASSE@ep-xxx-pooler.xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   ```
   (avec votre vraie chaîne ; les guillemets sont utiles à cause du `&`.)

2. **Lancer les migrations Better Auth** (une seule fois) :
   ```bash
   cd apps/web-app
   npx @better-auth/cli@latest migrate
   ```
   En cas d’erreur « Cannot find module » ou timeout : réessayer après `pnpm install` dans **apps/web-app**, ou vérifier que la base Neon est accessible (dashboard Neon → **Connection**).

3. **Tester** : `pnpm dev` dans **apps/web-app**, puis inscription / connexion sur `http://localhost:3000`.

4. **Déploiement (Vercel, etc.)** : ajouter la **même** variable **DATABASE_URL** (connection string Neon) dans les variables d’environnement du projet, puis redéployer.

---

## Récapitulatif des étapes

| # | Action |
|---|--------|
| 1 | Créer un compte sur [neon.tech](https://neon.tech) |
| 2 | Créer un projet (nom, région, PostgreSQL 16) |
| 3 | Copier la **connection string** (format `postgresql://...?sslmode=require`) |
| 4 | Mettre `DATABASE_URL` dans `apps/web-app/.env.local` (et ailleurs si besoin) |
| 5 | Exécuter `npx @better-auth/cli@latest migrate` dans **apps/web-app** |
| 6 | Sur Vercel / Render / etc. : ajouter `DATABASE_URL` avec la même chaîne Neon |

---

## Limites du plan gratuit Neon

- **Stockage** : 0,5 Go par projet.
- **Compute** : 100 CU-heures par projet (suffisant pour une phase test / faible trafic).
- **Pas d’expiration** : le plan gratuit ne demande pas de carte et ne se termine pas après X jours.

Pour plus de détails : [Neon – Free tier](https://neon.tech/docs/introduction/free-tier).

---

## Dépannage

- **Erreur de connexion (SSL)** : la connection string doit contenir `?sslmode=require` (Neon impose le SSL).
- **"relation does not exist"** : exécuter les migrations Better Auth (étape 5).
- **Timeout** : vérifier la région Neon (choisir une région proche de votre hébergement ou de vos utilisateurs).
