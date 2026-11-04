'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    // Lock scroll while preloader is active
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Phase 1: Display brand logo & gold progress bar
    const openTimer = setTimeout(() => {
      // Phase 2: Start curtain opening transition to both sides
      setIsOpening(true);
      window.dispatchEvent(new CustomEvent('preloader-done'));

      // Phase 3: Finish transition and unmount after curtains fully part
      const finishTimer = setTimeout(() => {
        setLoading(false);
        document.documentElement.style.overflow = '';
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 850);

      return () => clearTimeout(finishTimer);
    }, 900);

    return () => {
      clearTimeout(openTimer);
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden ${
        isOpening ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      aria-hidden="true"
    >
      {/* ── Left Curtain Door ── */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-1/2 bg-gradient-to-r from-[#4A170A] via-[#5A2111] to-[#6A2B15] shadow-2xl z-20 transition-transform duration-800 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isOpening ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Gold Border Trim on the Seam */}
        <div className="absolute top-0 right-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#C59B27]/10 via-[#D4AF37] to-[#C59B27]/10 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />

        {/* Subtle Silk Sheen Gradient Accent */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#D4AF37]/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* ── Right Curtain Door ── */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-[#4A170A] via-[#5A2111] to-[#6A2B15] shadow-2xl z-20 transition-transform duration-800 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isOpening ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Gold Border Trim on the Seam */}
        <div className="absolute top-0 left-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#C59B27]/10 via-[#D4AF37] to-[#C59B27]/10 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />

        {/* Subtle Silk Sheen Gradient Accent */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-[#D4AF37]/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* ── Centered Sakhi Branding ── */}
      <div
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center transition-all duration-300 ease-out px-6 ${
          isOpening ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <div className="flex flex-col items-center max-w-sm">
          {/* Animated Brand Logo */}
          <div className="relative w-64 h-20 sm:w-80 sm:h-26 animate-logo-fade drop-shadow-lg">
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
          <div className="w-40 h-[1.5px] bg-[#FFFFF0]/15 relative overflow-hidden mt-6 rounded-full shadow-xs">
            <div className="absolute top-0 left-0 h-full bg-[#C59B27] w-1/2 rounded-full animate-elegant-load" />
          </div>

          {/* Tagline */}
          <span className="text-[10px] text-[#C59B27] font-bold tracking-[0.25em] uppercase mt-4 opacity-95">
            Tradition Woven With Love
          </span>
        </div>
      </div>
    </div>
  );
}
