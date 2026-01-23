import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLogin } from '../use-login';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('../../contexts/AuthContext');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useLogin', () => {
  const mockLogin = vi.fn();
  const mockAuthContext = {
    login: mockLogin,
    isLoading: false,
    user: null,
    token: null,
    isAuthenticated: false,
    register: vi.fn(),
    verifyEmail: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    refreshToken: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue(mockAuthContext);
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.login).toBe('function');
  });

  it('should call auth.login with credentials', async () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: { value: 'john@example.com' },
      role: 'buyer',
    } as any;

    const mockResponse = {
      user: mockUser,
      token: 'mock-token',
    };

    mockLogin.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin());

    const credentials = {
      email: 'john@example.com',
      password: 'password123',
    };

    await result.current.login(credentials);

    expect(mockLogin).toHaveBeenCalledWith(credentials);
    expect(toast.success).toHaveBeenCalledWith('Bienvenue, John !');
  });

  it('should handle login errors', async () => {
    const error = new Error('Invalid credentials');
    mockLogin.mockRejectedValue(error);

    const { result } = renderHook(() => useLogin());

    const credentials = {
      email: 'john@example.com',
      password: 'wrongpassword',
    };

    await expect(result.current.login(credentials)).rejects.toThrow('Invalid credentials');
    
    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
    
    // Le format des toasts a changé avec ErrorHandler
    expect(toast.error).toHaveBeenCalled();
  });

  it('should set loading state during login', async () => {
    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise(resolve => {
      resolveLogin = resolve;
    });

    mockLogin.mockReturnValue(loginPromise);

    const { result } = renderHook(() => useLogin());

    const credentials = {
      email: 'john@example.com',
      password: 'password123',
    };

    // Start login (don't await yet)
    const loginPromise2 = result.current.login(credentials);

    // Wait for loading state to update
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    // Resolve the promise
    resolveLogin!({
      user: { firstName: 'John' } as any,
      token: 'token',
    });

    await loginPromise2;

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle generic errors', async () => {
    mockLogin.mockRejectedValue('Unknown error');

    const { result } = renderHook(() => useLogin());

    const credentials = {
      email: 'john@example.com',
      password: 'password123',
    };

    await expect(result.current.login(credentials)).rejects.toBeDefined();
    // Le format des toasts a changé avec ErrorHandler
    expect(toast.error).toHaveBeenCalled();
  });
});
