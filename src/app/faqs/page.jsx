'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Search } from 'lucide-react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';

export default function FAQsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const res = await fetch('/api/faqs');
        const data = await res.json();
        if (data.success && Array.isArray(data.faqs)) {
          setFaqs(data.faqs);
        }
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFAQs();
  }, []);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFF0]">
      {/* Announcement & Navbar */}
      <AnnouncementBar />
      <div className="sticky top-0 z-50 bg-[#FFFFF0]/95 backdrop-blur-md border-b border-[#E5D9C8]/50">
        <Navbar />
      </div>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#6A2B15] leading-tight">
              Frequently Asked Questions
            </h1>
            <div className="flex items-center justify-center gap-3 my-2">
              <span className="h-[0.75px] w-12 sm:w-16 bg-[#C59B27]/40" />
              <span className="text-[#C59B27] text-[10px]">✦</span>
              <span className="h-[0.75px] w-12 sm:w-16 bg-[#C59B27]/40" />
            </div>
            <p className="font-serif-luxury text-xs sm:text-base text-[#5A4438] italic">
              Find answers to queries about shipping, styling, customization, and orders.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F3EADF]/60 border border-[#DCD0C5] rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#6A2B15] placeholder-[#8A786D] focus:outline-none focus:border-[#B84D28] transition-colors"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8A786D]" />
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="font-serif-luxury text-lg text-[#8C3B1F] animate-pulse">Loading FAQs...</p>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-[#F3EADF]/60 rounded-xl border border-[#E5DACD] max-w-md mx-auto">
              <HelpCircle className="w-8 h-8 mx-auto text-[#B84D28] mb-2" />
              <h3 className="font-serif-luxury text-base font-medium text-[#6A2B15]">No Answers Found</h3>
              <p className="text-xs text-[#5A4438] mt-1">Try another search or contact our support team.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={faq._id}
                    className="border border-[#E5DACD] rounded-lg overflow-hidden bg-[#F3EADF]/30 hover:bg-[#F3EADF]/50 transition-colors"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left p-4 sm:p-5 font-serif-luxury text-sm sm:text-base font-medium text-[#6A2B15] hover:text-[#B84D28] transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#B84D28]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#8A786D]" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-[#4E3F3B] leading-relaxed border-t border-[#E5DACD]/30 pt-3 bg-white/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Need help footer */}
          <div className="text-center bg-[#F3EADF]/50 border border-[#E5DACD]/60 rounded-xl p-6 space-y-2.5 max-w-xl mx-auto mt-6">
            <MessageSquare className="w-6 h-6 mx-auto text-[#B84D28]" />
            <h3 className="font-serif-luxury text-sm sm:text-base font-semibold text-[#6A2B15]">Still have questions?</h3>
            <p className="text-xs text-[#5A4438] max-w-md mx-auto">
              Our support team is available 24/7. Chat with us on WhatsApp or send us an email.
            </p>
            <div className="pt-1.5">
              <a
                href="https://wa.me/919746598789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#1E5631] hover:bg-[#153e22] text-white text-xs font-bold tracking-widest uppercase px-6 py-2.5 rounded-sm transition-all shadow-xs"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#6A2B15] text-[#FAF7EC] py-6 px-4 text-center text-xs tracking-wider uppercase border-t border-[#8C3B1F] mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SAKHI BY MAYA&apos;S. ALL RIGHTS RESERVED.</p>
          <p className="text-[11px] opacity-75">TRADITION WOVEN WITH LOVE</p>
        </div>
      </footer>
    </div>
  );
}
