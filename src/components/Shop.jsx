'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, RotateCcw, X, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import ShopFilters from './ShopFilters';
import ShopSidebarFilters from './ShopSidebarFilters';
import { products } from '../data/products';

/* ── Lotus / Flower Icon ── */
function FlowerIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C11.5 5 9 7 9 10C9 12.5 10.5 14 12 15C13.5 14 15 12.5 15 10C15 7 12.5 5 12 2Z" opacity="0.9" />
      <path d="M12 15C9.5 14 7 12 4.5 13C3.5 13.5 3 15 4 16.5C6 18 8.5 18 12 15Z" opacity="0.7" />
      <path d="M12 15C14.5 14 17 12 19.5 13C20.5 13.5 21 15 20 16.5C18 18 15.5 18 12 15Z" opacity="0.7" />
      <path d="M12 15C10 17.5 9 20 10.5 21.5C11 22 12.5 21.5 12 19.5C11.5 21.5 13 22 13.5 21.5C15 20 14 17.5 12 15Z" opacity="0.8" />
    </svg>
  );
}

/* ── Gold Line Divider with Diamond Dot ── */
function GoldDivider({ className = 'my-4' }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-[0.75px] w-16 sm:w-20 bg-[#C59B27]/40" />
      <span className="text-[#C59B27] text-[10px]">✦</span>
      <span className="h-[0.75px] w-16 sm:w-20 bg-[#C59B27]/40" />
    </div>
  );
}

/* ── Derive unique filter options ── */
const CATEGORIES = [...new Set(products.map((p) => p.category))].sort();
const FABRICS = [...new Set(products.map((p) => p.fabric))].sort();
const COLORS = [...new Set(products.map((p) => p.color))].sort();

const PAGE_SIZE = 12;

