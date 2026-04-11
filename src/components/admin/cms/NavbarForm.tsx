"use client";

import { useState } from "react";
import { updateSiteContent } from "@/app/admin/cms/actions";
import { Save, Loader2, Plus, Trash2, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NavbarForm({ initialData }: { initialData: any }) {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        links: Array.isArray(initialData?.links) ? initialData.links : [
            { label: "Home", href: "#hero" },
            { label: "About", href: "#about" },
            { label: "Services", href: "#services" },
            { label: "Advisors", href: "#team" },
            { label: "Contact", href: "#contact" },
        ],
        phoneNumber: initialData?.phoneNumber || "+(231) 777 511 760",
        ctaText: initialData?.ctaText || "Free Evaluation",
        logoAlt: initialData?.logoAlt || "JAP Inc.",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLinkChange = (index: number, field: string, value: string) => {
        const newLinks = [...formData.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFormData({ ...formData, links: newLinks });
    };

    const addLink = () => {
        setFormData({
            ...formData,
            links: [...formData.links, { label: "New Link", href: "#" }]
        });
    };

    const removeLink = (index: number) => {
        setFormData({
            ...formData,
            links: formData.links.filter((_: any, i: number) => i !== index)
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const result = await updateSiteContent("navbar", formData);

        if (result.error) {
            toast.error("Error saving navbar: " + result.error);
        } else {
            toast.success("Navbar updated successfully!");
            router.refresh();
        }

        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSave} className="space-y-8">

            {/* General Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="md:col-span-2 flex items-center gap-2 text-blue-600 font-bold uppercase text-xs mb-2">
                   <Globe className="h-4 w-4" /> Global Navbar Settings
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Button Text</label>
                    <input name="ctaText" value={formData.ctaText} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo Alt Text</label>
                    <input name="logoAlt" value={formData.logoAlt} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation Links</h3>
                    <button type="button" onClick={addLink} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <Plus className="h-4 w-4" /> Add Link
                    </button>
                </div>
                
                <div className="space-y-3">
                    {formData.links.map((link: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm">
                            <div className="flex-1">
                                <input 
                                    placeholder="Label" 
                                    value={link.label} 
                                    onChange={(e) => handleLinkChange(idx, "label", e.target.value)}
                                    className="w-full px-3 py-1.5 border-b border-transparent focus:border-blue-500 outline-none dark:bg-transparent"
                                />
                            </div>
                            <div className="flex-[2]">
                                <input 
                                    placeholder="URL or #Anchor" 
                                    value={link.href} 
                                    onChange={(e) => handleLinkChange(idx, "href", e.target.value)}
                                    className="w-full px-3 py-1.5 border-b border-transparent focus:border-blue-500 outline-none dark:bg-transparent text-sm text-gray-500"
                                />
                            </div>
                            <button type="button" onClick={() => removeLink(idx)} className="text-red-400 hover:text-red-600 p-1">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button type="submit" disabled={isSaving} className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {isSaving ? "Saving..." : "Save Navbar Configuration"}
                </button>
            </div>
        </form>
    );
}
