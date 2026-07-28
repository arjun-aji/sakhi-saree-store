'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown, RotateCcw, X, ShieldCheck, Heart, Sparkles, Truck, Package, RefreshCw, Award } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ShopFilters from '@/components/ShopFilters';
import ShopSidebarFilters from '@/components/ShopSidebarFilters';
import { products } from '@/data/products';

/* ── Delicate Floral Branch Vector Artwork for Hero ── */
function FloralArtworkLeft() {
  return (
    <svg className="w-24 h-24 sm:w-36 sm:h-36 text-[#C59B27]/25 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M10 90 Q 30 70, 40 40 Q 50 20, 80 10" />
      <path d="M40 40 Q 60 50, 75 45" />
      <circle cx="80" cy="10" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="75" cy="45" r="2.5" fill="currentColor" opacity="0.4" />
      <path d="M30 70 Q 20 50, 15 40" />
      <circle cx="15" cy="40" r="2" fill="currentColor" opacity="0.4" />
      <path d="M50 20 Q 65 25, 70 20" />
      <circle cx="70" cy="20" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function FloralArtworkRight() {
  return (
    <svg className="w-24 h-24 sm:w-36 sm:h-36 text-[#C59B27]/25 pointer-events-none transform -scale-x-100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M10 90 Q 30 70, 40 40 Q 50 20, 80 10" />
      <path d="M40 40 Q 60 50, 75 45" />
      <circle cx="80" cy="10" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="75" cy="45" r="2.5" fill="currentColor" opacity="0.4" />
      <path d="M30 70 Q 20 50, 15 40" />
      <circle cx="15" cy="40" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

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

const PAGE_SIZE = 12;

export default function Shop({ isNewArrivalsPage = false }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Determine mode
  const isNewArrivals = isNewArrivalsPage || pathname?.includes('new-arrivals') || searchParams.get('filter') === 'new';

  /* ── Filter States ── */
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState(8999);
  const [selectedSort, setSelectedSort] = useState('new');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);

  /* ── Filtering + Sorting Logic ── */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // If New Arrivals, filter by newest first or `isNew` flag
    if (isNewArrivals) {
      result.sort((a, b) => new Date(b.createdAt || '2026-07-01') - new Date(a.createdAt || '2026-07-01'));
    }

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
      case 'featured':
        result.sort((a, b) => (b.isBestSeller || b.isNew ? 1 : 0) - (a.isBestSeller || a.isNew ? 1 : 0));
        break;
      case 'new':
      default:
        result.sort((a, b) => new Date(b.createdAt || '2026-07-01') - new Date(a.createdAt || '2026-07-01'));
        break;
    }

    return result;
  }, [selectedCategory, selectedFabric, selectedColor, selectedPrice, selectedSort, isNewArrivals]);

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
    setSelectedSort('new');
  };

  return (
    <div className="w-full bg-[#F7EFE8]">

      {/* ================================================================ */}
      {/* 1. HERO SECTION WITH BREADCRUMB & FLORAL ARTWORK                */}
      {/* ================================================================ */}
      <section className="relative w-full bg-[#F7EFE8] pt-2 sm:pt-3 pb-2 sm:pb-3 px-4 sm:px-8 overflow-hidden text-center">
        
        {/* Decorative Background Floral Artwork */}
        <div className="absolute top-0 left-0 p-2 sm:p-3 opacity-70">
          <FloralArtworkLeft />
        </div>
        <div className="absolute top-0 right-0 p-2 sm:p-3 opacity-70">
          <FloralArtworkRight />
        </div>

        <div className="max-w-4xl mx-auto space-y-0.5 relative z-10">
          
          {/* Subtitle Badge */}
          <div className="inline-flex items-center justify-center gap-1.5 text-[#8B5A3C] uppercase tracking-[0.25em] text-[10px] font-bold">
            <span>{isNewArrivals ? 'NEW ARRIVALS' : 'OUR COLLECTION'}</span>
            <FlowerIcon className="w-3 h-3 text-[#C59B27]" />
          </div>

          {/* Main Serif Heading */}
          <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2A0E11] leading-tight tracking-tight">
            {isNewArrivals ? 'New Arrivals' : 'Shop Collection'}
          </h1>

          {/* Tagline */}
          <p className="font-serif-luxury text-[11px] sm:text-sm text-[#5A4438] italic font-normal max-w-xl mx-auto">
            {isNewArrivals
              ? 'Freshly handpicked sarees, crafted with love and tradition.'
              : 'Handpicked sarees that celebrate tradition, elegance and you.'}
          </p>

        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. MAIN CONTENT LAYOUT (Desktop Sidebar + Grid)                 */}
      {/* ================================================================ */}
      <section className="w-full pb-4 sm:pb-6 px-3 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-5 items-start">

          {/* DESKTOP SIDEBAR (Collapsible with Toggle) */}
          {showDesktopSidebar && (
            <div className="hidden lg:block w-[200px] flex-shrink-0 transition-all duration-300">
              <div className="sticky top-14">
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
          )}

          {/* MAIN PRODUCT GRID AREA */}
          <div className="flex-1 w-full min-w-0">

            {/* Filter / Sort Top Bar */}
            <ShopFilters
              totalProductsCount={filteredProducts.length}
              visibleProductsCount={visibleProducts.length}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
              onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
              showDesktopSidebar={showDesktopSidebar}
              onToggleDesktopSidebar={() => setShowDesktopSidebar(!showDesktopSidebar)}
              activeFilterCount={activeFilterCount}
            />

            {/* PRODUCT GRID: 6 columns desktop, 3 tablet, 2 mobile */}
            {visibleProducts.length > 0 ? (
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 ${
                  showDesktopSidebar ? 'lg:grid-cols-6' : 'lg:grid-cols-6'
                } gap-x-2.5 gap-y-4 sm:gap-x-3 sm:gap-y-5`}
              >
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-14 bg-[#F3EADF]/60 rounded-xl border border-[#E5DACD] my-4">
                <p className="font-serif-luxury text-xl text-[#2A0E11] mb-2">No Sarees Found</p>
                <p className="text-xs text-[#8B5A3C] mb-4">Try adjusting your filters to see more sarees.</p>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 bg-[#3D1418] text-[#F7EFE8] text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-md shadow-xs hover:bg-[#5B1D23] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear Filters
                </button>
              </div>
            )}

            {/* LOAD MORE BUTTON */}
            {hasMore && (
              <div className="text-center mt-8 sm:mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="inline-flex items-center justify-center gap-2 bg-[#F7EFE8] border border-[#DCD0C5] hover:border-[#8B2635] text-[#3D1418] hover:text-[#8B2635] text-xs font-bold tracking-[0.2em] uppercase px-8 sm:px-10 py-2.5 sm:py-3 rounded-md transition-all shadow-2xs group"
                >
                  <span>LOAD MORE</span>
                  <ChevronDown className="w-4 h-4 text-[#3D1418] group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. PROMOTIONAL BANNER SECTION                                    */}
      {/* ================================================================ */}
      <section className="w-full pb-4 sm:pb-6 px-3 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="bg-[#F3EADF] border border-[#E5DACD] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-2xs">
            
            {/* Background floral watermark */}
            <div className="absolute bottom-0 left-0 text-[#C59B27]/10 pointer-events-none">
              <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                <circle cx="50" cy="50" r="45" />
                <path d="M20 80 Q 50 20, 80 80" />
              </svg>
            </div>

            {/* Left Promotional Text */}
            <div className="flex-1 space-y-1.5 text-center sm:text-left relative z-10">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-[#2A0E11] font-normal leading-tight">
                Timeless Elegance, Delivered to You
              </h2>
              <p className="text-xs sm:text-sm text-[#5A4438] font-medium">
                Free shipping on orders above ₹1499
              </p>
              <p className="text-[11px] sm:text-xs text-[#8A786D] pt-1">
                Secure Packaging &nbsp;•&nbsp; Easy Returns &nbsp;•&nbsp; 100% Quality Assured
              </p>
            </div>

            {/* Right Sakhi Luxury Box Packaging Graphic */}
            <div className="flex-shrink-0 relative z-10">
              <div className="w-48 sm:w-56 lg:w-64 h-24 sm:h-28 bg-[#F9F5F0] rounded-xl border border-[#E2D4C5] p-3 flex flex-col items-center justify-center text-center shadow-md hover:scale-102 transition-transform">
                <div className="relative w-28 sm:w-32 h-8 sm:h-10 mb-1">
                  <Image
                    src="/assets/logo.png"
                    alt="Sakhi Packaging Box"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-[9px] text-[#8B5A3C] uppercase tracking-widest font-bold">
                  Handcrafted Saree Box
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. BOTTOM 4-FEATURE STRIP (Mobile & Tablet View)                 */}
      {/* ================================================================ */}
      <section className="w-full bg-[#F3EADF] border-t border-[#E5DACD] py-5 px-3 block lg:hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center items-center">
            
            <div className="flex flex-col items-center p-2 space-y-1">
              <Truck className="w-5 h-5 text-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A0E11]">
                FREE SHIPPING
              </span>
              <span className="text-[9.5px] text-[#5A4438]">Above ₹1499</span>
            </div>

            <div className="flex flex-col items-center p-2 space-y-1">
              <Package className="w-5 h-5 text-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A0E11]">
                SECURE PACKAGING
              </span>
              <span className="text-[9.5px] text-[#5A4438]">Safe & Premium</span>
            </div>

            <div className="flex flex-col items-center p-2 space-y-1">
              <RefreshCw className="w-5 h-5 text-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A0E11]">
                EASY RETURNS
              </span>
              <span className="text-[9.5px] text-[#5A4438]">Hassle-free</span>
            </div>

            <div className="flex flex-col items-center p-2 space-y-1">
              <Award className="w-5 h-5 text-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A0E11]">
                QUALITY ASSURED
              </span>
              <span className="text-[9.5px] text-[#5A4438]">Premium Sarees</span>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* MOBILE / TABLET SLIDE-OUT FILTER DRAWER                         */}
      {/* ================================================================ */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-out Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-[#F7EFE8] h-full shadow-2xl overflow-y-auto p-4 z-10 flex flex-col justify-between animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DACD] mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#3D1418]">FILTERS & SORT</span>
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
