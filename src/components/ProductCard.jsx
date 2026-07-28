'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({
  id,
  image,
  name,
  price,
  originalPrice,
  badge,
  isNew,
  isBestSeller,
  fabric,
  color,
  slug,
}) {
  const { addToCart, wishlistItems, toggleWishlist } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const isWishlisted = wishlistItems.includes(id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id,
      name,
      price,
      originalPrice,
      fabric,
      color,
      image,
      slug,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const displayBadge = badge || (isNew ? 'NEW' : isBestSeller ? 'BESTSELLER' : null);

  return (
    <div className="group flex flex-col border border-[#E5DACD] p-2 hover:border-[#C59B27]/50 transition-colors duration-300">
      {/* Saree Image Container — portrait */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFE6DD] mb-1.5">
        <Link href={`/shop`} className="block w-full h-full">
          <Image
            src={image || '/assets/about/hero_stack.jpg'}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Top Left Badge */}
        {displayBadge && (
          <div className="absolute top-2 left-2 bg-[#2A0E11] text-[#F7EFE8] text-[8px] sm:text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm shadow-xs z-10 pointer-events-none">
            {displayBadge}
          </div>
        )}

        {/* Top Right Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label="Add to Wishlist"
          className="absolute top-2 right-2 p-1 hover:bg-[#F7EFE8]/70 rounded-full text-[#3D1418] hover:text-[#8B2635] transition-all duration-200 z-10"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.75] transition-colors ${
              isWishlisted ? 'fill-[#8B2635] text-[#8B2635]' : 'text-white drop-shadow'
            }`}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="space-y-0 mb-1.5">
        {/* Title */}
        <Link href={`/shop`} className="block">
          <h3 className="font-serif-luxury text-[11px] sm:text-xs font-medium text-[#2A0E11] group-hover:text-[#8B2635] transition-colors leading-snug line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Price Row */}
        <div className="flex items-baseline gap-1">
          <span className="font-serif-luxury text-[11px] sm:text-xs font-bold text-[#2A0E11]">
            ₹{price?.toLocaleString('en-IN')}
          </span>
          {originalPrice && (
            <span className="text-[9px] sm:text-[10px] text-[#8A786D] line-through font-normal">
              ₹{originalPrice?.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

      {/* Add To Cart Button */}
      <button
        type="button"
        onClick={handleAddToCartClick}
        className={`w-full inline-flex items-center justify-center gap-1 border py-1 px-2 text-[8.5px] sm:text-[9.5px] font-bold tracking-widest uppercase transition-all duration-300 ${
          addedToCart
            ? 'bg-[#1E5631] text-white border-[#1E5631]'
            : 'bg-transparent hover:bg-[#2A0E11] border-[#C5B9AD] hover:border-[#2A0E11] text-[#3D1418] hover:text-[#F7EFE8]'
        }`}
      >
        {addedToCart ? (
          <>
            <span>ADDED TO CART</span>
            <Check className="w-3.5 h-3.5" />
          </>
        ) : (
          <>
            <span>ADD TO CART</span>
            <ShoppingCart className="w-3 h-3 stroke-[1.75]" />
          </>
        )}
      </button>
    </div>
  );
}
