'use client';

import { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { MainHeader } from '@/components/layout/MainHeader';
import { NavBar } from '@/components/layout/NavBar';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { HeroBanner } from '@/components/home/HeroBanner';
import { PromoBanners } from '@/components/home/PromoBanners';
import { DealOfDay } from '@/components/home/DealOfDay';
import { ProductGrid } from '@/components/home/ProductGrid';
import { TrustStrip } from '@/components/home/TrustStrip';
import { CartSidebar } from '@/components/sidebars/CartSidebar';
import { WishlistSidebar } from '@/components/sidebars/WishlistSidebar';
import { AuthModal } from '@/components/modals/AuthModal';
import { QuickViewModal } from '@/components/modals/QuickViewModal';
import {
  getFeaturedProducts,
  getTopRatedProducts,
  getOnSaleProducts,
  getDealOfDay,
  type Product,
} from '@/lib/supabase';

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [featured, setFeatured] = useState<Product[]>([]);
  const [topRated, setTopRated] = useState<Product[]>([]);
  const [onSale, setOnSale] = useState<Product[]>([]);
  const [dealProduct, setDealProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData() {
      const [feat, top, sale, deal] = await Promise.all([
        getFeaturedProducts(),
        getTopRatedProducts(),
        getOnSaleProducts(),
        getDealOfDay(),
      ]);
      setFeatured(feat);
      setTopRated(top);
      setOnSale(sale);
      setDealProduct(deal);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <MainHeader
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
        onAuthOpen={() => setAuthOpen(true)}
        onMobileMenuOpen={() => setMobileMenuOpen(true)}
      />
      <NavBar />

      <main className="flex-1">
        <HeroBanner />
        <PromoBanners />
        <DealOfDay product={dealProduct} onQuickView={setQuickViewProduct} />
        <ProductGrid
          featured={featured}
          topRated={topRated}
          onSale={onSale}
          onQuickView={setQuickViewProduct}
        />
        <TrustStrip />
      </main>

      <Footer />

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistSidebar isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
