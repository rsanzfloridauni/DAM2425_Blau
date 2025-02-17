import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [isSpanish, setIsSpanish] = useState(false);

  const toggleLanguage = () => {
    setIsSpanish(!isSpanish);
  };

  return (
    <LanguageContext.Provider value={{ isSpanish, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);