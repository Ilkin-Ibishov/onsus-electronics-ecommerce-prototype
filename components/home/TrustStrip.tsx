'use client';

import { Truck, Headphones, CreditCard, Shield, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function TrustStrip() {
  const { t } = useLanguage();

  const items = [
    { icon: Truck, title: t.trust.delivery, sub: t.trust.deliverySub, color: 'text-orange-500' },
    { icon: Headphones, title: t.trust.support, sub: t.trust.supportSub, color: 'text-blue-500' },
    { icon: CreditCard, title: t.trust.payment, sub: t.trust.paymentSub, color: 'text-green-500' },
    { icon: Shield, title: t.trust.reliable, sub: t.trust.reliableSub, color: 'text-purple-500' },
    { icon: RefreshCw, title: t.trust.guarantee, sub: t.trust.guaranteeSub, color: 'text-red-500' },
  ];

  return (
    <section className="bg-[#333E48] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-snug">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-snug">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
