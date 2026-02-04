# Monitoring Technique - Observabilité complète (Cahier des charges)

Stack **Prometheus + Grafana + Alertmanager + Loki + Tempo** pour SLA 99.95% et détection proactive des incidents.

## Contexte

Monitoring technique infrastructure et applications nécessaire pour SLA 99.95% et détection proactive des incidents.

## Composants

### 1. Prometheus (TSDB)

- **Scraping interval** : 15s
- **Retention** : 15 jours local (remote write vers Thanos optionnel)
- **Targets** : Node Exporter (OS), cAdvisor (containers Docker), Prometheus itself, application metrics (`/metrics` NestJS)
- **Config** : `monitoring/prometheus/prometheus.yml`
- **Règles** : `monitoring/prometheus/rules/alerts.yml`

### 2. Grafana (Visualisation)

- **Datasources** : Prometheus, Loki, Tempo, PostgreSQL (+ Jaeger, Elasticsearch, ClickHouse si stack complète)
- **Provisioning** : `monitoring/grafana/provisioning/datasources/datasources.yml`, `dashboards/dashboards.yml`
- **Dashboards** : `monitoring/grafana/dashboards/*.json` (services-overview, security-dashboard)
- **Alerting** : vers Slack / PagerDuty (configurer dans Grafana UI ou Alertmanager)

### 3. Loki (Logs aggregation)

- **Collecte** : logs Docker via driver loki (à configurer sur les conteneurs)
- **Labels** : container_name, service, level
- **Retention** : 7 jours
- **Config** : `monitoring/loki/loki-config.yml`

### 4. Tempo (Distributed tracing)

- **Receiving** : Jaeger format, OTLP (HTTP/gRPC)
- **Stockage** : local backend (S3 pour prod)
- **Config** : `monitoring/tempo/tempo.yml`

### 5. Alertmanager

- **Routes** : critical → PagerDuty, warning → Slack ; silences pour maintenance
- **Config** : `monitoring/alertmanager/config.yml`
- **Variables** : `PAGERDUTY_ROUTING_KEY`, `SLACK_WEBHOOK_URL`

## Dashboards Grafana (cahier des charges)

### "Infrastructure - Cluster Overview"

- CPU / Memory / Disks par node (Node Exporter)
- Network I/O
- Container resource usage (cAdvisor)
- Kubernetes cluster (si applicable)

### "Application - API Performance"

- Request rate par endpoint
- Latence p50 / p95 / p99
- Error rate 4xx / 5xx
- Top slowest queries PostgreSQL

### "Business - SRE Golden Signals"

- Traffic (req/sec)
- Latency
- Errors
- Saturation

Les dashboards existants (`services-overview.json`, `security-dashboard.json`) sont dans `monitoring/grafana/dashboards/`. Les dashboards ci-dessus peuvent être créés dans l’UI Grafana puis exportés en JSON dans ce dossier.

## Fichiers

| Fichier | Rôle |
|---------|------|
| `docker-compose.monitoring.yml` | Stack complète (Prometheus, Grafana, Alertmanager, Loki, Tempo, Node Exporter, cAdvisor) |
| `prometheus/prometheus.yml` | Scraping config (15s, targets) |
| `prometheus/rules/alerts.yml` | Règles d’alerte |
| `grafana/provisioning/datasources/datasources.yml` | Datasources (Prometheus, Loki, Tempo, PostgreSQL, etc.) |
| `grafana/provisioning/dashboards/dashboards.yml` | Provisioning dashboards |
| `grafana/dashboards/*.json` | Dashboards prédéfinis |
| `alertmanager/config.yml` | Routes (critical→PagerDuty, warning→Slack), silences |
| `loki/loki-config.yml` | Retention 7j, labels |
| `tempo/tempo.yml` | OTLP, Jaeger, stockage local |

## Déploiement

```bash
# Depuis infrastructure/
cd infrastructure
docker compose -f docker-compose.monitoring.yml up -d
```

Depuis la racine du projet :

```bash
docker compose -f infrastructure/docker-compose.monitoring.yml --project-directory . up -d
```

Pour scraper les métriques des microservices (NestJS /metrics), connecter le réseau du compose principal au réseau `AgriLogistic-monitoring` ou lancer la stack monitoring avec le compose principal (ex. `docker compose -f docker-compose.yml -f infrastructure/docker-compose.monitoring.yml up -d`).

## Instrumentation code (NestJS / prom-client)

Les services exposent déjà un endpoint `/metrics` au format Prometheus via `packages/microservice-core` (middleware métriques custom). Pour une instrumentation **prom-client** complète (Counter, Histogram avec buckets), exemple :

```typescript
// metrics.service.ts (exemple cahier des charges)
import { Counter, Histogram, register } from 'prom-client';

export class MetricsService {
  private httpRequests = new Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status_code']
  });

  private httpDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration',
    labelNames: ['method', 'route'],
    buckets: [0.1, 0.5, 1, 2, 5]
  });

  // Exposer /metrics : res.set('Content-Type', register.contentType); res.send(await register.metrics());
}
```

Le package `microservice-core` fournit déjà `metricsMiddleware`, `metricsEndpoint`, `initializeMetrics` et un format Prometheus compatible (`http_requests_total`, `http_request_duration_seconds` avec buckets). Pour aligner exactement sur prom-client, remplacer l’implémentation interne par prom-client (Counter/Histogram) et garder le même endpoint `/metrics`.

## Validation

- **Grafana** : http://localhost:4001 (admin / admin ou `${GRAFANA_PASSWORD}`)
- **Prometheus** : http://localhost:9090
- **Loki** : http://localhost:3100
- **Alertmanager** : http://localhost:9093
- **Tempo** : http://localhost:3200/ready
- **Node Exporter** : http://localhost:9100/metrics
- **cAdvisor** : http://localhost:18080/metrics

**Query test Prometheus** (dans Prometheus > Graph) :
```promql
rate(http_requests_total[5m])
```

**Scripts de validation** (PowerShell, depuis la racine du projet) :
- Stack monitoring seule : `.\infrastructure\scripts\validate-monitoring.ps1`
- Toutes les stacks (monitoring + Superset + Kafka + Kong) : `.\infrastructure\scripts\validate-all.ps1`
- Options : `-SkipKafka`, `-SkipSuperset`, `-SkipKong`, `-SkipMonitoring` pour ignorer une stack.
