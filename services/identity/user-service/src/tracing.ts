/**
 * OpenTelemetry - Tracing distribué (user-service Express)
 * À importer en premier dans index.ts : import './tracing';
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
  process.env.OTEL_SERVICE_NAME || process.env.npm_package_name || 'user-service';

if (!disabled) {
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
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });

  sdk.start();
}

export {};
