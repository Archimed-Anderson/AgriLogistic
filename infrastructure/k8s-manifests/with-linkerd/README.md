# Déploiement avec Linkerd (Service Mesh)

Manifests Kubernetes avec **injection Linkerd** activée via annotation sur le namespace `AgroLogistic`.

L’overlay Kustomize se trouve dans **`infrastructure/k8s/overlays/with-linkerd/`** (contrainte Kustomize : fichiers dans ou sous le répertoire du kustomization).

## Prérequis

1. Cluster Kubernetes opérationnel.
2. Linkerd control plane + extension Viz installés :
   ```bash
   ./infrastructure/linkerd/install.sh
   ```
   Sur Windows : voir `infrastructure/linkerd/install-linkerd.ps1` et `infrastructure/scripts/validate-linkerd.ps1`.

## Déploiement

```bash
# Depuis la racine du projet (AgroDeep)
kubectl apply -k infrastructure/k8s/overlays/with-linkerd/
```

Ou avec Kustomize :

```bash
kubectl kustomize infrastructure/k8s/overlays/with-linkerd/ | kubectl apply -f -
```

## Injection

- Le namespace `AgroLogistic` a l’annotation `linkerd.io/inject: enabled`.
- Tous les pods créés dans ce namespace reçoivent automatiquement le proxy Linkerd (mTLS, métriques, retry, circuit breaker).
- Pour exclure un pod : annotation `linkerd.io/inject: disabled` sur le pod ou son déploiement.

## Contenu de l’overlay

- **`infrastructure/k8s/overlays/with-linkerd/namespace-linkerd.yaml`** : namespace avec annotation d’injection.
- **`infrastructure/k8s/overlays/with-linkerd/kustomization.yaml`** : inclut l’overlay production + ce namespace.
