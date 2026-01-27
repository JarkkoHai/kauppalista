import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);

  const toggleLanguage = async () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'fi' ? 'en' : 'fi';
    
    console.log('🔵 Switching from', currentLang, 'to', newLang);
    setIsChanging(true);
    
    await i18n.changeLanguage(newLang);
    
    // Pakota sivun päivitys vasta kun kieli on vaihtunut
    setTimeout(() => {
      setIsChanging(false);
      window.location.reload(); // ← Pakottaa sivun latauksen uudelleen
    }, 100);
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isChanging}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-slate-100 hover:border-emerald-500 transition-all active:scale-95 disabled:opacity-50"
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