'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin, Send, ShieldCheck, Heart, Sparkles, Clock } from 'lucide-react';

/* ── Decorative Lotus SVG Icon ── */
function LotusIcon({ className = 'w-4 h-4' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
        >
            <path d="M12 3C10.5 6 7 8 7 12C7 15 9.5 17.5 12 19C14.5 17.5 17 15 17 12C17 8 13.5 6 12 3Z" />
            <path d="M12 19C9 18 4 15 4 10C4 8 5 6 7 5" />
            <path d="M12 19C15 18 20 15 20 10C20 8 19 6 17 5" />
        </svg>
    );
}

/* ── Traditional Craft / Mandala SVG Icon ── */
function CraftIcon({ className = 'w-6 h-6' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
        >
            <rect x="4" y="4" width="16" height="16" rx="2" transform="rotate(45 12 12)" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
    );
}

/* ── Hands holding Lotus SVG Icon ── */
function LotusHandsIcon({ className = 'w-6 h-6' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
        >
            <path d="M12 4c-1.5 2.5-4 4-4 7s2.5 5 4 6c1.5-1 4-3 4-6s-2.5-4.5-4-7z" />
            <path d="M6 15c-1.5-1-3-3-3-5 0-2 1.5-3.5 3-4" />
            <path d="M18 15c1.5-1 3-3 3-5 0-2-1.5-3.5-3-4" />
            <path d="M4 19c3-1 6-2 8-2s5 1 8 2" />
        </svg>
    );
}

