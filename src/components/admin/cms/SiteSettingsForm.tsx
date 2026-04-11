"use client";

import { useState } from "react";
import { updateSiteContent } from "@/app/admin/cms/actions";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useLoader } from "@/components/providers/LoadingProvider";

export default function SiteSettingsForm({ initialData }: { initialData: any }) {
    const [isSaving, setIsSaving] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const [formData, setFormData] = useState({
        seoTitle: initialData?.seoTitle || "Justice Advocates & Partners, Inc. | Legal Consulting & Advisory",
        seoDescription: initialData?.seoDescription || "Expert legal consulting, corporate advisory, and dispute resolution services. Justice Advocates & Partners, Inc. — trusted legal advisors committed to protecting your rights and interests.",
        loginTitle: initialData?.loginTitle || "Admin Portal",
        loginSubtitle: initialData?.loginSubtitle || "Sign in to access the dashboard",
        registerTitle: initialData?.registerTitle || "Admin Registration",
        registerSubtitle: initialData?.registerSubtitle || "Create an administrator or lawyer account",
        pendingTitle: initialData?.pendingTitle || "Account Pending Approval",
        pendingMessage: initialData?.pendingMessage || "Your account has been created successfully, but it is currently inactive.",
        pendingDescription: initialData?.pendingDescription || "A firm administrator must approve and activate your account before you can access the dashboard.",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        showLoader("Saving site settings...");

        const { error } = await updateSiteContent("settings", formData);
        hideLoader();

        if (error) {
            toast.error("Error saving settings: " + error);
        } else {
            toast.success("Site settings updated successfully!");
        }

        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSave} className="space-y-8">

        {/* SEO Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">SEO &amp; Metadata</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Controls the browser tab title, Google search snippet, and social media link previews (WhatsApp, LinkedIn, etc.).</p>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Page Title <span className="text-gray-400 font-normal">(recommended: 50–60 characters)</span></label>
                        <input name="seoTitle" value={formData.seoTitle} onChange={handleChange} maxLength={70} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <p className="text-xs text-gray-400 mt-1">{formData.seoTitle.length}/70 characters</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Description <span className="text-gray-400 font-normal">(recommended: 150–160 characters)</span></label>
                        <textarea name="seoDescription" rows={3} value={formData.seoDescription} onChange={handleChange} maxLength={200} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <p className="text-xs text-gray-400 mt-1">{formData.seoDescription.length}/200 characters</p>
                    </div>
                </div>
            </div>

            {/* Login Page Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Login Page</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input name="loginTitle" value={formData.loginTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                        <input name="loginSubtitle" value={formData.loginSubtitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>
            </div>

            {/* Register Page Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Registration Page</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input name="registerTitle" value={formData.registerTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                        <input name="registerSubtitle" value={formData.registerSubtitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>
            </div>

            {/* Pending Page Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Pending Approval Page</h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Title</label>
                        <input name="pendingTitle" value={formData.pendingTitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Message</label>
                        <textarea name="pendingMessage" rows={2} value={formData.pendingMessage} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description / Instructions</label>
                        <textarea name="pendingDescription" rows={3} value={formData.pendingDescription} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button type="submit" disabled={isSaving} className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {isSaving ? "Saving..." : "Save Site Settings"}
                </button>
            </div>
        </form>
    );
}
