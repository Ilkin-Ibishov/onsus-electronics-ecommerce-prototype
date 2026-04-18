'use client';

import { Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { type Locale } from '@/lib/translations';

export function TopBar() {
  const { locale, setLocale, t } = useLanguage();

  const languages: { code: Locale; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'az', label: 'Azərbaycanca' },
    { code: 'ru', label: 'Русский' },
  ];

  return (
    <div className="bg-[#1a1a2e] text-white text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-gray-300">{t.topBar.freeCall}</span>
            <a href={`tel:${t.topBar.phone}`} className="text-orange-400 font-medium hover:text-orange-300 transition-colors">
              {t.topBar.phone}
            </a>
          </div>
          <div className="hidden sm:block text-gray-400">|</div>
          <span className="hidden sm:block text-gray-300">{t.topBar.freeShipping}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {['USD', 'EUR'].map((cur, i) => (
              <button
                key={cur}
                className={`text-xs transition-colors ${i === 0 ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
              >
                {cur}
              </button>
            ))}
          </div>

          <div className="text-gray-600">|</div>

          <div className="flex items-center gap-1.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={`text-xs transition-colors px-1 rounded ${
                  locale === lang.code
                    ? 'text-orange-400 font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
