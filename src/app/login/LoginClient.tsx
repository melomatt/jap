"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ShieldAlert, Clock, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react"
import { useLoader } from "@/components/providers/LoadingProvider"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage({ cmsData }: { cmsData: any }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const accessDenied = searchParams.get("error") === "access_denied"
  const supabase = createClient()
  const { showLoader, hideLoader } = useLoader()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message === "Failed to fetch" || error.message.includes("fetch")) {
        setError("Network error: Unable to reach the server. Please check your internet connection.")
      } else {
        setError(error.message)
      }
      setIsLoading(false)
    } else {
      router.push("/admin")
      router.refresh()
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: [0.22, 1, 0.36, 1] as any
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-4">
      {/* Cinematic Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#03060f]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/30 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] p-8 md:p-12 space-y-8">
          {/* Logo / Header */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-block p-4 rounded-3xl bg-white/5 backdrop-blur-md mb-6 border border-white/10"
            >
              <img src="/jap_logo.png" alt="JAP Inc." className="h-16 mx-auto" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {cmsData.title || "Welcome Back"}
            </h1>
            <p className="mt-2 text-gray-400 text-sm md:text-base font-light">
              {cmsData.subtitle || "Sign in to your professional account"}
            </p>
          </motion.div>

          {/* Access Denied Banner */}
          <AnimatePresence>
            {accessDenied && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-start gap-4 bg-amber-500/10 border border-amber-500/20 text-amber-200 p-4 rounded-[1.5rem] text-sm backdrop-blur-md"
              >
                <Clock className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <p className="font-bold mb-0.5 text-amber-500">Account Pending Verification</p>
                  <p className="text-amber-200/80 leading-relaxed font-light">Your account is created and awaiting administrator approval. You will receive an email once activated.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm backdrop-blur-md"
                >
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-500 text-gray-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white placeholder:text-gray-600 text-base"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-500 text-gray-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white placeholder:text-gray-600 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full group bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="text-center pt-4 border-t border-white/5">
            <p className="text-sm text-gray-500 font-light">
              Need an account?{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 transition-colors">
                Register Here
              </Link>
            </p>
          </motion.div>
        </div>

        <motion.p variants={itemVariants} className="text-center text-xs text-gray-600 mt-8 font-light tracking-widest uppercase">
          © 2026 Justice Advocates & Partners, Inc.
        </motion.p>
      </motion.div>
    </div>
  )
}
