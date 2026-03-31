"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
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
           <h2 className="text-2xl font-bold">Create Account</h2>
           <p className="text-[#6b7f93]">Start hiring or working today</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 ml-1">Email Address</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5]"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 ml-1">Password</label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5]"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full bg-[#3d7ab5] text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-[#2c5f8a] transition-all disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#6b7f93]">
          Already have an account? <Link href="/login" className="text-[#3d7ab5] font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
