import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // 1. Get session (lightweight check)
  const { data: { session } } = await supabase.auth.getSession();
  
  const pathname = request.nextUrl.pathname;
  const hasAccessToken = request.cookies.get("sb-access-token");

  // 2. Debug logging as requested
  console.log("SESSION:", session ? "ACTIVE" : "NULL");
  console.log("HAS ACCESS TOKEN:", !!hasAccessToken);
  console.log("PATH:", pathname);

  // 3. --- HYBRID REDIRECT LOGIC ---
  // If no session is found, we check if the access token cookie is present.
  // If the cookie is present but session is NULL, we allow the request to 
  // continue because the cookies might still be synchronizing on Netlify.
  // The client-side dashboard will perform the final verification.
  if (!session && !hasAccessToken) {
    console.log("NO SESSION & NO COOKIE: Redirecting to /login");
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Default: allow request to proceed
  return response;
}

export const config = {
  // 5. Restrict middleware to ONLY these protected routes
  // This explicitly EXCLUDES /login and /signup to prevent redirect loops
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/jobs/:path*",
    "/messages/:path*",
    "/settings/:path*",
  ],
};