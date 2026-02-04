#!/usr/bin/env bash
# =============================================================================
# Validation Kafka - Cahier des charges 1.2
# Usage: ./infrastructure/scripts/validate-kafka-cahier.sh
# Prérequis: cluster Kafka démarré (docker compose -f infrastructure/docker-compose.kafka.yml up -d)
# =============================================================================
set -e
BROKER="${KAFKA_BROKER:-kafka-broker-1}"
BOOTSTRAP="${KAFKA_BOOTSTRAP:-localhost:9092}"

echo "=== Validation Event Bus Kafka (1.2) ==="
echo "Broker: $BROKER, Bootstrap: $BOOTSTRAP"
echo ""

echo "1. Liste des topics..."
docker exec "$BROKER" kafka-topics --bootstrap-server localhost:9092 --list
if [ $? -ne 0 ]; then
  echo "Erreur: le conteneur $BROKER n'existe pas ou n'est pas en cours d'exécution."
  echo "  - Si le port 9092 est déjà utilisé (Kafka principal), le stack Kafka 1.2 expose le broker sur le port 19092. Lancez: docker compose -f infrastructure/docker-compose.kafka.yml up -d"
  echo "  - Si le conteneur est arrêté: docker rm -f $BROKER; docker compose -f infrastructure/docker-compose.kafka.yml up -d"
  exit 1
fi
echo ""

echo "2. Détail topics (partitions, retention)..."
docker exec "$BROKER" kafka-topics --bootstrap-server localhost:9092 --describe
echo ""

echo "3. Consumer order.events (5s from beginning, then exit)..."
timeout 5 docker exec "$BROKER" kafka-console-consumer --bootstrap-server localhost:9092 --topic order.events --from-beginning --max-messages 1 --timeout-ms 3000 2>/dev/null || true
echo ""

echo "4. Schema Registry (si disponible)..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/subjects 2>/dev/null && echo " Schema Registry OK" || echo " Schema Registry non joignable (8081)"
echo ""

echo "5. Kafka UI (si disponible)..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 2>/dev/null && echo " Kafka UI OK (http://localhost:8080)" || echo " Kafka UI non joignable (8080)"
echo ""

echo "=== Fin validation ==="
