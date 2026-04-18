'use client';

import { Star, ShoppingCart, Heart, Eye, GitCompare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { type Product } from '@/lib/supabase';
import { type Locale } from '@/lib/translations';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
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
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="relative bg-gray-50 overflow-hidden">
        {product.discount_percent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-xs font-black px-2 py-1 rounded-md z-10">
            -{product.discount_percent}%
          </div>
        )}
        {product.is_top_rated && !product.discount_percent && (
          <div className="absolute top-2.5 left-2.5 bg-green-500 text-white text-xs font-black px-2 py-1 rounded-md z-10">
            TOP
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
              isInWishlist(product.id)
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-orange-500 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={() => onQuickView(product)}
            className="w-8 h-8 rounded-full bg-white text-gray-600 flex items-center justify-center shadow-md hover:bg-blue-500 hover:text-white transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleCompare(product)}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
              isInCompare(product.id)
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-blue-500 hover:text-white'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="aspect-square flex items-center justify-center p-4 overflow-hidden">
          <img
            src={product.image_url}
            alt={name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-0.5">({product.review_count})</span>
        </div>

        <h3 className="text-sm font-semibold text-[#333E48] mb-2 line-clamp-2 leading-snug hover:text-orange-500 transition-colors cursor-pointer">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-orange-500">${product.price.toFixed(2)}</span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through">${product.original_price.toFixed(2)}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-[#333E48] hover:bg-orange-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-all active:scale-95 opacity-0 group-hover:opacity-100"
        >
          <ShoppingCart className="w-4 h-4" />
          {t.products.addToCart}
        </button>
      </div>
    </div>
  );
}
