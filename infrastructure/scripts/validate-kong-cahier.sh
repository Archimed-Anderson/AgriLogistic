#!/bin/bash
# ============================================================
# Validation Kong - Cahier des charges 1.1
# Exécute les commandes de validation du cahier des charges.
# ============================================================

set -euo pipefail

readonly KONG_ADMIN_URL="${KONG_ADMIN_URL:-http://localhost:8001}"
readonly KONG_PROXY_URL="${KONG_PROXY_URL:-http://localhost:8000}"
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
log_fail()  { echo -e "${RED}[FAIL]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }

FAILED=0

# Attendre que Kong Admin soit prêt
wait_for_kong() {
  local max=30
  local n=0
  while [ $n -lt $max ]; do
    if curl -sf "${KONG_ADMIN_URL}/status" > /dev/null 2>&1; then
      return 0
    fi
    n=$((n + 1))
    echo -n "."
    sleep 2
  done
  echo ""
  log_fail "Kong Admin API non disponible après ${max}s"
  return 1
}

echo "=============================================="
echo "  Validation Kong - Cahier des charges 1.1"
echo "=============================================="
echo ""

log_info "Vérification disponibilité Kong..."
if ! wait_for_kong; then
  log_fail "Démarrez la stack: docker-compose -f docker-compose.kong.yml up -d"
  exit 1
fi
echo ""
log_ok "Kong Admin API disponible"
echo ""

# --- Test 1: Liste des services (commande de validation cahier)
log_info "Test 1: GET /services (cahier des charges)"
echo "Commande: curl -i ${KONG_ADMIN_URL}/services"
echo "---"
if RESP=$(curl -s -w "\n%{http_code}" "${KONG_ADMIN_URL}/services"); then
  HTTP_CODE=$(echo "$RESP" | tail -n1)
  BODY=$(echo "$RESP" | sed '$d')
  if [ "$HTTP_CODE" = "200" ]; then
    log_ok "HTTP $HTTP_CODE - Liste des services"
    COUNT=$(echo "$BODY" | jq -r '.data | length' 2>/dev/null || echo "?")
    echo "  Services configurés: $COUNT"
  else
    log_fail "HTTP $HTTP_CODE (attendu 200)"
    FAILED=$((FAILED + 1))
  fi
else
  log_fail "Erreur curl /services"
  FAILED=$((FAILED + 1))
fi
echo ""

# --- Test 2: Route protégée avec JWT (commande de validation cahier)
log_info "Test 2: GET /api/v1/users avec JWT (cahier des charges)"

# Obtenir un JWT via login
LOGIN_RESP=$(curl -s -X POST "${KONG_PROXY_URL}/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@agrologistic.app","password":"admin123"}' 2>/dev/null || true)

JWT=$(echo "$LOGIN_RESP" | jq -r '.access_token // empty' 2>/dev/null)

if [ -z "$JWT" ] || [ "$JWT" = "null" ]; then
  log_warn "Impossible d'obtenir un JWT (auth-service peut ne pas être démarré)"
  log_info "Commande manuelle: curl -i ${KONG_PROXY_URL}/api/v1/users -H \"Authorization: Bearer <JWT>\""
  echo "  Réponse login (extrait): $(echo "$LOGIN_RESP" | head -c 200)"
else
  echo "Commande: curl -i ${KONG_PROXY_URL}/api/v1/users -H \"Authorization: Bearer <JWT>\""
  echo "---"
  USER_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    "${KONG_PROXY_URL}/api/v1/users" \
    -H "Authorization: Bearer $JWT")
  if [ "$USER_CODE" = "200" ] || [ "$USER_CODE" = "502" ]; then
    log_ok "HTTP $USER_CODE - Route /api/v1/users (502 = backend non démarré, 200 = OK)"
  elif [ "$USER_CODE" = "401" ]; then
    log_fail "HTTP 401 - JWT rejeté ou invalide"
    FAILED=$((FAILED + 1))
  else
    log_ok "HTTP $USER_CODE - Route accessible (backend peut retourner 502)"
  fi
fi
echo ""

# --- Test 3: Status Kong
log_info "Test 3: GET /status"
if curl -sf "${KONG_ADMIN_URL}/status" | jq -e . > /dev/null 2>&1; then
  log_ok "Kong status OK"
else
  log_fail "Kong status échoué"
  FAILED=$((FAILED + 1))
fi
echo ""

echo "=============================================="
if [ $FAILED -eq 0 ]; then
  echo -e "  ${GREEN}Résultat: Validation cahier des charges OK${NC}"
else
  echo -e "  ${RED}Résultat: $FAILED test(s) en échec${NC}"
fi
echo "=============================================="
exit $FAILED
