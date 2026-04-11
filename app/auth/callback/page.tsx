"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    // The browser client automatically detects '?code=xyz' in the URL 
    // and exchanges it in the background!
    // We just wait for the session to be established.
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth Callback Error:", error);
          setErrorText(error.message);
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        if (session) {
          // Success! Next.js will correctly pick up the session when we redirect.
          router.push('/dashboard');
        } else {
          // Edge case: Sometimes the automatic exchange needs a split second.
          // Fall back to login if it hangs for too long without session.
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      } catch (e) {
        console.error("Unexpected callback error:", e);
        router.push('/login');
      }
    };

    // Give the Supabase client 500ms to parse the URL and complete the PKCE exchange
    // before we query the session.
    const timer = setTimeout(checkSession, 500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef5fb]">
      <div className="text-center">
        {errorText ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
            <h3 className="font-bold">Authentication Failed</h3>
            <p className="text-sm">{errorText}</p>
            <p className="text-xs mt-2 opacity-70">Redirecting to login...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3d7ab5] mb-4"></div>
            <h2 className="text-xl font-bold text-[#1a2533]">Verifying your login...</h2>
            <p className="text-[#6b7f93] text-sm tracking-wide mt-1">Please wait, logging you in safely.</p>
          </div>
        )}
      </div>
    </div>
  );
}
