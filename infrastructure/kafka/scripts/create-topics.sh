#!/usr/bin/env bash
# =============================================================================
# Création des topics Kafka - Cahier des charges 1.2
# Usage: depuis l'hôte après démarrage du cluster:
#   docker exec kafka-broker-1 kafka-topics --bootstrap-server localhost:9092 --create --if-not-exists ...
# Ou exécuter ce script dans un conteneur avec accès au broker.
# =============================================================================
set -e
BOOTSTRAP="${KAFKA_BOOTSTRAP_SERVERS:-kafka-broker-1:9092}"
REPLICATION=3

echo "Creating AgriLogistic topics (bootstrap=$BOOTSTRAP)..."

kafka-topics --bootstrap-server "$BOOTSTRAP" --create --if-not-exists \
  --topic user.events       --partitions 3  --replication-factor $REPLICATION --config retention.ms=604800000
kafka-topics --bootstrap-server "$BOOTSTRAP" --create --if-not-exists \
  --topic order.events      --partitions 6  --replication-factor $REPLICATION --config retention.ms=2592000000
kafka-topics --bootstrap-server "$BOOTSTRAP" --create --if-not-exists \
  --topic logistics.events --partitions 6  --replication-factor $REPLICATION --config retention.ms=604800000
kafka-topics --bootstrap-server "$BOOTSTRAP" --create --if-not-exists \
  --topic payment.events   --partitions 3  --replication-factor $REPLICATION --config retention.ms=31536000000
kafka-topics --bootstrap-server "$BOOTSTRAP" --create --if-not-exists \
  --topic iot.telemetry    --partitions 12 --replication-factor $REPLICATION --config retention.ms=259200000
kafka-topics --bootstrap-server "$BOOTSTRAP" --create --if-not-exists \
  --topic analytics.events --partitions 6  --replication-factor $REPLICATION --config retention.ms=7776000000
kafka-topics --bootstrap-server "$BOOTSTRAP" --create --if-not-exists \
  --topic incident.events  --partitions 3  --replication-factor $REPLICATION --config retention.ms=604800000

echo "Topics created. List:"
kafka-topics --bootstrap-server "$BOOTSTRAP" --list
