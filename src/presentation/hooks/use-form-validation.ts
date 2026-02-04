import { useState, useCallback } from 'react';
import { AUTH_MESSAGES } from '../utils/auth-messages';

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormData {
  [key: string]: string;
}

/**
 * Regex pour validation email RFC 5322 simplifié
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Regex pour validation nom/prénom (lettres, espaces, tirets, apostrophes)
 */
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/;

/**
 * Valide un email
 */
function validateEmail(email: string): string | null {
  if (!email || email.trim() === '') {
    return AUTH_MESSAGES.EMAIL_REQUIRED;
  }
  if (!EMAIL_REGEX.test(email)) {
    return AUTH_MESSAGES.EMAIL_INVALID;
  }
  return null;
}

/**
 * Valide un mot de passe
 */
function validatePassword(password: string, isRegister: boolean = false): string | null {
  if (!password || password.trim() === '') {
    return AUTH_MESSAGES.PASSWORD_REQUIRED;
  }

  if (isRegister) {
    if (password.length < 8) {
      return AUTH_MESSAGES.PASSWORD_TOO_SHORT;
    }
    if (!/[a-z]/.test(password)) {
      return AUTH_MESSAGES.PASSWORD_NO_LOWERCASE;
    }
    if (!/[A-Z]/.test(password)) {
      return AUTH_MESSAGES.PASSWORD_NO_UPPERCASE;
    }
    if (!/[0-9]/.test(password)) {
      return AUTH_MESSAGES.PASSWORD_NO_NUMBER;
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return AUTH_MESSAGES.PASSWORD_NO_SPECIAL;
    }
  }

  return null;
}

/**
 * Valide un nom ou prénom
 */
function validateName(name: string, fieldName: 'firstName' | 'lastName'): string | null {
  if (!name || name.trim() === '') {
    return fieldName === 'firstName'
      ? AUTH_MESSAGES.FIRSTNAME_REQUIRED
      : AUTH_MESSAGES.LASTNAME_REQUIRED;
  }

  if (name.trim().length < 2) {
    return fieldName === 'firstName'
      ? AUTH_MESSAGES.FIRSTNAME_TOO_SHORT
      : AUTH_MESSAGES.LASTNAME_TOO_SHORT;
  }

  if (!NAME_REGEX.test(name.trim())) {
    return fieldName === 'firstName'
      ? AUTH_MESSAGES.FIRSTNAME_INVALID
      : AUTH_MESSAGES.LASTNAME_INVALID;
  }

  return null;
}

/**
 * Valide la confirmation du mot de passe
 */
function validatePasswordConfirmation(password: string, confirmPassword: string): string | null {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return AUTH_MESSAGES.PASSWORD_REQUIRED;
  }

  if (password !== confirmPassword) {
    return AUTH_MESSAGES.PASSWORD_MISMATCH;
  }

  return null;
}

/**
 * Hook pour la validation de formulaire en temps réel
 */
export function useFormValidation(isRegister: boolean = false) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  /**
   * Valide un champ spécifique
   */
  const validateField = useCallback(
    (name: string, value: string): boolean => {
      let error: string | null = null;

      switch (name) {
        case 'email':
          error = validateEmail(value);
          break;
        case 'password':
          error = validatePassword(value, isRegister);
          break;
        case 'confirmPassword': {
          // Nécessite aussi le password pour validation
          const password =
            (document.querySelector('[name="password"]') as HTMLInputElement)?.value || '';
          error = validatePasswordConfirmation(password, value);
          break;
        }
        case 'firstName':
          error = validateName(value, 'firstName');
          break;
        case 'lastName':
          error = validateName(value, 'lastName');
          break;
        default:
          if (!value || value.trim() === '') {
            error = AUTH_MESSAGES.FIELD_REQUIRED;
          }
      }

      setErrors((prev) => {
        if (error) {
          return { ...prev, [name]: error };
        } else {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        }
      });

      return error === null;
    },
    [isRegister]
  );

  /**
   * Valide tous les champs d'un formulaire
   */
  const validateAll = useCallback(
    (data: FormData): boolean => {
      const newErrors: ValidationErrors = {};
      let isValid = true;

      // Validation email
      const emailError = validateEmail(data.email || '');
      if (emailError) {
        newErrors.email = emailError;
        isValid = false;
      }

      // Validation mot de passe
      const passwordError = validatePassword(data.password || '', isRegister);
      if (passwordError) {
        newErrors.password = passwordError;
        isValid = false;
      }

      // Validation spécifique à l'inscription
      if (isRegister) {
        // Confirmation mot de passe
        const confirmPasswordError = validatePasswordConfirmation(
          data.password || '',
          data.confirmPassword || ''
        );
        if (confirmPasswordError) {
          newErrors.confirmPassword = confirmPasswordError;
          isValid = false;
        }

        // Prénom
        const firstNameError = validateName(data.firstName || '', 'firstName');
        if (firstNameError) {
          newErrors.firstName = firstNameError;
          isValid = false;
        }

        // Nom
        const lastNameError = validateName(data.lastName || '', 'lastName');
        if (lastNameError) {
          newErrors.lastName = lastNameError;
          isValid = false;
        }
      }

      setErrors(newErrors);
      return isValid;
    },
    [isRegister]
  );

  /**
   * Efface toutes les erreurs
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Efface l'erreur d'un champ spécifique
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    validateField,
    validateAll,
    clearErrors,
    clearFieldError,
  };
}
