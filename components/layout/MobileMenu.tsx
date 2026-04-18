'use client';

import { X, ChevronDown, ChevronRight, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { type Locale } from '@/lib/translations';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = ['apparel', 'automotive', 'beauty', 'electronics', 'furniture', 'home', 'tools', 'jewelry'] as const;
const navLinks = ['home', 'shop', 'product', 'blog', 'pages'] as const;

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { locale, setLocale, t } = useLanguage();
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const languages: { code: Locale; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'az', label: 'Azərbaycanca' },
    { code: 'ru', label: 'Русский' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-[#333E48] text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xs">O</span>
            </div>
            <span className="font-black text-lg">onsus</span>
          </div>
          <button onClick={onClose} className="p-1 hover:text-orange-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              Language
            </p>
            <div className="flex gap-2 flex-wrap">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setLocale(lang.code); }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    locale === lang.code
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t.nav.allDepartments}</p>
            {categories.map(cat => (
              <div key={cat}>
                <button
                  onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
                  className="w-full flex items-center justify-between py-2.5 text-sm text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <span>{t.categories[cat]}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedCat === cat ? 'rotate-180' : ''}`} />
                </button>
                {expandedCat === cat && (
                  <div className="ml-4 mb-2 space-y-1">
                    {['All Products', 'New Arrivals', 'Best Sellers', 'On Sale'].map(sub => (
                      <button key={sub} className="w-full text-left py-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-2">
                        <ChevronRight className="w-3 h-3" />
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Navigation</p>
            {navLinks.map(link => (
              <button
                key={link}
                onClick={onClose}
                className="w-full text-left py-2.5 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors border-b border-gray-50"
              >
                {t.nav[link]}
              </button>
            ))}
          </div>

          <div className="p-4 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Help</p>
            {['Contact', 'About', 'FAQs', 'Track Order'].map(link => (
              <button key={link} className="w-full text-left py-2 text-sm text-gray-600 hover:text-orange-600 transition-colors">
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
