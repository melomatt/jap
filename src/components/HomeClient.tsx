"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import BookAppointment from "@/components/BookAppointment";
import GetQuote from "@/components/GetQuote";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "@/hooks/use-translations";

const AnimatedTypingText = ({ text, delay = 0, className, isHeading = false }: { text: string, delay?: number, className?: string, isHeading?: boolean }) => {
    const variants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: delay }
        }
    };
    
    const childVariants = {
        hidden: { opacity: 0, scale: 0.9, filter: "blur(8px)", y: 15 },
        visible: { opacity: 1, scale: 1, filter: "blur(0px)", y: 0, transition: { duration: 1.0, ease: "easeOut" as const } }
    };

    const words = text.split(/(\s+)/);
    
    const content = words.map((word, wordIndex) => {
        if (word.match(/\s+/)) {
            return (
                <span key={wordIndex} className="inline-block">
                    {word.split('').map((char, charIndex) => (
                        <motion.span key={charIndex} variants={childVariants as any} className="inline-block relative">
                            {char === '\n' ? <br /> : "\u00A0"}
                        </motion.span>
                    ))}
                </span>
            );
        }
        
        return (
            <span key={wordIndex} className="inline-block whitespace-nowrap">
                {Array.from(word).map((char, charIndex) => (
                    <motion.span key={charIndex} variants={childVariants as any} className="inline-block relative">
                        {char}
                    </motion.span>
                ))}
            </span>
        );
    });

    return isHeading ? (
        <motion.h1 className={className} variants={variants} initial="hidden" animate="visible">{content}</motion.h1>
    ) : (
        <motion.p className={className} variants={variants} initial="hidden" animate="visible">{content}</motion.p>
    );
};

