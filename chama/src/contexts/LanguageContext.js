import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('en');
    const [isSimpleMode, setIsSimpleMode] = useState(false);

    const t = (key) => translations[lang][key] || key;

    useEffect(() => {
        if (isSimpleMode) {
            document.body.classList.add('simple-mode');
        } else {
            document.body.classList.remove('simple-mode');
        }
    }, [isSimpleMode]);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, isSimpleMode, setIsSimpleMode }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => useContext(LanguageContext);
