# 🔧 Guide de Résolution des Problèmes

## ✅ Problèmes Résolus

### 1. ✅ OAuth2 Non Configuré
**Problème :** `Error: Google OAuth2 credentials are not configured`

**Solution :** OAuth2 est maintenant **optionnel**. L'application fonctionne sans configuration OAuth2.

**Status :** ✅ **RÉSOLU** - L'application démarre même sans credentials OAuth2.

---

## 🗄️ Problème : Connexion à la Base de Données

### Erreur
```
❌ Database connection test failed: error: authentification par mot de passe échouée
```

### Solutions

#### Solution 1 : Utiliser Docker Compose (RECOMMANDÉ)

```powershell
cd AgroDeep/services/auth-service
docker-compose up -d
```

Cela démarre automatiquement PostgreSQL et Redis avec la bonne configuration.

**Après Docker :**
```powershell
# Vérifier que les conteneurs sont démarrés
docker ps

# Vérifier les logs
docker-compose logs auth-db
```

#### Solution 2 : Configurer PostgreSQL Localement

**Étape 1 : Créer la base de données**

```powershell
# Se connecter à PostgreSQL (en tant qu'administrateur)
psql -U postgres

# Dans psql, exécuter :
CREATE DATABASE agrodeep_auth;
CREATE USER agrodeep WITH PASSWORD 'agrodeep_password';
GRANT ALL PRIVILEGES ON DATABASE agrodeep_auth TO agrodeep;
ALTER USER agrodeep CREATEDB;
\q
```

**Étape 2 : Créer le fichier .env**

Créez `AgroDeep/services/auth-service/.env` :

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agrodeep_auth
DB_USER=agrodeep
DB_PASSWORD=agrodeep_password

# JWT (OBLIGATOIRE)
JWT_ACCESS_SECRET=agrodeep_secure_jwt_access_secret_2026
JWT_REFRESH_SECRET=agrodeep_secure_jwt_refresh_secret_2026

# Redis (OPTIONNEL)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password
```

**Étape 3 : Exécuter les migrations**

```powershell
cd AgroDeep/services/auth-service

# Option A : Via psql
psql -U agrodeep -d agrodeep_auth -f migrations/001_init_schema.sql
psql -U agrodeep -d agrodeep_auth -f migrations/002_multi_role_migration.sql

# Option B : L'application les exécutera automatiquement au démarrage si configurée
```

#### Solution 3 : Utiliser des Credentials Existants

Si vous avez déjà PostgreSQL configuré, modifiez simplement le `.env` :

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=votre_base
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
```

---

## 🚀 Démarrage de l'Application

### Après Configuration de la Base de Données

```powershell
cd AgroDeep/services/auth-service

# 1. Initialiser l'admin (première fois seulement)
npm run seed:admin

# 2. Démarrer l'application
npm run dev        # Mode développement
# OU
npm run build      # Compiler
npm start          # Mode production
```

### Vérification

```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:3001/health"

# Login admin
$body = @{
    email = "admintest@gmail.com"
    password = "Admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/v1/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

## 📋 Checklist de Configuration

- [ ] PostgreSQL installé et démarré (ou Docker Compose)
- [ ] Base de données `agrodeep_auth` créée
- [ ] Utilisateur `agrodeep` créé avec mot de passe
- [ ] Fichier `.env` créé avec les bonnes valeurs
- [ ] Variables `JWT_ACCESS_SECRET` et `JWT_REFRESH_SECRET` définies
- [ ] Migrations exécutées (ou laisser l'application les exécuter)
- [ ] Redis démarré (optionnel mais recommandé)

---

## 🔍 Commandes de Diagnostic

### Vérifier PostgreSQL

```powershell
# Vérifier que PostgreSQL est démarré
pg_isready

# Tester la connexion
psql -U agrodeep -d agrodeep_auth -c "SELECT version();"

# Lister les bases de données
psql -U postgres -c "\l"
```

### Vérifier Docker

```powershell
# Vérifier les conteneurs
docker ps

# Voir les logs
docker-compose logs

# Redémarrer les services
docker-compose restart
```

### Vérifier les Variables d'Environnement

```powershell
cd AgroDeep/services/auth-service

# Afficher les variables (PowerShell)
Get-Content .env

# Tester la connexion depuis Node.js
node -e "require('dotenv').config(); const {Database} = require('./dist/config/database'); Database.testConnection().then(r => console.log(r ? '✅ OK' : '❌ Failed')).catch(e => console.error('❌', e.message))"
```

---

## 💡 Astuces

1. **Docker Compose est la solution la plus simple** - Tout est pré-configuré
2. **OAuth2 est optionnel** - L'application fonctionne sans
3. **Redis est optionnel** - L'application fonctionne sans, mais certaines fonctionnalités seront limitées
4. **Les migrations peuvent être exécutées manuellement ou automatiquement**

---

## 📞 Support

Si les problèmes persistent :
1. Vérifiez les logs : `docker-compose logs` ou les logs de l'application
2. Vérifiez que tous les services sont démarrés
3. Vérifiez les permissions PostgreSQL
4. Vérifiez le fichier `.env` pour les typos
