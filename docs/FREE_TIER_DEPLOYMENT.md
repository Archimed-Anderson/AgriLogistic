# 🆓 Guide Déploiement Free Tier (Offres Gratuites)

Si vous ne souhaitez pas utiliser Vercel ou GCP, voici les alternatives gratuites recommandées.

## 1. Render (Recommandé pour Frontend + Backend)
- **Hébergement** : Web Service (Docker possible).
- **Postgres** : Instance gratuite (expire après 90 jours).
- **Avantages** : Déploiement facile via GitHub, supporte Node.js nativement.
- **Inconvénients** : L'instance s'endort après 15 min d'inactivité (spin-up de 30s au réveil).

## 2. Railway (Excellent mais limité en crédit de départ)
- **Hébergement** : Déploiement direct de monorepo possible.
- **Postgres** : Très stable, setup en 1 clic.
- **Avantages** : Pas de mise en veille (sleep).
- **Inconvénients** : Système de crédits ($5 offert une fois), peut devenir payant rapidement si le trafic augmente.

## 3. Fly.io (Performance maximale)
- **Hébergement** : Déploiement via Docker à l'edge.
- **Postgres** : Free tier disponible.
- **Avantages** : Très rapide, proche de l'utilisateur.
- **Inconvénients** : Nécessite l'installation du CLI `flyctl`, configuration un peu plus complexe pour les monorepos.

## 4. Comparatif & Limitations
| Plateforme | Limite Coeur/RAM | BD Gratuite | Sleep Mode |
| :--- | :--- | :--- | :--- |
| **Render** | 512MB RAM | Oui (90j) | Oui (15 min) |
| **Railway** | Crédit $5 | Oui | Non |
| **Fly.io** | 256MB/512MB | Oui | Non/Auto |

## 5. Stratégie pour AgriLogistic
Pour un déploiement gratuit optimal :
1. **Frontend + API** sur **Vercel** (Plan Hobby gratuit à vie).
2. **Postgres** sur **Neon.tech** (Plan Free gratuit à vie, pas d'expiration).
3. **Images/Médias** sur **Cloudinary** ou **Uploadthing** (Plans gratuits généreux).

---
*Note: Pour les microservices NestJS séparés, utilisez **Render** ou **Railway** car Vercel est optimisé prioritairement pour Next.js.*
