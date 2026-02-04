/**
 * Enhanced API Client for AgroLogistic Platform
 * Robust HTTP client with retry logic, better error handling, and adaptive timeouts
 */

interface APIClientConfig {
  baseURL: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  enableLogs: boolean;
}

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  skipRetry?: boolean;
  timeout?: number;
}

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatusCodes: number[];
  shouldRetry: (error: any, attempt: number) => boolean;
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: any,
    public isNetworkError: boolean = false,
    public isTimeout: boolean = false,
    public isServerError: boolean = false
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class EnhancedAPIClient {
  private baseURL: string;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;
  private enableLogs: boolean;
  private retryConfig: RetryConfig;

  constructor(config?: Partial<APIClientConfig>) {
    this.baseURL =
      config?.baseURL || import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000/api/v1';
    this.timeout = config?.timeout || 15000;
    this.maxRetries = config?.maxRetries || 3;
    this.retryDelay = config?.retryDelay || 1000;
    this.enableLogs = config?.enableLogs ?? (import.meta.env.DEV || false);

    this.retryConfig = {
      maxRetries: this.maxRetries,
      retryDelay: this.retryDelay,
      retryableStatusCodes: [408, 429, 500, 502, 503, 504],
      shouldRetry: (error: any, attempt: number) => {
        if (attempt >= this.maxRetries) return false;
        if (error instanceof TypeError && error.message.includes('fetch')) return true;
        if (error.name === 'AbortError') return true;
        if (error.statusCode && this.retryConfig.retryableStatusCodes.includes(error.statusCode)) {
          return true;
        }
        return false;
      },
    };
  }

  private resolveEndpoint(endpoint: string): string {
    // Normalize relative endpoints (e.g. "/api/v1") to an absolute URL for diagnostics/UI.
    if (endpoint.startsWith('/')) {
      const origin =
        typeof window !== 'undefined' && window.location?.origin
          ? window.location.origin
          : 'http://localhost';
      return `${origin}${endpoint}`;
    }
    return endpoint;
  }

  private log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    if (!this.enableLogs) return;
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [API Client]`;

    switch (level) {
      case 'info':
        console.log(`${prefix} ℹ️ ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`${prefix} ⚠️ ${message}`, data || '');
        break;
      case 'error':
        console.error(`${prefix} ❌ ${message}`, data || '');
        break;
    }
  }

  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const csrfToken = sessionStorage.getItem('csrf_token');
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
    } catch (error) {
      this.log('warn', 'Could not retrieve CSRF token', error);
    }

    return headers;
  }

  private async handleUnauthorized(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      this.log('warn', 'No refresh token available');
      return false;
    }

    try {
      this.log('info', 'Attempting token refresh...');
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Support both legacy (camelCase) and OAuth2 (snake_case) payloads.
        body: JSON.stringify({ refresh_token: refreshToken, refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.access_token || data.accessToken || data.token;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          this.log('info', 'Token refreshed successfully');
        }
        const newRefreshToken = data.refresh_token || data.refreshToken;
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        return true;
      }
    } catch (error) {
      this.log('error', 'Token refresh failed', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return false;
  }

  private buildURL(url: string, params?: Record<string, string>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    if (!params) return fullURL;

    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${fullURL}?${queryString}` : fullURL;
  }

  private async wait(attempt: number): Promise<void> {
    const delay = this.retryDelay * Math.pow(2, attempt - 1);
    this.log('info', `Waiting ${delay}ms before retry attempt ${attempt}...`);
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  private async parseError(error: any, response?: Response): Promise<APIError> {
    if (!response) {
      if (error.name === 'AbortError') {
        return new APIError(
          'La requête a pris trop de temps. Le serveur ne répond pas assez rapidement.',
          0,
          error,
          false,
          true,
          false
        );
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        this.log('warn', 'Network error detected, running diagnostics...');
        const diagnostic = await this.diagnoseConnection();

        const detailedMessage = diagnostic.suggestion
          ? diagnostic.suggestion
          : `Impossible de se connecter au serveur (${this.baseURL}).`;

        return new APIError(detailedMessage, 0, error, true, false, false);
      }

      return new APIError('Une erreur réseau est survenue.', 0, error, true, false, false);
    }

    let errorMessage = `Erreur HTTP ${response.status}`;
    let errorBody: any = null;

    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorBody = await response.json();
        errorMessage = errorBody.error || errorBody.message || errorMessage;
      } else {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
    } catch (parseError) {
      this.log('warn', 'Failed to parse error response', parseError);
    }

    const isServerError = response.status >= 500;
    return new APIError(errorMessage, response.status, errorBody, false, false, isServerError);
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    options?: RequestOptions,
    attempt = 1
  ): Promise<T> {
    const requestTimeout = options?.timeout || this.timeout;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

    const fullURL = this.buildURL(url, options?.params);
    this.log('info', `${method} ${fullURL} (attempt ${attempt}/${this.maxRetries + 1})`);

    try {
      const response = await fetch(fullURL, {
        method,
        headers: {
          ...this.getDefaultHeaders(),
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      if (response.status === 401 && attempt === 1) {
        this.log('warn', 'Received 401, attempting token refresh...');
        const refreshed = await this.handleUnauthorized();
        if (refreshed) {
          return this.request<T>(method, url, data, options, attempt);
        }
        throw new APIError(
          'Session expirée. Veuillez vous reconnecter.',
          401,
          null,
          false,
          false,
          false
        );
      }

      if (!response.ok) {
        const apiError = await this.parseError(null, response);

        if (!options?.skipRetry && this.retryConfig.shouldRetry(apiError, attempt)) {
          await this.wait(attempt);
          return this.request<T>(method, url, data, options, attempt + 1);
        }

        throw apiError;
      }

      if (response.status === 204) {
        return {} as T;
      }

      const result = await response.json();
      this.log('info', `${method} ${fullURL} - Success`);
      return result;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error instanceof APIError) {
        this.log('error', `${method} ${fullURL} - ${error.message}`, {
          statusCode: error.statusCode,
        });
        throw error;
      }

      const apiError = await this.parseError(error);

      if (!options?.skipRetry && this.retryConfig.shouldRetry(apiError, attempt)) {
        await this.wait(attempt);
        return this.request<T>(method, url, data, options, attempt + 1);
      }

      this.log('error', `${method} ${fullURL} - ${apiError.message}`, apiError);
      throw apiError;
    }
  }

  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  async post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', url, data, options);
  }

  async put<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', url, data, options);
  }

  async patch<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', url, data, options);
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  async checkHealth(): Promise<boolean> {
    try {
      await this.get('/health', { skipRetry: true, timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async diagnoseConnection(): Promise<{
    isReachable: boolean;
    endpoint: string;
    error?: string;
    suggestion?: string;
  }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return { isReachable: true, endpoint: this.resolveEndpoint(this.baseURL) };
      }

      return {
        isReachable: false,
        endpoint: this.resolveEndpoint(this.baseURL),
        error: `HTTP ${response.status}`,
        suggestion:
          'Le serveur est accessible mais les services backend ne répondent pas correctement.',
      };
    } catch (error: any) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        return {
          isReachable: false,
          endpoint: this.resolveEndpoint(this.baseURL),
          error: 'Timeout',
          suggestion: 'Le serveur met trop de temps à répondre.',
        };
      }

      return {
        isReachable: false,
        endpoint: this.resolveEndpoint(this.baseURL),
        error: 'Connection failed',
        suggestion: `Impossible de joindre le serveur à ${this.resolveEndpoint(
          this.baseURL
        )}. Vérifiez que le backend est démarré et que votre configuration \`.env\` (VITE_API_GATEWAY_URL) est correcte.`,
      };
    }
  }
}

export const apiClient = new EnhancedAPIClient();
export default apiClient;
