"use client";

import { useState } from "react";
import { updateSiteContent } from "@/app/admin/cms/actions";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ServicesForm({ initialData }: { initialData: any }) {
    const [items, setItems] = useState<any[]>(Array.isArray(initialData) ? initialData : []);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleAddItem = () => {
        setItems([...items, { title: "", description: "", icon: "Scale" }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const result = await updateSiteContent("services", items);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Services updated successfully!");
            router.refresh();
        }
        setIsSaving(false);
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
                {items.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                        No services added yet. Click &quot;Add Service&quot; below.
                    </div>
                )}

                {items.map((item, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative bg-gray-50 dark:bg-gray-800/50">
                        <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 bg-white dark:bg-gray-800 rounded-md shadow-sm"
                            title="Remove Service"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="pr-10">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Service Title</label>
                            <input
                                required
                                value={item.title || ""}
                                onChange={(e) => handleChange(idx, "title", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                            <textarea
                                required rows={2}
                                value={item.description || ""}
                                onChange={(e) => handleChange(idx, "description", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                            />
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <Plus className="h-5 w-5" /> Add New Service
                </button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSaving ? "Saving..." : "Save All Services"}
                </button>
            </div>
        </form>
    );
}
