"use client";

import { motion } from "framer-motion";

interface TestimonialsSectionProps {
    testimonialsData: any[];
    cmsData: any;
    resolveStr: (cmsStr: string | undefined, transKey: string, fallbackEn: string) => string;
}

export default function TestimonialsSection({ testimonialsData, cmsData, resolveStr }: TestimonialsSectionProps) {
    return (
        <motion.section
            id="testimonials"
            className="py-24 md:py-32 bg-white dark:bg-black"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <p className="text-sm uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        {resolveStr(cmsData.testimonialsHeader?.tag, "testimonials.tag", "Testimonials")}
                    </p>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                        {resolveStr(cmsData.testimonialsHeader?.title, "testimonials.title", "HAPPY USERS SAYS ABOUT US")}
                    </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial: any, index: number) => (
                        <motion.div
                            key={index}
                            className="p-8 sm:p-10 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-5xl mb-6 text-blue-600 dark:text-blue-400 opacity-50">&quot;</div>
                            <p className="text-gray-700 dark:text-gray-300 mb-8 text-[15px] leading-relaxed font-medium">{testimonial.quote}</p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-600 rounded-full mr-4 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                    {testimonial.name ? testimonial.name.charAt(0) : "U"}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-0.5">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
