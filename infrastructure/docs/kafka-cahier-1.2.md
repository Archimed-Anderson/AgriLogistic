# Event Bus – Apache Kafka (Cahier des charges 1.2)

## Contexte

Architecture microservices AgriLogistic avec communication asynchrone et partage d’événements entre services sans couplage fort.

## Déploiement

### Standalone (Event Bus uniquement)

```bash
# Depuis la racine du projet (AgroDeep)
docker compose -f infrastructure/docker-compose.kafka.yml up -d
```

Si le broker 1 reste « unhealthy » (premier démarrage KRaft ou volumes corrompus), redémarrer à zéro :

```bash
docker compose -f infrastructure/docker-compose.kafka.yml down -v
docker compose -f infrastructure/docker-compose.kafka.yml up -d
```

### Avec la plateforme (même réseau)

Pour que les services (analytics, incident, etc.) atteignent Kafka, utiliser le même réseau ou exposer les brokers. Exemple en ajoutant le fichier Kafka au compose principal :

```bash
docker compose -f docker-compose.yml -f infrastructure/docker-compose.kafka.yml up -d
```

Si les composes n’utilisent pas le même réseau, définir `KAFKA_BROKERS=kafka-broker-1:9092,kafka-broker-2:9092,kafka-broker-3:9092` pour les services qui consomment Kafka et les connecter au réseau des brokers (`kafka-network`).

## Composants

| Composant | Description | Port |
|-----------|-------------|------|
| kafka-broker-1/2/3 | 3 brokers KRaft (sans Zookeeper) | **19092** (broker 1 exposé sur l'hôte, évite conflit avec Kafka principal sur 9092) |
| schema-registry | Confluent Schema Registry (Avro) | 8081 |
| kafka-connect | Kafka Connect (JDBC, HTTP, etc.) | 8083 |
| kafka-ui | provectus/kafka-ui – monitoring topics | 8080 |
| kafka-init-topics | Création des topics au premier démarrage | - |

## Topics (cahier des charges)

| Topic | Partitions | Retention | Producteur | Consommateur |
|-------|-----------|-----------|------------|---------------|
| user.events | 3 | 7 jours | user-service | analytics, notification |
| order.events | 6 | 30 jours | market-service | logistics, payment, analytics |
| logistics.events | 6 | 7 jours | logistics-service | notification, analytics |
| payment.events | 3 | 1 an | payment-service | notification, analytics |
| iot.telemetry | 12 | 3 jours | edge-gateway | analytics, logistics |
| analytics.events | 6 | 90 jours | tous services | clickhouse-sink |
| incident.events | 3 | 7 jours | incident-service | analytics (War Room) |

## Fichiers générés (1.2)

- `docker-compose.kafka.yml` – cluster KRaft, Schema Registry, Connect, UI
- `kafka/config/server.properties` – réglages 8 GB RAM
- `kafka/schemas/avro/user-event-v1.avsc` – schéma Avro user
- `kafka/schemas/avro/order-event-v1.avsc` – schéma Avro order
- `connectors/postgres-source.json` – JDBC Source PostgreSQL
- `connectors/clickhouse-sink.json` – Sink ClickHouse (analytics.events)
- `connectors/jdbc-sink.json` – JDBC Sink réplication
- `connectors/http-sink.json` – HTTP Sink webhooks
- `kafka/scripts/create-topics.sh` – création manuelle des topics
- `scripts/validate-kafka-cahier.sh` – validation cahier 1.2

## Validation (cahier des charges)

À l'intérieur des conteneurs, le broker écoute sur 9092. Depuis l'hôte, utiliser le port **19092** si vous vous connectez en localhost (évite conflit avec le Kafka du docker-compose principal).

```bash
# Liste des topics (depuis le conteneur)
docker exec kafka-broker-1 kafka-topics --bootstrap-server localhost:9092 --list

# Consommer order.events depuis le début
docker exec kafka-broker-1 kafka-console-consumer --bootstrap-server localhost:9092 --topic order.events --from-beginning
```

Script de validation complet :

```bash
./infrastructure/scripts/validate-kafka-cahier.sh
```

## Configuration 8 GB RAM

- Chaque broker : `KAFKA_HEAP_OPTS=-Xmx2g -Xms2g`
- Kafka Connect : `CONNECT_HEAP_OPTS=-Xmx1g -Xms512m`
- Voir `kafka/config/server.properties` pour les paramètres log et réseau.

## Connecteurs

Les configs sont dans `infrastructure/connectors/`. Pour les activer, enregistrer chaque connector via l’API Connect (après installation des JAR si besoin) :

```bash
curl -s -X POST -H "Content-Type: application/json" \
  --data @infrastructure/connectors/postgres-source.json \
  http://localhost:8083/connectors
```

Voir `infrastructure/connectors/README.md` pour les connecteurs à installer (ClickHouse, HTTP Sink).
