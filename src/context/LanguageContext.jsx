import { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../lib/i18n';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    // Update HTML lang attribute
    document.documentElement.lang = lng;
    // Store in localStorage
    localStorage.setItem('i18nextLng', lng);
  };

  useEffect(() => {
    // Update HTML lang attribute on mount
    const lang = i18n.language || 'en';
    document.documentElement.lang = lang;
    setCurrentLanguage(lang);

    // Listen for language changes
    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng);
      document.documentElement.lang = lng;
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

