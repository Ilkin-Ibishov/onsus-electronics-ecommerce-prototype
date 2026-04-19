'use client';

import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const NewsletterStrip = () => {
  return (
    <section className="bg-[#2C353F] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Text and Icon */}
          <div className="flex items-center gap-6">
            <div className="bg-[#ff4d4d]/10 p-4 rounded-full">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                10% Off Your First Order
              </h3>
              <p className="text-gray-400 text-sm">
                Be the first to know about offers, new products and discounted products
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-auto max-w-md">
            <form className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-transparent border-none text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 flex-1"
                required
              />
              <Button
                type="submit"
                className="bg-[#ff4d4d] hover:bg-[#e64444] text-white px-8 rounded-xl h-12 font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#ff4d4d]/20"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
