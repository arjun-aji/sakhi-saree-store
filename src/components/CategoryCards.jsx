'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  {
    name: 'Sarees',
    slug: 'sarees',
    subtitle: 'Heritage Weaves',
    image: '/assets/desktop/herodesk.jpeg',
    order: 1
  },
  {
    name: 'Churidars',
    slug: 'churidars',
    subtitle: 'Salwars & Sets',
    image: '/assets/desktop/herodesk.png',
    order: 2
  },
  {
    name: 'Women Dresses',
    slug: 'women-dresses',
    subtitle: 'Kurtis & Maxis',
    image: '/assets/about/story_tradition.jpg',
    order: 3
  }
];

export default function CategoryCards() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          // Strictly deduplicate by normalized name
          const unique = [];
          const seen = new Set();
          for (const item of data.categories) {
            const key = (item.name || '').trim().toLowerCase();
            if (key && !seen.has(key)) {
              seen.add(key);
              unique.push(item);
            }
          }
          setCategories(unique.length > 0 ? unique : DEFAULT_CATEGORIES);
        }
      } catch (err) {
        console.warn('Using default categories fallback:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  // Guarantee 0 duplicate cards across renders
  const uniqueCategories = useMemo(() => {
    const map = new Map();
    for (const cat of categories) {
      const key = (cat.name || '').trim().toLowerCase();
      if (key && !map.has(key)) {
        map.set(key, cat);
      }
    }
    return Array.from(map.values());
  }, [categories]);

  if (uniqueCategories.length === 0) return null;

  return (
    <div className="w-full">
      {/* Category Section Header */}
      <div className="flex items-center justify-between mb-1.5 sm:mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#FFFFF0] drop-shadow-md">
            Shop By Collection
          </span>
        </div>
        <Link 
          href="/shop" 
          className="text-[10px] sm:text-xs font-bold text-[#E3C397] hover:text-[#FFFFFF] flex items-center gap-1 transition-colors drop-shadow-md hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Categories Grid (Exactly 3 unique cards: Sarees, Churidars, Women Dresses) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5 w-full">
        {uniqueCategories.slice(0, 3).map((cat, idx) => (
          <Link
            key={cat._id || cat.slug || idx}
            href={`/shop?parentCategory=${encodeURIComponent(cat.name)}`}
            className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-[#3D1407]/90 shadow-xl hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300 flex flex-col justify-end h-24 sm:h-32 lg:h-36 xl:h-40 min-w-0"
          >
            {/* Card Background Image with Rich Scrim */}
            <div className="absolute inset-0 z-0 bg-[#3D1407]">
              <Image
                src={cat.image || '/assets/about/story_tradition.jpg'}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 30vw, 25vw"
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.currentTarget.src = '/assets/about/story_tradition.jpg';
                }}
              />
              {/* Luxury Gradient Scrim for crystal clear readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15 group-hover:from-black/95 transition-all duration-300" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-2.5 sm:p-3.5 lg:p-4 text-white flex flex-col justify-end">
              {cat.subtitle && (
                <span className="text-[8px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] line-clamp-1 mb-0.5 drop-shadow-xs">
                  {cat.subtitle}
                </span>
              )}
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-serif font-bold text-xs sm:text-base lg:text-xl text-white leading-tight drop-shadow-md group-hover:text-[#FFF3D1] transition-colors truncate">
                  {cat.name}
                </h3>
                <div className="hidden sm:flex items-center gap-1 text-[11px] lg:text-xs font-bold text-[#E3C397] group-hover:translate-x-1 transition-transform duration-300 shrink-0">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

