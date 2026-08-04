'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Lock scroll while preloader is showing
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const timer = setTimeout(() => {
      setFadeOut(true);

      const unmountTimer = setTimeout(() => {
        setLoading(false);
        // Unlock scroll and dispatch event for hero animation
        document.documentElement.style.overflow = '';
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.dispatchEvent(new CustomEvent('preloader-done'));
      }, 700);

      return () => clearTimeout(unmountTimer);
    }, 1800);

    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#6A2B15] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-sm px-6">

        {/* Animated Brand Logo */}
        <div className="relative w-64 h-20 sm:w-80 sm:h-26 animate-logo-fade">
          <Image
            src="/assets/logo.png"
            alt="Sakhi By Maya's Logo"
            fill
            priority
            className="object-contain brightness-0 invert"
            sizes="(max-width: 640px) 256px, 320px"
          />
        </div>

        {/* Gold Progress Line */}
        <div className="w-40 h-[1.5px] bg-[#FFFFF0]/15 relative overflow-hidden mt-6 rounded-full">
          <div className="absolute top-0 left-0 h-full bg-[#C59B27] w-1/2 rounded-full animate-elegant-load" />
        </div>

        {/* Loading Tagline */}
        <span className="text-[10px] text-[#C59B27] font-bold tracking-[0.25em] uppercase mt-4 opacity-90">
          Tradition Woven With Love
        </span>

      </div>
    </div>
  );
}
