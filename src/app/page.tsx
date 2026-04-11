import HomeClient from "@/components/HomeClient";
import { getBatchSiteContent } from "@/app/admin/cms/actions";

export const dynamic = "force-dynamic";

/**
 * Public Homepage - runs as an async Server Component.
 * Fetches all CMS sections in a single batch query for performance.
 */
export default async function Homepage() {
  const sections = [
    "hero",
    "about",
    "services",
    "team",
    "testimonials",
    "stats",
    "faq",
    "insights",
    "footer",
    "modals",
    "servicesHeader",
    "teamHeader",
    "testimonialsHeader",
    "statsHeader",
    "faqHeader",
    "insightsHeader",
    "rates",
  ];

  const { data: cmsData } = await getBatchSiteContent(sections);

  return <HomeClient cmsData={cmsData || {}} />;
}
