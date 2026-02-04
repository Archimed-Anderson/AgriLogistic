# Dépannage Installation Package

Il semble y avoir un problème persistant avec l'authentification npm/pnpm sur votre machine ("Access token expired or revoked").

Veuillez effectuer les étapes suivantes manuellement dans votre terminal pour corriger cela avant de relancer l'application :

1. **Logout de npm** (pour nettoyer les vieux tokens) :
   ```bash
   npm logout
   ```

2. **Suppression du fichier .npmrc local** (s'il contient des mauvais tokens) :
   ```powershell
   Remove-Item .npmrc
   ```

3. **Installation des packages** (better-auth et pg sont déjà dans `package.json`) :
   ```bash
   pnpm install
   ```
   Si besoin d’une installation forcée : `pnpm install better-auth pg --force`

Une fois ces dépendances installées sans erreur, vous pourrez redémarrer le serveur de développement :

```powershell
pnpm run dev
```

---

## Better Auth - Configuration et vérification (Étape 1)

1. **Variables d'environnement**  
   Copiez `.env.example` vers `.env.local` et renseignez au minimum :
   - `DATABASE_URL` : URL PostgreSQL (ex. `postgresql://AgriLogistic:...@localhost:5435/AgriLogistic`)
   - `NEXTAUTH_URL` ou `BETTER_AUTH_URL` : URL de l'app (ex. `http://localhost:3000`)
   - `BETTER_AUTH_SECRET` : générer avec `openssl rand -base64 32`
   - Pour Google : `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` (voir `.env.example` pour les étapes)

2. **Migration des tables Better Auth**  
   Depuis `apps/web-app` :
   ```bash
   npx @better-auth/cli@latest migrate --config src/auth.ts --yes
   ```

3. **Vérifier les tables**  
   La base pointée par `DATABASE_URL` doit contenir les tables : `user`, `session`, `account`, `verification`.  
   Exemple (PostgreSQL dans Docker) :
   ```powershell
   docker exec AgriLogistic-postgres psql -U AgriLogistic -d AgriLogistic -tAc "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;"
   ```
   Vous devez voir : `account`, `session`, `user`, `verification`.
