'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, User, Heart, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-transparent sticky top-0 z-50 transition-all duration-300">
      
      {/* ========================================================= */}
      {/* MAIN NAVBAR CONTAINER                                     */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between w-full">
        
        {/* Left: Hamburger menu (mobile) + Increased Logo Size */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="lg:hidden p-1.5 text-[#3D1418] hover:bg-[#3D1418]/10 rounded-md transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center group">
            {/* Logo dimensions increased for premium visibility */}
            <div className="relative w-44 h-14 sm:w-56 sm:h-18 lg:w-64 lg:h-22">
              <Image 
                src="/assets/logo.png" 
                alt="Sakhi By Maya's" 
                fill
                priority
                className="object-contain object-left transition-transform duration-300"
                sizes="(max-width: 640px) 176px, (max-width: 1024px) 224px, 256px"
              />
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (Top Center Aligned) */}
        <nav className="hidden lg:flex items-center justify-center space-x-8 text-xs font-bold tracking-widest text-[#3D1418] uppercase">
          <Link 
            href="/" 
            className="relative py-1 text-[#3D1418] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#3D1418]"
          >
            Home
          </Link>
          <Link href="/shop" className="hover:text-[#8B2635] transition-colors py-1">
            Shop
          </Link>
          <Link href="/new-arrivals" className="hover:text-[#8B2635] transition-colors py-1">
            New Arrivals
          </Link>
          <Link href="/collections" className="hover:text-[#8B2635] transition-colors py-1">
            Collections
          </Link>
          <Link href="/about" className="hover:text-[#8B2635] transition-colors py-1">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-[#8B2635] transition-colors py-1">
            Contact
          </Link>
        </nav>

        {/* Right: Action Utility Icons */}
        <div className="flex items-center space-x-2.5 sm:space-x-4 text-[#3D1418]">
          <button 
            aria-label="Search" 
            className="p-1.5 hover:text-[#8B2635] hover:bg-[#3D1418]/10 rounded-full transition-all duration-200"
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
          </button>
          
          <button 
            aria-label="Account" 
            className="hidden sm:block p-1.5 hover:text-[#8B2635] hover:bg-[#3D1418]/10 rounded-full transition-all duration-200"
          >
            <User className="w-5 h-5 stroke-[1.75]" />
          </button>
          
          <Link 
            href="/wishlist" 
            aria-label="Wishlist" 
            className="p-1.5 hover:text-[#8B2635] hover:bg-[#3D1418]/10 rounded-full transition-all duration-200 relative"
          >
            <Heart className="w-5 h-5 stroke-[1.75]" />
            <span className="absolute -top-1 -right-1 bg-[#3D1418] text-[#F7EFE8] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              0
            </span>
          </Link>
          
          <Link 
            href="/cart" 
            aria-label="Shopping Bag" 
            className="p-1.5 hover:text-[#8B2635] hover:bg-[#3D1418]/10 rounded-full transition-all duration-200 relative"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            <span className="absolute -top-1 -right-1 bg-[#3D1418] text-[#F7EFE8] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              0
            </span>
          </Link>
        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F7EFE8] border-b border-[#E2D4C5] px-6 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-widest text-[#3D1418] uppercase py-1 border-b border-[#E2D4C5]/30"
          >
            Home
          </Link>
          <Link 
            href="/shop" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-widest text-[#3D1418] uppercase py-1 border-b border-[#E2D4C5]/30"
          >
            Shop
          </Link>
          <Link 
            href="/new-arrivals" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-widest text-[#3D1418] uppercase py-1 border-b border-[#E2D4C5]/30"
          >
            New Arrivals
          </Link>
          <Link 
            href="/collections" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-widest text-[#3D1418] uppercase py-1 border-b border-[#E2D4C5]/30"
          >
            Collections
          </Link>
          <Link 
            href="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-widest text-[#3D1418] uppercase py-1 border-b border-[#E2D4C5]/30"
          >
            About Us
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold tracking-widest text-[#3D1418] uppercase py-1"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
