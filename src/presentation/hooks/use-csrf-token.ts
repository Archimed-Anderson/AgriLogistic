import { useEffect, useState, useCallback } from 'react';

const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 heures

/**
 * Génère un token CSRF aléatoire
 */
function generateCSRFToken(): string {
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);
  return Array.from(array, (val) => val.toString(16)).join('');
}

/**
 * Stocke le token CSRF dans sessionStorage
 */
function storeCSRFToken(token: string): void {
  try {
    const expiry = Date.now() + CSRF_TOKEN_EXPIRY;
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    sessionStorage.setItem(`${CSRF_TOKEN_KEY}_expiry`, expiry.toString());
  } catch (error) {
    console.error('Erreur lors du stockage du token CSRF:', error);
  }
}

/**
 * Récupère le token CSRF depuis sessionStorage
 */
function getCSRFToken(): string | null {
  try {
    const token = sessionStorage.getItem(CSRF_TOKEN_KEY);
    const expiryStr = sessionStorage.getItem(`${CSRF_TOKEN_KEY}_expiry`);

    if (!token || !expiryStr) {
      return null;
    }

    const expiry = parseInt(expiryStr, 10);
    if (Date.now() > expiry) {
      // Token expiré, le supprimer
      sessionStorage.removeItem(CSRF_TOKEN_KEY);
      sessionStorage.removeItem(`${CSRF_TOKEN_KEY}_expiry`);
      return null;
    }

    return token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token CSRF:', error);
    return null;
  }
}

/**
 * Hook pour gérer le token CSRF
 */
export function useCSRFToken() {
  const [token, setToken] = useState<string | null>(null);

  // Initialiser ou récupérer le token
  useEffect(() => {
    let csrfToken = getCSRFToken();

    if (!csrfToken) {
      csrfToken = generateCSRFToken();
      storeCSRFToken(csrfToken);
    }

    setToken(csrfToken);
  }, []);

  /**
   * Rafraîchit le token CSRF
   */
  const refreshToken = useCallback(() => {
    const newToken = generateCSRFToken();
    storeCSRFToken(newToken);
    setToken(newToken);
    return newToken;
  }, []);

  /**
   * Valide un token CSRF
   */
  const validateToken = useCallback(
    (tokenToValidate: string): boolean => {
      return token !== null && token === tokenToValidate;
    },
    [token]
  );

  /**
   * Supprime le token CSRF
   */
  const clearToken = useCallback(() => {
    try {
      sessionStorage.removeItem(CSRF_TOKEN_KEY);
      sessionStorage.removeItem(`${CSRF_TOKEN_KEY}_expiry`);
      setToken(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du token CSRF:', error);
    }
  }, []);

  return {
    token,
    refreshToken,
    validateToken,
    clearToken,
  };
}
