"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Clock, LogOut, ShieldCheck } from "lucide-react"

export default function PendingApproval({ cmsData }: { cmsData: any }) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as any
      }
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-4">
      {/* Cinematic Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#03060f]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] p-8 md:p-12 space-y-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30"
          >
            <Clock className="w-12 h-12 text-blue-400 animate-pulse" />
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {cmsData.title || "Account Pending"}
            </h1>
            <p className="text-gray-300 leading-relaxed font-light">
              {cmsData.message || "Your request is being reviewed by our team."}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest bg-blue-500/10 py-2 px-4 rounded-full w-fit mx-auto border border-blue-500/20">
              <ShieldCheck className="w-4 h-4" />
              Security Check-in
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {cmsData.description || "Once approved, you will have full access. We appreciate your patience."}
            </p>
          </div>

          <div className="pt-6 border-t border-white/5">
            <button
              onClick={handleSignOut}
              className="group flex items-center justify-center gap-2 w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl border border-white/10 transition-all active:scale-[0.98]"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8 font-light tracking-widest uppercase">
          © 2026 Justice Advocates & Partners, Inc.
        </p>
      </motion.div>
    </div>
  )
}
