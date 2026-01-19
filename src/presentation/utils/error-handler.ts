/**
 * Enhanced Error Handler for User-Friendly Messages
 */

import { APIError } from '../../infrastructure/api/rest/api-client-enhanced';

export interface UserFriendlyError {
  title: string;
  message: string;
  actionable: string;
  canRetry: boolean;
  severity: 'error' | 'warning' | 'info';
}

export class ErrorHandler {
  /**
   * Convert any error to a user-friendly error object
   */
  static toUserFriendly(error: unknown): UserFriendlyError {
    // Handle APIError instances
    if (error instanceof APIError) {
      return this.handleAPIError(error);
    }

    // Handle standard Error instances
    if (error instanceof Error) {
      return {
        title: 'Erreur',
        message: error.message || 'Une erreur inattendue s\'est produite.',
        actionable: 'Veuillez réessayer ou contactez le support si le problème persiste.',
        canRetry: true,
        severity: 'error',
      };
    }

    // Handle unknown errors
    return {
      title: 'Erreur inconnue',
      message: 'Une erreur inattendue s\'est produite.',
      actionable: 'Veuillez réessayer ou contactez le support.',
      canRetry: true,
      severity: 'error',
    };
  }

  /**
   * Handle APIError specifically
   */
  private static handleAPIError(error: APIError): UserFriendlyError {
    // Network errors
    if (error.isNetworkError) {
      return {
        title: 'Problème de connexion',
        message: 'Impossible de se connecter au serveur.',
        actionable: 'Vérifiez votre connexion internet et réessayez.',
        canRetry: true,
        severity: 'error',
      };
    }

    // Timeout errors
    if (error.isTimeout) {
      return {
        title: 'Délai d\'attente dépassé',
        message: 'La requête a pris trop de temps.',
        actionable: 'Vérifiez votre connexion internet et réessayez.',
        canRetry: true,
        severity: 'warning',
      };
    }

    // Server errors (5xx)
    if (error.isServerError) {
      return {
        title: 'Erreur serveur',
        message: 'Le serveur rencontre des difficultés.',
        actionable: 'Veuillez patienter quelques instants et réessayer.',
        canRetry: true,
        severity: 'error',
      };
    }

    // Status code specific errors
    switch (error.statusCode) {
      case 400:
        return {
          title: 'Données invalides',
          message: error.message || 'Les informations fournies sont invalides.',
          actionable: 'Veuillez vérifier vos informations et réessayer.',
          canRetry: false,
          severity: 'warning',
        };

      case 401:
        return {
          title: 'Authentification requise',
          message: error.message || 'Identifiants invalides.',
          actionable: 'Veuillez vérifier votre email et mot de passe.',
          canRetry: false,
          severity: 'warning',
        };

      case 403:
        return {
          title: 'Accès refusé',
          message: 'Vous n\'avez pas les permissions nécessaires.',
          actionable: 'Contactez l\'administrateur si vous pensez qu\'il s\'agit d\'une erreur.',
          canRetry: false,
          severity: 'error',
        };

      case 404:
        return {
          title: 'Ressource introuvable',
          message: 'La ressource demandée n\'existe pas.',
          actionable: 'Vérifiez l\'URL ou contactez le support.',
          canRetry: false,
          severity: 'warning',
        };

      case 429:
        return {
          title: 'Trop de tentatives',
          message: 'Vous avez effectué trop de requêtes.',
          actionable: 'Veuillez patienter quelques instants avant de réessayer.',
          canRetry: true,
          severity: 'warning',
        };

      case 503:
        return {
          title: 'Service indisponible',
          message: 'Le service est temporairement indisponible.',
          actionable: 'Veuillez réessayer dans quelques instants.',
          canRetry: true,
          severity: 'error',
        };

      default:
        return {
          title: 'Erreur',
          message: error.message || 'Une erreur est survenue.',
          actionable: 'Veuillez réessayer ou contactez le support.',
          canRetry: true,
          severity: 'error',
        };
    }
  }

  /**
   * Get a simple error message for toasts
   */
  static getSimpleMessage(error: unknown): string {
    const friendly = this.toUserFriendly(error);
    return `${friendly.title}: ${friendly.message}`;
  }

  /**
   * Get actionable advice for the user
   */
  static getActionableAdvice(error: unknown): string {
    const friendly = this.toUserFriendly(error);
    return friendly.actionable;
  }

  /**
   * Check if error is retryable
   */
  static canRetry(error: unknown): boolean {
    const friendly = this.toUserFriendly(error);
    return friendly.canRetry;
  }
}

export default ErrorHandler;
