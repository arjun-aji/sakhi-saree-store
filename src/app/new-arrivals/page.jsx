import React, { Suspense } from 'react';
import Link from 'next/link';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Shop from '@/components/Shop';

export const metadata = {
  title: "New Arrivals Handcrafted Sarees | Sakhi By Maya's",
  description:
    "Explore our newest handpicked collection of Kanjivaram, Banarasi, Organza, Chanderi, and Tussar silk sarees.",
};

export default function NewArrivalsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7EFE8]">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-[#F7EFE8]/95 backdrop-blur-md border-b border-[#E2D4C5]/50">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="w-full py-24 text-center">
              <p className="font-serif-luxury text-xl text-[#3D1418] animate-pulse">
                Loading Sakhi New Arrivals...
              </p>
            </div>
          }
        >
          <Shop isNewArrivalsPage={true} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#2A0E11] text-[#EFE6DD] py-8 px-4 text-center text-xs tracking-wider uppercase border-t border-[#3D1418]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-wrap justify-center gap-6 text-[#EFE6DD]/80">
            <Link href="/#home" className="hover:text-white transition-colors">Home</Link>
            <Link href="/#shop" className="hover:text-white transition-colors">Shop</Link>
            <Link href="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link>
            <Link href="/blogs" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link>
            <Link href="/#about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/#contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="h-[0.5px] w-full bg-[#3D1418]" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#EFE6DD]/70">
            <p>© 2026 SAKHI BY MAYA&apos;S. ALL RIGHTS RESERVED.</p>
            <p className="opacity-75">TRADITION WOVEN WITH LOVE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
