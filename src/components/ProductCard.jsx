'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function ProductCard({
  image,
  name,
  price,
  originalPrice,
  badge,
  isNew,
  isBestSeller,
  wishlist = false,
  slug,
}) {
  const [isWishlisted, setIsWishlisted] = useState(wishlist);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const displayBadge = badge || (isNew ? 'NEW' : isBestSeller ? 'BESTSELLER' : null);

  return (
    <Link href="/shop" className="block group h-full">
      <div className="bg-[#F3EADF]/90 hover:bg-[#F3EADF] rounded-xl p-2 sm:p-2.5 border border-[#E5DACD] transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between h-full">
        <div>
          {/* Saree Image Container */}
          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#EFE6DD] mb-2">
            <Image
              src={image || '/assets/about/hero_stack.jpg'}
              alt={name}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />

            {/* Top Left Pill Badge */}
            {displayBadge && (
              <div className="absolute top-2 left-2 bg-[#2A0E11] text-[#F7EFE8] text-[8px] sm:text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full shadow-xs z-10">
                {displayBadge}
              </div>
            )}
          </div>

          {/* Product Title & Wishlist Heart Row */}
          <div className="flex items-center justify-between gap-1 mt-1">
            <h3 className="font-serif-luxury text-xs sm:text-sm font-medium text-[#2A0E11] tracking-wide line-clamp-1 group-hover:text-[#8B2635] transition-colors leading-tight">
              {name}
            </h3>

            <button
              type="button"
              onClick={toggleWishlist}
              aria-label="Add to Wishlist"
              className="p-0.5 text-[#3D1418] hover:text-[#8B2635] hover:scale-110 transition-all duration-200 flex-shrink-0"
            >
              <Heart
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.5] transition-colors ${
                  isWishlisted ? 'fill-[#8B2635] text-[#8B2635]' : 'text-[#3D1418]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Price Row */}
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-serif-luxury text-xs sm:text-sm font-bold text-[#2A0E11]">
            ₹{price?.toLocaleString('en-IN')}
          </span>
          {originalPrice && (
            <span className="text-[10px] sm:text-xs text-[#8A786D] line-through font-normal">
              ₹{originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
