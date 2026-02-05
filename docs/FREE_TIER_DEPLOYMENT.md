# Options gratuites pour la phase test – Web App Next.js

Ce document compare les **offres gratuites** adaptées à une application en **phase test** (Next.js + PostgreSQL / Better Auth) et recommande le meilleur choix.

---

## Comparatif rapide

| Option | Coût | Base de données | Limites / contraintes |
|--------|------|------------------|------------------------|
| **Vercel + Neon** | **0 €** | Neon gratuit (0,5 Go, sans expiration) | Vercel Hobby = usage personnel / démo. Parfait pour Next.js. |
| **Render** | **0 €** | Postgres Render gratuit **30 jours** puis suppression ou passage payant | Service « endort » après 15 min inactivité (réveil ~1 min). |
| **AWS Amplify + Neon** | **0 €** (12 mois) | Neon gratuit | 1000 min build/mois, 15 Go transfert. Puis facturation. |
| **Google Cloud Run + Neon** | **0 €** | Neon gratuit (pas de Cloud SQL) | 2 M requêtes/mois Cloud Run gratuit. Pas de carte pour Neon. |
| **Google Cloud Run + Cloud SQL** | **~0 €** (crédit 90 j) | Cloud SQL payant après crédit | 300 $ offerts 90 j ; Cloud SQL consomme le crédit. |

---

## Recommandation : meilleur choix pour la phase test

### 1. **Vercel + Neon (recommandé)**

- **Coût** : 0 €.
- **Pourquoi** : Vercel est fait pour Next.js (déploiement en 1 clic), Neon fournit PostgreSQL gratuit **sans expiration** et sans carte bancaire. Idéal pour tester longtemps.
- **À faire** :
  1. Créer un projet sur [Neon](https://neon.tech) (Postgres gratuit, 0,5 Go).
  2. Récupérer la **connection string** PostgreSQL (format `postgresql://...`).
  3. Sur [Vercel](https://vercel.com) : importer le repo, **Root Directory** = `apps/web-app`, puis ajouter les variables d’environnement :
     - `DATABASE_URL` = chaîne Neon
     - `BETTER_AUTH_SECRET` (générer : `openssl rand -base64 32`)
     - `BETTER_AUTH_URL` = `https://votre-projet.vercel.app`
     - `NEXTAUTH_URL` = idem
  4. Déployer. En cas d’échec de build : vérifier **Root Directory** = `apps/web-app` (voir [docs/VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)).
- **Limite** : Le plan Vercel Hobby est pour usage **non commercial / personnel**. Pour une démo ou un test interne, c’est en général acceptable.

---

### 2. **Render (simple, mais base limitée à 30 jours)**

- **Coût** : 0 € tant que vous restez en gratuit.
- **Pourquoi** : Très simple, une seule plateforme pour l’app et la base. Pas besoin de compte Neon à part.
- **Contrainte** : Le Postgres gratuit Render **expire après 30 jours** ; ensuite il faut passer payant ou perdre les données. À réserver à un test court (1 mois).
- **À faire** : [Render](https://render.com) → New → Web Service (repo GitHub, build `pnpm install && pnpm build`, start `pnpm start`) + création d’une base PostgreSQL gratuite (à connecter en `DATABASE_URL`). Root Directory = `apps/web-app` si monorepo (ou déployer depuis un repo qui contient seulement `apps/web-app`).

---

### 3. **AWS Amplify + Neon**

- **Coût** : 0 € pendant 12 mois (Free Tier), puis facturation.
- **Pourquoi** : Si vous voulez être déjà sur AWS (équipe, conventions), Amplify gère Next.js et Neon évite de payer RDS en phase test.
- **Limites** : 1000 min de build/mois, 15 Go de transfert sortant/mois. Au-delà, ou après 12 mois, vous payez.
- **À faire** : Créer un projet Neon (DB), déployer l’app sur [AWS Amplify](https://console.aws.amazon.com/amplify/) (connexion GitHub, détection Next.js), définir **Root Directory** = `apps/web-app`, ajouter les variables d’environnement (dont `DATABASE_URL` Neon). Voir la doc Amplify Next.js pour les détails.

---

### 4. **Google Cloud Run + Neon (sans Cloud SQL)**

- **Coût** : 0 € (Cloud Run a un free tier mensuel ; Neon reste gratuit).
- **Pourquoi** : Vous gardez le déploiement sur GCP (comme dans [docs/GOOGLE_CLOUD_DEPLOYMENT.md](GOOGLE_CLOUD_DEPLOYMENT.md)) mais vous **n’utilisez pas Cloud SQL** : vous pointez `DATABASE_URL` vers **Neon**. Ainsi, pas de coût base de données sur GCP.
- **À faire** : Suivre le guide Google Cloud (étapes 1, 2, 4, 5, 6, 7, 8) en utilisant une **Neon connection string** pour `DATABASE_URL` au lieu de Cloud SQL. Vous pouvez ignorer l’étape 3 (Cloud SQL) et l’étape 9 (connexion Cloud SQL dans Cloud Run). Le reste (image, Cloud Run, variables) reste valable.

---

## Base de données gratuite : Neon (recommandée)

- **Neon** : [neon.tech](https://neon.tech)  
  - Postgres managé, **gratuit** (0,5 Go par projet, sans expiration).  
  - Pas de carte bancaire pour commencer.  
  - Compatible Better Auth (PostgreSQL).  
  - Vous fournit une `DATABASE_URL` à mettre dans Vercel / Render / Amplify / Cloud Run.

**Configuration pas à pas** : voir **[docs/NEON_SETUP.md](NEON_SETUP.md)** (création compte, projet, récupération de la connection string, configuration locale, migrations Better Auth, utilisation avec Vercel).

Utiliser Neon pour **tous** les scénarios ci‑dessus (Vercel, Render, Amplify, GCP) permet de rester en gratuit côté base pendant toute la phase test.

---

## Synthèse : quel choix selon votre cas ?

| Situation | Choix conseillé |
|-----------|------------------|
| Vous voulez le **plus simple** et **0 € durable** | **Vercel + Neon** (réessayer Vercel avec Root Directory = `apps/web-app` et [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)). |
| Vous voulez **tout au même endroit** et acceptez **30 jours de DB** | **Render** (Web Service + Postgres gratuit 30 jours). |
| Vous voulez être sur **AWS** pour plus tard | **AWS Amplify + Neon** (Free Tier 12 mois). |
| Vous voulez rester sur **Google Cloud** sans payer la DB | **Cloud Run + Neon** (pas de Cloud SQL ; guide GCP en remplaçant Cloud SQL par Neon). |

En phase test, le **meilleur rapport simplicité / gratuité** est **Vercel + Neon** : 0 €, pas d’expiration de la base, et déploiement Next.js natif. Si le déploiement Vercel avait échoué auparavant, reprendre la config (Root Directory, variables d’environnement) avec le guide [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) résout souvent le problème.
