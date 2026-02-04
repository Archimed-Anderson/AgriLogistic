# Service Mesh Linkerd (Cahier des charges – Optionnel Phase 2)

Linkerd2 (CNCF) fournit observabilité réseau et mTLS entre micro-services **sans modifier le code applicatif**.

## Bénéfices

| Fonctionnalité | Détail |
|----------------|--------|
| **mTLS automatique** | Chiffrement mutuel entre pods meshés |
| **Métriques réseau** | Latence, erreurs (exposées à Prometheus via Viz) |
| **Load balancing** | Répartition avancée côté proxy |
| **Retry / circuit breaker** | Politiques côté proxy (sans code app) |
| **Dashboard** | Extension Viz pour visualisation du mesh |

## Fichiers

| Fichier | Rôle |
|---------|------|
| `install.sh` | Installation CLI, control plane, extension Viz |
| `prometheus-rules-p99.yaml` | Alerte latence p99 > 500 ms (PrometheusRule) |
| `README.md` | Ce fichier |

## Installation

```bash
# Prérequis : kubectl configuré sur le cluster cible
./infrastructure/linkerd/install.sh
```

Variables d’environnement optionnelles :

- `LINKERD_VERSION` : version du CLI (défaut : stable-2.15)
- `INSTALL_VIZ` : installer l’extension Viz/dashboard (défaut : true)

## Vérification

```bash
linkerd check
linkerd viz dashboard   # ouvre le dashboard en proxy local
```

## Déploiement des workloads avec Linkerd

Utiliser les manifests avec annotations d’injection :

```bash
kubectl apply -k infrastructure/k8s/overlays/with-linkerd/
```

Voir `infrastructure/k8s-manifests/with-linkerd/README.md`.

## Alerting p99 > 500 ms

- **Avec Prometheus Operator** (CRD `monitoring.coreos.com/v1`) : `kubectl apply -f infrastructure/linkerd/prometheus-rules-p99.yaml`
- **Sans Operator** : ajouter `infrastructure/linkerd/prometheus-rule-fragment-p99.yaml` dans `rule_files` de votre `prometheus.yml`.
