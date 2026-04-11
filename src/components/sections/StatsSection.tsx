"use client";

import { motion } from "framer-motion";

interface StatsSectionProps {
    statsData: any[];
    cmsData: any;
    resolveStr: (cmsStr: string | undefined, transKey: string, fallbackEn: string) => string;
}

export default function StatsSection({ statsData, cmsData, resolveStr }: StatsSectionProps) {
    return (
        <motion.section
            id="fun-facts"
            className="py-20 bg-blue-600 text-white scroll-mt-24"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm uppercase tracking-widest text-blue-100 mb-2">
                    {resolveStr(cmsData.statsHeader?.tag, "stats.tag", "Stats")}
                </p>
                <h2 className="text-4xl font-bold mb-14">
                    {resolveStr(cmsData.statsHeader?.title, "stats.title", "OUR PLANNING-LED APPROACH")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {statsData.map((stat: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-6xl font-bold mb-2">{stat.number}</div>
                            <p className="text-lg font-medium text-blue-100">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
