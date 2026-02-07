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
} from './metrics.middleware.js';

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
} from './error.middleware.js';

// Logging
export {
  logger,
  configureLogger,
  requestLogger,
  createChildLogger,
  getRequestLogger,
  LogLevel,
} from './logger.middleware.js';

// Health Check
export {
  createHealthEndpoints,
  HealthStatus,
  DependencyCheck,
} from './health.middleware.js';
