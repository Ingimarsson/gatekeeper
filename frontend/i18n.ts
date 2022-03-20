import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationEN from "./public/locales/en/translation.json";
import translationIS from "./public/locales/is/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  is: {
    translation: translationIS,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // bind react-i18next to the instance
  .init({
    resources,
    fallbackLng: "en",
    debug: true,
  });

export default i18n;
