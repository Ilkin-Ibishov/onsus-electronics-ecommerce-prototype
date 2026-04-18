'use client';

import { Search, Headphones, User, ShoppingCart, Heart, GitCompare, X, Menu } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

interface MainHeaderProps {
  onCartOpen: () => void;
  onWishlistOpen: () => void;
  onAuthOpen: () => void;
  onMobileMenuOpen: () => void;
}

export function MainHeader({ onCartOpen, onWishlistOpen, onAuthOpen, onMobileMenuOpen }: MainHeaderProps) {
  const { t } = useLanguage();
  const { cartCount, wishlistCount, compareCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const popularSearches = ['iPhone', 'Laptop', 'Headphones', 'Camera', 'Watch'];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={onMobileMenuOpen}
            className="lg:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <a href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">O</span>
              </div>
              <span className="text-2xl font-black text-[#333E48] tracking-tight">onsus</span>
            </div>
          </a>

          <div className="flex-1 max-w-2xl relative hidden sm:block">
            <div className={`flex items-center border-2 rounded-lg overflow-hidden transition-colors ${searchFocused ? 'border-orange-500' : 'border-gray-200'}`}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder={t.header.searchPlaceholder}
                className="flex-1 px-4 py-2.5 text-sm outline-none text-gray-700 bg-gray-50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>

            {searchFocused && !searchQuery && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-3 z-50">
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="text-xs bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-600 px-3 py-1.5 rounded-full transition-colors border border-gray-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#333E48]">{t.header.support}</p>
              <p className="text-xs text-gray-500">{t.header.supportSub}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0 ml-auto sm:ml-0">
            <button
              onClick={onAuthOpen}
              className="flex flex-col items-center gap-0.5 p-2 text-gray-600 hover:text-orange-500 transition-colors group"
            >
              <User className="w-5 h-5" />
              <span className="text-xs hidden lg:block">{t.header.signIn}</span>
            </button>

            <button
              onClick={onWishlistOpen}
              className="flex flex-col items-center gap-0.5 p-2 text-gray-600 hover:text-orange-500 transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              <span className="text-xs hidden lg:block">{t.header.wishlist}</span>
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onCartOpen}
              className="flex flex-col items-center gap-0.5 p-2 text-gray-600 hover:text-orange-500 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs hidden lg:block">{t.header.cart}</span>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="sm:hidden mt-2">
          <div className={`flex items-center border-2 rounded-lg overflow-hidden transition-colors ${searchFocused ? 'border-orange-500' : 'border-gray-200'}`}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder={t.header.searchPlaceholder}
              className="flex-1 px-3 py-2 text-sm outline-none text-gray-700 bg-gray-50"
            />
            <button className="bg-orange-500 text-white px-3 py-2">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
