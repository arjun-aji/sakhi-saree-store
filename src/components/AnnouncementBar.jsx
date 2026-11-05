'use client';

import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Tag } from 'lucide-react';
import { DEFAULT_SHIPPING_RATES } from '@/lib/shipping';

export default function AnnouncementBar() {
  const [shippingRates, setShippingRates] = useState(DEFAULT_SHIPPING_RATES);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.shippingRates) {
          setShippingRates(data.settings.shippingRates);
        }
      })
      .catch(() => {});
  }, []);

  const shippingText = shippingRates.enableFreeShipping && shippingRates.freeShippingThreshold > 0
    ? `Free Shipping Above ₹${shippingRates.freeShippingThreshold}`
    : `Pan-India Shipping at ₹${shippingRates.panIndiaStandard || 49}`;

  const items = [
    { icon: Truck, text: shippingText },
    { icon: ShieldCheck, text: 'COD Available' },
    { icon: Tag, text: '10% Off On First Order' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setMobileIndex(prev => (prev + 1) % items.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [items.length]);

  const CurrentMobileIcon = items[mobileIndex].icon;

  return (
    <div className="bg-[#6A2B15] text-[#FFFFF0] text-[10px] sm:text-xs tracking-wider uppercase py-2 px-3 sm:px-4 border-b border-[#8C3B1F]/50 w-full overflow-hidden">
      {/* Mobile Rotating View (< sm) */}
      <div className="flex sm:hidden items-center justify-center text-center w-full min-w-0 h-4">
        <div key={mobileIndex} className="flex items-center justify-center gap-1.5 font-medium min-w-0 max-w-full">
          <CurrentMobileIcon className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
          <span className="truncate text-[10px] font-medium tracking-wide">{items[mobileIndex].text}</span>
        </div>
      </div>

      {/* Desktop / Tablet Multi-Item View (>= sm) */}
      <div className="hidden sm:flex max-w-7xl mx-auto items-center justify-between gap-2 sm:gap-4 text-center w-full min-w-0">
        {/* Item 1 */}
        <div className="flex items-center justify-center gap-1.5 font-medium flex-1 min-w-0">
          <Truck className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
          <span className="truncate">{shippingText}</span>
        </div>
        
        <span className="text-[#A34320] flex-shrink-0">|</span>

        {/* Item 2 */}
        <div className="flex items-center justify-center gap-1.5 font-medium flex-1 min-w-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
          <span className="truncate">COD Available</span>
        </div>

        <span className="text-[#A34320] flex-shrink-0">|</span>

        {/* Item 3 */}
        <div className="flex items-center justify-center gap-1.5 font-medium flex-1 min-w-0">
          <Tag className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
          <span className="truncate">10% Off On First Order</span>
        </div>
      </div>
    </div>
  );
}
