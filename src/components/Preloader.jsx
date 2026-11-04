'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Lock scroll during preloader
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Check if custom video exists in assets
    fetch('/assets/curtain.mp4', { method: 'HEAD' })
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('video')) {
          setVideoAvailable(true);
        }
      })
      .catch(() => {});

    // Stage 1: Closed curtains with illuminated Sakhi emblem (1200ms)
    const openTimer = setTimeout(() => {
      // Stage 2: Trigger slow theatrical curtain opening to two sides
      setIsOpen(true);
      window.dispatchEvent(new CustomEvent('preloader-done'));

      // Stage 3: Unmount preloader after curtains fully part and clear
      const finishTimer = setTimeout(() => {
        setLoading(false);
        document.documentElement.style.overflow = '';
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 2500);

      return () => clearTimeout(finishTimer);
    }, 1200);

    return () => {
      clearTimeout(openTimer);
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!loading) return null;

  // If a custom curtain opening video is placed in /assets/curtain.mp4, play it
  if (videoAvailable) {
    return (
      <div className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-1000 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <video
          ref={videoRef}
          src="/assets/curtain.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => {
            setIsOpen(true);
            window.dispatchEvent(new CustomEvent('preloader-done'));
            setTimeout(() => setLoading(false), 500);
          }}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Multi-pleat array for rich, realistic cloth folding
  const pleatCount = 10;
  const pleats = Array.from({ length: pleatCount });

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden select-none pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      {/* ========================================================= */}
      {/* 1. LEFT THEATER CURTAIN (Slowly Bunches to the Left)      */}
      {/* ========================================================= */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-1/2 z-20 origin-left transition-all duration-[2400ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isOpen
            ? 'scale-x-[0.06] -translate-x-6 opacity-0'
            : 'scale-x-100 translate-x-0 opacity-100'
        }`}
        style={{
          boxShadow: '15px 0 40px rgba(0,0,0,0.85)',
          clipPath: isOpen 
            ? 'polygon(0% 0%, 100% 0%, 35% 100%, 0% 100%)' 
            : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          transitionProperty: 'transform, opacity, clip-path',
        }}
      >
        {/* Deep Velvet Multi-Pleat Fabric */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D1407] via-[#8C3B1F] to-[#5A200F] flex overflow-hidden">
          {pleats.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-full"
              style={{
                background: `linear-gradient(90deg, 
                  rgba(45, 12, 4, 0.95) 0%, 
                  rgba(215, 85, 30, 0.45) 45%, 
                  rgba(255, 200, 120, 0.25) 55%, 
                  rgba(45, 12, 4, 0.9) 100%)`,
                boxShadow: 'inset 0 0 12px rgba(0,0,0,0.5)',
              }}
            />
          ))}
        </div>

        {/* Diagonal Drape Swag Shadow */}
        <div 
          className={`absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-amber-200/10 pointer-events-none transition-opacity duration-[2000ms] ${
            isOpen ? 'opacity-100' : 'opacity-40'
          }`} 
        />
      </div>

      {/* ========================================================= */}
      {/* 2. RIGHT THEATER CURTAIN (Slowly Bunches to the Right)    */}
      {/* ========================================================= */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-1/2 z-20 origin-right transition-all duration-[2400ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isOpen
            ? 'scale-x-[0.06] translate-x-6 opacity-0'
            : 'scale-x-100 translate-x-0 opacity-100'
        }`}
        style={{
          boxShadow: '-15px 0 40px rgba(0,0,0,0.85)',
          clipPath: isOpen 
            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 65% 100%)' 
            : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          transitionProperty: 'transform, opacity, clip-path',
        }}
      >
        {/* Deep Velvet Multi-Pleat Fabric */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#3D1407] via-[#8C3B1F] to-[#5A200F] flex overflow-hidden">
          {pleats.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-full"
              style={{
                background: `linear-gradient(90deg, 
                  rgba(45, 12, 4, 0.9) 0%, 
                  rgba(255, 200, 120, 0.25) 45%, 
                  rgba(215, 85, 30, 0.45) 55%, 
                  rgba(45, 12, 4, 0.95) 100%)`,
                boxShadow: 'inset 0 0 12px rgba(0,0,0,0.5)',
              }}
            />
          ))}
        </div>

        {/* Diagonal Drape Swag Shadow */}
        <div 
          className={`absolute inset-0 bg-gradient-to-tl from-black/60 via-transparent to-amber-200/10 pointer-events-none transition-opacity duration-[2000ms] ${
            isOpen ? 'opacity-100' : 'opacity-40'
          }`} 
        />
      </div>

      {/* ========================================================= */}
      {/* 3. CENTER BRANDING & SPOTLIGHT ILLUMINATION               */}
      {/* ========================================================= */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center transition-all duration-700 ease-out px-6 ${
          isOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Soft Radial Spotlight on the Curtain */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center max-w-sm z-10">
          {/* Sakhi Logo */}
          <div className="relative w-64 h-20 sm:w-80 sm:h-26 animate-logo-fade filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.9)]">
            <Image
              src="/assets/logo.png"
              alt="Sakhi By Maya's Logo"
              fill
              priority
              className="object-contain brightness-0 invert"
              sizes="(max-width: 640px) 256px, 320px"
            />
          </div>

          {/* Golden Progress Line */}
          <div className="w-48 h-[2px] bg-[#FFFFF0]/20 relative overflow-hidden mt-6 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.6)]">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3D1] to-[#D4AF37] w-1/2 rounded-full animate-elegant-load" />
          </div>

          {/* Tagline */}
          <span className="text-[11px] text-[#FAF7EC] font-serif tracking-[0.28em] uppercase mt-4 font-semibold drop-shadow-md">
            Tradition Woven With Love
          </span>
        </div>
      </div>
    </div>
  );
}
