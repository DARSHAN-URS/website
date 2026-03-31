"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
        // Authenticate with Supabase
        const { error: loginError, data } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
        });

        if (loginError) {
            setError(loginError.message);
            setLoading(false);
            return;
        }

        // If login successful, trigger a page refresh to sync cookies for middleware
        // This is crucial for Next.js 15+ to ensure the middleware sees the session
        router.refresh();
        
        // Wait a small moment for cookies to sync before redirecting
        setTimeout(() => {
            router.push('/dashboard');
            setLoading(false);
        }, 500);
        
    } catch (err) {
        console.error("Unexpected login error:", err);
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef5fb] p-6">
      <div className="bg-white p-10 rounded-[28px] shadow-xl w-full max-w-md border border-[#dde9f3]">
        <div className="text-center mb-8">
           <Link href="/" className="inline-flex items-center gap-2 mb-4">
             <svg className="w-10 h-10" viewBox="0 0 80 80" fill="none">
               <path d="M16 36 Q20 18 40 16 Q60 18 64 36 Q58 50 40 52 Q22 50 16 36Z" fill="#3d7ab5"/>
             </svg>
             <span className="font-serif text-2xl font-extrabold text-[#3d7ab5]">Laborgro</span>
           </Link>
           <h2 className="text-2xl font-bold">Welcome Back</h2>
           <p className="text-[#6b7f93]">Sign in to access your account</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm shadow-sm flex flex-col gap-1">
                <span className="font-bold">Login Failed</span>
                <span>{error}</span>
                {error.includes("confirmed") && (
                    <span className="mt-2 text-xs font-semibold underline cursor-pointer">Resend confirmation email?</span>
                )}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5 ml-1 text-[#1a2533]">Email Address</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] focus:ring-2 focus:ring-[#3d7ab5]/10 transition-all font-medium"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 ml-1 text-[#1a2533]">Password</label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
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
        </form>

        <p className="text-center mt-8 text-sm text-[#6b7f93] font-medium">
          Don't have an account? <Link href="/signup" className="text-[#3d7ab5] font-extrabold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
