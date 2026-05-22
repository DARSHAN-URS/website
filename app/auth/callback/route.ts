import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bixrgczukyudjoprsjyp.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_oqeIi7MymSXHWuiCNgs6mA_pyNbnvSy',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    // Check if we already have a session to avoid unnecessary exchange
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      return NextResponse.redirect(new URL(next, origin).toString())
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(next, origin).toString())
    }
    
    console.error('Auth callback exchange error:', error)
  }

  // Fallback: check if the user is somehow logged in anyway
  // This helps with race conditions or double-hits
  const cookieStore = await cookies()
  const hasAuthToken = cookieStore.getAll().some(c => c.name.includes('auth-token') || c.name.includes('sb-access-token'));
  if (hasAuthToken) {
    return NextResponse.redirect(new URL(next, origin).toString())
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL(`/login?error=Authentication failed. Please try again.`, origin).toString())
}