/* ── Diamond Divider ── */
function GoldDivider() {
    return (
        <div className="flex items-center justify-center gap-3 my-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#C59B27]/50" />
            <span className="text-[#C59B27] text-xs">✦</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#C59B27]/50" />
        </div>
    );
}

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const mailtoSubject = encodeURIComponent(formData.subject || 'New Contact Inquiry from Sakhi Store');
            const mailtoBody = encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'N/A'}\n\nMessage:\n${formData.message}`
            );
            const mailtoUrl = `mailto:jajithks01@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

            window.location.href = mailtoUrl;
        } catch (err) {
            console.error('Contact submission error:', err);
        } finally {
            setLoading(false);
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 6000);
        }
    };

    const promises = [
        {
            icon: LotusHandsIcon,
            title: 'Authentic & Handpicked',
            description:
                'Every saree is carefully selected for its authenticity, quality, and exceptional craftsmanship.',
        },
        {
            icon: CraftIcon,
            title: 'Craftsmanship First',
            description:
                'We work closely with skilled weavers and artisans to preserve trade and support livelihoods.',
        },
        {
            icon: ShieldCheck,
            title: 'Quality You Can Trust',
            description:
                'From fabric to finish, we ensure every detail meets our promise of premium quality.',
        },
        {
            icon: Heart,
            title: 'Made with Love',
            description:
                'More than just sarees, we deliver emotion, elegance, and a piece of our heart with every order.',
        },
    ];

    return (
        <div className="w-full bg-[#F7EFE8]">
            {/* ========================================================= */}
            {/* SECTION 1: OUR PROMISE (Starts from Promises)             */}
            {/* ========================================================= */}
            <section id="promises" className="w-full py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E2D4C5]">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center gap-2 text-[#3D1418] uppercase tracking-[0.25em] text-xs font-bold mb-2">
                            <LotusIcon className="w-4 h-4 text-[#8B2635]" />
                            <span>Our Promise</span>
                            <LotusIcon className="w-4 h-4 text-[#8B2635]" />
                        </div>
                    </div>

                    {/* 4 Cards Grid in a Light Beige Container */}
                    <div className="bg-[#EFE6DD]/70 rounded-2xl p-6 sm:p-8 border border-[#E2D4C5] shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E2D4C5]/60">
                            {promises.map((item, idx) => {
                                const IconComp = item.icon;
                                return (
                                    <div
                                        key={idx}
                                        className={`flex flex-col items-center text-center space-y-3 ${idx !== 0 ? 'pt-6 md:pt-0 md:pl-6 lg:pl-6' : ''
                                            }`}
                                    >
                                        <div className="w-14 h-14 rounded-full bg-[#F7EFE8] border border-[#C59B27]/40 flex items-center justify-center text-[#8B2635] shadow-xs hover:scale-105 transition-transform duration-300">
                                            <IconComp className="w-7 h-7 stroke-[1.5]" />
                                        </div>
                                        <h3 className="font-serif-luxury text-xl font-medium text-[#2A0E11] tracking-wide">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-[#4A3B32] leading-relaxed font-normal max-w-xs">
                                            {item.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 2: CONTACT US                                     */}
            {/* ========================================================= */}
            <section id="contact" className="w-full py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#F7EFE8]">
                {/* Background Subtle Gradient Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#8B2635]/5 via-transparent to-transparent" />

                <div className="max-w-7xl mx-auto relative z-10">

                    {/* Section Header */}
                    <div className="text-left mb-8">
                        <div className="inline-flex items-center gap-2 text-[#3D1418] uppercase tracking-[0.25em] text-xs font-bold mb-1">
                            <span>Contact Us</span>
                            <LotusIcon className="w-3.5 h-3.5 text-[#8B2635]" />
                        </div>
                        <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#2A0E11] tracking-tight">
                            We&apos;d Love to Hear from You!
                        </h2>
                        <GoldDivider />
                        <p className="text-xs sm:text-sm text-[#4A3B32] leading-relaxed max-w-md">
                            Have a question, need styling advice, or just want to say hello? We&apos;re here for you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                        {/* Left Column: Contact Info Cards */}
                        <div className="lg:col-span-5 space-y-6">

                            {/* Phone */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#EFE6DD]/50 border border-[#E2D4C5]/70 hover:border-[#8B2635]/40 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[#F7EFE8] border border-[#C59B27]/40 flex items-center justify-center text-[#3D1418] flex-shrink-0">
                                    <Phone className="w-4 h-4 text-[#8B2635]" />
                                </div>
                                <div>
                                    <h4 className="font-serif-luxury text-base font-semibold text-[#2A0E11] tracking-wide">
                                        Phone
                                    </h4>
                                    <a
                                        href="tel:+918086123456"
                                        className="text-xs sm:text-sm text-[#4A3B32] hover:text-[#8B2635] transition-colors"
                                    >
                                        +91 8086 123 456
                                    </a>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#EFE6DD]/50 border border-[#E2D4C5]/70 hover:border-[#8B2635]/40 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[#F7EFE8] border border-[#C59B27]/40 flex items-center justify-center text-[#3D1418] flex-shrink-0">
                                    <Mail className="w-4 h-4 text-[#8B2635]" />
                                </div>
                                <div>
                                    <h4 className="font-serif-luxury text-base font-semibold text-[#2A0E11] tracking-wide">
                                        Email
                                    </h4>
                                    <a
                                        href="mailto:jajithks01@gmail.com"
                                        className="text-xs sm:text-sm text-[#4A3B32] hover:text-[#8B2635] transition-colors font-medium"
                                    >
                                        jajithks01@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#EFE6DD]/50 border border-[#E2D4C5]/70 hover:border-[#8B2635]/40 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[#F7EFE8] border border-[#C59B27]/40 flex items-center justify-center text-[#3D1418] flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-[#8B2635]" />
                                </div>
                                <div>
                                    <h4 className="font-serif-luxury text-base font-semibold text-[#2A0E11] tracking-wide">
                                        Address
                                    </h4>
                                    <p className="text-xs sm:text-sm text-[#4A3B32] leading-relaxed">
                                        Sakhi By Maya&apos;s
                                        <br />
                                        Kochi, Kerala, India - 682001
                                    </p>
                                </div>
                            </div>

                            {/* Mobile only: Personalized Styling Note */}
                            <div className="lg:hidden p-5 rounded-2xl bg-gradient-to-br from-[#3D1418] to-[#2A0E11] text-[#F7EFE8] relative overflow-hidden shadow-md">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C59B27]/10 rounded-full blur-2xl pointer-events-none" />
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-[#C59B27]" />
                                    <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#C59B27]">
                                        Personalized Styling Assistance
                                    </span>
                                </div>
                                <p className="text-xs text-[#EFE6DD]/90 leading-relaxed">
                                    Looking for custom saree consultations or bridal styling? Drop us a message or call us directly.
                                </p>
                            </div>

                            {/* Desktop only: Follow Us + Response Time */}
                            <div className="hidden lg:block space-y-5 pt-1">
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#3D1418] mb-3">Follow Us</p>
                                    <div className="flex items-center gap-3">
                                        <a
                                            href="https://instagram.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Instagram"
                                            className="w-10 h-10 rounded-full bg-[#F7EFE8] border border-[#E2D4C5] flex items-center justify-center text-[#3D1418] hover:border-[#8B2635] hover:text-[#8B2635] transition-all duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                                            </svg>
                                        </a>
                                        <a
                                            href="https://facebook.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Facebook"
                                            className="w-10 h-10 rounded-full bg-[#F7EFE8] border border-[#E2D4C5] flex items-center justify-center text-[#3D1418] hover:border-[#8B2635] hover:text-[#8B2635] transition-all duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </a>
                                        {/* Pinterest */}
                                        <a
                                            href="https://pinterest.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Pinterest"
                                            className="w-10 h-10 rounded-full bg-[#F7EFE8] border border-[#E2D4C5] flex items-center justify-center text-[#3D1418] hover:border-[#8B2635] hover:text-[#8B2635] transition-all duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                                            </svg>
                                        </a>
                                        {/* WhatsApp */}
                                        <a
                                            href="https://wa.me/918086123456"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="WhatsApp"
                                            className="w-10 h-10 rounded-full bg-[#F7EFE8] border border-[#E2D4C5] flex items-center justify-center text-[#3D1418] hover:border-[#8B2635] hover:text-[#8B2635] transition-all duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-[#4A3B32]">
                                    <div className="w-9 h-9 rounded-full bg-[#F7EFE8] border border-[#C59B27]/40 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-4 h-4 text-[#8B2635]" />
                                    </div>
                                    <p className="text-xs leading-relaxed">We usually respond within <span className="font-semibold text-[#2A0E11]">24 hours</span>.</p>
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Contact Form & Traditional Brass Vessel / Flowers Image */}
                        <div className="lg:col-span-7 relative">
                            <div className="bg-[#EFE6DD]/60 rounded-2xl p-6 sm:p-8 border border-[#E2D4C5] shadow-sm relative z-10">

                                {submitted ? (
                                    <div className="bg-[#3D1418] text-[#F7EFE8] rounded-xl p-6 text-center space-y-3 animate-in fade-in duration-300">
                                        <div className="w-12 h-12 rounded-full bg-[#C59B27]/20 border border-[#C59B27] flex items-center justify-center mx-auto text-[#C59B27]">
                                            ✓
                                        </div>
                                        <h3 className="font-serif-luxury text-2xl">Thank You!</h3>
                                        <p className="text-xs text-[#EFE6DD]">
                                            Your message has been received and opening in your mail app for <span className="text-[#C59B27] font-semibold">jajithks01@gmail.com</span>. We will get back to you shortly!
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Row 1: Name & Email */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Your Name"
                                                    className="w-full bg-[#F7EFE8] border border-[#E2D4C5] rounded-md px-4 py-2.5 text-xs sm:text-sm text-[#2A0E11] placeholder-[#8C7A70] focus:outline-none focus:border-[#8B2635] transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Your Email"
                                                    className="w-full bg-[#F7EFE8] border border-[#E2D4C5] rounded-md px-4 py-2.5 text-xs sm:text-sm text-[#2A0E11] placeholder-[#8C7A70] focus:outline-none focus:border-[#8B2635] transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone Number */}
                                        <div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Phone Number"
                                                className="w-full bg-[#F7EFE8] border border-[#E2D4C5] rounded-md px-4 py-2.5 text-xs sm:text-sm text-[#2A0E11] placeholder-[#8C7A70] focus:outline-none focus:border-[#8B2635] transition-colors"
                                            />
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <input
                                                type="text"
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Subject"
                                                className="w-full bg-[#F7EFE8] border border-[#E2D4C5] rounded-md px-4 py-2.5 text-xs sm:text-sm text-[#2A0E11] placeholder-[#8C7A70] focus:outline-none focus:border-[#8B2635] transition-colors"
                                            />
                                        </div>

                                        {/* Your Message */}
                                        <div>
                                            <textarea
                                                name="message"
                                                rows="4"
                                                required
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Your Message"
                                                className="w-full bg-[#F7EFE8] border border-[#E2D4C5] rounded-md px-4 py-2.5 text-xs sm:text-sm text-[#2A0E11] placeholder-[#8C7A70] focus:outline-none focus:border-[#8B2635] transition-colors resize-none"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="inline-flex items-center justify-center gap-2 bg-[#3D1418] hover:bg-[#5B1D23] text-[#F7EFE8] text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-md shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                                            >
                                                <span>{loading ? 'Sending...' : 'SEND MESSAGE'}</span>
                                                <Send className="w-3.5 h-3.5 stroke-[2]" />
                                            </button>
                                        </div>
                                    </form>
                                )}

                            </div>

                            {/* Decorative Flowers & Brass Urli Vessel Image Accent matching reference 100% */}
                            <div className="hidden xl:block absolute -right-24 bottom-0 w-44 h-64 pointer-events-none opacity-90 z-0">
                                <Image
                                    src="/assets/about/contact_flowers.jpg"
                                    alt="Traditional Brass Vessel with Pink Flowers"
                                    fill
                                    className="object-contain object-bottom mix-blend-multiply opacity-90"
                                />
                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
