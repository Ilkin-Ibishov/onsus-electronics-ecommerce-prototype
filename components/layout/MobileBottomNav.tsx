'use client';

import React from 'react';
import { Home, ShoppingBag, Search, Heart, User, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

export const MobileBottomNav = () => {
  const { cartCount, wishlistCount } = useCart();
  
  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: ShoppingBag, label: 'Shop', href: '/shop' },
    { icon: Search, label: 'Search', href: '#' },
    { icon: Heart, label: 'Wishlist', count: wishlistCount },
    { icon: ShoppingCart, label: 'Cart', count: cartCount },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[100]">
      <div className="bg-[#2C353F]/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 p-2 flex items-center justify-between">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all group"
            >
              <div className={`p-2 rounded-xl transition-colors ${idx === 0 ? 'bg-[#ff4d4d] text-white' : 'text-gray-400 group-hover:text-white'}`}>
                <Icon className="w-6 h-6" />
              </div>
              
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-[#ff4d4d] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#2C353F] shadow-lg">
                  {item.count}
                </span>
              )}
              
              <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${idx === 0 ? 'text-[#ff4d4d]' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
        
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group cursor-pointer hover:bg-[#ff4d4d] transition-all">
           <User className="w-6 h-6 text-gray-400 group-hover:text-white" />
        </div>
      </div>
    </div>
  );
};
