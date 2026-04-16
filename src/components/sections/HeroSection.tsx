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
            className="relative h-[100dvh] w-full overflow-hidden bg-black"
        >
            {/* ── Full-bleed Background Slideshow ── */}
            <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
                <AnimatePresence mode="sync">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            opacity: { duration: 1.4, ease: "easeInOut" },
                            scale:   { duration: 10, ease: "linear" },
                        }}
                        className="absolute inset-0 bg-cover bg-center md:bg-top will-change-transform"
                        style={{ backgroundImage: `url(${backgroundImages[currentSlide] || "/hero_image.png"})` }}
                    />
                </AnimatePresence>

                {/* Refined Overlays — Premium App Aesthetic */}
                {/* Global tint for depth */}
                <div className="absolute inset-0 bg-black/30 md:bg-black/20 transition-colors duration-700" />
                
                {/* Advanced Gradient Overlay — Optimized for mobile text wrapping */}
                <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/95 via-black/40 to-transparent md:h-[70%] pointer-events-none" />
                
                {/* Safe Area Top Gradient */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            </motion.div>

            {/* ── Text Content — Anchored with Mobile Safe Areas ── */}
            <motion.div
                style={{ opacity: heroOpacity }}
                className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-10 lg:px-20 pb-32 sm:pb-28"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-5 inline-flex items-center gap-3 w-fit"
                >
                    <span className="h-[2px] w-6 sm:w-10 bg-blue-500" />
                    <span className="text-blue-400 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase">
                        Legal Excellence Since 2020
                    </span>
                </motion.div>

                {/* Title — Fluid Responsive Scale */}
                <AnimatedTypingText
                    isHeading
                    text={resolveStr(hero.title, "hero.title", "Justice Advocates & Partners")}
                    delay={0.4}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] max-w-4xl"
                />

                {/* Subtitle — Optimized for Mobile Readability */}
                <AnimatedTypingText
                    text={resolveStr(hero.subtitle, "hero.subtitle", "Integrity in Practice. Excellence across Industries.")}
                    delay={1.2}
                    className="mt-5 text-base sm:text-lg md:text-xl xl:text-2xl text-white/90 font-medium max-w-2xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
                />

                {/* CTA buttons — App-like Touch Targets */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5"
                >
                    <button
                        onClick={onGetQuote}
                        className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-base shadow-[0_10px_40px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.25)] hover:scale-[1.02] transition-all duration-500"
                    >
                        {resolveStr(hero.buttonText, "hero.cta", "Get a Quote")}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/15 text-white rounded-full font-semibold text-base border border-white/20 hover:border-white/40 backdrop-blur-3xl hover:scale-[1.02] transition-all duration-500"
                    >
                        Explore Services
                        <ChevronDown className="w-5 h-5" />
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
