/**
 * Next.js 14 - Instrumentation OpenTelemetry
 * Spans côté serveur (navigation, API routes).
 * Utilise @vercel/otel si installé, sinon instrumentation manuelle (Node SDK OTLP).
 * S'exécute une fois au démarrage du serveur Next.js.
 * Activer avec experimental.instrumentationHook = true dans next.config.mjs.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const serviceName = process.env.OTEL_SERVICE_NAME || 'agrilogistic-web-app';

  try {
    const { registerOTel } = await import('@vercel/otel');
    registerOTel({ serviceName });
    return;
  } catch {
    // Fallback: instrumentation manuelle (Node SDK OTLP vers Jaeger/Collector)
  }

  if (process.env.OTEL_SDK_DISABLED === 'true') return;

  try {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
    const { Resource } = await import('@opentelemetry/resources');
    const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions');

    const endpoint =
      process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
      process.env.OTEL_EXPORTER_OTLP_HTTP_ENDPOINT ||
      'http://localhost:4318';
    const url = endpoint.endsWith('/v1/traces') ? endpoint : `${endpoint.replace(/\/$/, '')}/v1/traces`;

    const sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      }),
      traceExporter: new OTLPTraceExporter({ url }),
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-fs': { enabled: false },
        }),
      ],
    });
    sdk.start();
  } catch {
    // Paquets OTel non installés ou erreur : pas de tracing
  }
}
