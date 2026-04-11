import AdminQuotesDashboard from "@/components/admin/quotes/AdminQuotesDashboard";
import { getAllQuotes } from "@/app/actions/quote";
import AdminErrorState from "@/components/AdminErrorState";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
    const { data: initialQuotes, error } = await getAllQuotes();

    if (error) {
        return <AdminErrorState title="Error Loading Quotes" message="Make sure you have run the Supabase database migrations for the quote feature." error={error} />
    }

    return (
        <div className="h-[calc(100vh-theme(spacing.16))] p-4 md:p-6 lg:p-8">
            <AdminQuotesDashboard initialQuotes={initialQuotes || []} />
        </div>
    );
}
