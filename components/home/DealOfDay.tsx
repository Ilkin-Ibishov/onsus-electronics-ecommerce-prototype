'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Eye, GitCompare, Star, Zap } from 'lucide-react';
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-orange-500 rounded-full" />
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                <h2 className="text-2xl font-black text-[#333E48]">{t.deal.title}</h2>
              </div>
              <p className="text-sm text-gray-500">{t.deal.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium hidden sm:block">{t.deal.endsIn}</span>
            {[
              { val: pad(timeLeft.hours), label: t.deal.hours },
              { val: pad(timeLeft.minutes), label: t.deal.mins },
              { val: pad(timeLeft.seconds), label: t.deal.secs },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-orange-500 font-black text-xl">:</span>}
                <div className="bg-[#333E48] text-white rounded-lg px-2.5 py-1.5 text-center min-w-[52px]">
                  <div className="text-xl font-black leading-none">{item.val}</div>
                  <div className="text-xs text-gray-400 leading-none mt-0.5">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 min-h-[300px]">
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-black px-3 py-1.5 rounded-full">
                -{product.discount_percent}% OFF
              </div>
              <img
                src={product.image_url}
                alt={product.name_en}
                className="max-w-full max-h-64 object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({product.review_count.toLocaleString()})</span>
                </div>

                <h3 className="text-xl lg:text-2xl font-black text-[#333E48] mb-4 leading-tight">
                  {product.name_en}
                </h3>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-black text-orange-500">${product.price.toFixed(2)}</span>
                  {product.original_price && (
                    <span className="text-gray-400 line-through text-lg">${product.original_price.toFixed(2)}</span>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{t.deal.sold} <strong className="text-[#333E48]">{product.stock_sold}</strong></span>
                    <span>{t.deal.available} <strong className="text-[#333E48]">{product.stock_available}</strong></span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all"
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all hover:shadow-lg active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t.deal.addToCart}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${
                      isInWishlist(product.id)
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-orange-500' : ''}`} />
                    {t.products.wishlist}
                  </button>
                  <button
                    onClick={() => onQuickView(product)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-500 font-semibold text-sm transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    {t.products.quickView}
                  </button>
                  <button
                    onClick={() => toggleCompare(product)}
                    className={`flex items-center justify-center p-2.5 rounded-lg border-2 transition-all ${
                      isInCompare(product.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-500'
                    }`}
                  >
                    <GitCompare className="w-4 h-4" />
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
