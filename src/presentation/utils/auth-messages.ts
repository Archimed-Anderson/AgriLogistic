/**
 * Messages d'erreur localisés pour l'authentification
 */

export const AUTH_MESSAGES = {
  // Validation email
  EMAIL_REQUIRED: "L'email est requis",
  EMAIL_INVALID: "Format d'email invalide",
  EMAIL_TAKEN: 'Cet email est déjà utilisé',

  // Validation mot de passe
  PASSWORD_REQUIRED: 'Le mot de passe est requis',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères',
  PASSWORD_WEAK: 'Le mot de passe est trop faible',
  PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas',
  PASSWORD_NO_UPPERCASE: 'Le mot de passe doit contenir au moins une majuscule',
  PASSWORD_NO_LOWERCASE: 'Le mot de passe doit contenir au moins une minuscule',
  PASSWORD_NO_NUMBER: 'Le mot de passe doit contenir au moins un chiffre',
  PASSWORD_NO_SPECIAL: 'Le mot de passe doit contenir au moins un caractère spécial',

  // Validation nom/prénom
  FIRSTNAME_REQUIRED: 'Le prénom est requis',
  FIRSTNAME_TOO_SHORT: 'Le prénom doit contenir au moins 2 caractères',
  FIRSTNAME_INVALID: 'Le prénom ne peut contenir que des lettres',

  LASTNAME_REQUIRED: 'Le nom est requis',
  LASTNAME_TOO_SHORT: 'Le nom doit contenir au moins 2 caractères',
  LASTNAME_INVALID: 'Le nom ne peut contenir que des lettres',

  // Connexion
  LOGIN_FAILED: 'Email ou mot de passe incorrect',
  LOGIN_REQUIRED: 'Veuillez vous connecter',
  TOO_MANY_ATTEMPTS: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.',
  ACCOUNT_LOCKED: 'Compte verrouillé temporairement',

  // Inscription
  REGISTRATION_FAILED: "Échec de l'inscription. Veuillez réessayer.",
  TERMS_REQUIRED: "Vous devez accepter les conditions d'utilisation",

  // Général
  FIELD_REQUIRED: 'Ce champ est requis',
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  UNKNOWN_ERROR: "Une erreur inattendue s'est produite",

  // CSRF
  CSRF_INVALID: 'Token de sécurité invalide. Veuillez rafraîchir la page.',

  // Succès
  LOGIN_SUCCESS: 'Connexion réussie',
  REGISTRATION_SUCCESS: 'Inscription réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
} as const;

/**
 * Obtient un message d'erreur à partir d'une erreur
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Mapping des erreurs communes
    if (message.includes('email') && message.includes('invalid')) {
      return AUTH_MESSAGES.EMAIL_INVALID;
    }
    if (
      message.includes('email') &&
      (message.includes('taken') || message.includes('already') || message.includes('exists'))
    ) {
      return AUTH_MESSAGES.EMAIL_TAKEN;
    }
    if (message.includes('password') && message.includes('weak')) {
      return AUTH_MESSAGES.PASSWORD_WEAK;
    }
    if (message.includes('too many') || message.includes('rate limit')) {
      return AUTH_MESSAGES.TOO_MANY_ATTEMPTS;
    }
    if (message.includes('no route matched') || message.includes('service unavailable')) {
      return "Le service d'authentification n'est pas disponible. Veuillez vérifier que le backend est démarré.";
    }
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('failed to fetch')
    ) {
      return AUTH_MESSAGES.NETWORK_ERROR;
    }
    if (message.includes('csrf') || message.includes('token')) {
      return AUTH_MESSAGES.CSRF_INVALID;
    }
    if (message.includes('timeout')) {
      return 'La connexion a pris trop de temps. Veuillez réessayer.';
    }

    return error.message || AUTH_MESSAGES.UNKNOWN_ERROR;
  }

  if (typeof error === 'string') {
    return error;
  }

  return AUTH_MESSAGES.UNKNOWN_ERROR;
}
