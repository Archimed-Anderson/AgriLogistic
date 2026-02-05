# 🐘 Configuration Neon Postgres (Serverless)

Neon est idéal pour AgriLogistic en raison de son architecture serverless et de ses capacités de branchement.

## 1. Création du Projet Neon
1. Inscrivez-vous sur [Neon.tech](https://neon.tech).
2. Créez un nouveau projet nommé `AgriLogistic`.
3. Choisissez la région la plus proche de votre déploiement (ex: `AWS Frankfurt` pour l'Europe).

## 2. Récupération de la Chaîne de Connexion
Dans votre dashboard Neon :
1. Allez dans **Connection Details**.
2. Sélectionnez **"Connection string"**.
3. **TRÈS IMPORTANT** : Pour les environnements de type Serverless (Vercel, Cloud Run), cochez l'option **"Pooled connection"**.
   - Sans le pooling, vous risquez d'épuiser les connexions Postgres rapidement ("Maximum connections reached").
   - La chaîne de connexion ressemblera à : `postgresql://user:pass@ep-cool-ice-123-pooler.aws.neon.tech/db?sslmode=require`

## 3. Configuration dans AgriLogistic
Mettez à jour votre fichier `.env.local` ou vos paramètres Vercel :
```env
DATABASE_URL="postgresql://...-pooler.aws.neon.tech/neondb?sslmode=require"
```

## 4. Branchement (Database Branching)
Pour vos pipelines de CI/CD, vous pouvez créer des branches de base de données :
- `main` : Production.
- `staging` : Copie de prod pour les tests.
- `dev` : Pour le développement local.

## 5. Migration des Tables
Une fois connecté, lancez la migration Better Auth :
```bash
cd apps/web-app
npx @better-auth/cli@latest migrate --yes
```
*(Optionnel) Utilisez l'Editeur SQL de Neon pour vérifier que les tables `user`, `session` et `account` sont bien créées.*
