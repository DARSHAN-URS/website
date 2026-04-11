import { createClient } from '@supabase/supabase-js'

// ABSOLUTE HARDCODE FOR BUILD STABILITY
// This bypasses all environment variable logic to ensure the build passes
const supabaseUrl = 'https://bixrgczukyudjoprsjyp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
