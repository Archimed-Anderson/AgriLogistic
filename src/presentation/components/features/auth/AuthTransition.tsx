import { ReactNode } from 'react';
import { cn } from '../../../../app/components/ui/utils';

interface AuthTransitionProps {
  children: ReactNode;
  isLogin: boolean;
  className?: string;
}

/**
 * Composant de transition animée entre login et signup
 */
export function AuthTransition({ children, isLogin, className }: AuthTransitionProps) {
  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        'transform',
        isLogin
          ? 'translate-x-0 opacity-100'
          : 'translate-x-0 opacity-100',
        className
      )}
      style={{
        animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .transition-all {
            transition: none;
          }
          @keyframes fadeIn {
            from, to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      `}</style>
    </div>
  );
}
