'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const departmentCategories = [
  { key: 'apparel', subcats: ['New Arrival', 'Deals', 'Best Sellers', 'Men', 'Season Collection'] },
  { key: 'automotive', subcats: ['Car Parts', 'Tools', 'Accessories'] },
  { key: 'beauty', subcats: ['Skincare', 'Makeup', 'Hair Care', 'Fragrance'] },
  { key: 'electronics', subcats: ['Smartphones', 'Laptops', 'Cameras', 'Audio'] },
  { key: 'furniture', subcats: ['Living Room', 'Bedroom', 'Office', 'Outdoor'] },
  { key: 'home', subcats: ['Kitchen', 'Bathroom', 'Garden', 'Decor'] },
  { key: 'tools', subcats: ['Power Tools', 'Hand Tools', 'Safety', 'Storage'] },
  { key: 'jewelry', subcats: ['Watches', 'Rings', 'Necklaces', 'Earrings'] },
];

const navLinks = ['home', 'shop', 'product', 'blog', 'pages'] as const;

export function NavBar() {
  const { t } = useLanguage();
  const [deptOpen, setDeptOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  return (
    <nav className="bg-[#333E48] text-white hidden lg:block">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-stretch">
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-5 py-3.5 font-semibold text-sm transition-colors h-full"
              onMouseEnter={() => setDeptOpen(true)}
              onMouseLeave={() => setDeptOpen(false)}
            >
              <span className="flex flex-col gap-1">
                <span className="w-4 h-0.5 bg-white block"></span>
                <span className="w-4 h-0.5 bg-white block"></span>
                <span className="w-4 h-0.5 bg-white block"></span>
              </span>
              {t.nav.allDepartments}
              <ChevronDown className={`w-4 h-4 transition-transform ${deptOpen ? 'rotate-180' : ''}`} />
            </button>

            {deptOpen && (
              <div
                className="absolute top-full left-0 w-56 bg-white text-gray-800 shadow-xl z-50 border border-gray-100"
                onMouseEnter={() => setDeptOpen(true)}
                onMouseLeave={() => setDeptOpen(false)}
              >
                {departmentCategories.map((cat) => (
                  <div key={cat.key} className="group relative">
                    <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <span>{t.categories[cat.key as keyof typeof t.categories] || cat.key}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-500" />
                    </button>
                    <div className="absolute left-full top-0 w-48 bg-white shadow-xl border border-gray-100 hidden group-hover:block z-50">
                      {cat.subcats.map(sub => (
                        <button key={sub} className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors">
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-100">
                  <button className="w-full text-left px-4 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors">
                    {t.categories.bestseller}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center flex-1">
            {navLinks.map(link => (
              <button
                key={link}
                onClick={() => setActiveNav(link)}
                className={`px-5 py-3.5 text-sm font-medium transition-colors hover:text-orange-400 flex items-center gap-1 ${
                  activeNav === link ? 'text-orange-400' : 'text-gray-200'
                }`}
              >
                {t.nav[link]}
                {(link === 'shop' || link === 'product' || link === 'pages') && (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300 ml-auto pr-2">
            <span className="text-orange-400">★</span>
            <span className="text-xs">Trusted by 2000+ brands</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
