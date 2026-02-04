# Service Mesh Linkerd (Cahier des charges – Optionnel Phase 2)

## Contexte

Besoin d’observabilité réseau et de sécurisation mTLS entre micro-services **sans modifier le code applicatif existant**.

## Tâche

Implémenter Linkerd2 (CNCF, plus léger qu’Istio) pour :

- **mTLS automatique** entre services meshés
- **Métriques réseau** : latence, erreurs (Prometheus)
- **Load balancing avancé** (proxy)
- **Retry et circuit breaker** (côté proxy)

## Scope

- **Injection automatique** via annotations Kubernetes (namespace `linkerd.io/inject: enabled`)
- **Dashboard Linkerd** (extension Viz) pour visualisation du mesh
- **Alerting** sur latence p99 > 500 ms (PrometheusRule)

## Fichiers

| Fichier | Rôle |
|---------|------|
| `infrastructure/linkerd/install.sh` | Installation CLI, control plane, Viz |
| `infrastructure/linkerd/prometheus-rules-p99.yaml` | Alerte p99 > 500 ms |
| `infrastructure/linkerd/README.md` | Guide Linkerd |
| `infrastructure/k8s-manifests/with-linkerd/namespace-linkerd.yaml` | Namespace avec annotation d’injection |
| `infrastructure/k8s-manifests/with-linkerd/kustomization.yaml` | Kustomization (overlay production + namespace) |
| `infrastructure/k8s-manifests/with-linkerd/README.md` | Guide déploiement avec Linkerd |

## Installation

```bash
./infrastructure/linkerd/install.sh
linkerd check
linkerd viz dashboard   # optionnel, ouvre le dashboard
```

## Déploiement des workloads avec Linkerd

```bash
kubectl apply -k infrastructure/k8s-manifests/with-linkerd/
```

Tous les pods du namespace `AgroLogistic` recevront le proxy Linkerd (mTLS, métriques, retry).

## Alerting

Déployer la règle Prometheus (si Prometheus Operator est utilisé) :

```bash
kubectl apply -f infrastructure/linkerd/prometheus-rules-p99.yaml
```

Ajuster le namespace et les labels selon votre configuration Prometheus.
