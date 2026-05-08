'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const [deptOpen, setDeptOpen] = useState(false);

  return (
    <nav className="bg-[#333E48] text-white hidden lg:block">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-stretch">
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-[#ff4d4d] hover:bg-[#e64444] px-5 py-3.5 font-semibold text-sm transition-colors h-full"
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
                    <Link 
                      href={`/shop?category=${cat.key}`}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#ff4d4d]/5 hover:text-[#ff4d4d] transition-colors"
                    >
                      <span>{t.categories[cat.key as keyof typeof t.categories] || cat.key}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#ff4d4d]" />
                    </Link>
                    <div className="absolute left-full top-0 w-48 bg-white shadow-xl border border-gray-100 hidden group-hover:block z-50">
                      {cat.subcats.map(sub => (
                        <Link 
                          key={sub} 
                          href={`/shop?category=${cat.key}&subcategory=${sub.toLowerCase()}`}
                          className="block w-full text-left px-4 py-2.5 text-sm hover:bg-[#ff4d4d]/5 hover:text-[#ff4d4d] transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-100">
                  <Link 
                    href="/shop?filter=bestseller"
                    className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-[#ff4d4d] hover:bg-[#ff4d4d]/5 transition-colors"
                  >
                    {t.categories.bestseller}
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center flex-1">
            {navLinks.map(link => {
              const href = link === 'home' ? '/' : `/${link}`;
              const isActive = pathname === href || (link === 'home' && pathname === '/');
              
              return (
                <Link
                  key={link}
                  href={href}
                  className={`px-5 py-3.5 text-sm font-medium transition-colors hover:text-[#ff4d4d] flex items-center gap-1 ${
                    isActive ? 'text-[#ff4d4d]' : 'text-gray-200'
                  }`}
                >
                  {t.nav[link]}
                  {(link === 'shop' || link === 'product' || link === 'pages') && (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300 ml-auto pr-2">
            <span className="text-[#ff4d4d]">★</span>
            <span className="text-xs">Trusted by 2000+ brands</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function DepartmentsMenu({ categories, isStatic = false }: { categories: any[], isStatic?: boolean }) {
  const { t, locale } = useLanguage();
  const [open, setOpen] = useState(isStatic);

  const getLocalizedName = (cat: any) => {
    if (locale === 'az') return cat.name_az;
    if (locale === 'ru') return cat.name_ru;
    return cat.name_en;
  };

  return (
    <div className="relative w-full">
      <div 
        className={`bg-white text-gray-800 ${isStatic ? '' : 'shadow-xl border border-gray-100'}`}
        onMouseEnter={() => !isStatic && setOpen(true)}
        onMouseLeave={() => !isStatic && setOpen(false)}
      >
        <div className="bg-[#ff4d4d] text-white px-4 py-4 flex items-center justify-between font-bold text-sm uppercase tracking-wider">
          <div className="flex items-center gap-3">
             <div className="flex flex-col gap-1">
                <span className="w-4 h-0.5 bg-white block"></span>
                <span className="w-4 h-0.5 bg-white block"></span>
                <span className="w-4 h-0.5 bg-white block"></span>
              </div>
            {t.nav.allDepartments}
          </div>
          {!isStatic && <ChevronDown className="w-4 h-4" />}
        </div>
        
        {(open || isStatic) && (
          <div className="flex flex-col py-2">
            {categories?.length > 0 ? (
              categories.map((cat) => (
                <div key={cat.id || cat.slug} className="group relative">
                  <Link 
                    href={`/shop?category=${cat.slug}`}
                    className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium hover:bg-gray-50 hover:text-[#ff4d4d] transition-all border-b border-gray-50 last:border-0"
                  >
                    <span>{getLocalizedName(cat)}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#ff4d4d] transition-colors" />
                  </Link>
                  <div className="absolute left-full top-0 w-64 bg-white shadow-2xl border border-gray-100 hidden group-hover:block z-50 py-4 min-h-full">
                      <div className="px-6">
                        <h4 className="font-bold text-gray-900 mb-4">{getLocalizedName(cat)}</h4>
                        <ul className="space-y-3">
                          <li>
                            <Link href={`/shop?category=${cat.slug}&filter=new`} className="text-gray-600 hover:text-[#ff4d4d] cursor-pointer text-sm">New Arrivals</Link>
                          </li>
                          <li>
                            <Link href={`/shop?category=${cat.slug}&filter=bestseller`} className="text-gray-600 hover:text-[#ff4d4d] cursor-pointer text-sm">Best Sellers</Link>
                          </li>
                          <li>
                            <Link href={`/shop?category=${cat.slug}&filter=deals`} className="text-gray-600 hover:text-[#ff4d4d] cursor-pointer text-sm">Deals & Offers</Link>
                          </li>
                          <li>
                            <Link href={`/shop?category=${cat.slug}&filter=special`} className="text-gray-600 hover:text-[#ff4d4d] cursor-pointer text-sm">Special Edition</Link>
                          </li>
                        </ul>
                      </div>
                   </div>
                </div>
              ))
            ) : (
                [1,2,3,4,5,6,7,8].map(i => (
                   <div key={i} className="px-6 py-3 border-b border-gray-50 animate-pulse">
                      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                   </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
