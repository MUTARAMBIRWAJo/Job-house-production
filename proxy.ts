import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
     let response = NextResponse.next({
            request: {
                  headers: request.headers,
            },
     })

     const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                  cookies: {
                        get(name: string) {
                              return request.cookies.get(name)?.value
                        },
                        set(name: string, value: string, options: CookieOptions) {
                              request.cookies.set({ name, value, ...options })
                              response = NextResponse.next({
                                    request: {
                                          headers: request.headers,
                                    },
                              })
                              response.cookies.set({ name, value, ...options })
                        },
                        remove(name: string, options: CookieOptions) {
                              request.cookies.set({ name, value: '', ...options })
                              response = NextResponse.next({
                                    request: {
                                          headers: request.headers,
                                    },
                              })
                              response.cookies.set({ name, value: '', ...options })
                        },
                  },
            }
     )

     // Refresh session if expired - use getUser() for more accurate session check
     const { data: { user }, error: userError } = await supabase.auth.getUser()

     // Get user role if authenticated
     let userRole = null
     if (user && !userError) {
            const { data: profile } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', user.id)
                  .single()

            userRole = profile?.role
     }

     const path = request.nextUrl.pathname

     // Public routes that don't require authentication
     const publicRoutes = [
            '/',
            '/login',
            '/register',
            '/forgot-password',
            '/reset-password',
            '/verify-otp',
            '/lyrics',
            '/lyrics/',
            '/artists',
            '/artists/',
            '/news',
            '/events',
            '/store',
            '/studio',
            '/about',
            '/contact',
            '/privacy',
            '/terms',
            '/search'
     ]

     const isPublicRoute = publicRoutes.some(route =>
            path === route || path.startsWith(route + '/')
     )

     // Auth routes (redirect to dashboard if already authenticated)
     const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
     const isAuthRoute = authRoutes.includes(path)

     // Protected routes that require authentication
     const protectedRoutes = [
            '/dashboard',
            '/dashboard/',
            '/admin',
            '/admin/',
            '/customer',
            '/customer/',
            '/editor',
            '/editor/',
            '/dashboard/artists',
            '/dashboard/artists/',
            '/upload',
            '/upload/',
            '/profile',
            '/profile/',
            '/checkout',
            '/my-downloads'
     ]

     const isProtectedRoute = protectedRoutes.some(route =>
            path === route || path.startsWith(route + '/')
     )

     // Admin only routes
     const adminRoutes = ['/admin']
     const isAdminRoute = adminRoutes.some(route => path.startsWith(route))

     // Artist routes
     const artistRoutes = ['/artist']
     const isArtistRoute = artistRoutes.some(route => path.startsWith(route))

     // Handle unauthenticated users trying to access protected routes
     if (isProtectedRoute && !user) {
            const redirectUrl = new URL('/login', request.url)
            redirectUrl.searchParams.set('redirect', path)
            return NextResponse.redirect(redirectUrl)
     }

     // Allow authenticated users to access auth routes (don't redirect away from login)
     // This allows users to manually navigate to login page even when authenticated

     // Role-based access control
     // Admin routes - admin only
     if (isAdminRoute && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
     }

     // Editor routes - editor or admin
     if (path.startsWith('/editor') && userRole !== 'admin' && userRole !== 'editor') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
     }

     // Artist routes - artist or admin only
     if (isArtistRoute && userRole !== 'admin' && userRole !== 'artist') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
     }

     return response
}

export const config = {
     matcher: [
            /*
             * Match all request paths except:
             * - _next/static (static files)
             * - _next/image (image optimization files)
             * - favicon.ico (favicon file)
             * - public folder
             * - api routes that don't need auth
             */
            '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
     ],
}
