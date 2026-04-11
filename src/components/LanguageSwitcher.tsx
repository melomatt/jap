"use client";

import { useCallback } from "react";
import { useLanguage } from "@/hooks/use-language";

export function LanguageSwitcher({ isScrolled = false }: { isScrolled?: boolean }) {
  const { locale } = useLanguage();

  const handleLanguageChange = useCallback((newLocale: string) => {
    // Store language preference in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-locale", newLocale);
      // Trigger a custom event for components to react
      window.dispatchEvent(new CustomEvent("locale-change", { detail: { locale: newLocale } }));
    }
  }, []);

  return (
    <div className={`inline-flex items-center border rounded-lg overflow-hidden transition-colors duration-500 ${
      isScrolled 
        ? "border-gray-200 dark:border-white/10" 
        : "border-white/30"
    }`}>
      <img
        src={locale === "en" ? "/uk.png" : "/france.png"}
        alt={locale === "en" ? "English" : "Français"}
        className="h-4 w-4 ml-2 rounded-sm object-cover"
      />
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className={`text-xs font-semibold px-2 py-1.5 outline-none bg-transparent cursor-pointer transition-colors duration-500 ${
          isScrolled 
            ? "text-gray-900 dark:text-white" 
            : "text-white"
        }`}
      >
        <option value="en" className="text-gray-900">English</option>
        <option value="fr" className="text-gray-900">Français</option>
      </select>
    </div>
  );
}
