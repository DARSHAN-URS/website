"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SupabaseListener() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Task: Sync auth session to cookie for the middleware
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          // Set cookie 'sb-access-token' for hybrid middleware to see
          document.cookie = `sb-access-token=${session.access_token}; path=/; SameSite=Lax; Secure; Max-Age=${60 * 60 * 24 * 7}`;
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear cookie on sign out
        document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
