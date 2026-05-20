"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { verifyUserRole } from "@/lib/supabase/server" // Centralized auth helper
import { revalidatePath } from "next/cache"

export async function getAllEvaluations() {
  try {
    await verifyUserRole(["admin", "super_admin"]);
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
    await verifyUserRole(["admin", "super_admin"]);
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
    await verifyUserRole(["admin", "super_admin"]);
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
