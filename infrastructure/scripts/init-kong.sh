#!/bin/bash
# ============================================================
# init-kong.sh - Initialisation Kong API Gateway
# AgroLogistic 2.0 - Cahier des charges 1.1
# Délègue à kong-init.sh pour respect du nom de fichier demandé.
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KONG_INIT="${SCRIPT_DIR}/kong-init.sh"

if [ ! -f "$KONG_INIT" ]; then
  echo "[ERROR] kong-init.sh not found at $KONG_INIT"
  exit 1
fi

exec "$KONG_INIT" "$@"
