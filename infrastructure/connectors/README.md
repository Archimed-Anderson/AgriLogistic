# Kafka Connect – Connectors (Cahier des charges 1.2)

Les fichiers JSON dans ce dossier sont des **configurations** à enregistrer via l’API REST de Kafka Connect (`http://kafka-connect:8083/connectors`). Les **connectors** correspondants doivent être présents dans l’image ou installés via Confluent Hub.

## Fichiers fournis

| Fichier | Rôle | Connector Confluent Hub |
|--------|------|--------------------------|
| `postgres-source.json` | JDBC Source PostgreSQL (polling) | Inclus dans `cp-kafka-connect` |
| `clickhouse-sink.json` | Sink analytics.events → ClickHouse | [ClickHouse Kafka Connect](https://github.com/ClickHouse/clickhouse-kafka-connect) à installer |
| `jdbc-sink.json` | JDBC Sink (réplication vers PostgreSQL) | Inclus dans `cp-kafka-connect` |
| `http-sink.json` | HTTP Sink (webhooks externes) | [Confluent HTTP Sink](https://www.confluent.io/hub/confluentinc/kafka-connect-http) à installer |

## Enregistrement d’un connector

```bash
curl -s -X POST -H "Content-Type: application/json" \
  --data @postgres-source.json \
  http://localhost:8083/connectors
```

Pour ClickHouse et HTTP Sink, installer d’abord le connector dans l’image Connect (ou monter les JAR dans `CONNECT_PLUGIN_PATH`), puis enregistrer la config.

## Variables d’environnement

Les configs utilisent des placeholders (`${DB_PASSWORD}`, etc.). Renseigner les variables dans l’environnement du worker Connect ou adapter les JSON avant envoi.
