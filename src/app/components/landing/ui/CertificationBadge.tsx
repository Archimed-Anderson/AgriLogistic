import { LucideIcon } from 'lucide-react';

interface CertificationBadgeProps {
  icon: LucideIcon;
  label: string;
  description: string;
}

export default function CertificationBadge({
  icon: Icon,
  label,
  description,
}: CertificationBadgeProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all duration-300">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">{label}</h4>
        <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
