import { LoginForm } from '../components/features/auth/LoginForm';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <LoginForm
        onSuccess={() => onNavigate('/admin/overview')}
        onForgotPassword={() => onNavigate('/forgot-password')}
        onRegister={() => onNavigate('/register')}
      />
    </div>
  );
}
