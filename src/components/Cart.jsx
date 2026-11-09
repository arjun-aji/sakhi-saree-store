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
  Tag,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  X,
  MapPin,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { calculateShippingFee, DEFAULT_SHIPPING_RATES } from '@/lib/shipping';

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
  const [discount, setDiscount] = useState(0); 
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [addedRecId, setAddedRecId] = useState(null);
  const [dbCoupons, setDbCoupons] = useState([]);
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [showInlineCoupons, setShowInlineCoupons] = useState(false);
  const [shippingRates, setShippingRates] = useState(DEFAULT_SHIPPING_RATES);
  const [pincode, setPincode] = useState('');
  const [inputPincode, setInputPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState('');

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
        } else {
          setProductsList([]);
        }
      } catch (err) {
        console.error('Error fetching products for cart page:', err);
        setProductsList([]);
      } finally {
        setIsLoading(false);
      }
    }

    async function loadCoupons() {
      try {
        let customerEmail = '';
        try {
          const sess = localStorage.getItem('sakhi_user_session');
          if (sess) {
            const parsed = JSON.parse(sess);
            customerEmail = parsed.email || '';
          }
        } catch (err) {}

        const query = customerEmail 
          ? `?customerEmail=${encodeURIComponent(customerEmail)}` 
          : '?forCustomer=true';
        const res = await fetch(`/api/coupons${query}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.coupons)) {
          setDbCoupons(data.coupons);
        }
      } catch (err) {
        console.error('Error fetching coupons for cart page:', err);
      }
    }

    async function loadSettings() {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.settings?.shippingRates) {
          setShippingRates(data.settings.shippingRates);
        }
      } catch (err) {
        console.error('Error fetching shipping settings for cart:', err);
      }
    }

    // Try loading saved destination pincode
    try {
      const savedPin = localStorage.getItem('sakhi_shipping_pincode');
      if (savedPin) {
        setPincode(savedPin);
        setInputPincode(savedPin);
      } else {
        const sess = localStorage.getItem('sakhi_user_session');
        if (sess) {
          const parsed = JSON.parse(sess);
          if (parsed.pincode) {
            setPincode(parsed.pincode);
            setInputPincode(parsed.pincode);
          } else if (Array.isArray(parsed.savedAddresses) && parsed.savedAddresses[0]?.pincode) {
            setPincode(parsed.savedAddresses[0].pincode);
            setInputPincode(parsed.savedAddresses[0].pincode);
          }
        }
      }
    } catch (e) {}

    loadProducts();
    loadCoupons();
    loadSettings();
  }, []);

  /* ── Calculations ── */
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const effectiveDiscount = subtotal > 0 ? Math.min(discount, subtotal) : 0;

  // Dynamic Shipping Fee based on pincode and admin settings
  const shippingInfo = useMemo(() => {
    return calculateShippingFee(pincode, subtotal, shippingRates);
  }, [pincode, subtotal, shippingRates]);

  const shippingFee = shippingInfo.fee;
  const finalTotal = Math.max(0, subtotal - effectiveDiscount + shippingFee);

  // Sync shipping info to localStorage for seamless checkout handoff
  useEffect(() => {
    localStorage.setItem('sakhi_shipping_fee', String(shippingFee));
    if (pincode) {
      localStorage.setItem('sakhi_shipping_pincode', pincode);
    }
  }, [shippingFee, pincode]);

  const handleCheckPincode = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const clean = (inputPincode || '').trim().replace(/\D/g, '');
    if (clean.length !== 6) {
      setPincodeMessage('Please enter a valid 6-digit Indian postal pincode.');
      return;
    }
    setPincode(clean);
    localStorage.setItem('sakhi_shipping_pincode', clean);
    const info = calculateShippingFee(clean, subtotal, shippingRates);
    setPincodeMessage(`Rate for ${clean}: ${info.isFree ? 'FREE Delivery' : `₹${info.fee} (${info.region})`}`);
  };

  // Available coupons list (strictly active, valid, unexpired database coupons only)
  const availableCoupons = useMemo(() => {
    return (dbCoupons || []).filter(c => c && c.active !== false && !c.isExpired && !c.isUsed && c.canRedeem !== false);
  }, [dbCoupons]);

  // Free shipping progress calculations
  const freeThreshold = shippingRates.freeShippingThreshold > 0 ? shippingRates.freeShippingThreshold : 1499;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeThreshold - subtotal);

  /* ── Coupon Handler ── */
  const applySpecificCoupon = async (targetCode) => {
    const code = (targetCode || '').trim().toUpperCase();
    if (!code) return;
    setCouponError('');
    setCouponSuccess('');
    setCouponCode(code);

    let customerEmail = '';
    try {
      const sess = localStorage.getItem('sakhi_user_session');
      if (sess) {
        const parsed = JSON.parse(sess);
        customerEmail = parsed.email || '';
      }
    } catch (err) {}

    try {
      const res = await fetch('/api/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          customerEmail,
          subtotal
        })
      });
      const data = await res.json();
      if (data.success && data.valid) {
        const disc = data.discount;
        setDiscount(disc);
        setAppliedCoupon(code);
        localStorage.setItem('sakhi_coupon_code', code);
        localStorage.setItem('sakhi_coupon_discount', String(disc));
        setCouponSuccess(`Coupon ${code} applied (-₹${disc.toLocaleString('en-IN')})!`);
        setShowCouponsModal(false);
        return;
      } else {
        setCouponError(data.error || 'Invalid or ineligible coupon code.');
        return;
      }
    } catch (err) {
      console.warn('Coupon verification network error:', err);
      setCouponError('Network error verifying coupon code. Please try again.');
    }
  };

  const handleApplyCoupon = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    applySpecificCoupon(couponCode);
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon('');
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
    localStorage.removeItem('sakhi_coupon_code');
    localStorage.removeItem('sakhi_coupon_discount');
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
    <div className="w-full bg-[#FFFFF0] pb-20 lg:pb-12">
      {/* ================================================================ */}
      {/* 1. HERO SECTION WITH BREADCRUMB & FLORAL ARTWORK                */}
      {/* ================================================================ */}
      <section className="relative w-full bg-[#FFFFF0] pt-4 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-8 overflow-hidden">
        {/* Top-Right Background Floral Artwork */}
        <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-70">
          <FloralArtworkRight />
        </div>

        <div className="max-w-7xl mx-auto space-y-2 relative z-10 text-center">
          {/* Breadcrumb */}
          <nav className="flex justify-center items-center gap-2 text-[11px] sm:text-xs text-[#8A786D] mb-2 font-medium">
            <Link href="/" className="hover:text-[#8C3B1F] transition-colors">
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-[#8C3B1F] font-semibold">Cart</span>
          </nav>

          {/* Main Serif Title */}
          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-[50px] font-normal text-[#6A2B15] leading-tight tracking-tight">
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
                      className="bg-[#FFFFF0] border border-[#E5DACD] rounded-xl p-3 sm:p-5 flex flex-row items-center gap-3 sm:gap-5 shadow-2xs hover:border-[#C59B27]/50 transition-all"
                    >
                      {/* Saree Thumbnail Image */}
                      <div className="relative w-20 h-24 sm:w-28 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-[#FAF7EC]">
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
                          <h3 className="font-serif-luxury text-sm sm:text-lg font-medium text-[#6A2B15] leading-tight truncate">
                            {item.name}
                          </h3>

                          {/* Wishlist Heart Icon (Top Right on Item) */}
                          <button
                            type="button"
                            onClick={() => toggleWishlist(item.id)}
                            aria-label="Add to Wishlist"
                            className="p-1 text-[#8C3B1F] hover:text-[#B84D28] transition-colors flex-shrink-0"
                          >
                            <Heart
                              className={`w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.75] ${
                                wishlistItems.includes(item.id) || item.wishlisted
                                  ? 'fill-[#B84D28] text-[#B84D28]'
                                  : 'text-[#8C3B1F]'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Fabric & Color Sub-details */}
                        <p className="text-[11px] sm:text-xs text-[#8A786D] font-normal">
                          Fabric: {item.fabric} &nbsp;•&nbsp; Color: {item.color}
                        </p>

                        {/* Price Unit */}
                        <p className="font-serif-luxury text-sm sm:text-base font-bold text-[#6A2B15]">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>

                        {/* Quantity Controller + Remove Button Row */}
                        <div className="flex items-center justify-between pt-1 sm:pt-2">
                          {/* Quantity Controller Pill [ - 1 + ] */}
                          {/* Reducing from 1 to 0 automatically removes the product via updateQuantity(id, -1) */}
                          <div className="flex flex-col gap-1">
                            <div className="inline-flex items-center border border-[#DCD0C5] rounded-md bg-[#FFFFF0] px-2 py-0.5 sm:py-1 text-xs font-semibold text-[#8C3B1F] w-fit">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-1.5 py-0.5 hover:text-[#B84D28] transition-colors font-bold text-sm cursor-pointer"
                                title={item.quantity === 1 ? 'Remove product from cart' : 'Decrease quantity'}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="px-3 text-xs font-bold text-[#6A2B15]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                disabled={item.stock !== undefined && item.stock !== null && item.quantity >= Number(item.stock)}
                                onClick={() => updateQuantity(item.id, 1)}
                                className={`px-1.5 py-0.5 transition-colors font-bold text-sm ${
                                  item.stock !== undefined && item.stock !== null && item.quantity >= Number(item.stock)
                                    ? 'opacity-30 cursor-not-allowed text-gray-400'
                                    : 'hover:text-[#B84D28] cursor-pointer'
                                }`}
                                title={item.stock !== undefined && item.stock !== null && item.quantity >= Number(item.stock) ? `Max stock reached (${item.stock} available)` : 'Increase quantity'}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            {item.stock !== undefined && item.stock !== null && item.quantity >= Number(item.stock) && (
                              <span className="text-[10px] text-amber-700 font-semibold">
                                Max available stock reached ({item.stock})
                              </span>
                            )}
                          </div>

                          {/* Explicit Remove Button (Trash Icon + Text) */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-[#B84D28] hover:text-[#A34320] font-medium transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Total Item Price (Far Right on Desktop) */}
                      <div className="hidden sm:block text-right flex-shrink-0 pl-2">
                        <span className="font-serif-luxury text-base sm:text-lg font-bold text-[#6A2B15]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Free Shipping / Delivery Info Card ── */}
                {shippingRates.enableFreeShipping && shippingRates.freeShippingThreshold > 0 ? (
                  <div className="bg-[#F3EADF] border border-[#E5DACD] rounded-xl p-4 sm:p-5 space-y-2.5 shadow-2xs">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6A2B15]">
                      <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-[#C59B27] flex-shrink-0" />
                      <span>
                        {subtotal < shippingRates.freeShippingThreshold
                          ? `Add ₹${(shippingRates.freeShippingThreshold - subtotal).toLocaleString('en-IN')} more to get free shipping!`
                          : '🎉 Congratulations! You have unlocked Free Shipping!'}
                      </span>
                    </div>

                    {/* Progress Line */}
                    <div className="w-full bg-[#E5DACD] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#8C3B1F] h-full transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(100, Math.round((subtotal / shippingRates.freeShippingThreshold) * 100))}%` }}
                      />
                    </div>

                    {/* Range Labels */}
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#8A786D] font-medium">
                      <span>₹0</span>
                      <span>₹{shippingRates.freeShippingThreshold.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#FAF7EC] border border-[#E5DACD] rounded-xl p-3 sm:p-4 flex items-center justify-between text-xs text-[#6A2B15]">
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-5 h-5 text-[#8C3B1F]" />
                      <div>
                        <p className="font-bold">Standard Delivery: ₹{shippingFee}</p>
                        <p className="text-[11px] text-[#8C7A6B]">
                          {shippingInfo.region} {pincode ? `• Pincode ${pincode}` : '• Applied automatically'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
                      Express Delivery
                    </span>
                  </div>
                )}

                {/* ── "YOU MAY ALSO LIKE" Recommendations Section ── */}
                {recommendations.length > 0 && (
                  <div className="bg-[#FFFFF0] border border-[#E5DACD] rounded-xl p-4 sm:p-6 space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#6A2B15]">
                        YOU MAY ALSO LIKE
                      </h3>
                      <div className="flex items-center gap-3">
                        <Link
                          href="/shop"
                          className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#B84D28] hover:underline"
                        >
                          VIEW ALL
                        </Link>
                        <div className="hidden sm:flex items-center gap-1">
                          <button
                            type="button"
                            onClick={handlePrevRec}
                            disabled={recommendationIndex === 0}
                            className="p-1 rounded-full border border-[#DCD0C5] hover:border-[#8C3B1F] text-[#8C3B1F] disabled:opacity-30 transition-all"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleNextRec}
                            disabled={recommendationIndex >= recommendations.length - 4}
                            className="p-1 rounded-full border border-[#DCD0C5] hover:border-[#8C3B1F] text-[#8C3B1F] disabled:opacity-30 transition-all"
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
                            <div className="relative aspect-[4/3] w-full bg-[#FAF7EC] mb-1.5 rounded-md" />
                            <div className="h-3 bg-[#FAF7EC] w-3/4 mb-1.5 rounded-xs" />
                            <div className="flex items-center justify-between mt-1">
                              <div className="h-4 bg-[#FAF7EC] w-1/3 rounded-xs" />
                              <div className="h-6 bg-[#FAF7EC] w-1/3 rounded-sm" />
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
                              <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden bg-[#FAF7EC] mb-1.5">
                                <Image
                                  src={rec.image}
                                  alt={rec.name}
                                  fill
                                  sizes="(max-width: 640px) 50vw, 20vw"
                                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => toggleWishlist(rec.id)}
                                  aria-label="Toggle Wishlist"
                                  className="absolute top-1.5 right-1.5 p-1 bg-[#FFFFF0]/80 rounded-full text-[#8C3B1F] hover:text-[#B84D28]"
                                >
                                  <Heart
                                    className={`w-3 h-3 stroke-[1.75] ${
                                      wishlistItems.includes(rec.id) ? 'fill-[#B84D28] text-[#B84D28]' : 'text-[#8C3B1F]'
                                    }`}
                                  />
                                </button>
                              </div>
                              <h4 className="font-serif-luxury text-[11px] sm:text-xs font-medium text-[#6A2B15] line-clamp-1 group-hover:text-[#B84D28] transition-colors">
                                {rec.name}
                              </h4>
                            </div>

                            <div className="mt-1 flex items-center justify-between">
                              <p className="font-serif-luxury text-xs sm:text-sm font-bold text-[#6A2B15]">
                                ₹{rec.price.toLocaleString('en-IN')}
                              </p>
                              {rec.stock !== undefined && Number(rec.stock) <= 0 ? (
                                <span className="text-[9px] uppercase font-bold px-2 py-1 bg-gray-200 text-gray-500 rounded border border-gray-300">
                                  Out of Stock
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAddRecommendation(rec)}
                                  className="inline-flex items-center gap-1 bg-[#6A2B15] text-[#FFFFF0] text-[9px] uppercase font-bold px-2 py-1 rounded hover:bg-[#8C3B1F] transition-colors cursor-pointer"
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
                              )}
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
                <div className="bg-[#FFFFF0] border border-[#E5DACD] rounded-xl p-4 sm:p-6 space-y-5 shadow-2xs">
                  
                  {/* Title */}
                  <div className="pb-3 border-b border-[#E5DACD]">
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#6A2B15]">
                      ORDER SUMMARY
                    </h2>
                  </div>

                  {/* Summary Breakdown List */}
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between text-[#5A4438]">
                      <span>Subtotal ({totalItemsCount} Items)</span>
                      <span className="font-serif-luxury font-bold text-[#6A2B15]">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-[#B84D28] font-medium">
                        <span>Discount ({appliedCoupon})</span>
                        <span>- ₹{effectiveDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#5A4438] items-center">
                      <div className="flex flex-col">
                        <span>Delivery Charge</span>
                        <span className="text-[10px] text-[#8C7A6B]">{shippingInfo.region}</span>
                      </div>
                      {shippingInfo.isFree ? (
                        <span className="text-[#1E5631] font-bold uppercase">FREE</span>
                      ) : (
                        <span className="font-serif-luxury font-bold text-[#6A2B15]">
                          ₹{shippingFee}
                        </span>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#E5DACD] flex justify-between items-baseline">
                      <span className="font-serif-luxury text-base font-bold text-[#6A2B15]">
                        Total
                      </span>
                      <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#6A2B15]">
                        ₹{finalTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Pincode Delivery Checker */}
                    <div className="pt-2 pb-1 border-t border-[#E5DACD]/60 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#6A2B15] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#8C3B1F]" />
                          Delivery Pincode:
                        </span>
                        {pincode ? (
                          <span className="font-mono font-bold text-[#8C3B1F] bg-[#FAF7EC] px-1.5 py-0.5 rounded border border-[#E5D9C8]">
                            {pincode}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#8C7A6B]">Default: ₹{shippingRates.panIndiaStandard}</span>
                        )}
                      </div>
                      <form onSubmit={handleCheckPincode} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="e.g. 682001 or 560001"
                          value={inputPincode}
                          onChange={(e) => {
                            setInputPincode(e.target.value.replace(/\D/g, ''));
                            setPincodeMessage('');
                          }}
                          className="flex-1 bg-[#FFFFF0] border border-[#DCD0C5] rounded-md px-2.5 py-1 text-xs text-[#6A2B15] font-mono focus:outline-none focus:border-[#8C3B1F]"
                        />
                        <button
                          type="submit"
                          className="bg-[#6A2B15] hover:bg-[#8C3B1F] text-white text-[11px] font-bold px-3 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          Check
                        </button>
                      </form>
                      {pincodeMessage && (
                        <p className={`text-[10.5px] font-medium ${pincodeMessage.includes('valid') ? 'text-[#B84D28]' : 'text-emerald-700'}`}>
                          {pincodeMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Coupon UI (Only allow one coupon at a time) */}
                  {appliedCoupon ? (
                    <div className="space-y-1.5 mt-2">
                      <div className="flex items-center justify-between bg-[#FAF7EC]/90 border border-[#E5D9C8] rounded-md px-3 py-2 text-xs text-[#6A2B15]">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-[#B84D28] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Coupon {appliedCoupon} active
                          </span>
                          {couponSuccess && <span className="text-[10.5px] text-[#1E5631] font-medium">{couponSuccess}</span>}
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-[10px] font-bold text-[#B84D28] hover:text-[#8C3B1F] uppercase tracking-wider underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        <button
                          type="button"
                          onClick={() => setShowCouponsModal(true)}
                          className="text-[#6A2B15] hover:text-[#8C3B1F] font-semibold underline decoration-dotted cursor-pointer flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3 text-[#8C3B1F]" />
                          <span>Change or view other coupons</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-1 bg-[#FFFFF0] border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] placeholder-[#8A786D] focus:outline-none focus:border-[#8C3B1F]"
                          />
                          <button
                            type="submit"
                            className="bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-md transition-colors cursor-pointer"
                          >
                            APPLY
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-[11px] text-[#B84D28] font-medium pt-0.5">
                            {couponError}
                          </p>
                        )}
                      </form>

                      {/* View Available Coupons Trigger */}
                      <div className="flex items-center justify-between pt-0.5">
                        <button
                          type="button"
                          onClick={() => setShowCouponsModal(true)}
                          className="text-xs font-bold text-[#6A2B15] hover:text-[#8C3B1F] flex items-center gap-1.5 transition-colors cursor-pointer group"
                        >
                          <Tag className="w-3.5 h-3.5 text-[#8C3B1F] group-hover:scale-110 transition-transform" />
                          <span className="underline decoration-[#8C3B1F]/40 underline-offset-3">
                            View Available Coupons
                          </span>
                          {availableCoupons.length > 0 && (
                            <span className="bg-[#FAF7EC] text-[#8C3B1F] border border-[#E5D9C8] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                              {availableCoupons.length}
                            </span>
                          )}
                        </button>

                        {availableCoupons.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowInlineCoupons(prev => !prev)}
                            className="text-[11px] font-medium text-[#8C7A6B] hover:text-[#6A2B15] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>{showInlineCoupons ? 'Hide' : 'Quick view'}</span>
                            {showInlineCoupons ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>

                      {/* Inline Expandable Coupons List */}
                      {showInlineCoupons && (
                        <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1 animate-fadeIn">
                          {availableCoupons.length === 0 ? (
                            <div className="p-3 text-center text-xs text-[#8C7A6B] bg-[#FAF7EC]/50 rounded-lg border border-[#E5D9C8]/60">
                              No coupons available right now.
                            </div>
                          ) : (
                            availableCoupons.map((c) => {
                              const isApplied = appliedCoupon === c.code;
                              const isMinOrderMet = subtotal >= (c.minOrderAmount || 0);
                              const canApply = isMinOrderMet && !c.isUsed && !c.isExpired;

                              let potentialSaving = 0;
                              if (c.discountType === 'Percentage') {
                                potentialSaving = Math.round((subtotal * c.discountValue) / 100);
                                if (c.maxDiscount && c.maxDiscount > 0) {
                                  potentialSaving = Math.min(potentialSaving, c.maxDiscount);
                                }
                              } else {
                                potentialSaving = c.discountValue || 0;
                              }

                              return (
                                <div
                                  key={c._id || c.code}
                                  className={`p-2.5 rounded-lg border text-xs transition relative ${
                                    isApplied
                                      ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400'
                                      : 'bg-[#FFFFF0] border-[#E5D9C8] hover:border-[#8C3B1F]/40'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-1 flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-[#6A2B15] bg-[#FAF7EC] px-1.5 py-0.5 rounded border border-[#E5D9C8] tracking-wider text-[11px]">
                                          {c.code}
                                        </span>
                                        <span className="font-bold text-[10px] text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                                          {c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                                        </span>
                                      </div>
                                      {c.description && (
                                        <p className="text-[11px] text-[#5A4438] font-medium leading-snug">
                                          {c.description}
                                        </p>
                                      )}
                                      <div className="text-[10px] text-[#8C7A6B] flex items-center gap-2 pt-0.5">
                                        {c.minOrderAmount > 0 ? (
                                          <span>Min order: ₹{c.minOrderAmount.toLocaleString('en-IN')}</span>
                                        ) : (
                                          <span>No min order</span>
                                        )}
                                        <span>•</span>
                                        <span>1x use</span>
                                      </div>
                                      {!isMinOrderMet && (
                                        <p className="text-[10px] text-[#B84D28] font-semibold pt-0.5">
                                          Add ₹{(c.minOrderAmount - subtotal).toLocaleString('en-IN')} more to unlock
                                        </p>
                                      )}
                                      {isMinOrderMet && !isApplied && potentialSaving > 0 && (
                                        <p className="text-[10px] text-emerald-700 font-semibold pt-0.5">
                                          Save ₹{potentialSaving.toLocaleString('en-IN')} with this coupon
                                        </p>
                                      )}
                                    </div>

                                    <div>
                                      {isApplied ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                                          <CheckCircle2 className="w-3 h-3" />
                                          APPLIED
                                        </span>
                                      ) : canApply ? (
                                        <button
                                          type="button"
                                          onClick={() => applySpecificCoupon(c.code)}
                                          className="bg-[#6A2B15] hover:bg-[#8C3B1F] text-white text-[11px] font-bold px-3 py-1 rounded transition cursor-pointer shadow-2xs"
                                        >
                                          APPLY
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          disabled
                                          className="bg-gray-100 text-gray-400 text-[11px] font-medium px-2.5 py-1 rounded cursor-not-allowed border border-gray-200"
                                          title={c.isUsed ? 'Already used' : `Min order of ₹${c.minOrderAmount} required`}
                                        >
                                          {c.isUsed ? 'USED' : 'APPLY'}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Trust Badges */}
                  <div className="pt-3 border-t border-[#E5DACD]/80 grid grid-cols-3 gap-1 text-center divide-x divide-[#E5DACD]/60 items-center">
                    <div className="flex flex-col items-center p-1 space-y-1">
                      <ShieldCheck className="w-4 h-4 text-[#B84D28]" />
                      <span className="text-[9.5px] font-semibold text-[#8C3B1F]">
                        Secure Payment
                      </span>
                    </div>

                    <div className="flex flex-col items-center p-1 space-y-1">
                      <Package className="w-4 h-4 text-[#B84D28]" />
                      <span className="text-[9.5px] font-semibold text-[#8C3B1F]">
                        Easy Returns
                      </span>
                    </div>

                    <div className="flex flex-col items-center p-1 space-y-1">
                      <Award className="w-4 h-4 text-[#B84D28]" />
                      <span className="text-[9.5px] font-semibold text-[#8C3B1F]">
                        Quality Assured
                      </span>
                    </div>
                  </div>

                  {/* Desktop Checkout Button */}
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={handleProceedToCheckout}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-xs font-bold tracking-[0.2em] uppercase py-3.5 rounded-md transition-colors shadow-sm group"
                    >
                      <span>PROCEED TO CHECKOUT</span>
                      <ArrowRight className="w-4 h-4 text-[#FFFFF0] group-hover:translate-x-1 transition-transform" />
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
              <div className="w-16 h-16 rounded-full bg-[#FFFFF0] border border-[#C59B27]/40 flex items-center justify-center mx-auto text-[#B84D28]">
                <RotateCcw className="w-8 h-8" />
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#6A2B15]">
                Your Shopping Cart is Empty
              </h2>
              <p className="text-xs sm:text-sm text-[#5A4438]">
                Explore our exquisite saree collections and add your favorite pieces.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-md shadow-xs transition-colors"
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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFF0] border-t border-[#E5DACD] p-3 shadow-2xl block lg:hidden">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase text-[#8A786D] font-medium block">Total</span>
              <span className="font-serif-luxury text-xl font-bold text-[#6A2B15]">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="flex-1 inline-flex items-center justify-center gap-1 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-[10px] font-bold tracking-wider uppercase py-2.5 rounded-md transition-colors shadow-xs"
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
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A2B15]">
                {shippingRates.enableFreeShipping && shippingRates.freeShippingThreshold > 0 ? 'FREE SHIPPING' : 'STANDARD DELIVERY'}
              </span>
              <span className="text-[9.5px] text-[#5A4438]">
                {shippingRates.enableFreeShipping && shippingRates.freeShippingThreshold > 0 ? `Above ₹${shippingRates.freeShippingThreshold}` : `₹${shippingRates.panIndiaStandard || 49}`}
              </span>
            </div>

            <div className="flex flex-col items-center p-2 space-y-1">
              <Package className="w-5 h-5 text-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A2B15]">
                SECURE PACKAGING
              </span>
              <span className="text-[9.5px] text-[#5A4438]">Safe & premium packaging</span>
            </div>

            <div className="flex flex-col items-center p-2 space-y-1">
              <RotateCcw className="w-5 h-5 text-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A2B15]">
                EASY RETURNS
              </span>
              <span className="text-[9.5px] text-[#5A4438]">Hassle-free returns</span>
            </div>

            <div className="flex flex-col items-center p-2 space-y-1">
              <Award className="w-5 h-5 text-[#C59B27]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A2B15]">
                100% QUALITY ASSURED
              </span>
              <span className="text-[9.5px] text-[#5A4438]">Premium quality sarees</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* AVAILABLE COUPONS MODAL                                         */}
      {/* ================================================================ */}
      {showCouponsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFFF0] rounded-2xl shadow-2xl border border-[#E5DACD] w-full max-w-lg p-6 relative max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DACD]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#FAF7EC] border border-[#E5D9C8] rounded-xl text-[#8C3B1F]">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-[#6A2B15]">
                    Available Coupons &amp; Offers
                  </h3>
                  <p className="text-xs text-[#8C7A6B]">
                    Choose from eligible offers to apply instant savings to your cart.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCouponsModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#FAF7EC] text-[#8C7A6B] hover:text-[#6A2B15] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subtotal Summary Pill */}
            <div className="my-3 px-3 py-2 bg-[#FAF7EC] border border-[#E5D9C8] rounded-lg flex items-center justify-between text-xs">
              <span className="text-[#5A4438]">Current Cart Total:</span>
              <span className="font-serif-luxury font-bold text-[#6A2B15] text-sm">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Coupons List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
              {availableCoupons.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#8C7A6B]">
                  No coupons available right now. Please check back later.
                </div>
              ) : (
                availableCoupons.map((c) => {
                  const isApplied = appliedCoupon === c.code;
                  const isMinOrderMet = subtotal >= (c.minOrderAmount || 0);
                  const canApply = isMinOrderMet && !c.isUsed && !c.isExpired;

                  let potentialSaving = 0;
                  if (c.discountType === 'Percentage') {
                    potentialSaving = Math.round((subtotal * c.discountValue) / 100);
                    if (c.maxDiscount && c.maxDiscount > 0) {
                      potentialSaving = Math.min(potentialSaving, c.maxDiscount);
                    }
                  } else {
                    potentialSaving = c.discountValue || 0;
                  }

                  return (
                    <div
                      key={c._id || c.code}
                      className={`p-4 rounded-xl border transition relative ${
                        isApplied
                          ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/30'
                          : canApply
                          ? 'bg-white border-[#E5DACD] hover:border-[#8C3B1F] shadow-2xs'
                          : 'bg-white/60 border-gray-200 opacity-80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#6A2B15] bg-[#FAF7EC] px-2 py-0.5 rounded border border-[#E5D9C8] tracking-wider text-xs">
                              {c.code}
                            </span>
                            <span className="font-bold text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                            </span>
                            {c.targetType === 'specific' && (
                              <span className="text-[10px] font-semibold text-purple-800 bg-purple-100 px-1.5 py-0.2 rounded">
                                Exclusive Gift
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-semibold text-[#6A2B15]">
                            {c.description || (c.discountType === 'Percentage' ? `Get ${c.discountValue}% off your order` : `Get flat ₹${c.discountValue} discount`)}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8C7A6B]">
                            {c.minOrderAmount > 0 ? (
                              <span>Min order: ₹{c.minOrderAmount.toLocaleString('en-IN')}</span>
                            ) : (
                              <span>No minimum order</span>
                            )}
                            <span>•</span>
                            <span>Single use per user</span>
                            {c.expiryDate && (
                              <>
                                <span>•</span>
                                <span>Expires {new Date(c.expiryDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </>
                            )}
                          </div>

                          {!isMinOrderMet && (
                            <div className="pt-1 text-[11px] text-[#B84D28] font-semibold flex items-center gap-1">
                              <span>⚠️ Add ₹{(c.minOrderAmount - subtotal).toLocaleString('en-IN')} more to your cart to use this coupon</span>
                            </div>
                          )}

                          {isMinOrderMet && !isApplied && potentialSaving > 0 && (
                            <div className="pt-1 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                              <span>You will save ₹{potentialSaving.toLocaleString('en-IN')} with this coupon</span>
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 flex flex-col items-end gap-1">
                          {isApplied ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                APPLIED
                              </span>
                              <button
                                type="button"
                                onClick={() => { handleRemoveCoupon(); }}
                                className="text-[10px] text-[#B84D28] hover:underline cursor-pointer font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          ) : canApply ? (
                            <button
                              type="button"
                              onClick={() => applySpecificCoupon(c.code)}
                              className="px-4 py-2 bg-[#6A2B15] hover:bg-[#8C3B1F] text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
                            >
                              APPLY
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-medium rounded-lg cursor-not-allowed border border-gray-200"
                            >
                              {c.isUsed ? 'USED' : 'LOCKED'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 mt-3 border-t border-[#E5DACD] flex justify-end">
              <button
                type="button"
                onClick={() => setShowCouponsModal(false)}
                className="px-4 py-2 bg-[#6A2B15] text-white text-xs font-bold rounded-lg hover:bg-[#8C3B1F] transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
