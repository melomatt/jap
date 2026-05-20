"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { verifyUserRole } from "@/lib/supabase/server"; // Import centralized authorization helper

export async function getAllQuotes() {
    try {
        // Centralized security check enforces active admin validation
        await verifyUserRole(["admin", "super_admin"]);

        const adminSupabase = createAdminClient();
        const { data, error } = await adminSupabase
            .from("quotes")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) return { error: error.message };
        return { data };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function deleteQuote(quoteId: string) {
    try {
        // Centralized security check enforces active admin validation
        await verifyUserRole(["admin", "super_admin"]);

        const adminSupabase = createAdminClient();
        const { error } = await adminSupabase
            .from("quotes")
            .delete()
            .eq("id", quoteId);

        if (error) return { error: error.message };
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function markQuoteAsReplied(quoteId: string) {
    try {
        // Centralized security check enforces active admin validation
        await verifyUserRole(["admin", "super_admin"]);

        const adminSupabase = createAdminClient();
        const { error: updateError } = await adminSupabase
            .from("quotes")
            .update({ status: "replied" })
            .eq("id", quoteId);

        if (updateError) return { error: updateError.message };
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}
