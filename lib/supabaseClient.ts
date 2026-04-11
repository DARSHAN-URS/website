import { createClient } from '@supabase/supabase-js'

// 1. Define the REAL values as the final fallback
// These match your project ID: bixrgczukyudjoprsjyp
const REAL_URL = 'https://bixrgczukyudjoprsjyp.supabase.co';
// PLEASE NOTE: I am using the placeholder below for the key. 
// Once you provide the full 'ey...' key, I can put it here, 
// OR you can rely on the environment variable once this build passes.
const REAL_ANON_KEY = 'placeholder'; 

const getEnv = (key: string, fallback: string) => {
  const value = process.env[key];
  if (!value || value === 'undefined' || value === 'null' || value.trim() === '') {
    return fallback;
  }
  return value.trim();
}

// 2. Try Env Var -> Fallback to Real URL -> Fallback to placeholder
const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL', REAL_URL);
const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', REAL_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
