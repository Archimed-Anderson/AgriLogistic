import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AccessDenied } from "@components/AccessDenied";
import type { Permission } from "@domain/value-objects/permissions.vo";
import { useAuth } from "@presentation/contexts/AuthContext";

type RequirePermissionsProps = {
  anyOf: Permission[];
  moduleLabel: string;
  fallbackRoute?: string;
  children: ReactNode;
};

export function RequirePermissions({
  anyOf,
  moduleLabel,
  fallbackRoute,
  children,
}: RequirePermissionsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasAny = user ? user.permissions.hasAny(...anyOf) : false;
  if (!hasAny) {
    const onBack = () => navigate(fallbackRoute || "/admin/dashboard");
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

