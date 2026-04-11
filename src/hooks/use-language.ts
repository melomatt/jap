import { useEffect, useState } from "react";

export function useLanguage() {
  const [locale, setLocale] = useState<string>("en");

  useEffect(() => {
    // Get locale from localStorage or default to "en"
    const savedLocale = localStorage.getItem("preferred-locale") || "en";
    setLocale(savedLocale);

    // Listen for language changes
    const handleLocaleChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ locale: string }>;
      setLocale(customEvent.detail.locale);
    };

    window.addEventListener("locale-change", handleLocaleChange);
    return () => window.removeEventListener("locale-change", handleLocaleChange);
  }, []);

  return { locale };
}
