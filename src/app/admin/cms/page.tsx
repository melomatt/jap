"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Layers, 
  FileText, 
  Settings, 
  Users, 
  LayoutDashboard, 
  MessageSquare, 
  BarChart, 
  HelpCircle, 
  Newspaper, 
  Globe, 
  ArrowRight,
  MonitorPlay,
  Scale,
  LineChart,
  DollarSign
} from "lucide-react"

export default function CMSDashboard() {
  const sections = [
    { id: "hero", title: "Hero Visuals", description: "Manage the main landing banner, titles, and cinematic background imagery.", icon: <MonitorPlay className="h-6 w-6 text-blue-500" />, href: "/admin/cms/hero" },
    { id: "about", title: "About Story", description: "Edit the firm's history, mission, vision, and core fundamental values.", icon: <FileText className="h-6 w-6 text-emerald-500" />, href: "/admin/cms/about" },
    { id: "services", title: "Legal Services", description: "Add, modify, or remove practice areas and primary legal services.", icon: <Scale className="h-6 w-6 text-purple-500" />, href: "/admin/cms/services" },
    { id: "team", title: "The Advisors", description: "Manage profiles, bios, and portrait photos of the legal advocate team.", icon: <Users className="h-6 w-6 text-amber-500" />, href: "/admin/cms/team" },
    { id: "testimonials", title: "Testimonials", description: "Update client success stories and quotes displayed on the site.", icon: <Newspaper className="h-6 w-6 text-pink-500" />, href: "/admin/cms/testimonials" },
    { id: "faq", title: "FAQ Center", description: "Manage frequently asked questions and their detailed legal answers.", icon: <HelpCircle className="h-6 w-6 text-indigo-500" />, href: "/admin/cms/faq" },
    { id: "insights", title: "Insights & News", description: "Publish fresh news, legal trends, and company-related articles.", icon: <LineChart className="h-6 w-6 text-teal-500" />, href: "/admin/cms/insights" },
    { id: "settings", title: "Global Settings", description: "Manage branding, metadata, and core authentication-related text.", icon: <Settings className="h-6 w-6 text-gray-500" />, href: "/admin/cms/settings" },
    { id: "navbar", title: "Navigation", description: "Edit the main navigation links, phone contact, and global CTA.", icon: <Globe className="h-6 w-6 text-cyan-500" />, href: "/admin/cms/navbar" },
    { id: "rates", title: "Service Rates", description: "Manage hourly legal fees for partners, associates, and counsel.", icon: <DollarSign className="h-6 w-6 text-orange-500" />, href: "/admin/cms/rates" },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pb-8 border-b border-gray-200/50 dark:border-white/5"
      >
        <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Content Management</h1>
        </div>
        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl">
          Select a system section below to modify the public-facing content of the JAP Inc. platform.
        </p>
      </motion.div>

      {/* Grid of Sections */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sections.map((section) => (
          <motion.div key={section.id} variants={item}>
            <Link href={section.href} className="group block h-full">
              <div className="h-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-8 transition-all hover:bg-white/60 dark:hover:bg-zinc-900/60 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1">
                <div className="flex items-center gap-5 mb-6">
                  <div className="p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl group-hover:bg-blue-500/10 transition-colors duration-500 group-hover:scale-110">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {section.title}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-6 font-medium">
                  {section.description}
                </p>
                <div className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                  Edit Section <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

