import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'licimx_session'
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'licimx-dev-secret-change-in-production-2026'
)

const protectedRoutes = [
  '/dashboard',
  '/pipeline',
  '/licitaciones',
  '/explorar',
  '/scoring',
  '/documentos',
  '/calendario',
  '/contactos',
  '/analytics',
  '/propuestas',
  '/settings',
  '/configuracion',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthPage = pathname === '/login' || pathname === '/register'

  let isAuthenticated = false
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      isAuthenticated = true
    } catch {
      // Token invalid or expired
    }
  }

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/pipeline/:path*',
    '/licitaciones/:path*',
    '/explorar/:path*',
    '/scoring/:path*',
    '/documentos/:path*',
    '/calendario/:path*',
    '/contactos/:path*',
    '/analytics/:path*',
    '/propuestas/:path*',
    '/settings/:path*',
    '/configuracion/:path*',
    '/login',
    '/register',
  ],
}
