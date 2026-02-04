# OpenTelemetry - Tracing distribué (Prompt 5.1)

Tracing distribué end-to-end pour diagnostiquer les latences dans la chaîne de requêtes (API → DB → Cache → External).

## Fichiers de configuration et instrumentation

| Composant | Fichier |
|-----------|---------|
| Stack OTLP / Jaeger | `infrastructure/docker-compose.otel.yml` |
| Collector (optionnel) | `infrastructure/otel-collector-config.yaml` |
| NestJS (auth, mission) | `packages/microservice-core/middleware/tracing.ts` |
| Express (user-service) | `services/identity/user-service/src/tracing.ts` |
| Next.js (web-app) | `apps/web-app/instrumentation.ts` |
| Python FastAPI (ai-service) | `services/ai-service/src/tracing.py` (ou `app/tracing.py`) |

## Visualisation – Jaeger UI

- **URL** : http://localhost:16686
- **Démarrage** : `cd infrastructure && docker compose -f docker-compose.otel.yml up -d`

### Fonctionnalités

- **Recherche par traceID** : coller l’ID de trace pour afficher une requête end-to-end.
- **Recherche par service** : filtrer par nom de service (ex. `user-service`, `agrilogistic-web-app`, `auth-service`).
- **Recherche par durée** : min/max duration pour isoler les requêtes lentes.
- **Graph de dépendances** : vue « System Architecture » pour les dépendances entre services (qui appelle qui).

Les services envoient les traces en OTLP HTTP (port 4318) ou gRPC (4317) vers Jaeger ou l’OpenTelemetry Collector.

---

## Backend NestJS (microservice-core)

- **Package** : `@agrologistic/microservice-core`
- **Fichier** : `packages/microservice-core/middleware/tracing.ts`
- **Export** : `import '@agrologistic/microservice-core/tracing'` (à placer en **première ligne** de `main.ts` dans chaque service NestJS).

## Instrumentation

- **HTTP** : requêtes/réponses (Express, fetch, http)
- **PostgreSQL** : requêtes `pg`
- **Redis** : commandes redis (client v4)
- **Kafka** : producer/consumer kafkajs
- **FS** : désactivé par défaut (réduire le bruit)

L’export OTLP est envoyé en HTTP vers un collecteur (Jaeger, Tempo ou OpenTelemetry Collector).

## Variables d’environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `OTEL_SDK_DISABLED` | Désactiver le SDK (pas de traces) | `false` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | URL du collecteur OTLP (sans `/v1/traces`) | `http://localhost:4318` |
| `JAEGER_AGENT_ENDPOINT` | Alternative (ex. `http://jaeger:4318`) | — |
| `OTEL_SERVICE_NAME` | Nom du service dans les traces | `npm_package_name` ou `agrilogistic-service` |

## Backend Express (user-service)

- **Fichier** : `services/identity/user-service/src/tracing.ts`
- **Intégration** : en **première ligne** de `src/index.ts` : `import './tracing';`
- **Export** : OTLP HTTP vers Jaeger/Collector (mêmes variables que NestJS).
- **Instrumentation** : HTTP, Express, `pg` (auto-instrumentations-node).

Variables : `OTEL_SDK_DISABLED`, `OTEL_EXPORTER_OTLP_ENDPOINT` (défaut `http://localhost:4318`), `OTEL_SERVICE_NAME` (défaut `user-service`).

---

## Frontend Next.js (web-app)

- **Fichier** : `apps/web-app/instrumentation.ts`
- **Spans** : côté serveur (navigation, API routes). Utilise **@vercel/otel** si installé, sinon **instrumentation manuelle** (Node SDK OTLP) si les paquets OpenTelemetry sont présents.
- **Configuration** : `next.config.mjs` doit définir `experimental.instrumentationHook: true`.

Variables : `OTEL_SDK_DISABLED`, `OTEL_EXPORTER_OTLP_ENDPOINT` / `OTEL_EXPORTER_OTLP_HTTP_ENDPOINT` (défaut `http://localhost:4318`), `OTEL_SERVICE_NAME` (défaut `agrilogistic-web-app`).

Pour les **spans côté client** (navigation, appels API depuis le navigateur), on peut étendre l’instrumentation (ex. fetch wrapper ou SDK browser) ; le hook `instrumentation.ts` couvre le serveur Next.js.

---

## Backend (Jaeger / Tempo)

- **Jaeger** : accepter OTLP HTTP sur le port 4318 (ou via Collector). Stack dédiée : `infrastructure/docker-compose.otel.yml`.
- **Tempo** : déjà configuré dans la stack monitoring ; endpoint OTLP HTTP 4318.
- **Docker** : exposer le port 4318 pour le collecteur ou utiliser le service `tempo` du `docker-compose.monitoring.yml`.

## Intégration dans un service NestJS

Dans `main.ts`, **avant** tout autre import :

```typescript
import '@agrologistic/microservice-core/tracing';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// ...
```

Services déjà configurés : `auth-service`, `mission-service`.

## Dépendances (microservice-core)

- `@opentelemetry/sdk-node`
- `@opentelemetry/exporter-trace-otlp-http`
- `@opentelemetry/auto-instrumentations-node`
- `@opentelemetry/resources`
- `@opentelemetry/semantic-conventions`

Installation : à la racine du monorepo, `pnpm install` met à jour les dépendances du workspace.

---

## Python (FastAPI AI Service)

- **Fichier** : `services/ai-service/src/tracing.py`
- **Intégration** : dans `main.py`, importer `tracing` puis appeler `tracing.instrument_fastapi(app)` après la création de l’app FastAPI.
- **Export** : Jaeger Thrift (agent UDP) ; `JaegerExporter(agent_host_name=..., agent_port=...)` + `BatchSpanProcessor`.
- **Variables** : `OTEL_SDK_DISABLED`, `JAEGER_AGENT_HOST` (défaut `jaeger`), `JAEGER_AGENT_PORT` (défaut `6831`), `OTEL_SERVICE_NAME` (défaut `agrilogistic-ai-service`).
- **Dépendances** : `opentelemetry-api`, `opentelemetry-sdk`, `opentelemetry-exporter-jaeger-thrift`, `opentelemetry-instrumentation-fastapi`, `opentelemetry-semantic-conventions` (voir `services/ai-service/requirements.txt`).
- **Lancer** : depuis `services/ai-service`, `pip install -r requirements.txt` puis `uvicorn src.main:app --host 0.0.0.0 --port 8000` (ou depuis `src/` : `uvicorn main:app`).
