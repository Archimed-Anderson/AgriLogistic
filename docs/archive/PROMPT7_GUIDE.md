# 👁️ GUIDE PROMPT 7 : Observabilité Totale (Monitoring & Logs)

Ce guide explique comment activer l'observabilité dans vos microservices NestJS.

## 1. Intégration du Logger Standardisé (Pino)

Le module de logging standardisé est disponible dans `@agrologistic/common`. Il remplace `console.log` par des logs JSON structurés (Prod) ou Pretty Print (Dev).

### A. Dans `app.module.ts`

Importez `StandardLoggerModule` :

```typescript
import { Module } from '@nestjs/common';
import { StandardLoggerModule } from '@agrologistic/common';

@Module({
  imports: [
    StandardLoggerModule, // 👁️ Ajoute le Logger Pino globalement
    // ... autres modules
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### B. Dans `main.ts`

Activez le buffer logs et injectez le logger global :

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino'; // Import depuis nestjs-pino

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  
  // 👁️ Utiliser Pino comme logger global (remplace console.log, NestLogger)
  app.useLogger(app.get(Logger));
  
  await app.listen(3000);
}
bootstrap();
```

## 2. Dashboards Grafana

Le dashboard JSON prêt à l'emploi se trouve ici :
`infrastructure/monitoring/grafana/agrologistic_dashboard.json`

Pour l'importer :
1. Allez dans Grafana > Dashboards > Import.
2. Copiez le contenu du JSON ou uploadez le fichier.
3. Sélectionnez la source de données Prometheus.

## 3. Alertes Prometheus

Les règles d'alerte sont définies dans :
`infrastructure/monitoring/prometheus/alert_rules.yml`

Elles couvrent :
- Uptime < 99% (Critique)
- Latence P95 > 500ms (Warning)
- Taux d'erreur > 1% (Critique)
- CPU Usage élevé

Pour les activer, assurez-vous que Prometheus charge ce fichier via `rule_files` dans `prometheus.yml`.
