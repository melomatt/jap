"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { updateSiteContent } from "@/app/admin/cms/actions";
import { Loader2, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const headersSchema = z.object({
    services: z.object({
        tag: z.string().optional(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
    }),
    team: z.object({
        tag: z.string().optional(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
    }),
    testimonials: z.object({
        tag: z.string().optional(),
        title: z.string().optional(),
    }),
    stats: z.object({
        tag: z.string().optional(),
        title: z.string().optional(),
    }),
    faq: z.object({
        tag: z.string().optional(),
        title: z.string().optional(),
    }),
    insights: z.object({
        tag: z.string().optional(),
        title: z.string().optional(),
    }),
});

type HeadersFormData = z.infer<typeof headersSchema>;

export default function HeadersForm({ initialData }: { initialData: any }) {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const form = useForm<HeadersFormData>({
        resolver: zodResolver(headersSchema),
        defaultValues: {
            services: initialData?.servicesHeader || {
                tag: "Legal Service",
                title: "Integrity in Practice. Excellence across Industries.",
                subtitle: "Justice Advocates & Partners, Inc. delivers strategic legal counsel with integrity and results-driven advocacy across diverse legal domains.",
            },
            team: initialData?.teamHeader || {
                tag: "The Advisors",
                title: "Meet the Advisors",
                subtitle: "Our team combines decades of experience with a commitment to excellence.",
            },
            testimonials: initialData?.testimonialsHeader || {
                tag: "Testimonials",
                title: "What Our Clients Say",
            },
            stats: initialData?.statsHeader || {
                tag: "Our Impact",
                title: "Some Fun Facts",
            },
            faq: initialData?.faqHeader || {
                tag: "FAQ",
                title: "Frequently Asked Questions",
            },
            insights: initialData?.insightsHeader || {
                tag: "Company Insights",
                title: "Latest News & Legal Updates",
            },
        },
    });

    const onSubmit = async (values: HeadersFormData) => {
        setIsSaving(true);

        // Save each header section individually for cleaner logic in HomeClient
        const updatePromises = [
            updateSiteContent("servicesHeader", values.services),
            updateSiteContent("teamHeader", values.team),
            updateSiteContent("testimonialsHeader", values.testimonials),
            updateSiteContent("statsHeader", values.stats),
            updateSiteContent("faqHeader", values.faq),
            updateSiteContent("insightsHeader", values.insights),
        ];

        const results = await Promise.all(updatePromises);
        const firstError = results.find(r => r.error);

        if (firstError) {
            toast.error(firstError.error!);
        } else {
            toast.success("All section headers updated successfully!");
            router.refresh();
        }
        setIsSaving(false);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 border border-blue-100 dark:border-blue-800">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    Use this section to update the main titles, subtitles, and category tags displayed at the top of each homepage section.
                </p>
            </div>

            {/* Services Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold border-b pb-2">Services Section Header</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tag / Category</label>
                        <input {...form.register("services.tag")} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" placeholder="Legal Service" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Main Title</label>
                        <input {...form.register("services.title")} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Subtitle</label>
                        <textarea {...form.register("services.subtitle")} rows={2} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" />
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold border-b pb-2">Team Section Header</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tag / Category</label>
                        <input {...form.register("team.tag")} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" placeholder="The Advisors" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Main Title</label>
                        <input {...form.register("team.title")} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Subtitle</label>
                        <textarea {...form.register("team.subtitle")} rows={2} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" />
                    </div>
                </div>
            </div>

            {/* Others */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <h3 className="font-bold border-b pb-2">Testimonials Header</h3>
                    <input {...form.register("testimonials.tag")} className="w-full px-4 py-2 border rounded-lg mb-2" placeholder="Tag" />
                    <input {...form.register("testimonials.title")} className="w-full px-4 py-2 border rounded-lg" placeholder="Main Title" />
                </div>
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <h3 className="font-bold border-b pb-2">Fun Facts (Stats) Header</h3>
                    <input {...form.register("stats.tag")} className="w-full px-4 py-2 border rounded-lg mb-2" placeholder="Tag" />
                    <input {...form.register("stats.title")} className="w-full px-4 py-2 border rounded-lg" placeholder="Main Title" />
                </div>
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <h3 className="font-bold border-b pb-2">FAQ Header</h3>
                    <input {...form.register("faq.tag")} className="w-full px-4 py-2 border rounded-lg mb-2" placeholder="Tag" />
                    <input {...form.register("faq.title")} className="w-full px-4 py-2 border rounded-lg" placeholder="Main Title" />
                </div>
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <h3 className="font-bold border-b pb-2">Insights Header</h3>
                    <input {...form.register("insights.tag")} className="w-full px-4 py-2 border rounded-lg mb-2" placeholder="Tag" />
                    <input {...form.register("insights.title")} className="w-full px-4 py-2 border rounded-lg" placeholder="Main Title" />
                </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg disabled:opacity-50">
                    {isSaving && <Loader2 className="h-5 w-5 animate-spin" />}
                    {isSaving ? "Saving All Headers..." : "Save All Section Headers"}
                </button>
            </div>
        </form>
    );
}
