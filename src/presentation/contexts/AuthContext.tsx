import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthProvider } from '../../infrastructure/adapters/auth-provider.interface';
import { AuthProviderFactory } from '../../infrastructure/adapters/auth-provider.factory';
import { User } from '../../domain/entities/user.entity';
import { LoginRequestDTO } from '../../application/dto/request/login-request.dto';
import { RegisterRequestDTO } from '../../application/dto/request/register-request.dto';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequestDTO) => Promise<{ user: User; token: string }>;
  register: (data: RegisterRequestDTO) => Promise<{ user: User; token: string }>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  authProvider?: AuthProvider;
}

export function AuthProviderComponent({ children, authProvider }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const provider = authProvider || AuthProviderFactory.configureFromEnv();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          setToken(storedToken);
          const currentUser = await provider.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [provider]);

  const login = async (credentials: LoginRequestDTO): Promise<{ user: User; token: string }> => {
    setIsLoading(true);
    try {
      const result = await provider.login(credentials.email, credentials.password);
      setUser(result.user);
      setToken(result.token);
      return result;
    } catch (error) {
      setUser(null);
      setToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequestDTO): Promise<{ user: User; token: string }> => {
    setIsLoading(true);
    try {
      const result = await provider.register(data);
      setUser(result.user);
      setToken(result.token);
      return result;
    } catch (error) {
      setUser(null);
      setToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await provider.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoading(false);
      window.location.href = '/';
    }
  };

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const currentUser = await provider.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        return currentUser;
      }
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const currentUser = await provider.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          setToken(storedToken);
        }
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    getCurrentUser,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
