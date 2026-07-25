import React from "react";
import AnnouncementBar from "../../components/AnnouncementBar";
import Navbar from "../../components/Navbar";
import About from "../../components/About";
import Contact from "../../components/Contact";

export const metadata = {
  title: "Contact Us | Sakhi By Maya's",
  description:
    "Get in touch with Sakhi By Maya's for inquiries, styling advice, and order assistance.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7EFE8]">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-[#F7EFE8]/95 backdrop-blur-md border-b border-[#E2D4C5]/50">
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
      <footer className="w-full bg-[#2A0E11] text-[#EFE6DD] py-6 px-4 text-center text-xs tracking-wider uppercase border-t border-[#3D1418]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SAKHI BY MAYA'S. ALL RIGHTS RESERVED.</p>
          <p className="text-[11px] opacity-75">TRADITION WOVEN WITH LOVE</p>
        </div>
      </footer>
    </div>
  );
}
