import Link from "next/link";
import { MonitorPlay, FileText, Scale, Users, Newspaper, Settings } from "lucide-react";

export default function CMSDashboardIndex() {
  const sections = [
    { name: "Hero Visuals", key: "hero", desc: "Modify hero text, backgrounds, and main CTAs", icon: MonitorPlay },
    { name: "About Story", key: "about", desc: "Update firm history, mission, vision, and core values", icon: FileText },
    { name: "Services", key: "services", desc: "Manage legal service listings and descriptions", icon: Scale },
    { name: "Advisors", key: "team", desc: "Update corporate advisors and legal partners", icon: Users },
    { name: "Testimonials", key: "testimonials", desc: "View and update client reviews", icon: Newspaper },
    { name: "Global Settings", key: "settings", desc: "Configure global terms, privacy, and metadata", icon: Settings },
  ];

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto py-4">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 dark:text-white tracking-tight">Content Management (CMS)</h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-light max-w-2xl leading-relaxed">
          Select a visual page component below to modify its public content, update images, or localize translations. Updates apply globally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((sec) => (
          <Link key={sec.key} href={`/admin/cms/${sec.key}`} className="block group">
            <div className="h-full bg-white/40 dark:bg-zinc-900/20 backdrop-blur-2xl border border-gray-200/50 dark:border-white/5 p-6 rounded-[2.25rem] shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 active:scale-[0.98] flex flex-col justify-between hover:border-blue-500/50 dark:hover:border-blue-500/50">
              <div>
                <div className="p-3.5 bg-blue-50 dark:bg-blue-500/10 rounded-[1.25rem] w-fit text-blue-600 dark:text-blue-400 group-hover:scale-115 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-white transition-all duration-300 shadow-sm">
                  <sec.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-6 tracking-tight">{sec.name}</h2>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2 font-light leading-relaxed">{sec.desc}</p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                Edit Content <span className="ml-1">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
