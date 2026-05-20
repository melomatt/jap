import AdminChatDashboard from "@/components/admin/chat/AdminChatDashboard";
import { getAllConversations } from "@/app/actions/chat";
import AdminErrorState from "@/components/AdminErrorState";

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
    const { data: initialConversations, error } = await getAllConversations();

    if (error) {
        return <AdminErrorState title="Error Loading Chat" message="Make sure you have run the Supabase database migrations for the chat feature." error={error} />
    }

    return (
        <div className="h-[calc(100vh-theme(spacing.16))] p-4 md:p-6 lg:p-8">
            <AdminChatDashboard initialConversations={initialConversations || []} />
        </div>
    );
}
