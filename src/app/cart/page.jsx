import React, { Suspense } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';

export const metadata = {
  title: "Shopping Cart | Sakhi By Maya's",
  description:
    "Review your handpicked sarees, apply discount coupons, and proceed to secure checkout at Sakhi By Maya's.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFF0]">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-[#FFFFF0]/95 backdrop-blur-md border-b border-[#E5D9C8]/50">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="w-full py-24 text-center">
              <p className="font-serif-luxury text-xl text-[#8C3B1F] animate-pulse">
                Loading Shopping Cart...
              </p>
            </div>
          }
        >
          <Cart />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#6A2B15] text-[#FAF7EC] py-6 px-4 text-center text-xs tracking-wider uppercase border-t border-[#8C3B1F]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SAKHI BY MAYA'S. ALL RIGHTS RESERVED.</p>
          <p className="text-[11px] opacity-75">TRADITION WOVEN WITH LOVE</p>
        </div>
      </footer>
    </div>
  );
}
