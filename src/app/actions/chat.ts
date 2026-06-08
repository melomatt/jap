"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyUserRole } from "@/lib/supabase/server"; // Import centralized auth helper
import { getSandoResponse } from "@/lib/bot-brain";

// Check if currently within business hours in Liberia (Africa/Monrovia - GMT)
function isBusinessHoursLiberia(): boolean {
    const now = new Date();
    const liberiaTimeStr = now.toLocaleString("en-US", { timeZone: "Africa/Monrovia" });
    const liberiaTime = new Date(liberiaTimeStr);

    const day = liberiaTime.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const hour = liberiaTime.getHours();

    const isWeekday = day >= 1 && day <= 5;
    const isSaturday = day === 6;

    if (isWeekday) {
        return hour >= 9 && hour < 17; // 9 AM to 5 PM
    } else if (isSaturday) {
        return hour >= 9 && hour < 13; // 9 AM to 1 PM (Half day)
    }

    return false;
}

export async function getOrCreateConversation(customerId: string) {
    const supabase = await createClient();

    // Check if an active conversation exists
    let { data: conversation, error: fetchError } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("customer_id", customerId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (!conversation) {
        // Create new
        const { data: newConv, error: insertError } = await supabase
            .from("chat_conversations")
            .insert([{ customer_id: customerId, status: "active" }])
            .select()
            .single();

        if (insertError) return { error: insertError.message };
        conversation = newConv;
    }

    return { data: conversation };
}

export async function getConversationMessages(conversationId: string) {
    const supabase = await createClient();
    const { data: messages, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

    if (error) return { error: error.message };
    return { data: messages || [] };
}

export async function sendMessage(conversationId: string, content: string, senderType: 'customer' | 'admin') {
    if (senderType === 'admin') {
        try {
            await verifyUserRole(["admin", "super_admin"]); // Centralized auth check
        } catch (err: any) {
            return { error: "Unauthorized" };
        }
    }
    const supabase = await createClient();

    // Insert user's message
    const { data: newMsg, error: insertError } = await supabase
        .from("chat_messages")
        .insert([{
            conversation_id: conversationId,
            sender_type: senderType,
            content: content
        }])
        .select()
        .single();

    if (insertError) return { error: insertError.message };

    // Update conversation timestamp
    await supabase.from("chat_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

    // Check for bot response
    const isOffHours = !isBusinessHoursLiberia();
    const { content: botContent, isHighConfidence } = await getSandoResponse(content, isOffHours);

    let isBotReplying = false;
    if (senderType === 'customer' && (isOffHours || isHighConfidence)) {
        // Silence Sando if an admin has ever replied to this conversation
        const { count: adminMsgCount } = await supabase
            .from("chat_messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conversationId)
            .eq("sender_type", "admin");

        if (!adminMsgCount || adminMsgCount === 0) {
            isBotReplying = await triggerBotResponse(conversationId, botContent, isHighConfidence);
        }
    }

    return { success: true, data: newMsg, isBotReplying };
}

export async function triggerTimeoutBot(conversationId: string) {
    const supabase = await createClient();

    // Silence Sando if an admin has ever replied to this conversation
    const { count: adminMsgCount } = await supabase
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conversationId)
        .eq("sender_type", "admin");

    if (adminMsgCount && adminMsgCount > 0) {
        return; // Admin is handling, do not trigger bot timeout response
    }

    const { data: messages } = await supabase
        .from("chat_messages")
        .select("sender_type, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(1);

    if (messages && messages.length > 0 && messages[0].sender_type === 'customer') {
        if (isBusinessHoursLiberia()) {
            const { content: botContent } = await getSandoResponse("", false);
            await triggerBotResponse(conversationId, botContent, false);
        }
    }
}

async function triggerBotResponse(conversationId: string, content: string, force: boolean = false) {
    const supabase = await createClient();

    if (!force) {
        const { data: lastBotMsg } = await supabase
            .from("chat_messages")
            .select("created_at")
            .eq("conversation_id", conversationId)
            .eq("sender_type", "bot")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (lastBotMsg) {
            const lastTime = new Date(lastBotMsg.created_at).getTime();
            const now = new Date().getTime();
            const minutesSinceLastReply = (now - lastTime) / (1000 * 60);
            if (minutesSinceLastReply < 2) return false;
        }
    }

    await supabase
        .from("chat_messages")
        .insert([{
            conversation_id: conversationId,
            sender_type: 'bot',
            content: content
        }]);

    await supabase.from("chat_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

    return true;
}

// ------ ADMIN ACTIONS ------

export async function getAllConversations() {
    try {
        await verifyUserRole(["admin", "super_admin"]); // Centralized auth check
        const adminSupabase = createAdminClient();
        const { data, error } = await adminSupabase
            .from("chat_conversations")
            .select(`
                id, 
                customer_id, 
                status,
                updated_at,
                chat_messages (
                    content,
                    sender_type,
                    created_at
                )
            `)
            .order("updated_at", { ascending: false });

        if (error) return { error: error.message };

        const parsed = (data || []).map((conv: any) => {
            const msgs = conv.chat_messages || [];
            msgs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            return {
                id: conv.id,
                customerId: conv.customer_id,
                status: conv.status,
                updatedAt: conv.updated_at,
                lastMessage: msgs.length > 0 ? msgs[0] : null
            };
        });

        return { data: parsed };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function resolveConversation(conversationId: string) {
    try {
        await verifyUserRole(["admin", "super_admin"]); // Centralized auth check
        const adminSupabase = createAdminClient();
        const { error } = await adminSupabase
            .from("chat_conversations")
            .update({ status: "resolved", updated_at: new Date().toISOString() })
            .eq("id", conversationId);

        if (error) return { error: error.message };
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function deleteConversation(conversationId: string) {
    try {
        await verifyUserRole(["admin", "super_admin"]); // Centralized auth check
        const adminSupabase = createAdminClient();
        const { error } = await adminSupabase
            .from("chat_conversations")
            .delete()
            .eq("id", conversationId);

        if (error) return { error: error.message };
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}
