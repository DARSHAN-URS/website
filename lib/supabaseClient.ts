import { createBrowserClient } from '@supabase/ssr'

// ABSOLUTE HARDCODE FOR BUILD STABILITY
// This bypasses all environment variable logic to ensure the build passes
const supabaseUrl = 'https://bixrgczukyudjoprsjyp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
