'use client';

import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Tag } from 'lucide-react';
import { DEFAULT_SHIPPING_RATES } from '@/lib/shipping';

export default function AnnouncementBar() {
  const [shippingRates, setShippingRates] = useState(DEFAULT_SHIPPING_RATES);

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

  return (
    <div className="bg-[#6A2B15] text-[#FFFFF0] text-[10px] sm:text-xs tracking-wider uppercase py-2 px-3 sm:px-4 border-b border-[#8C3B1F]/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-4 text-center">
        
        {/* Item 1 */}
        <div className="flex items-center justify-center gap-1.5 font-medium flex-1">
          <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] flex-shrink-0" />
          <span className="truncate">{shippingText}</span>
        </div>
        
        <span className="hidden sm:inline text-[#A34320]">|</span>

        {/* Item 2 */}
        <div className="flex items-center justify-center gap-1.5 font-medium flex-1">
          <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] flex-shrink-0" />
          <span className="truncate">COD Available</span>
        </div>

        <span className="hidden sm:inline text-[#A34320]">|</span>

        {/* Item 3 */}
        <div className="flex items-center justify-center gap-1.5 font-medium flex-1">
          <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] flex-shrink-0" />
          <span className="truncate">10% Off On First Order</span>
        </div>

      </div>
    </div>
  );
}
