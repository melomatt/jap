"use client";

import { useState } from "react";
import { updateSiteContent } from "@/app/admin/cms/actions";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

export default function TestimonialsForm({ initialData }: { initialData: any[] }) {
    const [isSaving, setIsSaving] = useState(false);
    const [items, setItems] = useState<any[]>(
        Array.isArray(initialData) && initialData.length > 0
            ? initialData
            : [
                { id: "1", quote: "I have been using them for a year now. Everything is detailed and well organized.", name: "Penelope N. Harris", role: "CEO of SpaceX" }
            ]
    );

    const handleAddItem = () => {
        setItems([...items, { id: crypto.randomUUID(), quote: "", name: "", role: "" }]);
    };

    const handleRemoveItem = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const handleUpdateItem = (idx: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[idx][field] = value;
        setItems(newItems);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const { error } = await updateSiteContent("testimonials", items);
        if (error) {
            toast.error("Failed to save testimonials: " + error);
        } else {
            toast.success("Testimonials updated successfully!");
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Client Testimonials</h2>

            <div className="space-y-4">
                {items.map((item, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative bg-gray-50 dark:bg-gray-800/50 flex gap-4">
                        <div className="flex flex-col items-center justify-center cursor-move text-gray-400">
                            <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quote</label>
                                <textarea
                                    value={item.quote}
                                    onChange={(e) => handleUpdateItem(idx, "quote", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 min-h-[80px]"
                                    placeholder="What did the client say?"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author Name</label>
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handleUpdateItem(idx, "name", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author Role</label>
                                    <input
                                        type="text"
                                        value={item.role}
                                        onChange={(e) => handleUpdateItem(idx, "role", e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                        placeholder="e.g. CEO of Company"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg self-start transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 font-medium"
            >
                <Plus className="h-4 w-4" /> Add Testimonial
            </button>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex justify-center flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition disabled:opacity-50 items-center gap-2"
                >
                    <Save className="h-5 w-5" />
                    {isSaving ? "Saving..." : "Save Testimonials"}
                </button>
            </div>
        </div>
    );
}
