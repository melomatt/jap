"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { resolveStr, resolveArray } from "@/lib/home-utils";

import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import StatsSection from "@/components/sections/StatsSection";
import Team from "@/components/Team";
import FAQSection from "@/components/sections/FAQSection";
import InsightsSection from "@/components/sections/InsightsSection";
import FooterSection from "@/components/sections/FooterSection";
import BookAppointment from "@/components/BookAppointment";
import Contact from "@/components/Contact";
import GetQuote from "@/components/GetQuote";

export default function HomeClient({ cmsData }: { cmsData: any }) {
    const { t } = useTranslations();
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [showQuote, setShowQuote] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const handleOpenEvaluation = () => {
            setShowEvaluation(true);
            setTimeout(() => document.getElementById("evaluation-section")?.scrollIntoView({ behavior: "smooth" }), 100);
        };

        const handleGetQuote = () => {
            setShowQuote(true);
            setTimeout(() => document.getElementById("quote-section")?.scrollIntoView({ behavior: "smooth" }), 100);
        };

        window.addEventListener("openEvaluation", handleOpenEvaluation);
        window.addEventListener("getQuote", handleGetQuote);
        return () => {
            window.removeEventListener("openEvaluation", handleOpenEvaluation);
            window.removeEventListener("getQuote", handleGetQuote);
        };
    }, []);

    // Unified resolver bound to current isClient + t
    const resolve = (cmsStr: string | undefined, transKey: string, fallbackEn: string) =>
        resolveStr(isClient, t, cmsStr, transKey, fallbackEn);

    // Data resolution with sensible defaults
    const servicesData = resolveArray(cmsData.services);

    const testimonialsData = resolveArray(cmsData.testimonials) || [
        { quote: "I have been using them for a year now. Everything is detailed and well organized.", name: "Penelope N. Harris", role: "CEO of SpaceX" },
        { quote: "Outstanding legal representation with exceptional results.", name: "John Doe", role: "Business Owner" },
        { quote: "Professional, reliable, and highly recommended.", name: "Jane Smith", role: "Entrepreneur" },
    ];

    const statsData = resolveArray(cmsData.stats) || [
        { number: "100K+", label: "Case Closed" },
        { number: "99.9%", label: "Success Rate" },
        { number: "30+", label: "Years Experience" },
    ];

    const faqData = resolveArray(cmsData.faq) || [
        { q: "How do I know if I need legal representation?", a: "If you're facing legal issues, it's best to consult with a professional to understand your rights and options." },
        { q: "What should I bring to my first consultation?", a: "Bring any relevant documents, notes about your situation, and questions you have." },
        { q: "How much do your services cost?", a: "Costs vary depending on the case. We offer free initial consultations to discuss fees." },
    ];

    const insightsData = resolveArray(cmsData.insights) || [
        { title: "Legal Trends in 2026", date: "Aug 7, 2026", category: "Law" },
        { title: "Understanding Contract Law", date: "Oct 21, 2026", category: "Business" },
        { title: "Family Law Updates", date: "Nov 14, 2026", category: "Family" },
    ];

    const teamData = resolveArray(cmsData.team);

    return (
        <div className="overflow-x-hidden">
            <HeroSection
                hero={cmsData.hero || {}}
                resolveStr={resolve}
                onGetQuote={() => window.dispatchEvent(new Event("getQuote"))}
            />

            <ServicesSection
                cmsData={cmsData}
                servicesData={servicesData}
                isClient={isClient}
                t={t}
                resolveStr={resolve}
            />

            <AboutSection about={cmsData.about || {}} resolveStr={resolve} />

            <TestimonialsSection
                testimonialsData={testimonialsData}
                cmsData={cmsData}
                resolveStr={resolve}
            />

            <StatsSection statsData={statsData} cmsData={cmsData} resolveStr={resolve} />

            <Team
                initialMembers={teamData}
                title={cmsData.teamHeader?.title}
                subtitle={cmsData.teamHeader?.subtitle}
            />

            <FAQSection faqData={faqData} cmsData={cmsData} resolveStr={resolve} />

            <InsightsSection insightsData={insightsData} cmsData={cmsData} resolveStr={resolve} />

            {/* Evaluation & Contact Modals */}
            {showEvaluation && (
                <div id="evaluation-section">
                    <BookAppointment onClose={() => setShowEvaluation(false)} cmsData={cmsData.modals} />
                    <Contact onClose={() => setShowEvaluation(false)} />
                </div>
            )}

            {/* Quote Modal */}
            {showQuote && (
                <div id="quote-section">
                    <GetQuote onClose={() => setShowQuote(false)} cmsData={cmsData.modals} />
                </div>
            )}

            <FooterSection footer={cmsData.footer || {}} isClient={isClient} t={t} resolveStr={resolve} />
        </div>
    );
}
