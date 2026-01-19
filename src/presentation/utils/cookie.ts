/**
 * Utilitaires pour la gestion sécurisée des cookies
 */

interface CookieOptions {
  maxAge?: number; // en jours
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
}

/**
 * Définit un cookie sécurisé
 */
export function setSecureCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  const {
    maxAge = 30, // 30 jours par défaut
    secure = true,
    sameSite = 'strict',
    path = '/',
  } = options;

  const expires = new Date();
  expires.setTime(expires.getTime() + maxAge * 24 * 60 * 60 * 1000);

  const cookieValue = encodeURIComponent(value);
  let cookieString = `${name}=${cookieValue}; expires=${expires.toUTCString()}; path=${path}; SameSite=${sameSite}`;

  if (secure && window.location.protocol === 'https:') {
    cookieString += '; Secure';
  }

  document.cookie = cookieString;
}

/**
 * Récupère la valeur d'un cookie
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
}

/**
 * Supprime un cookie
 */
export function deleteCookie(name: string, path: string = '/'): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=strict`;
}

/**
 * Vérifie si un cookie existe
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}
