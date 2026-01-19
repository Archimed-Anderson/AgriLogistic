/**
 * API Client for AgroLogistic Platform
 * Handles all HTTP communication with the backend microservices through Kong Gateway
 */

interface APIClientConfig {
  baseURL: string;
  timeout: number;
}

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

class APIClient {
  private baseURL: string;
  private timeout: number;

  constructor(config?: Partial<APIClientConfig>) {
    // TEMPORARY: Bypass Kong Gateway (Kong routing issue) - Point directly to auth-service
    this.baseURL = config?.baseURL || import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3001/api/v1';
    this.timeout = config?.timeout || 30000;
  }

  /**
   * Get default headers including authentication and CSRF protection
   */
  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Ajouter le token CSRF pour les requêtes modifiantes
    try {
      const csrfToken = sessionStorage.getItem('csrf_token');
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
    } catch (error) {
      // sessionStorage peut ne pas être disponible dans certains contextes
      console.warn('Impossible de récupérer le token CSRF:', error);
    }

    return headers;
  }

  /**
   * Handle token refresh on 401 responses
   */
  private async handleUnauthorized(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        // Backend returns 'token' not 'accessToken'
        const accessToken = data.token || data.accessToken;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    // Clear tokens and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/auth';
    return false;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(url: string, params?: Record<string, string>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    if (!params) return fullURL;

    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${fullURL}?${queryString}` : fullURL;
  }

  /**
   * Make HTTP request with automatic retry on 401
   */
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    options?: RequestOptions,
    isRetry = false
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.buildURL(url, options?.params), {
        method,
        headers: {
          ...this.getDefaultHeaders(),
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 - try to refresh token
      if (response.status === 401 && !isRetry) {
        const refreshed = await this.handleUnauthorized();
        if (refreshed) {
          return this.request<T>(method, url, data, options, true);
        }
      }

      // Handle error responses
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', url, data, options);
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', url, data, options);
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', url, data, options);
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }
}

// Create and export singleton instance
export const apiClient = new APIClient();
export default apiClient;
