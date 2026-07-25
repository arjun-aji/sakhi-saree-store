'use client';

import React from 'react';
import { SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react';

export default function ShopFilters({
  categories = [],
  fabrics = [],
  colors = [],
  selectedCategory,
  selectedFabric,
  selectedColor,
  selectedSort,
  onCategoryChange,
  onFabricChange,
  onColorChange,
  onSortChange,
  onResetFilters,
  onOpenMobileDrawer,
  activeFilterCount = 0,
}) {
  return (
    <div className="w-full mb-5">
      {/* Single horizontal flex row for ALL screen sizes (flex-nowrap, no wrapping) */}
      <div className="flex flex-row items-center justify-between gap-1 sm:gap-2.5 w-full flex-nowrap overflow-x-auto no-scrollbar py-0.5">
        
        {/* Left Filter Group */}
        <div className="flex flex-row items-center gap-1 sm:gap-2 flex-nowrap flex-shrink-0">
          
          {/* FILTER Button */}
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="inline-flex items-center justify-center gap-1 bg-[#F7EFE8] border border-[#DCD0C5] hover:border-[#8B2635] rounded-md px-2 sm:px-3.5 py-1.5 sm:py-2 text-[9.5px] sm:text-[11px] lg:text-xs font-semibold uppercase tracking-wider text-[#3D1418] transition-colors shadow-2xs whitespace-nowrap flex-shrink-0"
          >
            <span>FILTER</span>
            <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3D1418]" />
            {activeFilterCount > 0 && (
              <span className="ml-0.5 bg-[#8B2635] text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* CATEGORY Dropdown */}
          <div className="relative flex-shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="appearance-none bg-[#F7EFE8] border border-[#DCD0C5] hover:border-[#8B2635] rounded-md px-2 sm:px-3.5 py-1.5 sm:py-2 pr-5 sm:pr-7 text-[9.5px] sm:text-[11px] lg:text-xs font-semibold uppercase tracking-wider text-[#3D1418] focus:outline-none cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
            >
              <option value="All">CATEGORY</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3D1418] absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
          </div>

          {/* FABRIC Dropdown */}
          <div className="relative flex-shrink-0">
            <select
              value={selectedFabric}
              onChange={(e) => onFabricChange(e.target.value)}
              className="appearance-none bg-[#F7EFE8] border border-[#DCD0C5] hover:border-[#8B2635] rounded-md px-2 sm:px-3.5 py-1.5 sm:py-2 pr-5 sm:pr-7 text-[9.5px] sm:text-[11px] lg:text-xs font-semibold uppercase tracking-wider text-[#3D1418] focus:outline-none cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
            >
              <option value="All">FABRIC</option>
              {fabrics.map((fab) => (
                <option key={fab} value={fab}>
                  {fab}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3D1418] absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
          </div>

          {/* COLOR Dropdown */}
          <div className="relative flex-shrink-0">
            <select
              value={selectedColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="appearance-none bg-[#F7EFE8] border border-[#DCD0C5] hover:border-[#8B2635] rounded-md px-2 sm:px-3.5 py-1.5 sm:py-2 pr-5 sm:pr-7 text-[9.5px] sm:text-[11px] lg:text-xs font-semibold uppercase tracking-wider text-[#3D1418] focus:outline-none cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
            >
              <option value="All">COLOR</option>
              {colors.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3D1418] absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
          </div>

          {/* Reset Filters (shown when active) */}
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 bg-[#8B2635]/10 hover:bg-[#8B2635]/20 text-[#8B2635] text-[9.5px] sm:text-xs font-bold uppercase tracking-wider px-2 py-1.5 sm:py-2 rounded-md transition-colors whitespace-nowrap flex-shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right SORT BY Dropdown (Pushed to far right) */}
        <div className="relative flex-shrink-0 ml-auto">
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-[#F7EFE8] border border-[#DCD0C5] hover:border-[#8B2635] rounded-md px-2 sm:px-3.5 py-1.5 sm:py-2 pr-5 sm:pr-7 text-[9.5px] sm:text-[11px] lg:text-xs font-semibold uppercase tracking-wider text-[#3D1418] focus:outline-none cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
          >
            <option value="new">SORT BY: NEW ARRIVALS</option>
            <option value="featured">SORT BY: FEATURED</option>
            <option value="price_asc">SORT BY: PRICE LOW TO HIGH</option>
            <option value="price_desc">SORT BY: PRICE HIGH TO LOW</option>
            <option value="bestselling">SORT BY: BEST SELLING</option>
            <option value="popularity">SORT BY: POPULARITY</option>
          </select>
          <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3D1418] absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
        </div>

      </div>
    </div>
  );
}
