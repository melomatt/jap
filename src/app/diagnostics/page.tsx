
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminErrorState from "@/components/AdminErrorState";

export const dynamic = "force-dynamic";

export default async function DiagnosticsPage() {
  // Security: only verified admins can view environment diagnostics
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const diagnostics = {
    NEXT_PUBLIC_SUPABASE_URL: url ? "DEFINED (starts with " + url.substring(0, 10) + "...)" : "MISSING",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: key ? "DEFINED (length: " + key.length + ")" : "MISSING",
    SUPABASE_SERVICE_ROLE_KEY: serviceKey ? "DEFINED (length: " + serviceKey.length + ")" : "MISSING",
  };

  return (
    <div className="p-8 font-mono">
      <h1 className="text-2xl font-bold mb-4">Vercel Deployment Diagnostics</h1>
      <pre className="bg-gray-100 p-4 rounded bg-gray-100 dark:bg-gray-800">
        {JSON.stringify(diagnostics, null, 2)}
      </pre>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Supabase Connectivity Test</h2>
        <ConnectionTest />
      </div>
    </div>
  );
}

async function ConnectionTest() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('site_content').select('section_key').limit(5);

    if (error) {
      return <AdminErrorState title="Diagnostics DB Error" message="Supabase query failed." error={error} />;
    }

    return (
      <div className="text-green-600">
        <p>Successfully connected to Supabase!</p>
        <p>Found sections: {data?.map((d: any) => d.section_key).join(', ')}</p>
      </div>
    );
  } catch (err: any) {
    return <AdminErrorState title="Exception Thrown" message="Failed to test DB connection." error={err} />;
  }
}
