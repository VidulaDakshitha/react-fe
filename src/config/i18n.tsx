import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your translation files
import translationEN from "../locales/en/translation.json";
import translationSE from "../locales/se/translation.json";

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  se: {
    translation: translationSE,
  },
};

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    debug: true,
    fallbackLng: "se",
    resources,
    lng: "en", // language to use (if you use a language detector, this will be overridden)
    keySeparator: ".",
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
