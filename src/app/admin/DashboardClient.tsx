"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Users, 
  LayoutTemplate, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  MessageCircle, 
  Inbox, 
  CalendarDays, 
  UserCircle 
} from "lucide-react"

interface DashboardProps {
  stats: {
    activeUsers: number
    pendingUsers: number
    cmsSections: number
    activeChats: number
    pendingQuotes: number
    pendingEvals: number
  }
  user: {
    name: string
    role: string
  }
}

export default function DashboardClient({ stats, user }: DashboardProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } }
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="pb-8 border-b border-gray-200/50 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">Dashboard</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
            Welcome back, <span className="text-blue-600 dark:text-blue-400 font-bold">{user.name}</span>. 
            System is stable.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 capitalize tracking-wide">{user.role.replace("_", " ")} Level Access</span>
        </div>
      </motion.div>

      {/* Primary Statistic Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[
          { label: "Active Accounts", value: stats.activeUsers, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Pending Approvals", value: stats.pendingUsers, icon: Users, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Active CMS Sections", value: stats.cmsSections, icon: LayoutTemplate, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active Support Chats", value: stats.activeChats, icon: MessageCircle, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Pending Quotes", value: stats.pendingQuotes, icon: Inbox, color: "text-pink-500", bg: "bg-pink-500/10" },
          { label: "Open Evaluations", value: stats.pendingEvals, icon: CalendarDays, color: "text-teal-500", bg: "bg-teal-500/10" },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={item}
            className="group relative overflow-hidden bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/20 dark:border-white/5 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white tabular-nums tracking-tight">{stat.value || 0}</p>
              </div>
              <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="w-7 h-7" strokeWidth={1.5} />
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 h-1.5 w-0 ${stat.bg.replace('/10', '/30')} group-hover:w-full transition-all duration-700`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions Title */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 pt-4"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent" />
      </motion.div>

      {/* Navigation Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[
          { title: "CMS Management", desc: "Update your website visuals, team, and services.", href: "/admin/cms", icon: LayoutTemplate, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "User Directory", desc: "Manage privileges and approve new admins.", href: "/admin/users", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { title: "Support Intervention", desc: "Real-time chat support for active visitors.", href: "/admin/chat", icon: MessageCircle, color: "text-purple-500", bg: "bg-purple-500/10" },
          { title: "Service Quotes", desc: "Respond to service and pricing inquiries.", href: "/admin/quotes", icon: Inbox, color: "text-pink-500", bg: "bg-pink-500/10" },
          { title: "Evaluations", desc: "Manage legal case evaluation requests.", href: "/admin/evaluations", icon: CalendarDays, color: "text-teal-500", bg: "bg-teal-500/10" },
          { title: "Account Settings", desc: "Your personal profile and system status.", href: "/admin/users/profile", icon: UserCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((action, idx) => (
          <motion.div key={idx} variants={item}>
            <Link href={action.href} className="group block h-full">
              <div className="h-full bg-white/30 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-8 transition-all hover:bg-white/60 dark:hover:bg-zinc-900/60 hover:shadow-xl hover:-translate-y-1">
                <div className={`${action.bg} ${action.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-500 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  {action.desc}
                </p>
                <div className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">
                  Launch Module <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
