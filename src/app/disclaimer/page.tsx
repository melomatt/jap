import { getSiteContent } from "@/app/admin/cms/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DisclaimerPage() {
    const { data } = await getSiteContent("legal");

    const title = data?.disclaimerTitle || "Legal Disclaimer";
    const content = data?.disclaimerContent || "The information on this website is for general informational purposes only and does not constitute legal advice.";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
                <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <AlertTriangle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h1>
                </div>

                <div className="prose prose-blue dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        {content}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 text-center">
                    Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>
        </div>
    );
}
