'use client';

import { X, Star, ShoppingCart, Heart, Minus, Plus, GitCompare } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { type Product } from '@/lib/supabase';
import { type Locale } from '@/lib/translations';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { t, locale } = useLanguage();
  const { addToCart, toggleWishlist, toggleCompare, isInWishlist, isInCompare } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const getName = () => {
    if (locale === 'az') return product.name_az;
    if (locale === 'ru') return product.name_ru;
    return product.name_en;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col sm:flex-row overflow-y-auto">
          <div className="sm:w-1/2 bg-gray-50 flex items-center justify-center p-8 relative min-h-[250px]">
            {product.discount_percent > 0 && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-black px-3 py-1.5 rounded-full">
                -{product.discount_percent}%
              </div>
            )}
            <img
              src={product.image_url}
              alt={getName()}
              className="max-w-full max-h-72 object-contain"
            />
          </div>

          <div className="sm:w-1/2 p-6 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
                <span className="text-sm text-gray-500 ml-1">({product.review_count.toLocaleString()} reviews)</span>
              </div>
              <h2 className="text-xl font-black text-[#333E48] leading-tight mb-3">{getName()}</h2>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-black text-orange-500">${product.price.toFixed(2)}</span>
                {product.original_price && (
                  <span className="text-gray-400 line-through">${product.original_price.toFixed(2)}</span>
                )}
                {product.discount_percent > 0 && (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    Save ${(product.original_price! - product.price).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.stock_available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.stock_available > 0 ? t.quickView.inStock : t.quickView.outOfStock}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{t.quickView.sku}</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{product.id.slice(0, 8).toUpperCase()}</span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">{t.quickView.quantity}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-bold text-[#333E48] min-w-[48px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => { addToCart(product); onClose(); }}
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg active:scale-95"
              >
                <ShoppingCart className="w-5 h-5" />
                {t.quickView.addToCart}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                    isInWishlist(product.id) ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-orange-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-orange-500' : ''}`} />
                  {t.quickView.addToWishlist}
                </button>
                <button
                  onClick={() => toggleCompare(product)}
                  className={`flex items-center justify-center p-2.5 rounded-xl border-2 transition-all ${
                    isInCompare(product.id) ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'
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
  );
}
