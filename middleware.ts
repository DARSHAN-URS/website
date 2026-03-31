import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Use getSession for faster check in middleware
  const { data: { session } } = await supabase.auth.getSession()
  
  // Debug logging as requested
  console.log("SESSION STATUS:", session ? "ACTIVE" : "NONE", "PATH:", request.nextUrl.pathname);

  // If no session and trying to access a protected route
  if (!session) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  // If session exists, proceed to the protected page
  return response
}

export const config = {
  // Only run middleware on these protected paths to avoid redirect loops and unnecessary checks
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/jobs/:path*',
    '/messages/:path*',
    '/settings/:path*',
  ],
}