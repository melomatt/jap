"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Globe, 
  Scale, 
  Newspaper, 
  MonitorPlay, 
  LineChart, 
  LogOut,
  ChevronDown,
  ChevronRight,
  FileText,
  MessageCircle,
  Inbox,
  CalendarDays,
  ExternalLink,
  Settings,
  ShieldCheck
} from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function SidebarContent() {
  const pathname = usePathname()
  const router = useRouter()
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({ users: false, cms: true })

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }))
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const isActive = (path: string) => pathname === path || (path !== "/admin" && pathname.startsWith(path + "/"))

  const navItemClasses = (path: string) => `
    relative group flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm transition-all duration-300
    ${isActive(path) ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}
  `

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto custom-scrollbar pt-12 pb-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-8 mb-10">
        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">JAP CMS</span>
      </div>

      <div className="flex-1 px-4 space-y-8">
        {/* Core Navigation Section */}
        <section>
          <p className="px-4 mb-3 text-[11px] font-bold tracking-[0.1em] text-gray-400 dark:text-gray-500 uppercase">General</p>
          <div className="space-y-1">
            <Link href="/admin" className={navItemClasses("/admin")}>
              <div className="flex items-center gap-3 z-10">
                <LayoutDashboard className="w-[20px] h-[20px]" strokeWidth={1.5} />
                <span>Dashboard</span>
              </div>
              {isActive("/admin") && (
                <motion.div 
                  layoutId="active-pill" 
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>

            {/* Users with Dropdown */}
            <div className="relative">
                <button 
                  onClick={() => toggleMenu("users")}
                  className={navItemClasses("/admin/users")}
                >
                  <div className="flex items-center gap-3 z-10">
                    <Users className="w-[20px] h-[20px]" strokeWidth={1.5} />
                    <span>User Directory</span>
                  </div>
                  <div className="flex items-center gap-2 z-10">
                    {openMenus.users ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
                  </div>
                  {isActive("/admin/users") && (
                    <motion.div 
                      layoutId="active-pill" 
                      className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
                <AnimatePresence>
                  {openMenus.users && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden ml-9 mt-1 space-y-1 border-l border-gray-200 dark:border-white/5 pl-4"
                    >
                      <Link href="/admin/users" className={`block py-2 text-sm transition-colors ${pathname === "/admin/users" ? "text-blue-500 font-semibold" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}>List View</Link>
                      <Link href="/admin/users/profile" className={`block py-2 text-sm transition-colors ${pathname === "/admin/users/profile" ? "text-blue-500 font-semibold" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}>System Profile</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>

            <Link href="/admin/chat" className={navItemClasses("/admin/chat")}>
              <div className="flex items-center gap-3 z-10">
                <MessageCircle className="w-[20px] h-[20px]" strokeWidth={1.5} />
                <span>Live Support</span>
              </div>
              {isActive("/admin/chat") && (
                <motion.div 
                  layoutId="active-pill" 
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          </div>
        </section>

        {/* Requests & Logs Section */}
        <section>
          <p className="px-4 mb-3 text-[11px] font-bold tracking-[0.1em] text-gray-400 dark:text-gray-500 uppercase">Requests</p>
          <div className="space-y-1">
            <Link href="/admin/quotes" className={navItemClasses("/admin/quotes")}>
              <div className="flex items-center gap-3 z-10">
                <Inbox className="w-[20px] h-[20px]" strokeWidth={1.5} />
                <span>Quote Requests</span>
              </div>
              {isActive("/admin/quotes") && (
                <motion.div layoutId="active-pill" className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
            </Link>
            <Link href="/admin/evaluations" className={navItemClasses("/admin/evaluations")}>
              <div className="flex items-center gap-3 z-10">
                <CalendarDays className="w-[20px] h-[20px]" strokeWidth={1.5} />
                <span>Evaluations</span>
              </div>
              {isActive("/admin/evaluations") && (
                <motion.div layoutId="active-pill" className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
            </Link>
          </div>
        </section>

        {/* CMS Section */}
        <section>
          <button 
             onClick={() => toggleMenu("cms")}
             className="w-full h-8 flex items-center justify-between px-4 mb-3 group"
          >
             <p className="text-[11px] font-bold tracking-[0.1em] text-gray-400 dark:text-gray-500 uppercase group-hover:text-blue-500 transition-colors">Content Management</p>
             {openMenus.cms ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          <AnimatePresence>
            {openMenus.cms && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-1"
              >
                {[
                  { name: "Hero Visuals", path: "/admin/cms/hero", icon: MonitorPlay },
                  { name: "About Story", path: "/admin/cms/about", icon: FileText },
                  { name: "Services", path: "/admin/cms/services", icon: Scale },
                  { name: "Advisors", path: "/admin/cms/team", icon: Users },
                  { name: "Testimonials", path: "/admin/cms/testimonials", icon: Newspaper },
                  { name: "Global Settings", path: "/admin/cms/settings", icon: Settings },
                ].map((item, idx) => (
                  <Link key={idx} href={item.path} className={navItemClasses(item.path)}>
                    <div className="flex items-center gap-3 z-10">
                      <item.icon className="w-[20px] h-[20px]" strokeWidth={1.5} />
                      <span>{item.name}</span>
                    </div>
                    {isActive(item.path) && (
                      <motion.div layoutId="active-pill" className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    )}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* External Links & Sign Out */}
      <div className="px-4 mt-8 pt-8 border-t border-gray-200 dark:border-white/5 space-y-2">
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:text-blue-600 transition-all font-medium rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-500/10"
        >
          <Globe className="w-[18px] h-[18px]" strokeWidth={1.5} />
          View Live Site
          <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
        </Link>
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all font-bold group"
        >
          <LogOut className="w-[20px] h-[20px] group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
