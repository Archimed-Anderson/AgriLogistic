import { RegisterRequestDTO } from '../../application/dto/request/register-request.dto';
import { RegisterResponseDTO } from '../../application/dto/response/register-response.dto';
import { User } from '../../domain/entities/user.entity';

/**
 * Auth Provider Interface
 *
 * This interface defines the contract that all authentication providers must implement.
 * It enables the application to switch between different authentication backends
 * (Supabase, Firebase, custom backend, etc.) without changing business logic.
 */
export interface AuthProvider {
  /**
   * Provider name for identification
   */
  readonly name: string;

  /**
   * Authenticate a user with email and password
   */
  login(email: string, password: string): Promise<{ user: User; token: string }>;

  /**
   * Register a new user with complete profile data
   */
  register(request: RegisterRequestDTO): Promise<RegisterResponseDTO>;

  /**
   * Log out the current user
   */
  logout(): Promise<void>;

  /**
   * Get the currently authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Verify user's email address
   */
  verifyEmail(token: string): Promise<boolean>;

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Promise<void>;

  /**
   * Check if the provider is available and properly configured
   */
  isConfigured(): Promise<boolean>;
}
