"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { updateSiteContent } from "@/app/admin/cms/actions";
import { Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const aboutSchema = z.object({
    history: z.string().min(1, "History / established date is required"),
    description: z.string().min(1, "Description is required"),
    mission: z.string().min(1, "Mission title is required"),
    missionDesc: z.string().min(1, "Mission description is required"),
    vision: z.string().min(1, "Vision title is required"),
    visionDesc: z.string().min(1, "Vision description is required"),
    values: z.string().min(1, "Values title is required"),
    valuesDesc: z.string().min(1, "Values description is required"),
});

type AboutFormData = z.infer<typeof aboutSchema>;

export default function AboutForm({ initialData }: { initialData: any }) {
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    const form = useForm<AboutFormData>({
        resolver: zodResolver(aboutSchema),
        defaultValues: {
            // `history` is what HomeClient reads as about.history (the headline)
            history: initialData.history || initialData.title || "",
            description: initialData.description || "",
            mission: initialData.mission || "Our Mission",
            missionDesc: initialData.missionDesc || "",
            vision: initialData.vision || "Our Vision",
            visionDesc: initialData.visionDesc || "",
            values: initialData.values || "Our Values",
            valuesDesc: initialData.valuesDesc || "",
        },
    });

    const onSubmit = async (values: AboutFormData) => {
        setIsSaving(true);
        setErrorMsg("");
        setSuccessMsg("");

        const result = await updateSiteContent("about", values);

        if (result.error) {
            setErrorMsg(result.error);
        } else {
            setSuccessMsg("About section saved successfully!");
            router.refresh();
            setTimeout(() => setSuccessMsg(""), 3000);
        }
        setIsSaving(false);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {successMsg && (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="h-5 w-5" />
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    {errorMsg}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Firm History / Established Date (Headline)
                    </label>
                    <input
                        {...form.register("history")}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="ESTABLISHED DECEMBER 16, 2020"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Main Description
                    </label>
                    <textarea
                        {...form.register("description")}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mission Title</label>
                        <input {...form.register("mission")} className="w-full px-4 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        <textarea {...form.register("missionDesc")} rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Mission details..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vision Title</label>
                        <input {...form.register("vision")} className="w-full px-4 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        <textarea {...form.register("visionDesc")} rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Vision details..."></textarea>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSaving ? "Saving Changes..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
