"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service if needed,
        // but hide it from the user.
        console.error("Global Application Error Caught:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
            <motion.div 
                className="max-w-2xl w-full text-center space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 mb-4">
                    <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Connection Interrupted
                </h2>
                
                <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
                    We&apos;re currently experiencing difficulties connecting to our services. Please verify your internet connection or try again momentarily.
                </p>
                
                <div className="pt-8">
                    <button
                        onClick={() => reset()}
                        className="px-10 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all active:scale-95 flex items-center justify-center gap-3 mx-auto"
                    >
                        Try Again
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
