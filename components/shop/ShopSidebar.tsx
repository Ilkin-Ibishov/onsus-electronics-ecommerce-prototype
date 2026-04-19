'use client';

import { ChevronRight, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { type Category } from '@/lib/supabase';

interface ShopSidebarProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (slug: string) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  selectedSizes: string[];
  setSelectedSizes: (sizes: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const prototypeBrands = ['Apple', 'Samsung', 'Sony', 'Panasonic', 'LG', 'Razer', 'Logitech', 'Bose'];
const prototypeColors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Gold', hex: '#FFD700' },
];
const prototypeSizes = ['Small', 'Medium', 'Large', 'Extra Large', '13"', '15"', '17"', 'Standard'];

export function ShopSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedBrands,
  setSelectedBrands,
  selectedColors,
  setSelectedColors,
  selectedSizes,
  setSelectedSizes,
  priceRange,
  setPriceRange
}: ShopSidebarProps) {
  const { t, locale } = useLanguage();

  const getLocalizedName = (cat: Category) => {
    if (locale === 'az') return cat.name_az;
    if (locale === 'ru') return cat.name_ru;
    return cat.name_en;
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Categories Section */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="bg-[#333E48] text-white px-6 py-4">
          <h3 className="text-sm font-black uppercase tracking-widest">Show all categories</h3>
        </div>
        <div className="py-2">
          <button 
            onClick={() => setSelectedCategory('')}
            className={`w-full flex items-center justify-between px-6 py-3 text-sm font-bold transition-all border-b border-gray-50 last:border-0 ${
              selectedCategory === '' ? 'text-[#ff4d4d]' : 'text-gray-600 hover:text-[#ff4d4d] hover:bg-gray-50'
            }`}
          >
            <span>All Categories</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === '' ? 'translate-x-1' : ''}`} />
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`w-full flex items-center justify-between px-6 py-3 text-sm font-bold transition-all border-b border-gray-50 last:border-0 ${
                selectedCategory === cat.slug ? 'text-[#ff4d4d]' : 'text-gray-600 hover:text-[#ff4d4d] hover:bg-gray-50'
              }`}
            >
              <span>{getLocalizedName(cat)}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === cat.slug ? 'translate-x-1' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Brand Section */}
      <div className="space-y-4 px-2">
        <h3 className="text-sm font-black text-[#333E48] uppercase tracking-widest border-b-2 border-[#ff4d4d] inline-block pb-1">Brand</h3>
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {prototypeBrands.map(brand => (
            <label key={brand} className="flex items-center gap-3 group cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 rounded border-gray-300 text-[#ff4d4d] focus:ring-[#ff4d4d] cursor-pointer" 
              />
              <span className={`text-sm font-medium transition-colors ${selectedBrands.includes(brand) ? 'text-[#ff4d4d]' : 'text-gray-600 group-hover:text-gray-900'}`}>
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Section */}
      <div className="space-y-4 px-2">
        <h3 className="text-sm font-black text-[#333E48] uppercase tracking-widest border-b-2 border-[#ff4d4d] inline-block pb-1">Color</h3>
        <div className="flex flex-wrap gap-3">
          {prototypeColors.map(color => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                selectedColors.includes(color.name) ? 'border-[#ff4d4d] scale-110 shadow-lg' : 'border-transparent hover:scale-110'
              }`}
              title={color.name}
            >
                <div 
                  className="w-full h-full rounded-full border border-gray-100" 
                  style={{ backgroundColor: color.hex }}
                />
            </button>
          ))}
        </div>
      </div>

      {/* Price Section */}
      <div className="space-y-4 px-2">
        <h3 className="text-sm font-black text-[#333E48] uppercase tracking-widest border-b-2 border-[#ff4d4d] inline-block pb-1">Price</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Min</span>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₼</span>
                   <input 
                    type="number" 
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-7 py-2 text-sm font-bold focus:ring-[#ff4d4d] focus:border-[#ff4d4d] transition-all"
                   />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Max</span>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₼</span>
                   <input 
                    type="number" 
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-7 py-2 text-sm font-bold focus:ring-[#ff4d4d] focus:border-[#ff4d4d] transition-all"
                   />
                </div>
              </div>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10000" 
            step="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#ff4d4d]"
          />
        </div>
      </div>

      {/* Size Section */}
      <div className="space-y-4 px-2 pb-8">
        <h3 className="text-sm font-black text-[#333E48] uppercase tracking-widest border-b-2 border-[#ff4d4d] inline-block pb-1">Size</h3>
        <div className="grid grid-cols-2 gap-2">
           {prototypeSizes.map(size => (
              <button
                key={size}
                onClick={() => {
                  if (selectedSizes.includes(size)) {
                    setSelectedSizes(selectedSizes.filter(s => s !== size));
                  } else {
                    setSelectedSizes([...selectedSizes, size]);
                  }
                }}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                  selectedSizes.includes(size)
                    ? 'bg-[#ff4d4d] border-[#ff4d4d] text-white shadow-lg shadow-[#ff4d4d]/20'
                    : 'bg-white border-gray-100 text-gray-600 hover:border-[#ff4d4d] hover:text-[#ff4d4d]'
                }`}
              >
                {size}
              </button>
           ))}
        </div>
      </div>
    </div>
  );
}
