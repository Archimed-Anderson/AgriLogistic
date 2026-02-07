# Guide Complet: Monitoring & Observabilité

## Vue d'Ensemble

AgroDeep dispose d'une stack monitoring complète basée sur Prometheus, Grafana, Loki, Tempo et AlertManager.

---

## 🚀 Quick Start

### Démarrage Stack Monitoring

```powershell
# Démarrer tous les services monitoring
cd infrastructure
docker compose -f docker-compose.monitoring.yml up -d

# Vérifier le statut
docker compose -f docker-compose.monitoring.yml ps
```

**Services démarrés:**
- ✅ Prometheus (collecte métriques)
- ✅ Grafana (visualisation)
- ✅ AlertManager (alertes)
- ✅ Loki (logs)
- ✅ Tempo (tracing)
- ✅ Node Exporter (métriques système)
- ✅ cAdvisor (métriques conteneurs)

---

## 📊 Accès aux Services

| Service | URL | Credentials | Description |
|---------|-----|-------------|-------------|
| **Prometheus** | http://localhost:9090 | - | Collecte et requêtes métriques |
| **Grafana** | http://localhost:4001 | admin / grafana_secure_2026 | Dashboards et visualisation |
| **AlertManager** | http://localhost:9093 | - | Gestion des alertes |
| **Loki** | http://localhost:3100 | - | Agrégation des logs |
| **Tempo** | http://localhost:3200 | - | Distributed tracing |
| **Node Exporter** | http://localhost:9100 | - | Métriques serveur |
| **cAdvisor** | http://localhost:18080 | - | Métriques Docker |

---

## 🎯 Configuration Prometheus

### Fichier: `infrastructure/monitoring/prometheus/prometheus.yml`

**Scrape interval:** 15 secondes  
**Retention:** 15 jours  
**Targets:**
- http://localhost:9090 (Prometheus lui-même)
- http://localhost:9100 (Node Exporter)
- http://localhost:18080 (cAdvisor)
- http://localhost:3001/metrics (API NestJS)
- http://localhost:8000/metrics (AI Service)

### Queries Utiles

```promql
# CPU usage toutes instances
rate(node_cpu_seconds_total[5m])

# Mémoire disponible
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100

# Latence API P95
histogram_quantile(0.95, http_request_duration_seconds_bucket)

# Taux d'erreur
rate(http_requests_total{status=~"5.."}[5m])
```

---

## 📈 Dashboards Grafana

### Dashboards Pré-configurés

**1. System Overview**
- CPU, Mémoire, Disque, Réseau
- Uptime, Load Average
- Processes actifs

**2. Application Metrics**
- Request rate (req/s)
- Latency (P50, P95, P99)
- Error rate (%)
- Active connections

**3. Database Performance**
- Connexions actives
- Query per second
- Slow queries
- Cache hit ratio

**4. API Endpoints**
- Latency par endpoint
- Traffic par endpoint
- Error rate par endpoint
- Top 10 slowest endpoints

**5. Business KPIs**
- Transactions par heure
- Utilisateurs actifs
- Revenus générés
- Conversion rate

### Import Dashboards

```bash
# Les dashboards sont dans infrastructure/monitoring/grafana/dashboards/
# Ils sont automatiquement provisionnés au démarrage de Grafana
```

---

## 🔔 AlertManager Configuration

### Fichier: `infrastructure/monitoring/alertmanager/config.yml`

**Canaux d'alerte:**
- **Critical** → PagerDuty (nécessite PAGERDUTY_ROUTING_KEY)
- **Warning** → Slack (nécessite SLACK_WEBHOOK_URL)
- **Info** → Email

### Exemples d'Alertes

**CPU élevé:**
```yaml
alert: HighCPUUsage
expr: rate(node_cpu_seconds_total[5m]) > 0.8
for: 5m
labels:
  severity: warning
annotations:
  summary: "CPU usage above 80% for 5 minutes"
```

**Mémoire critique:**
```yaml
alert: HighMemoryUsage
expr: (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) < 0.1
for: 2m
labels:
  severity: critical
annotations:
  summary: "Less than 10% memory available"
```

**API down:**
```yaml
alert: APIDown
expr: up{job="nestjs-api"} == 0
for: 1m
labels:
  severity: critical
annotations:
  summary: "API is down"
```

