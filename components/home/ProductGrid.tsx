'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { type Product } from '@/lib/supabase';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  featured: Product[];
  topRated: Product[];
  onSale: Product[];
  onQuickView: (product: Product) => void;
}

type Tab = 'featured' | 'topRated' | 'onSale';

export function ProductGrid({ featured, topRated, onSale, onQuickView }: ProductGridProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('featured');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'featured', label: t.products.featured },
    { key: 'topRated', label: t.products.topRated },
    { key: 'onSale', label: t.products.onSale },
  ];

  const products = activeTab === 'featured' ? featured : activeTab === 'topRated' ? topRated : onSale;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-orange-500 rounded-full" />
          <h2 className="text-2xl font-black text-[#333E48]">{t.products.title}</h2>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === tab.key
                  ? 'bg-white text-orange-500 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
        {products.length === 0 && (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Link href="/shop" className="flex items-center gap-2 border-2 border-[#333E48] text-[#333E48] hover:bg-[#333E48] hover:text-white font-bold px-8 py-3 rounded-lg transition-all group">
          {t.products.viewAll}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
