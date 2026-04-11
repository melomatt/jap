"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { AnimatedTypingText } from "@/lib/home-utils";
import { ArrowRight, ChevronDown } from "lucide-react";

interface HeroSectionProps {
    hero: any;
    resolveStr: (cmsStr: string | undefined, transKey: string, fallbackEn: string) => string;
    onGetQuote: () => void;
}

export default function HeroSection({ hero, resolveStr, onGetQuote }: HeroSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const containerRef = useRef<HTMLElement>(null);

    // Scroll-based parallax fade
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    // Slideshow auto-advance
    const backgroundImages = hero.backgroundImages || [hero.backgroundImage || hero.imageUrl || "/hero_image.png"];
    useEffect(() => {
        if (backgroundImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
        }, 7000);
        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    return (
        <section
            ref={containerRef}
            id="hero"
            className="relative h-[100svh] w-full overflow-hidden bg-black"
        >
            {/* ── Full-bleed Background Slideshow ── */}
            <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
                <AnimatePresence mode="sync">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            opacity: { duration: 1.8, ease: "easeInOut" },
                            scale:   { duration: 12, ease: "linear" },
                        }}
                        className="absolute inset-0 bg-cover bg-top will-change-transform"
                        style={{ backgroundImage: `url(${backgroundImages[currentSlide] || "/hero_image.png"})` }}
                    />
                </AnimatePresence>

                {/* Minimal overlays — only darken the very bottom so faces stay fully visible */}
                {/* Subtle overall tone */}
                <div className="absolute inset-0 bg-black/20" />
                {/* Strong BOTTOM gradient for text legibility */}
                <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                {/* Narrow TOP bar for navbar contrast */}
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
            </motion.div>

            {/* ── Text Content — anchored to bottom-left (Apple TV+ / Netflix style) ── */}
            <motion.div
                style={{ opacity: heroOpacity }}
                className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-10 lg:px-20 pb-24 sm:pb-28"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-4 inline-flex items-center gap-2 w-fit"
                >
                    <span className="h-px w-8 bg-blue-400" />
                    <span className="text-blue-300 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
                        Legal Excellence Since 2020
                    </span>
                </motion.div>

                {/* Title */}
                <AnimatedTypingText
                    isHeading
                    text={resolveStr(hero.title, "hero.title", "Justice Advocates & Partners")}
                    delay={0.4}
                    className="text-[36px] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.9)] max-w-3xl"
                />

                {/* Subtitle */}
                <AnimatedTypingText
                    text={resolveStr(hero.subtitle, "hero.subtitle", "Integrity in Practice. Excellence across Industries.")}
                    delay={1.2}
                    className="mt-4 text-base sm:text-lg md:text-xl text-white/80 font-medium max-w-xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]"
                />

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-8 flex flex-row flex-wrap gap-3 sm:gap-4"
                >
                    <button
                        onClick={onGetQuote}
                        className="group inline-flex items-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-white text-black rounded-full font-bold text-sm sm:text-base shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.35)] hover:bg-gray-100 active:scale-95 transition-all duration-300"
                    >
                        {resolveStr(hero.buttonText, "hero.cta", "Get a Quote")}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                        onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                        className="inline-flex items-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold text-sm sm:text-base border border-white/20 hover:border-white/40 backdrop-blur-xl active:scale-95 transition-all duration-300"
                    >
                        Explore Services
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </motion.div>
            </motion.div>

            {/* ── Slide indicators — bottom-right corner ── */}
            {backgroundImages.length > 1 && (
                <div className="absolute bottom-8 right-6 sm:right-10 z-20 flex items-center gap-2">
                    {backgroundImages.map((_: any, i: number) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className="relative h-[3px] rounded-full bg-white/25 transition-all duration-500 focus:outline-none"
                            style={{ width: currentSlide === i ? "2rem" : "0.625rem" }}
                        >
                            {currentSlide === i && (
                                <motion.div
                                    layoutId="pill"
                                    className="absolute inset-0 bg-white rounded-full"
                                    transition={{ duration: 0.4 }}
                                />
                            )}
                            {/* Extended tap target for mobile */}
                            <div className="absolute -inset-3" />
                        </button>
                    ))}
                </div>
            )}

            {/* ── Scroll cue arrow ── */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/40"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
                <ChevronDown className="w-6 h-6" />
            </motion.div>
        </section>
    );
}
