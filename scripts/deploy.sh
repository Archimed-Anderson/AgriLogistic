#!/usr/bin/env bash
# =============================================================================
# AgroDeep – Script de déploiement local (fallback quand CI/CD indisponible)
# =============================================================================
# Usage:
#   ./scripts/deploy.sh [staging|production]
#   ENV: SKIP_VALIDATE=1 pour sauter les tests, SKIP_MIGRATE=1 pour sauter les migrations
# =============================================================================

set -e

ENVIRONMENT="${1:-staging}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "🚀 AgroDeep – Déploiement vers: $ENVIRONMENT"
echo "   Répertoire: $ROOT_DIR"
echo ""

# -----------------------------------------------------------------------------
# 1. Dépendances
# -----------------------------------------------------------------------------
echo "📦 Installation des dépendances..."
pnpm install --frozen-lockfile
echo "   OK"
echo ""

# -----------------------------------------------------------------------------
# 2. Validation (sauf si SKIP_VALIDATE=1)
# -----------------------------------------------------------------------------
if [ "${SKIP_VALIDATE:-0}" != "1" ]; then
  echo "🔍 Validation (typecheck, lint, format, tests)..."
  pnpm run typecheck  || { echo "❌ typecheck échoué"; exit 1; }
  pnpm run lint       || { echo "❌ lint échoué"; exit 1; }
  pnpm run format:check || { echo "❌ format:check échoué"; exit 1; }
  pnpm run test:unit  || { echo "❌ test:unit échoué"; exit 1; }
  echo "   OK"
  echo ""
else
  echo "⏭️  Validation ignorée (SKIP_VALIDATE=1)"
  echo ""
fi

# -----------------------------------------------------------------------------
# 3. Build
# -----------------------------------------------------------------------------
echo "📦 Build..."
pnpm run build:all || { echo "❌ build échoué"; exit 1; }
echo "   OK"
echo ""

# -----------------------------------------------------------------------------
# 4. Migrations (optionnel, si DATABASE_URL défini et SKIP_MIGRATE != 1)
# -----------------------------------------------------------------------------
if [ "${SKIP_MIGRATE:-0}" != "1" ] && [ -n "${DATABASE_URL:-}" ]; then
  echo "🗄️  Migrations Prisma (auth-service)..."
  (cd services/identity/auth-service && pnpm prisma migrate deploy) || { echo "⚠️  Migrations auth-service échoué (non bloquant)"; }
  echo "   OK"
  echo ""
else
  if [ "${SKIP_MIGRATE:-0}" = "1" ]; then
    echo "⏭️  Migrations ignorées (SKIP_MIGRATE=1)"
  else
    echo "⏭️  Migrations ignorées (DATABASE_URL non défini)"
  fi
  echo ""
fi

# -----------------------------------------------------------------------------
# 5. Suite du déploiement (indications ou commandes réelles)
# -----------------------------------------------------------------------------
echo "✅ Build et validation terminés."
echo ""
echo "Prochaines étapes selon l’environnement:"
echo "  - Staging / Production: déclencher le workflow CD (push sur main ou tag v*)"
echo "  - Ou manuellement: build des images Docker, push registry, kubectl set image"
echo ""
echo "Exemple manuel (après build des images):"
echo "  docker build -t ghcr.io/\$REGISTRY/web-app:\$SHA -f apps/web-app/Dockerfile apps/web-app"
echo "  docker push ghcr.io/\$REGISTRY/web-app:\$SHA"
echo "  kubectl set image deployment/AgroLogistic-web AgroLogistic-web=ghcr.io/\$REGISTRY/web-app:\$SHA -n AgriLogistic-staging"
echo "  kubectl rollout status deployment/AgroLogistic-web -n AgriLogistic-staging"
echo ""
echo "🎉 Script deploy.sh terminé."
