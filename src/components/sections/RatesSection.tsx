"use client";

import { motion } from "framer-motion";

interface RatesSectionProps {
    rates: any;
    resolveStr: (cmsStr: string | undefined, transKey: string, fallbackEn: string) => string;
}

export default function RatesSection({ rates, resolveStr }: RatesSectionProps) {
    if (!rates || !rates.rows || rates.rows.length === 0) return null;

    const { sectionTitle, subtitle, currency, rows } = rates;

    return (
        <motion.section
            id="rates"
            className="py-24 md:py-32 bg-white dark:bg-black scroll-mt-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-sm uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        {resolveStr(subtitle, "rates.tag", "Service Rates")}
                    </p>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-3">
                        {resolveStr(sectionTitle, "rates.title", "OUR RATES")}
                    </h2>
                    {subtitle && (
                        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="relative overflow-hidden bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <th className="py-8 px-10 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24 text-center">No.</th>
                                    <th className="py-8 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                                    <th className="py-8 px-10 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                                        Fees Per Hour
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row: any, idx: number) => (
                                    <motion.tr
                                        key={idx}
                                        className="group hover:bg-white dark:hover:bg-black transition-colors duration-300"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <td className="py-8 px-10 border-b border-gray-100 dark:border-gray-800/50 text-center font-medium text-gray-400">
                                            {row.no || idx + 1}
                                        </td>
                                        <td className="py-8 px-6 border-b border-gray-100 dark:border-gray-800/50">
                                            <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {row.description}
                                            </span>
                                        </td>
                                        <td className="py-8 px-10 border-b border-gray-100 dark:border-gray-800/50 text-right">
                                            <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                                                {row.feePerHour}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-800">
                        {rows.map((row: any, idx: number) => (
                            <motion.div
                                key={idx}
                                className="p-8 space-y-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                        No. {row.no || idx + 1}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                    {row.description}
                                </h3>
                                <div className="pt-2 flex items-baseline justify-between">
                                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Fee Per Hour</span>
                                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                                        {row.feePerHour}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footnote */}
                <div className="mt-10 flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                    <p>Fees are subject to specific case complexity and client engagement agreements.</p>
                </div>
            </div>
        </motion.section>
    );
}
