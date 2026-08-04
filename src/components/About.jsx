'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


/* ── Decorative Lotus SVG Icon ── */
function LotusIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3C10.5 6 7 8 7 12C7 15 9.5 17.5 12 19C14.5 17.5 17 15 17 12C17 8 13.5 6 12 3Z" />
      <path d="M12 19C9 18 4 15 4 10C4 8 5 6 7 5" />
      <path d="M12 19C15 18 20 15 20 10C20 8 19 6 17 5" />
    </svg>
  );
}

/* ── Decorative Floral Outline SVG Icon ── */
function FloralCornerIcon({ className = 'w-20 h-20' }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8" aria-hidden="true">
      <path d="M50 90C40 70 30 50 30 30C30 15 40 10 50 10C60 10 70 15 70 30C70 50 60 70 50 90Z" opacity="0.4" />
      <path d="M50 90C30 80 10 60 10 40C10 25 20 15 35 25C45 32 48 50 50 90Z" opacity="0.3" />
      <path d="M50 90C70 80 90 60 90 40C90 25 80 15 65 25C55 32 52 50 50 90Z" opacity="0.3" />
    </svg>
  );
}

/* ── Gold Diamond Divider ── */
function GoldDivider({ className = 'my-5' }) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#C59B27]/40" />
      <span className="text-[#C59B27] text-[10px] sm:text-xs">✦</span>
      <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#C59B27]/40" />
    </div>
  );
}

