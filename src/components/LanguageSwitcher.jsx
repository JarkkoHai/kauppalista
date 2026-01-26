import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fi' ? 'en' : 'fi';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-slate-100 hover:border-emerald-500 transition-all active:scale-95"
      title={i18n.language === 'fi' ? 'Switch to English' : 'Vaihda suomeksi'}
    >
      <Globe className="w-4 h-4 text-slate-600" />
      <span className="font-black text-sm uppercase text-slate-700">
        {i18n.language === 'fi' ? '🇫🇮 FI' : '🇬🇧 EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;