"use client"

import { useState } from "react"
import SidebarContent from "@/components/admin/SidebarContent"
import { Menu, X } from "lucide-react"
import { Toaster } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#F5F5F7] dark:bg-[#010204] font-sans">
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: '1.25rem', fontSize: '14px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' } }} />
      
      {/* Mobile Header (Hamburger Menu) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-black/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 z-30 flex items-center px-6 justify-between transition-all">
        <span className="font-bold text-gray-900 dark:text-white tracking-tight">JAP Admin</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all active:scale-90"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation - Desktop Floating Island */}
      <aside className="hidden md:flex relative z-20 m-4 w-72 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[2.5rem] flex-col shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-4 top-20 bottom-4 w-[280px] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl z-50 rounded-[2.25rem] border border-white/20 dark:border-white/10 flex flex-col shadow-2xl overflow-hidden"
            >
              <div onClick={() => setIsMobileMenuOpen(false)} className="h-full">
                 <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto w-full flex flex-col pt-20 md:pt-6">
        {/* Dynamic Inner Header / Breadcrumbs */}
        <header className="sticky top-0 z-10 px-6 md:px-10 py-4 flex items-center justify-between">
           <div className="flex items-center gap-2 text-[13px] font-medium text-gray-400 dark:text-gray-500 bg-white/40 dark:bg-black/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 dark:border-white/5 shadow-sm">
             <span className="opacity-60">Admin</span>
             <span className="opacity-30">/</span>
             <span className="text-gray-900 dark:text-white capitalize">
               {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
             </span>
           </div>
        </header>

        <div className="p-6 md:p-8 lg:p-10 w-full max-w-[1600px] flex-1 mx-auto pt-4 md:pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <footer className="w-full py-6 px-10 text-[11px] font-medium text-gray-400 dark:text-gray-500 border-t border-gray-200/50 dark:border-white/5 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 opacity-70">
            <span>© 2026 Justice Advocates & Partners, Inc.</span>
            <span className="tracking-wide">Admin CMS • Built by Matthias B.E. Luogon</span>
          </div>
        </footer>
      </main>
    </div>
  )
}

