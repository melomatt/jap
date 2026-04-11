"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

interface AdminErrorStateProps {
    title?: string;
    message?: string;
    error?: any;
}

export default function AdminErrorState({ 
    title = "Data Retrieval Issue", 
    message = "We couldn't load this section due to a network or server delay.",
    error
}: AdminErrorStateProps) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="w-full h-full p-8 flex items-center justify-center min-h-[400px]">
            <div className="max-w-xl w-full bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden">
                <div className="p-8 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-7 h-7 text-red-500" />
                    </div>
                    
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            {message}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                            <button 
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold hover:opacity-90 active:scale-95 transition-all text-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reload Page
                            </button>
                            
                            {error && (
                                <button 
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline underline-offset-4"
                                >
                                    {showDetails ? "Hide Details" : "View Technical Details"}
                                </button>
                            )}
                        </div>

                        {showDetails && error && (
                            <div className="mt-6 p-4 bg-gray-50 dark:bg-black/50 rounded-xl text-left">
                                <p className="text-xs font-mono text-gray-500 dark:text-gray-400 break-all">
                                    {typeof error === "string" ? error : (error.message || JSON.stringify(error))}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
