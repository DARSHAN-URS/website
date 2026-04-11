"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (loginError) {
        setError(loginError.message);
      } else {
        console.log("Login success, redirecting...");
        
        // Use a full page reload to ensure session cookies are recognized by middleware on first load
        // This is a reliable way to fix redirect loops on platforms like Netlify
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`, // Standardized callback route for server-side session handling
        }
      });
      if (error) setError(error.message);
    } catch (err) {
      console.error("Unexpected google login error:", err);
      setError("An unexpected error occurred with Google login.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef5fb] p-6">
      <div className="bg-white p-10 rounded-[28px] shadow-xl w-full max-w-md border border-[#dde9f3]">
        <div className="text-center mb-8">
           <Link href="/" className="mb-4 block">
             <Logo size="lg" className="justify-center" />
           </Link>
           <h2 className="text-2xl font-bold">Welcome Back</h2>
           <p className="text-[#6b7f93]">Sign in to access your account</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm shadow-sm flex flex-col gap-1">
                <span className="font-bold">Login Failed</span>
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1.5 ml-1 text-[#1a2533]">Email Address</label>
            <input 
              id="email"
              name="email"
              type="email" 
              required 
              autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] focus:ring-2 focus:ring-[#3d7ab5]/10 transition-all font-medium"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1.5 ml-1 text-[#1a2533]">Password</label>
            <input 
              id="password"
              name="password"
              type="password" 
              required 
              autoComplete="current-password"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] focus:ring-2 focus:ring-[#3d7ab5]/10 transition-all font-medium"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full bg-[#3d7ab5] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#2c5f8a] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:translate-y-0 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                </>
            ) : 'Sign In'}
          </button>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-[#dde9f3]"></div>
            <span className="px-4 text-sm font-semibold text-[#6b7f93]">Or continue with</span>
            <div className="flex-1 border-t border-[#dde9f3]"></div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white text-[#1a2533] border border-[#dde9f3] py-4 rounded-xl font-bold shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-[#6b7f93] font-medium">
          Don't have an account? <Link href="/signup" className="text-[#3d7ab5] font-extrabold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
