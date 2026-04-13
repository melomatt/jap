"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getServiceIcon } from "@/lib/home-utils";

interface ServicesSectionProps {
    cmsData: any;
    servicesData: any[] | null;
    isClient: boolean;
    t: (key: string, fallback: string) => string;
    resolveStr: (cmsStr: string | undefined, transKey: string, fallbackEn: string) => string;
}

export default function ServicesSection({ cmsData, servicesData, isClient, t, resolveStr }: ServicesSectionProps) {
    const [showAll, setShowAll] = useState(false);

    const cardClass = "p-8 sm:p-10 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300";

    return (
        <>
            {/* Preview: first 4 services */}
            <div id="services" className="relative z-10 bg-white dark:bg-black py-20 md:py-32 scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-10 md:mb-14"
                        initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
                    >
                        <p className="text-xs sm:text-sm uppercase tracking-widest text-blue-600 dark:text-blue-300">
                            {resolveStr(cmsData.servicesHeader?.tag || cmsData.services?.tag, "services.tag", "Legal Service")}
                        </p>
                        <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white px-2">
                            {resolveStr(cmsData.servicesHeader?.title || cmsData.services?.title, "services.title", "Integrity in Practice. Excellence across Industries.")}
                        </h2>
                        <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2">
                            {resolveStr(cmsData.servicesHeader?.subtitle || cmsData.services?.subtitle, "services.subtitle", "Justice Advocates & Partners, Inc. delivers strategic legal counsel with integrity and results-driven advocacy across diverse legal domains.")}
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                        {servicesData ? servicesData.slice(0, 4).map((srv: any, i: number) => (
                            <article key={i} className={cardClass}>
                                <div className="text-blue-600 dark:text-blue-400 mb-6 flex items-center justify-start">{getServiceIcon(srv.title, i)}</div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{srv.title}</h3>
                                <p className="text-sm sm:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{srv.description}</p>
                            </article>
                        )) : (
                            <>
                                {[
                                    { icon: "🏛️", title: isClient ? t("services.corporate", "Corporate & Commercial Law") : "Corporate & Commercial Law", desc: isClient ? t("services.corporateDesc", "Comprehensive legal support for corporate governance, contracts, and compliance.") : "Comprehensive legal support for corporate governance, contracts, and compliance." },
                                    { icon: "💰", title: isClient ? t("services.banking", "Banking & Finance") : "Banking & Finance", desc: isClient ? t("services.bankingDesc", "Expert guidance in financial transactions, banking regulations, and investment matters.") : "Expert guidance in financial transactions, banking regulations, and investment matters." },
                                    { icon: "⚖️", title: isClient ? t("services.litigation", "Commercial & Civil Dispute Litigation") : "Commercial & Civil Dispute Litigation", desc: isClient ? t("services.litigationDesc", "Aggressive representation and resolution for commercial and civil disputes.") : "Aggressive representation and resolution for commercial and civil disputes." },
                                    { icon: "🏠", title: isClient ? t("services.realEstate", "Real Estate & Conveyance") : "Real Estate & Conveyance", desc: isClient ? t("services.realEstateDesc", "Complete legal services for property transactions, conveyancing, and real estate matters.") : "Complete legal services for property transactions, conveyancing, and real estate matters." },
                                ].map((s, i) => (
                                    <article key={i} className={cardClass}>
                                        <div className="text-blue-600 dark:text-blue-300 mb-6 text-4xl sm:text-5xl">{s.icon}</div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{s.title}</h3>
                                        <p className="text-sm sm:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                                    </article>
                                ))}
                            </>
                        )}
                    </div>

                    <div className="mt-8 md:mt-12 text-center px-4">
                        <button
                            onClick={() => setShowAll(true)}
                            className="inline-flex items-center px-8 sm:px-10 py-3 sm:py-3.5 text-[15px] rounded-full bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] font-bold shadow-md hover:scale-105 transition-all active:scale-95"
                        >
                            {isClient ? t("services.exploreAll", "Explore All Services") : "Explore All Services"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Full services grid — conditional */}
            {showAll && (
                <motion.section
                    className="py-20 bg-gray-50 dark:bg-gray-900 scroll-mt-16"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <p className="text-xs sm:text-sm uppercase tracking-widest text-blue-600 dark:text-blue-300">Our Practice Areas</p>
                            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white px-2">
                                {isClient ? t("services.fullTitle", "Our Complete Legal Services") : "Our Complete Legal Services"}
                            </h2>
                        </div>

                        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {servicesData ? servicesData.map((srv: any, i: number) => (
                                <motion.article
                                    key={i}
                                    className="p-8 sm:p-10 bg-white dark:bg-black rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1"
                                    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: i * 0.05 }}
                                >
                                    <div className="text-blue-600 dark:text-blue-400 mb-6 flex items-center justify-start">{getServiceIcon(srv.title, i)}</div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{srv.title}</h3>
                                    <p className="text-sm sm:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{srv.description}</p>
                                </motion.article>
                            )) : (
                                <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-gray-500 py-10">No additional services loaded from CMS.</div>
                            )}
                        </div>

                        <div className="mt-8 md:mt-12 text-center px-4">
                            <button
                                onClick={() => setShowAll(false)}
                                className="inline-flex items-center px-8 sm:px-10 py-3 sm:py-3.5 text-[15px] rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold hover:scale-105 transition-all active:scale-95"
                            >
                                {isClient ? t("services.seeLess", "See Less Services") : "See Less Services"}
                            </button>
                        </div>
                    </div>
                </motion.section>
            )}
        </>
    );
}
