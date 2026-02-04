import { memo } from 'react';

interface AgroLogisticLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

/**
 * AgroLogistic Logo Component
 * A modern, professional logo combining a leaf with logistics arrow
 * representing the fusion of agriculture and logistics
 */
export const AgroLogisticLogo = memo(function AgroLogisticLogo({
  size = 'md',
  className = '',
  showText = false,
}: AgroLogisticLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon - SVG leaf with arrow */}
      <div
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0B7A4B] to-[#059669] shadow-md ${sizeClasses[size]}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[60%] w-[60%]"
        >
          {/* Stylized leaf with arrow */}
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.82 0 3.53-.5 5-1.35"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M17 7l5 5m0 0l-5 5m5-5H9"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8c-2 2-2 6 0 8"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Optional Text */}
      {showText && (
        <span className={`font-bold text-gray-800 ${textSizeClasses[size]}`}>AgroLogistic</span>
      )}
    </div>
  );
});

export default AgroLogisticLogo;
