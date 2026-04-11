import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect address
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    
    // We create a custom response first so we can attach cookies to it reliably
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      'https://bixrgczukyudjoprsjyp.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
              // Ensure Next.js also attaches the cookie to this specific response object
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('Google Auth Exchange Success! Forwarding to Dashboard:');
      return response
    } else {
      console.error('Google Auth Exchange Error:', error);
    }
  }

  // FALLBACK
  return NextResponse.redirect(`${origin}/login?error=GoogleLoginFailed`)
}
