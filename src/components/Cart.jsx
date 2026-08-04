'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Trash2,
  Gift,
  ShieldCheck,
  Package,
  Award,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Truck,
  RotateCcw,
  Check,
  Lock,
  ShoppingCart,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products as localProducts } from '@/data/products';

/* ── Delicate Floral Branch Vector Artwork for Cart Hero ── */
function FloralArtworkRight() {
  return (
    <svg className="w-28 h-28 sm:w-40 sm:h-40 text-[#C59B27]/25 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M10 90 Q 30 70, 40 40 Q 50 20, 80 10" />
      <path d="M40 40 Q 60 50, 75 45" />
      <circle cx="80" cy="10" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="75" cy="45" r="2.5" fill="currentColor" opacity="0.4" />
      <path d="M30 70 Q 20 50, 15 40" />
      <circle cx="15" cy="40" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

const FREE_SHIPPING_THRESHOLD = 1499;

export default function Cart() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, addToCart, toggleWishlist, wishlistItems } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(600); // Default WELCOME10 coupon active
  const [appliedCoupon, setAppliedCoupon] = useState('WELCOME10');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('WELCOME10 applied (-₹600)');
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [addedRecId, setAddedRecId] = useState(null);

  const handleProceedToCheckout = (e) => {
    e.preventDefault();
    const session = localStorage.getItem('sakhi_user_session');
    if (session) {
      router.push('/checkout');
    } else {
      router.push('/profile?redirect=/checkout');
    }
  };

  const getWhatsAppCartUrl = () => {
    const itemsText = cartItems
      .map((item) => `- ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
      .join('\n');
    const text = `Hi! I would like to order the following sarees from Sakhi:\n\n${itemsText}\n\nSubtotal: ₹${subtotal.toLocaleString('en-IN')}\nDiscount: ₹${effectiveDiscount.toLocaleString('en-IN')}\nTotal: ₹${finalTotal.toLocaleString('en-IN')}\n\nPlease help me process my order.`;
    return `https://wa.me/919746598789?text=${encodeURIComponent(text)}`;
  };

  /* ── Product State & Loading for recommendations ── */
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          const normalized = data.products.map((p) => ({
            ...p,
            id: p._id,
          }));
          setProductsList(normalized);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching products for cart page, falling back to local data:', err);
      }

      // Fallback to static products
      setProductsList(localProducts);
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  /* ── Calculations ── */
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const effectiveDiscount = subtotal > 0 ? Math.min(discount, subtotal) : 0;
  const finalTotal = Math.max(0, subtotal - effectiveDiscount);

  // Free shipping progress calculations
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  /* ── Coupon Handler ── */
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME10' || code === 'SAKHI10') {
      const disc = Math.round(subtotal * 0.1) || 600;
      setDiscount(disc);
      setAppliedCoupon(code);
      setCouponSuccess(`Coupon ${code} applied successfully!`);
    } else if (code === 'SAKHI500') {
      setDiscount(500);
      setAppliedCoupon(code);
      setCouponSuccess('Coupon SAKHI500 applied (-₹500)!');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or SAKHI500.');
    }
  };

  /* Filter out products currently in cart for recommendation strip */
  const recommendations = useMemo(() => {
    const currentCartIds = cartItems.map((item) => item.id);
    return productsList.filter((p) => !currentCartIds.includes(p.id)).slice(0, 8);
  }, [productsList, cartItems]);

  const handlePrevRec = () => {
    setRecommendationIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNextRec = () => {
    setRecommendationIndex((prev) => (prev < recommendations.length - 4 ? prev + 1 : prev));
  };

  const handleAddRecommendation = (recProduct) => {
    addToCart(recProduct);
    setAddedRecId(recProduct.id);
    setTimeout(() => setAddedRecId(null), 1500);
  };

  return (
    <div className="w-full bg-[#F7EFE8] pb-20 lg:pb-12">
      {/* ================================================================ */}
      {/* 1. HERO SECTION WITH BREADCRUMB & FLORAL ARTWORK                */}
      {/* ================================================================ */}
      <section className="relative w-full bg-[#F7EFE8] pt-4 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-8 overflow-hidden">
        {/* Top-Right Background Floral Artwork */}
        <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-70">
          <FloralArtworkRight />
        </div>

        <div className="max-w-7xl mx-auto space-y-2 relative z-10 text-center">
          {/* Breadcrumb */}
          <nav className="flex justify-center items-center gap-2 text-[11px] sm:text-xs text-[#8A786D] mb-2 font-medium">
            <Link href="/" className="hover:text-[#3D1418] transition-colors">
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-[#3D1418] font-semibold">Cart</span>
          </nav>

          {/* Main Serif Title */}
          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-[50px] font-normal text-[#2A0E11] leading-tight tracking-tight">
            Shopping Cart
          </h1>

          {/* Gold Line Divider with Diamond Dot */}
          <div className="flex items-center justify-center gap-3 my-2">
            <span className="h-[0.75px] w-12 sm:w-16 bg-[#C59B27]/40" />
            <span className="text-[#C59B27] text-[10px]">✦</span>
            <span className="h-[0.75px] w-12 sm:w-16 bg-[#C59B27]/40" />
          </div>

          {/* Subtitle */}
          <p className="font-serif-luxury text-xs sm:text-base text-[#5A4438] italic font-normal">
            Review your handpicked sarees before checkout.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. MAIN LAYOUT: LEFT ITEMS & SUMMARY RIGHT                      */}
      {/* ================================================================ */}
      <section className="w-full px-3 sm:px-6 lg:px-8 pt-2">
        <div className="max-w-7xl mx-auto">
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: CART ITEMS + PROGRESS BAR + RECOMMENDATIONS */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-5">
                
                {/* ── Cart Items List ── */}
                <div className="space-y-3.5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#F7EFE8] border border-[#E5DACD] rounded-xl p-3 sm:p-5 flex flex-row items-center gap-3 sm:gap-5 shadow-2xs hover:border-[#C59B27]/50 transition-all"
                    >
                      {/* Saree Thumbnail Image */}
                      <div className="relative w-20 h-24 sm:w-28 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-[#EFE6DD]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 640px) 80px, 112px"
                        />
                      </div>

                      {/* Item Info Middle */}
                      <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif-luxury text-sm sm:text-lg font-medium text-[#2A0E11] leading-tight truncate">
                            {item.name}
                          </h3>

                          {/* Wishlist Heart Icon (Top Right on Item) */}
                          <button
                            type="button"
                            onClick={() => toggleWishlist(item.id)}
                            aria-label="Add to Wishlist"
                            className="p-1 text-[#3D1418] hover:text-[#8B2635] transition-colors flex-shrink-0"
                          >
                            <Heart
                              className={`w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.75] ${
                                wishlistItems.includes(item.id) || item.wishlisted
                                  ? 'fill-[#8B2635] text-[#8B2635]'
                                  : 'text-[#3D1418]'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Fabric & Color Sub-details */}
                        <p className="text-[11px] sm:text-xs text-[#8A786D] font-normal">
                          Fabric: {item.fabric} &nbsp;•&nbsp; Color: {item.color}
                        </p>

                        {/* Price Unit */}
                        <p className="font-serif-luxury text-sm sm:text-base font-bold text-[#2A0E11]">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>

                        {/* Quantity Controller + Remove Button Row */}
                        <div className="flex items-center justify-between pt-1 sm:pt-2">
                          {/* Quantity Controller Pill [ - 1 + ] */}
                          {/* Reducing from 1 to 0 automatically removes the product via updateQuantity(id, -1) */}
                          <div className="inline-flex items-center border border-[#DCD0C5] rounded-md bg-[#F7EFE8] px-2 py-0.5 sm:py-1 text-xs font-semibold text-[#3D1418]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-1.5 py-0.5 hover:text-[#8B2635] transition-colors font-bold text-sm"
                              title={item.quantity === 1 ? 'Remove product from cart' : 'Decrease quantity'}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="px-3 text-xs font-bold text-[#2A0E11]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-1.5 py-0.5 hover:text-[#8B2635] transition-colors font-bold text-sm"
                              title="Increase quantity"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {/* Explicit Remove Button (Trash Icon + Text) */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-[#8B2635] hover:text-[#5B1D23] font-medium transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Total Item Price (Far Right on Desktop) */}
                      <div className="hidden sm:block text-right flex-shrink-0 pl-2">
                        <span className="font-serif-luxury text-base sm:text-lg font-bold text-[#2A0E11]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Free Shipping Progress Bar Card ── */}
                <div className="bg-[#F3EADF] border border-[#E5DACD] rounded-xl p-4 sm:p-5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2A0E11]">
                    <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-[#C59B27] flex-shrink-0" />
                    <span>
                      {amountNeededForFreeShipping > 0
                        ? `Add ₹${amountNeededForFreeShipping.toLocaleString('en-IN')} more to get free shipping!`
                        : '🎉 Congratulations! You have unlocked Free Shipping!'}
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-[#E5DACD] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#3D1418] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Range Labels */}
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#8A786D] font-medium">
                    <span>₹0</span>
                    <span>₹1,499</span>
                  </div>
                </div>

                {/* ── "YOU MAY ALSO LIKE" Recommendations Section ── */}
                {recommendations.length > 0 && (
                  <div className="bg-[#F7EFE8] border border-[#E5DACD] rounded-xl p-4 sm:p-6 space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#2A0E11]">
                        YOU MAY ALSO LIKE
                      </h3>
                      <div className="flex items-center gap-3">
                        <Link
                          href="/shop"
                          className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8B2635] hover:underline"
                        >
                          VIEW ALL
                        </Link>
                        <div className="hidden sm:flex items-center gap-1">
                          <button
                            type="button"
                            onClick={handlePrevRec}
                            disabled={recommendationIndex === 0}
                            className="p-1 rounded-full border border-[#DCD0C5] hover:border-[#3D1418] text-[#3D1418] disabled:opacity-30 transition-all"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleNextRec}
                            disabled={recommendationIndex >= recommendations.length - 4}
                            className="p-1 rounded-full border border-[#DCD0C5] hover:border-[#3D1418] text-[#3D1418] disabled:opacity-30 transition-all"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                      {isLoading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="bg-[#F3EADF]/80 border border-[#E5DACD] rounded-lg p-2 flex flex-col justify-between animate-pulse"
                          >
                            <div className="relative aspect-[4/3] w-full bg-[#EFE6DD] mb-1.5 rounded-md" />
                            <div className="h-3 bg-[#EFE6DD] w-3/4 mb-1.5 rounded-xs" />
                            <div className="flex items-center justify-between mt-1">
                              <div className="h-4 bg-[#EFE6DD] w-1/3 rounded-xs" />
                              <div className="h-6 bg-[#EFE6DD] w-1/3 rounded-sm" />
                            </div>
                          </div>
                        ))
                      ) : (
                        recommendations.slice(recommendationIndex, recommendationIndex + 4).map((rec) => (
                          <div
                            key={rec.id}
                            className="bg-[#F3EADF]/80 hover:bg-[#F3EADF] border border-[#E5DACD] rounded-lg p-2 flex flex-col justify-between transition-all group"
                          >
                            <div>
                              <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden bg-[#EFE6DD] mb-1.5">
                                <Image
                                  src={rec.image}
                                  alt={rec.name}
                                  fill
                                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => toggleWishlist(rec.id)}
                                  aria-label="Toggle Wishlist"
                                  className="absolute top-1.5 right-1.5 p-1 bg-[#F7EFE8]/80 rounded-full text-[#3D1418] hover:text-[#8B2635]"
                                >
                                  <Heart
                                    className={`w-3 h-3 stroke-[1.75] ${
                                      wishlistItems.includes(rec.id) ? 'fill-[#8B2635] text-[#8B2635]' : 'text-[#3D1418]'
                                    }`}
                                  />
                                </button>
                              </div>
                              <h4 className="font-serif-luxury text-[11px] sm:text-xs font-medium text-[#2A0E11] line-clamp-1 group-hover:text-[#8B2635] transition-colors">
                                {rec.name}
                              </h4>
                            </div>

                            <div className="mt-1 flex items-center justify-between">
                              <p className="font-serif-luxury text-xs sm:text-sm font-bold text-[#2A0E11]">
                                ₹{rec.price.toLocaleString('en-IN')}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleAddRecommendation(rec)}
                                className="inline-flex items-center gap-1 bg-[#2A0E11] text-[#F7EFE8] text-[9px] uppercase font-bold px-2 py-1 rounded hover:bg-[#3D1418] transition-colors"
                              >
                                {addedRecId === rec.id ? (
                                  <Check className="w-3 h-3 text-white" />
                                ) : (
                                  <>
                                    <span>ADD</span>
                                    <ShoppingCart className="w-2.5 h-2.5" />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: ORDER SUMMARY CARD (Sticky Desktop) */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
                <div className="bg-[#F7EFE8] border border-[#E5DACD] rounded-xl p-4 sm:p-6 space-y-5 shadow-2xs">
                  
                  {/* Title */}
                  <div className="pb-3 border-b border-[#E5DACD]">
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#2A0E11]">
                      ORDER SUMMARY
                    </h2>
                  </div>

                  {/* Summary Breakdown List */}
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between text-[#5A4438]">
                      <span>Subtotal ({totalItemsCount} Items)</span>
                      <span className="font-serif-luxury font-bold text-[#2A0E11]">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-[#8B2635] font-medium">
                        <span>Discount ({appliedCoupon})</span>
                        <span>- ₹{effectiveDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#5A4438]">
                      <span>Shipping</span>
                      <span className="text-[#1E5631] font-bold uppercase">FREE</span>
                    </div>

                    <div className="pt-3 border-t border-[#E5DACD] flex justify-between items-baseline">
                      <span className="font-serif-luxury text-base font-bold text-[#2A0E11]">
                        Total
                      </span>
                      <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2A0E11]">
                        ₹{finalTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Coupon Input Form */}
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 bg-[#F7EFE8] border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] placeholder-[#8A786D] focus:outline-none focus:border-[#3D1418]"
                      />
                      <button
                        type="submit"
                        className="bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-md transition-colors"
                      >
                        APPLY
                      </button>
                    </div>

                    {couponSuccess && (
                      <p className="text-[11px] text-[#1E5631] font-medium pt-0.5">
                        ✓ {couponSuccess}
                      </p>
                    )}
                    {couponError && (
                      <p className="text-[11px] text-[#8B2635] font-medium pt-0.5">
                        {couponError}
                      </p>
                    )}
                  </form>

                  {/* Trust Badges */}
                  <div className="pt-3 border-t border-[#E5DACD]/80 grid grid-cols-3 gap-1 text-center divide-x divide-[#E5DACD]/60 items-center">
                    <div className="flex flex-col items-center p-1 space-y-1">
                      <ShieldCheck className="w-4 h-4 text-[#8B2635]" />
                      <span className="text-[9.5px] font-semibold text-[#3D1418]">
                        Secure Payment
                      </span>
                    </div>

                    <div className="flex flex-col items-center p-1 space-y-1">
                      <Package className="w-4 h-4 text-[#8B2635]" />
                      <span className="text-[9.5px] font-semibold text-[#3D1418]">
                        Easy Returns
                      </span>
                    </div>

                    <div className="flex flex-col items-center p-1 space-y-1">
                      <Award className="w-4 h-4 text-[#8B2635]" />
                      <span className="text-[9.5px] font-semibold text-[#3D1418]">
                        Quality Assured
                      </span>
                    </div>
                  </div>

                  {/* Desktop Checkout Button */}
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={handleProceedToCheckout}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] text-xs font-bold tracking-[0.2em] uppercase py-3.5 rounded-md transition-colors shadow-sm group"
                    >
                      <span>PROCEED TO CHECKOUT</span>
                      <ArrowRight className="w-4 h-4 text-[#F7EFE8] group-hover:translate-x-1 transition-transform" />
                    </button>

                    <a
                      href={getWhatsAppCartUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#1E5631] hover:bg-[#153e22] text-white text-xs font-bold tracking-[0.2em] uppercase py-3.5 rounded-md transition-colors shadow-sm cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                      <span>ORDER VIA WHATSAPP</span>
                    </a>

                    <div className="flex items-center justify-center gap-1.5 pt-2 text-[10.5px] text-[#8A786D] font-medium">
                      <Lock className="w-3 h-3 text-[#1E5631]" />
                      <span>100% Secure Checkout</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          ) : (
            /* Empty Cart View */
            <div className="text-center py-16 bg-[#F3EADF]/60 rounded-2xl border border-[#E5DACD] max-w-2xl mx-auto my-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F7EFE8] border border-[#C59B27]/40 flex items-center justify-center mx-auto text-[#8B2635]">
                <RotateCcw className="w-8 h-8" />
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#2A0E11]">
                Your Shopping Cart is Empty
              </h2>
              <p className="text-xs sm:text-sm text-[#5A4438]">
                Explore our exquisite saree collections and add your favorite pieces.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-md shadow-xs transition-colors"
                >
                  <span>EXPLORE SAREES</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. STICKY BOTTOM CHECKOUT BAR FOR MOBILE                         */}
      {/* ================================================================ */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F7EFE8] border-t border-[#E5DACD] p-3 shadow-2xl block lg:hidden">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase text-[#8A786D] font-medium block">Total</span>
              <span className="font-serif-luxury text-xl font-bold text-[#2A0E11]">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="flex-1 inline-flex items-center justify-center gap-1 bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] text-[10px] font-bold tracking-wider uppercase py-2.5 rounded-md transition-colors shadow-xs"
            >
              <span>CHECKOUT</span>
            </button>

            <a
              href={getWhatsAppCartUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#1E5631] hover:bg-[#153e22] text-white text-[10px] font-bold tracking-wider uppercase py-2.5 rounded-md transition-colors shadow-xs cursor-pointer text-center"
            >
              <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span>WHATSAPP</span>
            </a>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 4. BOTTOM 4-FEATURE STRIP                                       */}
      {/* ================================================================ */}
      <section className="w-full bg-[#F3EADF] border-t border-[#E5DACD] py-6 px-3 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center items-center">
            <div className="flex flex-col items-center p-2 space-y-1">
              <Truck className="w-5 h-5 text-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A0E11]">
                FREE SHIPPING
              </span>
              <span className="text-[9.5px] text-[#5A4438]">On orders above ₹1499</span>
            </div>

            <div className="flex flex-col items-center p-2 space-y-1">
              <Package className="w-5 h-5 text-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A0E11]">
                SECURE PACKAGING
              </span>
              <span className="text-[9.5px] text-[#5A4438]">Safe & premium packaging</span>
            </div>

            <div className="flex flex-col items-center p-2 space-y-1">
              <RotateCcw className="w-5 h-5 text-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A0E11]">
                EASY RETURNS
              </span>
              <span className="text-[9.5px] text-[#5A4438]">Hassle-free returns</span>
            </div>

            <div className="flex flex-col items-center p-2 space-y-1">
              <Award className="w-5 h-5 text-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A0E11]">
                100% QUALITY ASSURED
              </span>
              <span className="text-[9.5px] text-[#5A4438]">Premium quality sarees</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