export default function Shop() {
  const searchParams = useSearchParams();

  /* ── Filter States ── */
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState(8999);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  /* ── Read ?filter=new from URL ── */
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'new') {
      setSelectedSort('new');
    } else {
      setSelectedSort('featured');
    }
  }, [searchParams]);

  /* ── Filtering + Sorting Logic ── */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || p.category === selectedCategory);
    }

    if (selectedFabric !== 'All') {
      result = result.filter((p) => p.fabric.toLowerCase().includes(selectedFabric.toLowerCase()) || p.fabric === selectedFabric);
    }

    if (selectedColor !== 'All') {
      result = result.filter((p) => p.color.toLowerCase() === selectedColor.toLowerCase());
    }

    if (selectedPrice < 8999) {
      result = result.filter((p) => p.price <= selectedPrice);
    }

    if (selectedSort === 'new') {
      result = result.filter((p) => p.isNew);
      if (result.length === 0) {
        result = [...products].filter((p) => 
          (selectedCategory === 'All' || p.category === selectedCategory) &&
          (selectedFabric === 'All' || p.fabric === selectedFabric) &&
          (selectedColor === 'All' || p.color === selectedColor)
        );
      }
    }

    switch (selectedSort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'bestselling':
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'popularity':
        result.sort((a, b) => (b.isBestSeller || b.isNew ? 1 : 0) - (a.isBestSeller || a.isNew ? 1 : 0));
        break;
      case 'new':
      default:
        break;
    }

    return result;
  }, [selectedCategory, selectedFabric, selectedColor, selectedPrice, selectedSort]);

  /* ── Reset visible count when filters change ── */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, selectedFabric, selectedColor, selectedPrice, selectedSort]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const activeFilterCount = [
    selectedCategory !== 'All',
    selectedFabric !== 'All',
    selectedColor !== 'All',
    selectedPrice < 8999,
  ].filter(Boolean).length;

  const handleReset = () => {
    setSelectedCategory('All');
    setSelectedFabric('All');
    setSelectedColor('All');
    setSelectedPrice(8999);
    setSelectedSort('featured');
  };

  return (
    <div className="w-full bg-[#F7EFE8]">

      {/* ================================================================ */}
      {/* 1. SHOP HERO SECTION (Centered layout matching reference)        */}
      {/* ================================================================ */}
      <section className="w-full bg-[#F7EFE8] pt-6 sm:pt-10 pb-4 px-3 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-1">
          {/* Subtitle */}
          <div className="inline-flex items-center justify-center gap-1.5 text-[#8B5A3C] uppercase tracking-[0.25em] text-[10px] sm:text-[11px] font-bold">
            <span>SHOP</span>
            <FlowerIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C59B27]" />
          </div>

          {/* Heading */}
          <h1 className="font-serif-luxury text-2xl sm:text-4xl lg:text-[50px] font-normal text-[#2A0E11] leading-tight tracking-tight">
            Our Saree Collection
          </h1>

          {/* Tagline */}
          <p className="font-serif-luxury text-[11px] sm:text-base text-[#5A4438] italic font-normal">
            Handpicked sarees that celebrate tradition, elegance and you.
          </p>

          {/* Gold Divider */}
          <GoldDivider className="mt-2" />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. MAIN LAYOUT (Permanent Left Sidebar on Desktop lg+)           */}
      {/* ================================================================ */}
      <section className="w-full pb-8 sm:pb-12 px-2.5 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-6">

          {/* DESKTOP PERMANENT SIDEBAR (Hidden on mobile/tablet) */}
          <div className="hidden lg:block w-[250px] flex-shrink-0">
            <div className="sticky top-24">
              <ShopSidebarFilters
                selectedCategory={selectedCategory}
                selectedFabric={selectedFabric}
                selectedColor={selectedColor}
                selectedPrice={selectedPrice}
                onCategoryChange={setSelectedCategory}
                onFabricChange={setSelectedFabric}
                onColorChange={setSelectedColor}
                onPriceChange={setSelectedPrice}
                onApplyFilters={() => {}}
              />
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 min-w-0">

            {/* Top Filter Bar */}
            <ShopFilters
              categories={CATEGORIES}
              fabrics={FABRICS}
              colors={COLORS}
              selectedCategory={selectedCategory}
              selectedFabric={selectedFabric}
              selectedColor={selectedColor}
              selectedSort={selectedSort}
              onCategoryChange={setSelectedCategory}
              onFabricChange={setSelectedFabric}
              onColorChange={setSelectedColor}
              onSortChange={setSelectedSort}
              onResetFilters={handleReset}
              onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
              activeFilterCount={activeFilterCount}
            />

            {/* PRODUCT GRID: 6 columns desktop, 4 columns tablet, 3 columns mobile */}
            {visibleProducts.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 sm:gap-3 lg:gap-3.5">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12 bg-[#F3EADF]/60 rounded-xl border border-[#E5DACD]">
                <p className="font-serif-luxury text-lg text-[#2A0E11] mb-1.5">No Sarees Found</p>
                <p className="text-xs text-[#8B5A3C] mb-3">Try clearing active filters to see all sarees.</p>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 bg-[#3D1418] text-[#F7EFE8] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-md shadow-xs hover:bg-[#5B1D23] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear Filters
                </button>
              </div>
            )}

            {/* LOAD MORE BUTTON */}
            {hasMore && (
              <div className="text-center mt-6 sm:mt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#F7EFE8] border border-[#DCD0C5] hover:border-[#8B2635] text-[#3D1418] text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase px-6 sm:px-8 py-2 sm:py-2.5 rounded-md transition-all shadow-2xs group"
                >
                  <span>LOAD MORE</span>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3D1418] group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. PROMOTIONAL BANNER SECTION (Sleek Horizontal Layout)           */}
      {/* ================================================================ */}
      <section className="w-full pb-6 sm:pb-10 px-2.5 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            
            {/* Horizontal Promo Banner */}
            <div className="w-full lg:col-span-7 bg-[#F3EADF] border border-[#E5DACD] rounded-xl p-3.5 sm:p-6 flex flex-row items-center justify-between gap-3 relative overflow-hidden shadow-2xs">
              
              {/* Background watermark */}
              <div className="absolute bottom-0 left-0 text-[#C59B27]/15 pointer-events-none p-1">
                <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75">
                  <path d="M20 80 Q 40 50, 70 30" />
                  <circle cx="70" cy="30" r="3" />
                </svg>
              </div>

              {/* Left Text */}
              <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1 relative z-10">
                <h2 className="font-serif-luxury text-sm sm:text-2xl lg:text-3xl text-[#2A0E11] font-normal leading-tight tracking-tight">
                  Timeless Elegance, Delivered to You
                </h2>
                <p className="text-[10px] sm:text-xs text-[#5A4438] font-medium">
                  Free shipping on orders above ₹1499
                </p>
                <p className="text-[9px] sm:text-[11px] text-[#4A3B32] pt-0.5 font-normal">
                  Secure Packaging &nbsp;•&nbsp; Easy Returns &nbsp;•&nbsp; 100% Quality Assured
                </p>
              </div>

              {/* Right Sakhi Box Graphic */}
              <div className="flex-shrink-0 relative z-10 pl-2">
                <div className="w-28 sm:w-44 lg:w-52 h-16 sm:h-24 bg-[#F9F5F0] rounded-lg border border-[#E2D4C5] p-2 flex flex-col items-center justify-center text-center shadow-sm hover:scale-102 transition-transform">
                  <div className="relative w-16 sm:w-24 h-5 sm:h-7 mb-0.5">
                    <Image
                      src="/assets/logo.png"
                      alt="Sakhi Box Packaging"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[6.5px] sm:text-[8px] text-[#8B5A3C] uppercase tracking-widest font-semibold">
                    Handcrafted Saree Box
                  </span>
                </div>
              </div>

            </div>

            {/* 4 Feature Columns on Right (Desktop Only lg:grid) */}
            <div className="hidden lg:grid lg:col-span-5 grid-cols-4 gap-2 text-center bg-[#F3EADF] border border-[#E5DACD] rounded-xl p-4 items-center">
              <div className="p-2 space-y-1">
                <FlowerIcon className="w-5 h-5 mx-auto text-[#8B2635]" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2A0E11]">
                  AUTHENTIC & HANDPICKED
                </h4>
                <p className="text-[9px] text-[#5A4438] leading-tight">
                  Carefully selected weavers for authenticity and quality.
                </p>
              </div>

              <div className="p-2 space-y-1">
                <Sparkles className="w-5 h-5 mx-auto text-[#8B2635]" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2A0E11]">
                  CRAFTSMANSHIP FIRST
                </h4>
                <p className="text-[9px] text-[#5A4438] leading-tight">
                  We support skilled weavers and preserve traditional art.
                </p>
              </div>

              <div className="p-2 space-y-1">
                <ShieldCheck className="w-5 h-5 mx-auto text-[#8B2635]" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2A0E11]">
                  QUALITY YOU CAN TRUST
                </h4>
                <p className="text-[9px] text-[#5A4438] leading-tight">
                  Every detail meets our promise of premium quality.
                </p>
              </div>

              <div className="p-2 space-y-1">
                <Heart className="w-5 h-5 mx-auto text-[#8B2635]" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2A0E11]">
                  MADE WITH LOVE
                </h4>
                <p className="text-[9px] text-[#5A4438] leading-tight">
                  More than just sarees, we deliver emotion and elegance.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. DARK FEATURE STRIP AT BOTTOM (Mobile & Tablet View)            */}
      {/* ================================================================ */}
      <section className="w-full bg-[#2A0E11] text-[#F7EFE8] border-t border-[#3D1418] py-3.5 px-3 block lg:hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-1 text-center divide-x divide-[#3D1418]/80 items-center">
            
            <div className="flex flex-col items-center justify-center p-1">
              <FlowerIcon className="w-4 h-4 text-[#C59B27] mb-1" />
              <span className="text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#F7EFE8] leading-tight">
                AUTHENTIC & HANDPICKED
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-1">
              <Sparkles className="w-4 h-4 text-[#C59B27] mb-1" />
              <span className="text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#F7EFE8] leading-tight">
                CRAFTSMANSHIP FIRST
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-1">
              <ShieldCheck className="w-4 h-4 text-[#C59B27] mb-1" />
              <span className="text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#F7EFE8] leading-tight">
                QUALITY YOU CAN TRUST
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-1">
              <Heart className="w-4 h-4 text-[#C59B27] mb-1" />
              <span className="text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#F7EFE8] leading-tight">
                MADE WITH LOVE
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* MOBILE / TABLET SLIDE-OUT FILTER DRAWER                         */}
      {/* ================================================================ */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-out Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-[#F7EFE8] h-full shadow-2xl overflow-y-auto p-4 z-10 flex flex-col justify-between animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DACD] mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#3D1418]">FILTERS</span>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 text-[#3D1418] hover:bg-[#3D1418]/10 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ShopSidebarFilters
                selectedCategory={selectedCategory}
                selectedFabric={selectedFabric}
                selectedColor={selectedColor}
                selectedPrice={selectedPrice}
                onCategoryChange={setSelectedCategory}
                onFabricChange={setSelectedFabric}
                onColorChange={setSelectedColor}
                onPriceChange={setSelectedPrice}
                onApplyFilters={() => setIsMobileDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
