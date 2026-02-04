/**
 * OpenTelemetry (CNCF) - Tracing distribué (Prompt 5.1)
 * À importer en premier dans main.ts : import '@agrologistic/microservice-core/tracing';
 * Variables : OTEL_SDK_DISABLED, OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_SERVICE_NAME
 */
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const disabled = process.env.OTEL_SDK_DISABLED === 'true';
const endpoint =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
  process.env.JAEGER_AGENT_ENDPOINT ||
  'http://localhost:4318';
const serviceName =
  process.env.OTEL_SERVICE_NAME || process.env.npm_package_name || 'agrilogistic-service';

if (disabled) {
  // No-op
} else {
  const traceExporter = new OTLPTraceExporter({
    url: endpoint.endsWith('/v1/traces') ? endpoint : `${endpoint.replace(/\/$/, '')}/v1/traces`,
  });

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        // HTTP, pg, redis, kafkajs activés par défaut ; désactiver fs pour réduire le bruit
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  sdk.start();
}

export {};
