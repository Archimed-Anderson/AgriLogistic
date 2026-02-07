# Guide Déploiement Kubernetes

## Vue d'Ensemble

AgroDeep dispose de manifests Kubernetes complets pour un déploiement cloud-native sur n'importe quel cluster K8s (GKE, EKS, AKS, ou self-hosted).

---

## 🎯 Architecture Kubernetes

```
agrodeep/
├── namespace: agrodeep
├── deployments: web-app, api, ai-service
├── services: ClusterIP + LoadBalancer
├── ingress: NGINX Ingress Controller
├── hpa: Horizontal Pod Autoscaler
├── statefulsets: PostgreSQL, Redis
└── monitoring: Prometheus, Grafana
```

---

## 📋 Pré-requis

- kubectl 1.27+ installé
- Cluster Kubernetes accessible (minikube, k3s, ou cloud)
- NGINX Ingress Controller installé (optionnel)
- Cert-Manager pour TLS (optionnel)

### Vérifications

```bash
# Vérifier kubectl
kubectl version --client

# Vérifier connexion cluster
kubectl cluster-info

# Vérifier nodes
kubectl get nodes
```

---

## 🚀 Déploiement

### Quick Start (Dev)

```bash
# Créer namespace
kubectl create namespace agrodeep

# Appliquer tous les manifests
kubectl apply -k infrastructure/k8s/overlays/development

# Vérifier déploiement
kubectl get all -n agrodeep
```

### Production Deployment

```bash
# 1. Créer secrets
kubectl create secret generic agrodeep-secrets \
  --from-literal=DATABASE_URL='your-neon-connection-string' \
  --from-literal=JWT_SECRET='your-jwt-secret' \
  --from-literal=R2_ACCESS_KEY='your-r2-access-key' \
  --from-literal=R2_SECRET_KEY='your-r2-secret-key' \
  -n agrodeep

# 2. Appliquer configmaps
kubectl apply -f infrastructure/k8s/base/configmaps.yaml

# 3. Déployer l'application
kubectl apply -k infrastructure/k8s/overlays/production

# 4. Vérifier status
kubectl get pods -n agrodeep -w
```

---

## 📦 Composants

### Deployments

| Service | Replicas | Image | Port |
|---------|----------|-------|------|
| **web-app** | 2-5 | agrodeep/web-app:latest | 3000 |
| **api** | 2-5 | agrodeep/api:latest | 3001 |
| **ai-service** | 2-3 | agrodeep/ai-service:latest | 8000 |

### StatefulSets

| Service | Replicas | Image | Storage |
|---------|----------|-------|---------|
| **postgres** | 1 | postgres:16-alpine | 10Gi |
| **redis** | 1 | redis:7-alpine | 5Gi |

### Services

```yaml
# web-app-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app
  namespace: agrodeep
spec:
  type: LoadBalancer  # ou ClusterIP si Ingress
  ports:
    - port: 3000
      targetPort: 3000
  selector:
    app: web-app
```

### Horizontal Pod Autoscaler (HPA)

```yaml
# web-app-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
  namespace: agrodeep
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## 🌐 Ingress Configuration

### NGINX Ingress

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: agrodeep-ingress
  namespace: agrodeep
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - agrodeep.com
    - www.agrodeep.com
    secretName: agrodeep-tls
  rules:
  - host: agrodeep.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-app
            port:
              number: 3000
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api
            port:
              number: 3001
```

### Installation NGINX Ingress

```bash
# Installer NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Vérifier installation
kubectl get pods -n ingress-nginx
```

---

## 🔐 Secrets Management

### Créer Secrets

```bash
# From literal values
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password=secure_password \
  -n agrodeep

# From files
kubectl create secret generic api-keys \
  --from-file=r2-access-key=./r2-access.key \
  --from-file=r2-secret-key=./r2-secret.key \
  -n agrodeep

# From .env file
kubectl create secret generic app-env \
  --from-env-file=.env.production \
  -n agrodeep
```

### Utiliser Secrets dans Pods

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  template:
    spec:
      containers:
      - name: api
        envFrom:
        - secretRef:
            name: app-env
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
```

---

## 📊 Monitoring Kubernetes

### Prometheus Operator

```bash
# Installer Prometheus Operator
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/bundle.yaml

