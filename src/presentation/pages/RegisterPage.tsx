import { RegisterForm } from '../components/features/auth/RegisterForm';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const handleSuccess = () => {
    // Redirect to appropriate dashboard based on role
    // For now, redirect to overview - will be improved with role-based routing
    onNavigate('/admin/overview');
  };

  const handleLogin = () => {
    onNavigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <RegisterForm
        onSuccess={handleSuccess}
        onLogin={handleLogin}
      />
    </div>
  );
}
