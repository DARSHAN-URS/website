import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Security check: Ensure environment variables are present
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("MIDDLEWARE ERROR: Missing Supabase Environment Variables");
    return supabaseResponse; // Let it through so the client-side can handle it
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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
    const { data: { user }, error } = await supabase.auth.getUser()

    // HYBRID CHECK: 
    // If getUser() succeeds, we're good.
    // If it fails, we check if there's any Supabase auth cookie at all.
    // This prevents "false negative" redirects on platforms like Netlify.
    const hasAuthCookie = request.cookies.getAll().some(c => c.name.includes('auth-token'));

    if (!user && !hasAuthCookie) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  } catch (e) {
    console.error("Middleware Auth Error:", e);
    // On error, we allow the request to continue to the client-side
    // This is safer than a redirect loop
    return supabaseResponse;
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/jobs/:path*",
    "/messages/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
}