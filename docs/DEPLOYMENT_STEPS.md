# Déploiement Production - Guide Étape par Étape

## 📋 Checklist de Déploiement

- [ ] **Étape 1**: Créer les buckets Cloudflare R2 (10 min)
- [ ] **Étape 2**: Déployer le frontend sur Vercel (5 min)
- [ ] **Étape 3**: Déployer les services backend sur Render (10 min)

---

## 🪣 Étape 1: Créer les Buckets Cloudflare R2

### 1.1 Accéder au Dashboard R2

1. Ouvrez votre navigateur et allez sur: https://dash.cloudflare.com
2. Connectez-vous avec vos identifiants Cloudflare
3. Dans le menu latéral gauche, cliquez sur **"R2 Object Storage"**

### 1.2 Créer les 5 Buckets

Créez les buckets suivants un par un:

#### Bucket 1: `agri-products` (Public)
```
Nom: agri-products
Région: Automatic
Accès public: ✅ Activé
```

#### Bucket 2: `agri-kyc` (Privé)
```
Nom: agri-kyc
Région: Automatic
Accès public: ❌ Désactivé
```

#### Bucket 3: `agri-pods` (Privé)
```
Nom: agri-pods
Région: Automatic
Accès public: ❌ Désactivé
```

#### Bucket 4: `agri-diagnostics` (Privé)
```
Nom: agri-diagnostics
Région: Automatic
Accès public: ❌ Désactivé
```

#### Bucket 5: `agri-contracts` (Privé)
```
Nom: agri-contracts
Région: Automatic
Accès public: ❌ Désactivé
```

### 1.3 Configurer CORS pour Chaque Bucket

Pour chaque bucket, allez dans **Settings → CORS policy** et ajoutez:

```json
[
  {
    "AllowedOrigins": [
      "https://agrilogistic.vercel.app",
      "https://*.vercel.app",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### 1.4 Créer les Credentials API R2

1. Allez dans **R2 → Manage R2 API Tokens**
2. Cliquez sur **"Create API token"**
3. Configuration:
   - **Nom**: `agrilogistic-prod`
   - **Permissions**: Object Read & Write
   - **TTL**: Unlimited
4. Cliquez sur **"Create API Token"**
5. **IMPORTANT**: Copiez et sauvegardez:
   - ✅ Access Key ID
   - ✅ Secret Access Key
   - ✅ Account ID (visible en haut de la page R2)

---

## 🚀 Étape 2: Déployer sur Vercel

### 2.1 Installer Vercel CLI

```powershell
pnpm add -g vercel
```

### 2.2 Lier le Projet

```powershell
cd apps/web-app
vercel login
vercel link
```

Suivez les instructions:
- **Set up and deploy**: Yes
- **Which scope**: Votre compte personnel
- **Link to existing project**: No
- **Project name**: agrilogistic
- **Directory**: `./` (laisser par défaut)

### 2.3 Configurer les Variables d'Environnement

Allez sur https://vercel.com/dashboard et:

1. Sélectionnez votre projet **agrilogistic**
2. Allez dans **Settings → Environment Variables**
3. Ajoutez les variables suivantes pour **Production**:

```bash
# API Endpoints
NEXT_PUBLIC_API_URL=https://agri-api.onrender.com/api/v1
NEXT_PUBLIC_AI_SERVICE_URL=https://agri-ai.onrender.com

# Database
DATABASE_URL=postgresql://neondb_owner:npg_jBu4ziNpFJ2K@ep-calm-darkness-agxphgbo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

# R2 Credentials (remplacez par vos valeurs)
R2_ACCOUNT_ID=<votre-account-id>
R2_ACCESS_KEY_ID=<votre-access-key-id>
R2_SECRET_ACCESS_KEY=<votre-secret-access-key>
NEXT_PUBLIC_R2_URL=https://agri-products.<account-id>.r2.cloudflarestorage.com
```

### 2.4 Mettre à Jour vercel.json

Éditez `apps/web-app/vercel.json` et remplacez `ACCOUNT_ID` à la ligne 48:

```json
"destination": "https://agri-products.VOTRE_ACCOUNT_ID.r2.cloudflarestorage.com/:path*"
```

### 2.5 Déployer

```powershell
vercel --prod
```

✅ **Vérification**: Visitez l'URL fournie par Vercel

---

## ⚙️ Étape 3: Déployer sur Render

### 3.1 Créer un Compte Render

1. Allez sur https://render.com
2. Cliquez sur **"Get Started"**
3. Connectez-vous avec GitHub

### 3.2 Connecter le Repository

1. Dans le dashboard Render, cliquez sur **"New +"**
2. Sélectionnez **"Blueprint"**
3. Connectez votre repository GitHub
4. Sélectionnez le repository **Agrodeepwebapp-main**
5. Render détectera automatiquement `render.yaml`

### 3.3 Configurer les Variables d'Environnement

Pour le service **agri-api**:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_jBu4ziNpFJ2K@ep-calm-darkness-agxphgbo-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://neondb_owner:npg_jBu4ziNpFJ2K@ep-calm-darkness-agxphgbo.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
R2_ACCOUNT_ID=<votre-account-id>
R2_ACCESS_KEY_ID=<votre-access-key-id>
R2_SECRET_ACCESS_KEY=<votre-secret-access-key>
JWT_SECRET=<cliquez-sur-generate>
CORS_ORIGIN=https://agrilogistic.vercel.app
```

Pour le service **agri-ai**:

```bash
R2_ACCOUNT_ID=<votre-account-id>
R2_ACCESS_KEY_ID=<votre-access-key-id>
R2_SECRET_ACCESS_KEY=<votre-secret-access-key>
CORS_ORIGIN=https://agrilogistic.vercel.app
```

### 3.4 Déployer

1. Cliquez sur **"Apply"**
2. Render va:
   - Créer les 2 services (agri-api + agri-ai)
   - Installer les dépendances
   - Déployer automatiquement

⏱️ **Temps estimé**: 5-10 minutes

### 3.5 Vérifier les Déploiements

```bash
# Vérifier l'API
curl https://agri-api.onrender.com/health

# Vérifier le service AI
curl https://agri-ai.onrender.com/health
```

Réponse attendue:
```json
{
  "status": "ok",
  "service": "agri-api",
  "timestamp": "2026-02-07T01:20:00Z"
}
```

---

## ✅ Vérification Finale

### Checklist de Validation

- [ ] Les 5 buckets R2 sont créés
- [ ] Les credentials R2 sont sauvegardés
- [ ] Le frontend Vercel est accessible
- [ ] L'API Render répond au health check
- [ ] Le service AI Render répond au health check
- [ ] Les variables d'environnement sont configurées

### URLs de Production

- **Frontend**: https://agrilogistic.vercel.app
- **API**: https://agri-api.onrender.com
- **AI Service**: https://agri-ai.onrender.com
- **Database**: Neon PostgreSQL (serverless)
- **Storage**: Cloudflare R2

---

## 🎉 Félicitations !

Votre plateforme AgriLogistic est maintenant déployée en production avec une architecture Cloud Native !

**Coût mensuel**: **$0** (free tiers)

**Prochaines étapes**:
1. Configurer un nom de domaine personnalisé
2. Activer les alertes de monitoring
3. Configurer les backups automatiques
4. Tester les flux end-to-end
