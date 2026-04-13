import { createClient } from "@supabase/supabase-js"

export const createAdminClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("❌ Supabase Admin Credentials Missing:", { 
        url: url ? "Present" : "MISSING", 
        serviceRoleKey: key ? "Present" : "MISSING" 
    });
    return {
      from: () => ({
        select: () => ({
          eq: () => ({ single: async () => ({ data: null, error: null }) }),
          in: async () => ({ data: [], error: null }),
        }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: { message: "Admin credentials missing" } }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
      },
    } as any;
  }

  return createClient(
    url!,
    key!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
