# Guide de Test des Corrections Prisma 7

Ce guide explique comment tester toutes les corrections apportées pour résoudre l'erreur P1012 de Prisma 7.

## Prérequis

- Node.js >= 18.0.0
- pnpm installé (ou npm)
- Prisma CLI installé (`pnpm add -D prisma` ou globalement)

## Tests Automatiques

### Sur Linux/Mac (Bash)

```bash
cd services/identity/auth-service
chmod +x scripts/test-prisma-fix.sh
./scripts/test-prisma-fix.sh
```

### Sur Windows (PowerShell)

```powershell
cd services/identity/auth-service
.\scripts\test-prisma-fix.ps1
```

## Tests Manuels

### 1. Test de Génération Prisma

#### Avec DATABASE_URL

```bash
cd services/identity/auth-service

# Définir DATABASE_URL
export DATABASE_URL="postgresql://AgriLogistic:AgriLogistic_secure_2026@localhost:5432/AgriLogistic_auth?schema=public"

# Générer le client Prisma
pnpm run prisma:generate

# Vérifier qu'il n'y a pas d'erreur P1012
# Le client devrait être généré dans node_modules/.prisma/client
```

#### Avec Variables Individuelles

```bash
cd services/identity/auth-service

# Nettoyer DATABASE_URL
unset DATABASE_URL

# Définir les variables individuelles
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=AgriLogistic_auth
export DB_USER=AgriLogistic
export DB_PASSWORD=AgriLogistic_secure_2026

# Générer le client Prisma
pnpm run prisma:generate

# Vérifier qu'il n'y a pas d'erreur P1012
```

### 2. Test de Validation du Schema

```bash
cd services/identity/auth-service

# Valider le schema Prisma
npx prisma validate

# Vérifier qu'il n'y a pas d'erreurs
```

### 3. Test de Format du Schema

```bash
cd services/identity/auth-service

# Formater le schema
npx prisma format

# Vérifier qu'il n'y a pas d'erreurs de formatage
```

### 4. Test de Build du Service

```bash
cd services/identity/auth-service

# Installer les dépendances si nécessaire
pnpm install

# Build du service (inclut prisma generate)
pnpm run build

# Vérifier que le build réussit sans erreur P1012
```

### 5. Test de Compilation TypeScript

```bash
cd services/identity/auth-service

# Compiler prisma.config.ts
npx tsc --noEmit prisma.config.ts

# Vérifier qu'il n'y a pas d'erreurs TypeScript
```

### 6. Test de Connexion à la Base de Données (Optionnel)

Si vous avez une base de données PostgreSQL en cours d'exécution :

```bash
cd services/identity/auth-service

# Configurer .env avec vos credentials
cp .env.example .env
# Éditer .env avec vos valeurs

# Tester la connexion avec Prisma Studio
pnpm run prisma:studio

# Ou tester avec une migration
pnpm run prisma:migrate dev --name test
```

## Checklist de Vérification

- [ ] Le fichier `prisma.config.ts` existe et compile sans erreurs
- [ ] Le fichier `prisma/schema.prisma` ne contient pas `url = env("DATABASE_URL")`
- [ ] Le script `pnpm run prisma:generate` fonctionne sans erreur P1012
- [ ] Le script `pnpm run build` fonctionne correctement
- [ ] Le fichier `.env.example` contient toutes les variables nécessaires
- [ ] Les scripts Prisma sont présents dans `package.json`
- [ ] `dotenv` est présent dans les dépendances
- [ ] La génération fonctionne avec `DATABASE_URL`
- [ ] La génération fonctionne avec des variables individuelles

## Résolution des Problèmes

### Erreur: "Cannot find module 'prisma/config'"

**Solution:** Vérifiez que Prisma 7.3.0 est installé :
```bash
pnpm list prisma
# Devrait afficher prisma@7.3.0
```

Si ce n'est pas le cas :
```bash
pnpm add -D prisma@7.3.0
```

### Erreur: "The datasource property `url` is no longer supported"

**Solution:** Vérifiez que :
1. Le fichier `prisma.config.ts` existe
2. Le fichier `prisma/schema.prisma` ne contient pas `url = env("DATABASE_URL")`
3. Le fichier `prisma.config.ts` contient la configuration `datasource.url`

### Erreur TypeScript dans prisma.config.ts

**Solution:** Vérifiez que :
1. `dotenv` est installé : `pnpm add dotenv`
2. Les types TypeScript sont corrects
3. Le fichier `tsconfig.json` est correctement configuré

### Le client Prisma n'est pas généré

**Solution:** 
1. Vérifiez que les variables d'environnement sont correctement définies
2. Vérifiez que `prisma.config.ts` peut construire `DATABASE_URL`
3. Exécutez `pnpm run prisma:generate` manuellement et vérifiez les erreurs

## Résultats Attendus

Après avoir exécuté tous les tests, vous devriez avoir :

1. âœ… Aucune erreur P1012 lors de la génération Prisma
2. âœ… Le client Prisma généré dans `node_modules/.prisma/client`
3. âœ… Le service compile sans erreurs
4. âœ… Tous les scripts fonctionnent correctement

## Support

Si vous rencontrez des problèmes, consultez :
- [PRISMA_7_FIX.md](./PRISMA_7_FIX.md) pour les détails de la correction
- [Documentation Prisma 7](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)


