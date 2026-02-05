# Déploiement AgroLogistic Web App sur Google Cloud – Étapes détaillées

Ce guide décrit **étape par étape** comment déployer **apps/web-app** (Next.js) sur **Google Cloud**, en utilisant **Cloud Run** (conteneur) et **Cloud SQL** (PostgreSQL) pour Better Auth.

---

## Prérequis

- Un compte **Google Cloud** avec facturation activée.
- **Google Cloud CLI** (`gcloud`) installé sur votre machine : [Installation](https://cloud.google.com/sdk/docs/install).
- **Docker** installé (pour build d’image en local, optionnel si vous utilisez Cloud Build).
- Le code du projet (monorepo) avec **apps/web-app** et son **Dockerfile**.

---

## Étape 1 : Créer ou sélectionner un projet Google Cloud

1. Ouvrez [Google Cloud Console](https://console.cloud.google.com/).
2. En haut à gauche, cliquez sur le sélecteur de **projet**.
3. **Créer un projet** :
   - Cliquez sur **Nouveau projet**.
   - **Nom du projet** : par ex. `agrilogistic-prod`.
   - **Emplacement** : organisation ou « Aucune organisation ».
   - Cliquez sur **Créer**.
4. **Ou** sélectionnez un projet existant dans la liste.
5. **Activer la facturation** : Menu **Facturation** → associer un compte de facturation au projet (obligatoire pour Cloud Run et Cloud SQL).

**En ligne de commande (optionnel) :**

```bash
# Se connecter
gcloud auth login

# Créer un projet (ou utiliser un existant)
gcloud projects create agrilogistic-prod --name="AgriLogistic Prod"

# Définir le projet par défaut
gcloud config set project agrilogistic-prod
```

---

## Étape 2 : Activer les APIs nécessaires

1. Dans la console : **Menu** (☰) → **APIs et services** → **Bibliothèque**.
2. Recherchez et **activez** les APIs suivantes (bouton **Activer** pour chacune) :
   - **Cloud Run API**
   - **Cloud SQL Admin API**
   - **Cloud Build API** (si vous builderez l’image sur GCP)
   - **Artifact Registry API** (ou Container Registry ; recommandé : Artifact Registry)
   - **Secret Manager API** (recommandé pour les secrets)

**En ligne de commande :**

```bash
gcloud services enable run.googleapis.com \
  sqladmin.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

---

## Étape 3 : Créer une instance Cloud SQL (PostgreSQL)

1. **Menu** → **SQL** (ou recherchez « Cloud SQL »).
2. Cliquez sur **Créer une instance**.
3. Choisissez **PostgreSQL**.
4. **Identité de l’instance** :
   - **ID de l’instance** : ex. `agrilogistic-db`.
   - **Mot de passe** (utilisateur `postgres`) : générez un mot de passe fort et notez-le.
5. **Région** : ex. `europe-west1` (ou la région la plus proche de vos utilisateurs).
6. **Configuration de la machine** : la plus petite (ex. partagé / 1 vCPU) suffit pour commencer.
7. **Stockage** : 10 Go minimum.
8. Cliquez sur **Créer l’instance** (attendre quelques minutes).
9. Une fois créée : ouvrez l’instance → **Bases de données** → **Créer une base de données** :
   - **Nom** : ex. `agrilogistic`.
10. (Optionnel) Créez un utilisateur dédié : **Utilisateurs** → **Ajouter un utilisateur** (nom + mot de passe) pour ne pas utiliser `postgres` en prod.

**Récupérer la chaîne de connexion :**

- **Connexions** : notez le **Nom de la connexion** (ex. `agrilogistic-prod:europe-west1:agrilogistic-db`).
- **DATABASE_URL** au format :  
  `postgresql://UTILISATEUR:MOT_DE_PASSE@/agrilogistic?host=/cloudsql/agrilogistic-prod:europe-west1:agrilogistic-db`  
  (pour connexion via socket Unix depuis Cloud Run ; voir étape 8 pour les variables d’environnement.)

---

## Étape 4 : Créer un dépôt Artifact Registry (pour l’image Docker)

1. **Menu** → **Artifact Registry** → **Créer un dépôt**.
2. **Nom** : ex. `agrilogistic`.
3. **Format** : **Docker**.
4. **Mode** : Standard.
5. **Région** : même que Cloud Run (ex. `europe-west1`).
6. Cliquez sur **Créer**.

**En ligne de commande :**

```bash
gcloud artifacts repositories create agrilogistic \
  --repository-format=docker \
  --location=europe-west1 \
  --description="AgriLogistic Web App"
```

---

## Étape 5 : Configurer Docker pour Artifact Registry

1. Configurez l’authentification Docker avec GCP :

```bash
gcloud auth configure-docker europe-west1-docker.pkg.dev
```

2. (Optionnel) Vérifiez que vous êtes connecté :

```bash
gcloud auth list
```

---

## Étape 6 : Builder l’image Docker (depuis le monorepo)

Le **Dockerfile** se trouve dans **apps/web-app**. Le build doit être lancé **depuis la racine du monorepo** en passant le contexte et le fichier Dockerfile, ou depuis **apps/web-app** si le Dockerfile copie tout le nécessaire (actuellement le Dockerfile est conçu pour être utilisé depuis **apps/web-app**).

**Depuis la racine du monorepo (AgroDeep) :**

```bash
cd /chemin/vers/AgroDeep

# Build de l’image (contexte = apps/web-app)
docker build -t europe-west1-docker.pkg.dev/agrilogistic-prod/agrilogistic/web-app:latest -f apps/web-app/Dockerfile apps/web-app
```

Remplacez `agrilogistic-prod` par votre **Project ID** et `europe-west1` par votre région.

**Ou avec Cloud Build (sans Docker local) :**

Le fichier **apps/web-app/cloudbuild.yaml** est fourni. Depuis la **racine du monorepo** (AgroDeep) :

```bash
cd /chemin/vers/AgroDeep
gcloud builds submit --config apps/web-app/cloudbuild.yaml .
```

L’image sera construite sur GCP et poussée vers Artifact Registry (`europe-west1-docker.pkg.dev/VOTRE_PROJECT_ID/agrilogistic/web-app:latest`). Remplacez la région et le nom du dépôt si besoin dans **cloudbuild.yaml**.

---

## Étape 7 : Pousser l’image vers Artifact Registry

```bash
docker push europe-west1-docker.pkg.dev/agrilogistic-prod/agrilogistic/web-app:latest
```

Si vous utilisez **Cloud Build** pour builder l’image, celle-ci sera poussée automatiquement dans Artifact Registry (pas besoin de `docker push` local).

---

## Étape 8 : Déployer sur Cloud Run

1. **Menu** → **Cloud Run** → **Créer un service**.
2. **Déployer depuis une image conteneur** :
   - Sélectionnez l’image que vous venez de pousser (Artifact Registry : `europe-west1-docker.pkg.dev/.../web-app:latest`).
3. **Nom du service** : ex. `web-app`.
4. **Région** : même que l’image (ex. `europe-west1`).
5. **Authentification** : **Autoriser les requêtes non authentifiées** si vous voulez que le site soit public (ou « Exiger une authentification » pour restreindre).
6. **Connexion Cloud SQL** (important) :
   - Cliquez sur **Connexions** (ou **Connexions à des services en réseau**).
   - **Cloud SQL** : ajoutez votre instance (ex. `agrilogistic-db`).
7. **Variables et secrets** (section **Variables d’environnement et secrets**) :
   - Ajoutez les variables suivantes (remplacez les valeurs par les vôtres) :

| Nom | Valeur (exemple) |
|-----|------------------|
| `DATABASE_URL` | `postgresql://UTILISATEUR:MOT_DE_PASSE@/agrilogistic?host=/cloudsql/PROJECT:REGION:INSTANCE` |
| `BETTER_AUTH_SECRET` | Chaîne ≥ 32 caractères (ex. `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | `https://votre-service-XXXX.run.app` (URL Cloud Run après déploiement) |
| `NEXTAUTH_URL` | Même valeur que `BETTER_AUTH_URL` |
| `NEXT_PUBLIC_API_URL` | (optionnel) URL de votre API Gateway |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | (optionnel) Si vous utilisez Google OAuth |

Pour **DATABASE_URL** avec Cloud SQL :
- Utilisez le format socket :  
  `postgresql://USER:PASSWORD@/DATABASE?host=/cloudsql/CONNECTION_NAME`  
  où **CONNECTION_NAME** = `projet:region:instance` (ex. `agrilogistic-prod:europe-west1:agrilogistic-db`).

8. Cliquez sur **Créer** (ou **Déployer**).

**En ligne de commande (après avoir poussé l’image) :**

```bash
gcloud run deploy web-app \
  --image europe-west1-docker.pkg.dev/agrilogistic-prod/agrilogistic/web-app:latest \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances agrilogistic-prod:europe-west1:agrilogistic-db \
  --set-env-vars "BETTER_AUTH_SECRET=VOTRE_SECRET,BETTER_AUTH_URL=https://web-app-XXXX.run.app,NEXTAUTH_URL=https://web-app-XXXX.run.app" \
  --set-env-vars "DATABASE_URL=postgresql://USER:PASS@/agrilogistic?host=/cloudsql/agrilogistic-prod:europe-west1:agrilogistic-db"
```

(Remplacez les valeurs et l’URL Cloud Run réelle ; pour la première fois, vous pouvez mettre une URL temporaire puis la mettre à jour après le premier déploiement.)

---

## Étape 9 : Migrations Better Auth (tables utilisateur/session)

Better Auth a besoin de ses tables en base. À faire **une seule fois** (avec une `DATABASE_URL` pointant vers la même base que Cloud Run).

**Option A – Depuis votre machine (réseau autorisé) :**

Si votre IP est autorisée sur Cloud SQL (ou via proxy Cloud SQL) :

```bash
cd apps/web-app
npx @better-auth/cli@latest migrate
```

**Option B – Connexion via Cloud SQL Proxy en local :**

1. Téléchargez [Cloud SQL Proxy](https://cloud.google.com/sql/docs/mysql/connect-auth-proxy#install).
2. Lancez le proxy vers votre instance.
3. Utilisez `DATABASE_URL=postgresql://USER:PASS@localhost:5432/agrilogistic` et exécutez `npx @better-auth/cli@latest migrate` depuis **apps/web-app**.

**Option C – Depuis un job Cloud Run ou une petite VM une fois** : exécuter la même commande dans un conteneur qui a accès à Cloud SQL et la même `DATABASE_URL`.

---

## Étape 10 : Mettre à jour BETTER_AUTH_URL / NEXTAUTH_URL

Après le premier déploiement, Cloud Run vous donne une URL du type :  
`https://web-app-XXXXX-XX.a.run.app`.

1. **Cloud Run** → votre service **web-app** → **Modifier et déployer une nouvelle révision**.
2. Variables d’environnement : mettez **BETTER_AUTH_URL** et **NEXTAUTH_URL** à cette URL (avec `https://`).
3. Enregistrez une nouvelle révision.

Si vous utilisez **Google OAuth** : dans la [Console Google Cloud – Identifiants OAuth](https://console.cloud.google.com/apis/credentials), ajoutez dans **URI de redirection autorisés** :  
`https://web-app-XXXXX-XX.a.run.app/api/auth/callback/google`.

---

## Étape 11 : Vérifications après déploiement

1. Ouvrez l’URL Cloud Run dans le navigateur.
2. Testez : page d’accueil, **inscription**, **connexion**, redirection selon le rôle.
3. Vérifiez les logs : **Cloud Run** → **web-app** → **Journaux**.

En cas d’erreur 502/503 : vérifiez les variables d’environnement (surtout `DATABASE_URL` et connexion Cloud SQL) et que les migrations Better Auth ont bien été exécutées.

---

## Récapitulatif des étapes (ordre)

| # | Action |
|---|--------|
| 1 | Créer / sélectionner un projet GCP et activer la facturation |
| 2 | Activer les APIs (Cloud Run, Cloud SQL, Cloud Build, Artifact Registry, Secret Manager) |
| 3 | Créer une instance Cloud SQL PostgreSQL + base de données (+ utilisateur optionnel) |
| 4 | Créer un dépôt Artifact Registry (format Docker) |
| 5 | Configurer Docker pour Artifact Registry (`gcloud auth configure-docker`) |
| 6 | Builder l’image Docker (depuis le monorepo, contexte `apps/web-app`) |
| 7 | Pousser l’image vers Artifact Registry (ou la faire builder par Cloud Build) |
| 8 | Déployer sur Cloud Run avec connexion Cloud SQL et variables d’environnement |
| 9 | Exécuter les migrations Better Auth vers la base Cloud SQL |
| 10 | Mettre à jour BETTER_AUTH_URL / NEXTAUTH_URL avec l’URL Cloud Run finale |
| 11 | Tester l’application et consulter les journaux |

---

## Fichiers utiles dans le projet

- **apps/web-app/Dockerfile** : image Next.js (mode `standalone`).
- **apps/web-app/next.config.mjs** : contient `output: 'standalone'` pour que le Dockerfile fonctionne.
- **apps/web-app/.env.example** : liste des variables d’environnement (DATABASE_URL, BETTER_AUTH_*, NEXTAUTH_URL, etc.).

Pour aller plus loin : **Secret Manager** pour stocker `BETTER_AUTH_SECRET` et `DATABASE_URL` au lieu de les mettre en clair dans les variables d’environnement Cloud Run.
