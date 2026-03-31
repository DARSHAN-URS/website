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
          // Task 4: Use response.cookies.set(), do not mutate request.cookies directly
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // Task 4: Use response.cookies.set()
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Task 1: Use supabase.auth.getSession() to check session existence
  const { data: { session } } = await supabase.auth.getSession();
  
  // Task 5: Add temporary debug logs
  console.log("SESSION:", session)
  console.log("HAS ACCESS TOKEN:", request.cookies.get("sb-access-token"))
  console.log("PATH:", request.nextUrl.pathname)

  // Task 1: --- HYBRID REDIRECT LOGIC ---
  // Allow request to continue if session exists OR if authentication cookies exist.
  // This prevents redirect loops on Netlify where cookies might sync after middleware runs.
  // Only redirect to /login if BOTH session and cookies are missing.
  if (!session && !request.cookies.get("sb-access-token")) {
    console.log("NO SESSION & NO COOKIE: Redirecting to /login");
    const redirectUrl = new URL("/login", request.url);
    // Include original URL in query param if you want to redirect back after login
    // redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow the request to proceed (Task 1: If session missing but cookies exist, allow it)
  return response;
}

// Task 2 & 3: Restrict middleware to only protected routes using exact matcher config
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/jobs/:path*",
    "/messages/:path*",
    "/settings/:path*",
  ],
};