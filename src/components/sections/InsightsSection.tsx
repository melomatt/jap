"use client";

import { motion } from "framer-motion";

interface InsightsSectionProps {
    insightsData: any[];
    cmsData: any;
    resolveStr: (cmsStr: string | undefined, transKey: string, fallbackEn: string) => string;
}

export default function InsightsSection({ insightsData, cmsData, resolveStr }: InsightsSectionProps) {
    return (
        <motion.section
            id="insights"
            className="py-24 md:py-32 bg-[#F5F5F7] dark:bg-[#1C1C1E] scroll-mt-24"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <p className="text-sm uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        {resolveStr(cmsData.insightsHeader?.tag, "insights.tag", "Insights")}
                    </p>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                        {resolveStr(cmsData.insightsHeader?.title, "insights.title", "COMPANY INSIGHTS")}
                    </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {insightsData.map((post: any, index: number) => (
                        <motion.article
                            key={index}
                            className="bg-white dark:bg-black p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-widest">{post.category}</div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">{post.title}</h3>
                            <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                <span className="w-4 h-4 text-gray-400 opacity-70">📅</span> {post.date}
                            </p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
