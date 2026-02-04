#!/usr/bin/env bash
# =============================================================================
# PostgreSQL - Maintenance hebdomadaire (VACUUM ANALYZE) + REINDEX mensuel
# =============================================================================
# Usage : exécuter via cron (ex. dimanche 3h, REINDEX 1er du mois).
#   Hebdo : 0 3 * * 0 /path/to/vacuum.sh
#   REINDEX : 0 4 1 * * /path/to/vacuum.sh --reindex
# Variables : PGHOST, PGPORT, PGUSER, PGDATABASE (ou passer en arguments).
# =============================================================================

set -e

REINDEX=false
if [[ "${1:-}" == "--reindex" ]]; then
  REINDEX=true
fi

PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGUSER="${PGUSER:-postgres}"
PGDATABASE="${PGDATABASE:-agrilogistic}"
export PGPASSWORD="${PGPASSWORD:-}"

run_psql() {
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -v ON_ERROR_STOP=1 "$@"
}

echo "[$(date -Iseconds)] Starting PostgreSQL maintenance (database=$PGDATABASE)"

# VACUUM ANALYZE (toujours, hebdomadaire recommandé)
echo "[$(date -Iseconds)] Running VACUUM ANALYZE..."
run_psql -c "VACUUM ANALYZE;"
echo "[$(date -Iseconds)] VACUUM ANALYZE done."

# REINDEX mensuel (optionnel, plus long)
if [[ "$REINDEX" == true ]]; then
  echo "[$(date -Iseconds)] Running REINDEX DATABASE..."
  run_psql -c "REINDEX DATABASE $PGDATABASE;"
  echo "[$(date -Iseconds)] REINDEX done."
fi

echo "[$(date -Iseconds)] Maintenance finished."
