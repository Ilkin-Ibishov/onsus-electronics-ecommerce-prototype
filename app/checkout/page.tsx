'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Phone, 
  User, 
  Mail, 
  AlertCircle,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

const COD_LIMIT = 5000;

export default function CheckoutPage() {
  const { t, locale } = useLanguage();
  const { cartItems, cartTotal } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = 'Required';
    if (!formData.phone) newErrors.phone = 'Required';
    if (!formData.address) newErrors.address = 'Required';
    if (!formData.city) newErrors.city = 'Required';
    
    // Simple phone validation for +994
    if (formData.phone && !/^\+994/.test(formData.phone) && formData.phone.length < 10) {
      newErrors.phone = 'Invalid format (e.g. +994 50 123 45 67)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartTotal > COD_LIMIT) {
      return;
    }
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep(4);
    // In a real app, clear cart here
  };

  if (cartItems.length === 0 && step !== 4) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-gray-50 p-12 rounded-[3rem] text-center max-w-md w-full border border-gray-100 shadow-xl">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[#ff4d4d]" />
          </div>
          <h1 className="text-2xl font-black text-[#333E48] mb-4">{t.cart.empty}</h1>
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 bg-[#333E48] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.cart.continueShopping}
          </Link>
        </div>
      </div>
    );
  }

  const getName = (item: typeof cartItems[0]) => {
    if (locale === 'az') return item.product.name_az;
    if (locale === 'ru') return item.product.name_ru;
    return item.product.name_en;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Premium Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-center relative">
          <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#ff4d4d]' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 ${step >= 1 ? 'border-[#ff4d4d] bg-red-50' : 'border-gray-200'}`}>1</span>
              {t.checkout.shippingAddress}
            </div>
            <ChevronRight className="w-4 h-4" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#ff4d4d]' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 ${step >= 2 ? 'border-[#ff4d4d] bg-red-50' : 'border-gray-200'}`}>2</span>
              {t.checkout.paymentMethod}
            </div>
            <ChevronRight className="w-4 h-4" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#ff4d4d]' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 ${step >= 3 ? 'border-[#ff4d4d] bg-red-50' : 'border-gray-200'}`}>3</span>
              {t.checkout.orderSummary}
            </div>
          </div>
          <div className="absolute right-4 text-gray-400 hover:text-[#333E48] cursor-pointer hidden sm:block">
             <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 lg:mt-12">
        <AnimatePresence mode="wait">
          {step === 4 ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center py-12 px-6 bg-white rounded-[3rem] shadow-2xl border border-gray-100"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-green-500/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <h1 className="text-4xl font-black text-[#333E48] mb-4">{t.checkout.thankYou}</h1>
              <p className="text-lg text-gray-500 font-medium mb-2">{t.checkout.orderSuccess}</p>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-8 inline-block max-w-sm">
                <p className="text-red-700 text-sm font-bold leading-relaxed">
                   {t.checkout.confirmationCall}
                </p>
              </div>
              <div>
                <Link 
                  href="/" 
                  className="inline-flex items-center justify-center gap-3 bg-[#333E48] hover:bg-black text-white px-10 py-4 rounded-xl font-bold transition-all hover:shadow-xl active:scale-95"
                >
                  {t.checkout.backToHome}
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#ff4d4d]" />
                      </div>
                      <h2 className="text-xl font-black text-[#333E48]">{t.checkout.shippingAddress}</h2>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t.checkout.fullName}</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                              placeholder="John Doe"
                              className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${errors.fullName ? 'border-red-500' : 'border-gray-100'} rounded-xl focus:bg-white focus:border-[#ff4d4d] outline-none transition-all text-sm font-medium`}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t.checkout.phone}</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              type="text"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              placeholder="+994 -- --- -- --"
                              className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-100'} rounded-xl focus:bg-white focus:border-[#ff4d4d] outline-none transition-all text-sm font-medium`}
                            />
                            {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.phone}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t.checkout.email}</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="email@example.com"
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-[#ff4d4d] outline-none transition-all text-sm font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t.checkout.address}</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            placeholder="Street, Building, Apartment"
                            className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${errors.address ? 'border-red-500' : 'border-gray-100'} rounded-xl focus:bg-white focus:border-[#ff4d4d] outline-none transition-all text-sm font-medium`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t.checkout.city}</label>
                          <input 
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            placeholder="Baku"
                            className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.city ? 'border-red-500' : 'border-gray-100'} rounded-xl focus:bg-white focus:border-[#ff4d4d] outline-none transition-all text-sm font-medium`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t.checkout.postalCode}</label>
                          <input 
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                            placeholder="AZ1000"
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-[#ff4d4d] outline-none transition-all text-sm font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleNext}
                      className="w-full mt-10 bg-[#333E48] hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-gray-200 active:scale-[0.98]"
                    >
                      {locale === 'en' ? 'Continue to Payment' : locale === 'az' ? 'Ödənişə keç' : 'Перейти к оплате'}
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#ff4d4d]" />
                      </div>
                      <h2 className="text-xl font-black text-[#333E48]">{t.checkout.paymentMethod}</h2>
                    </div>

                    <div className="p-6 rounded-[2rem] border-2 border-[#ff4d4d] bg-red-50/50 relative overflow-hidden group">
                       <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-black text-[#333E48]">{t.checkout.payOnDelivery}</span>
                            <div className="w-6 h-6 rounded-full bg-[#ff4d4d] flex items-center justify-center shadow-lg shadow-[#ff4d4d]/30">
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[280px]">
                            {t.checkout.payOnDeliverySub}
                          </p>
                       </div>
                       <Truck className="absolute -right-6 -bottom-6 w-32 h-32 text-[#ff4d4d]/5 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <button 
                      onClick={() => setStep(3)}
                      className="w-full mt-10 bg-[#333E48] hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98]"
                    >
                      {locale === 'en' ? 'Review Order' : locale === 'az' ? 'Sifarişə bax' : 'Проверить заказ'}
                    </button>
                    <button 
                      onClick={() => setStep(1)}
                      className="w-full mt-3 text-sm text-gray-400 font-bold hover:text-gray-600 transition-colors"
                    >
                      {locale === 'en' ? 'Back to Shipping' : locale === 'az' ? 'Geri qayıt' : 'Назад'}
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-[#ff4d4d]" />
                       </div>
                       <h2 className="text-xl font-black text-[#333E48]">{t.checkout.orderSummary}</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-100 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.checkout.shippingAddress}</p>
                            <p className="text-sm font-bold text-[#333E48]">{formData.fullName}</p>
                            <p className="text-sm text-gray-500 font-medium">{formData.address}, {formData.city}</p>
                            <p className="text-sm text-gray-500 font-medium">{formData.phone}</p>
                          </div>
                          <button onClick={() => setStep(1)} className="text-[#ff4d4d] text-xs font-black uppercase hover:underline">Edit</button>
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.checkout.paymentMethod}</p>
                            <p className="text-sm font-bold text-[#333E48]">{t.checkout.payOnDelivery}</p>
                          </div>
                          <button onClick={() => setStep(2)} className="text-[#ff4d4d] text-xs font-black uppercase hover:underline">Edit</button>
                        </div>
                      </div>

                      <div className="space-y-3">
                         {cartItems.map(item => (
                            <div key={item.product.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                               <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 p-1">
                                  <img src={item.product.image_url} alt={getName(item)} className="w-full h-full object-cover rounded-lg" />
                               </div>
                               <div className="flex-1">
                                  <p className="text-sm font-bold text-[#333E48] line-clamp-1">{getName(item)}</p>
                                  <p className="text-xs text-gray-400 font-medium">{item.quantity} x ₼{item.product.price.toFixed(2)}</p>
                               </div>
                               <span className="text-sm font-black text-[#333E48]">₼{(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                         ))}
                      </div>

                      <div className="bg-[#333E48] p-8 rounded-[2rem] text-white">
                         <div className="flex items-center justify-between mb-4 opacity-70">
                            <span className="text-sm font-bold">{t.cart.subtotal}</span>
                            <span className="text-sm font-black">₼{cartTotal.toFixed(2)}</span>
                         </div>
                         <div className="flex items-center justify-between mb-8">
                            <span className="text-lg font-black">{locale === 'en' ? 'Total to Pay' : 'Cəmi ödəniləcək'}</span>
                            <span className="text-3xl font-black text-[#ff4d4d]">₼{cartTotal.toFixed(2)}</span>
                         </div>

                         {cartTotal > COD_LIMIT && (
                            <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl flex items-start gap-3 mb-6">
                               <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
                               <p className="text-xs font-bold text-red-100 leading-relaxed">
                                 {t.checkout.orderLimitError}
                               </p>
                            </div>
                         )}

                         <button 
                          disabled={isProcessing || cartTotal > COD_LIMIT}
                          onClick={handlePlaceOrder}
                          className="w-full bg-[#ff4d4d] hover:bg-[#e64444] disabled:bg-gray-600 disabled:opacity-50 text-white font-black py-5 rounded-[1.25rem] transition-all shadow-[0_20px_40px_-10px_rgba(255,77,77,0.4)] active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                         >
                          {isProcessing ? (
                            <>
                              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                              {t.checkout.processing}
                            </>
                          ) : (
                            <>
                              {t.checkout.placeOrder}
                              <ChevronRight className="w-6 h-6" />
                            </>
                          )}
                         </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar Info/Review */}
              <div className="lg:col-span-5 space-y-6">
                 {/* Trust Badges */}
                 <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-5">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                         <ShieldCheck className="w-6 h-6 text-green-500" />
                       </div>
                       <div>
                         <p className="text-sm font-black text-[#333E48]">100% SECURE</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Encrypted Checkout</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                         <Truck className="w-6 h-6 text-blue-500" />
                       </div>
                       <div>
                         <p className="text-sm font-black text-[#333E48]">FAST DELIVERY</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Door to door in 24h</p>
                       </div>
                    </div>
                 </div>

                 {/* Order Preview minified for step 1 & 2 */}
                 {step < 3 && (
                   <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                      <h3 className="text-base font-black text-[#333E48] mb-4">{t.checkout.orderSummary}</h3>
                      <div className="space-y-3">
                        {cartItems.slice(0, 3).map(item => (
                          <div key={item.product.id} className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 p-0.5">
                               <img src={item.product.image_url} alt={getName(item)} className="w-full h-full object-cover" />
                             </div>
                             <span className="text-xs font-bold text-gray-500 flex-1 truncate">{getName(item)}</span>
                             <span className="text-xs font-black text-[#333E48]">₼{(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        {cartItems.length > 3 && (
                          <p className="text-[10px] text-gray-400 font-bold text-center pt-2">+{cartItems.length - 3} more items</p>
                        )}
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                         <span className="text-sm font-bold text-gray-400">{t.cart.subtotal}</span>
                         <span className="text-lg font-black text-[#333E48]">₼{cartTotal.toFixed(2)}</span>
                      </div>
                   </div>
                 )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
