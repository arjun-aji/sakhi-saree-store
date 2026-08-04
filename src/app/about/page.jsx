import React from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Contact from "@/components/Contact";

export const metadata = {
  title: "About Us & Contact | Sakhi By Maya's",
  description:
    "Discover the story behind Sakhi By Maya's, our promise of handcrafted quality, and get in touch with us.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFF0]">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-[#FFFFF0]/95 backdrop-blur-md border-b border-[#E5D9C8]/50">
        <Navbar />
      </div>

      {/* Main Continuous Scrollable Content */}
      <main className="flex-grow">
        {/* About Section */}
        <About />

        {/* Contact Section (Starts from Promises) */}
        <Contact />
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
