"use client";

import { useState } from "react";
import { updateSiteContent } from "@/app/admin/cms/actions";
import { Save, Loader2, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function LegalPagesForm({ initialData }: { initialData: any }) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        privacyTitle: initialData?.privacyTitle || "Privacy Policy",
        privacyContent: initialData?.privacyContent || "Your privacy is important to us. [Default Privacy Policy Content...]",
        termsTitle: initialData?.termsTitle || "Terms of Service",
        termsContent: initialData?.termsContent || "By using our services, you agree to the following terms. [Default Terms Content...]",
        disclaimerTitle: initialData?.disclaimerTitle || "Legal Disclaimer",
        disclaimerContent: initialData?.disclaimerContent || "The information on this website is for general informational purposes only. [Default Disclaimer Content...]",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const { error } = await updateSiteContent("legal", formData);

        if (error) {
            toast.error("Error saving legal pages: " + error);
        } else {
            toast.success("Legal pages updated successfully!");
        }

        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSave} className="space-y-8">

            {/* Privacy Policy */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold uppercase text-xs tracking-wider">
                    <FileText className="h-4 w-4" /> Privacy Policy
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Page Title</label>
                    <input name="privacyTitle" value={formData.privacyTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Supports multiple lines)</label>
                    <textarea name="privacyContent" rows={6} value={formData.privacyContent} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm leading-relaxed" />
                </div>
            </div>

            {/* Terms of Service */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold uppercase text-xs tracking-wider">
                    <FileText className="h-4 w-4" /> Terms of Service
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Page Title</label>
                    <input name="termsTitle" value={formData.termsTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                    <textarea name="termsContent" rows={6} value={formData.termsContent} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm leading-relaxed" />
                </div>
            </div>

            {/* Disclaimer */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold uppercase text-xs tracking-wider">
                    <FileText className="h-4 w-4" /> Disclaimer
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Page Title</label>
                    <input name="disclaimerTitle" value={formData.disclaimerTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                    <textarea name="disclaimerContent" rows={4} value={formData.disclaimerContent} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm leading-relaxed" />
                </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button type="submit" disabled={isSaving} className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 shadow-sm">
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {isSaving ? "Saving..." : "Save All Legal Pages"}
                </button>
            </div>
        </form>
    );
}
