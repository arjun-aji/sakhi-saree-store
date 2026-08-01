'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, User, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, wishlistCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const session = localStorage.getItem('sakhi_user_session');
      setIsLoggedIn(!!session);
    };
    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  return (
    <header className="w-full bg-transparent sticky top-0 z-50 transition-all duration-300">
      
      {/* ========================================================= */}
      {/* MAIN NAVBAR CONTAINER                                     */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-1.5 flex items-center justify-between w-full">
        
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
            <div className="relative w-32 h-9 sm:w-40 sm:h-11 lg:w-48 lg:h-13">
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

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center space-x-8 text-xs font-bold tracking-widest text-[#3D1418] uppercase">
          <Link 
            href="/#home" 
            className="hover:text-[#8B2635] transition-colors py-1"
          >
            Home
          </Link>
          <Link href="/#shop" className="hover:text-[#8B2635] transition-colors py-1">
            Shop
          </Link>
          <Link href="/new-arrivals" className="hover:text-[#8B2635] transition-colors py-1">
            New Arrivals
          </Link>
          <Link href="/#about" className="hover:text-[#8B2635] transition-colors py-1">
            About Us
          </Link>
          <Link href="/#contact" className="hover:text-[#8B2635] transition-colors py-1">
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
          
          <Link 
            href="/profile"
            aria-label="Account" 
            className="hidden sm:block p-1.5 hover:text-[#8B2635] hover:bg-[#3D1418]/10 rounded-full transition-all duration-200 relative"
          >
            <User className="w-5 h-5 stroke-[1.75]" />
            {isLoggedIn && (
              <span className="absolute top-1.5 right-1.5 bg-[#C59B27] w-2 h-2 rounded-full ring-1 ring-[#F7EFE8] animate-pulse" />
            )}
          </Link>
          
          <Link 
            href="/wishlist" 
            aria-label="Wishlist" 
            className="p-1.5 hover:text-[#8B2635] hover:bg-[#3D1418]/10 rounded-full transition-all duration-200 relative"
          >
            <Heart className="w-5 h-5 stroke-[1.75]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8B2635] text-[#F7EFE8] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in duration-200">
                {wishlistCount}
              </span>
            )}
          </Link>
          
          <Link 
            href="/cart" 
            aria-label="Shopping Bag" 
            className="p-1.5 hover:text-[#8B2635] hover:bg-[#3D1418]/10 rounded-full transition-all duration-200 relative"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#3D1418] text-[#F7EFE8] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in duration-200">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/25 z-[98] backdrop-blur-[1px]"
        />
      )}

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 h-screen w-1/2 min-w-[200px] bg-[#F7EFE8]/95 backdrop-blur-md z-[99] shadow-2xl p-5 flex flex-col border-r border-[#E2D4C5]/60 animate-in slide-in-from-left duration-300">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2D4C5]/40 mb-6">
            <span className="text-[10px] tracking-[0.2em] font-bold text-[#3D1418] uppercase">Menu</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 hover:bg-[#3D1418]/10 rounded-md text-[#3D1418] transition-colors"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/#home" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold tracking-widest text-[#3D1418] uppercase pb-2 border-b border-[#E2D4C5]/20 hover:text-[#8B2635] transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/#shop" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold tracking-widest text-[#3D1418] uppercase pb-2 border-b border-[#E2D4C5]/20 hover:text-[#8B2635] transition-colors"
            >
              Shop
            </Link>
            <Link 
              href="/new-arrivals" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold tracking-widest text-[#3D1418] uppercase pb-2 border-b border-[#E2D4C5]/20 hover:text-[#8B2635] transition-colors"
            >
              New Arrivals
            </Link>
            <Link 
              href="/#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold tracking-widest text-[#3D1418] uppercase pb-2 border-b border-[#E2D4C5]/20 hover:text-[#8B2635] transition-colors"
            >
              About Us
            </Link>
            <Link 
              href="/#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold tracking-widest text-[#3D1418] uppercase hover:text-[#8B2635] transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
