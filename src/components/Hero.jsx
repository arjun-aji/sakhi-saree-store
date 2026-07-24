import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NewArrivalsPreview from './NewArrivalsPreview';
import FeatureBar from './FeatureBar';

export default function Hero() {
  return (
    <section className="relative w-full bg-[#F7EFE8] overflow-hidden">

      {/* ========================================================= */}
      {/* MOBILE HERO VIEW (Matches 2nd Picture Layout Exactly)      */}
      {/* ========================================================= */}
      <div className="block md:hidden relative w-full min-h-screen flex flex-col justify-between pb-6 pt-24 px-4">

        {/* Mobile Full Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/mobile/heromob.jpeg"
            alt="Sakhi Mobile Background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={95}
          />
        </div>

        {/* Mobile Content Layer (Pushed down to avoid Navbar overlap) */}
        <div className="relative z-10 space-y-4">
          {/* Tagline */}
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#3D1418]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 3C10.5 6 7 8 7 12C7 15 9.5 17.5 12 19C14.5 17.5 17 15 17 12C17 8 13.5 6 12 3Z" />
              <path d="M12 19C9 18 4 15 4 10C4 8 5 6 7 5" />
              <path d="M12 19C15 18 20 15 20 10C20 8 19 6 17 5" />
            </svg>
            <span className="text-[10px] tracking-[0.2em] font-bold text-[#3D1418] uppercase">
              Tradition Woven With Love
            </span>
          </div>

          {/* Main Headline */}
          <div>
            <h1 className="font-serif-luxury text-4xl sm:text-5xl font-normal text-[#3D1418] leading-[1.08] tracking-tight">
              Elegance <br />
              that speaks <br />
              <span className="font-script text-5xl sm:text-6xl text-[#8B2635] font-normal inline-flex items-center gap-1 pl-1">
                your story
                <span className="text-2xl text-[#C59B27] font-light">♡</span>
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <p className="text-xs text-[#4A3B32] max-w-xs font-normal leading-relaxed">
            Handpicked sarees that <br />
            celebrate grace, heritage <br />
            and timeless beauty.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-1 w-full max-w-[140px]">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-1.5 bg-[#3D1418] hover:bg-[#5B1D23] text-[#F7EFE8] text-[10px] font-bold tracking-widest uppercase py-2 rounded-sm shadow-sm transition-all w-full text-center"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <Link
              href="/collections"
              className="inline-flex items-center justify-center border border-[#3D1418]/60 text-[#3D1418] text-[10px] font-bold tracking-widest uppercase py-2 rounded-sm bg-transparent w-full text-center"
            >
              Explore Collections
            </Link>
          </div>
        </div>

        {/* Mobile Spacer to reveal Model Image in center of background */}
        <div className="relative z-10 h-48 sm:h-64 my-2" />

        {/* Mobile New Arrivals & Feature Bar at Bottom */}
        <div className="relative z-10 space-y-4">
          <NewArrivalsPreview />
          <FeatureBar />
        </div>

      </div>

      {/* ========================================================= */}
      {/* DESKTOP HERO VIEW                                         */}
      {/* ========================================================= */}
      <div className="hidden md:block relative w-full min-h-screen">
        {/* Desktop Full Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/desktop/herodesk.jpeg"
            alt="Sakhi By Maya's Desktop Hero"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={95}
          />
        </div>

        {/* Desktop Content Overlay (Pushed down to avoid Navbar overlap) */}
        <div className="relative z-10 max-w-7xl mx-auto w-full min-h-screen px-6 lg:px-8 pt-32 pb-8 flex flex-col justify-between">
          <div className="max-w-xl space-y-6 pt-10">

            {/* Tagline */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#3D1418]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3C10.5 6 7 8 7 12C7 15 9.5 17.5 12 19C14.5 17.5 17 15 17 12C17 8 13.5 6 12 3Z" />
                <path d="M12 19C9 18 4 15 4 10C4 8 5 6 7 5" />
                <path d="M12 19C15 18 20 15 20 10C20 8 19 6 17 5" />
              </svg>
              <span className="text-xs tracking-[0.25em] font-bold text-[#3D1418] uppercase">
                Tradition Woven With Love
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="font-serif-luxury text-6xl lg:text-7xl font-normal text-[#3D1418] leading-[1.08] tracking-tight">
                Elegance <br />
                that speaks <br />
                <span className="font-script text-7xl lg:text-8xl text-[#8B2635] font-normal inline-flex items-center gap-2 pl-1">
                  your story
                  <span className="text-4xl text-[#C59B27] font-light">♡</span>
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-sm text-[#4A3B32] max-w-sm font-normal leading-relaxed">
              Handpicked sarees that celebrate grace, heritage and timeless beauty.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 pt-1">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 bg-[#3D1418] hover:bg-[#5B1D23] text-[#F7EFE8] text-sm font-bold tracking-widest uppercase px-8 py-3.5 rounded-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/collections"
                className="inline-flex items-center justify-center border border-[#3D1418]/60 hover:border-[#3D1418] text-[#3D1418] hover:bg-[#3D1418]/5 text-sm font-bold tracking-widest uppercase px-8 py-3.5 rounded-sm transition-all duration-300"
              >
                Explore Collections
              </Link>
            </div>

            {/* New Arrivals Preview */}
            <div className="pt-4">
              <NewArrivalsPreview />
            </div>

          </div>

          {/* Desktop Feature Bar at Bottom */}
          <div className="mt-12">
            <FeatureBar />
          </div>
        </div>
      </div>

    </section>
  );
}
