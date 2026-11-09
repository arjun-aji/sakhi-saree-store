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
  Home, CreditCard, ShoppingBag, Loader2, Sparkles, AlertCircle, Smartphone,
  Plus, MapPin, Check, Edit2, Trash2
} from 'lucide-react';
import { calculateShippingFee, DEFAULT_SHIPPING_RATES } from '@/lib/shipping';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  // Authentication & Pre-fill details
  const [userSession, setUserSession] = useState(null);

  // Address Book States (Amazon/Flipkart style)
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isSavingNewAddress, setIsSavingNewAddress] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true);

  // New Address Form State
  const [newAddressForm, setNewAddressForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home',
    isDefault: false,
  });

  // Active Checkout Form Fields (Used for payment & order placement)
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
  const [isPaying, setIsPaying] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Helper to apply an address to formData
  const applyAddressToForm = (addr, email) => {
    const nameParts = (addr.name || '').trim().split(' ');
    setFormData(prev => ({
      ...prev,
      firstName: nameParts[0] || prev.firstName || '',
      lastName: nameParts.slice(1).join(' ') || prev.lastName || '',
      email: email || prev.email || '',
      phone: addr.phone || prev.phone || '',
      address: addr.address || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
    }));
  };

  useEffect(() => {
    // Enforce profile session login
    const session = localStorage.getItem('sakhi_user_session');
    if (!session) {
      router.push('/profile?redirect=/checkout');
      return;
    }

    try {
      const parsed = JSON.parse(session);
      setUserSession(parsed);

      // Pre-fill initial customer info
      const nameParts = parsed.name ? parsed.name.split(' ') : ['', ''];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        address: parsed.address || '',
        city: parsed.city || '',
        state: parsed.state || '',
        pincode: parsed.pincode || '',
      }));

      // Fetch latest customer addresses from server
      const fetchCustomerAddresses = async () => {
        try {
          const res = await fetch(`/api/customers?email=${encodeURIComponent(parsed.email)}`);
          const data = await res.json();
          if (data.success && data.customer) {
            const cust = data.customer;
            const addresses = cust.savedAddresses || [];
            setSavedAddresses(addresses);

            if (addresses.length > 0) {
              const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
              setSelectedAddressId(defaultAddr.id);
              applyAddressToForm(defaultAddr, cust.email);
              setShowNewAddressForm(false);
            } else if (cust.address) {
              // Create default from primary address
              const primaryAddr = {
                id: `addr_${Date.now()}`,
                name: cust.name,
                phone: cust.phone || '',
                address: cust.address,
                city: cust.city || '',
                state: cust.state || '',
                pincode: cust.pincode || '',
                addressType: 'Home',
                isDefault: true
              };
              setSavedAddresses([primaryAddr]);
              setSelectedAddressId(primaryAddr.id);
              applyAddressToForm(primaryAddr, cust.email);
              setShowNewAddressForm(false);
            } else {
              setShowNewAddressForm(true);
            }
          }
        } catch (err) {
          console.warn('Failed to load saved addresses:', err);
        }
      };

      fetchCustomerAddresses();
    } catch (err) {
      console.error('Failed to parse user session:', err);
    }
  }, [router]);

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingRates, setShippingRates] = useState(DEFAULT_SHIPPING_RATES);

  // Load Shipping Settings
  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.shippingRates) {
          setShippingRates(data.settings.shippingRates);
        }
      })
      .catch(err => console.error('Error fetching settings in checkout:', err));
  }, []);

  useEffect(() => {
    const savedCode = localStorage.getItem('sakhi_coupon_code');
    if (savedCode && subtotal > 0) {
      const email = userSession?.email || '';
      fetch('/api/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: savedCode, customerEmail: email, subtotal })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.valid) {
          setCouponCode(savedCode);
          setDiscount(data.discount);
          localStorage.setItem('sakhi_coupon_discount', String(data.discount));
        } else {
          setCouponCode('');
          setDiscount(0);
          localStorage.removeItem('sakhi_coupon_code');
          localStorage.removeItem('sakhi_coupon_discount');
        }
      })
      .catch(() => {
        const savedDiscount = localStorage.getItem('sakhi_coupon_discount');
        if (savedDiscount) {
          setCouponCode(savedCode);
          setDiscount(Number(savedDiscount));
        }
      });
    } else {
      setDiscount(0);
      setCouponCode('');
    }
  }, [subtotal, userSession?.email]);

  // Dynamic Shipping Fee calculated from shipping address pincode
  const shippingInfo = useMemo(() => {
    return calculateShippingFee(formData.pincode, subtotal, shippingRates);
  }, [formData.pincode, subtotal, shippingRates]);

  const shippingFee = shippingInfo.fee;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    applyAddressToForm(addr, userSession?.email);
  };

  // Save new address from checkout
  const handleSaveAndDeliverNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddressForm.address || !newAddressForm.pincode) return;

    setIsSavingNewAddress(true);
    const fullName = `${newAddressForm.firstName} ${newAddressForm.lastName}`.trim() || userSession?.name || 'Customer';
    const newAddrObj = {
      id: `addr_${Date.now()}`,
      name: fullName,
      phone: newAddressForm.phone || userSession?.phone || '',
      address: newAddressForm.address,
      city: newAddressForm.city || '',
      state: newAddressForm.state || '',
      pincode: newAddressForm.pincode || '',
      addressType: newAddressForm.addressType || 'Home',
      isDefault: newAddressForm.isDefault || (savedAddresses.length === 0),
    };

    try {
      if (saveToProfile && userSession?.email) {
        const res = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userSession.email,
            newAddress: newAddrObj
          })
        });
        const data = await res.json();
        if (data.success && data.customer) {
          setSavedAddresses(data.customer.savedAddresses || []);
          // Sync localStorage
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
        } else {
          setSavedAddresses(prev => [...prev, newAddrObj]);
        }
      } else {
        setSavedAddresses(prev => [...prev, newAddrObj]);
      }

      setSelectedAddressId(newAddrObj.id);
      applyAddressToForm(newAddrObj, userSession?.email);
      setShowNewAddressForm(false);
      setNewAddressForm({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        addressType: 'Home',
        isDefault: false,
      });
    } catch (err) {
      console.error('Save address error:', err);
    } finally {
      setIsSavingNewAddress(false);
    }
  };

  // Load Razorpay Checkout Script
  useEffect(() => {
    const scriptId = 'razorpay-checkout-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleProceedToPayment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (cartItems.length === 0) return;

    if (!formData.address || !formData.pincode || !formData.phone) {
      setPaymentError('Please select or enter a complete delivery address with phone number.');
      return;
    }

    setPaymentError('');
    setIsPaying(true);
  };

  const handleInitiateRazorpayPayment = async () => {
    setPaymentError('');

    if (!window.Razorpay) {
      setPaymentError('Payment gateway script is loading. Please check your internet connection or refresh.');
      return;
    }

    setPaymentProcessing(true);

    try {
      // 1. Create Order on Server with Razorpay API
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customer: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone,
          },
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway.');
      }

      // 2. Configure Razorpay Standard Checkout (Handles UPI Apps, Cards, Netbanking)
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sakhi by Maya's",
        description: `Order of ${cartItems.length} Handcrafted Saree(s)`,
        image: '/assets/about/story_tradition.jpg',
        order_id: orderData.orderId,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          shipping_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          customer_email: formData.email,
        },
        theme: {
          color: '#6A2B15',
        },
        modal: {
          ondismiss: function () {
            setPaymentProcessing(false);
          },
        },
        // 3. Cryptographic Verification Callback
        handler: async function (response) {
          try {
            const formattedItems = cartItems.map((item) => ({
              productId: String(item.id || item._id || ''),
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            }));

            const verifyRes = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customerName: `${formData.firstName} ${formData.lastName}`.trim(),
                customerEmail: formData.email,
                customerPhone: formData.phone,
                shippingAddress: {
                  address: formData.address,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.pincode,
                },
                items: formattedItems,
                shippingFee: shippingFee,
                totalAmount: finalTotal,
                couponCode: couponCode || undefined,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setOrderSuccess(verifyData.order);
              clearCart();
            } else {
              setPaymentError(verifyData.error || 'Payment signature verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Order verification network error:', err);
            setPaymentError('Connection error while recording your verified payment. Please reach out to customer care.');
          } finally {
            setPaymentProcessing(false);
          }
        },
      };

      const rzpInstance = new window.Razorpay(options);

      rzpInstance.on('payment.failed', function (failResponse) {
        console.error('Razorpay payment failed:', failResponse.error);
        setPaymentError(failResponse.error.description || 'Payment was unsuccessful or cancelled by user.');
        setPaymentProcessing(false);
      });

      rzpInstance.open();
    } catch (err) {
      console.error('Razorpay checkout error:', err);
      setPaymentError(err.message || 'Payment processing failed. Please try again.');
      setPaymentProcessing(false);
    }
  };

  // SUCCESS SCREEN
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFFF0]">
        <AnnouncementBar />
        <Navbar />

        <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-16 sm:px-6">
          <div className="bg-[#F3EADF]/90 border border-[#E5DACD] rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-[#1E5631]/10 rounded-full flex items-center justify-center mx-auto text-[#1E5631]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#1E5631] bg-green-50 px-3 py-1 rounded-full border border-green-200">
                Payment Verified &amp; Confirmed
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#6A2B15] font-normal pt-2">
                Thank You for Your Order!
              </h1>
              <p className="text-xs text-[#5A4438] max-w-md mx-auto">
                Your payment was successfully authenticated via Razorpay. Your handcrafted sarees are now being prepared for shipping.
              </p>
            </div>

            <div className="border-t border-b border-[#E5DACD]/80 py-4 text-left space-y-2.5 text-xs text-[#5A4438]">
              <div className="flex justify-between">
                <span className="font-semibold text-[#6A2B15]">Order Number:</span>
                <span className="font-mono text-[#B84D28] font-bold">{orderSuccess.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#6A2B15]">Payment ID:</span>
                <span className="font-mono text-[11px] text-[#6A2B15]">{orderSuccess.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#6A2B15]">Customer:</span>
                <span>{orderSuccess.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#6A2B15]">Email:</span>
                <span>{orderSuccess.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#6A2B15]">Delivering To:</span>
                <span className="truncate max-w-[200px]">{orderSuccess.shippingAddress?.address}, {orderSuccess.shippingAddress?.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#6A2B15]">Amount Paid:</span>
                <span className="font-bold text-[#1E5631]">₹{orderSuccess.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/profile"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-xs font-bold tracking-[0.2em] uppercase py-3.5 rounded-md transition-colors shadow-md cursor-pointer"
              >
                <span>TRACK IN PROFILE</span>
              </Link>
              <Link
                href="/shop"
                className="flex-1 inline-flex items-center justify-center gap-2 border border-[#8C3B1F] text-[#8C3B1F] hover:bg-[#FAF7F2] text-xs font-bold tracking-[0.2em] uppercase py-3.5 rounded-md transition-colors shadow-xs cursor-pointer"
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
    <div className="min-h-screen flex flex-col bg-[#FFFFF0]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center mb-8">
          <nav className="flex justify-center items-center gap-2 text-[10px] sm:text-xs text-[#8A786D] mb-2 font-medium uppercase tracking-wider">
            <Link href="/cart" className="hover:text-[#8C3B1F] transition-colors">Cart</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#8C3B1F] font-semibold">{isPaying ? 'Payment' : 'Delivery & Address'}</span>
          </nav>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#6A2B15] font-normal leading-tight tracking-tight">
            {isPaying ? 'Complete Payment' : 'Select Delivery Address'}
          </h1>
          <div className="flex items-center justify-center gap-3 my-2">
            <span className="h-[0.75px] w-12 bg-[#C59B27]/40" />
            <span className="text-[#C59B27] text-[10px]">✦</span>
            <span className="h-[0.75px] w-12 bg-[#C59B27]/40" />
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-[#F3EADF]/60 rounded-2xl border border-[#E5DACD] max-w-2xl mx-auto my-6 space-y-4">
            <h2 className="font-serif-luxury text-2xl font-medium text-[#6A2B15]">Your cart is empty</h2>
            <p className="text-xs text-[#5A4438]">Add products to your cart before proceeding to checkout.</p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-xs font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-md shadow-xs transition-colors"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : !isPaying ? (
          
          /* ── STEP 1: DELIVERY ADDRESS SELECTION (Amazon / Flipkart Style) ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
            
            <div className="lg:col-span-7 space-y-6">
              
              {/* Address Selection Container */}
              <div className="bg-[#F3EADF]/80 border border-[#E5DACD] rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#E5DACD]/80 pb-3">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#6A2B15] flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#C59B27]" />
                    <span>DELIVERY ADDRESS</span>
                  </h2>

                  {savedAddresses.length > 0 && !showNewAddressForm && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewAddressForm({
                          firstName: userSession?.name?.split(' ')[0] || '',
                          lastName: userSession?.name?.split(' ').slice(1).join(' ') || '',
                          phone: userSession?.phone || '',
                          address: '',
                          city: '',
                          state: '',
                          pincode: '',
                          addressType: 'Home',
                          isDefault: false,
                        });
                        setShowNewAddressForm(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#8C3B1F] hover:text-[#6A2B15] bg-white border border-[#DCD0C5] hover:bg-[#FAF7F2] px-3 py-1.5 rounded-md transition shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Address</span>
                    </button>
                  )}
                </div>

                {/* CASE A: Saved Addresses List */}
                {savedAddresses.length > 0 && !showNewAddressForm ? (
                  <div className="space-y-3.5">
                    <p className="text-xs text-[#8A786D]">
                      Select an address from your saved profile or add a new shipping location:
                    </p>

                    <div className="space-y-3">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => handleSelectAddress(addr)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                              isSelected
                                ? 'bg-[#FFFFF0] border-2 border-[#8C3B1F] shadow-sm'
                                : 'bg-white/80 border-[#E5DACD] hover:bg-[#FFFFF0] hover:border-[#D5C7B7]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                {/* Radio Indicator */}
                                <div className="mt-1">
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                    isSelected ? 'border-[#8C3B1F] bg-[#8C3B1F]' : 'border-[#C5B9AD] bg-white'
                                  }`}>
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-sm text-[#6A2B15]">{addr.name}</span>
                                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-[#FAF7F2] text-[#8C3B1F] border border-[#E5DACD]">
                                      {addr.addressType || 'Home'}
                                    </span>
                                    {addr.isDefault && (
                                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-green-50 text-green-700 border border-green-200">
                                        Default
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-[#5A4438] leading-relaxed">
                                    {addr.address}, {addr.city}, {addr.state} — <span className="font-bold text-[#8C3B1F]">{addr.pincode}</span>
                                  </p>

                                  <p className="text-xs text-[#8A786D] pt-0.5">
                                    Mobile: <span className="font-semibold text-[#6A2B15]">{addr.phone}</span>
                                  </p>
                                </div>
                              </div>

                              {isSelected && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E5631] bg-green-50 border border-green-200 px-2.5 py-1 rounded-md shrink-0">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Selected</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action button to proceed with selected address */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleProceedToPayment}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-xs font-bold tracking-[0.2em] uppercase py-3.5 rounded-md transition-colors shadow-md group cursor-pointer"
                      >
                        <span>DELIVER TO THIS ADDRESS</span>
                        <ArrowRight className="w-4 h-4 text-[#FFFFF0] group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ) : (
                  
                  /* CASE B: Add / Enter New Delivery Address Form */
                  <form onSubmit={handleSaveAndDeliverNewAddress} className="space-y-4">
                    <div className="flex items-center justify-between pb-1 border-b border-[#E5DACD]/60">
                      <span className="text-xs font-bold text-[#6A2B15] uppercase tracking-wider">
                        {savedAddresses.length > 0 ? 'Add a New Delivery Address' : 'Enter Your Delivery Address'}
                      </span>
                      {savedAddresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowNewAddressForm(false)}
                          className="text-xs font-bold text-[#8C3B1F] hover:underline cursor-pointer"
                        >
                          Cancel &amp; Use Saved Address
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">First Name *</label>
                        <input
                          required
                          type="text"
                          value={newAddressForm.firstName}
                          onChange={(e) => setNewAddressForm(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="e.g. Priya"
                          className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F] transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Last Name *</label>
                        <input
                          required
                          type="text"
                          value={newAddressForm.lastName}
                          onChange={(e) => setNewAddressForm(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="e.g. Sharma"
                          className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          disabled
                          value={userSession?.email || formData.email}
                          className="w-full bg-[#FAF7F2] border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#8A786D] cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Phone Number *</label>
                        <input
                          required
                          type="tel"
                          value={newAddressForm.phone}
                          onChange={(e) => setNewAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="10-digit mobile number"
                          className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Street Address / House / Flat *</label>
                      <input
                        required
                        type="text"
                        value={newAddressForm.address}
                        onChange={(e) => setNewAddressForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="House/flat no, building name, street area, landmark"
                        className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">City *</label>
                        <input
                          required
                          type="text"
                          value={newAddressForm.city}
                          onChange={(e) => setNewAddressForm(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="e.g. Mumbai"
                          className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F] transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">State *</label>
                        <input
                          required
                          type="text"
                          value={newAddressForm.state}
                          onChange={(e) => setNewAddressForm(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="e.g. Maharashtra"
                          className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F] transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Pincode *</label>
                        <input
                          required
                          type="text"
                          value={newAddressForm.pincode}
                          onChange={(e) => setNewAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                          placeholder="6-digit PIN"
                          className="w-full bg-white border border-[#DCD0C5] rounded-md px-3 py-2 text-xs text-[#6A2B15] focus:outline-none focus:border-[#8C3B1F] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Address Type and Save Options */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-[#E5DACD]/60">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-[#8C3B1F] uppercase tracking-wider">Address Type:</span>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="checkoutAddressType"
                            checked={newAddressForm.addressType === 'Home'}
                            onChange={() => setNewAddressForm(prev => ({ ...prev, addressType: 'Home' }))}
                            className="accent-[#8C3B1F]"
                          />
                          <span>Home</span>
                        </label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="checkoutAddressType"
                            checked={newAddressForm.addressType === 'Work'}
                            onChange={() => setNewAddressForm(prev => ({ ...prev, addressType: 'Work' }))}
                            className="accent-[#8C3B1F]"
                          />
                          <span>Work</span>
                        </label>
                      </div>

                      <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-[#6A2B15]">
                        <input
                          type="checkbox"
                          checked={saveToProfile}
                          onChange={(e) => setSaveToProfile(e.target.checked)}
                          className="accent-[#8C3B1F] rounded"
                        />
                        <span>Save this address for future orders</span>
                      </label>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={isSavingNewAddress}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] text-xs font-bold tracking-[0.2em] uppercase py-3.5 rounded-md transition-colors shadow-md group cursor-pointer disabled:opacity-50"
                      >
                        {isSavingNewAddress ? (
                          <span>SAVING ADDRESS...</span>
                        ) : (
                          <>
                            <span>USE THIS ADDRESS &amp; PROCEED</span>
                            <ArrowRight className="w-4 h-4 text-[#FFFFF0] group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Summary Block */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              <div className="bg-[#F3EADF]/80 border border-[#E5DACD] rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#6A2B15] border-b border-[#E5DACD] pb-3">Order Details</h2>

                <div className="divide-y divide-[#E5DACD]/60 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center gap-3">
                      <div className="relative w-12 h-15 bg-[#FAF7EC] rounded overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-medium text-[#6A2B15] truncate">{item.name}</h4>
                        <p className="text-[10px] text-[#8A786D]">Qty: {item.quantity} &nbsp;•&nbsp; {item.fabric || 'Pure Silk'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#6A2B15]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs pt-3 border-t border-[#E5DACD]">
                  <div className="flex justify-between text-[#5A4438]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#6A2B15]">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#B84D28] font-medium">
                      <span>Discount ({couponCode})</span>
                      <span>- ₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#5A4438] items-center">
                    <div>
                      <span>Delivery Fee</span>
                      <span className="block text-[10px] text-[#8A786D]">{shippingInfo.region}</span>
                    </div>
                    {shippingInfo.isFree ? (
                      <span className="text-[#1E5631] font-bold uppercase">FREE</span>
                    ) : (
                      <span className="font-semibold text-[#6A2B15]">₹{shippingFee}</span>
                    )}
                  </div>
                  <div className="pt-2 border-t border-[#E5DACD]/80 flex justify-between items-baseline">
                    <span className="font-bold text-[#6A2B15]">Total Amount</span>
                    <span className="font-serif-luxury text-xl font-bold text-[#6A2B15]">₹{finalTotal.toLocaleString('en-IN')}</span>
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
          
          /* ── STEP 2: SECURE RAZORPAY PAYMENT SCREEN ── */
          <div className="max-w-2xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 bg-[#F3EADF]/85 border border-[#E5DACD] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-300">
            
            {/* Details Left */}
            <div className="md:col-span-5 bg-[#6A2B15] text-[#FFFFF0] p-6 space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#C59B27] font-bold block">SECURE PAYMENT</span>
                <h3 className="font-serif-luxury text-2xl font-normal mt-1 leading-tight">Sakhi Checkout</h3>
                
                <div className="space-y-3.5 pt-6 text-xs text-[#FAF7EC]">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="opacity-75">Customer:</span>
                    <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="opacity-75">Phone:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                  <div className="flex flex-col border-b border-white/10 pb-2">
                    <span className="opacity-75">Deliver to:</span>
                    <span className="font-medium text-[11px] leading-tight mt-0.5">
                      {formData.address}, {formData.city} - {formData.pincode}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="opacity-75">Amount Due:</span>
                    <span className="font-bold text-[#C59B27] text-sm">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-[#FAF7EC]/80">
                  <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
                  <span>256-bit Encrypted SSL Gateway</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#FAF7EC]/80">
                  <Smartphone className="w-4 h-4 text-[#C59B27]" />
                  <span>UPI, GPay, PhonePe, Cards &amp; Netbanking</span>
                </div>
              </div>
            </div>

            {/* Portal Action Right */}
            <div className="md:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#6A2B15]/10 flex items-center justify-center text-[#6A2B15] mb-1">
                <CreditCard className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 max-w-sm">
                <h3 className="font-serif-luxury text-xl font-bold text-[#6A2B15]">Razorpay Gateway</h3>
                <p className="text-xs text-[#8A786D] leading-relaxed">
                  Click below to open the payment portal. Supports instant UPI redirection (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking.
                </p>
              </div>

              {paymentError && (
                <div className="w-full p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 text-left">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                  <p>{paymentError}</p>
                </div>
              )}

              <div className="w-full space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleInitiateRazorpayPayment}
                  disabled={paymentProcessing}
                  className="w-full bg-[#6A2B15] hover:bg-[#8C3B1F] disabled:bg-[#6A2B15]/50 text-[#FFFFF0] py-3.5 text-xs font-bold tracking-widest uppercase transition-all rounded shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {paymentProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>CONNECTING GATEWAY...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>PAY ₹{finalTotal.toLocaleString('en-IN')} NOW</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setIsPaying(false); setPaymentError(''); }}
                  disabled={paymentProcessing}
                  className="w-full border border-[#C5B9AD] text-[#8C3B1F] hover:bg-[#8C3B1F]/5 disabled:opacity-50 text-xs font-bold tracking-widest uppercase py-3 rounded transition-colors cursor-pointer"
                >
                  Change Delivery Address
                </button>
              </div>

              <p className="text-[10px] text-[#A08D80]">
                Order is confirmed and registered only after successful payment verification.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
