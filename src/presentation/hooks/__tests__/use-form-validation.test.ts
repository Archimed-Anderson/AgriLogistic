import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../use-form-validation';
import { AUTH_MESSAGES } from '../../utils/auth-messages';

describe('useFormValidation', () => {
  describe('Login mode (isRegister = false)', () => {
    it('should validate email correctly', () => {
      const { result } = renderHook(() => useFormValidation(false));

      act(() => {
        result.current.validateField('email', 'invalid-email');
      });

      expect(result.current.errors.email).toBe(AUTH_MESSAGES.EMAIL_INVALID);
      expect(result.current.isValid).toBe(false);
    });

    it('should accept valid email', () => {
      const { result } = renderHook(() => useFormValidation(false));

      act(() => {
        result.current.validateField('email', 'test@example.com');
      });

      expect(result.current.errors.email).toBeUndefined();
    });

    it('should validate password is required', () => {
      const { result } = renderHook(() => useFormValidation(false));

      act(() => {
        result.current.validateField('password', '');
      });

      expect(result.current.errors.password).toBe(AUTH_MESSAGES.PASSWORD_REQUIRED);
    });

    it('should accept non-empty password for login', () => {
      const { result } = renderHook(() => useFormValidation(false));

      act(() => {
        result.current.validateField('password', 'anypassword');
      });

      expect(result.current.errors.password).toBeUndefined();
    });
  });

  describe('Register mode (isRegister = true)', () => {
    it('should validate password strength', () => {
      const { result } = renderHook(() => useFormValidation(true));

      act(() => {
        result.current.validateField('password', 'short');
      });

      expect(result.current.errors.password).toBe(AUTH_MESSAGES.PASSWORD_TOO_SHORT);
    });

    it('should validate password has lowercase', () => {
      const { result } = renderHook(() => useFormValidation(true));

      act(() => {
        result.current.validateField('password', 'PASSWORD123!');
      });

      expect(result.current.errors.password).toBe(AUTH_MESSAGES.PASSWORD_NO_LOWERCASE);
    });

    it('should validate password has uppercase', () => {
      const { result } = renderHook(() => useFormValidation(true));

      act(() => {
        result.current.validateField('password', 'password123!');
      });

      expect(result.current.errors.password).toBe(AUTH_MESSAGES.PASSWORD_NO_UPPERCASE);
    });

    it('should validate password has number', () => {
      const { result } = renderHook(() => useFormValidation(true));

      act(() => {
        result.current.validateField('password', 'Password!');
      });

      expect(result.current.errors.password).toBe(AUTH_MESSAGES.PASSWORD_NO_NUMBER);
    });

    it('should validate password has special character', () => {
      const { result } = renderHook(() => useFormValidation(true));

      act(() => {
        result.current.validateField('password', 'Password123');
      });

      expect(result.current.errors.password).toBe(AUTH_MESSAGES.PASSWORD_NO_SPECIAL);
    });

    it('should accept strong password', () => {
      const { result } = renderHook(() => useFormValidation(true));

      act(() => {
        result.current.validateField('password', 'Password123!');
      });

      expect(result.current.errors.password).toBeUndefined();
    });

    it('should validate firstName', () => {
      const { result } = renderHook(() => useFormValidation(true));

      act(() => {
        result.current.validateField('firstName', '');
      });

      expect(result.current.errors.firstName).toBe(AUTH_MESSAGES.FIRSTNAME_REQUIRED);
    });

    it('should validate lastName', () => {
      const { result } = renderHook(() => useFormValidation(true));

      act(() => {
        result.current.validateField('lastName', '');
      });

      expect(result.current.errors.lastName).toBe(AUTH_MESSAGES.LASTNAME_REQUIRED);
    });

    it('should validate confirmPassword matches', () => {
      const { result } = renderHook(() => useFormValidation(true));

      // Simuler que password existe dans le DOM
      const passwordInput = document.createElement('input');
      passwordInput.name = 'password';
      passwordInput.value = 'Password123!';
      document.body.appendChild(passwordInput);

      act(() => {
        result.current.validateField('confirmPassword', 'Different123!');
      });

      expect(result.current.errors.confirmPassword).toBe(AUTH_MESSAGES.PASSWORD_MISMATCH);

      document.body.removeChild(passwordInput);
    });
  });

  describe('validateAll', () => {
    it('should validate all fields for login', () => {
      const { result } = renderHook(() => useFormValidation(false));

      act(() => {
        const isValid = result.current.validateAll({
          email: '',
          password: '',
        });
        expect(isValid).toBe(false);
      });

      expect(result.current.errors.email).toBeDefined();
      expect(result.current.errors.password).toBeDefined();
    });

    it('should validate all fields for register', () => {
      const { result } = renderHook(() => useFormValidation(true));

      act(() => {
        const isValid = result.current.validateAll({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        expect(isValid).toBe(false);
      });

      expect(result.current.errors.firstName).toBeDefined();
      expect(result.current.errors.lastName).toBeDefined();
      expect(result.current.errors.email).toBeDefined();
      expect(result.current.errors.password).toBeDefined();
    });

    it('should return true for valid form', () => {
      const { result } = renderHook(() => useFormValidation(false));

      act(() => {
        const isValid = result.current.validateAll({
          email: 'test@example.com',
          password: 'password123',
        });
        expect(isValid).toBe(true);
      });

      expect(result.current.isValid).toBe(true);
    });
  });

  describe('clearErrors', () => {
    it('should clear all errors', () => {
      const { result } = renderHook(() => useFormValidation(false));

      act(() => {
        result.current.validateField('email', 'invalid');
      });

      expect(result.current.errors.email).toBeDefined();

      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.errors).toEqual({});
      expect(result.current.isValid).toBe(true);
    });
  });
});
