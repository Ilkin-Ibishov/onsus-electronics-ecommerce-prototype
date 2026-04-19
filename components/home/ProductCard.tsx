'use client';

import { Star, ShoppingCart, Heart, Eye, GitCompare } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { type Product } from '@/lib/supabase';
import { type Locale } from '@/lib/translations';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

function getProductName(product: Product, locale: Locale): string {
  if (locale === 'az') return product.name_az;
  if (locale === 'ru') return product.name_ru;
  return product.name_en;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { t, locale } = useLanguage();
  const { addToCart, toggleWishlist, toggleCompare, isInWishlist, isInCompare } = useCart();

  const name = getProductName(product, locale as Locale);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative bg-gray-50/50 overflow-hidden group-hover:bg-white transition-colors duration-300">
        {/* Rounded-pill Badge */}
        {product.discount_percent > 0 && (
          <div className="absolute top-3 left-3 bg-[#ff4d4d] text-white text-[10px] font-black px-2.5 py-1 rounded-full z-10 shadow-lg shadow-[#ff4d4d]/20 uppercase tracking-wider">
            SALE {product.discount_percent}%
          </div>
        )}
        {product.is_top_rated && !product.discount_percent && (
          <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full z-10 shadow-lg shadow-indigo-600/20 uppercase tracking-wider">
            TOP RATED
          </div>
        )}

        {/* Action Buttons: Right-Middle Vertical Alignment */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all ${isInWishlist(product.id)
                ? 'bg-[#ff4d4d] text-white shadow-[#ff4d4d]/30'
                : 'bg-white/90 text-gray-600 hover:bg-[#ff4d4d] hover:text-white'
              }`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={() => onQuickView?.(product)}
            className="w-9 h-9 rounded-full bg-white/90 text-gray-600 flex items-center justify-center shadow-lg backdrop-blur-md hover:bg-[#ff4d4d] hover:text-white transition-all"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleCompare(product)}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all ${isInCompare(product.id)
                ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                : 'bg-white/90 text-gray-600 hover:bg-indigo-600 hover:text-white'
              }`}
          >
            <GitCompare className="w-4 h-4" />
          </button>
        </div>

        <Link href={`/products/${product.id}`} className="block aspect-square flex items-center justify-center p-6 overflow-hidden">
          <img
            src={product.image_url}
            alt={name}
            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </Link>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
            />
          ))}
          <span className="text-[10px] font-bold text-gray-400 ml-1 uppercase">{product.review_count} Reviews</span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-bold text-[#2C353F] mb-3 line-clamp-2 leading-relaxed hover:text-[#ff4d4d] transition-colors cursor-pointer min-h-[2.8rem]">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-[#ff4d4d]">₼{product.price.toFixed(2)}</span>
            {product.original_price && (
              <span className="text-sm text-gray-400 line-through font-medium">₼{product.original_price.toFixed(2)}</span>
            )}
          </div>
          
          <button
            onClick={() => addToCart(product)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-[#ff4d4d] text-[#2C353F] hover:text-white transition-all active:scale-95 group/btn"
          >
            <ShoppingCart className="w-5 h-5 group-hover/btn:animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
}
