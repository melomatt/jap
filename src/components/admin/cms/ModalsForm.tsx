"use client";

import { useState } from "react";
import { updateSiteContent } from "@/app/admin/cms/actions";
import { Save, Loader2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function ModalsForm({ initialData }: { initialData: any }) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        bookingTitle: initialData?.bookingTitle || "Book Your Free Evaluation",
        bookingSubtitle: initialData?.bookingSubtitle || "Schedule a consultation with our experienced legal professionals",
        quoteTitle: initialData?.quoteTitle || "Get Your Custom Quote",
        quoteSubtitle: initialData?.quoteSubtitle || "Tell us about your legal needs and receive a personalized quote from our experts",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const { error } = await updateSiteContent("modals", formData);

        if (error) {
            toast.error("Error saving modal text: " + error);
        } else {
            toast.success("Modal content updated successfully!");
        }

        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSave} className="space-y-8">

            {/* Book Appointment Modal */}
            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 space-y-4">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold uppercase text-xs">
                    <MessageSquare className="h-4 w-4" /> Book Appointment Modal
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline</label>
                    <input name="bookingTitle" value={formData.bookingTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtext</label>
                    <textarea name="bookingSubtitle" rows={2} value={formData.bookingSubtitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>

            {/* Get Quote Modal */}
            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30 space-y-4">
                <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500 font-bold uppercase text-xs">
                    <MessageSquare className="h-4 w-4" /> Get Quote Modal
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline</label>
                    <input name="quoteTitle" value={formData.quoteTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtext</label>
                    <textarea name="quoteSubtitle" rows={2} value={formData.quoteSubtitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button type="submit" disabled={isSaving} className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {isSaving ? "Saving..." : "Save Modal Content"}
                </button>
            </div>
        </form>
    );
}
