'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AuthTabsProps {
  className?: string;
}

export function AuthTabs({ className }: AuthTabsProps) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';
  const isRegister = pathname === '/register';

  return (
    <div className={cn('flex w-full border-b mb-6', className)}>
      <Link
        href="/login"
        className={cn(
          'flex-1 text-center py-3 text-sm font-bold transition-all duration-300 relative',
          isLogin
            ? 'text-primary bg-primary/5'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
        )}
      >
        Se connecter
        {isLogin && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-primary animate-in fade-in slide-in-from-bottom-1 duration-300" />
        )}
      </Link>
      <Link
        href="/register"
        className={cn(
          'flex-1 text-center py-3 text-sm font-bold transition-all duration-300 relative',
          isRegister
            ? 'text-primary bg-primary/5'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
        )}
      >
        Créer un compte
        {isRegister && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-primary animate-in fade-in slide-in-from-bottom-1 duration-300" />
        )}
      </Link>
    </div>
  );
}
