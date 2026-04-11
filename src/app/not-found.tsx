"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] dark:bg-black px-6">
      <div className="text-center max-w-md">
        <img src="/jap_logo.png" alt="JAP Inc." className="h-16 mx-auto mb-8 opacity-80" />

        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
          Error 404
        </p>

        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Page Not Found
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-10">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-all active:scale-95 shadow-sm"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-white font-semibold px-6 py-3 rounded-full transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <p className="mt-12 text-xs text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} Justice Advocates &amp; Partners, Inc.
        </p>
      </div>
    </div>
  );
}
