import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"


export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!url || !key) {
    console.warn("⚠️ Supabase Server Credentials Missing:", {
      url: url ? "Present" : "MISSING",
      key: key ? "Present" : "MISSING"
    });
    // Return a dummy client-like object that returns empty data/error instead of crashing
    return {
      from: () => ({
        select: () => ({
          eq: () => ({ single: async () => ({ data: null, error: { message: "Supabase credentials missing" } }) }),
          in: async () => ({ data: [], error: { message: "Supabase credentials missing" } }),
          limit: () => ({ single: async () => ({ data: null, error: { message: "Supabase credentials missing" } }) }),
        }),
      }),
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    } as any;
  }

  const cookieStore = await cookies()

  return createServerClient(
    url!,
    key!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — safe to ignore.
          }
        },
      },
    }
  )
}

export async function getSessionUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (err) {
    console.error("Error retrieving session user:", err);
    return null;
  }
}

export async function verifyUserRole(allowedRoles: string[]) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthenticated");

  // 1. Initialize the Supabase server client
  const supabase = await createClient();

  // 2. Fetch the user's role and status from the profiles table
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  // 3. Perform authorization and status checks
  if (
    error ||
    !profile ||
    profile.status?.toLowerCase() !== "active" ||
    !allowedRoles.includes(profile.role)
  ) {
    throw new Error("Unauthorized");
  }

  return { user, profile };
}


