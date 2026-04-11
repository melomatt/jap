"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

interface LoadingContextValue {
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextValue>({
  showLoader: () => {},
  hideLoader: () => {},
  isLoading: false,
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Please wait...");

  const showLoader = useCallback((msg?: string) => {
    setMessage(msg || "Please wait...");
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Automatically hide loader on route change
  const pathname = usePathname();
  useEffect(() => {
    hideLoader();
  }, [pathname, hideLoader]);

  return (
    <LoadingContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md p-4">
          {/* Spinning JAP Logo Container */}
          <div className="relative flex items-center justify-center mb-8">
            {/* Outer spinning ring with hardware acceleration */}
            <div 
              className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 animate-spin" 
              style={{ willChange: "transform" }}
            />
            {/* Logo in center */}
            <img
              src="/jap_logo.png"
              alt="JAP Inc."
              className="w-12 h-12 md:w-14 md:h-14 object-contain animate-pulse"
            />
          </div>

          {/* Text content wrapped for smaller screens */}
          <div className="text-center max-w-[280px] md:max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">
              {message}
            </p>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
              Justice Advocates &amp; Partners, Inc.
            </p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoadingContext);
}
