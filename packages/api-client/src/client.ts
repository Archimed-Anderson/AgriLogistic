/**
 * 🌌 HYPER-SPEED DATA LINK - Client API Centralisé
 * 
 * Objectif: Canal de communication haute fidélité et résilience
 * 
 * Fonctionnalités:
 * - Instance Axios configurée avec baseURL
 * - Retry automatique (3 tentatives) avec axios-retry
 * - Interceptors pour normalisation des réponses/erreurs
 * - Gestion automatique des tokens JWT
 * - Error handling robuste
 * - Statistiques de performance
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import {
  ApiClientConfig,
  ApiResponse,
  ApiError,
  RequestOptions,
  ApiClientStats,
} from './types';

/**
 * Classe principale du client API
 */
export class ApiClient {
  private instance: AxiosInstance;
  private config: Required<ApiClientConfig>;
  private stats: ApiClientStats;

  constructor(config: ApiClientConfig) {
    // Configuration par défaut
    this.config = {
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      headers: config.headers || {},
      withCredentials: config.withCredentials !== false,
      getAuthToken: config.getAuthToken || (() => null),
      onAuthError: config.onAuthError || (() => {}),
      debug: config.debug || false,
    };

    // Initialiser les statistiques
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalRetries: 0,
      averageResponseTime: 0,
    };

    // Créer l'instance Axios
    this.instance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
      withCredentials: this.config.withCredentials,
    });

    // Configurer le retry
    this.setupRetry();

    // Configurer les interceptors
    this.setupInterceptors();

    if (this.config.debug) {
      console.log('🌌 ApiClient initialized:', {
        baseURL: this.config.baseURL,
        timeout: this.config.timeout,
        retries: this.config.retries,
      });
    }
  }

  /**
   * Configure axios-retry pour les tentatives automatiques
   */
  private setupRetry(): void {
    axiosRetry(this.instance, {
      retries: this.config.retries,
      retryDelay: (retryCount) => {
        // Backoff exponentiel: 1s, 2s, 4s
        const delay = this.config.retryDelay * Math.pow(2, retryCount - 1);
        
        if (this.config.debug) {
          console.log(`🔄 Retry attempt ${retryCount}, waiting ${delay}ms`);
        }
        
        this.stats.totalRetries++;
        return delay;
      },
      retryCondition: (error: AxiosError) => {
        // Retry sur erreurs réseau ou 5xx
        const shouldRetry = 
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response?.status ? error.response.status >= 500 : false);

        if (this.config.debug && shouldRetry) {
          console.log('🔄 Retrying request:', error.message);
        }

        return shouldRetry;
      },
    });
  }

  /**
   * Configure les interceptors pour requêtes et réponses
   */
  private setupInterceptors(): void {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // REQUEST INTERCEPTOR
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    this.instance.interceptors.request.use(
      async (config) => {
        const startTime = Date.now();
        (config as any).metadata = { startTime };

        this.stats.totalRequests++;

        // Attacher le token JWT automatiquement
        const token = await this.config.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (this.config.debug) {
          console.log('📤 Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            hasAuth: !!token,
          });
        }

        return config;
      },
      (error) => {
        this.stats.failedRequests++;
        return Promise.reject(error);
      }
    );

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // RESPONSE INTERCEPTOR
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Calculer le temps de réponse
        const endTime = Date.now();
        const startTime = (response.config as any).metadata?.startTime || endTime;
        const responseTime = endTime - startTime;

        // Mettre à jour les statistiques
        this.stats.successfulRequests++;
        this.updateAverageResponseTime(responseTime);

        if (this.config.debug) {
          console.log('📥 Response:', {
            status: response.status,
            responseTime: `${responseTime}ms`,
          });
        }

        // Extraire automatiquement les données
        // Si la réponse a une structure { data, message, statusCode }
        // on retourne directement response.data.data
        // Sinon on retourne response.data
        return response.data?.data !== undefined ? response.data.data : response.data;
      },
      (error: AxiosError<ApiError>) => {
        this.stats.failedRequests++;

        // Gérer les erreurs d'authentification (401)
        if (error.response?.status === 401) {
          if (this.config.debug) {
            console.error('🔐 Authentication error (401)');
          }
          this.config.onAuthError();
        }

        // Normaliser l'erreur
        const apiError = this.normalizeError(error);
        this.stats.lastError = apiError;

        if (this.config.debug) {
          console.error('❌ API Error:', apiError);
        }

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Normalise les erreurs API
   */
  private normalizeError(error: AxiosError<any>): ApiError {
    // Erreur réseau (pas de réponse)
    if (!error.response) {
      return {
        message: error.message || 'Network error',
        statusCode: 0,
        timestamp: new Date().toISOString(),
      };
    }

    // Erreur avec réponse du serveur
    const response = error.response;
    
    return {
      message: response.data?.message || response.statusText || 'Unknown error',
      statusCode: response.status,
      errors: response.data?.errors,
      timestamp: response.data?.timestamp || new Date().toISOString(),
      path: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    };
  }

  /**
   * Met à jour le temps de réponse moyen
   */
  private updateAverageResponseTime(responseTime: number): void {
    const total = this.stats.successfulRequests;
    const currentAvg = this.stats.averageResponseTime;
    
    // Formule de moyenne mobile
    this.stats.averageResponseTime = 
      (currentAvg * (total - 1) + responseTime) / total;
  }

  /**
   * Méthode GET
   */
  async get<T = any>(url: string, options?: RequestOptions): Promise<T> {
    const config = this.buildConfig(options);
    return this.instance.get<any, T>(url, config);
  }

  /**
   * Méthode POST
   */
  async post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const config = this.buildConfig(options);
    return this.instance.post<any, T>(url, data, config);
  }

  /**
   * Méthode PUT
   */
  async put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const config = this.buildConfig(options);
    return this.instance.put<any, T>(url, data, config);
  }

  /**
   * Méthode PATCH
   */
  async patch<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const config = this.buildConfig(options);
    return this.instance.patch<any, T>(url, data, config);
  }

  /**
   * Méthode DELETE
   */
  async delete<T = any>(url: string, options?: RequestOptions): Promise<T> {
    const config = this.buildConfig(options);
    return this.instance.delete<any, T>(url, config);
  }

  /**
   * Construit la configuration Axios à partir des options
   */
  private buildConfig(options?: RequestOptions): AxiosRequestConfig {
    const config: AxiosRequestConfig = {};

    if (options?.headers) {
      config.headers = options.headers;
    }

    if (options?.params) {
      config.params = options.params;
    }

    if (options?.timeout) {
      config.timeout = options.timeout;
    }

    if (options?.signal) {
      config.signal = options.signal;
    }

    if (options?.noRetry) {
      (config as any)['axios-retry'] = { retries: 0 };
    }

    return config;
  }

  /**
   * Récupère les statistiques du client
   */
  getStats(): ApiClientStats {
    return { ...this.stats };
  }

  /**
   * Réinitialise les statistiques
   */
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalRetries: 0,
      averageResponseTime: 0,
    };
  }

  /**
   * Récupère l'instance Axios brute (pour cas avancés)
   */
  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

/**
 * Factory pour créer une instance du client API
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
