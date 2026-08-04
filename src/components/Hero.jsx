'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NewArrivalsPreview from './NewArrivalsPreview';
import FeatureBar from './FeatureBar';

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // If preloader already done (e.g. hot reload / subsequent visits), show immediately
    const handleDone = () => setVisible(true);

    // Listen for preloader-done event
    window.addEventListener('preloader-done', handleDone);

    // Fallback: if preloader is already finished (page already loaded), show after tiny delay
    const fallback = setTimeout(() => setVisible(true), 2700);

    return () => {
      window.removeEventListener('preloader-done', handleDone);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <section className={`relative w-full bg-[#F7EFE8] overflow-hidden transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>

      {/* ========================================================= */}
      {/* MOBILE HERO VIEW                                          */}
      {/* ========================================================= */}
      <div className="block md:hidden relative w-full min-h-[calc(100vh-56px)] flex flex-col justify-between pb-6 pt-8 px-4">

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

        {/* Mobile Content Layer — animated in after preloader */}
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
          <div className="flex flex-col gap-2 pt-1 w-full max-w-[160px]">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-1.5 bg-[#3D1418] hover:bg-[#5B1D23] text-[#F7EFE8] text-[10px] font-bold tracking-widest uppercase py-2 rounded-sm shadow-sm transition-all w-full text-center"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <Link
              href="/collections"
              className="inline-flex items-center justify-center border border-[#3D1418]/60 text-[#3D1418] text-[10px] font-bold tracking-widest uppercase py-2 rounded-sm bg-transparent w-full text-center mb-0.5"
            >
              Explore Collections
            </Link>

            <a
              href="https://wa.me/919746598789?text=Hi!%20I%20am%20interested%20in%20exploring%20and%20buying%20your%20handcrafted%20sarees."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-[#1E5631] hover:bg-[#153e22] text-white text-[10px] font-bold tracking-widest uppercase py-2 rounded-sm w-full text-center transition-all shadow-sm"
            >
              <svg className="w-3 h-3 fill-currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span>Buy on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Mobile Spacer */}
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

        {/* Desktop Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto w-full min-h-[calc(100vh-56px)] px-6 lg:px-8 pt-12 pb-8 flex flex-col justify-between">

          {/* Main content — animated in after preloader */}
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
            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 bg-[#3D1418] hover:bg-[#5B1D23] text-[#F7EFE8] text-sm font-bold tracking-widest uppercase px-6 py-3.5 rounded-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/collections"
                className="inline-flex items-center justify-center border border-[#3D1418]/60 hover:border-[#3D1418] text-[#3D1418] hover:bg-[#3D1418]/5 text-sm font-bold tracking-widest uppercase px-6 py-3.5 rounded-sm transition-all duration-300"
              >
                Explore Collections
              </Link>

              <a
                href="https://wa.me/919746598789?text=Hi!%20I%20am%20interested%20in%20exploring%20and%20buying%20your%20handcrafted%20sarees."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#1E5631] hover:bg-[#153e22] text-white text-sm font-bold tracking-widest uppercase px-6 py-3.5 rounded-sm shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                <span>Buy on WhatsApp</span>
              </a>
            </div>

            {/* New Arrivals Preview */}
            <div className="pt-4">
              <NewArrivalsPreview />
            </div>
          </div>

          {/* Desktop Feature Bar at Bottom — slight delay */}
          <div className="mt-12">
            <FeatureBar />
          </div>

        </div>
      </div>

    </section>
  );
}
