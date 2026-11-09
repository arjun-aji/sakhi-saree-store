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
  Edit3, CheckCircle2, Lock, Truck, ExternalLink, Copy,
  Plus, Trash2, Home, Check, Tag, Ticket, Sparkles
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
  const [copiedTrackingId, setCopiedTrackingId] = useState(null);
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [authError, setAuthError] = useState('');

  // Customer Coupons State
  const [myCoupons, setMyCoupons] = useState([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const [copiedCouponCode, setCopiedCouponCode] = useState(null);

  // Address Book States (Amazon/Flipkart style)
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [newAddressData, setNewAddressData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home',
    isDefault: false
  });

  const loadCustomerCoupons = async (email) => {
    if (!email) return;
    setIsLoadingCoupons(true);
    try {
      const res = await fetch(`/api/coupons?customerEmail=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.coupons)) {
        setMyCoupons(data.coupons);
      }
    } catch (err) {
      console.warn('Failed to load customer coupons:', err);
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const syncCustomerProfile = async (email) => {
    try {
      const res = await fetch(`/api/customers?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.customer) {
        const c = data.customer;
        const updated = {
          customerId: c.customerId || `SK-USR-${Math.floor(100000 + Math.random() * 900000)}`,
          name: c.name,
          email: c.email,
          phone: c.phone || '',
          address: c.address || '',
          city: c.city || '',
          state: c.state || '',
          pincode: c.pincode || '',
          savedAddresses: c.savedAddresses || []
        };
        localStorage.setItem('sakhi_user_session', JSON.stringify(updated));
        setUserSession(updated);
        return updated;
      }
    } catch (err) {
      console.warn('Sync profile error:', err);
    }
    return null;
  };

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem('sakhi_user_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setUserSession(parsed);
        loadCustomerOrders(parsed.email);
        loadCustomerCoupons(parsed.email);
        syncCustomerProfile(parsed.email);
      } catch (err) {
        console.error('Session parse error:', err);
      }
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
      // 1. Try to find the customer in the database first
      const custRes = await fetch(`/api/customers?email=${encodeURIComponent(loginEmail)}`);
      const custData = await custRes.json();
      let userDetails = null;

      if (custData.success && custData.customer) {
        const c = custData.customer;
        userDetails = {
          customerId: c.customerId,
          name: c.name,
          email: c.email,
          phone: c.phone || '',
          address: c.address || '',
          city: c.city || '',
          state: c.state || '',
          pincode: c.pincode || '',
          savedAddresses: c.savedAddresses || []
        };
      }

      // 2. If not found in customers database, check past orders list
      if (!userDetails) {
        const res = await fetch('/api/orders');
        const data = await res.json();
        
        userDetails = {
          customerId: `SK-USR-${Math.floor(100000 + Math.random() * 900000)}`,
          name: 'Valued Customer',
          email: loginEmail,
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          savedAddresses: []
        };

        if (data.success && Array.isArray(data.orders)) {
          const pastOrder = data.orders.find(
            (o) => o.customerEmail && o.customerEmail.toLowerCase() === loginEmail.toLowerCase()
          );
          if (pastOrder) {
            userDetails = {
              customerId: `SK-USR-${Math.floor(100000 + Math.random() * 900000)}`,
              name: pastOrder.customerName || 'Valued Customer',
              email: loginEmail,
              phone: pastOrder.phone || '',
              address: pastOrder.address || '',
              city: pastOrder.city || '',
              state: pastOrder.state || '',
              pincode: pastOrder.pincode || '',
              savedAddresses: pastOrder.address ? [{
                id: `addr_${Date.now()}`,
                name: pastOrder.customerName || 'Valued Customer',
                phone: pastOrder.phone || '',
                address: pastOrder.address,
                city: pastOrder.city || '',
                state: pastOrder.state || '',
                pincode: pastOrder.pincode || '',
                addressType: 'Home',
                isDefault: true
              }] : []
            };
          }
        }
        
        // 3. Save this customer to database so they are registered permanently
        const createRes = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userDetails)
        });
        const created = await createRes.json();
        if (created.success && created.customer) {
          userDetails.customerId = created.customer.customerId;
          userDetails.savedAddresses = created.customer.savedAddresses || [];
        }
      }

      localStorage.setItem('sakhi_user_session', JSON.stringify(userDetails));
      setUserSession(userDetails);
      loadCustomerOrders(loginEmail);
      loadCustomerCoupons(loginEmail);

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

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email) return;

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });
      const data = await res.json();
      if (data.success && data.customer) {
        const userDetails = {
          customerId: data.customer.customerId,
          name: data.customer.name,
          email: data.customer.email,
          phone: data.customer.phone || '',
          address: data.customer.address || '',
          city: data.customer.city || '',
          state: data.customer.state || '',
          pincode: data.customer.pincode || '',
          savedAddresses: data.customer.savedAddresses || []
        };
        localStorage.setItem('sakhi_user_session', JSON.stringify(userDetails));
        setUserSession(userDetails);
        setOrders([]);
        loadCustomerCoupons(data.customer.email);
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      setAuthError('An error occurred during signup. Please try again.');
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

  const handleSaveEdit = async () => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (data.success && data.customer) {
        const userDetails = {
          customerId: data.customer.customerId || userSession.customerId,
          name: data.customer.name,
          email: data.customer.email,
          phone: data.customer.phone || '',
          address: data.customer.address || '',
          city: data.customer.city || '',
          state: data.customer.state || '',
          pincode: data.customer.pincode || '',
          savedAddresses: data.customer.savedAddresses || []
        };
        localStorage.setItem('sakhi_user_session', JSON.stringify(userDetails));
        setUserSession(userDetails);
        setIsEditing(false);
        loadCustomerOrders(userDetails.email);
      }
    } catch (err) {
      console.error('Save profile error:', err);
    }
  };

  // Address Book Handlers
  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddressData.address || !newAddressData.pincode) return;
    setIsSavingAddress(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userSession.email,
          newAddress: {
            ...newAddressData,
            name: newAddressData.name || userSession.name,
            phone: newAddressData.phone || userSession.phone || '',
          }
        })
      });
      const data = await res.json();
      if (data.success && data.customer) {
        const updated = {
          ...userSession,
          customerId: data.customer.customerId || userSession.customerId,
          savedAddresses: data.customer.savedAddresses || [],
          address: data.customer.address,
          city: data.customer.city,
          state: data.customer.state,
          pincode: data.customer.pincode,
        };
        localStorage.setItem('sakhi_user_session', JSON.stringify(updated));
        setUserSession(updated);
        setShowAddAddressForm(false);
        setNewAddressData({
          name: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          addressType: 'Home',
          isDefault: false
        });
      }
    } catch (err) {
      console.error('Error saving address:', err);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSetDefaultAddress = async (addrId) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userSession.email,
          setDefaultAddressId: addrId
        })
      });
      const data = await res.json();
      if (data.success && data.customer) {
        const updated = {
          ...userSession,
          savedAddresses: data.customer.savedAddresses || [],
          address: data.customer.address,
          city: data.customer.city,
          state: data.customer.state,
          pincode: data.customer.pincode,
        };
        localStorage.setItem('sakhi_user_session', JSON.stringify(updated));
        setUserSession(updated);
      }
    } catch (err) {
      console.error('Error setting default address:', err);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userSession.email,
          deleteAddressId: addrId
        })
      });
      const data = await res.json();
      if (data.success && data.customer) {
        const updated = {
          ...userSession,
          savedAddresses: data.customer.savedAddresses || [],
          address: data.customer.address,
          city: data.customer.city,
          state: data.customer.state,
          pincode: data.customer.pincode,
        };
        localStorage.setItem('sakhi_user_session', JSON.stringify(updated));
        setUserSession(updated);
      }
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFF0]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#6A2B15] font-normal leading-tight tracking-tight">
            {userSession ? 'My Sakhi Account' : 'Access Your Profile'}
          </h1>
          <div className="flex items-center justify-center gap-3 my-2">
            <span className="h-[0.75px] w-12 bg-[#C59B27]/40" />
            <span className="text-[#C59B27] text-[10px]">✦</span>
            <span className="h-[0.75px] w-12 bg-[#C59B27]/40" />
          </div>
          {redirectUrl && (
            <p className="text-xs text-[#B84D28] font-semibold mt-1 animate-pulse">
              Please sign in to proceed smoothly with your order.
            </p>
          )}
        </div>

        {/* ── NOT LOGGED IN: TABS FOR LOGIN OR SIGNUP ── */}
        {!userSession ? (
          <div className="max-w-md mx-auto bg-[#F3EADF]/80 border border-[#E5DACD] rounded-2xl p-6 sm:p-8 shadow-md">
            
            {/* Tabs */}
            <div className="flex border-b border-[#E5DACD] mb-6">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setAuthError(''); }}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'border-b-2 border-[#6A2B15] text-[#6A2B15]'
                    : 'text-[#8A786D] hover:text-[#6A2B15]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Existing Customer</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setAuthError(''); }}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'signup'
                    ? 'border-b-2 border-[#6A2B15] text-[#6A2B15]'
                    : 'text-[#8A786D] hover:text-[#6A2B15]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>New Registration</span>
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {authError}
              </div>
            )}

            {/* LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Email Address</label>
                  <input
                    required
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. arjun@example.com"
                    className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F]"
                  />
                  <p className="text-[10px] text-[#8A786D] mt-1">
                    Enter the email registered with your previous purchases.
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-xs font-bold tracking-[0.2em] uppercase py-3 rounded-md transition-colors shadow-sm cursor-pointer"
                >
                  <span>SIGN IN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* SIGNUP FORM */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Full Name *</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={signupData.name}
                      onChange={handleSignupInputChange}
                      placeholder="Priya Nair"
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Phone *</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={signupData.phone}
                      onChange={handleSignupInputChange}
                      placeholder="9876543210"
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Email Address *</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupInputChange}
                    placeholder="priya@example.com"
                    className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={signupData.address}
                    onChange={handleSignupInputChange}
                    placeholder="Flat/House No, Road, Area"
                    className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      name="city"
                      value={signupData.city}
                      onChange={handleSignupInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">State</label>
                    <input
                      type="text"
                      name="state"
                      value={signupData.state}
                      onChange={handleSignupInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={signupData.pincode}
                      onChange={handleSignupInputChange}
                      className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-xs font-bold tracking-[0.2em] uppercase py-3 rounded-md transition-colors shadow-sm cursor-pointer"
                >
                  <span>CREATE PROFILE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="border-t border-[#E5DACD]/60 pt-4 flex flex-col items-center justify-center gap-2 text-[10px] text-[#8A786D]">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#1E5631]" />
                <span>Secure 128-Bit Encryption Standard</span>
              </div>
              <div className="pt-2 border-t border-[#E5DACD]/40 w-full text-center">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C3B1F] hover:text-[#6A2B15] hover:underline"
                >
                  <Shield className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Looking for Store Admin CMS? Go to Admin Portal →</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          
          /* ── LOGGED IN VIEW ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Profile Details, Saved Addresses & Sessions */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-[#F3EADF]/80 border border-[#E5DACD] rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-[#E5DACD]/80">
                  <div className="w-20 h-20 rounded-full border-2 border-[#C59B27] bg-[#FAF7EC] flex items-center justify-center text-[#6A2B15] shadow-inner relative overflow-hidden">
                    <User className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="font-serif-luxury text-xl text-[#6A2B15] font-normal">{userSession.name}</h2>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1.5">
                      <span className="text-[10px] bg-[#C59B27]/10 text-[#8B5A3C] uppercase tracking-widest px-2 py-0.5 rounded-sm font-bold">
                        Sakhi Patron
                      </span>
                      <div className="inline-flex items-center gap-1 bg-white border border-[#E5DACD] px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#8C3B1F]">
                        <span>ID: {userSession.customerId || 'SK-USR-104928'}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(userSession.customerId || '');
                            setCopiedUserId(true);
                            setTimeout(() => setCopiedUserId(false), 2000);
                          }}
                          className="text-[#8C3B1F] hover:text-[#6A2B15] cursor-pointer"
                          title="Copy User ID"
                        >
                          {copiedUserId ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing ? (
                  <div className="pt-5 space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditInputChange}
                        className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-1.5 text-xs text-[#6A2B15]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditInputChange}
                        className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-1.5 text-xs text-[#6A2B15]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditInputChange}
                        className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-1.5 text-xs text-[#6A2B15]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={editData.address}
                        onChange={handleEditInputChange}
                        className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-1.5 text-xs text-[#6A2B15]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">City</label>
                        <input
                          type="text"
                          name="city"
                          value={editData.city}
                          onChange={handleEditInputChange}
                          className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-1.5 text-xs text-[#6A2B15]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={editData.pincode}
                          onChange={handleEditInputChange}
                          className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-1.5 text-xs text-[#6A2B15]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] font-bold uppercase tracking-widest text-[10px] py-2 rounded transition-colors cursor-pointer"
                      >
                        Save Details
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 border border-[#DCD0C5] text-[#8C3B1F] hover:bg-[#8C3B1F]/5 font-bold uppercase tracking-widest text-[10px] py-2 rounded transition-colors cursor-pointer"
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
                        <span className="text-[#6A2B15] font-medium">{userSession.email}</span>
                      </div>
                    </div>
                    {userSession.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-[#C59B27] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-[10px] text-[#8A786D] block uppercase font-bold tracking-wider">Phone Number</span>
                          <span className="text-[#6A2B15] font-medium">{userSession.phone}</span>
                        </div>
                      </div>
                    )}
                    {userSession.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#C59B27] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-[10px] text-[#8A786D] block uppercase font-bold tracking-wider">Primary Address</span>
                          <span className="text-[#6A2B15] font-medium leading-relaxed">
                            {userSession.address}{userSession.city ? `, ${userSession.city}` : ''}{userSession.state ? `, ${userSession.state}` : ''}{userSession.pincode ? ` - ${userSession.pincode}` : ''}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleEditClick}
                        className="flex-1 border border-[#C5B9AD] text-[#8C3B1F] hover:bg-[#6A2B15] hover:text-[#FFFFF0] hover:border-[#6A2B15] text-[10px] font-bold uppercase tracking-wider py-2 rounded transition-all cursor-pointer"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex-1 border border-[#B84D28] text-[#B84D28] hover:bg-[#B84D28] hover:text-[#FFFFF0] text-[10px] font-bold uppercase tracking-wider py-2 rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Portal Quick Switch */}
              <div className="bg-gradient-to-r from-[#6A2B15] to-[#8C3B1F] text-[#FFFFF0] rounded-2xl p-5 shadow-md flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#E3C397]" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#E3C397]">Store Management</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#FFFFF0]">Admin CMS Portal</h3>
                  <p className="text-[11px] text-[#E3C397]">Switch from customer view to store management dashboard.</p>
                </div>
                <Link
                  href="/admin"
                  className="px-3.5 py-2 bg-[#E3C397] hover:bg-[#F3D7B5] text-[#6A2B15] text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1 shrink-0"
                >
                  <span>Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Saved Delivery Addresses Book (Amazon / Flipkart style) */}
              <div className="bg-[#F3EADF]/80 border border-[#E5DACD] rounded-2xl p-5 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5DACD]/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#C59B27]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#6A2B15]">Saved Delivery Addresses</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!showAddAddressForm) {
                        setNewAddressData({
                          name: userSession.name || '',
                          phone: userSession.phone || '',
                          address: '',
                          city: '',
                          state: '',
                          pincode: '',
                          addressType: 'Home',
                          isDefault: !(userSession.savedAddresses && userSession.savedAddresses.length > 0)
                        });
                      }
                      setShowAddAddressForm(!showAddAddressForm);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-[#6A2B15] hover:bg-[#8C3B1F] text-white rounded transition shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{showAddAddressForm ? 'Cancel' : 'Add New'}</span>
                  </button>
                </div>

                {/* Add New Address Form */}
                {showAddAddressForm && (
                  <form onSubmit={handleSaveNewAddress} className="bg-white border border-[#E5DACD] rounded-xl p-4 space-y-3 text-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-1 border-b border-[#FAF7F2]">
                      <span className="font-bold text-[#6A2B15] text-[11px] uppercase tracking-wider">New Delivery Address</span>
                      <span className="text-[10px] text-[#8A786D]">Auto-saved to profile</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase mb-0.5">Recipient Name *</label>
                        <input
                          required
                          type="text"
                          value={newAddressData.name}
                          onChange={(e) => setNewAddressData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder={userSession.name}
                          className="w-full bg-[#FAF7F2]/40 border border-[#DCD0C5] rounded px-2.5 py-1.5 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase mb-0.5">Phone Number *</label>
                        <input
                          required
                          type="tel"
                          value={newAddressData.phone}
                          onChange={(e) => setNewAddressData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder={userSession.phone || '10-digit mobile'}
                          className="w-full bg-[#FAF7F2]/40 border border-[#DCD0C5] rounded px-2.5 py-1.5 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase mb-0.5">Street Address / House / Flat *</label>
                      <input
                        required
                        type="text"
                        value={newAddressData.address}
                        onChange={(e) => setNewAddressData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="House/flat no, street area, landmark"
                        className="w-full bg-[#FAF7F2]/40 border border-[#DCD0C5] rounded px-2.5 py-1.5 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase mb-0.5">City *</label>
                        <input
                          required
                          type="text"
                          value={newAddressData.city}
                          onChange={(e) => setNewAddressData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="e.g. Mumbai"
                          className="w-full bg-[#FAF7F2]/40 border border-[#DCD0C5] rounded px-2.5 py-1.5 text-xs text-[#6A2B15] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase mb-0.5">State *</label>
                        <input
                          required
                          type="text"
                          value={newAddressData.state}
                          onChange={(e) => setNewAddressData(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="State"
                          className="w-full bg-[#FAF7F2]/40 border border-[#DCD0C5] rounded px-2.5 py-1.5 text-xs text-[#6A2B15] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase mb-0.5">Pincode *</label>
                        <input
                          required
                          type="text"
                          value={newAddressData.pincode}
                          onChange={(e) => setNewAddressData(prev => ({ ...prev, pincode: e.target.value }))}
                          placeholder="6-digit PIN"
                          className="w-full bg-[#FAF7F2]/40 border border-[#DCD0C5] rounded px-2.5 py-1.5 text-xs text-[#6A2B15] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-1.5 text-[11px] text-[#5A4438] cursor-pointer">
                          <input
                            type="radio"
                            name="addressType"
                            checked={newAddressData.addressType === 'Home'}
                            onChange={() => setNewAddressData(prev => ({ ...prev, addressType: 'Home' }))}
                            className="accent-[#8C3B1F]"
                          />
                          <span>Home</span>
                        </label>
                        <label className="inline-flex items-center gap-1.5 text-[11px] text-[#5A4438] cursor-pointer">
                          <input
                            type="radio"
                            name="addressType"
                            checked={newAddressData.addressType === 'Work'}
                            onChange={() => setNewAddressData(prev => ({ ...prev, addressType: 'Work' }))}
                            className="accent-[#8C3B1F]"
                          />
                          <span>Work</span>
                        </label>
                      </div>

                      <label className="inline-flex items-center gap-1.5 text-[11px] text-[#5A4438] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAddressData.isDefault}
                          onChange={(e) => setNewAddressData(prev => ({ ...prev, isDefault: e.target.checked }))}
                          className="accent-[#8C3B1F] rounded"
                        />
                        <span>Make Default</span>
                      </label>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="submit"
                        disabled={isSavingAddress}
                        className="flex-1 bg-[#6A2B15] hover:bg-[#8C3B1F] text-white font-bold uppercase tracking-wider text-[10px] py-2 rounded transition cursor-pointer disabled:opacity-50"
                      >
                        {isSavingAddress ? 'Saving Address...' : 'Save Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddAddressForm(false)}
                        className="px-3 border border-[#DCD0C5] text-[#8C3B1F] hover:bg-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider rounded transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Saved Addresses List */}
                <div className="space-y-3">
                  {(userSession.savedAddresses && userSession.savedAddresses.length > 0) ? (
                    userSession.savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-3.5 rounded-xl border text-xs transition relative ${
                          addr.isDefault
                            ? 'bg-[#FFFFF0] border-[#8C3B1F] shadow-xs'
                            : 'bg-white/80 border-[#E5DACD] hover:bg-[#FFFFF0]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#6A2B15]">{addr.name}</span>
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-[#FAF7F2] text-[#8C3B1F] border border-[#E5DACD]">
                              {addr.addressType || 'Home'}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-green-50 text-green-700 border border-green-200">
                                Default
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1 text-[#8A786D] hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer"
                            title="Delete this address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[#5A4438] text-[11px] leading-relaxed">
                          {addr.address}, {addr.city}, {addr.state} - <span className="font-bold text-[#8C3B1F]">{addr.pincode}</span>
                        </p>
                        <p className="text-[#8A786D] text-[10px] mt-1 font-medium">
                          Phone: {addr.phone}
                        </p>

                        {!addr.isDefault && (
                          <div className="pt-2 mt-2 border-t border-[#FAF7F2] flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[10px] font-bold text-[#8C3B1F] hover:underline cursor-pointer"
                            >
                              Use as Default Address
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-white/60 border border-dashed border-[#E5DACD] rounded-xl text-center space-y-1 text-xs text-[#8A786D]">
                      <p className="font-semibold text-[#6A2B15]">No saved addresses yet</p>
                      <p className="text-[10px]">Add your address above so you never need to type it again during checkout!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shopping Bag / Wishlist Summaries */}
              <div className="bg-[#F3EADF]/60 border border-[#E5DACD] rounded-xl p-4 space-y-3.5">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#6A2B15] border-b border-[#E5DACD]/50 pb-2 flex items-center justify-between">
                  <span>Shopping Session</span>
                </h4>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-[#5A4438]">
                    <ShoppingBag className="w-4 h-4 text-[#C59B27]" />
                    <span>Cart Items ({cartCount})</span>
                  </div>
                  <Link href="/cart" className="text-[10px] font-bold uppercase text-[#B84D28] hover:underline">
                    View Cart
                  </Link>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-[#5A4438]">
                    <Heart className="w-4 h-4 text-[#C59B27]" />
                    <span>Wishlisted ({wishlistCount})</span>
                  </div>
                  <Link href="/shop" className="text-[10px] font-bold uppercase text-[#B84D28] hover:underline">
                    Browse Shop
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Exclusive Rewards & Order History */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* EXCLUSIVE REWARDS & COUPONS */}
              <div className="bg-[#F3EADF]/80 border border-[#E5DACD] rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5DACD] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-[#6A2B15]/10 text-[#6A2B15]">
                      <Sparkles className="w-4 h-4 text-[#C59B27]" />
                    </div>
                    <div>
                      <h3 className="font-serif-luxury text-lg text-[#6A2B15] font-bold">
                        My Exclusive Coupons &amp; Offers
                      </h3>
                      <p className="text-[11px] text-[#8A786D]">
                        Personalized rewards and seasonal discounts crafted for you. Each coupon can be redeemed once.
                      </p>
                    </div>
                  </div>
                </div>

                {isLoadingCoupons ? (
                  <div className="py-6 text-center text-xs text-[#8A786D] animate-pulse">
                    Loading your exclusive rewards...
                  </div>
                ) : myCoupons.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {myCoupons.map((coup) => {
                      const isRedeemed = coup.isUsed;
                      const isExpired = coup.isExpired;
                      return (
                        <div
                          key={coup._id}
                          className={`p-4 rounded-xl border relative transition-all ${
                            isRedeemed
                              ? 'bg-gray-50/80 border-gray-200 opacity-60'
                              : isExpired
                              ? 'bg-red-50/40 border-red-200 opacity-60'
                              : 'bg-white border-[#E5DACD] hover:border-[#8C3B1F] shadow-2xs hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-[#6A2B15] bg-[#FAF7F2] border border-[#E5DACD] px-2.5 py-1 rounded">
                                {coup.code}
                              </span>
                              {!isRedeemed && !isExpired && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(coup.code);
                                    setCopiedCouponCode(coup.code);
                                    setTimeout(() => setCopiedCouponCode(null), 2000);
                                  }}
                                  className="p-1 hover:bg-[#FAF7F2] rounded text-[#8C3B1F] transition cursor-pointer"
                                  title="Copy coupon code"
                                >
                                  {copiedCouponCode === coup.code ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>

                            {isRedeemed ? (
                              <span className="text-[9px] uppercase px-2 py-0.5 rounded font-bold bg-gray-200 text-gray-700">
                                Redeemed
                              </span>
                            ) : isExpired ? (
                              <span className="text-[9px] uppercase px-2 py-0.5 rounded font-bold bg-red-100 text-red-800">
                                Expired
                              </span>
                            ) : (
                              <span className="text-[9px] uppercase px-2 py-0.5 rounded font-bold bg-green-50 text-green-700 border border-green-200">
                                Active
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="text-base font-serif-luxury font-bold text-[#8C3B1F]">
                              {coup.discountType === 'Percentage' ? `${coup.discountValue}% OFF` : `FLAT ₹${coup.discountValue} OFF`}
                            </div>
                            <p className="text-[11px] text-[#5A4438] leading-tight">
                              {coup.description || (coup.minOrderAmount > 0 ? `Valid on orders above ₹${coup.minOrderAmount.toLocaleString('en-IN')}` : 'Discount on any saree order')}
                            </p>
                          </div>

                          <div className="pt-2.5 mt-2.5 border-t border-[#FAF7F2] flex items-center justify-between text-[10px] text-[#8A786D]">
                            <span>
                              {coup.minOrderAmount > 0 ? `Min. ₹${coup.minOrderAmount.toLocaleString('en-IN')}` : 'No Min Order'} • 1x Use
                            </span>
                            <span>Valid till {new Date(coup.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>

                          {!isRedeemed && !isExpired && (
                            <div className="pt-2.5">
                              <button
                                type="button"
                                onClick={() => {
                                  localStorage.setItem('sakhi_coupon_code', coup.code);
                                  router.push('/shop');
                                }}
                                className="w-full py-1.5 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-[10px] font-bold uppercase tracking-wider rounded transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Tag className="w-3 h-3" />
                                <span>Apply &amp; Shop</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-1 text-xs text-[#8A786D] bg-white/60 rounded-xl border border-dashed border-[#E5DACD]">
                    <Ticket className="w-6 h-6 text-[#C59B27]/60 mx-auto" />
                    <p className="font-semibold text-[#6A2B15]">No personalized coupons right now</p>
                    <p className="text-[10px]">Special festive and loyalty coupons will appear here when assigned to you.</p>
                  </div>
                )}
              </div>
              <div className="bg-[#F3EADF]/80 border border-[#E5DACD] rounded-2xl p-6 shadow-md">
                <h3 className="font-serif-luxury text-xl text-[#6A2B15] border-b border-[#E5DACD] pb-3 mb-5 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#C59B27]" />
                  <span>Order History</span>
                </h3>

                {isLoadingOrders ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-t-transparent border-[#B84D28] rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-[#8A786D] animate-pulse">Loading orders...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-[#FFFFF0]/90 border border-[#E5DACD]/80 rounded-xl p-4 space-y-4"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E5DACD]/60 pb-3 gap-2">
                          <div className="space-y-1">
                            <span className="text-[9px] text-[#8A786D] block font-bold">ORDER NUMBER</span>
                            <span className="font-mono text-xs font-bold text-[#B84D28]">{order.orderNumber}</span>
                          </div>
                          <div className="flex gap-4 text-xs text-[#5A4438]">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#C59B27]" />
                              <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold">
                              <Package className="w-3.5 h-3.5 text-[#C59B27]" />
                              <span className={`uppercase tracking-wider text-[10px] ${
                                order.status === 'Delivered' ? 'text-green-700' :
                                order.status === 'Shipped' ? 'text-purple-700' :
                                'text-[#1E5631]'
                              }`}>{order.status}</span>
                            </div>
                          </div>
                        </div>

                        {/* Items in order */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 text-xs">
                              <div className="relative w-12 h-15 rounded overflow-hidden bg-[#FAF7EC] border border-[#E5DACD]/40">
                                <Image
                                  src={item.image || '/assets/about/story_tradition.jpg'}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif-luxury text-sm font-normal text-[#6A2B15] truncate">{item.name}</h4>
                                <p className="text-[10px] text-[#8A786D]">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-[#6A2B15]">₹{item.price.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipment & Tracking Information */}
                        {(order.trackingId || order.trackingUrl || order.status === 'Shipped' || order.status === 'Delivered') ? (
                          <div className="bg-[#FAF7F2] border border-[#E5DACD] rounded-lg p-3.5 space-y-2.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                              <div className="flex items-start sm:items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-[#6A2B15]/10 text-[#6A2B15] shrink-0">
                                  <Truck className="w-4 h-4 text-[#8C3B1F]" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#6A2B15]">
                                      {order.status === 'Delivered'
                                        ? 'Delivered'
                                        : order.status === 'Shipped'
                                        ? 'Shipped & In Transit'
                                        : 'Shipment Scheduled'}
                                    </span>
                                    {order.courierPartner && (
                                      <span className="text-[10px] font-semibold text-[#8C3B1F] bg-[#E5DACD]/40 px-2 py-0.5 rounded-full">
                                        {order.courierPartner}
                                      </span>
                                    )}
                                  </div>
                                  {order.shippedAt && (
                                    <p className="text-[10px] text-[#8A786D] mt-0.5">
                                      Dispatched: {new Date(order.shippedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {order.trackingUrl && (
                                <a
                                  href={order.trackingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-[11px] font-bold uppercase tracking-wider rounded-md transition shadow-sm hover:shadow shrink-0 cursor-pointer"
                                >
                                  <span>Track Package</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>

                            {order.trackingId && (
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E5DACD]/60 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] uppercase font-bold text-[#8A786D]">AWB / Tracking ID:</span>
                                  <span className="font-mono font-bold text-[#6A2B15] bg-white px-2 py-0.5 rounded border border-[#E5DACD] text-xs">
                                    {order.trackingId}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(order.trackingId);
                                    setCopiedTrackingId(order.trackingId);
                                    setTimeout(() => setCopiedTrackingId(null), 2000);
                                  }}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C3B1F] hover:underline cursor-pointer"
                                >
                                  {copiedTrackingId === order.trackingId ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                      <span className="text-green-700">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy ID</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : order.status === 'Processing' ? (
                          <div className="bg-[#FAF7F2]/60 border border-dashed border-[#E5DACD] rounded-lg p-2.5 flex items-center gap-2 text-xs text-[#8A786D]">
                            <Package className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                            <span className="text-[11px]">
                              Order is being prepared and hand-checked for dispatch. Tracking details will be updated once shipped.
                            </span>
                          </div>
                        ) : null}

                        {/* Total Invoice */}
                        <div className="flex justify-between items-baseline pt-2 border-t border-[#E5DACD]/40">
                          <span className="text-[9px] uppercase font-bold text-[#8A786D]">Total Amount Invoice</span>
                          <span className="text-sm font-bold text-[#6A2B15]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3 bg-[#FFFFF0]/50 border border-dashed border-[#E5DACD] rounded-xl">
                    <ShoppingBag className="w-8 h-8 text-[#C59B27]/60 mx-auto" />
                    <div>
                      <h4 className="text-sm font-serif-luxury text-[#6A2B15] font-semibold">No Orders Found</h4>
                      <p className="text-[10px] text-[#8A786D] mt-1 max-w-xs mx-auto">
                        There are no orders registered under the email <span className="font-bold text-[#B84D28]">{userSession.email}</span>. Fill out your details in checkout to see them here!
                      </p>
                    </div>
                    <div className="pt-2">
                      <Link
                        href="/shop"
                        className="inline-flex bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-[9.5px] uppercase font-bold tracking-wider px-4 py-2 rounded transition-colors"
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
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFF0]">
        <p className="text-xs text-[#8A786D] animate-pulse uppercase tracking-wider font-bold">Loading Profile...</p>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
