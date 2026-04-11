"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { AnimatedTypingText } from "@/lib/home-utils";

interface HeroSectionProps {
    hero: any;
    resolveStr: (cmsStr: string | undefined, transKey: string, fallbackEn: string) => string;
    onGetQuote: () => void;
}

export default function HeroSection({ hero, resolveStr, onGetQuote }: HeroSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const containerRef = useRef<HTMLElement>(null);

    // Mouse Tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { damping: 25, stiffness: 150 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

    // Scroll parallax
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Slideshow
    const backgroundImages = hero.backgroundImages || [hero.backgroundImage || hero.imageUrl || "/hero_image.png"];
    useEffect(() => {
        if (backgroundImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    return (
        <section
            ref={containerRef}
            id="hero"
            className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden bg-black"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Cinematic Ken Burns Background */}
            <motion.div style={{ y: bgY, opacity: heroOpacity }} className="absolute inset-0 z-0 bg-black">
                <AnimatePresence>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ opacity: { duration: 2 }, scale: { duration: 10, ease: "linear" } }}
                        className="absolute inset-0 bg-cover bg-center will-change-transform"
                        style={{ backgroundImage: `url(${backgroundImages[currentSlide] || "/hero_image.png"})` }}
                    />
                </AnimatePresence>

                {/* Overlays */}
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_120%)]" />
                <div className="absolute inset-y-0 left-0 w-full md:w-3/4 lg:w-3/5 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] to-transparent opacity-90 pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
            </motion.div>

            {/* Cinematic Text Overlay */}
            <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-20 flex flex-col justify-end md:justify-center items-start pb-32 md:pb-0">
                <motion.div
                    style={{ rotateX, rotateY, perspective: 1000 }}
                    className="w-full max-w-3xl xl:max-w-4xl text-left text-white"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }}>
                        <AnimatedTypingText
                            isHeading
                            text={resolveStr(hero.title, "hero.title", "EXPERT ADVISORY")}
                            delay={0.4}
                            className="text-[40px] sm:text-6xl md:text-[80px] lg:text-[85px] xl:text-[96px] font-bold mb-6 leading-[1.05] tracking-tight drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]"
                        />
                        <AnimatedTypingText
                            text={resolveStr(hero.subtitle, "hero.subtitle", "WE ARE BRINGING SOLUTIONS BY PROVIDING SUPPORT FOR LEGAL SYSTEM.")}
                            delay={1.4}
                            className="text-xl md:text-2xl lg:text-3xl mb-12 text-white/90 font-medium max-w-2xl leading-relaxed drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                        />

                        <div className="flex flex-col sm:flex-row justify-start gap-5 sm:gap-6 mt-8">
                            <button
                                className="px-10 py-4 sm:py-5 bg-white text-black hover:bg-gray-100 rounded-full font-bold text-[17px] shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all active:scale-95 group flex items-center justify-center gap-3"
                                onClick={onGetQuote}
                            >
                                {resolveStr(hero.buttonText, "hero.cta", "Get a Quote")}
                                <span className="group-hover:translate-x-1 transition-transform">{"→"}</span>
                            </button>
                            <button
                                className="px-10 py-4 sm:py-5 bg-black/40 hover:bg-black/60 text-white border border-white/20 rounded-full font-bold text-[17px] backdrop-blur-2xl transition-all hover:border-white/40 active:scale-95"
                                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                            >
                                Explore Services
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Slide Progress Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {backgroundImages.map((_: any, i: number) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className="group relative h-1.5 w-12 rounded-full bg-white/20 transition-all"
                    >
                        {currentSlide === i && (
                            <motion.div layoutId="progress" className="absolute inset-0 bg-white rounded-full" transition={{ duration: 0.5 }} />
                        )}
                        <div className="absolute -inset-4 cursor-pointer" />
                    </button>
                ))}
            </div>
        </section>
    );
}
