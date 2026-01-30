/**
 * Shared Middleware Package Exports
 * Import all shared middleware from this single entry point
 */

// Metrics
export {
  initializeMetrics,
  getMetricsRegistry,
  metricsMiddleware,
  metricsEndpoint,
  incrementMetric,
  setMetricGauge,
} from './metrics.middleware';

// Error Handling
export {
  APIError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ServiceUnavailableError,
  configureErrorHandler,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  validateRequest,
} from './error.middleware';

// Logging
export {
  logger,
  configureLogger,
  requestLogger,
  createChildLogger,
  getRequestLogger,
  LogLevel,
} from './logger.middleware';

// Health Check
export {
  createHealthEndpoints,
  HealthStatus,
  DependencyCheck,
} from './health.middleware';
