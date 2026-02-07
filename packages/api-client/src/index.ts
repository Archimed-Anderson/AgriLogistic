/**
 * 🌌 HYPER-SPEED DATA LINK - API Client Package
 * 
 * Export principal incluant le Error Boundary
 */

export { ApiClient, createApiClient } from './client';
export { GlobalErrorBoundary, useErrorHandler } from './error-boundary';
export type { ErrorBoundaryProps } from './error-boundary';
export type {
  ApiClientConfig,
  ApiResponse,
  ApiError,
  RequestOptions,
  HttpMethod,
  RetryConfig,
  ApiClientStats,
} from './types';

// Réexporter axios pour utilisation directe si nécessaire
export { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
