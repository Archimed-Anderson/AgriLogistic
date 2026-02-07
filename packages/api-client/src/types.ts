/**
 * 🌌 HYPER-SPEED DATA LINK - Types & Interfaces
 * 
 * Objectif: Définir les types pour le client API
 */

/**
 * Configuration du client API
 */
export interface ApiClientConfig {
  /**
   * URL de base de l'API
   * @example 'https://api.agrodeep.com/v1'
   */
  baseURL: string;

  /**
   * Timeout en millisecondes
   * @default 30000
   */
  timeout?: number;

  /**
   * Nombre de tentatives en cas d'échec
   * @default 3
   */
  retries?: number;

  /**
   * Délai entre les tentatives (ms)
   * @default 1000
   */
  retryDelay?: number;

  /**
   * Headers personnalisés
   */
  headers?: Record<string, string>;

  /**
   * Activer les credentials (cookies)
   * @default true
   */
  withCredentials?: boolean;

  /**
   * Fonction pour récupérer le token JWT
   */
  getAuthToken?: () => string | null | Promise<string | null>;

  /**
   * Callback appelé lors d'une erreur d'authentification (401)
   */
  onAuthError?: () => void;

  /**
   * Activer les logs de debug
   * @default false
   */
  debug?: boolean;
}

/**
 * Réponse API normalisée
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  statusCode: number;
  timestamp?: string;
}

/**
 * Erreur API normalisée
 */
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
  method?: string;
}

/**
 * Options pour les requêtes
 */
export interface RequestOptions {
  /**
   * Headers supplémentaires pour cette requête
   */
  headers?: Record<string, string>;

  /**
   * Paramètres de query string
   */
  params?: Record<string, any>;

  /**
   * Timeout spécifique pour cette requête
   */
  timeout?: number;

  /**
   * Désactiver le retry pour cette requête
   */
  noRetry?: boolean;

  /**
   * Signal d'annulation
   */
  signal?: AbortSignal;
}

/**
 * Méthodes HTTP supportées
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Configuration de retry
 */
export interface RetryConfig {
  /**
   * Nombre de tentatives
   */
  retries: number;

  /**
   * Délai entre les tentatives (ms)
   */
  retryDelay: number;

  /**
   * Codes de statut HTTP à retry
   */
  retryCondition?: (error: any) => boolean;

  /**
   * Fonction pour calculer le délai de retry (backoff exponentiel)
   */
  retryDelayFn?: (retryCount: number, error: any) => number;
}

/**
 * Statistiques du client API
 */
export interface ApiClientStats {
  /**
   * Nombre total de requêtes
   */
  totalRequests: number;

  /**
   * Nombre de requêtes réussies
   */
  successfulRequests: number;

  /**
   * Nombre de requêtes échouées
   */
  failedRequests: number;

  /**
   * Nombre de retries effectués
   */
  totalRetries: number;

  /**
   * Temps de réponse moyen (ms)
   */
  averageResponseTime: number;

  /**
   * Dernière erreur rencontrée
   */
  lastError?: ApiError;
}
