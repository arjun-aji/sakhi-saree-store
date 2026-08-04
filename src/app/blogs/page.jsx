'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Calendar, User, ArrowLeft, BookOpen, Clock } from 'lucide-react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (data.success && Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        }
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EFE8]">
      {/* Announcement & Navbar */}
      <AnnouncementBar />
      <div className="sticky top-0 z-50 bg-[#F7EFE8]/95 backdrop-blur-md border-b border-[#E2D4C5]/50">
        <Navbar />
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {selectedBlog ? (
          /* BLOG DETAIL VIEW */
          <article className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            <button
              onClick={() => setSelectedBlog(null)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B2635] hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </button>

            {selectedBlog.image && (
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#E2D4C5]">
                <Image
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-3">
              <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#2A0E11] font-medium leading-tight">
                {selectedBlog.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-[#8A786D] border-b border-[#E2D4C5]/50 pb-4">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {selectedBlog.author || 'Sakhi Editor'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedBlog.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Content body */}
            <div className="text-[#4E3F3B] leading-relaxed text-sm sm:text-base space-y-4 font-serif-luxury whitespace-pre-wrap">
              {selectedBlog.content}
            </div>
          </article>
        ) : (
          /* BLOG LIST VIEW */
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <h1 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#2A0E11] leading-tight">
                The Sakhi Chronicle
              </h1>
              <div className="flex items-center justify-center gap-3 my-2">
                <span className="h-[0.75px] w-12 sm:w-16 bg-[#C59B27]/40" />
                <span className="text-[#C59B27] text-[10px]">✦</span>
                <span className="h-[0.75px] w-12 sm:w-16 bg-[#C59B27]/40" />
              </div>
              <p className="font-serif-luxury text-xs sm:text-base text-[#5A4438] italic">
                Articles on saree styling, traditions, and handloom heritage.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <p className="font-serif-luxury text-lg text-[#3D1418] animate-pulse">Loading Chronicles...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20 bg-[#F3EADF]/60 rounded-xl border border-[#E5DACD] max-w-xl mx-auto">
                <BookOpen className="w-8 h-8 mx-auto text-[#8B2635] mb-2" />
                <h3 className="font-serif-luxury text-lg font-medium text-[#2A0E11]">No Articles Yet</h3>
                <p className="text-xs text-[#5A4438] mt-1">Check back soon for insights on luxury handlooms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="group bg-[#F3EADF]/40 border border-[#E5DACD] rounded-xl overflow-hidden hover:border-[#C59B27]/60 hover:bg-[#F3EADF]/65 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {blog.image && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EFE6DD]">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center gap-3 text-[10px] text-[#8A786D] font-semibold tracking-wider uppercase">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            5 Min Read
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                        <h3 className="font-serif-luxury text-base sm:text-lg font-semibold text-[#2A0E11] line-clamp-2 leading-snug group-hover:text-[#8B2635] transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-[#5A4438] line-clamp-3 leading-relaxed">
                          {blog.summary}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => setSelectedBlog(blog)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-[#8B2635] hover:text-[#2A0E11] transition-colors"
                      >
                        Read Full Article
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#2A0E11] text-[#EFE6DD] py-6 px-4 text-center text-xs tracking-wider uppercase border-t border-[#3D1418] mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SAKHI BY MAYA&apos;S. ALL RIGHTS RESERVED.</p>
          <p className="text-[11px] opacity-75">TRADITION WOVEN WITH LOVE</p>
        </div>
      </footer>
    </div>
  );
}
