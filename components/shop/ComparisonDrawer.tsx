'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

export const ComparisonDrawer = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCart() || { compareItems: [] };

  if (!compareItems || compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-10 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-[#2C353F] rounded-[2rem] shadow-2xl border border-white/10 p-4 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 bg-[#ff4d4d] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff4d4d]/20 flex-shrink-0 animate-pulse">
              <GitCompare className="w-5 h-5 text-white" />
            </div>
            <div className="flex -space-x-3 overflow-hidden">
              {compareItems.map((item: any) => (
                <div 
                  key={item.id} 
                  className="relative group w-12 h-12 rounded-xl border-2 border-[#2C353F] bg-white overflow-hidden shadow-md"
                >
                  <img src={item.image_url} alt={item.name_en} className="w-full h-full object-contain p-1" />
                  <button 
                    onClick={() => removeFromCompare(item.id)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              {compareItems.length < 4 && (
                <div className="w-12 h-12 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center text-white/20 text-xs">
                  +
                </div>
              )}
            </div>
            <div className="hidden sm:block">
               <p className="text-white font-bold text-sm tracking-tight">{compareItems.length} Items</p>
               <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest">To Compare</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={clearCompare}
               className="text-gray-400 hover:text-white text-xs font-bold transition-colors px-2"
             >
               Clear
             </button>
             <Button className="bg-[#ff4d4d] hover:bg-[#e64444] text-white rounded-xl font-bold text-xs px-6 h-10 shadow-lg shadow-[#ff4d4d]/20 uppercase tracking-widest flex items-center gap-2">
               Compare Now
               <ArrowRight className="w-4 h-4 text-white/50" />
             </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
