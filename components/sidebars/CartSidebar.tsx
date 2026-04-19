'use client';

import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { type Locale } from '@/lib/translations';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { t, locale } = useLanguage();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const getName = (item: typeof cartItems[0]) => {
    if (locale === 'az') return item.product.name_az;
    if (locale === 'ru') return item.product.name_ru;
    return item.product.name_en;
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-[90]" onClick={onClose} />}
      <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white z-[100] flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#333E48]">
          <div className="flex items-center gap-2 text-white">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="font-bold text-base">{t.cart.title}</h2>
            {cartItems.length > 0 && (
              <span className="bg-[#ff4d4d] text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <ShoppingCart className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">{t.cart.empty}</p>
              <button
                onClick={onClose}
                className="mt-4 text-[#ff4d4d] hover:text-[#e64444] font-semibold text-sm transition-colors"
              >
                {t.cart.continueShopping}
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {cartItems.map(item => (
                <div key={item.product.id} className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <img src={item.product.image_url} alt={getName(item)} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#333E48] line-clamp-2 leading-snug mb-2">{getName(item)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold px-1 min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-black text-[#ff4d4d]">
                        ₼{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">{t.cart.subtotal}</span>
              <span className="text-xl font-black text-[#333E48]">₼{cartTotal.toFixed(2)}</span>
            </div>
            <Link 
              href="/checkout" 
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 bg-[#ff4d4d] hover:bg-[#e64444] text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg active:scale-95"
            >
              {t.cart.checkout}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={onClose} className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors py-1">
              {t.cart.continueShopping}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
