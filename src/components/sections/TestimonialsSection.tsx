"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface TestimonialsSectionProps {
    testimonialsData: any[];
    cmsData: any;
    resolveStr: (cmsStr: string | undefined, transKey: string, fallbackEn: string) => string;
}

// Deterministic gradient per avatar initial
const AVATAR_GRADIENTS = [
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-700",
    "from-sky-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
];

export default function TestimonialsSection({ testimonialsData, cmsData, resolveStr }: TestimonialsSectionProps) {
    const [active, setActive] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

    const count = testimonialsData.length;

    const go = (idx: number) => {
        setDirection(idx > active ? 1 : -1);
        setActive((idx + count) % count);
    };
    const next = () => go(active + 1);
    const prev = () => go(active - 1);

    // Auto-advance every 6 seconds
    useEffect(() => {
        if (count <= 1) return;
        const t = setInterval(next, 6000);
        return () => clearInterval(t);
    }, [active, count]);

    const cardVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? "60%" : "-60%",
            opacity: 0,
            scale: 0.92,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.55, ease: [0.32, 0.72, 0, 1] as any },
        },
        exit: (dir: number) => ({
            x: dir > 0 ? "-60%" : "60%",
            opacity: 0,
            scale: 0.92,
            transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] as any },
        }),
    };

    const current = testimonialsData[active];

    return (
        <section
            id="testimonials"
            className="relative py-24 md:py-32 overflow-hidden"
            style={{ backgroundColor: "#03060f" }}
        >
            {/* Ambient background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-blue-900/30 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-violet-900/25 blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    className="text-center mb-14 md:mb-20"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }} viewport={{ once: true }}
                >
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-blue-400 mb-4">
                        {resolveStr(cmsData.testimonialsHeader?.tag, "testimonials.tag", "Client Testimonials")}
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                        {resolveStr(cmsData.testimonialsHeader?.title, "testimonials.title", "Trusted by Clients")}
                    </h2>
                    <p className="mt-4 text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                        {resolveStr(cmsData.testimonialsHeader?.subtitle, "testimonials.subtitle", "What those we've served have to say about their experience.")}
                    </p>
                </motion.div>

                {/* Main Card Carousel */}
                <div className="relative flex items-center gap-4">
                    {/* Prev Button */}
                    <button
                        onClick={prev}
                        aria-label="Previous testimonial"
                        className="hidden sm:flex shrink-0 w-11 h-11 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Card */}
                    <div className="relative flex-1 overflow-hidden" style={{ minHeight: 320 }}>
                        <AnimatePresence custom={direction} mode="popLayout">
                            <motion.div
                                key={active}
                                custom={direction}
                                variants={cardVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="w-full"
                            >
                                <div className="rounded-[2rem] p-8 sm:p-10 md:p-12 border border-white/[0.07]" style={{ backgroundColor: "#0d1526" }}>
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-6">
                                        {Array.from({ length: current.rating || 5 }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <blockquote className="relative">
                                        {/* Decorative large quotation mark */}
                                        <span className="absolute -top-3 -left-1 text-[80px] leading-none text-white/[0.06] font-serif select-none pointer-events-none">
                                            &#8220;
                                        </span>
                                        <p className="relative text-white/90 text-lg sm:text-xl md:text-2xl font-medium leading-relaxed italic">
                                            {current.quote}
                                        </p>
                                    </blockquote>

                                    {/* Divider */}
                                    <div className="my-8 h-px bg-white/[0.08]" />

                                    {/* Author */}
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${AVATAR_GRADIENTS[active % AVATAR_GRADIENTS.length]} flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shrink-0`}>
                                            {current.name ? current.name.charAt(0).toUpperCase() : "C"}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-base sm:text-lg">{current.name}</p>
                                            <p className="text-gray-400 text-xs sm:text-sm font-medium mt-0.5 uppercase tracking-wider">{current.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={next}
                        aria-label="Next testimonial"
                        className="hidden sm:flex shrink-0 w-11 h-11 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile prev/next + Dot indicators */}
                <div className="mt-8 flex flex-col items-center gap-5">
                    {/* Mobile arrow row */}
                    <div className="flex sm:hidden gap-3">
                        <button onClick={prev} aria-label="Previous" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={next} aria-label="Next" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-90">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="flex items-center gap-2">
                        {testimonialsData.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => go(i)}
                                aria-label={`Go to testimonial ${i + 1}`}
                                className="relative focus:outline-none"
                            >
                                <motion.div
                                    animate={{
                                        width: i === active ? 24 : 6,
                                        backgroundColor: i === active ? "rgb(255,255,255)" : "rgba(255,255,255,0.25)",
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="h-[5px] rounded-full"
                                />
                                {/* Tap target */}
                                <div className="absolute -inset-3" />
                            </button>
                        ))}
                    </div>

                    {/* Counter */}
                    <p className="text-gray-600 text-xs font-medium tabular-nums">
                        {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                    </p>
                </div>
            </div>
        </section>
    );
}
