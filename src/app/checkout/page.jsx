'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import AnnouncementBar from '@/components/AnnouncementBar';
import { 
  ShieldCheck, Lock, ChevronRight, CheckCircle2, ArrowRight, 
  Home, CreditCard, ShoppingBag, Loader2, Sparkles, Check 
} from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  // Authentication & Pre-fill details
  const [userSession, setUserSession] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Flow States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'upi'
  const [paymentDetails, setPaymentDetails] = useState({ cardNo: '', expiry: '', cvv: '', upiId: '' });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    // Enforce profile session login
    const session = localStorage.getItem('sakhi_user_session');
    if (!session) {
      router.push('/profile?redirect=/checkout');
      return;
    }

    const parsed = JSON.parse(session);
    setUserSession(parsed);

    // Pre-fill form fields
    const nameParts = parsed.name ? parsed.name.split(' ') : ['', ''];
    setFormData({
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: parsed.email || '',
      phone: parsed.phone || '',
      address: parsed.address || '',
      city: parsed.city || '',
      state: parsed.state || '',
      pincode: parsed.pincode || '',
    });
  }, [router]);

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const discount = subtotal > 0 ? 600 : 0; // Default welcome discount matching cart
  const finalTotal = Math.max(0, subtotal - discount);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrderClick = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    // Switch to Payment Gateway view
    setIsPaying(true);
  };

  const handleCompletePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);

    // Simulate Payment Gateway loading delay
    setTimeout(async () => {
      try {
        // Map cart items for backend schema
        const formattedItems = cartItems.map((item) => ({
          productId: item.id.toString().match(/^[0-9a-fA-F]{24}$/) ? item.id : undefined,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }));

        const orderData = {
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          items: formattedItems,
          totalAmount: finalTotal,
        };

        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        const data = await res.json();

        if (data.success) {
          setOrderSuccess(data.order);
          clearCart();
        } else {
          alert(data.error || 'Failed to place order. Please try again.');
          setIsPaying(false);
        }
      } catch (err) {
        console.error('Checkout API error:', err);
        alert('An error occurred during order submission. Please try again.');
        setIsPaying(false);
      } finally {
        setPaymentProcessing(false);
      }
    }, 2500);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7EFE8]">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-[#F3EADF]/85 border border-[#E5DACD] p-8 rounded-2xl text-center shadow-lg space-y-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-full bg-[#1E5631]/10 flex items-center justify-center mx-auto text-[#1E5631]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase text-[#8B5A3C] font-bold tracking-widest block">ORDER CONFIRMED</span>
              <h1 className="font-serif-luxury text-3xl font-normal text-[#2A0E11]">Thank You for Your Order!</h1>
              <p className="text-xs text-[#8A786D]">We have received your payment and will contact you with shipping details soon.</p>
            </div>

            <div className="border-t border-b border-[#E5DACD]/80 py-4 text-left space-y-2.5 text-xs text-[#5A4438]">
              <div className="flex justify-between">
                <span className="font-semibold text-[#2A0E11]">Order Number:</span>
                <span className="font-mono text-[#8B2635] font-bold">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#2A0E11]">Name:</span>
                <span>{orderSuccess.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#2A0E11]">Email:</span>
                <span>{orderSuccess.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#2A0E11]">Amount Paid:</span>
                <span className="font-bold text-[#2A0E11]">₹{orderSuccess.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] text-xs font-bold tracking-[0.2em] uppercase py-3 rounded-md transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>CONTINUE SHOPPING</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EFE8]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center mb-8">
          <nav className="flex justify-center items-center gap-2 text-[10px] sm:text-xs text-[#8A786D] mb-2 font-medium uppercase tracking-wider">
            <Link href="/cart" className="hover:text-[#3D1418] transition-colors">Cart</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#3D1418] font-semibold">{isPaying ? 'Payment Gateway' : 'Checkout Details'}</span>
          </nav>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#2A0E11] font-normal leading-tight tracking-tight">
            {isPaying ? 'Secure Payment' : 'Checkout Profile'}
          </h1>
          <div className="flex items-center justify-center gap-3 my-2">
            <span className="h-[0.75px] w-12 bg-[#C59B27]/40" />
            <span className="text-[#C59B27] text-[10px]">✦</span>
            <span className="h-[0.75px] w-12 bg-[#C59B27]/40" />
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-[#F3EADF]/60 rounded-2xl border border-[#E5DACD] max-w-2xl mx-auto my-6 space-y-4">
            <h2 className="font-serif-luxury text-2xl font-medium text-[#2A0E11]">Your cart is empty</h2>
            <p className="text-xs text-[#5A4438]">Add products to your cart before proceeding to checkout.</p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-md shadow-xs transition-colors"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : !isPaying ? (
          
          /* ── STEP 1: CHECKOUT PROFILE SHIPPING FORM ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
            {/* Shipping Form */}
            <form onSubmit={handlePlaceOrderClick} className="lg:col-span-7 space-y-6">
              <div className="bg-[#F3EADF]/80 border border-[#E5DACD] rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#2A0E11] border-b border-[#E5DACD]/80 pb-3 flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#C59B27]" />
                  <span>SHIPPING & DELIVERY DETAILS</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">First Name *</label>
                    <input
                      required
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Last Name *</label>
                    <input
                      required
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Email Address *</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Street Address *</label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House number, apartment, street name"
                    className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">City *</label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">State *</label>
                    <input
                      required
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418] transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Pincode *</label>
                    <input
                      required
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] text-xs font-bold tracking-[0.2em] uppercase py-3.5 rounded-md transition-colors shadow-md group"
              >
                <span>PROCEED TO PAYMENT</span>
                <ArrowRight className="w-4 h-4 text-[#F7EFE8] group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Right Summary Block */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              <div className="bg-[#F3EADF]/80 border border-[#E5DACD] rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#2A0E11] border-b border-[#E5DACD] pb-3">Order Details</h2>

                <div className="divide-y divide-[#E5DACD]/60 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center gap-3">
                      <div className="relative w-12 h-15 bg-[#EFE6DD] rounded overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-medium text-[#2A0E11] truncate">{item.name}</h4>
                        <p className="text-[10px] text-[#8A786D]">Qty: {item.quantity} &nbsp;•&nbsp; {item.fabric}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#2A0E11]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs pt-3 border-t border-[#E5DACD]">
                  <div className="flex justify-between text-[#5A4438]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#2A0E11]">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#8B2635] font-medium">
                      <span>Discount (WELCOME10)</span>
                      <span>- ₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#5A4438]">
                    <span>Shipping</span>
                    <span className="text-[#1E5631] font-bold uppercase">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-[#E5DACD]/80 flex justify-between items-baseline">
                    <span className="font-bold text-[#2A0E11]">Total Amount</span>
                    <span className="font-serif-luxury text-xl font-bold text-[#2A0E11]">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-[#8A786D]">
                  <ShieldCheck className="w-4 h-4 text-[#1E5631]" />
                  <span>100% Safe and Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          
          /* ── STEP 2: PAYMENT GATEWAY OVERLAY SCREEN ── */
          <div className="max-w-2xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 bg-[#F3EADF]/85 border border-[#E5DACD] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-300">
            
            {/* Details Left */}
            <div className="md:col-span-5 bg-[#2A0E11] text-[#F7EFE8] p-6 space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#C59B27] font-bold block">SECURE CONNECTION</span>
                <h3 className="font-serif-luxury text-2xl font-normal mt-1 leading-tight">Sakhi Bill Pay</h3>
                
                <div className="space-y-4 pt-8 text-xs text-[#EFE6DD]">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="opacity-75">Customer:</span>
                    <span>{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="opacity-75">Email:</span>
                    <span className="truncate max-w-[140px]">{formData.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="opacity-75">Amount Due:</span>
                    <span className="font-bold text-[#C59B27]">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] opacity-75">
                <Lock className="w-4 h-4 text-[#C59B27]" />
                <span>PCI-DSS Compliant Gateway</span>
              </div>
            </div>

            {/* Portal Input Right */}
            <div className="md:col-span-7 p-6 sm:p-8 space-y-6 relative">
              {paymentProcessing && (
                <div className="absolute inset-0 bg-[#F3EADF]/95 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 z-30 animate-in fade-in duration-200">
                  <Loader2 className="w-10 h-10 text-[#8B2635] animate-spin" />
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2A0E11] animate-pulse">
                    Processing Transaction...
                  </p>
                  <p className="text-[10px] text-[#8A786D]">Please do not refresh or close this tab.</p>
                </div>
              )}

              <div className="flex gap-4 border-b border-[#E5DACD] pb-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    paymentMethod === 'card' ? 'text-[#2A0E11] border-b-2 border-[#2A0E11]' : 'text-[#8A786D]'
                  }`}
                >
                  Credit / Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    paymentMethod === 'upi' ? 'text-[#2A0E11] border-b-2 border-[#2A0E11]' : 'text-[#8A786D]'
                  }`}
                >
                  UPI Payment
                </button>
              </div>

              <form onSubmit={handleCompletePaymentSubmit} className="space-y-4">
                {paymentMethod === 'card' ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Cardholder Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Name on card"
                        className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Card Number</label>
                      <input
                        required
                        type="text"
                        name="cardNo"
                        placeholder="4111 2222 3333 4444"
                        value={paymentDetails.cardNo}
                        onChange={handlePaymentInputChange}
                        maxLength={19}
                        className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Expiry Date</label>
                        <input
                          required
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={paymentDetails.expiry}
                          onChange={handlePaymentInputChange}
                          maxLength={5}
                          className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">CVV Code</label>
                        <input
                          required
                          type="password"
                          name="cvv"
                          placeholder="•••"
                          value={paymentDetails.cvv}
                          onChange={handlePaymentInputChange}
                          maxLength={3}
                          className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">UPI ID / VPA Address</label>
                      <input
                        required
                        type="text"
                        name="upiId"
                        placeholder="yourname@upi"
                        value={paymentDetails.upiId}
                        onChange={handlePaymentInputChange}
                        className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11]"
                      />
                    </div>
                    <span className="text-[10px] text-[#8A786D] block">
                      A payment request will be sent to your active UPI mobile app.
                    </span>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] text-xs font-bold tracking-wider uppercase py-3 rounded-md transition-colors"
                  >
                    Pay ₹{finalTotal.toLocaleString('en-IN')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaying(false)}
                    className="border border-[#C5B9AD] text-[#3D1418] hover:bg-[#3D1418]/5 text-xs font-bold tracking-wider uppercase px-5 py-3 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