export default function HomeClient({ cmsData }: { cmsData: any }) {
    const { t } = useTranslations();
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [showQuote, setShowQuote] = useState(false);
    const [showAllServices, setShowAllServices] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const containerRef = useRef(null);

    // Mouse Tilt Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // Scroll Effects
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useEffect(() => {
        setIsClient(true);

        const handleOpenEvaluation = () => {
            setShowEvaluation(true);
            setTimeout(() => {
                document.getElementById('evaluation-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        };

        const handleGetQuote = () => {
            setShowQuote(true);
            setTimeout(() => {
                document.getElementById('quote-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        };

        window.addEventListener("openEvaluation", handleOpenEvaluation);
        window.addEventListener("getQuote", handleGetQuote);
        return () => {
            window.removeEventListener("openEvaluation", handleOpenEvaluation);
            window.removeEventListener("getQuote", handleGetQuote);
        };
    }, []);

    // Helper resolvers: prioritize CMS data, fallback to translation, fallback to hardcoded string
    const resolveStr = (cmsStr: string | undefined, transKey: string, fallbackEn: string) => {
        if (cmsStr && cmsStr.trim() !== "") return cmsStr;
        return isClient ? t(transKey, fallbackEn) : fallbackEn;
    };

    // Robust array resolver: handles real arrays or objects with numeric keys (indices)
    const resolveArray = (val: any) => {
        if (Array.isArray(val)) return val;
        if (val && typeof val === 'object') {
            const keys = Object.keys(val).filter(k => !isNaN(Number(k)));
            if (keys.length > 0) {
                return keys.sort((a, b) => Number(a) - Number(b)).map(k => val[k]);
            }
        }
        return null;
    };

    // Safe destructuring of CMS Data
    const hero = cmsData.hero || {};
    const about = cmsData.about || {};
    const footer = cmsData.footer || {};

    // Arrays
    const servicesData = resolveArray(cmsData.services);
    const testimonialsData = resolveArray(cmsData.testimonials) || [
            { quote: "I have been using them for a year now. Everything is detailed and well organized.", name: "Penelope N. Harris", role: "CEO of SpaceX" },
            { quote: "Outstanding legal representation with exceptional results.", name: "John Doe", role: "Business Owner" },
            { quote: "Professional, reliable, and highly recommended.", name: "Jane Smith", role: "Entrepreneur" }
        ];

    const statsData = resolveArray(cmsData.stats) || [
            { number: "100K+", label: "Case Closed" },
            { number: "99.9%", label: "Success Rate" },
            { number: "30+", label: "Years Experience" }
        ];

    const faqData = resolveArray(cmsData.faq) || [
            { q: 'How do I know if I need legal representation?', a: 'If you\'re facing legal issues, it\'s best to consult with a professional to understand your rights and options.' },
            { q: 'What should I bring to my first consultation?', a: 'Bring any relevant documents, notes about your situation, and questions you have.' },
            { q: 'How much do your services cost?', a: 'Costs vary depending on the case. We offer free initial consultations to discuss fees.' }
        ];

    const insightsData = resolveArray(cmsData.insights) || [
            { title: 'Legal Trends in 2026', date: 'Aug 7, 2026', category: 'Law' },
            { title: 'Understanding Contract Law', date: 'Oct 21, 2026', category: 'Business' },
            { title: 'Family Law Updates', date: 'Nov 14, 2026', category: 'Family' }
        ];

    const teamData = resolveArray(cmsData.team);

    // Slideshow Logic
    const backgroundImages = hero.backgroundImages || [hero.backgroundImage || hero.imageUrl || '/hero_image.png'];
    
    useEffect(() => {
        if (backgroundImages.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
        }, 8000); // Slower interval for cinematic feel

        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    return (
        <div ref={containerRef} className="overflow-x-hidden">
            <section
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
                            transition={{ 
                                opacity: { duration: 2 }, 
                                scale: { duration: 10, ease: "linear" } 
                            }}
                            className="absolute inset-0 bg-cover bg-center will-change-transform"
                            style={{ backgroundImage: `url(${backgroundImages[currentSlide] || '/hero_image.png'})` }}
                        />
                    </AnimatePresence>
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_120%)]"></div>
                    <div className="absolute inset-y-0 left-0 w-full md:w-3/4 lg:w-3/5 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] to-transparent opacity-90 pointer-events-none"></div>
                    <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>
                </motion.div>

                {/* Unconstrained Cinematic Text Overlay */}
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
                                    onClick={() => window.dispatchEvent(new Event("getQuote"))}
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

                {/* Slider Progress Indicators */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {backgroundImages.map((_: any, i: number) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className="group relative h-1.5 w-12 rounded-full bg-white/20 transition-all"
                        >
                            {currentSlide === i && (
                                <motion.div
                                    layoutId="progress"
                                    className="absolute inset-0 bg-white rounded-full"
                                    transition={{ duration: 0.5 }}
                                />
                            )}
                            <div className="absolute -inset-4 cursor-pointer" />
                        </button>
                    ))}
                </div>
            </section>

            {/* Services Highlight Section (part of hero) */}
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
                            {resolveStr(cmsData.servicesHeader?.title || cmsData.services?.title, "services.title", "WE ARE BRINGING SOLUTIONS BY PROVIDING SUPPORT FOR LEGAL SYSTEM.")}
                        </h2>
                        <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2">
                            {resolveStr(cmsData.servicesHeader?.subtitle || cmsData.services?.subtitle, "services.subtitle", "Justice Advocates & Partners, Inc. delivers strategic legal counsel with integrity and results-driven advocacy across diverse legal domains.")}
                        </p>
                    </motion.div>

                    {/* Display first 4 services from CMS (or fallback) */}
                    <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                        {servicesData ? servicesData.slice(0, 4).map((srv: any, i: number) => (
                            <article key={i} className="p-8 sm:p-10 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                                <div className="text-blue-600 dark:text-blue-300 mb-6 text-4xl sm:text-5xl">⚖️</div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{srv.title}</h3>
                                <p className="text-sm sm:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{srv.description}</p>
                            </article>
                        )) : (
                            <>
                                <article className="p-8 sm:p-10 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                                    <div className="text-blue-600 dark:text-blue-300 mb-6 text-4xl sm:text-5xl">🏛️</div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{isClient ? t("services.corporate", "Corporate & Commercial Law") : "Corporate & Commercial Law"}</h3>
                                    <p className="text-sm sm:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{isClient ? t("services.corporateDesc", "Comprehensive legal support for corporate governance, contracts, and compliance.") : "Comprehensive legal support for corporate governance, contracts, and compliance."}</p>
                                </article>
                                <article className="p-8 sm:p-10 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                                    <div className="text-blue-600 dark:text-blue-300 mb-6 text-4xl sm:text-5xl">💰</div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{isClient ? t("services.banking", "Banking & Finance") : "Banking & Finance"}</h3>
                                    <p className="text-sm sm:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{isClient ? t("services.bankingDesc", "Expert guidance in financial transactions, banking regulations, and investment matters.") : "Expert guidance in financial transactions, banking regulations, and investment matters."}</p>
                                </article>
                                <article className="p-8 sm:p-10 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                                    <div className="text-blue-600 dark:text-blue-300 mb-6 text-4xl sm:text-5xl">⚖️</div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{isClient ? t("services.litigation", "Commercial & Civil Dispute Litigation") : "Commercial & Civil Dispute Litigation"}</h3>
                                    <p className="text-sm sm:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{isClient ? t("services.litigationDesc", "Aggressive representation and resolution for commercial and civil disputes.") : "Aggressive representation and resolution for commercial and civil disputes."}</p>
                                </article>
                                <article className="p-8 sm:p-10 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                                    <div className="text-blue-600 dark:text-blue-300 mb-6 text-4xl sm:text-5xl">🏠</div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{isClient ? t("services.realEstate", "Real Estate & Conveyance") : "Real Estate & Conveyance"}</h3>
                                    <p className="text-sm sm:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{isClient ? t("services.realEstateDesc", "Complete legal services for property transactions, conveyancing, and real estate matters.") : "Complete legal services for property transactions, conveyancing, and real estate matters."}</p>
                                </article>
                            </>
                        )}
                    </div>

                    <div className="mt-8 md:mt-12 text-center px-4">
                        <button
                            onClick={() => setShowAllServices(true)}
                            className="inline-flex items-center px-8 sm:px-10 py-3 sm:py-3.5 text-[15px] rounded-full bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] font-bold shadow-md hover:scale-105 transition-all active:scale-95"
                        >
                            {isClient ? t("services.exploreAll", "Explore All Services") : "Explore All Services"}
                        </button>
                    </div>
                </div>
            </div>

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
                        <motion.div className="text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                            <div className="text-6xl mb-4">⚖️</div>
                            <h3 className="text-xl font-semibold mb-2">
                                {resolveStr(about.mission, "about.mission", "Our Mission")}
                            </h3>
                            <p>{resolveStr(about.missionDesc, "about.missionDesc", "")}</p>
                        </motion.div>
                        <motion.div className="text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
                            <div className="text-6xl mb-4">🎯</div>
                            <h3 className="text-xl font-semibold mb-2">
                                {resolveStr(about.vision, "about.vision", "Our Vision")}
                            </h3>
                            <p>{resolveStr(about.visionDesc, "about.visionDesc", "")}</p>
                        </motion.div>
                        <motion.div className="text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} viewport={{ once: true }}>
                            <div className="text-6xl mb-4">🤝</div>
                            <h3 className="text-xl font-semibold mb-2">
                                {resolveStr(about.values, "about.values", "Our Values")}
                            </h3>
                            <p>{resolveStr(about.valuesDesc, "about.valuesDesc", "")}</p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Full Services Section - Conditional */}
            {showAllServices && (
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
                                    <div className="text-blue-600 dark:text-blue-300 mb-6 text-4xl sm:text-5xl">⚖️</div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{srv.title}</h3>
                                    <p className="text-sm sm:text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{srv.description}</p>
                                </motion.article>
                            )) : (
                                <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-gray-500 py-10">No additional services loaded from CMS.</div>
                            )}
                        </div>

                        <div className="mt-8 md:mt-12 text-center px-4">
                            <button
                                onClick={() => setShowAllServices(false)}
                                className="inline-flex items-center px-8 sm:px-10 py-3 sm:py-3.5 text-[15px] rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold hover:scale-105 transition-all active:scale-95"
                            >
                                {isClient ? t("services.seeLess", "See Less Services") : "See Less Services"}
                            </button>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Testimonials */}
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
                                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.2 }} viewport={{ once: true }}
                            >
                                <div className="text-5xl mb-6 text-blue-600 dark:text-blue-400 opacity-50">&quot;</div>
                                <p className="text-gray-700 dark:text-gray-300 mb-8 text-[15px] leading-relaxed font-medium">{testimonial.quote}</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full mr-4 flex items-center justify-center text-white font-bold text-lg shadow-sm">{testimonial.name ? testimonial.name.charAt(0) : "U"}</div>
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

            {/* Fun Facts Section */}
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
                                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: index * 0.2 }} viewport={{ once: true }}
                            >
                                <div className="text-6xl font-bold mb-2">{stat.number}</div>
                                <p className="text-lg font-medium text-blue-100">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Team Section */}
            <Team
                initialMembers={teamData}
                title={cmsData.teamHeader?.title}
                subtitle={cmsData.teamHeader?.subtitle}
            />

            {/* FAQ Section */}
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
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}
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

            {/* Insights Section */}
            <motion.section
                id="insights"
                className="py-24 md:py-32 bg-[#F5F5F7] dark:bg-[#1C1C1E] scroll-mt-24"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="text-sm uppercase tracking-widest text-blue-600 dark:text-blue-400">
                            {resolveStr(cmsData.insightsHeader?.tag, "insights.tag", "Insights")}
                        </p>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                            {resolveStr(cmsData.insightsHeader?.title, "insights.title", "COMPANY INSIGHTS")}
                        </h2>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {insightsData.map((post: any, index: number) => (
                            <motion.article
                                key={index}
                                className="bg-white dark:bg-black p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
                                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.2 }} viewport={{ once: true }}
                            >
                                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-widest">{post.category}</div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">{post.title}</h3>
                                <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                    <span className="w-4 h-4 text-gray-400 opacity-70">📅</span> {post.date}
                                </p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Modals */}
            {showEvaluation && (
                <div id="evaluation-section">
                    <BookAppointment onClose={() => setShowEvaluation(false)} cmsData={cmsData.modals} />
                    <Contact onClose={() => setShowEvaluation(false)} />
                </div>
            )}

            {showQuote && (
                <div id="quote-section">
                    <GetQuote onClose={() => setShowQuote(false)} cmsData={cmsData.modals} />
                </div>
            )}

            {/* Footer */}
            <footer id="contact" className="bg-[radial-gradient(circle_at_top,_#0b122d_0%,_#03060f_65%)] text-white py-16 scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div>
                            <img src="/jap_logo.png" alt="Justice Advocates & Partners, Inc." className="h-16 mb-4" />
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {resolveStr(footer.description, "footer.description", "WE ARE BRINGING SOLUTIONS BY PROVIDING SUPPORT FOR LEGAL SYSTEM.")}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg md:text-xl font-semibold text-white mb-4">{isClient ? t("footer.headOffice", "Head Office") : "Head Office"}</h4>
                            <address className="not-italic text-gray-300 text-sm space-y-2">
                                <p>{footer.addressLine1 || "Unit 9 Amir Building"}</p>
                                <p>{footer.addressLine2 || "18th Street & Tubman Blvd., Sinkor, Monrovia, Liberia"}</p>
                            </address>

                            <h4 className="text-lg md:text-xl font-semibold text-white mt-8 mb-4">{isClient ? t("footer.phone", "Phone Directory") : "Phone Directory"}</h4>
                            <ul className="text-gray-300 text-sm space-y-2">
                                {(footer.phoneLines || "Call locally: +231 777 511 760").split('\n').map((phone: string, i: number) => (
                                    <li key={i} className="break-all">{phone}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg md:text-xl font-semibold text-white mb-4">{isClient ? t("footer.connectWithUs", "Reach Out") : "Reach Out"}</h4>
                            <p className="text-gray-300 text-sm mb-4">
                                {isClient ? t("footer.email", "Email") : "Email"}: <a href={`mailto:${footer.email || 'justice.advocates.partners@gmail.com'}`} className="text-blue-300 hover:text-blue-200">{footer.email || "justice.advocates.partners@gmail.com"}</a>
                            </p>

                            <h4 className="text-lg md:text-xl font-semibold text-white mb-3 mt-8">{isClient ? t("footer.quickLinks", "Quick Links") : "Quick Links"}</h4>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li><a href="#hero" className="hover:text-blue-300">{isClient ? t("footer.home", "Home") : "Home"}</a></li>
                                <li><a href="#about" className="hover:text-blue-300">{isClient ? t("footer.about", "About") : "About"}</a></li>
                                <li><a href="#services" className="hover:text-blue-300">{isClient ? t("footer.services", "Services") : "Services"}</a></li>
                                <li><a href="#team" className="hover:text-blue-300">{isClient ? t("footer.team", "Team") : "Team"}</a></li>
                                <li><a href="#faq" className="hover:text-blue-300">{isClient ? t("footer.faq", "FAQ") : "FAQ"}</a></li>
                                <li><a href="#insights" className="hover:text-blue-300">{isClient ? t("footer.insights", "Insights") : "Insights"}</a></li>
                                <li className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800"><Link href="/privacy" className="hover:text-blue-300 opacity-75 hover:opacity-100">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-blue-300 opacity-75 hover:opacity-100">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-12 pt-8 text-center text-xs md:text-sm text-gray-400">
                        {footer.copyright || "© 2026 Justice Advocates & Partners, Inc. All rights reserved. Licensed in Liberia."}
                    </div>
                </div>
            </footer>
        </div>
    );
}
