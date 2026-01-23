// Placeholder useAuth hook
// TODO: Replace with actual auth implementation

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export function useAuth() {
  // Mock implementation - replace with real auth
  const user: User | null = {
    id: '1',
    email: 'admin@test.com',
    name: 'Admin User',
    roles: ['SUPER_ADMIN'],
  };

  const isAuthenticated = true;
  const isLoading = false;

  return {
    user,
    isAuthenticated,
    isLoading,
    login: async (email: string, password: string) => {
      console.log('Login:', email, password);
    },
    logout: () => {
      console.log('Logout');
    },
  };
}
