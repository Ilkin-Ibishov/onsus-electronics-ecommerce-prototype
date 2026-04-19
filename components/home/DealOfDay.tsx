'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Eye, GitCompare, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { type Product } from '@/lib/supabase';

interface DealOfDayProps {
  product: Product | null;
  onQuickView: (product: Product) => void;
}

function useCountdown(targetHours = 23) {
  const [timeLeft, setTimeLeft] = useState({ hours: targetHours, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}

export function DealOfDay({ product, onQuickView }: DealOfDayProps) {
  const { t } = useLanguage();
  const { addToCart, toggleWishlist, toggleCompare, isInWishlist, isInCompare } = useCart();
  const timeLeft = useCountdown(11);

  if (!product) return null;

  const soldPercent = Math.round((product.stock_sold / (product.stock_sold + product.stock_available)) * 100);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-[#ff4d4d] rounded-full shadow-lg shadow-[#ff4d4d]/20" />
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-[#ff4d4d] fill-[#ff4d4d] animate-pulse" />
                <h2 className="text-3xl font-black text-[#2C353F] tracking-tight">{t.deal.title}</h2>
              </div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{t.deal.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest hidden sm:block mr-2">{t.deal.endsIn}</span>
            {[
              { val: pad(timeLeft.hours), label: t.deal.hours },
              { val: pad(timeLeft.minutes), label: t.deal.mins },
              { val: pad(timeLeft.seconds), label: t.deal.secs },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-[#ff4d4d] font-black text-2xl animate-pulse">:</span>}
                <div className="bg-[#2C353F] text-white rounded-xl px-3 py-2 text-center min-w-[64px] shadow-xl">
                  <div className="text-2xl font-black leading-none">{item.val}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-tighter">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden ring-1 ring-black/5">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative bg-gray-50/50 flex items-center justify-center p-12 min-h-[400px]">
              <div className="absolute top-6 left-6 bg-[#ff4d4d] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg shadow-[#ff4d4d]/30 uppercase tracking-wider">
                -{product.discount_percent}% SPECIAL OFFER
              </div>
              <Link href={`/products/${product.id}`} className="block">
                <img
                  src={product.image_url}
                  alt={product.name_en}
                  className="max-w-full max-h-80 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-700 ease-out"
                />
              </Link>
            </div>

            <div className="p-8 lg:p-12 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                  <span className="text-xs font-bold text-gray-400 ml-1 uppercase">{product.review_count} Customer Reviews</span>
                </div>

                <Link href={`/products/${product.id}`}>
                  <h3 className="text-2xl lg:text-3xl font-black text-[#2C353F] mb-6 leading-tight hover:text-[#ff4d4d] transition-colors cursor-pointer">
                    {product.name_en}
                  </h3>
                </Link>

                <div className="flex items-end gap-3 mb-8">
                  <span className="text-5xl font-black text-[#ff4d4d] leading-none tracking-tighter">₼{product.price.toFixed(2)}</span>
                  {product.original_price && (
                    <span className="text-gray-400 line-through text-xl font-medium mb-1">₼{product.original_price.toFixed(2)}</span>
                  )}
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-3">
                    <span className="text-gray-500">{t.deal.sold} <span className="text-[#2C353F] font-black">{product.stock_sold}</span></span>
                    <span className="text-gray-500">{t.deal.available} <span className="text-[#2C353F] font-black">{product.stock_available}</span></span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff4d4d] to-[#ff7b7b] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,77,77,0.3)]"
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 flex items-center justify-center gap-3 bg-[#ff4d4d] hover:bg-[#e64444] text-white font-black py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-[#ff4d4d]/30 active:scale-95 text-sm uppercase tracking-widest group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {t.deal.addToCart}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`w-14 flex items-center justify-center rounded-2xl border-2 transition-all ${isInWishlist(product.id)
                        ? 'border-[#ff4d4d] bg-[#ff4d4d]/5 text-[#ff4d4d]'
                        : 'border-gray-100 text-gray-400 hover:border-[#ff4d4d] hover:text-[#ff4d4d]'
                      }`}
                  >
                    <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-[#ff4d4d]' : ''}`} />
                  </button>
                  <button
                    onClick={() => onQuickView(product)}
                    className="w-14 flex items-center justify-center rounded-2xl border-2 border-gray-100 text-gray-400 hover:border-[#ff4d4d] hover:text-[#ff4d4d] transition-all"
                  >
                    <Eye className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
