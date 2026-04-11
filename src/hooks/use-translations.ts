import { useEffect, useState } from "react";
import { useLanguage } from "./use-language";

type TranslationMessages = Record<string, any>;

const translations: Record<string, TranslationMessages> = {};

// Load messages at build time
async function loadMessages(locale: string): Promise<TranslationMessages> {
  if (translations[locale]) {
    return translations[locale];
  }

  try {
    const messages = await import(`@/messages/${locale}.json`);
    translations[locale] = messages.default;
    return messages.default;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    // Fallback to English if locale not found
    if (locale !== "en") {
      return loadMessages("en");
    }
    return {};
  }
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, prop) => current?.[prop], obj);
}

export function useTranslations() {
  const { locale } = useLanguage();
  const [messages, setMessages] = useState<TranslationMessages>({});

  useEffect(() => {
    loadMessages(locale).then(setMessages);
  }, [locale]);

  const t = (key: string, defaultValue?: string): string => {
    const value = getNestedValue(messages, key);
    return value || defaultValue || key;
  };

  return { t, locale };
}
