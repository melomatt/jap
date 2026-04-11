"use server";

import { createAdminClient } from "@/lib/supabase/admin";


export async function getAllQuotes() {
    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return { error: error.message };
    return { data };
}

export async function deleteQuote(quoteId: string) {
    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
        .from("quotes")
        .delete()
        .eq("id", quoteId);
    
    if (error) return { error: error.message };
    return { success: true };
}

export async function markQuoteAsReplied(quoteId: string) {
    const adminSupabase = createAdminClient();
    const { error: updateError } = await adminSupabase
        .from("quotes")
        .update({ status: "replied" })
        .eq("id", quoteId);

    if (updateError) return { error: updateError.message };
    return { success: true };
}
