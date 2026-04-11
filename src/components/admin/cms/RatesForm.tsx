"use client";

import { useState } from "react";
import { updateSiteContent } from "@/app/admin/cms/actions";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const DEFAULT_RATES = [
    { no: "1", description: "Senior Managing Partner", feePerHour: "US$ 250.00" },
    { no: "2", description: "Head of Litigation", feePerHour: "US$ 200.00" },
    { no: "3", description: "Associates Counsels", feePerHour: "US$ 150.00" },
];

export default function RatesForm({ initialData }: { initialData: any }) {
    const rawItems = initialData?.rows && Array.isArray(initialData.rows) ? initialData.rows : DEFAULT_RATES;
    const [items, setItems] = useState<any[]>(rawItems);
    const [sectionTitle, setSectionTitle] = useState(initialData?.sectionTitle || "OUR RATES");
    const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
    const [currency, setCurrency] = useState(initialData?.currency || "US$");
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleAdd = () =>
        setItems([...items, { no: String(items.length + 1), description: "", feePerHour: "" }]);

    const handleRemove = (idx: number) =>
        setItems(items.filter((_, i) => i !== idx).map((item, i) => ({ ...item, no: String(i + 1) })));

    const handleChange = (idx: number, field: string, value: string) => {
        const updated = [...items];
        updated[idx][field] = value;
        setItems(updated);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const payload = { sectionTitle, subtitle, currency, rows: items };
        const result = await updateSiteContent("rates", payload);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Rates updated successfully!");
            router.refresh();
        }
        setIsSaving(false);
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Header Settings */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Section Header</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Section Title</label>
                        <input
                            value={sectionTitle}
                            onChange={e => setSectionTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                            placeholder="OUR RATES"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Default Currency Prefix</label>
                        <input
                            value={currency}
                            onChange={e => setCurrency(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                            placeholder="US$"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subtitle / Note (optional)</label>
                    <input
                        value={subtitle}
                        onChange={e => setSubtitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                        placeholder="e.g. All fees are per hour billed in United States Dollars"
                    />
                </div>
            </div>

            {/* Rate Rows Table */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Rate Entries</h3>

                {/* Column headers */}
                <div className="hidden sm:grid grid-cols-12 gap-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-1">No.</div>
                    <div className="col-span-7">Description</div>
                    <div className="col-span-3">Fee Per Hour</div>
                    <div className="col-span-1" />
                </div>

                {items.length === 0 && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                        No rate entries yet. Click "Add Rate" below.
                    </div>
                )}

                {items.map((item, idx) => (
                    <div key={idx} className="grid sm:grid-cols-12 gap-3 items-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        {/* No. */}
                        <div className="sm:col-span-1">
                            <label className="sm:hidden text-xs font-semibold text-gray-500 mb-1 block">No.</label>
                            <input
                                required
                                value={item.no || ""}
                                onChange={e => handleChange(idx, "no", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-center"
                            />
                        </div>
                        {/* Description */}
                        <div className="sm:col-span-7">
                            <label className="sm:hidden text-xs font-semibold text-gray-500 mb-1 block">Description</label>
                            <input
                                required
                                value={item.description || ""}
                                onChange={e => handleChange(idx, "description", e.target.value)}
                                placeholder="e.g. Senior Managing Partner"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                            />
                        </div>
                        {/* Fee */}
                        <div className="sm:col-span-3">
                            <label className="sm:hidden text-xs font-semibold text-gray-500 mb-1 block">Fee Per Hour</label>
                            <input
                                required
                                value={item.feePerHour || ""}
                                onChange={e => handleChange(idx, "feePerHour", e.target.value)}
                                placeholder="US$ 250.00"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                            />
                        </div>
                        {/* Remove */}
                        <div className="sm:col-span-1 flex justify-end">
                            <button
                                type="button"
                                onClick={() => handleRemove(idx)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Remove row"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                    <Plus className="h-4 w-4" /> Add Rate Entry
                </button>
            </div>

            {/* Save */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isSaving ? "Saving..." : "Save Rates"}
                </button>
            </div>
        </form>
    );
}
