'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Laptop, Smartphone, Camera, Headphones, Watch, Gamepad2, Tv, Speaker, Briefcase, Settings, Heart, Home, Hammer, Gem } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getCategories, type Category } from '@/lib/supabase';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const iconMap: Record<string, { icon: any, color: string, bg: string }> = {
  'electronics': { icon: Tv, color: '#0066cc', bg: 'bg-[#e6f0ff]' },
  'smartphones': { icon: Smartphone, color: '#ff4d4d', bg: 'bg-[#ffebeb]' },
  'laptops': { icon: Laptop, color: '#333E48', bg: 'bg-[#f0f2f5]' },
  'cameras': { icon: Camera, color: '#ff9900', bg: 'bg-[#fff5e6]' },
  'headphones': { icon: Headphones, color: '#00cc99', bg: 'bg-[#ebfcf7]' },
  'smartwatches': { icon: Watch, color: '#9933ff', bg: 'bg-[#f5e6ff]' },
  'gaming': { icon: Gamepad2, color: '#ff3399', bg: 'bg-[#ffe6f2]' },
  'apparel': { icon: Briefcase, color: '#666666', bg: 'bg-[#f4f4f4]' },
  'automotive': { icon: Settings, color: '#444444', bg: 'bg-[#eeeeee]' },
  'beauty': { icon: Heart, color: '#e91e63', bg: 'bg-[#fce4ec]' },
  'furniture': { icon: Home, color: '#795548', bg: 'bg-[#efebe9]' },
  'home': { icon: Home, color: '#607d8b', bg: 'bg-[#eceff1]' },
  'tools': { icon: Hammer, color: '#ff5722', bg: 'bg-[#fbe9e7]' },
  'jewelry': { icon: Gem, color: '#2196f3', bg: 'bg-[#e3f2fd]' },
};

export function TrendingCategories({ 
  categories, 
  loading 
}: { 
  categories?: Category[], 
  loading?: boolean 
}) {
  const { t, locale } = useLanguage();
  const [internalCategories, setInternalCategories] = useState<Category[]>([]);
  const [internalLoading, setInternalLoading] = useState(true);

  // Use props if provided, otherwise internal state
  const displayCategories = categories !== undefined ? categories : internalCategories;
  const isDataReady = categories !== undefined ? !loading : !internalLoading;

  useEffect(() => {
    // Only fetch if categories prop is NOT provided
    if (categories === undefined) {
      getCategories().then(data => {
        setInternalCategories(data);
        setInternalLoading(false);
      });
    }
  }, [categories]);

  const getLocalizedName = (cat: Category) => {
    if (locale === 'az') return cat.name_az;
    if (locale === 'ru') return cat.name_ru;
    return cat.name_en;
  };

  // Mock data for "Wow" factor if DB is empty and not loading
  const finalCats = (isDataReady && displayCategories.length === 0) ? [
    { id: '1', slug: 'smartphones', name_en: 'Smartphones', name_az: 'Smartfonlar', name_ru: 'Смартфоны' },
    { id: '2', slug: 'laptops', name_en: 'Laptops', name_az: 'Noutbuklar', name_ru: 'Ноутбуки' },
    { id: '3', slug: 'electronics', name_en: 'Electronics', name_az: 'Elektronika', name_ru: 'Электроника' },
    { id: '4', slug: 'cameras', name_en: 'Cameras', name_az: 'Kameralar', name_ru: 'Камеры' },
    { id: '5', slug: 'headphones', name_en: 'Headphones', name_az: 'Qulaqlıqlar', name_ru: 'Наушники' },
    { id: '6', slug: 'gaming', name_en: 'Gaming', name_az: 'Oyun', name_ru: 'Игры' },
  ] as Category[] : displayCategories;

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black text-[#333E48] tracking-tight mb-3">
              {(t as any).trendingCategories?.title || 'Trending Categories'}
            </h2>
            <div className="w-20 h-1.5 bg-[#ff4d4d] rounded-full mb-4" />
            <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.1em]">
              {(t as any).trendingCategories?.subtitle || 'Discover what\'s hot right now'}
            </p>
          </div>
          
          <div className="flex gap-3 mb-1">
            <button className="swiper-prev-cat w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-[#333E48] hover:bg-[#333E48] hover:text-white hover:border-[#333E48] transition-all shadow-sm">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="swiper-next-cat w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-[#333E48] hover:bg-[#333E48] hover:text-white hover:border-[#333E48] transition-all shadow-sm">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={2}
          navigation={{
            prevEl: '.swiper-prev-cat',
            nextEl: '.swiper-next-cat',
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            480: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="!pt-4 !pb-12"
        >
          {finalCats.map((cat, idx) => {
            const theme = iconMap[cat.slug] || iconMap['electronics'];
            const Icon = theme.icon;
            
            return (
              <SwiperSlide key={cat.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/shop?category=${cat.slug}`} className="group flex flex-col items-center text-center">
                    <div className={`relative mb-6 flex items-center justify-center w-full aspect-square max-w-[160px] rounded-full ${theme.bg} transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group-hover:-translate-y-3`}>
                      {/* Inner Ring */}
                      <div className="absolute inset-2 rounded-full border border-white/40" />
                      
                      {/* Icon */}
                      <Icon className="w-10 h-10 lg:w-12 lg:h-12 transition-transform duration-500 group-hover:scale-110" style={{ color: theme.color }} />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 rounded-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <h3 className="text-sm font-black text-[#333E48] group-hover:text-[#ff4d4d] transition-colors uppercase tracking-tight line-clamp-1 px-2">
                      {getLocalizedName(cat)}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      {(t as any).trendingCategories?.explore || 'Explore'}
                    </p>
                  </Link>
                </motion.div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
