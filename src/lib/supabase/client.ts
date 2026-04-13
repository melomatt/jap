import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (typeof window !== "undefined") {
      console.error("❌ Supabase Browser Credentials Missing:", { 
        url: url ? "Present" : "MISSING", 
        key: key ? "Present" : "MISSING" 
      });
    }
    return {
      from: () => ({
        select: () => ({
          eq: () => ({ single: async () => ({ data: null, error: { message: "Browser credentials missing" } }) }),
        }),
      }),
      auth: {
        signInWithPassword: async () => ({ data: { user: null }, error: { message: "Credentials missing" } }),
        signOut: async () => ({ error: null }),
      },
    } as any;
  }

  return createBrowserClient(
    url!,
    key!
  )
}
