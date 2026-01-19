import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRegister } from '../use-register';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '@domain/enums/user-role.enum';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('../../contexts/AuthContext');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useRegister', () => {
  const mockRegister = vi.fn();
  const mockAuthContext = {
    register: mockRegister,
    isLoading: false,
    user: null,
    token: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    refreshToken: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue(mockAuthContext);
  });

  it('should initialize with step 1', () => {
    const { result } = renderHook(() => useRegister());

    expect(result.current.currentStep).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should validate step 1 correctly', () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.updateStepData(1, {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    expect(result.current.isValidStep(1)).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should reject step 1 with mismatched passwords', () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.updateStepData(1, {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
      });
    });

    expect(result.current.isValidStep(1)).toBe(false);
    // isValidStep no longer sets error to avoid side effects
  });

  it('should reject step 1 with short password', () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.updateStepData(1, {
        email: 'test@example.com',
        password: 'short',
        confirmPassword: 'short',
      });
    });

    expect(result.current.isValidStep(1)).toBe(false);
    // isValidStep no longer sets error to avoid side effects
  });

  it('should navigate to next step when valid', () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.updateStepData(1, {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(2);
  });

  it('should validate step 2 correctly', () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.updateStepData(1, {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      result.current.updateStepData(2, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        accountType: UserRole.BUYER,
      });
    });

    expect(result.current.isValidStep(2)).toBe(true);
  });

  it('should validate step 3 correctly', () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.updateStepData(3, {
        acceptTerms: true,
      });
    });

    expect(result.current.isValidStep(3)).toBe(true);
  });

  it('should reject step 3 without accepting terms', () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.updateStepData(3, {
        acceptTerms: false,
      });
    });

    expect(result.current.isValidStep(3)).toBe(false);
    // isValidStep no longer sets error to avoid side effects
  });

  it('should complete registration successfully', async () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: { value: 'john@example.com' },
      role: 'buyer',
    } as any;

    mockRegister.mockResolvedValue({
      user: mockUser,
      token: 'mock-token',
    });

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.updateStepData(1, {
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      result.current.updateStepData(2, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        accountType: UserRole.BUYER,
      });
      result.current.updateStepData(3, {
        acceptTerms: true,
      });
    });

    await act(async () => {
      await result.current.register();
    });

    expect(mockRegister).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });

  it('should handle registration errors', async () => {
    const error = new Error('Registration failed');
    mockRegister.mockRejectedValue(error);

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.updateStepData(1, {
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      result.current.updateStepData(2, {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        accountType: UserRole.BUYER,
      });
      result.current.updateStepData(3, {
        acceptTerms: true,
      });
    });

     await act(async () => {
      await expect(result.current.register()).rejects.toThrow();
    });

    // Le format des toasts a changé avec ErrorHandler
    expect(toast.error).toHaveBeenCalled();
    expect(result.current.error).toBeTruthy(); // Error is set
  });

  it('should reset form correctly', () => {
    const { result } = renderHook(() => useRegister());

    // Fill step 1 and advance
    act(() => {
      result.current.updateStepData(1, {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    act(() => {
      result.current.nextStep();
    });

    // Should be at step 2 now
    expect(result.current.currentStep).toBe(2);

    // Reset form
    act(() => {
      result.current.reset();
    });

    // Should be back to step 1 with empty data
    expect(result.current.currentStep).toBe(1);
    expect(result.current.step1Data.email).toBe('');
    expect(result.current.error).toBe(null);
  });
});