# Créer ServiceMonitor pour web-app
kubectl apply -f infrastructure/k8s/monitoring/servicemonitor-web-app.yaml
```

### Grafana

```bash
# Déployer Grafana
kubectl apply -f infrastructure/k8s/monitoring/grafana-deployment.yaml

# Port forward
kubectl port-forward -n agrodeep svc/grafana 3000:3000

# Accéder: http://localhost:3000
```

---

## 🧪 Health Checks & Readiness

### Liveness Probe

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 3
```

### Readiness Probe

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
  successThreshold: 1
```

---

## 🔄 Updates & Rollbacks

### Rolling Update

```bash
# Update image
kubectl set image deployment/web-app \
  web-app=agrodeep/web-app:v2.0 \
  -n agrodeep

# Vérifier rollout status
kubectl rollout status deployment/web-app -n agrodeep
```

### Rollback

```bash
# Rollback vers version précédente
kubectl rollout undo deployment/web-app -n agrodeep

# Rollback vers version spécifique
kubectl rollout undo deployment/web-app --to-revision=2 -n agrodeep
```

---

## 📦 Volumes & Storage

### PersistentVolumeClaim

```yaml
# postgres-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: agrodeep
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: standard  # ou fast-ssd pour performance
```

### StatefulSet avec PVC

```yaml
volumeClaimTemplates:
- metadata:
    name: postgres-data
  spec:
    accessModes: [ "ReadWriteOnce" ]
    resources:
      requests:
        storage: 10Gi
```

---

## 🔧 Troubleshooting Kubernetes

### Pods en CrashLoopBackOff

```bash
# Voir logs
kubectl logs <pod-name> -n agrodeep

# Logs précédent container (après crash)
kubectl logs <pod-name> -n agrodeep --previous

# Décrire pod pour voir events
kubectl describe pod <pod-name> -n agrodeep
```

### ImagePullBackOff

```bash
# Vérifier image existe
docker pull agrodeep/web-app:latest

# Vérifier secrets image registry
kubectl get secrets -n agrodeep

# Créer secret registry si besoin
kubectl create secret docker-registry regcred \
  --docker-server=registry.example.com \
  --docker-username=user \
  --docker-password=pass \
  -n agrodeep
```

### Pending Pods

```bash
# Vérifier resources disponibles
kubectl describe nodes

# Vérifier PVC
kubectl get pvc -n agrodeep

# Events cluster
kubectl get events -n agrodeep --sort-by='.lastTimestamp'
```

---

## 🌍 Multi-Cluster Deployment

### Contexts

```bash
# Lister contexts
kubectl config get-contexts

# Changer de context
kubectl config use-context production-cluster

# Déployer sur chaque cluster
for context in dev staging prod; do
  kubectl config use-context $context
  kubectl apply -k infrastructure/k8s/overlays/$context
done
```

---

## 📖 Commandes Utiles

```bash
# Tous les pods
kubectl get pods -n agrodeep

# Tous les services
kubectl get svc -n agrodeep

# Tous les deployments
kubectl get deployments -n agrodeep

# HPA status
kubectl get hpa -n agrodeep

# Logs temps réel
kubectl logs -f deployment/web-app -n agrodeep

# Shell dans pod
kubectl exec -it <pod-name> -n agrodeep -- /bin/sh

# Port forwarding
kubectl port-forward svc/web-app 3000:3000 -n agrodeep

# Ressources consommées
kubectl top pods -n agrodeep
kubectl top nodes

# Delete all
kubectl delete namespace agrodeep
```

---

## 🚀 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/k8s-deploy.yml
name: Deploy to Kubernetes
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
    
    - name: Configure kubectl
      run: |
        echo "${{ secrets.KUBE_CONFIG }}" > kubeconfig
        export KUBECONFIG=kubeconfig
    
    - name: Deploy
      run: |
        kubectl apply -k infrastructure/k8s/overlays/production
        kubectl rollout status deployment/web-app -n agrodeep
```

---

## 📚 Ressources

- [Kubernetes Docs](https://kubernetes.io/docs/)
- [NGINX Ingress](https://kubernetes.github.io/ingress-nginx/)
- [Cert-Manager](https://cert-manager.io/docs/)
- [Kustomize](https://kustomize.io/)
