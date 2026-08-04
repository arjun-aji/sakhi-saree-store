'use client';

import React from 'react';
import { SlidersHorizontal, ChevronDown, AlignLeft } from 'lucide-react';

export default function ShopFilters({
  totalProductsCount = 48,
  visibleProductsCount = 12,
  selectedSort,
  onSortChange,
  onOpenMobileDrawer,
  showDesktopSidebar = true,
  onToggleDesktopSidebar,
  activeFilterCount = 0,
}) {
  return (
    <div className="w-full mb-2 sm:mb-3">
      
      {/* DESKTOP TOP BAR (lg+) */}
      <div className="hidden lg:flex items-center justify-between w-full pb-2">
        {/* Toggle Sidebar Button */}
        <div className="flex items-center gap-3">
          {onToggleDesktopSidebar && (
            <button
              type="button"
              onClick={onToggleDesktopSidebar}
              className="inline-flex items-center gap-2 bg-[#FFFFF0] hover:bg-[#F3EADF] border border-[#DCD0C5] hover:border-[#B84D28] text-[#8C3B1F] text-xs font-bold tracking-widest uppercase px-3.5 py-2 rounded-md transition-all shadow-2xs"
            >
              <AlignLeft className="w-4 h-4 text-[#8C3B1F]" />
              <span>{showDesktopSidebar ? 'HIDE FILTERS' : 'SHOW FILTERS'}</span>
            </button>
          )}

          {/* Showing Count Text */}
          <span className="text-xs sm:text-sm text-[#5A4438] font-medium tracking-wide">
            Showing 1-{visibleProductsCount} of {totalProductsCount} products
          </span>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative">
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-[#FFFFF0] border border-[#DCD0C5] hover:border-[#B84D28] rounded-md px-4 py-2 pr-8 text-xs font-bold uppercase tracking-wider text-[#8C3B1F] focus:outline-none cursor-pointer transition-colors shadow-2xs"
          >
            <option value="new">SORT BY: NEWEST FIRST</option>
            <option value="featured">SORT BY: FEATURED</option>
            <option value="price_asc">SORT BY: PRICE LOW TO HIGH</option>
            <option value="price_desc">SORT BY: PRICE HIGH TO LOW</option>
            <option value="bestselling">SORT BY: BEST SELLING</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#8C3B1F] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
        </div>
      </div>

      {/* MOBILE / TABLET TOP BAR (< lg) */}
      <div className="flex lg:hidden flex-col gap-2.5 w-full">
        {/* Buttons Row */}
        <div className="flex items-center justify-between gap-2 w-full">
          {/* FILTER & SORT Button */}
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FFFFF0] border border-[#DCD0C5] hover:border-[#B84D28] rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#8C3B1F] transition-colors shadow-2xs"
          >
            <span>FILTER & SORT</span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C3B1F]" />
            {activeFilterCount > 0 && (
              <span className="bg-[#B84D28] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="relative flex-1">
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full appearance-none bg-[#FFFFF0] border border-[#DCD0C5] hover:border-[#B84D28] rounded-md px-3 py-2 pr-7 text-[11px] font-bold uppercase tracking-wider text-[#8C3B1F] focus:outline-none cursor-pointer transition-colors shadow-2xs"
            >
              <option value="new">SORT BY: NEWEST FIRST</option>
              <option value="featured">SORT BY: FEATURED</option>
              <option value="price_asc">SORT BY: PRICE LOW TO HIGH</option>
              <option value="price_desc">SORT BY: PRICE HIGH TO LOW</option>
              <option value="bestselling">SORT BY: BEST SELLING</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C3B1F] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-80" />
          </div>
        </div>

        {/* Showing Count Text Mobile */}
        <div className="text-left px-0.5">
          <span className="text-[11px] sm:text-xs text-[#5A4438] font-medium tracking-wide">
            Showing 1-{visibleProductsCount} of {totalProductsCount} products
          </span>
        </div>
      </div>

    </div>
  );
}
