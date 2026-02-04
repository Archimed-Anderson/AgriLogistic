# Kubernetes - Orchestration (Prompt 3.2 - Option Production)

Manifests pour déploiement AgriLogistic sur Kubernetes (auto-scaling, haute disponibilité).

## Architecture

- **Namespace** : `agrilogistic`
- **Deployments** : web-app, user-service (auth-service), market-service, logistics-service, payment-service, ai-service
- **StatefulSets** : postgres, redis, clickhouse, kafka, zookeeper
- **ConfigMaps & Secrets** : configurations non sensibles ; secrets (Sealed Secrets ou Vault)
- **Services** : ClusterIP (interne) ; Ingress NGINX + cert-manager (Let's Encrypt)
- **HPA** : Horizontal Pod Autoscaler (market-service, web-app, user-service)
- **ServiceMonitors** : Prometheus Operator (scraping /metrics)

## Fichiers

| Dossier / Fichier | Rôle |
|-------------------|------|
| `base/namespace.yaml` | Namespace agrilogistic |
| `base/configmap.yaml` | ConfigMap agrilogistic-config (base) |
| `base/frontend.yml` | Deployment + Service web-app |
| `base/services.yml` | Deployments + Services auth, product, order, payment |
| `statefulsets/*.yaml` | Postgres, Redis, ClickHouse, Kafka, Zookeeper |
| `deployments/*.yaml` | market-service, logistics-service, ai-service |
| `ingress/ingress.yaml` | Ingress NGINX, TLS (cert-manager) |
| `hpa/*.yaml` | HPA market-service, web-app, user-service |
| `monitoring/servicemonitors.yaml` | ServiceMonitors Prometheus Operator |

## Déploiement

```bash
# Créer le namespace
kubectl apply -f base/namespace.yaml

# ConfigMap + Secrets (créer agrilogistic-secrets manuellement ou via Sealed Secrets)
kubectl apply -f base/configmap.yaml
kubectl apply -f overlays/production/secrets.yml   # après création des secrets

# StatefulSets (ordre : zookeeper → kafka, puis postgres, redis, clickhouse)
kubectl apply -f statefulsets/zookeeper.yaml
kubectl apply -f statefulsets/kafka.yaml
kubectl apply -f statefulsets/postgres.yaml
kubectl apply -f statefulsets/redis.yaml
kubectl apply -f statefulsets/clickhouse.yaml

# Deployments + Services (base + deployments/)
kubectl apply -f base/frontend.yml
kubectl apply -f base/services.yml
kubectl apply -f deployments/

# Ingress (prérequis : NGINX Ingress Controller + cert-manager)
kubectl apply -f ingress/ingress.yaml

# HPA
kubectl apply -f hpa/

# ServiceMonitors (prérequis : Prometheus Operator)
kubectl apply -f monitoring/servicemonitors.yaml
```

Ou avec Kustomize (overlay production) :

```bash
kubectl apply -k overlays/production
```

## Validation

```bash
kubectl get pods -n agrilogistic
kubectl top pods -n agrilogistic
kubectl logs -f deployment/market-service -n agrilogistic
kubectl get ingress -n agrilogistic
kubectl get hpa -n agrilogistic
```
