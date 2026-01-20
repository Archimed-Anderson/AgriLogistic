import { ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";

type AccessDeniedProps = {
  title?: string;
  message?: string;
  onBack?: () => void;
};

export function AccessDenied({
  title = "Accès refusé",
  message = "Vous n’avez pas les permissions nécessaires pour accéder à ce module.",
  onBack,
}: AccessDeniedProps) {
  return (
    <div className="rounded-2xl border border-[#EEF2F7] bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <div className="text-lg font-semibold text-[#111827]">{title}</div>
          <div className="mt-1 text-sm text-[#6B7280]">{message}</div>
          {onBack && (
            <div className="mt-4">
              <Button variant="outline" className="rounded-lg" onClick={onBack}>
                Retour
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

