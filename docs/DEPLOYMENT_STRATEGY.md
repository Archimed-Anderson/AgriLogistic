# 🚀 Stratégie de Déploiement & Runbook (Atterrissage Doux)

Ce document détaille la procédure pour déployer AgriLogistic en production sans interruption de service (Zero Downtime).

## 1. Stratégie de Déploiement : Blue-Green / Canary

### Frontend (Vercel)
Vercel gère nativement les déploiements atomiques (Atomic Deploys). Chaque Push crée une URL unique.

1.  **Preview (Green)** : Tout commit sur une branche (ex: `staging`) génère une URL de prévisualisation.
2.  **Validation** : Tester cette URL avec les APIs de production ou staging.
3.  **Promotion (Switch)** : Merger sur `main`. Vercel bascule le trafic instantanément vers la nouvelle version.
    *   *Rollback Instantané* : Via le dashboard Vercel, "Redeploy" une version précédente prend 2 secondes.

### Backend (Render)
Render supporte le Zero Downtime Deployment.

1.  **Health Check** : Render démarre la nouvelle instance (Green) à côté de l'ancienne (Blue).
2.  **Traffic Switch** : Le trafic n'est basculé que si l'endpoint `/health` répond 200 OK.
3.  **Drain** : L'ancienne instance (Blue) est éteinte après le basculement.
    *   *Note* : Assurez-vous que vos migrations DB sont rétro-compatibles (ajouts de colonnes uniquement, suppressions différées).

### Database (Neon PostgreSQL)
Utilisez le **Branching** pour valider les migrations.

1.  **Data Branch** : Créez une branche `staging_db` clonée depuis `main`.
2.  **Test Migration** : Exécutez `prisma migrate deploy` sur `staging_db`.
3.  **Validation** : Vérifiez l'intégrité des données.
4.  **Application** : Appliquez sur `main` uniquement après succès.

---

## 2. Runbook de Mise en Production (Checklist)

Avant de merger sur `main` ou de déclencher le déploiement :

### ✅ Pré-Requis (Code & Tests)
- [ ] **Tests Verts** : `pnpm test` passe à 100%.
- [ ] **Build Valide** : `pnpm build` ne retourne aucune erreur TypeScript.
- [ ] **Lint Clean** : `pnpm lint` ne rapporte aucun warning bloquant.

### ✅ Infrastructure & Données
- [ ] **Secrets Production** : Les variables d'env (Render/Vercel) sont à jour.
- [ ] **Backup Database** : Snapshot manuel effectué sur Neon console.
- [ ] **Migrations DB** :
    - [ ] Script de migration généré (`prisma migrate dev`).
    - [ ] Testé sur une copie de la DB (Neon Branch).
    - [ ] Rétro-compatible (pas de `DROP COLUMN` sans stratégie).

### ✅ Monitoring (Avant Switch)
- [ ] **Health Checks** : Les endpoints `/health` répondent < 200ms.
- [ ] **Alertes** : Prometheus/Grafana actif et prêt à détecter les pics d'erreurs 5xx.

---

## 3. Procédure de Rollback (Plan B)

Si une anomalie critique (Erreurs > 1%, Latence > 2s) est détectée après déploiement.

### A. Rollback Applicatif (Code)
Utilisez le script automatisé ou Git :

```bash
# Revenir au commit précédent et forcer le push (si urgence absolue)
./scripts/rollback.sh
```

Ou via les Dashboards (Recommandé) :
- **Vercel** : Project > Deployments > [Version Précédente] > "Instant Rollback".
- **Render** : Dashboard > Deploys > [Version Précédente] > "Rollback".

### B. Rollback Base de Données
Si une migration a corrompu des données :
1.  **Stop App** : Mettre l'application en maintenance (Page statique).
2.  **Restore** : Restaurer le snapshot Neon "Pre-Deploy".
3.  **Restart** : Relancer les services.

---

## 4. Smoke Test (Post-Déploiement)

Vérification manuelle rapide sur la Production :

1.  Login Admin OK ?
2.  Chargement Dashboard < 2s ?
3.  Création d'un item (ex: Utilisateur test) OK ?
