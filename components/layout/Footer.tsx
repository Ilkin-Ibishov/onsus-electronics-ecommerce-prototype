'use client';

import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, MessageCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

export function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const helpLinks = [
    t.footer.deliveryInfo, t.footer.terms, t.footer.returns, t.footer.privacy, t.footer.faqs
  ];
  const categoryLinks = [
    t.footer.laptops, t.footer.cameras, t.footer.phones, t.footer.gaming, t.footer.tv, t.footer.gadgets, t.footer.headphones
  ];
  const careLinks = [
    t.footer.myAccount, t.footer.trackOrder, t.footer.customerService, t.footer.returnsExchange, t.footer.productSupport
  ];

  const socials = [
    { icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: MessageCircle, label: 'WhatsApp', color: 'hover:bg-green-600' },
  ];

  return (
    <footer className="bg-[#1a1a2e] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4 pb-2 border-b border-gray-700">
              {t.footer.getHelp}
            </h4>
            <ul className="space-y-2.5">
              {helpLinks.map(link => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-orange-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 text-orange-500/50 group-hover:text-orange-400 transition-colors" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4 pb-2 border-b border-gray-700">
              {t.footer.popularCategories}
            </h4>
            <ul className="space-y-2.5">
              {categoryLinks.map(link => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-orange-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 text-orange-500/50 group-hover:text-orange-400 transition-colors" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4 pb-2 border-b border-gray-700">
              {t.footer.customerCare}
            </h4>
            <ul className="space-y-2.5">
              {careLinks.map(link => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-orange-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 text-orange-500/50 group-hover:text-orange-400 transition-colors" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4 pb-2 border-b border-gray-700">
              {t.footer.contactUs}
            </h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <a href={`tel:${t.footer.phone}`} className="text-sm hover:text-orange-400 transition-colors">{t.footer.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <a href={`mailto:${t.footer.email}`} className="text-sm hover:text-orange-400 transition-colors">{t.footer.email}</a>
              </li>
            </ul>

            <div>
              <h5 className="text-white font-semibold text-sm mb-1">{t.footer.newsletter}</h5>
              <p className="text-xs text-orange-400 mb-3">{t.footer.newsletterSub}</p>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t.footer.newsletterPlaceholder}
                  className="flex-1 bg-white/10 text-white placeholder-gray-500 text-sm px-3 py-2.5 rounded-l-lg outline-none border border-white/10 focus:border-orange-500 transition-colors"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2.5 rounded-r-lg transition-colors">
                  {t.footer.subscribe}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-[51px] h-[51px]">
              <Image
                src="/onsus-electronics-ecommerce-prototype/logo.svg"
                alt="Strike Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-500">{t.footer.copyright}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 mr-1">{t.footer.followUs}:</span>
            {socials.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                aria-label={label}
                className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all ${color}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {['VISA', 'PayPal', 'MC', 'Discover'].map(pay => (
              <div key={pay} className="bg-white rounded px-2 py-1">
                <span className="text-[#333E48] text-xs font-black">{pay}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
