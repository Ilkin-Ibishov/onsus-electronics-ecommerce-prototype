'use client';

import { LayoutGrid, List, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ShopFilterBarProps {
  totalResults: number;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'newest' | 'price-asc' | 'price-desc' | 'rating') => void;
}

export function ShopFilterBar({ 
  totalResults, 
  sortBy, 
  setSortBy 
}: ShopFilterBarProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const sortOptions = [
    { value: 'newest', label: 'Default Sorting' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
  ];

  return (
    <div className="bg-gray-50/50 backdrop-blur-md rounded-2xl border border-gray-100 p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Result Count and View Mode */}
      <div className="flex items-center gap-6">
        <p className="text-sm font-bold text-gray-500">
          Showing <span className="text-[#333E48]">{totalResults > 0 ? '1' : '0'}-{totalResults}</span> of <span className="text-[#333E48]">{totalResults}</span> results
        </p>
        <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
            <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-[#ff4d4d]' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-[#ff4d4d]' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <List className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Sorting and Page Size */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest hidden sm:inline">Sort by:</span>
            <div className="relative group">
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-sm font-bold text-[#333E48] focus:ring-2 focus:ring-[#ff4d4d] focus:border-transparent outline-none cursor-pointer pr-10 shadow-sm"
                >
                    {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-[#ff4d4d] transition-colors" />
            </div>
        </div>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
             <span className="text-xs font-black text-gray-400 uppercase tracking-widest hidden sm:inline">Show:</span>
             <div className="relative group">
                <select 
                    defaultValue="50"
                    className="appearance-none bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-sm font-bold text-[#333E48] focus:ring-2 focus:ring-[#ff4d4d] focus:border-transparent outline-none cursor-pointer pr-10 shadow-sm"
                >
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-[#ff4d4d] transition-colors" />
            </div>
        </div>
      </div>
    </div>
  );
}
