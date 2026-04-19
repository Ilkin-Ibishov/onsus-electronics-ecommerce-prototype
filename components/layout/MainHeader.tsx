'use client';

import { Search, Headphones, User, ShoppingCart, Heart, GitCompare, X, Menu } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Mobile Menu Trigger */}
          <button
            onClick={onMobileMenuOpen}
            className="lg:hidden p-2 text-gray-700 hover:text-[#ff4d4d] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="relative w-[72px] h-[72px] transition-transform group-hover:rotate-12 group-hover:scale-110">
              <Image
                src="/onsus-electronics-ecommerce-prototype/logo.svg"
                alt="Strike Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Search Bar - Institutional Styling */}
          <div className="flex-1 max-w-2xl relative hidden sm:block">
            <div className={`flex items-center border-2 rounded-2xl overflow-hidden transition-all duration-300 ${searchFocused ? 'border-[#ff4d4d] shadow-lg shadow-[#ff4d4d]/5 bg-white' : 'border-gray-100 bg-gray-50'}`}>
              <div className="pl-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder={t.header.searchPlaceholder}
                className="flex-1 px-3 py-3 text-sm outline-none text-gray-700 bg-transparent font-medium"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-gray-400 hover:text-gray-600 mr-2"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
              <button className="bg-[#1A2229] hover:bg-[#ff4d4d] text-white px-6 py-3 transition-colors font-bold text-sm tracking-wider">
                SEARCH
              </button>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {searchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl mt-2 p-5 z-50 border-t-4 border-t-[#ff4d4d]"
                >
                  <p className="text-[10px] text-gray-400 mb-3 font-black uppercase tracking-widest">Trending Now</p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map(term => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="text-xs font-bold bg-gray-50 hover:bg-[#ff4d4d]/5 hover:text-[#ff4d4d] text-[#1A2229] px-4 py-2 rounded-xl transition-all border border-gray-100"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Support Section */}
          <div className="hidden xl:flex items-center gap-4 flex-shrink-0 border-l border-gray-100 pl-8">
            <div className="w-12 h-12 rounded-2xl bg-[#1A2229] flex items-center justify-center shadow-lg shadow-gray-200">
              <Headphones className="w-6 h-6 text-[#ff4d4d]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">{t.header.support}</span>
              <span className="text-sm font-extrabold text-[#1A2229] tracking-tight whitespace-nowrap">+994 10 236 41 91</span>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-auto sm:ml-0">
            <motion.button
              whileHover={{ y: -2 }}
              onClick={onAuthOpen}
              className="flex flex-col items-center p-2 text-gray-700 hover:text-[#ff4d4d] transition-colors group relative"
            >
              <div className="w-11 h-11 rounded-xl bg-gray-50 group-hover:bg-[#ff4d4d]/5 flex items-center justify-center transition-colors">
                <User className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest mt-2 hidden lg:block opacity-60 group-hover:opacity-100">{t.header.signIn}</span>
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              onClick={onWishlistOpen}
              className="flex flex-col items-center p-2 text-gray-700 hover:text-[#ff4d4d] transition-colors group relative"
            >
              <div className="w-11 h-11 rounded-xl bg-gray-50 group-hover:bg-[#ff4d4d]/5 flex items-center justify-center transition-colors">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-[#ff4d4d] text-white text-[10px] rounded-lg flex items-center justify-center font-black border-2 border-white shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest mt-2 hidden lg:block opacity-60 group-hover:opacity-100">{t.header.wishlist}</span>
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              onClick={onCartOpen}
              className="flex flex-col items-center p-2 text-gray-700 hover:text-[#ff4d4d] transition-colors group relative"
            >
              <div className="w-11 h-11 rounded-xl bg-[#1A2229] group-hover:bg-[#ff4d4d] flex items-center justify-center transition-colors shadow-lg shadow-gray-200">
                <ShoppingCart className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-[#ff4d4d] text-white text-[10px] rounded-xl flex items-center justify-center font-bold border-4 border-white shadow-xl"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest mt-2 hidden lg:block opacity-60 group-hover:opacity-100">{t.header.cart}</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="sm:hidden mt-3">
          <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-colors ${searchFocused ? 'border-[#ff4d4d]' : 'border-gray-100 bg-gray-50'}`}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder={t.header.searchPlaceholder}
              className="flex-1 px-3 py-2.5 text-sm outline-none text-gray-700 bg-transparent font-medium"
            />
            <button className="bg-[#ff4d4d] text-white px-4 py-2.5">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
