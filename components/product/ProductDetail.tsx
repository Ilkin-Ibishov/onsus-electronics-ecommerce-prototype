'use client';

import React, { useState } from 'react';
import {
  Star,
  ShoppingCart,
  Heart,
  GitCompare,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

import { ProductCard } from '@/components/home/ProductCard';

export default function ProductDetail({
  product,
  relatedProducts = []
}: {
  product: Product;
  relatedProducts?: Product[];
}) {
  const { t, locale } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image_url);

  const images = [product.image_url, product.image_url, product.image_url]; // Mocking extra images

  const getName = () => {
    if (locale === 'az') return product.name_az;
    if (locale === 'ru') return product.name_ru;
    return product.name_en;
  };

  const getDescription = () => {
    if (locale === 'az') return product.description_az;
    if (locale === 'ru') return product.description_ru;
    return product.description_en;
  };

  const name = getName();
  const description = getDescription();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Image Gallery */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-square bg-gray-50 rounded-[3rem] p-12 flex items-center justify-center border border-gray-100 overflow-hidden group relative"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.4 }}
                src={activeImage}
                alt={name}
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
              />
            </AnimatePresence>

            {product.discount_percent > 0 && (
              <div className="absolute top-8 left-8 bg-[#ff4d4d] text-white text-xs font-black px-4 py-2 rounded-full shadow-2xl">
                SAVE {product.discount_percent}%
              </div>
            )}
          </motion.div>

          <div className="flex gap-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`w-24 h-24 rounded-2xl border-2 transition-all p-2 bg-white ${activeImage === img ? 'border-[#ff4d4d] shadow-lg shadow-[#ff4d4d]/10' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.review_count} Reviews</span>
            <div className="h-4 w-px bg-gray-100 mx-2" />
            <span className="text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
              <Check className="w-3 h-3" /> In Stock
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-[#2C353F] mb-6 tracking-tighter leading-tight">
            {name}
          </h1>

          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl font-black text-[#ff4d4d] tracking-tighter leading-none">₼{product.price.toFixed(2)}</span>
            {product.original_price && (
              <span className="text-2xl text-gray-300 line-through font-medium mb-1">₼{product.original_price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-lg">
            {description}
          </p>

          {/* Variants Placeholder */}
          <div className="mb-10 p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <h4 className="text-xs font-black text-[#2C353F] uppercase tracking-widest mb-4">Select Configuration</h4>
            <div className="flex flex-wrap gap-3">
              {['Standard Edition', 'Pro Performance', 'Enterprise Bundle'].map((opt, i) => (
                <button key={opt} className={`px-5 py-3 rounded-xl border-2 text-sm font-bold transition-all ${i === 0 ? 'border-[#ff4d4d] bg-white text-[#ff4d4d]' : 'border-white bg-transparent text-gray-400 hover:border-gray-200'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center bg-gray-100 rounded-2xl p-1 border border-gray-200">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-[#ff4d4d] transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-12 text-center font-black text-[#2C353F]">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-[#ff4d4d] transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <Button
              onClick={() => addToCart(product)}
              className="flex-1 bg-[#ff4d4d] hover:bg-[#e64444] text-white h-14 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[#ff4d4d]/30 group"
            >
              <ShoppingCart className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
              Add to Shopping Bag
            </Button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => toggleWishlist(product)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${isInWishlist(product.id) ? 'border-[#ff4d4d] text-[#ff4d4d] bg-[#ff4d4d]/5' : 'border-gray-100 text-gray-400 hover:border-[#ff4d4d] hover:text-[#ff4d4d]'}`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-[#ff4d4d]' : ''}`} />
              Wishlist
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-gray-100 text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-all font-bold text-xs uppercase tracking-widest group">
              <GitCompare className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              Compare
            </button>
            <button className="w-14 flex items-center justify-center rounded-2xl border-2 border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            <div className="flex flex-col items-center text-center">
              <Truck className="w-6 h-6 text-[#ff4d4d] mb-3" />
              <span className="text-[10px] font-black text-[#2C353F] uppercase tracking-widest">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <RotateCcw className="w-6 h-6 text-[#ff4d4d] mb-3" />
              <span className="text-[10px] font-black text-[#2C353F] uppercase tracking-widest">30 Day Returns</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-6 h-6 text-[#ff4d4d] mb-3" />
              <span className="text-[10px] font-black text-[#2C353F] uppercase tracking-widest">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Tabs */}
      <div className="mt-24">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="bg-transparent border-b border-gray-100 w-full justify-start h-auto p-0 gap-8">
            <TabsTrigger value="description" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#ff4d4d] data-[state=active]:text-[#ff4d4d] rounded-none px-0 py-4 font-black uppercase tracking-[0.2em] text-xs">Description</TabsTrigger>
            <TabsTrigger value="specs" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#ff4d4d] data-[state=active]:text-[#ff4d4d] rounded-none px-0 py-4 font-black uppercase tracking-[0.2em] text-xs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-[#ff4d4d] data-[state=active]:text-[#ff4d4d] rounded-none px-0 py-4 font-black uppercase tracking-[0.2em] text-xs">Customer Reviews</TabsTrigger>
          </TabsList>
          <div className="py-12">
            <TabsContent value="description" className="text-gray-500 leading-loose text-lg max-w-4xl mt-0">
              This product represents the absolute pinnacle of current technological advancement. Engineered with precision and crafted from high-grade materials, it offers an unparalleled user experience that combines raw power with elegant aesthetics.
              <br /><br />
              Whether you are a professional seeking high performance or an enthusiast demanding the best, this device delivers on every front. Its intuitive interface and seamless connectivity make it a joy to use in any environment.
            </TabsContent>
            <TabsContent value="specs" className="mt-0">
              <div className="grid sm:grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-3xl overflow-hidden">
                {[
                  ['Manufacturer', 'Ilk Electronics Institutional'],
                  ['Core Technology', 'SmartSense V4'],
                  ['Material', 'Recycled Aerospace Aluminum'],
                  ['Dimensions', '24.5 x 18.2 x 0.8 cm'],
                  ['Weight', '1.2 kg'],
                  ['Warranty', '2 Years Global']
                ].map(([key, val]) => (
                  <div key={key} className="bg-white p-6 flex justify-between items-center capitalize">
                    <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">{key}</span>
                    <span className="text-[#2C353F] font-black text-sm">{val}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-black text-[#ff4d4d] uppercase tracking-[0.3em] mb-3">Institutional Choice</p>
              <h2 className="text-4xl font-black text-[#2C353F] tracking-tighter">Related Products</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
