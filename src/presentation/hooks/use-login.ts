import { useState } from 'react';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { MockAuthAdapter } from '../../infrastructure/adapters/mock-auth.adapter';
import { LoginRequestDTO } from '../../application/dto/request/login-request.dto';
import { toast } from 'sonner';

// In a real app, this would be injected via Context/Provider
const authAdapter = new MockAuthAdapter();
const loginUseCase = new LoginUseCase(authAdapter);

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequestDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUseCase.execute(credentials);
      toast.success(`Bienvenue, ${response.user.firstName} !`);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
}
