import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { TRANSLATIONS } from "../i18n/translations";

const LanguageContext = createContext(null);

const STORAGE_KEY = "igms.language";

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "gu" || saved === "en") return saved;
    } catch (e) {}
    return "en"; // Default is English
  });

  const setLanguage = useCallback((lang) => {
    const validLang = lang === "gu" ? "gu" : "en";
    setLanguageState(validLang);
    try {
      localStorage.setItem(STORAGE_KEY, validLang);
    } catch (e) {}
    // Update HTML lang attribute
    document.documentElement.lang = validLang === "gu" ? "gu" : "en";
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "gu" ? "gu" : "en";
  }, [language]);

  /**
   * Safe Translation Key Resolver
   * Supports dot-notation, e.g., t("nav.dashboard") or t("common.save")
   */
  const t = useCallback(
    (key, fallback = "") => {
      if (!key) return "";
      const currentDict = TRANSLATIONS[language] || TRANSLATIONS.en;

      // Direct key lookup
      if (currentDict[key] !== undefined) {
        return currentDict[key];
      }

      // Dot notation lookup (e.g. 'common.save' or 'meal.todaysMeal')
      const parts = key.split(".");
      let val = currentDict;
      for (const part of parts) {
        if (val && typeof val === "object" && part in val) {
          val = val[part];
        } else {
          val = undefined;
          break;
        }
      }

      if (val !== undefined && typeof val === "string") {
        return val;
      }

      // Fallback to English dictionary if missing in current
      if (language !== "en") {
        let fallbackVal = TRANSLATIONS.en;
        for (const part of parts) {
          if (fallbackVal && typeof fallbackVal === "object" && part in fallbackVal) {
            fallbackVal = fallbackVal[part];
          } else {
            fallbackVal = undefined;
            break;
          }
        }
        if (fallbackVal !== undefined && typeof fallbackVal === "string") {
          return fallbackVal;
        }
      }

      return fallback || key;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isGu: language === "gu",
      isEn: language === "en",
      dictionary: TRANSLATIONS[language] || TRANSLATIONS.en,
    }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
