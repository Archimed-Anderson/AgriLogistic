#!/usr/bin/env bash
# =============================================================================
# PostgreSQL - Sauvegarde quotidienne vers S3 (MinIO compatible)
# =============================================================================
# Usage : cron quotidien (ex. 2h) : 0 2 * * * /path/to/s3-backup.sh
# Variables : PGHOST, PGPORT, PGUSER, PGDATABASE, S3_BUCKET, S3_ENDPOINT (MinIO),
#   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (ou MC alias).
# =============================================================================

set -e

PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
PGUSER="${PGUSER:-postgres}"
PGDATABASE="${PGDATABASE:-agrilogistic}"
export PGPASSWORD="${PGPASSWORD:-}"

# S3 / MinIO
S3_BUCKET="${S3_BUCKET:-agrilogistic-backups}"
S3_ENDPOINT="${S3_ENDPOINT:-}"   # ex. http://minio:9000
S3_PREFIX="${S3_PREFIX:-postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

BACKUP_DIR="${BACKUP_DIR:-/tmp/pg_backups}"
mkdir -p "$BACKUP_DIR"
STAMP=$(date +%Y%m%d_%H%M%S)
FILE="${BACKUP_DIR}/${PGDATABASE}_${STAMP}.sql.gz"

echo "[$(date -Iseconds)] Starting pg_dump (database=$PGDATABASE)"

pg_dump -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  --no-owner --no-acl --clean --if-exists \
  | gzip -9 > "$FILE"

echo "[$(date -Iseconds)] Dump done: $FILE"

if command -v aws &>/dev/null; then
  EXTRA_ARGS=()
  [[ -n "$S3_ENDPOINT" ]] && EXTRA_ARGS+=(--endpoint-url "$S3_ENDPOINT")
  aws s3 cp "$FILE" "s3://${S3_BUCKET}/${S3_PREFIX}/$(basename "$FILE")" "${EXTRA_ARGS[@]}"
  echo "[$(date -Iseconds)] Uploaded to s3://${S3_BUCKET}/${S3_PREFIX}/$(basename "$FILE")"
elif command -v mc &>/dev/null; then
  MC_ALIAS="${MC_ALIAS:-minio}"
  mc cp "$FILE" "${MC_ALIAS}/${S3_BUCKET}/${S3_PREFIX}/$(basename "$FILE")"
  echo "[$(date -Iseconds)] Uploaded via mc to ${MC_ALIAS}/${S3_BUCKET}/${S3_PREFIX}/$(basename "$FILE")"
else
  echo "[$(date -Iseconds)] WARN: aws or mc not found; backup left at $FILE"
fi

# Nettoyage local
rm -f "$FILE"

# Nettoyage S3 : supprimer les backups > RETENTION_DAYS (optionnel, si aws/mc disponible)
if command -v aws &>/dev/null && [[ -n "$S3_ENDPOINT" ]]; then
  CUTOFF=$(date -d "-${RETENTION_DAYS} days" +%Y%m%d 2>/dev/null || date -v-${RETENTION_DAYS}d +%Y%m%d)
  aws s3 ls "s3://${S3_BUCKET}/${S3_PREFIX}/" --endpoint-url "$S3_ENDPOINT" 2>/dev/null | while read -r _ _ _ name; do
    if [[ "$name" =~ _([0-9]{8})_ ]]; then
      [[ "${BASH_REMATCH[1]}" < "$CUTOFF" ]] && aws s3 rm "s3://${S3_BUCKET}/${S3_PREFIX}/${name}" --endpoint-url "$S3_ENDPOINT" && echo "Deleted old: $name"
    fi
  done
fi

echo "[$(date -Iseconds)] Backup finished."
