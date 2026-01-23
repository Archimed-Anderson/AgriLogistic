#!/bin/bash

# ============================================================
# Kong Database Backup Script
# AgroLogistic 2.0 - Docker Compose Version
# ============================================================

set -euo pipefail

# Configuration
readonly BACKUP_DIR="./backups"
readonly TIMESTAMP=$(date +%Y%m%d_%H%M%S)
readonly BACKUP_NAME="kong_backup_${TIMESTAMP}"
readonly CONTAINER_NAME="agrologistic-kong-db"

# Colors
readonly GREEN='\033[0;32m'
readonly RED='\033[0;31m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

log_info "Starting Kong database backup..."
log_info "Backup name: ${BACKUP_NAME}"

# Backup PostgreSQL database
log_info "Backing up PostgreSQL database..."
if docker exec "$CONTAINER_NAME" pg_dump -U kong kong > "${BACKUP_DIR}/${BACKUP_NAME}.sql"; then
    log_success "PostgreSQL backup completed"
else
    log_error "PostgreSQL backup failed"
    exit 1
fi

# Export Kong declarative configuration
log_info "Exporting Kong declarative configuration..."
if docker exec agrologistic-kong-gateway kong config db_export > "${BACKUP_DIR}/${BACKUP_NAME}_config.yml"; then
    log_success "Kong configuration exported"
else
    log_error "Kong configuration export failed"
    exit 1
fi

# Compress backups
log_info "Compressing backups..."
if tar -czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" -C "${BACKUP_DIR}" "${BACKUP_NAME}.sql" "${BACKUP_NAME}_config.yml"; then
    log_success "Backups compressed"
    
    # Remove uncompressed files
    rm -f "${BACKUP_DIR}/${BACKUP_NAME}.sql" "${BACKUP_DIR}/${BACKUP_NAME}_config.yml"
else
    log_error "Compression failed"
    exit 1
fi

# Calculate backup size
BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | cut -f1)
log_success "Backup completed: ${BACKUP_NAME}.tar.gz (${BACKUP_SIZE})"

# Keep only last 7 backups
log_info "Cleaning old backups (keeping last 7)..."
cd "$BACKUP_DIR" && ls -t kong_backup_*.tar.gz | tail -n +8 | xargs -r rm
log_success "Old backups cleaned"

echo ""
log_success "Backup process completed successfully!"
echo -e "${BLUE}Backup location:${NC} ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
