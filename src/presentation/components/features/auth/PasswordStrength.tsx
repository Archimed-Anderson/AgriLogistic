import { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

type StrengthLevel = 'weak' | 'medium' | 'good' | 'excellent';

interface StrengthConfig {
  level: StrengthLevel;
  label: string;
  color: string;
  bgColor: string;
  percentage: number;
}

/**
 * Calcule la force d'un mot de passe
 */
function calculatePasswordStrength(password: string): StrengthConfig {
  if (!password) {
    return {
      level: 'weak',
      label: '',
      color: 'text-gray-400',
      bgColor: 'bg-gray-200',
      percentage: 0,
    };
  }

  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  };

  if (checks.length) strength += 20;
  if (checks.lowercase) strength += 20;
  if (checks.uppercase) strength += 20;
  if (checks.number) strength += 20;
  if (checks.special) strength += 20;

  let level: StrengthLevel;
  let label: string;
  let color: string;
  let bgColor: string;

  if (strength <= 40) {
    level = 'weak';
    label = 'Faible';
    color = 'text-red-600';
    bgColor = 'bg-red-500';
  } else if (strength <= 60) {
    level = 'medium';
    label = 'Moyen';
    color = 'text-orange-600';
    bgColor = 'bg-orange-500';
  } else if (strength <= 80) {
    level = 'good';
    label = 'Bon';
    color = 'text-yellow-600';
    bgColor = 'bg-yellow-500';
  } else {
    level = 'excellent';
    label = 'Excellent';
    color = 'text-green-600';
    bgColor = 'bg-green-500';
  }

  return {
    level,
    label,
    color,
    bgColor,
    percentage: strength,
  };
}

/**
 * Composant pour afficher la force d'un mot de passe
 */
export function PasswordStrength({ password, className = '' }: PasswordStrengthProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) {
    return null;
  }

  const criteria = [
    { label: 'Au moins 8 caractères', met: password.length >= 8 },
    { label: 'Une minuscule', met: /[a-z]/.test(password) },
    { label: 'Une majuscule', met: /[A-Z]/.test(password) },
    { label: 'Un chiffre', met: /[0-9]/.test(password) },
    { label: 'Un caractère spécial', met: /[^a-zA-Z0-9]/.test(password) },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Barre de progression */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Force du mot de passe :</span>
          <span className={`font-medium ${strength.color}`}>{strength.label}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.bgColor}`}
            style={{ width: `${strength.percentage}%` }}
            role="progressbar"
            aria-valuenow={strength.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Force du mot de passe: ${strength.label}`}
          />
        </div>
      </div>

      {/* Critères */}
      <div className="space-y-1.5 pt-1">
        {criteria.map((criterion, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-xs"
            aria-live="polite"
          >
            {criterion.met ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" aria-hidden="true" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-gray-400 shrink-0" aria-hidden="true" />
            )}
            <span
              className={criterion.met ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}
            >
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
