// /AutoLanguageInitializer.tsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const AutoLanguageInitializer: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const storedLang = localStorage.getItem("localization");
    const supportedLangs = ["en", "uk"];
    const langToSet =
      storedLang && supportedLangs.includes(storedLang) ? storedLang : "en";

    i18n.changeLanguage(langToSet);
  }, [i18n]);

  return null;
};

export default AutoLanguageInitializer;
