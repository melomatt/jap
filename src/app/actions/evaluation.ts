"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Utility to verify if user is authenticated admin
async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single()

  if (!profile || profile.status?.toLowerCase() !== "active" || (profile.role !== "admin" && profile.role !== "super_admin")) {
    throw new Error("Unauthorized: Account is inactive or lacks admin privileges.")
  }

  return { user, profile }
}

export async function getAllEvaluations() {
  try {
    await verifyAdmin()
    const adminSupabase = createAdminClient()

    const { data: evaluations, error } = await adminSupabase
      .from("evaluations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return { evaluations }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function deleteEvaluation(id: string) {
  try {
    await verifyAdmin()
    const adminSupabase = createAdminClient()

    const { error } = await adminSupabase
      .from("evaluations")
      .delete()
      .eq("id", id)

    if (error) throw error

    revalidatePath("/admin/evaluations")
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function markEvaluationAsReplied(id: string) {
  try {
    await verifyAdmin()
    const adminSupabase = createAdminClient()

    const { error } = await adminSupabase
      .from("evaluations")
      .update({ status: "replied" })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/admin/evaluations")
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}
