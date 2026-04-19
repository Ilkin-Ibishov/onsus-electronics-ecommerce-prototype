'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { MainHeader } from '@/components/layout/MainHeader';
import { NavBar } from '@/components/layout/NavBar';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { CartSidebar } from '@/components/sidebars/CartSidebar';
import { WishlistSidebar } from '@/components/sidebars/WishlistSidebar';
import { AuthModal } from '@/components/modals/AuthModal';
import { QuickViewModal } from '@/components/modals/QuickViewModal';
import { ComparisonDrawer } from '@/components/shop/ComparisonDrawer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { type Product } from '@/lib/supabase';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white pb-[70px] lg:pb-0">
      <TopBar />
      <MainHeader
        onMobileMenuOpen={() => setMobileMenuOpen(true)}
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
        onAuthOpen={() => setAuthOpen(true)}
      />
      <NavBar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
      <ComparisonDrawer />
      <MobileBottomNav />

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistSidebar isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
