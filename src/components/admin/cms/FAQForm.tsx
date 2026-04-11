"use client";

import { useState } from "react";
import { updateSiteContent } from "@/app/admin/cms/actions";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

export default function FAQForm({ initialData }: { initialData: any[] }) {
    const [isSaving, setIsSaving] = useState(false);
    const [items, setItems] = useState<any[]>(
        Array.isArray(initialData) && initialData.length > 0
            ? initialData
            : [
                { id: "1", q: "How do I know if I need legal representation?", a: "If you're facing legal issues, it's best to consult with a professional to understand your rights and options." }
            ]
    );

    const handleAddItem = () => {
        setItems([...items, { id: crypto.randomUUID(), q: "", a: "" }]);
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
        const { error } = await updateSiteContent("faq", items);
        if (error) {
            toast.error("Failed to save FAQs: " + error);
        } else {
            toast.success("FAQs updated successfully!");
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Frequently Asked Questions</h2>

            <div className="space-y-4">
                {items.map((item, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative bg-gray-50 dark:bg-gray-800/50 flex gap-4">
                        <div className="flex flex-col items-center justify-center cursor-move text-gray-400">
                            <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question</label>
                                <input
                                    type="text"
                                    value={item.q}
                                    onChange={(e) => handleUpdateItem(idx, "q", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 font-medium"
                                    placeholder="What is the question?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Answer</label>
                                <textarea
                                    value={item.a}
                                    onChange={(e) => handleUpdateItem(idx, "a", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 min-h-[80px]"
                                    placeholder="Provide the answer here"
                                />
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
                <Plus className="h-4 w-4" /> Add FAQ
            </button>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex justify-center flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition disabled:opacity-50 items-center gap-2"
                >
                    <Save className="h-5 w-5" />
                    {isSaving ? "Saving..." : "Save FAQs"}
                </button>
            </div>
        </div>
    );
}
