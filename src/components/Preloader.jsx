'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show preloader for 1.6 seconds, then trigger fade out transition
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Fully unmount after transition completes
      const unmountTimer = setTimeout(() => {
        setLoading(false);
      }, 600); // matches transition duration
      return () => clearTimeout(unmountTimer);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#F7EFE8] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        fadeOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-xs px-6">
        
        {/* Animated Brand Logo Container */}
        <div className="relative w-48 h-16 sm:w-56 sm:h-18 animate-logo-fade">
          <Image 
            src="/assets/logo.png" 
            alt="Sakhi By Maya's Logo" 
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Elegant Gold Progress Line */}
        <div className="w-32 h-[1.5px] bg-[#3D1418]/10 relative overflow-hidden mt-6 rounded-full">
          <div className="absolute top-0 left-0 h-full bg-[#C59B27] w-1/2 rounded-full animate-elegant-load" />
        </div>
        
        {/* Loading Tagline */}
        <span className="text-[10px] text-[#5B1D23] font-bold tracking-[0.25em] uppercase mt-4 opacity-75">
          Tradition Woven With Love
        </span>

      </div>
    </div>
  );
}
