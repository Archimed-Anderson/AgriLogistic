# Dépannage - AgroDeep / AgriLogistic

Ce document décrit les problèmes courants au démarrage des services backend et leur résolution.

---

## 1. Base de données manquante (`productions_db` ou autres)

**Symptôme** : Le service `production-service` (ou un autre) échoue avec une erreur du type « database does not exist » ou « connection refused » vers une base nommée `productions_db`.

**Cause** : Le volume PostgreSQL a été créé avant l’ajout de `productions_db` dans `POSTGRES_MULTIPLE_DATABASES`. Les scripts d’init ne s’exécutent qu’au **premier** démarrage du conteneur Postgres.

### Solution recommandée (Docker)

Exécuter le script qui crée les bases manquantes et applique le schéma :

```powershell
.\scripts\ensure-databases.ps1
```

Le script :

- Vérifie que le conteneur `AgriLogistic-postgres` tourne
- Crée les bases manquantes : `AgriLogistic_auth`, `AgriLogistic_products`, `AgriLogistic_orders`, `AgriLogistic_payments`, `admin_db`, `productions_db`
- Applique le schéma `productions_db` (tables, extensions) si la base vient d’être créée

### Solution manuelle (psql dans le conteneur)

```powershell
# Entrer dans le conteneur Postgres
docker exec -it AgriLogistic-postgres psql -U AgriLogistic -d postgres

# Dans psql
CREATE DATABASE productions_db;
-- Autres bases si besoin : AgriLogistic_auth, etc.
\q
```

Puis appliquer le schéma productions (fichier monté dans le conteneur) :

```powershell
docker exec AgriLogistic-postgres psql -U AgriLogistic -d productions_db -f /docker-entrypoint-initdb.d/zz_productions_schema.sql
```

### Vérification des variables d’environnement

Pour le **production-service** (Docker), l’URL doit pointer vers la base `productions_db` sur le service `postgres` (port interne 5432). Dans `docker-compose.yml` c’est déjà configuré ainsi :

- `DATABASE_URL=postgresql://AgriLogistic:...@postgres:5432/productions_db`

En **développement local** (hors Docker), dans le `.env` du service ou à la racine :

```env
DATABASE_URL="postgresql://AgriLogistic:AgriLogistic_secure_2026@localhost:5435/productions_db"
```

(Adapter `localhost` et le port selon votre exposition Postgres, par ex. `POSTGRES_PORT` dans le `.env`.)

---

## 2. Port déjà utilisé (EADDRINUSE – ex. 3018)

**Symptôme** : Le service `production-service` ne démarre pas avec une erreur du type « EADDRINUSE: address already in use :::3018 ».

**Cause** : Un autre processus (souvent une ancienne instance du même service) écoute déjà sur le port 3018.

### Solution 1 : Libérer le port (Windows)

```powershell
# Trouver le PID qui utilise le port 3018
netstat -ano | findstr :3018

# Noter le PID (dernier nombre de la ligne) puis arrêter le processus
taskkill /PID <PID> /F
```

Exemple : si la ligne se termine par `12345`, exécuter `taskkill /PID 12345 /F`.

### Solution 2 : Utiliser un autre port (recommandé si 3018 doit rester occupé)

Le port exposé du **production-service** est configurable via une variable d’environnement.

Dans le fichier `.env` à la racine du projet :

```env
PRODUCTION_SERVICE_PORT=3019
```

Puis redémarrer les services :

```powershell
docker compose up -d production-service
```

Le service reste à l’écoute sur 3018 **à l’intérieur** du conteneur ; seul le port exposé sur l’hôte change (ex. 3019).

---

## 3. User Service – « authentification par mot de passe échouée »

**Symptôme** : Le `user-service` (ou auth) affiche une erreur du type « password authentication failed ».

**Cause fréquente** : Ce n’est pas toujours un mauvais mot de passe. Souvent la connexion est **refusée** avant l’étape d’authentification (base inexistante, mauvais host/port, conteneur Postgres pas prêt). Le client PostgreSQL peut alors afficher un message trompeur.

**À faire** :

1. Vérifier que la base attendue existe (voir [§ 1](#1-base-de-données-manquante-productions_db-ou-autres)).
2. Vérifier que le mot de passe dans `.env` (ou dans `docker-compose`) correspond à celui du conteneur Postgres : `DB_PASSWORD` = `POSTGRES_PASSWORD`.
3. Si vous avez changé le mot de passe Postgres après la création du volume, réinitialiser le mot de passe dans le conteneur :

   ```powershell
   docker exec -it AgriLogistic-postgres psql -U AgriLogistic -d postgres -c "ALTER USER AgriLogistic WITH PASSWORD 'AgriLogistic_secure_2026';"
   ```

   (Remplacer par la valeur utilisée dans `DB_PASSWORD`.)

---

## 4. Relancer les migrations / schémas (Prisma ou SQL)

Si les **tables** manquent dans une base existante :

- **Production-service** : pas de Prisma ; le schéma est appliqué par `zz_productions_schema.sql`. Utiliser `ensure-databases.ps1` ou la commande manuelle `docker exec ... psql -d productions_db -f /docker-entrypoint-initdb.d/zz_productions_schema.sql` (voir § 1).
- **Services avec Prisma** : depuis le dossier du service concerné :

  ```bash
  npx prisma db push
  # ou
  npx prisma migrate dev
  ```

---

## 5. Ordre recommandé après corrections

1. Créer les bases manquantes : `.\scripts\ensure-databases.ps1`
2. Libérer le port ou définir `PRODUCTION_SERVICE_PORT` dans `.env`
3. Vérifier `.env` (notamment `DATABASE_URL`, `DB_PASSWORD`, `POSTGRES_PORT`)
4. Relancer : `docker compose up -d` ou `.\scripts\fix-and-start.ps1` puis vos commandes habituelles

Le script `.\scripts\fix-and-start.ps1` inclut désormais une étape qui appelle `ensure-databases.ps1` pour créer les bases manquantes automatiquement.
