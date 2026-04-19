'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function PromoBanners() {
  const { t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Link href="/shop" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 min-h-[220px] group cursor-pointer block">
          <img
            src="https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Camera Deal"
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute top-4 right-4 bg-orange-500 text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg">
            {t.promo.sale1Badge}
          </div>
          <div className="relative p-6 flex flex-col justify-between h-full min-h-[220px]">
            <div>
              <h3 className="text-white text-xl font-black mb-1">{t.promo.sale1Title}</h3>
              <p className="text-gray-300 text-sm">{t.promo.sale1Sub}</p>
            </div>
            <div className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold text-sm transition-colors mt-4 group/btn">
              {t.hero.shopNow}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/shop" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 min-h-[220px] group cursor-pointer block">
          <img
            src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Audio Deal"
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute top-4 right-4 bg-blue-500 text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg">
            {t.promo.sale2Badge}
          </div>
          <div className="relative p-6 flex flex-col justify-between h-full min-h-[220px]">
            <div>
              <h3 className="text-white text-xl font-black mb-1">{t.promo.sale2Title}</h3>
              <p className="text-gray-300 text-sm">{t.promo.sale2Sub}</p>
            </div>
            <div className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors mt-4 group/btn">
              {t.hero.shopNow}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      <Link href="/shop" className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a1a2e] via-slate-800 to-[#1a1a2e] min-h-[180px] group cursor-pointer block">
        <img
          src="https://images.pexels.com/photos/3977908/pexels-photo-3977908.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Featured"
          className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute top-4 right-6 bg-yellow-500 text-black text-sm font-black px-3 py-1.5 rounded-full shadow-lg">
          {t.featured.badge}
        </div>
        <div className="relative p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 h-full min-h-[180px]">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{t.featured.subtitle}</p>
            <h3 className="text-white text-2xl font-black mb-2">{t.featured.title}</h3>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 line-through text-sm">{t.featured.originalPrice}</span>
              <span className="text-yellow-400 text-2xl font-black">{t.featured.salePrice}</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg transition-all hover:shadow-lg active:scale-95">
            {t.featured.shopNow}
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </section>
  );
}
