import { createClient } from '@supabase/supabase-js'

// Hardened environment variable retrieval
const getEnv = (key: string, fallback: string) => {
  const value = process.env[key];
  if (!value || value === 'undefined' || value === 'null' || value.trim() === '') {
    return fallback;
  }
  return value.trim();
}

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co');
const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder');

// Safety check for valid URL format
let finalUrl = supabaseUrl;
if (!finalUrl.startsWith('http')) {
  console.warn(`⚠️ Warning: NEXT_PUBLIC_SUPABASE_URL is invalid ("${finalUrl}"). Falling back to placeholder.`);
  finalUrl = 'https://placeholder.supabase.co';
}

export const supabase = createClient(finalUrl, supabaseAnonKey)
