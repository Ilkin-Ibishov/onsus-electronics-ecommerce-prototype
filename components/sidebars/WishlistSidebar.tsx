'use client';

import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistSidebar({ isOpen, onClose }: WishlistSidebarProps) {
  const { t, locale } = useLanguage();
  const { wishlistItems, toggleWishlist, addToCart } = useCart();

  const getName = (product: typeof wishlistItems[0]) => {
    if (locale === 'az') return product.name_az;
    if (locale === 'ru') return product.name_ru;
    return product.name_en;
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-[90]" onClick={onClose} />}
      <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white z-[100] flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#333E48]">
          <div className="flex items-center gap-2 text-white">
            <Heart className="w-5 h-5" />
            <h2 className="font-bold text-base">{t.wishlist.title}</h2>
            {wishlistItems.length > 0 && (
              <span className="bg-orange-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Heart className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">{t.wishlist.empty}</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {wishlistItems.map(product => (
                <div key={product.id} className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <img src={product.image_url} alt={getName(product)} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#333E48] line-clamp-2 leading-snug mb-2">{getName(product)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-orange-500">₼{product.price.toFixed(2)}</span>
                      <button
                        onClick={() => { addToCart(product); toggleWishlist(product); }}
                        className="flex items-center gap-1 text-xs font-semibold bg-[#333E48] hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg transition-all"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        {t.wishlist.addToCart}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
