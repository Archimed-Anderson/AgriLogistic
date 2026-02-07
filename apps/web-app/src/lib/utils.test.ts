import { describe, it, expect } from 'vitest';

/**
 * Utility functions for formatting data
 */

export function formatCurrency(amount: number, currency: string = 'XOF'): string {
  if (currency === 'XOF') {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  }
  return `${amount} ${currency}`;
}

export function formatDate(date: Date, locale: string = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} tonnes`;
  }
  return `${kg} kg`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================
// TESTS
// ============================================

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('formats XOF currency correctly', () => {
      expect(formatCurrency(1000, 'XOF')).toBe('1\u202f000 FCFA');
    });

    it('formats large amounts with proper spacing', () => {
      expect(formatCurrency(1000000, 'XOF')).toBe('1\u202f000\u202f000 FCFA');
    });

    it('handles zero values', () => {
      expect(formatCurrency(0, 'XOF')).toBe('0 FCFA');
    });

    it('handles negative values', () => {
      expect(formatCurrency(-500, 'XOF')).toBe('-500 FCFA');
    });

    it('uses XOF as default currency', () => {
      expect(formatCurrency(1000)).toBe('1\u202f000 FCFA');
    });
  });

  describe('formatDate', () => {
    it('formats date in French locale', () => {
      const date = new Date('2026-02-07');
      expect(formatDate(date)).toBe('7 février 2026');
    });

    it('handles different months', () => {
      const date = new Date('2026-12-25');
      expect(formatDate(date)).toBe('25 décembre 2026');
    });
  });

  describe('formatWeight', () => {
    it('converts kg to tons when >= 1000kg', () => {
      expect(formatWeight(2500)).toBe('2.5 tonnes');
    });

    it('keeps kg for values < 1000kg', () => {
      expect(formatWeight(500)).toBe('500 kg');
    });

    it('handles exactly 1000kg', () => {
      expect(formatWeight(1000)).toBe('1.0 tonnes');
    });

    it('handles zero weight', () => {
      expect(formatWeight(0)).toBe('0 kg');
    });
  });
});

describe('Validators', () => {
  describe('validateEmail', () => {
    it('accepts valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user @example.com')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('accepts strong passwords', () => {
      const result = validatePassword('SecurePass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects password shorter than 8 characters', () => {
      const result = validatePassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins 8 caractères');
    });

    it('rejects password without uppercase', () => {
      const result = validatePassword('lowercase123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins une majuscule');
    });

    it('rejects password without lowercase', () => {
      const result = validatePassword('UPPERCASE123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins une minuscule');
    });

    it('rejects password without numbers', () => {
      const result = validatePassword('NoNumbers!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le mot de passe doit contenir au moins un chiffre');
    });

    it('rejects password without special characters', () => {
      const result = validatePassword('NoSpecial123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)'
      );
    });

    it('returns multiple errors for weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});
