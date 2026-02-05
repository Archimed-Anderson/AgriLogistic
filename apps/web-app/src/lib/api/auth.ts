/**
 * Client API pour l'authentification
 * Gère les appels vers le service d'authentification backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Types pour les réponses API
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    name?: string;
  };
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// Classe d'erreur personnalisée pour les erreurs API
export class AuthApiError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message?: string
  ) {
    super(message || error);
    this.name = 'AuthApiError';
  }
}

import api from '@/lib/axios';

/**
 * Fonction helper pour faire des requêtes HTTP (Legacy replaced by axios)
 */
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toLowerCase();
  const response = await (api as any)[method](endpoint, options.body ? JSON.parse(options.body as string) : undefined);
  return response.data;
}

/**
 * Inscription d'un nouvel utilisateur
 */
export async function register(
  name: string,
  email: string,
  password: string,
  role: string
): Promise<LoginResponse> {
  return fetchApi<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
}

/**
 * Connexion avec email et mot de passe
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  return fetchApi<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Demande de réinitialisation de mot de passe
 */
export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  return fetchApi<ForgotPasswordResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Réinitialisation du mot de passe avec token
 */
export async function resetPassword(
  token: string,
  password: string
): Promise<ResetPasswordResponse> {
  return fetchApi<ResetPasswordResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

/**
 * Stockage des tokens et du rôle dans les cookies
 */
export function storeTokens(accessToken: string, refreshToken: string, role?: string): void {
  if (typeof window !== 'undefined') {
    // Expire dans 7 jours pour le refresh token, 1h pour l'access token
    document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; SameSite=Lax`;
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Lax`;

    if (role) {
      document.cookie = `userRole=${role}; path=/; max-age=604800; SameSite=Lax`;
    }

    // On garde localStorage pour compatibilité
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    if (role) localStorage.setItem('userRole', role);
  }
}

/**
 * Récupération du token d'accès
 */
export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
    if (match) return match[2];
    return localStorage.getItem('accessToken');
  }
  return null;
}

/**
 * Récupération du token de rafraîchissement
 */
export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )refreshToken=([^;]+)'));
    if (match) return match[2];
    return localStorage.getItem('refreshToken');
  }
  return null;
}

/**
 * Suppression des tokens (déconnexion)
 */
export function clearTokens(): void {
  if (typeof window !== 'undefined') {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
  }
}

/**
 * Vérification si l'utilisateur est authentifié
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
