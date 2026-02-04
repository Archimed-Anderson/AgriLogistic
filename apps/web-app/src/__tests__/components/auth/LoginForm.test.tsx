/**
 * Tests unitaires et d'intégration pour le composant LoginForm
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthProvider } from '@/lib/hooks/use-auth';
import * as authApi from '@/lib/api/auth';

// Mock du module API
jest.mock('@/lib/api/auth', () => ({
  login: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  storeTokens: jest.fn(),
  clearTokens: jest.fn(),
  isAuthenticated: jest.fn(() => false),
  getAccessToken: jest.fn(() => null),
  getRefreshToken: jest.fn(() => null),
}));

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Wrapper pour fournir le contexte Auth
const LoginFormWrapper = () => (
  <AuthProvider>
    <LoginForm />
  </AuthProvider>
);

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendu du formulaire', () => {
    it('devrait afficher tous les champs du formulaire', () => {
      render(<LoginFormWrapper />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
      expect(screen.getByText(/mot de passe oublié/i)).toBeInTheDocument();
    });

    it('devrait avoir les attributs ARIA appropriés', () => {
      render(<LoginFormWrapper />);

      const form = screen.getByRole('form', { name: /formulaire de connexion/i });
      expect(form).toHaveAttribute('aria-label', 'Formulaire de connexion');
      expect(form).toHaveAttribute('noValidate');
    });
  });

  describe('Validation des champs', () => {
    it("devrait afficher une erreur si l'email est invalide", async () => {
      const user = userEvent.setup();
      render(<LoginFormWrapper />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'email-invalide');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/format d'email invalide/i)).toBeInTheDocument();
      });
    });

    it("devrait afficher une erreur si l'email est vide", async () => {
      const user = userEvent.setup();
      render(<LoginFormWrapper />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.click(emailInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
      });
    });

    it('devrait afficher une erreur si le mot de passe est trop court', async () => {
      const user = userEvent.setup();
      render(<LoginFormWrapper />);

      const passwordInput = screen.getByLabelText(/mot de passe/i);
      await user.type(passwordInput, '123');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/le mot de passe doit contenir au moins 6 caractères/i)
        ).toBeInTheDocument();
      });
    });

    it('devrait afficher une erreur si le mot de passe est vide', async () => {
      const user = userEvent.setup();
      render(<LoginFormWrapper />);

      const passwordInput = screen.getByLabelText(/mot de passe/i);
      await user.click(passwordInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/le mot de passe est requis/i)).toBeInTheDocument();
      });
    });
  });

  describe('Soumission du formulaire', () => {
    it('devrait appeler la fonction login avec les bonnes données', async () => {
      const user = userEvent.setup();
      const mockLogin = jest.mocked(authApi.login);
      mockLogin.mockResolvedValue({
        accessToken: 'token',
        refreshToken: 'refresh',
        user: {
          id: '1',
          email: 'test@example.com',
          role: 'user',
        },
      });

      render(<LoginFormWrapper />);

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123');
      await user.click(screen.getByRole('button', { name: /se connecter/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('devrait afficher un indicateur de chargement pendant la soumission', async () => {
      const user = userEvent.setup();
      const mockLogin = jest.mocked(authApi.login);
      mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(<LoginFormWrapper />);

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123');
      await user.click(screen.getByRole('button', { name: /se connecter/i }));

      expect(screen.getByText(/connexion\.\.\./i)).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Gestion des erreurs API', () => {
    it("devrait afficher un message d'erreur pour une erreur 401", async () => {
      const user = userEvent.setup();
      const mockLogin = jest.mocked(authApi.login);
      const error = new Error('Unauthorized');
      error.name = 'AuthApiError';
      (error as any).statusCode = 401;
      (error as any).error = 'Invalid credentials';
      mockLogin.mockRejectedValue(error);

      render(<LoginFormWrapper />);

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/mot de passe/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /se connecter/i }));

      await waitFor(() => {
        expect(screen.getByText(/email ou mot de passe incorrect/i)).toBeInTheDocument();
      });
    });

    it("devrait afficher un message d'erreur pour une erreur 429 (rate limiting)", async () => {
      const user = userEvent.setup();
      const mockLogin = jest.mocked(authApi.login);
      const error = new Error('Too Many Requests');
      error.name = 'AuthApiError';
      (error as any).statusCode = 429;
      (error as any).error = 'Rate limit exceeded';
      mockLogin.mockRejectedValue(error);

      render(<LoginFormWrapper />);

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/mot de passe/i), 'password123');
      await user.click(screen.getByRole('button', { name: /se connecter/i }));

      await waitFor(() => {
        expect(screen.getByText(/trop de tentatives/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibilité', () => {
    it('devrait être navigable au clavier', async () => {
      const user = userEvent.setup();
      render(<LoginFormWrapper />);

      // Tab navigation
      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/mot de passe/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByText(/mot de passe oublié/i)).toHaveFocus();
    });

    it('devrait avoir des labels ARIA appropriés', () => {
      render(<LoginFormWrapper />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('aria-invalid', 'false');

      const passwordInput = screen.getByLabelText(/mot de passe/i);
      expect(passwordInput).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('Mot de passe oublié', () => {
    it('devrait ouvrir le dialog de mot de passe oublié', async () => {
      const user = userEvent.setup();
      render(<LoginFormWrapper />);

      const forgotPasswordLink = screen.getByText(/mot de passe oublié/i);
      await user.click(forgotPasswordLink);

      await waitFor(() => {
        expect(screen.getByText(/mot de passe oublié/i)).toBeInTheDocument();
        expect(screen.getByText(/entrez votre adresse email/i)).toBeInTheDocument();
      });
    });
  });
});
