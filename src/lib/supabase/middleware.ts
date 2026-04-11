import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({ request })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Middleware Supabase credentials missing.");
      return NextResponse.next({ request });
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const isProtectedRoute =
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/users") ||
      request.nextUrl.pathname.startsWith("/diagnostics");

    // Step 1: Redirect unauthenticated users away from protected routes
    if (!user && isProtectedRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/login"
      return NextResponse.redirect(redirectUrl)
    }

    // Step 2: RBAC check — authenticated users must also be active admins
    if (user && isProtectedRoute) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("status, role")
        .eq("id", user.id)
        .single();

      const isActiveAdmin =
        !profileError &&
        profile &&
        profile.status === "active" &&
        (profile.role === "admin" || profile.role === "super_admin");

      if (!isActiveAdmin) {
        // Authenticated but inactive or not an admin — deny access
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/login";
        redirectUrl.searchParams.set("error", "access_denied");
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Step 3: Redirect logged-in active admins away from the login page
    if (user && request.nextUrl.pathname === "/login") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("status, role")
        .eq("id", user.id)
        .single();

      const isActiveAdmin =
        profile &&
        profile.status === "active" &&
        (profile.role === "admin" || profile.role === "super_admin");

      if (isActiveAdmin) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = "/admin"
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Propagate pathname to the root layout via a custom header
    supabaseResponse.headers.set("x-pathname", request.nextUrl.pathname);

    return supabaseResponse
  } catch (error) {
    console.error("Middleware failed:", error)
    return NextResponse.next({ request })
  }
}
