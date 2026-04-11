import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import UsersView from "./UsersView"
import AdminErrorState from "@/components/AdminErrorState"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single()

  if (profileError) {
    return <AdminErrorState title="Profile Error" message="Unable to load your profile." error={profileError} />
  }

  if (!profile || profile.status?.toLowerCase() !== "active") {
    redirect("/pending")
  }



  // Fetch all users for the table using the Admin client to bypass RLS restrictions
  const adminSupabase = createAdminClient()
  const { data: users, error } = await adminSupabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <AdminErrorState title="Users Error" message="Unable to load the directory." error={error} />
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-8 border-b border-gray-200/50 dark:border-white/5">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">User Directory</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
          Manage system administrators, review pending requests, and configure access privileges.
        </p>
      </div>

      {/* Main interactive app content */}
      <UsersView initialUsers={users || []} currentUserRole={profile?.role || "admin"} />
    </div>
  )
}
