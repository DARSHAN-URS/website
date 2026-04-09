"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
        const { error: signupError, data } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/dashboard`,
            }
        });

        if (signupError) {
          setError(signupError.message);
        } else if (data.session) {
            router.push('/dashboard');
            router.refresh();
        } else {
            setSuccess(true);
        }
    } catch (err) {
        console.error("Unexpected signup error:", err);
        setError("An unexpected error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef5fb] p-6">
      <div className="bg-white p-10 rounded-[28px] shadow-xl w-full max-w-md border border-[#dde9f3]">
        <div className="text-center mb-8">
           <Link href="/" className="mb-4 block">
             <Logo size="lg" className="justify-center" />
           </Link>
           <h2 className="text-2xl font-bold">Create Account</h2>
           <p className="text-[#6b7f93]">Start hiring or working today</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm shadow-sm">
                <span className="font-bold block">Sign Up Failed</span>
                <span>{error}</span>
            </div>
        )}

        {success ? (
            <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
                <h3 className="text-2xl font-bold mb-3">Check your email</h3>
                <p className="text-[#6b7f93] mb-8 leading-relaxed font-medium">We sent a confirmation link to <span className="text-[#1a2533] font-bold">{email}</span>. Please click it to activate your account.</p>
                <Link href="/login" className="text-[#3d7ab5] font-extrabold hover:underline">Return to login</Link>
            </div>
        ) : (
            <form onSubmit={handleSignup} className="space-y-5">
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
                  autoComplete="new-password"
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
                        <span>Creating account...</span>
                    </>
                ) : 'Create Account'}
              </button>
              
              <p className="text-center mt-8 text-sm text-[#6b7f93] font-medium">
                Already have an account? <Link href="/login" className="text-[#3d7ab5] font-extrabold hover:underline">Log in</Link>
              </p>
            </form>
        )}
      </div>
    </div>
  );
}
