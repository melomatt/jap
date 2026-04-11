import { notFound } from "next/navigation";
import { getSiteContent } from "../actions";
import HeroForm from "@/components/admin/cms/HeroForm";
import AboutForm from "@/components/admin/cms/AboutForm";
import ServicesForm from "@/components/admin/cms/ServicesForm";
import TeamForm from "@/components/admin/cms/TeamForm";
import TestimonialsForm from "@/components/admin/cms/TestimonialsForm";
import StatsForm from "@/components/admin/cms/StatsForm";
import FAQForm from "@/components/admin/cms/FAQForm";
import InsightsForm from "@/components/admin/cms/InsightsForm";
import FooterForm from "@/components/admin/cms/FooterForm";
import SiteSettingsForm from "@/components/admin/cms/SiteSettingsForm";
import LegalPagesForm from "@/components/admin/cms/LegalPagesForm";
import ModalsForm from "@/components/admin/cms/ModalsForm";
import HeadersForm from "@/components/admin/cms/HeadersForm";
import NavbarForm from "@/components/admin/cms/NavbarForm";
import RatesForm from "@/components/admin/cms/RatesForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function CMSSectionPage(props: { params: Promise<{ sectionKey: string }> }) {
    const params = await props.params;
    const { sectionKey } = params;
    const validSections = ["navbar", "hero", "about", "services", "team", "testimonials", "stats", "faq", "insights", "footer", "settings", "legal", "modals", "headers", "rates"];

    if (!validSections.includes(sectionKey)) {
        notFound();
    }

    // Robust array resolver: handles real arrays or objects with numeric keys (indices)
    const resolveArray = (val: any) => {
        if (Array.isArray(val)) return val;
        if (val && typeof val === 'object') {
            const keys = Object.keys(val).filter(k => !isNaN(Number(k)));
            if (keys.length > 0) {
                return keys.sort((a, b) => Number(a) - Number(b)).map(k => val[k]);
            }
        }
        return [];
    };

    let initialData: any = {};

    if (sectionKey === "headers") {
        // Fetch all header sections for the collective form
        const headerKeys = ["servicesHeader", "teamHeader", "testimonialsHeader", "statsHeader", "faqHeader", "insightsHeader"];
        const results = await Promise.all(headerKeys.map(k => getSiteContent(k)));
        headerKeys.forEach((key, i) => {
            initialData[key] = results[i].data;
        });
    } else {
        const { data } = await getSiteContent(sectionKey);
        // Identify which schemas expect an array vs an object
        const isArrayType = ["services", "team", "testimonials", "stats", "faq", "insights"].includes(sectionKey);
        
        if (isArrayType) {
            initialData = resolveArray(data);
        } else {
            initialData = data || {};
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <Link href="/admin/cms" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                        Edit {sectionKey} Section
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Make changes to the public content below and click save. Updates apply immediately.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                {sectionKey === "navbar" && <NavbarForm initialData={initialData} />}
                {sectionKey === "hero" && <HeroForm initialData={initialData} />}
                {sectionKey === "about" && <AboutForm initialData={initialData} />}
                {sectionKey === "services" && <ServicesForm initialData={initialData} />}
                {sectionKey === "team" && <TeamForm initialData={initialData} />}
                {sectionKey === "testimonials" && <TestimonialsForm initialData={initialData} />}
                {sectionKey === "stats" && <StatsForm initialData={initialData} />}
                {sectionKey === "faq" && <FAQForm initialData={initialData} />}
                {sectionKey === "insights" && <InsightsForm initialData={initialData} />}
                {sectionKey === "footer" && <FooterForm initialData={initialData} />}
                {sectionKey === "settings" && <SiteSettingsForm initialData={initialData} />}
                {sectionKey === "legal" && <LegalPagesForm initialData={initialData} />}
                {sectionKey === "modals" && <ModalsForm initialData={initialData} />}
                {sectionKey === "headers" && <HeadersForm initialData={initialData} />}
                {sectionKey === "rates" && <RatesForm initialData={initialData} />}
            </div>
        </div>
    );
}
