'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show preloader for 1.8 seconds, then trigger fade out transition
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Fully unmount after transition completes
      const unmountTimer = setTimeout(() => {
        setLoading(false);
      }, 600); // matches transition duration
      return () => clearTimeout(unmountTimer);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#2A0E11] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        fadeOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-sm px-6">
        
        {/* Animated Brand Logo Container (Increased size for clear visibility) */}
        <div className="relative w-64 h-20 sm:w-80 sm:h-26 animate-logo-fade">
          <Image 
            src="/assets/logo.png" 
            alt="Sakhi By Maya's Logo" 
            fill
            priority
            className="object-contain brightness-0 invert" // Invert logo color to render beautifully on dark background
            sizes="(max-width: 640px) 256px, 320px"
          />
        </div>

        {/* Elegant Gold Progress Line (Adjusted for dark background) */}
        <div className="w-40 h-[1.5px] bg-[#F7EFE8]/15 relative overflow-hidden mt-6 rounded-full">
          <div className="absolute top-0 left-0 h-full bg-[#C59B27] w-1/2 rounded-full animate-elegant-load" />
        </div>
        
        {/* Loading Tagline (Set to gold/light beige contrast) */}
        <span className="text-[10px] text-[#C59B27] font-bold tracking-[0.25em] uppercase mt-4 opacity-90">
          Tradition Woven With Love
        </span>

      </div>
    </div>
  );
}
