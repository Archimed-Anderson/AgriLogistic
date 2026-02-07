/**
 * 🌌 HYPER-SPEED DATA LINK - Global Error Boundary
 * 
 * Objectif: Attraper les erreurs de rendering React et afficher une UI de secours
 * 
 * Fonctionnalités:
 * - Capture des erreurs de rendering
 * - UI de secours professionnelle
 * - Logging des erreurs
 * - Bouton de retry
 * - Compatible Next.js App Router et Pages Router
 */

'use client'; // Pour Next.js App Router

import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props du Error Boundary
 */
export interface ErrorBoundaryProps {
  /**
   * Composants enfants
   */
  children: ReactNode;

  /**
   * UI de secours personnalisée
   */
  fallback?: (error: Error, reset: () => void) => ReactNode;

  /**
   * Callback appelé lors d'une erreur
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /**
   * Activer les logs de debug
   */
  debug?: boolean;
}

/**
 * State du Error Boundary
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global Error Boundary Component
 */
export class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Méthode statique appelée lors d'une erreur
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Méthode appelée après la capture d'une erreur
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Logger l'erreur
    if (this.props.debug) {
      console.error('🚨 Error Boundary caught an error:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }

    // Appeler le callback personnalisé
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Mettre à jour le state
    this.setState({
      errorInfo,
    });

    // Logger vers un service externe (Sentry, LogRocket, etc.)
    this.logErrorToService(error, errorInfo);
  }

  /**
   * Logger l'erreur vers un service externe
   */
  private logErrorToService(error: Error, errorInfo: ErrorInfo): void {
    // TODO: Intégrer avec Sentry, LogRocket, ou autre service
    // Exemple avec Sentry:
    // Sentry.captureException(error, {
    //   contexts: {
    //     react: {
    //       componentStack: errorInfo.componentStack,
    //     },
    //   },
    // });

    if (typeof window !== 'undefined') {
      // Logger dans la console du navigateur
      console.group('🚨 Error Boundary - Error Details');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('User Agent:', navigator.userAgent);
      console.error('URL:', window.location.href);
      console.error('Timestamp:', new Date().toISOString());
      console.groupEnd();
    }
  }

  /**
   * Réinitialiser l'état (retry)
   */
  private resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Si une UI de secours personnalisée est fournie
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // UI de secours par défaut
      return <DefaultErrorFallback error={this.state.error} reset={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * UI de secours par défaut
 */
interface DefaultErrorFallbackProps {
  error: Error;
  reset: () => void;
}

function DefaultErrorFallback({ error, reset }: DefaultErrorFallbackProps): JSX.Element {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#f9fafb',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 2rem',
            backgroundColor: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1rem',
          }}
        >
          Oups ! Une erreur s'est produite
        </h1>

        {/* Message */}
        <p
          style={{
            fontSize: '1rem',
            color: '#6b7280',
            marginBottom: '2rem',
            lineHeight: '1.6',
          }}
        >
          Nous sommes désolés, mais quelque chose s'est mal passé. Notre équipe a été notifiée et
          travaille sur le problème.
        </p>

        {/* Error details (dev mode) */}
        {process.env.NODE_ENV === 'development' && (
          <details
            style={{
              marginBottom: '2rem',
              textAlign: 'left',
              backgroundColor: '#f3f4f6',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              Détails de l'erreur (dev mode)
            </summary>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: '#dc2626',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
              }}
            >
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
          >
            🔄 Réessayer
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b5563')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6b7280')}
          >
            🏠 Retour à l'accueil
          </button>
        </div>

        {/* Support link */}
        <p
          style={{
            marginTop: '2rem',
            fontSize: '0.875rem',
            color: '#9ca3af',
          }}
        >
          Si le problème persiste,{' '}
          <a
            href="mailto:support@agrodeep.com"
            style={{
              color: '#10b981',
              textDecoration: 'underline',
            }}
          >
            contactez notre support
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * Hook pour utiliser l'Error Boundary de manière programmatique
 */
export function useErrorHandler(): (error: Error) => void {
  const [, setError] = React.useState<Error>();

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
}
