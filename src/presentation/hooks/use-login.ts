import { useState } from 'react';
import { LoginRequestDTO } from '../../application/dto/request/login-request.dto';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { ErrorHandler } from '../utils/error-handler';
import { APIError } from '../../infrastructure/api/rest/api-client-enhanced';

export function useLogin() {
  const { login: authLogin, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequestDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authLogin(credentials);
      setIsLoading(false);
      toast.success(`Bienvenue, ${response.user.firstName} !`);
      return response;
    } catch (err) {
      setIsLoading(false);
      
      // Use enhanced error handler
      const friendlyError = ErrorHandler.toUserFriendly(err);
      setError(friendlyError.message);
      
      // Show error toast with actionable advice
      toast.error(friendlyError.title, {
        description: `${friendlyError.message}\n${friendlyError.actionable}`,
        duration: 5000,
        action: friendlyError.canRetry ? {
          label: 'Réessayer',
          onClick: () => login(credentials),
        } : undefined,
      });
      
      throw err;
    }
  };

  return {
    login,
    isLoading: isLoading || authLoading,
    error,
  };
}
