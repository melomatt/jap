"use client";

import { motion } from "framer-motion";

interface FAQSectionProps {
    faqData: any[];
    cmsData: any;
    resolveStr: (cmsStr: string | undefined, transKey: string, fallbackEn: string) => string;
}

export default function FAQSection({ faqData, cmsData, resolveStr }: FAQSectionProps) {
    return (
        <motion.section
            id="faq"
            className="py-20 bg-white dark:bg-gray-800 scroll-mt-24"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <p className="text-sm uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        {resolveStr(cmsData.faqHeader?.tag, "faq.tag", "FAQ")}
                    </p>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                        {resolveStr(cmsData.faqHeader?.title, "faq.title", "GET SOLID ANSWER FROM EVERYSIDE")}
                    </h2>
                </div>

                <div className="max-w-3xl mx-auto space-y-6">
                    {faqData.map((faq: any, index: number) => (
                        <motion.details
                            key={index}
                            className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-shadow hover:shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer select-none">
                                {faq.q}
                            </summary>
                            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{faq.a}</p>
                        </motion.details>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
