import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware de sécurité et routage intelligent
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const token = request.cookies.get('accessToken')?.value
  const userRoleCookie = request.cookies.get('userRole')?.value

  // 1. Redirection des utilisateurs déjà connectés
  if (token && (pathname === '/login' || pathname === '/register')) {
    const dashboardPath = getDashboardPath(userRoleCookie || 'farmer')
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  // 2. Protection des routes Dashboard
  if (pathname.startsWith('/dashboard/')) {
    const roleSlug = pathname.split('/')[2] // agriculteur, transporter, buyer
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const payloadBase64 = token.split('.')[1]
      if (!payloadBase64) throw new Error('Invalid Token')
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(atob(base64))
      const role = payload.role?.toLowerCase()
      const userId = payload.sub || payload.id || payload.userId

      // Mapping slug -> role attendu
      const roleMapping: Record<string, string> = {
        'agriculteur': 'farmer',
        'transporter': 'transporter',
        'buyer': 'buyer'
      }

      const expectedRole = roleMapping[roleSlug]
      if (expectedRole && role !== expectedRole) {
         return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Injection des headers métier
      const requestHeaders = new Headers(request.headers)
      if (role === 'farmer') requestHeaders.set('x-farmer-id', userId)
      if (role === 'transporter') requestHeaders.set('x-transporter-id', userId)
      if (role === 'buyer') requestHeaders.set('x-buyer-id', userId)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (e) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 3. Reductions génériques /dashboard -> vers rôle spécifique
  if (token && pathname === '/dashboard') {
    const dashboardPath = getDashboardPath(userRoleCookie || 'farmer')
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  return NextResponse.next()
}

function getDashboardPath(role: string): string {
  const roleMap: Record<string, string> = {
    admin: '/admin/dashboard',
    farmer: '/dashboard/agriculteur',
    buyer: '/dashboard/buyer',
    transporter: '/dashboard/transporter',
  }
  return roleMap[role.toLowerCase()] || '/dashboard/agriculteur'
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
}
