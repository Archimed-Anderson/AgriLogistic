import { apiClient } from './api-client';
import { AuthProvider } from '../../adapters/auth-provider.interface';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { RegisterRequestDTO } from '../../../application/dto/request/register-request.dto';

interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatarUrl?: string;
    permissions?: string[];
  };
  expiresIn?: number;
  refreshToken?: string;
}

/**
 * Real Authentication Adapter - Uses backend API for authentication
 */
export class RealAuthAdapter implements AuthProvider {
  readonly name = 'real-auth-api';

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    if (!response.success) {
      throw new Error('Login failed');
    }

    const accessToken = response.token;
    localStorage.setItem('accessToken', accessToken);

    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    const user = User.create({
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      email: new Email(response.user.email),
      role: response.user.role as any,
      avatarUrl: response.user.avatarUrl,
    });

    Object.defineProperty(user, 'id', {
      value: response.user.id,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    return { user, token: accessToken };
  }

  async register(request: RegisterRequestDTO): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      email: request.email,
      password: request.password,
      firstName: request.firstName,
      lastName: request.lastName,
      role: request.accountType,
      phone: request.phone,
      businessType: request.businessType,
      farmSize: request.farmSize,
      farmerSpecialization: request.farmerSpecialization,
      logisticsSpecialization: request.logisticsSpecialization,
      defaultShippingAddress: request.defaultShippingAddress,
      newsletterSubscribed: request.newsletterSubscribed,
    });

    if (!response.success) {
      throw new Error('Registration failed');
    }

    const accessToken = response.token;
    localStorage.setItem('accessToken', accessToken);

    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    const user = User.create({
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      email: new Email(response.user.email),
      role: response.user.role as any,
      avatarUrl: response.user.avatarUrl,
    });

    Object.defineProperty(user, 'id', {
      value: response.user.id,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    return { user, token: accessToken };
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      return null;
    }

    try {
      const response = await apiClient.get<AuthResponse['user'] | { success: boolean; user: AuthResponse['user'] }>('/auth/me');
      const userPayload = 'user' in response ? response.user : response;

      const user = User.create({
        firstName: userPayload.firstName,
        lastName: userPayload.lastName,
        email: new Email(userPayload.email),
        role: userPayload.role as any,
        avatarUrl: userPayload.avatarUrl,
      });

      Object.defineProperty(user, 'id', {
        value: userPayload.id,
        writable: false,
        enumerable: true,
        configurable: false,
      });

      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      const response = await apiClient.post<{ success: boolean }>('/auth/verify-email', {
        token,
      });
      return response.success;
    } catch (error) {
      console.error('Email verification failed:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await apiClient.post('/auth/password-reset', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/password-reset/confirm', {
      token,
      newPassword,
    });
  }

  async isConfigured(): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000'}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default RealAuthAdapter;
