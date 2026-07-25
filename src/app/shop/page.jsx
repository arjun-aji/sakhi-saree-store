import React, { Suspense } from 'react';
import AnnouncementBar from '../../components/AnnouncementBar';
import Navbar from '../../components/Navbar';
import Shop from '../../components/Shop';

export const metadata = {
  title: "Shop Handcrafted Sarees | Sakhi By Maya's",
  description:
    "Explore our exquisite collection of handcrafted Kanjivaram, Banarasi, Organza, Chanderi, and Tussar silk sarees.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7EFE8]">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-[#F7EFE8]/95 backdrop-blur-md border-b border-[#E2D4C5]/50">
        <Navbar />
      </div>

      {/* Main Shop Content Area */}
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="w-full py-24 text-center">
              <p className="font-serif-luxury text-xl text-[#3D1418] animate-pulse">
                Loading Sakhi Collection...
              </p>
            </div>
          }
        >
          <Shop />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#2A0E11] text-[#EFE6DD] py-6 px-4 text-center text-xs tracking-wider uppercase border-t border-[#3D1418]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SAKHI BY MAYA'S. ALL RIGHTS RESERVED.</p>
          <p className="text-[11px] opacity-75">TRADITION WOVEN WITH LOVE</p>
        </div>
      </footer>
    </div>
  );
}
