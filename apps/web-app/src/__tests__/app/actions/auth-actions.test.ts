/**
 * Tests unitaires des Server Actions d'authentification (signUpEmail)
 *
 * - Inscription réussie (mock API success)
 * - Inscription doublon / erreur (mock API error)
 * - Normalisation des rôles (farmer → Farmer avant appel API)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signUpEmail } from '@/app/actions/auth-actions';

// Utilise le mock manuel src/__mocks__/auth.ts (évite de charger better-auth en tests)
vi.mock('@/auth');

async function getMockSignUpEmail() {
  const { auth } = await import('@/auth');
  return vi.mocked(auth.api.signUpEmail);
}

function buildFormData(overrides: Record<string, string> = {}): FormData {
  const defaults = {
    email: `test-${Date.now()}@agrilogistic.test`,
    password: 'Password123!',
    name: 'Test User',
    role: 'Farmer',
  };
  const data = { ...defaults, ...overrides };
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => form.append(k, v));
  return form;
}

describe('auth-actions (Server Actions)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('signUpEmail', () => {
    describe('Test 1 : Inscription Réussie (signUpEmail)', () => {
      it('retourne { success: true, user } quand l’API réussit', async () => {
        const mockSignUpEmail = getMockSignUpEmail();
        const formData = buildFormData({
          email: 'unique@agrilogistic.test',
          password: 'ValidPass123!',
          name: 'Jean Dupont',
          role: 'Farmer',
        });
        const mockUser = {
          id: 'user-1',
          email: 'unique@agrilogistic.test',
          name: 'Jean Dupont',
          role: 'Farmer',
        };
        mockSignUpEmail.mockResolvedValueOnce(mockUser);

        const result = await signUpEmail(formData);

        expect(result).toEqual({ success: true, user: mockUser });
        expect(mockSignUpEmail).toHaveBeenCalledTimes(1);
        expect(mockSignUpEmail).toHaveBeenCalledWith({
          body: {
            email: 'unique@agrilogistic.test',
            password: 'ValidPass123!',
            name: 'Jean Dupont',
            role: 'Farmer',
          },
          asResponse: false,
        });
      });
    });

    describe('Test 2 : Inscription Doublon (Erreur)', () => {
      it('retourne { success: false, error: "..." } sans planter quand l’email existe déjà', async () => {
        const mockSignUpEmail = getMockSignUpEmail();
        const formData = buildFormData({ email: 'existing@agrilogistic.test' });
        mockSignUpEmail.mockRejectedValueOnce(new Error('EMAIL_ALREADY_EXISTS'));

        const result = await signUpEmail(formData);

        expect(result).toEqual({
          success: false,
          error: 'Cet email est déjà utilisé.',
        });
        expect(mockSignUpEmail).toHaveBeenCalledTimes(1);
      });

      it('retourne le même message d’erreur pour "already exists"', async () => {
        const mockSignUpEmail = getMockSignUpEmail();
        const formData = buildFormData();
        mockSignUpEmail.mockRejectedValueOnce(new Error('User already exists'));

        const result = await signUpEmail(formData);

        expect(result.success).toBe(false);
        expect(result.error).toBe('Cet email est déjà utilisé.');
      });

      it('retourne le même message pour erreur "unique" / "duplicate"', async () => {
        const mockSignUpEmail = getMockSignUpEmail();
        const formData = buildFormData();
        mockSignUpEmail.mockRejectedValueOnce(new Error('unique constraint violated'));

        const result = await signUpEmail(formData);

        expect(result.success).toBe(false);
        expect(result.error).toBe('Cet email est déjà utilisé.');
      });
    });

    describe('Test 3 : Normalisation des Rôles', () => {
      it('normalise "farmer" (minuscule) en "Farmer" avant d’appeler l’API', async () => {
        const mockSignUpEmail = getMockSignUpEmail();
        const formData = buildFormData({ role: 'farmer' });
        mockSignUpEmail.mockResolvedValueOnce({ id: '1', email: 'a@b.test', role: 'Farmer' });

        await signUpEmail(formData);

        expect(mockSignUpEmail).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({
              role: 'Farmer',
            }),
          })
        );
      });

      it('normalise "buyer" en "Buyer"', async () => {
        const mockSignUpEmail = getMockSignUpEmail();
        const formData = buildFormData({ role: 'buyer' });
        mockSignUpEmail.mockResolvedValueOnce({ id: '1', email: 'a@b.test', role: 'Buyer' });

        await signUpEmail(formData);

        expect(mockSignUpEmail).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({ role: 'Buyer' }),
          })
        );
      });

      it('normalise "transporter" en "Transporter"', async () => {
        const mockSignUpEmail = getMockSignUpEmail();
        const formData = buildFormData({ role: 'transporter' });
        mockSignUpEmail.mockResolvedValueOnce({ id: '1', email: 'a@b.test', role: 'Transporter' });

        await signUpEmail(formData);

        expect(mockSignUpEmail).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({ role: 'Transporter' }),
          })
        );
      });

      it('normalise "admin" en "Admin"', async () => {
        const mockSignUpEmail = getMockSignUpEmail();
        const formData = buildFormData({ role: 'admin' });
        mockSignUpEmail.mockResolvedValueOnce({ id: '1', email: 'a@b.test', role: 'Admin' });

        await signUpEmail(formData);

        expect(mockSignUpEmail).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({ role: 'Admin' }),
          })
        );
      });
    });
  });
});
