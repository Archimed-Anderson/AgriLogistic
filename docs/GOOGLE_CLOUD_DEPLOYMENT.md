# ☁️ Déploiement Google Cloud Run - AgriLogistic

Guide pour déployer l'application web via Docker sur Google Cloud Platform (GCP).

## 1. Prérequis
- Un compte Google Cloud avec la facturation activée.
- Le SDK `gcloud` installé et configuré.
- L'API Cloud Run et Artifact Registry activées.

## 2. Dockerisation
Le projet contient un Dockerfile optimisé pour Vercel/Cloud Run dans `apps/web-app/Dockerfile`.

### Build local (Test)
```bash
docker build -t agrilogistic-web -f apps/web-app/Dockerfile .
```

## 3. Artifact Registry (Backend Docker)
1. Créez un dépôt Docker :
   ```bash
   gcloud artifacts repositories create agrilogistic-repo --repository-format=docker --location=europe-west1
   ```
2. Configurez Docker pour gcloud :
   ```bash
   gcloud auth configure-docker europe-west1-docker.pkg.dev
   ```

## 4. Build & Push via Cloud Build
Utilisez le fichier `cloudbuild.yaml` à la racine pour automatiser le build :
```bash
gcloud builds submit --config cloudbuild.yaml .
```

## 5. Déploiement sur Cloud Run
Déployez l'image générée :
```bash
gcloud run deploy agrilogistic-web \
  --image europe-west1-docker.pkg.dev/[PROJECT_ID]/agrilogistic-repo/web-app:latest \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=your_cloud_sql_proxy_url" \
  --set-env-vars "BETTER_AUTH_SECRET=your_secret" \
  --add-cloudsql-instances [PROJECT_ID]:europe-west1:agrilogistic-db
```

## 6. Configuration Cloud SQL
Pour connecter Cloud Run à Cloud SQL :
1. Utilisez le **Cloud SQL Auth Proxy**.
2. Dans Cloud Run, ajoutez l'instance Cloud SQL dans l'onglet "Connexions".
3. L'URL de connexion sera généralement sous la forme :
   `postgresql://user:password@localhost:5432/db?host=/cloudsql/[PROJECT_ID]:europe-west1:agrilogistic-db`

## 7. Migration
Exécutez les migrations via un job Cloud Run temporaire ou via un accès sécurisé :
```bash
npx @better-auth/cli@latest migrate
```
