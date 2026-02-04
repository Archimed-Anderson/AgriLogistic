import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de sécurité et routage intelligent
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get('better-auth.session_token')?.value;

  // 1. Redirection des utilisateurs déjà connectés
  if (sessionToken && (pathname === '/login' || pathname === '/register' || pathname === '/auth/signin')) {
     // Default redirection - can be improved if we can read role from cookie or specific user preference
    return NextResponse.redirect(new URL('/dashboard/farmer', request.url));
  }

  // 2. Protection des routes Dashboard
  if (pathname.startsWith('/dashboard/') || pathname.startsWith('/admin/')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Reductions génériques /dashboard
  if (sessionToken && pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard/farmer', request.url));
  }

  return NextResponse.next();
}

function getDashboardPath(role: string): string {
  const roleMap: Record<string, string> = {
    admin: '/admin/dashboard',
    farmer: '/dashboard/agriculteur',
    buyer: '/dashboard/buyer',
    transporter: '/dashboard/transporter',
  };
  return roleMap[role.toLowerCase()] || '/dashboard/agriculteur';
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
