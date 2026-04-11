import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, LayoutTemplate, Send, ArrowRight, ShieldCheck, Activity, MessageCircle, Inbox, CalendarDays, UserCircle } from "lucide-react"
import DashboardClient from "./DashboardClient"

// Ensure this page always fetches fresh data
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, full_name, status")
    .eq("id", user.id)
    .single()

  if (error) {
    return (
      <div className="p-10 text-red-600 bg-red-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Database Error!</h1>
        <p>There was an error reading your profile from Supabase:</p>
        <pre className="mt-4 p-4 bg-red-100 rounded">{error.message}</pre>
        <p className="mt-4">Did you run the <code>supabase_update_users.sql</code> script?</p>
      </div>
    )
  }

  if (!profile || profile.status?.toLowerCase() !== "active") {
    redirect("/pending")
  }

  const role: string = profile?.role ?? "admin"
  const name: string = profile?.full_name ?? user.email

  // Fetch real statistics for the dashboard
  const adminSupabase = createAdminClient()
  const { count: activeUsers } = await adminSupabase.from("profiles").select("*", { count: 'exact', head: true }).eq("status", "active")
  const { count: pendingUsers } = await adminSupabase.from("profiles").select("*", { count: 'exact', head: true }).eq("status", "inactive")
  const { count: cmsSections } = await adminSupabase.from("site_content").select("*", { count: 'exact', head: true })
  const { count: activeChats } = await adminSupabase.from("chat_conversations").select("*", { count: 'exact', head: true }).eq("status", "active")
  const { count: pendingQuotes } = await adminSupabase.from("quotes").select("*", { count: 'exact', head: true }).eq("status", "pending")
  const { count: pendingEvals } = await adminSupabase.from("evaluations").select("*", { count: 'exact', head: true }).eq("status", "pending")

  const stats = {
    activeUsers: activeUsers || 0,
    pendingUsers: pendingUsers || 0,
    cmsSections: cmsSections || 0,
    activeChats: activeChats || 0,
    pendingQuotes: pendingQuotes || 0,
    pendingEvals: pendingEvals || 0
  }

  return (
    <DashboardClient 
      stats={stats} 
      user={{ name, role }} 
    />
  )
}

