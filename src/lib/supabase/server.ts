import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("❌ Supabase Server Credentials Missing:", { 
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
