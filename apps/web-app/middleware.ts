import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware de redirection basé sur les rôles
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Récupérer les informations d'auth depuis les cookies
  const token = request.cookies.get('accessToken')?.value
  const userRole = request.cookies.get('userRole')?.value

  // 1. Redirection si l'utilisateur est déjà connecté et tente d'accéder aux pages auth
  if (token && (pathname === '/login' || pathname === '/register')) {
    const dashboardPath = getDashboardPath(userRole || 'farmer')
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  // 2. Protection des routes dashboard
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 3. Redirection spécifique par rôle (si l'utilisateur est sur le mauvais dashboard)
  // On redirige /dashboard ou /admin vers le bon dashboard spécifique
  if (token && (pathname === '/dashboard' || pathname === '/admin')) {
    const dashboardPath = getDashboardPath(userRole || 'farmer')
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  return NextResponse.next()
}

/**
 * Helper pour obtenir le chemin du dashboard par rôle
 */
function getDashboardPath(role: string): string {
  const roleMap: Record<string, string> = {
    admin: '/admin/dashboard',
    farmer: '/dashboard/farmer',
    buyer: '/dashboard/buyer',
    transporter: '/dashboard/transporter',
  }
  return roleMap[role.toLowerCase()] || '/dashboard/farmer'
}

// Configurer les paths sur lesquels le middleware s'exécute
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/admin',
    '/dashboard',
    '/login',
    '/register',
  ],
}
