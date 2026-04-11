"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if consent has already been given
        const consent = localStorage.getItem("jap_cookie_consent");
        if (!consent) {
            // Delay showing the banner for a better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("jap_cookie_consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("jap_cookie_consent", "declined");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:w-[480px]"
                >
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-5 md:p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                        <Cookie className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cookie Consent</h3>
                                </div>
                                <button 
                                    onClick={() => setIsVisible(false)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 group"
                                >
                                    Accept All
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2.5 px-4 rounded-xl transition-all active:scale-95"
                                >
                                    Necessary Only
                                </button>
                            </div>
                            
                            <div className="text-center">
                                <Link 
                                    href="/privacy" 
                                    className="text-[11px] text-gray-500 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 transition-colors uppercase tracking-widest font-semibold"
                                >
                                    View Cookie Policy
                                </Link>
                            </div>
                        </div>
                        
                        {/* Progress Bar or Subtle Detail */}
                        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
                            <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-blue-600"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
