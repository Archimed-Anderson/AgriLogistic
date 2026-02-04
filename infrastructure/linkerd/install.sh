#!/usr/bin/env bash
# =============================================================================
# Linkerd2 (CNCF) - Service Mesh - Cahier des charges (Optionnel Phase 2)
# =============================================================================
# Fournit : mTLS automatique, metrics réseau (latence, erreurs), load balancing
# avancé, retry et circuit breaker. Injection via annotations Kubernetes.
# =============================================================================
set -e

LINKERD_VERSION="${LINKERD_VERSION:-stable-2.15}"
INSTALL_VIZ="${INSTALL_VIZ:-true}"

echo "=== Linkerd2 install (version: $LINKERD_VERSION) ==="

# -----------------------------------------------------------------------------
# 1. Prérequis : cluster Kubernetes et CLI
# -----------------------------------------------------------------------------
if ! command -v kubectl &>/dev/null; then
  echo "Erreur: kubectl requis."
  exit 1
fi

if ! command -v linkerd &>/dev/null; then
  echo "Installation du CLI Linkerd ($LINKERD_VERSION)..."
  curl -sL "https://run.linkerd.io/install" | LINKERD2_VERSION="$LINKERD_VERSION" sh
  export PATH="$PATH:$HOME/.linkerd2/bin"
  if ! command -v linkerd &>/dev/null; then
    echo "Ajoutez au PATH: export PATH=\"\$PATH:\$HOME/.linkerd2/bin\""
    exit 1
  fi
fi

# -----------------------------------------------------------------------------
# 2. Vérification pré-installation
# -----------------------------------------------------------------------------
echo "Vérification pré-installation (linkerd check --pre)..."
linkerd check --pre || { echo "Corrigez les erreurs ci-dessus puis relancez."; exit 1; }

# -----------------------------------------------------------------------------
# 3. Installation CRDs puis control plane
# -----------------------------------------------------------------------------
echo "Installation des CRDs Linkerd..."
linkerd install --crds | kubectl apply -f -

echo "Installation du control plane Linkerd..."
linkerd install | kubectl apply -f -

echo "Attente du control plane (30s)..."
sleep 30

echo "Vérification du control plane..."
linkerd check || true

# -----------------------------------------------------------------------------
# 4. Extension Viz (dashboard pour visualisation mesh)
# -----------------------------------------------------------------------------
if [ "$INSTALL_VIZ" = "true" ]; then
  echo "Installation de l'extension Viz (dashboard)..."
  linkerd viz install | kubectl apply -f -
  echo "Dashboard Viz : accès via 'linkerd viz dashboard' (proxy local)"
fi

echo ""
echo "=== Linkerd installé ==="
echo "  - mTLS automatique entre pods meshés"
echo "  - Metrics : latence, erreurs (Prometheus)"
echo "  - Load balancing, retry, circuit breaker (proxy)"
echo "  - Déployer les workloads avec annotation linkerd.io/inject: enabled"
echo "  - Dashboard : linkerd viz dashboard (si Viz installé)"
echo "  - Vérification : linkerd check"
