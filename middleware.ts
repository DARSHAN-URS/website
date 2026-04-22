import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Using env variable for build reliability
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()

    // HYBRID CHECK: 
    const allCookies = request.cookies.getAll();
    const hasAuthCookie = allCookies.some(c => 
      c.name.includes('auth-token') || 
      c.name === 'sb-access-token' ||
      c.name.includes('supabase-auth')
    );

    if (!user && !hasAuthCookie) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      // Preserve the intended destination
      url.searchParams.set('redirectedFrom', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  } catch (e) {
    return supabaseResponse;
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/jobs",
    "/jobs/:path*",
    "/messages",
    "/messages/:path*",
    "/settings",
    "/settings/:path*",
    "/admin",
    "/admin/:path*",
  ],
}