export default function About() {
  const storyCards = [
    {
      title: 'Rooted in Tradition',
      image: '/assets/about/story_tradition.jpg',
      alt: 'Rooted in Tradition - Weaving saree on traditional handloom',
    },
    {
      title: 'Crafted with Love',
      image: '/assets/about/story_crafted.jpg',
      alt: 'Crafted with Love - Artisan gold zardosi embroidery work',
    },
    {
      title: 'Made for You',
      image: '/assets/about/story_madeforyou.jpg',
      alt: 'Made for You - Beautiful handcrafted folded saree stack',
    },
  ];

  return (
    <div className="w-full">

      {/* ================================================================== */}
      {/* SECTION 1 — ABOUT HERO                                              */}
      {/* Background: #F8F1EA | Padding: 70px mobile / 120px desktop          */}
      {/* ================================================================== */}
      <section
        id="about"
        className="w-full bg-[#F8F1EA] py-6 sm:py-20 lg:py-[100px] px-3 sm:px-8 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          {/* Side-by-side flex container on mobile, grid layout on desktop */}
          <div className="flex flex-row lg:grid lg:grid-cols-12 gap-3 sm:gap-8 lg:gap-14 items-center">

            {/* Left: Text Content */}
            <div className="w-1/2 lg:w-auto lg:col-span-6 space-y-2 sm:space-y-4 lg:space-y-6">
              <div className="inline-flex items-center gap-1.5 sm:gap-2.5 text-[#8B5A3C] uppercase tracking-[0.18em] sm:tracking-[0.28em] text-[9px] sm:text-xs font-bold">
                <span>About Us</span>
                <LotusIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#B84D28]" />
              </div>

              <h1 className="font-serif-luxury text-base sm:text-5xl lg:text-[58px] font-normal text-[#6A2B15] leading-tight sm:leading-[1.06] tracking-tight">
                Sakhi By Maya&apos;s
              </h1>

              <GoldDivider className="my-1.5 sm:my-4 lg:my-6" />

              <p className="font-serif-luxury text-[11px] sm:text-xl lg:text-2xl text-[#8C3B1F] italic font-normal leading-snug sm:leading-relaxed">
                Where tradition meets timeless elegance.
              </p>

              <p className="text-[10px] sm:text-sm lg:text-base text-[#5A4438] leading-relaxed sm:leading-[1.85] font-normal max-w-lg">
                At Sakhi By Maya&apos;s, we celebrate the timeless beauty of handcrafted sarees. Each piece is a tribute to India&apos;s rich heritage, woven with love, care, and a promise of unmatched quality.
              </p>
            </div>

            {/* Right: Image Frame */}
            <div className="w-1/2 lg:w-auto lg:col-span-6 relative">
              <div className="relative aspect-[1.13/1] w-full">
                <Image
                  src="/assets/about/hero_stack.jpg"
                  alt="Sakhi By Maya's Luxury Folded Saree Stack"
                  fill
                  priority
                  className="object-contain object-center hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 1024px) 50vw, 50vw"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 2 — OUR STORY                                               */}
      {/* Background: #FFFFFF | Padding: 70px mobile / 120px desktop          */}
      {/* ================================================================== */}
      <section
        id="our-story"
        className="w-full bg-white py-8 sm:py-20 lg:py-[120px] px-3 sm:px-8 lg:px-12"
      >
        <div className="max-w-7xl mx-auto">
          {/* Side-by-side flex container on mobile, grid layout on desktop */}
          <div className="flex flex-row lg:grid lg:grid-cols-12 gap-3 sm:gap-8 lg:gap-16 items-center lg:items-start">

            {/* Left: Story Text */}
            <div className="w-1/2 lg:w-auto lg:col-span-5 space-y-2 sm:space-y-4 lg:space-y-5">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[#8B5A3C] uppercase tracking-[0.18em] sm:tracking-[0.28em] text-[9px] sm:text-[11px] font-bold">
                <LotusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B84D28]" />
                <span>Our Story</span>
              </div>

              <h2 className="font-serif-luxury text-base sm:text-3xl lg:text-[50px] font-normal text-[#6A2B15] leading-snug sm:leading-[1.1] tracking-tight">
                From Friendship<br className="hidden sm:block" /> to a Dream
              </h2>

              <GoldDivider className="my-1.5 sm:my-5" />

              <p className="text-[11px] sm:text-sm text-[#5A4438] leading-relaxed sm:leading-[1.95] font-normal max-w-lg">
                Sakhi By Maya&apos;s was born not in a boardroom, but in countless conversations between two friends who shared a love for sarees and a desire to create something meaningful.
              </p>

              {/* Extra paragraphs — desktop only */}
              <div className="hidden lg:block space-y-4">
                <p className="text-sm text-[#5A4438] leading-[1.95] font-normal max-w-lg">
                  We wanted a space where tradition feels personal, quality is never compromised, and every woman can find a saree that makes her feel special.
                </p>
                <p className="text-sm text-[#5A4438] leading-[1.95] font-normal max-w-lg">
                  With many late nights, planning, learning and believing in each other, we turned our dream into Sakhi By Maya&apos;s — a brand built on friendship, passion and purpose.
                </p>
              </div>


            </div>

            {/* Right: Story Images */}
            <div className="w-1/2 lg:w-auto lg:col-span-7">

              {/* === MOBILE: Compact side-by-side card list === */}
              <div className="space-y-2 sm:space-y-4 lg:hidden">
                {storyCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-[12px] sm:rounded-[18px] bg-white border border-[rgba(180,140,110,0.12)] shadow-[0_3px_12px_rgba(0,0,0,0.04)] sm:shadow-[0_12px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-300 group"
                  >
                    <div className="relative w-12 h-10 sm:w-28 sm:h-20 rounded-[8px] sm:rounded-[12px] overflow-hidden flex-shrink-0">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        className="object-cover group-hover:scale-[1.05] transition-transform duration-500"
                        sizes="(max-width: 640px) 48px, 112px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif-luxury text-[10px] sm:text-lg font-medium text-[#6A2B15] tracking-tight sm:tracking-wide leading-tight line-clamp-2">
                        {card.title}
                      </h3>
                      <div className="w-5 sm:w-10 h-px bg-[#C59B27]/50 mt-1 sm:mt-2" />
                    </div>
                  </div>
                ))}
              </div>

              {/* === DESKTOP: 3-column large portrait grid === */}
              <div className="hidden lg:grid grid-cols-3 gap-8">
                {storyCards.map((card, idx) => (
                  <div key={idx} className="flex flex-col group">
                    <div className="relative aspect-[3/4] rounded-[18px] overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.06)] border border-[rgba(180,140,110,0.08)]">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                        sizes="(max-width: 1280px) 200px, 230px"
                      />
                    </div>
                    <div className="text-center mt-4 space-y-2">
                      <h3 className="font-serif-luxury text-base font-medium text-[#6A2B15] tracking-wide">
                        {card.title}
                      </h3>
                      <div className="w-8 h-px bg-[#C59B27]/50 mx-auto" />
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
