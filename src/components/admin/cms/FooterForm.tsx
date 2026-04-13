"use client";

import { useState } from "react";
import { updateSiteContent } from "@/app/admin/cms/actions";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

export default function FooterForm({ initialData }: { initialData: any }) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        description: initialData?.description || "Integrity in Practice. Excellence across Industries.",
        addressLine1: initialData?.addressLine1 || "Unit 9 Amir Building",
        addressLine2: initialData?.addressLine2 || "18th Street & Tubman Blvd., Sinkor, Monrovia, Liberia",
        phoneLines: initialData?.phoneLines || "Clir. G. Moses Paegar: +231 777 511 760\nClir. Albert S. Sims: +231 777 556 038\nClir. Neto Zorzor Lighe, Sr.: +231 886 556 399\nAttorney Nyekeh Y. Forkpah: +231 880 690 750\nAdministrator Sando C.J. Wilson: +231 886 660 469",
        email: initialData?.email || "justice.advocates.partners@gmail.com",
        copyright: initialData?.copyright || "© 2026 Justice Advocates & Partners, Inc. All rights reserved. Licensed in Liberia.",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const { error } = await updateSiteContent("footer", formData);

        if (error) toast.error("Error saving footer: " + error);
        else toast.success("Footer updated successfully!");

        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Footer & Contact Details</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                        rows={2}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Line 1</label>
                        <input
                            type="text"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Line 2</label>
                        <input
                            type="text"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Directory (One per line)</label>
                    <textarea
                        name="phoneLines"
                        value={formData.phoneLines}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 font-mono text-sm leading-relaxed"
                        rows={6}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Public Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Copyright Disclaimer</label>
                        <input
                            type="text"
                            name="copyright"
                            value={formData.copyright}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                        />
                    </div>
                </div>

            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex justify-center flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition disabled:opacity-50 items-center gap-2"
                >
                    <Save className="h-5 w-5" />
                    {isSaving ? "Saving..." : "Save Footer Data"}
                </button>
            </div>
        </form>
    );
}
