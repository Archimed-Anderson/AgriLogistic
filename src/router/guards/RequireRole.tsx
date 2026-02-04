import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessDenied } from '@components/AccessDenied';
import type { UserRole } from '@domain/enums/user-role.enum';
import { useAuth } from '@presentation/contexts/AuthContext';

type RequireRoleProps = {
  anyOf: UserRole[];
  moduleLabel: string;
  fallbackRoute?: string;
  children: ReactNode;
};

export function RequireRole({ anyOf, moduleLabel, fallbackRoute, children }: RequireRoleProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;
  const allowed = !!role && anyOf.includes(role);

  if (!allowed) {
    const onBack = () => navigate(fallbackRoute || '/admin/dashboard');
    return (
      <AccessDenied
        title="Accès refusé"
        message={`Vous n’avez pas accès à « ${moduleLabel} ». Si vous pensez que c’est une erreur, contactez un administrateur.`}
        onBack={onBack}
      />
    );
  }

  return <>{children}</>;
}
