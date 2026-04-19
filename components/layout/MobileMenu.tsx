'use client';

import { X, ChevronDown, ChevronRight, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { type Locale } from '@/lib/translations';
import Image from 'next/image';
import Link from 'next/link';

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] lg:hidden">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#333E48]/40 backdrop-blur-sm" 
            onClick={onClose} 
          />
          
          {/* Menu */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.15)]"
          >
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
              <Link href="/" onClick={onClose} className="flex items-center gap-2">
                <div className="relative w-[57px] h-[57px]">
                  <Image
                    src="/onsus-electronics-ecommerce-prototype/logo.svg"
                    alt="Strike Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
              <button 
                onClick={onClose} 
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-[#333E48] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  Language
                </p>
                <div className="flex gap-2 flex-wrap">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLocale(lang.code); }}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wide ${
                        locale === lang.code
                          ? 'bg-[#ff4d4d] text-white shadow-lg shadow-red-500/10'
                          : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-[#ff4d4d]'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 border-b border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t.nav.allDepartments}</p>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <div key={cat} className="group">
                      <button
                        onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
                        className={`w-full flex items-center justify-between py-3 px-3 rounded-xl text-sm font-bold transition-all ${
                          expandedCat === cat 
                            ? 'bg-red-50 text-[#ff4d4d]' 
                            : 'text-[#333E48] hover:bg-gray-50'
                        }`}
                      >
                        <span>{t.categories[cat]}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedCat === cat ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedCat === cat && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden ml-4 mt-1 space-y-1"
                          >
                            {['All Products', 'New Arrivals', 'Best Sellers', 'On Sale'].map(sub => (
                              <button key={sub} className="w-full text-left py-2 px-4 text-sm font-medium text-gray-500 hover:text-[#ff4d4d] transition-colors flex items-center gap-2 rounded-lg hover:bg-red-50/50">
                                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                                {sub}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Navigation</p>
                <div className="space-y-1">
                  {navLinks.map(link => (
                    <button
                      key={link}
                      onClick={onClose}
                      className="w-full text-left py-3 px-3 text-sm font-bold text-[#333E48] hover:bg-gray-50 hover:text-[#ff4d4d] transition-all rounded-xl uppercase tracking-wide"
                    >
                      {t.nav[link]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50/50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Help & Support</p>
                <div className="space-y-1">
                  {['Contact', 'About', 'FAQs', 'Track Order'].map(link => (
                    <button key={link} className="w-full text-left py-2.5 px-3 text-sm font-bold text-gray-500 hover:text-[#ff4d4d] transition-all rounded-xl">
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
