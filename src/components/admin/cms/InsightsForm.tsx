"use client";

import { useState } from "react";
import { updateSiteContent } from "@/app/admin/cms/actions";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

// Convert "Aug 7, 2026" → "2026-08-07" for <input type="date">
function toISODate(displayDate: string): string {
    if (!displayDate) return "";
    // If already ISO format, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) return displayDate;
    try {
        const parsed = new Date(displayDate);
        if (isNaN(parsed.getTime())) return "";
        return parsed.toISOString().split("T")[0];
    } catch {
        return "";
    }
}

// Convert "2026-08-07" → "Aug 7, 2026" for display on the homepage
function toDisplayDate(isoDate: string): string {
    if (!isoDate) return "";
    try {
        // Parse as local date to avoid timezone shift
        const [year, month, day] = isoDate.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
        return isoDate;
    }
}

export default function InsightsForm({ initialData }: { initialData: any[] }) {
    const [isSaving, setIsSaving] = useState(false);
    const [items, setItems] = useState<any[]>(
        Array.isArray(initialData) && initialData.length > 0
            ? initialData
            : [
                { id: "1", title: "Legal Trends in 2026", date: "Aug 7, 2026", category: "Law" }
            ]
    );

    const handleAddItem = () => {
        setItems([...items, { id: crypto.randomUUID(), title: "", date: "", category: "" }]);
    };

    const handleRemoveItem = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const handleUpdateItem = (idx: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[idx][field] = value;
        setItems(newItems);
    };

    // When user picks a date, convert ISO → display format for storage
    const handleDateChange = (idx: number, isoValue: string) => {
        const display = toDisplayDate(isoValue);
        handleUpdateItem(idx, "date", display);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const { error } = await updateSiteContent("insights", items);
        if (error) {
            toast.error("Failed to save insights: " + error);
        } else {
            toast.success("Insights successfully updated live!");
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Company Insights &amp; News</h2>

            <div className="space-y-4">
                {items.map((item, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative bg-gray-50 dark:bg-gray-800/50 flex gap-4 items-center">
                        <div className="flex flex-col items-center justify-center cursor-move text-gray-400">
                            <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Article Title</label>
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => handleUpdateItem(idx, "title", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 font-medium"
                                    placeholder="e.g. Navigating Corporate Law"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={toISODate(item.date)}
                                    onChange={(e) => handleDateChange(idx, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 cursor-pointer"
                                />
                                {item.date && (
                                    <p className="mt-1 text-xs text-gray-400">Displays as: <span className="font-medium text-gray-600 dark:text-gray-300">{item.date}</span></p>
                                )}
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category / Tagline</label>
                                <input
                                    type="text"
                                    value={item.category}
                                    onChange={(e) => handleUpdateItem(idx, "category", e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                                    placeholder="e.g. Law or Business"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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
                <Plus className="h-4 w-4" /> Add Insight Article
            </button>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex justify-center flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition disabled:opacity-50 items-center gap-2"
                >
                    <Save className="h-5 w-5" />
                    {isSaving ? "Saving..." : "Save Insights"}
                </button>
            </div>
        </div>
    );
}
