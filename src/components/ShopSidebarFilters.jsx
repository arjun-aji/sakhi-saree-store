'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function ShopSidebarFilters({
  selectedCategory,
  selectedFabric,
  selectedColor,
  selectedPrice,
  onCategoryChange,
  onFabricChange,
  onColorChange,
  onPriceChange,
  onApplyFilters,
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
    fabric: true,
    color: true,
    price: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const categories = [
    { label: 'All Sarees', value: 'All', count: 48 },
    { label: 'Silk Sarees', value: 'Silk Sarees', count: 20 },
    { label: 'Kanjivaram', value: 'Kanjivaram', count: 12 },
    { label: 'Banarasi', value: 'Banarasi', count: 8 },
    { label: 'Cotton Sarees', value: 'Cotton Sarees', count: 6 },
    { label: 'Tussar Sarees', value: 'Tussar Sarees', count: 2 },
  ];

  const fabrics = [
    { label: 'Silk', value: 'Silk', count: 28 },
    { label: 'Kanjivaram Silk', value: 'Kanjivaram Silk', count: 14 },
    { label: 'Banarasi Silk', value: 'Banarasi Silk', count: 8 },
    { label: 'Cotton', value: 'Cotton', count: 6 },
    { label: 'Tussar', value: 'Tussar', count: 2 },
  ];

  const colorSwatches = [
    { name: 'Red', hex: '#8B2635' },
    { name: 'Purple', hex: '#4A154B' },
    { name: 'Green', hex: '#1E5631' },
    { name: 'Blue', hex: '#1B365D' },
    { name: 'Yellow', hex: '#D4AF37' },
    { name: 'Pink', hex: '#E8A598' },
    { name: 'Cream', hex: '#F5ECE4', border: true },
    { name: 'Black', hex: '#2A0E11' },
  ];

  return (
    <aside className="w-full text-[#3D1418] text-xs font-sans">
      <div className="divide-y divide-[#E5DACD] space-y-4">
        
        {/* 1. CATEGORIES SECTION */}
        <div>
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-[11px] font-bold uppercase tracking-wider text-[#3D1418] py-1"
          >
            <span>CATEGORIES</span>
            {openSections.category ? <ChevronUp className="w-3.5 h-3.5 opacity-70" /> : <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
          </button>

          {openSections.category && (
            <div className="mt-2.5 space-y-2">
              {categories.map((cat) => (
                <label key={cat.value} className="flex items-center justify-between text-xs text-[#5A4438] cursor-pointer hover:text-[#8B2635] transition-colors group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category_filter"
                      checked={selectedCategory === cat.value}
                      onChange={() => onCategoryChange(cat.value)}
                      className="w-3.5 h-3.5 border-[#C59B27] text-[#8B2635] focus:ring-[#8B2635] cursor-pointer accent-[#2A0E11]"
                    />
                    <span className={selectedCategory === cat.value ? 'font-bold text-[#2A0E11]' : ''}>{cat.label}</span>
                  </div>
                  <span className="text-[10px] text-[#8A786D]">({cat.count})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 2. FABRIC SECTION */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection('fabric')}
            className="flex items-center justify-between w-full text-[11px] font-bold uppercase tracking-wider text-[#3D1418] py-1"
          >
            <span>FABRIC</span>
            {openSections.fabric ? <ChevronUp className="w-3.5 h-3.5 opacity-70" /> : <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
          </button>

          {openSections.fabric && (
            <div className="mt-2.5 space-y-2">
              {fabrics.map((fab) => (
                <label key={fab.value} className="flex items-center justify-between text-xs text-[#5A4438] cursor-pointer hover:text-[#8B2635] transition-colors">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFabric === fab.value}
                      onChange={() => onFabricChange(selectedFabric === fab.value ? 'All' : fab.value)}
                      className="w-3.5 h-3.5 rounded border-[#C59B27] text-[#8B2635] focus:ring-[#8B2635] cursor-pointer accent-[#2A0E11]"
                    />
                    <span className={selectedFabric === fab.value ? 'font-bold text-[#2A0E11]' : ''}>{fab.label}</span>
                  </div>
                  <span className="text-[10px] text-[#8A786D]">({fab.count})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 3. COLOR SECTION */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection('color')}
            className="flex items-center justify-between w-full text-[11px] font-bold uppercase tracking-wider text-[#3D1418] py-1"
          >
            <span>COLOR</span>
            {openSections.color ? <ChevronUp className="w-3.5 h-3.5 opacity-70" /> : <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
          </button>

          {openSections.color && (
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {colorSwatches.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => onColorChange(selectedColor === color.name ? 'All' : color.name)}
                  aria-label={color.name}
                  className={`w-6 h-6 rounded-full mx-auto transition-transform hover:scale-110 relative flex items-center justify-center ${
                    color.border ? 'border border-[#C59B27]' : ''
                  } ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-[#2A0E11]' : ''}`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 4. PRICE SECTION */}
        <div className="pt-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-[11px] font-bold uppercase tracking-wider text-[#3D1418] py-1"
          >
            <span>PRICE</span>
            {openSections.price ? <ChevronUp className="w-3.5 h-3.5 opacity-70" /> : <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
          </button>

          {openSections.price && (
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#2A0E11]">
                <span>₹1,299</span>
                <span>₹{selectedPrice ? selectedPrice.toLocaleString('en-IN') : '8,999'}</span>
              </div>
              <input
                type="range"
                min="1299"
                max="8999"
                step="100"
                value={selectedPrice || 8999}
                onChange={(e) => onPriceChange(Number(e.target.value))}
                className="w-full accent-[#2A0E11] cursor-pointer"
              />
            </div>
          )}
        </div>

      </div>

      {/* APPLY FILTERS BUTTON */}
      <div className="pt-6">
        <button
          type="button"
          onClick={onApplyFilters}
          className="w-full bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] text-xs font-bold uppercase tracking-[0.2em] py-3 rounded-md transition-colors shadow-xs"
        >
          APPLY FILTERS
        </button>
      </div>

    </aside>
  );
}
