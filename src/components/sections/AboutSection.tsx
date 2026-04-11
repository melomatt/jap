"use client";

import { motion } from "framer-motion";

interface AboutSectionProps {
    about: any;
    resolveStr: (cmsStr: string | undefined, transKey: string, fallbackEn: string) => string;
}

export default function AboutSection({ about, resolveStr }: AboutSectionProps) {
    return (
        <motion.section
            id="about"
            className="py-24 md:py-32 bg-[#F5F5F7] dark:bg-[#1C1C1E] scroll-mt-24"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <p className="text-sm uppercase tracking-widest text-blue-600 dark:text-blue-300">About Us</p>
                    <h2 className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">
                        {resolveStr(about.history, "about.established", "ESTABLISHED DECEMBER 16, 2020")}
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-4xl mx-auto whitespace-pre-wrap">
                        {resolveStr(about.description, "about.description", "")}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: "⚖️", titleKey: "about.mission", titleFallback: "Our Mission", descKey: "about.missionDesc", desc: about.missionDesc, title: about.mission, delay: 0 },
                        { icon: "🎯", titleKey: "about.vision", titleFallback: "Our Vision", descKey: "about.visionDesc", desc: about.visionDesc, title: about.vision, delay: 0.2 },
                        { icon: "🤝", titleKey: "about.values", titleFallback: "Our Values", descKey: "about.valuesDesc", desc: about.valuesDesc, title: about.values, delay: 0.4 },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="text-center"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: item.delay }}
                            viewport={{ once: true }}
                        >
                            <div className="text-6xl mb-4">{item.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">
                                {resolveStr(item.title, item.titleKey, item.titleFallback)}
                            </h3>
                            <p>{resolveStr(item.desc, item.descKey, "")}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
