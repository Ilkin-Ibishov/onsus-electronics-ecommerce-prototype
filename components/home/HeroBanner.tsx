'use client';

import { ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export function HeroBanner() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-[#1A2229] overflow-hidden min-h-[520px] lg:min-h-[640px] rounded-[3rem] shadow-2xl border border-white/[0.03] w-full">
      {/* Background with higher fidelity */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Hero"
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2229] via-[#1A2229]/95 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,77,77,0.1),transparent)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-16 py-12 lg:py-24 flex flex-col lg:flex-row items-center gap-12 z-20">
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block bg-[#ff4d4d]/15 text-[#ff4d4d] text-[11px] font-extrabold uppercase tracking-[0.2em] px-5 py-4 rounded-full mb-8 border border-[#ff4d4d]/20 backdrop-blur-md">
            {t.hero.badge}
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-8 tracking-tight">
            {t.hero.title}
          </h1>

          <p className="text-gray-300 text-base lg:text-lg mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium opacity-90">
            {t.hero.subtitle}
          </p>

          <div className="flex items-center gap-5 mb-12 justify-center lg:justify-start group/price">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">{t.hero.from}</span>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-[#ff4d4d] mr-1">₼</span>
              <span className="text-5xl font-extrabold text-white tracking-tighter shadow-sm">{t.hero.price.replace('₼', '')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <Link href="/shop" className="inline-flex items-center justify-center gap-3 bg-[#ff4d4d] hover:bg-[#e64444] text-white font-extrabold px-12 py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#ff4d4d]/40 active:scale-95 uppercase text-[12px] tracking-[0.15em] whitespace-nowrap group">
              <ShoppingBag className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform" />
              {t.hero.shopNow}
            </Link>
            <Link href="/shop" className="inline-flex items-center justify-center gap-3 border-2 border-white/5 text-white hover:border-white/20 font-extrabold px-12 py-4 rounded-2xl transition-all hover:bg-white/5 backdrop-blur-md uppercase text-[12px] tracking-[0.15em] whitespace-nowrap group">
              {t.hero.exploreAll}
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center lg:justify-end relative"
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px]">
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full bg-[#ff4d4d]/5 animate-[ping_4s_infinite]" />
            <div className="absolute -inset-8 rounded-full bg-[#ff4d4d]/2 animate-[pulse_6s_infinite]" />

            <img
              src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Featured Product"
              className="relative z-10 w-full h-full object-cover rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5"
            />

            {/* Dynamic Badge */}
            <motion.div
              className="absolute -top-6 -right-6 bg-white text-gray-900 text-xs font-black w-20 h-20 rounded-full shadow-2xl z-20 flex items-center justify-center flex-col border-4 border-[#ff4d4d] backdrop-blur-md"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 8 }}
            >
              <span className="text-[10px] font-bold text-[#ff4d4d]">NEW</span>
              <span className="text-base tracking-tighter">2026</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden lg:flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <span className="text-[10px] font-extrabold text-white/40 uppercase tracking-[0.5em] group-hover:text-white transition-colors">Explore</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#ff4d4d] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
      </motion.div>

      {/* Aesthetic bottom bridge */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </section>
  );
}
