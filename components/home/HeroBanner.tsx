'use client';

import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function HeroBanner() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-[#1a1a2e] overflow-hidden min-h-[480px] lg:min-h-[520px]">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Hero"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-orange-500/30">
            {t.hero.badge}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            {t.hero.title}
          </h1>

          <p className="text-gray-300 text-base lg:text-lg mb-6 max-w-md mx-auto lg:mx-0">
            {t.hero.subtitle}
          </p>

          <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
            <span className="text-gray-400 text-sm">{t.hero.from}</span>
            <span className="text-3xl font-black text-orange-400">{t.hero.price}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-lg transition-all hover:shadow-lg hover:shadow-orange-500/30 active:scale-95">
              <ShoppingBag className="w-5 h-5" />
              {t.hero.shopNow}
            </button>
            <button className="flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:border-white/60 font-semibold px-8 py-3.5 rounded-lg transition-all hover:bg-white/10">
              {t.hero.exploreAll}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end relative">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-orange-500/5" />
            <img
              src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500"
              alt="Featured Product"
              className="relative z-10 w-full h-full object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg z-20 animate-bounce">
              NEW
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/5 to-transparent" />
    </section>
  );
}
