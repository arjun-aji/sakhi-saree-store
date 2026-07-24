import React from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7EFE8] relative">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Content Area with absolute Navbar overlay */}
      <div className="relative flex-grow flex flex-col">

        {/* Transparent Navbar overlayed directly on top of the Hero background */}
        <div className="absolute top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        {/* Hero Section */}
        <main className="w-full flex-grow">
          <Hero />
        </main>
      </div>

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
