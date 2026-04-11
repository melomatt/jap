"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"

// Helper to ensure only authenticated active admins can run actions
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

export async function toggleUserStatus(userId: string, newStatus: string) {
  try {
    await verifyAdmin()
    const adminSupabase = createAdminClient()

    const { error } = await adminSupabase
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", userId)

    if (error) throw error

    revalidatePath("/admin/users")
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function adminCreateUser(formData: FormData) {
  try {
    await verifyAdmin()
    const adminSupabase = createAdminClient()

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    if (!email || !password || !name) {
      return { error: "All fields are required" }
    }

    // 1. Create the user in auth.users using Admin SDK
    // This bypasses login/logout completely
    const { data: newUser, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        role: "admin",
      },
    })

    if (authError) throw authError

    // Ensure new accounts are set to inactive until an admin explicitly activates them
    if (newUser.user) {
      await adminSupabase
        .from("profiles")
        .update({ status: "inactive" })
        .eq("id", newUser.user.id)
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function deleteAdminUser(userId: string) {
  try {
    const { user } = await verifyAdmin()
    
    // Explicit safeguard: users cannot delete themselves
    if (user.id === userId) {
      throw new Error("You cannot delete your own active session.")
    }

    const adminSupabase = createAdminClient()
    const { error } = await adminSupabase.auth.admin.deleteUser(userId)
    
    if (error) throw error

    // Supabase auth.users deletion cascades to public.profiles via ForeignKey if schema is robust,
    // but we execute a manual deletion to ensure the dashboard immediately reflects it.
    await adminSupabase.from("profiles").delete().eq("id", userId)

    revalidatePath("/admin/users")
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}

