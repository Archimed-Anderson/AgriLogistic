import { apiClient } from './api-client';
import { AuthProvider } from '../../adapters/auth-provider.interface';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { RegisterRequestDTO } from '../../../application/dto/request/register-request.dto';
import { RegisterResponseDTO } from '../../../application/dto/response/register-response.dto';

interface AuthResponse {
  success: boolean;
  token?: string;
  access_token?: string;
  accessToken?: string;
  refresh_token?: string;
  refreshToken?: string;
  user?: any;
  expiresIn?: number;
  expires_in?: number;
}

function splitName(fullName: string | undefined): { firstName: string; lastName: string } {
  const cleaned = (fullName || '').trim();
  if (!cleaned) return { firstName: 'User', lastName: '' };
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function coerceRole(role: string | undefined): UserRole {
  const r = (role || '').toLowerCase();
  if (r === UserRole.ADMIN) return UserRole.ADMIN;
  if (r === UserRole.FARMER) return UserRole.FARMER;
  if (r === UserRole.BUYER) return UserRole.BUYER;
  if (r === UserRole.TRANSPORTER) return UserRole.TRANSPORTER;
  // Auth-service currently issues a generic "user" role. Map it to BUYER by default.
  return UserRole.BUYER;
}

/**
 * Real Authentication Adapter - Uses backend API for authentication
 */
export class RealAuthAdapter implements AuthProvider {
  readonly name = 'real-auth-api';

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // New auth-service: /api/v1/auth/login
    // Request: {email,password} (plain password; server hashes with bcrypt)
    // Response: {access_token, refresh_token, expires_in}
    const response = await apiClient.post<any>('/auth/login', {
      email,
      password,
    });

    const accessToken: string | undefined =
      response?.access_token || response?.accessToken || response?.token;
    if (!accessToken) {
      // Legacy API had a `success` boolean; keep a readable error in both cases.
      throw new Error(response?.message || 'Login failed');
    }

    localStorage.setItem('accessToken', accessToken);

    const newRefreshToken: string | undefined = response?.refresh_token || response?.refreshToken;
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }

    // Auth-service returns token-only on login; get profile via /api/v1/auth/me
    let userPayload: any = await apiClient.get<any>('/auth/me');
    userPayload = userPayload && 'user' in userPayload ? userPayload.user : userPayload;
    if (!userPayload) {
      throw new Error('Login succeeded but user profile could not be loaded');
    }

    const derived =
      userPayload?.firstName && userPayload?.lastName
        ? { firstName: userPayload.firstName, lastName: userPayload.lastName }
        : splitName(
            userPayload?.fullName ||
              userPayload?.full_name ||
              userPayload?.username ||
              userPayload?.email
          );

    const user = User.create({
      firstName: derived.firstName,
      lastName: derived.lastName,
      email: new Email(userPayload.email || email),
      role: coerceRole(userPayload.role),
      avatarUrl: userPayload.avatarUrl,
    });

    Object.defineProperty(user, 'id', {
      value: userPayload.id,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    return { user, token: accessToken };
  }

  async register(request: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const fullName = `${request.firstName ?? ''} ${request.lastName ?? ''}`.trim();
    const username = (request.email || '').split('@')[0] || undefined;

    // New auth-service: /api/v1/auth/register
    // Note: verify-first UX; no token returned.
    const response = await apiClient.post<any>('/auth/register', {
      email: request.email,
      password: request.password, // plain password
      full_name: fullName || undefined,
      username,
    });

    return {
      email: request.email,
      userId: response?.user_id || response?.userId || '',
      message: response?.message || 'Verification email sent',
      verificationToken: response?.verification_token || response?.verificationToken,
    };
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
      const response = await apiClient.get<any>('/auth/me');
      if (!response) return null;

      const userPayload = 'user' in response ? response.user : response;
      if (!userPayload) return null;

      const user = User.create({
        firstName: splitName(
          userPayload.full_name || userPayload.fullName || userPayload.username || userPayload.email
        ).firstName,
        lastName: splitName(
          userPayload.full_name || userPayload.fullName || userPayload.username || userPayload.email
        ).lastName,
        email: new Email(userPayload.email),
        role: coerceRole(userPayload.role),
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
      const response = await apiClient.get<any>(`/auth/verify-email/${encodeURIComponent(token)}`);
      return Boolean(response?.verified);
    } catch (error) {
      console.error('Email verification failed:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await apiClient.post('/auth/password-reset/request', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/password-reset/confirm', {
      token,
      new_password: newPassword,
    });
  }

  async isConfigured(): Promise<boolean> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000'}/health`
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default RealAuthAdapter;
