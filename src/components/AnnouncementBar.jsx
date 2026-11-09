'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Tag, Gift, Sparkles, Megaphone } from 'lucide-react';
import { DEFAULT_SHIPPING_RATES } from '@/lib/shipping';

const ICON_MAP = {
  truck: Truck,
  shield: ShieldCheck,
  tag: Tag,
  gift: Gift,
  sparkles: Sparkles,
  megaphone: Megaphone
};

export default function AnnouncementBar() {
  const [shippingRates, setShippingRates] = useState(DEFAULT_SHIPPING_RATES);
  const [announcements, setAnnouncements] = useState({
    enabled: true,
    items: [
      { text: 'Pan-India Shipping at ₹49 | Free Shipping Above ₹999', icon: 'truck', link: '', active: true },
      { text: 'Cash on Delivery (COD) Available', icon: 'shield', link: '', active: true },
      { text: '10% Off On First Order | Use Code: SAKHI10', icon: 'tag', link: '/shop', active: true }
    ]
  });
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          if (data.settings.shippingRates) {
            setShippingRates(data.settings.shippingRates);
          }
          if (data.settings.announcements) {
            setAnnouncements(data.settings.announcements);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Filter only active announcements
  const activeItems = (announcements.items || []).filter(item => item.active && item.text);

  useEffect(() => {
    if (activeItems.length <= 1) return;
    const timer = setInterval(() => {
      setMobileIndex(prev => (prev + 1) % activeItems.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [activeItems.length]);

  if (!announcements.enabled || activeItems.length === 0) {
    return null;
  }

  const currentMobileItem = activeItems[mobileIndex % activeItems.length];
  const MobileIcon = ICON_MAP[currentMobileItem?.icon] || Tag;

  const renderItemContent = (item, IconComponent) => {
    const content = (
      <div className="flex items-center justify-center gap-1.5 font-medium min-w-0 max-w-full">
        <IconComponent className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
        <span className="truncate">{item.text}</span>
      </div>
    );

    if (item.link) {
      return (
        <Link href={item.link} className="hover:underline transition inline-flex items-center min-w-0">
          {content}
        </Link>
      );
    }
    return content;
  };

  return (
    <div className="bg-[#6A2B15] text-[#FFFFF0] text-[10px] sm:text-xs tracking-wider uppercase py-2 px-3 sm:px-4 border-b border-[#8C3B1F]/50 w-full overflow-hidden">
      {/* Mobile Rotating View (< sm) */}
      <div className="flex sm:hidden items-center justify-center text-center w-full min-w-0 h-4">
        {currentMobileItem && renderItemContent(currentMobileItem, MobileIcon)}
      </div>

      {/* Desktop / Tablet Multi-Item View (>= sm) */}
      <div className="hidden sm:flex max-w-7xl mx-auto items-center justify-between gap-2 sm:gap-4 text-center w-full min-w-0">
        {activeItems.map((item, idx) => {
          const Icon = ICON_MAP[item.icon] || Tag;
          return (
            <React.Fragment key={idx}>
              <div className="flex items-center justify-center flex-1 min-w-0">
                {renderItemContent(item, Icon)}
              </div>
              {idx < activeItems.length - 1 && (
                <span className="text-[#A34320] flex-shrink-0">|</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
