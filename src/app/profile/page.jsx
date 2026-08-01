'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useCart } from '@/context/CartContext';
import { 
  User, Mail, Phone, MapPin, ShoppingBag, Calendar, 
  Package, Shield, ArrowRight, LogOut, LogIn, Heart, 
  Edit3, CheckCircle2, Lock 
} from 'lucide-react';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { cartCount, wishlistCount } = useCart();

  // Authentication & Profile States
  const [userSession, setUserSession] = useState(null);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  
  // Signup Form State
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Orders State
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem('sakhi_user_session');
    if (session) {
      const parsed = JSON.parse(session);
      setUserSession(parsed);
      loadCustomerOrders(parsed.email);
    }
  }, []);

  const loadCustomerOrders = async (email) => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        const customerOrders = data.orders.filter(
          (o) => o.customerEmail && o.customerEmail.toLowerCase() === email.toLowerCase()
        );
        setOrders(customerOrders);
      }
    } catch (err) {
      console.error('Failed to load customer orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!loginEmail) return;

    try {
      // Find orders matching this email to retrieve their past profile details
      const res = await fetch('/api/orders');
      const data = await res.json();
      
      let userDetails = {
        name: 'Valued Customer',
        email: loginEmail,
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
      };

      if (data.success && Array.isArray(data.orders)) {
        const pastOrder = data.orders.find(
          (o) => o.customerEmail && o.customerEmail.toLowerCase() === loginEmail.toLowerCase()
        );
        if (pastOrder) {
          userDetails = {
            name: pastOrder.customerName || 'Valued Customer',
            email: loginEmail,
            phone: pastOrder.phone || '',
            address: pastOrder.address || '',
            city: pastOrder.city || '',
            state: pastOrder.state || '',
            pincode: pastOrder.pincode || '',
          };
        }
      }

      localStorage.setItem('sakhi_user_session', JSON.stringify(userDetails));
      setUserSession(userDetails);
      loadCustomerOrders(loginEmail);

      // Handle redirect if needed
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (err) {
      console.error('Login error:', err);
      setAuthError('An error occurred during login. Please try again.');
    }
  };

  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email) return;

    localStorage.setItem('sakhi_user_session', JSON.stringify(signupData));
    setUserSession(signupData);
    setOrders([]); // New user has no orders

    // Handle redirect if needed
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sakhi_user_session');
    setUserSession(null);
    setOrders([]);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setEditData({ ...userSession });
    setIsEditing(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    localStorage.setItem('sakhi_user_session', JSON.stringify(editData));
    setUserSession(editData);
    setIsEditing(false);
    loadCustomerOrders(editData.email);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EFE8]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#2A0E11] font-normal leading-tight tracking-tight">
            {userSession ? 'My Sakhi Account' : 'Access Your Profile'}
          </h1>
          <div className="flex items-center justify-center gap-3 my-2">
            <span className="h-[0.75px] w-12 bg-[#C59B27]/40" />
            <span className="text-[#C59B27] text-[10px]">✦</span>
            <span className="h-[0.75px] w-12 bg-[#C59B27]/40" />
          </div>
          {redirectUrl && (
            <p className="text-xs text-[#8B2635] font-semibold mt-1 animate-pulse">
              Please sign in or sign up to complete your checkout purchase.
            </p>
          )}
        </div>

        {/* ── NOT LOGGED IN VIEW ── */}
        {!userSession ? (
          <div className="max-w-md w-full mx-auto bg-[#F3EADF]/80 border border-[#E5DACD] rounded-2xl shadow-lg overflow-hidden p-6 sm:p-8 space-y-6">
            
            {/* Tabs */}
            <div className="flex border-b border-[#E5DACD]">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setAuthError(''); }}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'login' 
                    ? 'border-b-2 border-[#2A0E11] text-[#2A0E11]' 
                    : 'text-[#8A786D] hover:text-[#2A0E11]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setAuthError(''); }}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'signup' 
                    ? 'border-b-2 border-[#2A0E11] text-[#2A0E11]' 
                    : 'text-[#8A786D] hover:text-[#2A0E11]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Sign Up
              </button>
            </div>

            {authError && (
              <p className="text-[11px] text-[#8B2635] text-center font-medium bg-[#8B2635]/5 p-2 rounded">
                {authError}
              </p>
            )}

            {/* Login Pane */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="Enter your email (e.g. aishwarya.sen@example.com)"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418] transition-colors"
                  />
                  <span className="text-[9px] text-[#8A786D] block italic">
                    Tip: Logging in with a previously used checkout email fetches all past orders.
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] text-xs font-bold tracking-[0.2em] uppercase py-3 rounded-md transition-colors shadow-sm"
                >
                  <span>LOGIN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              /* Signup Pane */
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Full Name *</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={signupData.name}
                      onChange={handleSignupInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Phone *</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={signupData.phone}
                      onChange={handleSignupInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Email Address *</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupInputChange}
                    className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={signupData.address}
                    onChange={handleSignupInputChange}
                    className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none focus:border-[#3D1418]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      name="city"
                      value={signupData.city}
                      onChange={handleSignupInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">State</label>
                    <input
                      type="text"
                      name="state"
                      value={signupData.state}
                      onChange={handleSignupInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={signupData.pincode}
                      onChange={handleSignupInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#2A0E11] focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] text-xs font-bold tracking-[0.2em] uppercase py-3 rounded-md transition-colors shadow-sm"
                >
                  <span>SIGN UP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="border-t border-[#E5DACD]/60 pt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#8A786D]">
              <Lock className="w-3.5 h-3.5 text-[#1E5631]" />
              <span>Secure 128-Bit Encryption Standard</span>
            </div>
          </div>
        ) : (
          
          /* ── LOGGED IN VIEW ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Profile Details & Active Summaries */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-[#F3EADF]/80 border border-[#E5DACD] rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-[#E5DACD]/80">
                  <div className="w-20 h-20 rounded-full border-2 border-[#C59B27] bg-[#EFE6DD] flex items-center justify-center text-[#2A0E11] shadow-inner relative overflow-hidden">
                    <User className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="font-serif-luxury text-xl text-[#2A0E11] font-normal">{userSession.name}</h2>
                    <span className="text-[10px] bg-[#C59B27]/10 text-[#8B5A3C] uppercase tracking-widest px-2 py-0.5 rounded-sm font-bold">
                      Sakhi Patron
                    </span>
                  </div>
                </div>

                {isEditing ? (
                  <div className="pt-5 space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditInputChange}
                        className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-1.5 text-xs text-[#2A0E11]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditInputChange}
                        className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-1.5 text-xs text-[#2A0E11]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditInputChange}
                        className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-1.5 text-xs text-[#2A0E11]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={editData.address}
                        onChange={handleEditInputChange}
                        className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-1.5 text-xs text-[#2A0E11]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">City</label>
                        <input
                          type="text"
                          name="city"
                          value={editData.city}
                          onChange={handleEditInputChange}
                          className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-1.5 text-xs text-[#2A0E11]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#3D1418] uppercase tracking-wider">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={editData.pincode}
                          onChange={handleEditInputChange}
                          className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-1.5 text-xs text-[#2A0E11]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] font-bold uppercase tracking-widest text-[10px] py-2 rounded transition-colors"
                      >
                        Save Details
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 border border-[#DCD0C5] text-[#3D1418] hover:bg-[#3D1418]/5 font-bold uppercase tracking-widest text-[10px] py-2 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-5 space-y-4 text-xs">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-[#C59B27] mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#8A786D] block uppercase font-bold tracking-wider">Email Address</span>
                        <span className="text-[#2A0E11] font-medium">{userSession.email}</span>
                      </div>
                    </div>
                    {userSession.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-[#C59B27] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-[10px] text-[#8A786D] block uppercase font-bold tracking-wider">Phone Number</span>
                          <span className="text-[#2A0E11] font-medium">{userSession.phone}</span>
                        </div>
                      </div>
                    )}
                    {userSession.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#C59B27] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-[10px] text-[#8A786D] block uppercase font-bold tracking-wider">Shipping Address</span>
                          <span className="text-[#2A0E11] font-medium leading-relaxed">
                            {userSession.address}{userSession.city ? `, ${userSession.city}` : ''}{userSession.state ? `, ${userSession.state}` : ''}{userSession.pincode ? ` - ${userSession.pincode}` : ''}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleEditClick}
                        className="flex-1 border border-[#C5B9AD] text-[#3D1418] hover:bg-[#2A0E11] hover:text-[#F7EFE8] hover:border-[#2A0E11] text-[10px] font-bold uppercase tracking-wider py-2 rounded transition-all"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex-1 border border-[#8B2635] text-[#8B2635] hover:bg-[#8B2635] hover:text-[#F7EFE8] text-[10px] font-bold uppercase tracking-wider py-2 rounded transition-all flex items-center justify-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Bag / Wishlist Summaries */}
              <div className="bg-[#F3EADF]/60 border border-[#E5DACD] rounded-xl p-4 space-y-3.5">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#2A0E11] border-b border-[#E5DACD]/50 pb-2 flex items-center justify-between">
                  <span>Shopping Session</span>
                </h4>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-[#5A4438]">
                    <ShoppingBag className="w-4 h-4 text-[#C59B27]" />
                    <span>Cart Items ({cartCount})</span>
                  </div>
                  <Link href="/cart" className="text-[10px] font-bold uppercase text-[#8B2635] hover:underline">
                    View Cart
                  </Link>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-[#5A4438]">
                    <Heart className="w-4 h-4 text-[#C59B27]" />
                    <span>Wishlisted ({wishlistCount})</span>
                  </div>
                  <Link href="/shop" className="text-[10px] font-bold uppercase text-[#8B2635] hover:underline">
                    Browse Shop
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order History List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#F3EADF]/80 border border-[#E5DACD] rounded-2xl p-6 shadow-md">
                <h3 className="font-serif-luxury text-xl text-[#2A0E11] border-b border-[#E5DACD] pb-3 mb-5 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#C59B27]" />
                  <span>Order History</span>
                </h3>

                {isLoadingOrders ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-t-transparent border-[#8B2635] rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-[#8A786D] animate-pulse">Loading orders...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-[#F7EFE8]/90 border border-[#E5DACD]/80 rounded-xl p-4 space-y-4"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E5DACD]/60 pb-3 gap-2">
                          <div className="space-y-1">
                            <span className="text-[9px] text-[#8A786D] block font-bold">ORDER NUMBER</span>
                            <span className="font-mono text-xs font-bold text-[#8B2635]">{order.orderNumber}</span>
                          </div>
                          <div className="flex gap-4 text-xs text-[#5A4438]">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
                              <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold">
                              <Package className="w-3.5 h-3.5 text-[#C59B27]" />
                              <span className="text-[#1E5631] uppercase tracking-wider text-[10px]">{order.status}</span>
                            </div>
                          </div>
                        </div>

                        {/* Items in order */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 text-xs">
                              <div className="relative w-12 h-15 rounded overflow-hidden bg-[#EFE6DD] border border-[#E5DACD]/40">
                                <Image
                                  src={item.image || '/assets/about/story_tradition.jpg'}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif-luxury text-sm font-normal text-[#2A0E11] truncate">{item.name}</h4>
                                <p className="text-[10px] text-[#8A786D]">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-[#2A0E11]">₹{item.price.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Total Invoice */}
                        <div className="flex justify-between items-baseline pt-2 border-t border-[#E5DACD]/40">
                          <span className="text-[9px] uppercase font-bold text-[#8A786D]">Total Amount Invoice</span>
                          <span className="text-sm font-bold text-[#2A0E11]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3 bg-[#F7EFE8]/50 border border-dashed border-[#E5DACD] rounded-xl">
                    <ShoppingBag className="w-8 h-8 text-[#C59B27]/60 mx-auto" />
                    <div>
                      <h4 className="text-sm font-serif-luxury text-[#2A0E11] font-semibold">No Orders Found</h4>
                      <p className="text-[10px] text-[#8A786D] mt-1 max-w-xs mx-auto">
                        There are no orders registered under the email <span className="font-bold text-[#8B2635]">{userSession.email}</span>. Fill out your details in checkout to see them here!
                      </p>
                    </div>
                    <div className="pt-2">
                      <Link
                        href="/shop"
                        className="inline-flex bg-[#2A0E11] hover:bg-[#3D1418] text-[#F7EFE8] text-[9.5px] uppercase font-bold tracking-wider px-4 py-2 rounded transition-colors"
                      >
                        Browse Sarees
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7EFE8] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-t-transparent border-[#8B2635] rounded-full animate-spin" />
        <p className="text-xs text-[#8A786D] animate-pulse uppercase tracking-wider font-bold">Loading Profile...</p>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
