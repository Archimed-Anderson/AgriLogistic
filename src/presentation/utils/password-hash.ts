/**
 * Hachage de mot de passe côté client avec Web Crypto API
 * Note: Le backend re-hash avec bcrypt pour la sécurité finale
 */

/**
 * Génère un salt aléatoire
 */
async function generateSalt(): Promise<string> {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash un mot de passe avec SHA-256
 */
async function hashWithSHA256(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash un mot de passe côté client
 * Format: salt:hash (pour permettre au backend de vérifier)
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await generateSalt();
    const hash = await hashWithSHA256(password, salt);
    return `${salt}:${hash}`;
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe:', error);
    throw new Error('Impossible de hasher le mot de passe');
  }
}

/**
 * Vérifie si Web Crypto API est disponible
 */
export function isCryptoAvailable(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
}
