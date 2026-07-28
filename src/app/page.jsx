'use client';

import React, { useEffect } from 'react';
import { Suspense } from 'react';
import Preloader from '@/components/Preloader';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Shop from '@/components/Shop';
import About from '@/components/About';
import Contact from '@/components/Contact';

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EFE8]">
      {/* Luxury Loading Preloader */}
      <Preloader />

      {/* Sticky top bar: Announcement + Navbar */}
      <div className="sticky top-0 z-50 bg-[#F7EFE8]/95 backdrop-blur-md">
        <AnnouncementBar />
        <div className="border-b border-[#E2D4C5]/50">
          <Navbar />
        </div>
      </div>

      {/* ── SECTION 1: HERO ── */}
      <section id="home" className="w-full">
        <Hero />
      </section>

      {/* ── SECTION 2: SHOP ── */}
      <section id="shop" className="w-full scroll-mt-24">
        <Suspense
          fallback={
            <div className="w-full py-24 text-center">
              <p className="font-serif-luxury text-xl text-[#3D1418] animate-pulse">
                Loading Collection...
              </p>
            </div>
          }
        >
          <Shop isEmbedded={true} />
        </Suspense>
      </section>


      {/* ── SECTION 4: ABOUT ── */}
      <section id="about" className="w-full scroll-mt-24">
        <About />
      </section>

      {/* ── SECTION 5: CONTACT ── */}
      <section id="contact" className="w-full scroll-mt-24">
        <Contact />
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#2A0E11] text-[#EFE6DD] py-6 px-4 text-center text-xs tracking-wider uppercase border-t border-[#3D1418]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SAKHI BY MAYA&apos;S. ALL RIGHTS RESERVED.</p>
          <p className="text-[11px] opacity-75">TRADITION WOVEN WITH LOVE</p>
        </div>
      </footer>
    </div>
  );
}
