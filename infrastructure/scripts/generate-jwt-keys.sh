#!/bin/bash
#
# ==============================================================================
# Génération des clés JWT RS256 (Kong + Auth Service)
# AgroLogistic 2.0
#
# - Génère une paire RSA (privée/publique) via OpenSSL
# - Écrit:
#   - infrastructure/kong/keys/jwt-private.pem  (NE PAS COMMITER)
#   - infrastructure/kong/keys/jwt-public.pem   (OK à commiter)
# - Injecte la clé publique dans infrastructure/kong/kong.yml
#   en remplaçant le placeholder "__RSA_PUBLIC_KEY__"
# ==============================================================================

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly INFRA_DIR="$(dirname "$SCRIPT_DIR")"
readonly KEYS_DIR="$INFRA_DIR/kong/keys"
readonly PRIVATE_KEY="$KEYS_DIR/jwt-private.pem"
readonly PUBLIC_KEY="$KEYS_DIR/jwt-public.pem"
readonly KONG_YML="$INFRA_DIR/kong/kong.yml"

if ! command -v openssl >/dev/null 2>&1; then
  echo "[ERROR] openssl introuvable" >&2
  exit 1
fi

mkdir -p "$KEYS_DIR"

if [[ -f "$PRIVATE_KEY" || -f "$PUBLIC_KEY" ]]; then
  echo "[ERROR] Des clés existent déjà. Supprime-les ou régénère explicitement." >&2
  exit 1
fi

echo "[INFO] Génération clé privée RSA 2048..."
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out "$PRIVATE_KEY" >/dev/null 2>&1

echo "[INFO] Extraction clé publique..."
openssl pkey -in "$PRIVATE_KEY" -pubout -out "$PUBLIC_KEY" >/dev/null 2>&1

echo "[INFO] Injection de la clé publique dans kong.yml..."
if ! grep -q "__RSA_PUBLIC_KEY__" "$KONG_YML"; then
  echo "[ERROR] Placeholder __RSA_PUBLIC_KEY__ introuvable dans $KONG_YML" >&2
  exit 1
fi

PUB_CONTENT="$(cat "$PUBLIC_KEY")"
INDENTED_PUB="$(printf "%s\n" "$PUB_CONTENT" | sed 's/^/          /')"

# Replace placeholder (single token) with indented PEM
TMP_FILE="$(mktemp)"
python - <<'PY' "$KONG_YML" "$TMP_FILE" "$INDENTED_PUB"
import sys
src, dst, replacement = sys.argv[1], sys.argv[2], sys.argv[3]
with open(src, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("__RSA_PUBLIC_KEY__", replacement)
with open(dst, "w", encoding="utf-8", newline="\n") as f:
    f.write(content)
PY
mv "$TMP_FILE" "$KONG_YML"

echo "[OK] Clés générées:"
echo " - Privée: $PRIVATE_KEY (NE PAS COMMITER)"
echo " - Publique: $PUBLIC_KEY"

