'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Product } from '@/lib/supabase';

export interface CartItem {
  product: Product;
  quantity: number;
  locale: string;
}

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: Product[];
  compareItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  toggleCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInWishlist: (productId: string) => boolean;
  isInCompare: (productId: string) => boolean;
  cartCount: number;
  wishlistCount: number;
  compareCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  wishlistItems: [],
  compareItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  toggleWishlist: () => {},
  toggleCompare: () => {},
  removeFromCompare: () => {},
  clearCompare: () => {},
  isInWishlist: () => false,
  isInCompare: () => false,
  cartCount: 0,
  wishlistCount: 0,
  compareCount: 0,
  cartTotal: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('onsus_cart');
    const savedWishlist = localStorage.getItem('onsus_wishlist');
    const savedCompare = localStorage.getItem('onsus_compare');

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
    if (savedCompare) {
      try {
        setCompareItems(JSON.parse(savedCompare));
      } catch (e) {
        console.error('Failed to parse compare', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('onsus_cart', JSON.stringify(cartItems));
      localStorage.setItem('onsus_wishlist', JSON.stringify(wishlistItems));
      localStorage.setItem('onsus_compare', JSON.stringify(compareItems));
    }
  }, [cartItems, wishlistItems, compareItems, isHydrated]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1, locale: 'en' }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(i => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const toggleWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const toggleCompare = (product: Product) => {
    setCompareItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 4) return prev;
      return [...prev, product];
    });
  };

  const clearCompare = () => setCompareItems([]);

  const removeFromCompare = (productId: string) => {
    setCompareItems(prev => prev.filter(p => p.id !== productId));
  };

  const isInWishlist = (productId: string) => wishlistItems.some(p => p.id === productId);
  const isInCompare = (productId: string) => compareItems.some(p => p.id === productId);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const compareCount = compareItems.length;
  const cartTotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, wishlistItems, compareItems,
      addToCart, removeFromCart, updateQuantity,
      toggleWishlist, toggleCompare, removeFromCompare, clearCompare,
      isInWishlist, isInCompare,
      cartCount, wishlistCount, compareCount, cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
