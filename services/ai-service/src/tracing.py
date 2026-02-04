"""
OpenTelemetry - Tracing distribué (FastAPI AI Service)
À importer avant la création de l'app pour enregistrer le TracerProvider.
Variables : OTEL_SDK_DISABLED, JAEGER_AGENT_HOST, JAEGER_AGENT_PORT, OTEL_SERVICE_NAME
"""
import os

_disabled = os.getenv("OTEL_SDK_DISABLED", "").lower() == "true"

if not _disabled:
    from opentelemetry import trace
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import BatchSpanProcessor
    from opentelemetry.sdk.resources import Resource

    try:
        from opentelemetry.exporter.jaeger.thrift import JaegerExporter
    except ImportError:
        JaegerExporter = None

    _agent_host = os.getenv("JAEGER_AGENT_HOST", os.getenv("OTEL_EXPORTER_JAEGER_AGENT_HOST", "jaeger"))
    _agent_port = int(os.getenv("JAEGER_AGENT_PORT", os.getenv("OTEL_EXPORTER_JAEGER_AGENT_PORT", "6831")))
    _service_name = os.getenv("OTEL_SERVICE_NAME", "agrilogistic-ai-service")

    resource = Resource.create({"service.name": _service_name})
    provider = TracerProvider(resource=resource)

    if JaegerExporter is not None:
        exporter = JaegerExporter(
            agent_host_name=_agent_host,
            agent_port=_agent_port,
        )
        provider.add_span_processor(BatchSpanProcessor(exporter))

    trace.set_tracer_provider(provider)


def instrument_fastapi(app):
    """Instrumente l'application FastAPI (à appeler après création de l'app)."""
    if _disabled:
        return
    try:
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
        FastAPIInstrumentor.instrument_app(app)
    except ImportError:
        pass
