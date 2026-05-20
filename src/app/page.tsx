import HomeClient from "@/components/HomeClient";
import { getBatchSiteContent } from "./admin/cms/actions";

export const dynamic = "force-dynamic";

export default async function Homepage() {
  const sections = [
    "navbar",
    "hero",
    "services",
    "about",
    "testimonials",
    "stats",
    "team",
    "rates",
    "faq",
    "insights",
    "modals",
    "footer",
    "teamHeader"
  ];
  
  const { data: cmsData } = await getBatchSiteContent(sections);

  return <HomeClient cmsData={cmsData || {}} />;
}