### Configuration Slack

```bash
# Ajouter webhook URL dans .env
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# Redémarrer AlertManager
docker compose -f docker-compose.monitoring.yml restart alertmanager
```

---

## 📝 Loki - Logs Centralisés

### Configuration

**Retention:** 7 jours  
**Format:** JSON recommandé  
**Ingestion:** HTTP push endpoint

### Queries LogQL

```logql
# Tous les logs erreur
{job="web-app"} |= "error"

# Logs API dernière heure
{job="nestjs-api"} | json | level="error" [1h]

# Logs par status code
{job="nginx"} | json | status_code >= 500
```

### Intégration avec Docker

```yaml
# docker-compose.yml
services:
  web-app:
    logging:
      driver: loki
      options:
        loki-url: "http://localhost:3100/loki/api/v1/push"
        loki-batch-size: "400"
```

---

## 🔍 Tempo - Distributed Tracing

### Configuration

**Protocols:** OTLP gRPC (port 4317), OTLP HTTP (port 4318), Jaeger

### Instrumentation

**Node.js/TypeScript:**
```typescript
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

const provider = new NodeTracerProvider();
const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4317',
});

provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();
```

**Python/FastAPI:**
```python
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

otlp_exporter = OTLPSpanExporter(endpoint="http://localhost:4317")
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)
```

---

## 🧪 Testing Monitoring

### Vérifier Prometheus

```bash
# Health check
curl http://localhost:9090/-/healthy

# Targets status
curl http://localhost:9090/api/v1/targets | jq

# Query métriques
curl -G http://localhost:9090/api/v1/query --data-urlencode 'query=up'
```

### Vérifier Grafana

```bash
# Health check
curl http://localhost:4001/api/health

# List datasources
curl -u admin:grafana_secure_2026 http://localhost:4001/api/datasources
```

### Vérifier Loki

```bash
# Ready check
curl http://localhost:3100/ready

# List labels
curl -G http://localhost:3100/loki/api/v1/labels
```

---

## 🔧 Troubleshooting

### Prometheus ne scrape pas

**Symptômes:** Targets "DOWN" dans Prometheus UI

**Solutions:**
1. Vérifier que les services exposent `/metrics`
2. Vérifier réseau Docker
3. Vérifier firewall

### Grafana: "No data"

**Solutions:**
1. Vérifier datasource (Configuration → Data Sources)
2. Vérifier time range
3. Forcer refresh du dashboard (Ctrl+R)
4. Vérifier que Prometheus collecte les données

### Logs absents dans Loki

**Solutions:**
1. Vérifier logging driver Docker
2. Vérifier format logs (JSON recommandé)
3. Vérifier Loki ready: `curl http://localhost:3100/ready`

---

## 📦 Backup & Restore

### Backup Prometheus

```bash
# Snapshot
curl -XPOST http://localhost:9090/api/v1/admin/tsdb/snapshot

# Les snapshots sont dans: prometheus-data/snapshots/
```

### Backup Grafana

```bash
# Export dashboards
docker exec AgriLogistic-grafana grafana-cli admin export-provisioning
```

---

## 🚀 Production Deployment

### Grafana Cloud (Recommandé)

**Avantages:**
- Hébergement managé
- Scaling automatique
- Alertes SMS/Phone call
- SLA 99.9%

**Setup:**
```bash
# 1. Créer compte sur grafana.com
# 2. Récupérer Remote Write URL
# 3. Configurer Prometheus remote_write:

remote_write:
  - url: https://prometheus-us-central1.grafana.net/api/prom/push
    basic_auth:
      username: YOUR_INSTANCE_ID
      password: YOUR_API_KEY
```

### Self-Hosted Production

**Requirements:**
- Prometheus HA (2+ replicas)
- Thanos pour long-term storage
- AlertManager HA
- LoadBalancer devant Grafana

---

## 📖 Ressources

- [Prometheus Docs](https://prometheus.io/docs/)
- [Grafana Docs](https://grafana.com/docs/)
- [Loki Docs](https://grafana.com/docs/loki/)
- [Tempo Docs](https://grafana.com/docs/tempo/)
- [AlertManager Docs](https://prometheus.io/docs/alerting/latest/alertmanager/)
