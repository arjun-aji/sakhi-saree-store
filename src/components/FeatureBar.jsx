'use client';

import React, { useState, useEffect } from 'react';
import { Truck, PackageCheck, ShieldCheck, Headphones, Award, Sparkles, Star, Clock, Gift, CheckCircle2 } from 'lucide-react';

const ICON_MAP = {
  truck: Truck,
  package: PackageCheck,
  shield: ShieldCheck,
  headphones: Headphones,
  award: Award,
  sparkles: Sparkles,
  star: Star,
  clock: Clock,
  gift: Gift,
  check: CheckCircle2
};

const DEFAULT_FEATURE_TILES = [
  {
    icon: 'truck',
    title: 'Free Shipping',
    shortTitle: 'Free Shipping',
    description: 'On orders above ₹999 / Pan-India',
    active: true
  },
  {
    icon: 'package',
    title: 'Easy Returns',
    shortTitle: 'Easy Returns',
    description: 'Hassle free return policy',
    active: true
  },
  {
    icon: 'shield',
    title: 'Secure Payment',
    shortTitle: '100% Secure',
    description: '100% secure transactions',
    active: true
  },
  {
    icon: 'headphones',
    title: 'Customer Support',
    shortTitle: '24/7 Support',
    description: "We're here to help you",
    active: true
  }
];

export default function FeatureBar() {
  const [featureTiles, setFeatureTiles] = useState(DEFAULT_FEATURE_TILES);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.settings?.featureTiles) && data.settings.featureTiles.length > 0) {
          setFeatureTiles(data.settings.featureTiles);
        }
      })
      .catch(() => {});
  }, []);

  const activeFeatures = featureTiles.filter(f => f.active !== false);
  if (activeFeatures.length === 0) return null;

  // Dynamically compute grid columns (1 to 4 columns)
  const colCount = Math.min(activeFeatures.length, 4);

  return (
    <div className="w-full">
      {/* ========================================================= */}
      {/* MOBILE VIEW: Small Compact Boxes Side-by-Side             */}
      {/* ========================================================= */}
      <div 
        className="grid sm:hidden gap-1.5 w-full max-w-full"
        style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
      >
        {activeFeatures.map((item, index) => {
          const Icon = ICON_MAP[item.icon] || Truck;
          return (
            <div 
              key={index} 
              className="bg-[#8C3B1F] text-[#FFFFF0] rounded-lg p-1.5 flex flex-col items-center justify-center text-center border border-[#A34320]/80 shadow-md min-h-[60px] min-w-0"
            >
              <div className="w-5 h-5 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-[#6A2B15]/60 mb-0.5 flex-shrink-0">
                <Icon className="w-2.5 h-2.5 text-[#D4AF37] stroke-[1.75]" />
              </div>
              <span className="text-[8.5px] font-bold tracking-tight uppercase leading-tight text-white line-clamp-2">
                {item.shortTitle || item.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* DESKTOP & TABLET VIEW: Column Banner Container            */}
      {/* ========================================================= */}
      <div className="hidden sm:block w-full bg-[#8C3B1F] text-[#FFFFF0] rounded-xl lg:rounded-2xl py-3 px-4 lg:py-3.5 lg:px-6 shadow-xl border border-[#A34320]/60">
        <div 
          className="grid gap-3 lg:gap-4 divide-x divide-[#A34320]/60"
          style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
        >
          {activeFeatures.map((item, index) => {
            const Icon = ICON_MAP[item.icon] || Truck;
            return (
              <div 
                key={index} 
                className={`flex items-center gap-2.5 lg:gap-3 ${index !== 0 ? 'pl-3 lg:pl-5' : ''}`}
              >
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0 bg-[#6A2B15]/40">
                  <Icon className="w-4 h-4 text-[#D4AF37] stroke-[1.5]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-[11px] lg:text-xs font-bold tracking-wider uppercase text-white truncate">
                    {item.title}
                  </h3>
                  <p className="text-[10px] lg:text-[11px] text-[#FAF7EC]/80 font-normal mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
