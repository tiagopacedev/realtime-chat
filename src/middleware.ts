import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname

    // Manage route protection
    const isAuth = await getToken({ req })
    const isLoginPage = pathname.startsWith('/login')

    const sensitiveRoutes = ['/dashboard']
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) => pathname.startsWith(route))

    // Redirect to dashboard if user is authenticated and trying to access login page
    if (isLoginPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect to login if user is not authenticated and trying to access a sensitive route
    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Redirect from home page to dashboard if the user is authenticated
    if (pathname === '/' && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Allow the request to proceed if no conditions are met
    return NextResponse.next()
  },
  {
    callbacks: {
      async authorized() {
        // Authorization callback, allow all requests for now
        return true
      },
    },
  },
)

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
}
