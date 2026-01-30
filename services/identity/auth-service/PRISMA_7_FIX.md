# Résolution du Problème Prisma 7 (Erreur P1012)

## Problème

L'erreur suivante se produisait lors de l'exécution de `npx prisma generate` :

```
Error P1012: The datasource property `url` is no longer supported.
```

## Cause

Dans **Prisma 7**, la propriété `url` dans le bloc `datasource` du fichier `schema.prisma` a été dépréciée et n'est plus supportée. La configuration de la connexion à la base de données doit maintenant être effectuée dans un fichier `prisma.config.ts` séparé.

## Solution Implémentée

### 1. Modification du `schema.prisma`

**Avant :**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Après :**
```prisma
datasource db {
  provider = "postgresql"
  // Note: In Prisma 7+, the `url` property must be configured in prisma.config.ts
}
```

### 2. Création du fichier `prisma.config.ts`

Un nouveau fichier `prisma.config.ts` a été créé à la racine du service avec la configuration suivante :

```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

function getDatabaseUrl(): string {
  // If DATABASE_URL is explicitly set, use it
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Otherwise, construct it from individual variables
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME || 'AgriLogistic_auth';
  const user = process.env.DB_USER || 'AgriLogistic';
  const password = process.env.DB_PASSWORD || 'AgriLogistic_secure_2026';

  return `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;
}

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: getDatabaseUrl(),
  },
});
```

### 3. Mise à jour de `package.json`

- Ajout de `dotenv` comme dépendance
- Ajout de scripts Prisma :
  - `prisma:generate` : Génère le client Prisma
  - `prisma:migrate` : Exécute les migrations
  - `prisma:studio` : Ouvre Prisma Studio
- Modification des scripts de build pour inclure `prisma generate` :
  - `build`: `prisma generate && nest build`
  - `start:dev`: `prisma generate && nest start --watch`

### 4. Création de `.env.example`

Un fichier `.env.example` a été créé pour documenter toutes les variables d'environnement nécessaires, avec support pour :
- `DATABASE_URL` (option recommandée)
- Variables individuelles (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`)

## Utilisation

### Génération du Client Prisma

```bash
pnpm run prisma:generate
# ou
npx prisma generate
```

### Exécution des Migrations

```bash
pnpm run prisma:migrate
# ou
npx prisma migrate dev
```

### Configuration des Variables d'Environnement

Copiez `.env.example` vers `.env` et configurez vos variables :

```bash
cp .env.example .env
```

**Option 1 : Utiliser DATABASE_URL (recommandé)**
```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

**Option 2 : Utiliser des variables individuelles**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=AgriLogistic_auth
DB_USER=AgriLogistic
DB_PASSWORD=your_password
```

Le fichier `prisma.config.ts` construira automatiquement `DATABASE_URL` à partir des variables individuelles si `DATABASE_URL` n'est pas défini.

## Vérification

Pour vérifier que tout fonctionne correctement :

1. **Générer le client Prisma :**
   ```bash
   pnpm run prisma:generate
   ```

2. **Vérifier la connexion :**
   ```bash
   pnpm run prisma:studio
   ```

3. **Build du service :**
   ```bash
   pnpm run build
   ```

## Références

- [Prisma 7 Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Prisma Config Reference](https://www.prisma.io/docs/orm/reference/prisma-config-reference)
- [Prisma Schema Reference](https://www.prisma.io/docs/orm/reference/prisma-schema-reference)


