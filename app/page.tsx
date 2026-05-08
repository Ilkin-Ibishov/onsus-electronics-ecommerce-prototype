'use client';

import { useState, useEffect } from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { PromoBanners } from '@/components/home/PromoBanners';
import { DealOfDay } from '@/components/home/DealOfDay';
import { ProductGrid } from '@/components/home/ProductGrid';
import { TrustStrip } from '@/components/home/TrustStrip';
import { TrendingCategories } from '@/components/home/TrendingCategories';
import { BrandSlider } from '@/components/home/BrandSlider';
import { NewsletterStrip } from '@/components/home/NewsletterStrip';
import { DepartmentsMenu } from '@/components/layout/NavBar';
import {
  getFeaturedProducts,
  getTopRatedProducts,
  getOnSaleProducts,
  getDealOfDay,
  getCategories,
  type Product,
  type Category,
} from '@/lib/supabase';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [topRated, setTopRated] = useState<Product[]>([]);
  const [onSale, setOnSale] = useState<Product[]>([]);
  const [dealProduct, setDealProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setLoadError(null);
      try {
        const [feat, top, sale, deal, cats] = await Promise.all([
          getFeaturedProducts(),
          getTopRatedProducts(),
          getOnSaleProducts(),
          getDealOfDay(),
          getCategories(),
        ]);
        setFeatured(feat);
        setTopRated(top);
        setOnSale(sale);
        setDealProduct(deal);
        setCategories(cats);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load storefront data';
        console.error('[home]', e);
        setLoadError(msg);
        setFeatured([]);
        setTopRated([]);
        setOnSale([]);
        setDealProduct(null);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-white">
      {loadError ? (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-bold">Could not load catalog data</p>
            <p className="mt-1 opacity-90">{loadError}</p>
          </div>
        </div>
      ) : null}
      {/* Top Section: Sidebar + Hero */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Fixed Sidebar for Home Page */}
          <aside className="hidden lg:block w-[300px] flex-shrink-0 shadow-sm rounded-3xl overflow-hidden border border-gray-100">
             <DepartmentsMenu categories={categories} isStatic={true} />
          </aside>
          
          {/* Main Content Area */}
          <main className="flex-1 min-w-0 w-full overflow-hidden">
             <HeroBanner />
          </main>
        </div>
      </div>
      
      {/* Homepage Sections in Reference Order */}
      <div className="space-y-0">
        <TrustStrip />
        <TrendingCategories categories={categories} loading={loading} />
        <ProductGrid
          featured={featured}
          topRated={topRated}
          onSale={onSale}
          onQuickView={(p) => console.log('QuickView', p)}
        />
        <DealOfDay 
          product={dealProduct} 
          onQuickView={(p) => console.log('QuickView', p)} 
        />
        <PromoBanners />
        <BrandSlider />
        <NewsletterStrip />
      </div>
    </div>
  );
}
