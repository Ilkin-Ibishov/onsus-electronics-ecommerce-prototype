'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { getFilteredProducts, getCategories, type Product, type Category } from '@/lib/supabase';
import { ShopSidebar } from '@/components/shop/ShopSidebar';
import { ShopFilterBar } from '@/components/shop/ShopFilterBar';
import { ProductCard } from '@/components/home/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

function ShopContent() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest');

  useEffect(() => {
    async function loadInitialData() {
      const cats = await getCategories();
      setCategories(cats);
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const filtered = await getFilteredProducts({
        category: selectedCategory,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy: sortBy
      });
      
      // For prototype: we just use the filtered results and don't apply Brand/Color/Size 
      // on the backend since schema doesn't support it, but the UI will show it.
      setProducts(filtered);
      setLoading(false);
    }
    loadProducts();
  }, [selectedCategory, priceRange, sortBy]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-8 uppercase tracking-widest">
          <a href="/" className="hover:text-[#ff4d4d] transition-colors">{t.nav.home}</a>
          <span>/</span>
          <span className="text-[#333E48]">{t.nav.shop}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <ShopSidebar 
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              selectedSizes={selectedSizes}
              setSelectedSizes={setSelectedSizes}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <ShopFilterBar 
              totalResults={products.length}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 6].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl h-[400px] animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-bold text-lg">No products found</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('');
                    setPriceRange([0, 5000]);
                  }}
                  className="mt-4 text-[#ff4d4d] font-bold underline hover:no-underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-gray-400 font-bold">Loading shop...</div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
