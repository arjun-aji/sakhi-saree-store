'use client';

import React, { useEffect } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
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
    <div className="min-h-screen flex flex-col bg-[#FFFFF0]">
      {/* Luxury Loading Preloader */}
      <Preloader />

      {/* Sticky top bar: Announcement + Navbar */}
      <div className="sticky top-0 z-50 bg-[#FFFFF0]/95 backdrop-blur-md">
        <AnnouncementBar />
        <div className="border-b border-[#E5D9C8]/50">
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
              <p className="font-serif-luxury text-xl text-[#8C3B1F] animate-pulse">
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
      <footer className="w-full bg-[#6A2B15] text-[#FAF7EC] py-8 px-4 text-center text-xs tracking-wider uppercase border-t border-[#8C3B1F]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-wrap justify-center gap-6 text-[#FAF7EC]/80">
            <Link href="/#home" className="hover:text-white transition-colors">Home</Link>
            <Link href="/#shop" className="hover:text-white transition-colors">Shop</Link>
            <Link href="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link>
            <Link href="/blogs" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link>
            <Link href="/#about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/#contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="h-[0.5px] w-full bg-[#8C3B1F]" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#FAF7EC]/70">
            <p>© 2026 SAKHI BY MAYA&apos;S. ALL RIGHTS RESERVED.</p>
            <p className="opacity-75">TRADITION WOVEN WITH LOVE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
