'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  MessageSquare,
  Tag,
  FileText,
  BarChart3,
  Settings,
  Search,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Sparkles,
  HelpCircle,
  Package,
  Upload,
  Mail,
  RefreshCw,
  Eye,
  PlusCircle,
  Percent,
  PercentSquare,
  Menu,
  SlidersHorizontal,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  Copy,
  CheckCircle2,
  ExternalLink,
  Gift
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState(''); // Used for sub-sections e.g. add-product
  
  // Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filterConfig, setFilterConfig] = useState({
    categories: [],
    fabrics: [],
    colors: []
  });
  
  // UI & Loading States
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Selected items for view/edit modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    courierPartner: '',
    trackingId: '',
    trackingUrl: '',
    status: 'Shipped'
  });
  const [savingTracking, setSavingTracking] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingFaq, setEditingFaq] = useState(null);

  // Form States
  const [productForm, setProductForm] = useState({
    name: '', price: '', originalPrice: '', image: '', category: 'Banarasi', fabric: '', color: '', stock: 10, isNew: false, isBestSeller: false, badge: '', description: '', images: [], gridImage: ''
  });
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'Percentage',
    discountValue: 30,
    minOrderAmount: 1499,
    maxDiscount: '',
    expiryDate: '',
    targetType: 'all',
    minCustomerSpent: 5000,
    assignedTo: '',
    description: '',
    active: true
  });
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [savingCoupon, setSavingCoupon] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '', summary: '', content: '', image: '', author: 'Admin'
  });
  const [faqForm, setFaqForm] = useState({
    question: '', answer: '', category: 'General'
  });
  const [shippingRates, setShippingRates] = useState({
    keralaLocal: 49,
    panIndiaStandard: 49,
    international: 1500,
    freeShippingThreshold: 0,
    enableFreeShipping: false
  });
  const [savingShippingRates, setSavingShippingRates] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch all resources
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Products
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData.success) setProducts(prodData.products);

      // Fetch Orders
      const orderRes = await fetch('/api/orders');
      const orderData = await orderRes.json();
      if (orderData.success) setOrders(orderData.orders);

      // Fetch Reviews
      const revRes = await fetch('/api/reviews');
      const revData = await revRes.json();
      if (revData.success) setReviews(revData.reviews);

      // Fetch Coupons
      const coupRes = await fetch('/api/coupons');
      const coupData = await coupRes.json();
      if (coupData.success) setCoupons(coupData.coupons);

      // Fetch Blogs
      const blogRes = await fetch('/api/blogs');
      const blogData = await blogRes.json();
      if (blogData.success) setBlogs(blogData.blogs);

      // Fetch FAQs
      const faqRes = await fetch('/api/faqs');
      const faqData = await faqRes.json();
      if (faqData.success) setFaqs(faqData.faqs);

      // Fetch Contact Messages
      const msgRes = await fetch('/api/contact-messages');
      const msgData = await msgRes.json();
      if (msgData.success) setMessages(msgData.messages);

      // Fetch Customers
      const custRes = await fetch('/api/customers');
      const custData = await custRes.json();
      if (custData.success) setCustomers(custData.customers);

      // Fetch Filter Config
      const filterRes = await fetch('/api/filter-config');
      const filterData = await filterRes.json();
      if (filterData.success) {
        setFilterConfig({
          categories: filterData.categories || [],
          fabrics: filterData.fabrics || [],
          colors: filterData.colors || []
        });
      }

      // Fetch Shipping Settings
      const settingsRes = await fetch('/api/settings');
      const settingsData = await settingsRes.json();
      if (settingsData.success && settingsData.settings?.shippingRates) {
        setShippingRates(settingsData.settings.shippingRates);
      }
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      showNotification('Failed to fetch store data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveShippingRates = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSavingShippingRates(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingRates })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Shipping rates updated successfully!');
        if (data.settings?.shippingRates) {
          setShippingRates(data.settings.shippingRates);
        }
      } else {
        showNotification(data.error || 'Failed to update shipping rates', 'error');
      }
    } catch (err) {
      showNotification('Failed to update shipping rates', 'error');
    } finally {
      setSavingShippingRates(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setTrackingForm({
        courierPartner: selectedOrder.courierPartner || '',
        trackingId: selectedOrder.trackingId || '',
        trackingUrl: selectedOrder.trackingUrl || '',
        status: selectedOrder.status || 'Processing'
      });
    }
  }, [selectedOrder]);

  // Seed DB handler
  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification('Database seeded successfully with premium mock datasets!');
        await fetchData();
      } else {
        showNotification(data.error || 'Failed to seed database', 'error');
      }
    } catch (error) {
      showNotification('Error triggering database seeder', 'error');
    } finally {
      setSeeding(false);
    }
  };

  // Clear DB handler
  const handleClearDatabase = async () => {
    if (!window.confirm('Are you sure you want to clear all dummy and store data from the database? This action is irreversible.')) {
      return;
    }
    setClearing(true);
    try {
      const res = await fetch('/api/admin/clear', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification('Database cleared successfully! All dummy data has been removed.');
        await fetchData();
      } else {
        showNotification(data.error || 'Failed to clear database', 'error');
      }
    } catch (error) {
      showNotification('Error triggering database clearing', 'error');
    } finally {
      setClearing(false);
    }
  };

  // Image upload handler using our Cloudinary upload API
  const handleImageUpload = async (e, formType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result })
        });
        const data = await res.json();
        if (data.success) {
          if (formType === 'product') {
            setProductForm(prev => ({ ...prev, image: data.url }));
          } else if (formType === 'blog') {
            setBlogForm(prev => ({ ...prev, image: data.url }));
          }
          showNotification('Image uploaded successfully to Cloudinary!');
        } else {
          showNotification(data.error || 'Image upload failed', 'error');
        }
      } catch (err) {
        showNotification('Failed to upload image to server', 'error');
      } finally {
        setUploadingImage(false);
      }
    };
  };

  // ──── CRUD HANDLERS ────

  // Product CRUD
  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      const body = editingProduct ? { ...productForm, _id: editingProduct._id } : productForm;
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        setEditingProduct(null);
        setProductForm({ name: '', price: '', originalPrice: '', image: '', category: 'Banarasi', fabric: '', color: '', stock: 10, isNew: false, isBestSeller: false, badge: '', description: '', images: [], gridImage: '' });
        setSubTab('');
        fetchData();
      } else {
        showNotification(data.error || 'Failed to save product', 'error');
      }
    } catch (err) {
      showNotification('Error saving product details', 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Product deleted successfully');
        fetchData();
      } else {
        showNotification(data.error || 'Failed to delete product', 'error');
      }
    } catch (err) {
      showNotification('Error deleting product', 'error');
    }
  };

  // Order CRUD
  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Order status updated to ${status}`);
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder(data.order);
        }
        fetchData();

        // If changed to Shipped and tracking ID is not yet entered, prompt admin to enter tracking
        if (status === 'Shipped' && (!data.order.trackingId || !data.order.trackingUrl)) {
          setSelectedOrder(data.order);
          showNotification('Order marked as Shipped. Please add shipment tracking details.', 'warning');
        }
      } else {
        showNotification(data.error || 'Failed to update order status', 'error');
      }
    } catch (err) {
      showNotification('Failed to update order status', 'error');
    }
  };

  const updateOrderTracking = async (id, trackingData) => {
    try {
      setSavingTracking(true);
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...trackingData })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Shipment tracking details saved successfully!');
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder(data.order);
        }
        fetchData();
      } else {
        showNotification(data.error || 'Failed to save tracking details', 'error');
      }
    } catch (err) {
      showNotification('Failed to save tracking details', 'error');
    } finally {
      setSavingTracking(false);
    }
  };

  // Review CRUD
  const updateReviewStatus = async (id, status) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Review ${status.toLowerCase()} successfully`);
        fetchData();
      }
    } catch (err) {
      showNotification('Failed to update review status', 'error');
    }
  };

  // Contact CRUD
  const deleteContactMessage = async (id) => {
    if (!confirm('Delete this contact submission?')) return;
    try {
      const res = await fetch(`/api/contact-messages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Message deleted successfully');
        fetchData();
      }
    } catch (err) {
      showNotification('Failed to delete message', 'error');
    }
  };

  const openCouponModal = (targetCustomer = null, defaultTargetType = 'all') => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    const dateStr = defaultDate.toISOString().split('T')[0];

    if (targetCustomer) {
      const firstName = (targetCustomer.name || 'VIP').trim().split(' ')[0].toUpperCase();
      setCouponForm({
        code: `SAKHI-${firstName}-${Math.floor(100 + Math.random() * 900)}`,
        discountType: 'Percentage',
        discountValue: 30,
        minOrderAmount: 1499,
        maxDiscount: 500,
        expiryDate: dateStr,
        targetType: 'specific',
        minCustomerSpent: 0,
        assignedTo: targetCustomer.email,
        description: `Exclusive 30% OFF gift for ${targetCustomer.name} on orders above ₹1,499`,
        active: true
      });
    } else {
      setCouponForm({
        code: `SAKHI-SEASON-${Math.floor(100 + Math.random() * 900)}`,
        discountType: 'Percentage',
        discountValue: 30,
        minOrderAmount: 1499,
        maxDiscount: 500,
        expiryDate: dateStr,
        targetType: defaultTargetType,
        minCustomerSpent: 5000,
        assignedTo: '',
        description: 'Seasonal promotion: 30% OFF on orders above ₹1,499 (Single-use per customer)',
        active: true
      });
    }
    setShowCouponModal(true);
  };

  // Coupon CRUD
  const saveCoupon = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      setSavingCoupon(true);
      const body = editingCoupon ? { ...couponForm, _id: editingCoupon._id } : couponForm;
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(editingCoupon ? 'Coupon updated successfully' : `Coupon '${couponForm.code}' created successfully!`);
        setEditingCoupon(null);
        setShowCouponModal(false);
        setCouponForm({
          code: '',
          discountType: 'Percentage',
          discountValue: 30,
          minOrderAmount: 1499,
          maxDiscount: '',
          expiryDate: '',
          targetType: 'all',
          minCustomerSpent: 5000,
          assignedTo: '',
          description: '',
          active: true
        });
        setSubTab('');
        fetchData();
      } else {
        showNotification(data.error || 'Failed to save coupon', 'error');
      }
    } catch (err) {
      showNotification('Failed to save coupon', 'error');
    } finally {
      setSavingCoupon(false);
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
      showNotification('Coupon deleted');
      fetchData();
    } catch (err) {
      showNotification('Failed to delete coupon', 'error');
    }
  };

  // Blog CRUD
  const saveBlog = async (e) => {
    e.preventDefault();
    try {
      const body = editingBlog ? { ...blogForm, _id: editingBlog._id } : blogForm;
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Blog post saved successfully');
        setEditingBlog(null);
        setBlogForm({ title: '', summary: '', content: '', image: '', author: 'Admin' });
        setSubTab('');
        fetchData();
      }
    } catch (err) {
      showNotification('Failed to save blog post', 'error');
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
      showNotification('Blog post deleted');
      fetchData();
    } catch (err) {
      showNotification('Failed to delete blog post', 'error');
    }
  };

  // FAQ CRUD
  const saveFaq = async (e) => {
    e.preventDefault();
    try {
      const body = editingFaq ? { ...faqForm, _id: editingFaq._id } : faqForm;
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showNotification('FAQ saved successfully');
        setEditingFaq(null);
        setFaqForm({ question: '', answer: '', category: 'General' });
        setSubTab('');
        fetchData();
      }
    } catch (err) {
      showNotification('Failed to save FAQ', 'error');
    }
  };

  const deleteFaq = async (id) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await fetch(`/api/faqs?id=${id}`, { method: 'DELETE' });
      showNotification('FAQ deleted');
      fetchData();
    } catch (err) {
      showNotification('Failed to delete FAQ', 'error');
    }
  };

  const saveFilterConfig = async (updatedConfig) => {
    try {
      const res = await fetch('/api/filter-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig)
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Filter settings updated successfully');
        setFilterConfig({
          categories: data.config.categories || [],
          fabrics: data.config.fabrics || [],
          colors: data.config.colors || []
        });
        fetchData();
      }
    } catch (err) {
      showNotification('Failed to update filter settings', 'error');
    }
  };

  // Calculate quick metrics for Dashboard Overview
  const totalRevenue = orders.reduce((sum, order) => order.status !== 'Cancelled' ? sum + order.totalAmount : sum, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const customersCount = customers.length || new Set(orders.map(o => o.customerEmail)).size;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2625] flex flex-col md:flex-row antialiased font-sans">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 transform transition-all duration-300 border ${
          notification.type === 'error' ? 'bg-[#9E2A2B] border-[#801F20]' : 'bg-[#1E5E3A] border-[#133F26]'
        }`}>
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Mobile Top Bar */}
      <div className="flex md:hidden items-center justify-between bg-[#6A2B15] text-[#FFFFF0] px-4 py-3 border-b border-[#8C3B1F] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 rounded hover:bg-[#8C3B1F] text-[#E3C397] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif tracking-widest text-[#E3C397] font-bold text-sm">SAKHI CMS</span>
        </div>
        <button 
          onClick={fetchData} 
          className="p-1.5 rounded bg-[#8C3B1F] text-[#E3C397] hover:bg-[#521C21] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Mobile Drawer (Overlay and Menu) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay backdrop */}
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          ></div>
          
          {/* Drawer content */}
          <aside className="relative w-64 bg-[#6A2B15] text-[#FFFFF0] flex flex-col z-50 shadow-2xl h-full">
            <div className="p-4 border-b border-[#8C3B1F] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-serif tracking-widest text-[#E3C397] font-bold">SAKHI</span>
                <span className="text-[9px] tracking-widest text-[#D6C4B0] uppercase font-semibold">CMS Drawer</span>
              </div>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded hover:bg-[#8C3B1F] text-[#E3C397]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'products', label: 'Products', icon: ShoppingBag },
                { id: 'orders', label: 'Orders', icon: ShoppingCart },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'reviews', label: 'Reviews & Ratings', icon: MessageSquare },
                { id: 'marketing', label: 'Marketing', icon: Tag },
                { id: 'filters', label: 'Filter Settings', icon: SlidersHorizontal },
                { id: 'content', label: 'Content Hub', icon: FileText },
                { id: 'contact', label: 'Contact Messages', icon: Mail },
                { id: 'reports', label: 'Sales Reports', icon: BarChart3 },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSubTab('');
                      setIsMobileSidebarOpen(false); // Auto close drawer on click!
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#E3C397] text-[#6A2B15] font-bold shadow-md'
                        : 'text-[#D6C4B0] hover:bg-[#8C3B1F] hover:text-[#FFFFF0]'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#8C3B1F] bg-[#1F0A0C] text-xs flex flex-col gap-2 text-[#BCAFA1]">
              <div className="flex items-center justify-between">
                <span>Ver: 1.2.0</span>
                <button 
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    handleSeedDatabase();
                  }}
                  disabled={seeding || clearing}
                  className="px-3 py-1 rounded bg-[#9E2A2B] text-white hover:bg-[#BF3E40] transition disabled:opacity-50 text-[10px] font-bold uppercase tracking-wider"
                >
                  {seeding ? 'Seeding...' : 'Seed Data'}
                </button>
              </div>
              <button 
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  handleClearDatabase();
                }}
                disabled={seeding || clearing}
                className="w-full px-3 py-1.5 rounded bg-[#4E3F3B] text-white hover:bg-[#63514C] transition disabled:opacity-50 text-[10px] font-bold uppercase tracking-wider text-center"
              >
                {clearing ? 'Clearing...' : 'Clear All Dummy Data'}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ──── DESKTOP SIDEBAR ──── */}
      <aside className="hidden md:flex w-64 bg-[#6A2B15] text-[#FFFFF0] flex-shrink-0 flex-col border-r border-[#8C3B1F]">
        {/* Logo Banner */}
        <div className="p-6 border-b border-[#8C3B1F] flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-serif tracking-widest text-[#E3C397] font-bold">SAKHI</h1>
            <p className="text-[9px] tracking-widest text-[#D6C4B0] uppercase font-semibold">CMS &amp; Admin Panel</p>
          </div>
          <button 
            onClick={fetchData} 
            className="p-1.5 rounded bg-[#8C3B1F] text-[#E3C397] hover:bg-[#521C21] transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: ShoppingBag },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'reviews', label: 'Reviews & Ratings', icon: MessageSquare },
            { id: 'marketing', label: 'Marketing', icon: Tag },
            { id: 'filters', label: 'Filter Settings', icon: SlidersHorizontal },
            { id: 'content', label: 'Content Hub', icon: FileText },
            { id: 'contact', label: 'Contact Messages', icon: Mail },
            { id: 'reports', label: 'Sales Reports', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSubTab('');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#E3C397] text-[#6A2B15] font-bold shadow-md'
                    : 'text-[#D6C4B0] hover:bg-[#8C3B1F] hover:text-[#FFFFF0]'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Admin Meta */}
        <div className="p-4 border-t border-[#8C3B1F] bg-[#1F0A0C] text-xs flex flex-col gap-2 text-[#BCAFA1]">
          <div className="flex items-center justify-between">
            <span>Ver: 1.2.0</span>
            <button 
              onClick={handleSeedDatabase}
              disabled={seeding || clearing}
              className="px-3 py-1 rounded bg-[#9E2A2B] text-white hover:bg-[#BF3E40] transition disabled:opacity-50 text-[10px] font-bold uppercase tracking-wider"
            >
              {seeding ? 'Seeding...' : 'Seed Data'}
            </button>
          </div>
          <button 
            onClick={handleClearDatabase}
            disabled={seeding || clearing}
            className="w-full px-3 py-1.5 rounded bg-[#4E3F3B] text-white hover:bg-[#63514C] transition disabled:opacity-50 text-[10px] font-bold uppercase tracking-wider text-center"
          >
            {clearing ? 'Clearing...' : 'Clear All Dummy Data'}
          </button>
        </div>
      </aside>

      {/* ──── MAIN CONTENT AREA ──── */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Upper Header bar */}
        <header className="hidden md:flex h-16 bg-white border-b border-[#E5D9C8]/60 items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-serif text-[#6A2B15] font-bold capitalize">
              {activeTab === 'contact' ? 'Contact Messages' : activeTab}
            </h2>
            {subTab && (
              <>
                <span className="text-[#A59483]">/</span>
                <span className="text-sm font-medium text-[#7D6B5A] capitalize">{subTab.replace('-', ' ')}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {loading && <div className="text-xs text-[#9E2A2B] font-medium animate-pulse">Fetching changes...</div>}
            <div className="w-px h-6 bg-[#E5D9C8]"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#6A2B15] text-[#E3C397] font-bold flex items-center justify-center text-xs">
                M
              </div>
              <span className="text-sm font-medium hidden md:inline">Maya Nair (Admin)</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="flex-1 p-8 overflow-y-auto">
          {loading && products.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw className="w-10 h-10 text-[#9E2A2B] animate-spin" />
              <p className="font-serif text-lg text-[#6A2B15] animate-pulse">Loading CMS Data Workspace...</p>
              <p className="text-xs text-[#7D6B5A]">If this takes too long, ensure your database connection is active or run the seeder.</p>
            </div>
          ) : (
            <>
              {/* 1. OVERVIEW DASHBOARD VIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">Total Sales Revenue</p>
                        <h3 className="text-2xl font-serif font-bold text-[#6A2B15] mt-1">₹{totalRevenue.toLocaleString()}</h3>
                      </div>
                      <div className="p-3 bg-[#F4ECDF] rounded-lg text-[#6A2B15]">
                        <LayoutDashboard className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-2xl font-serif font-bold text-[#6A2B15] mt-1">{totalOrdersCount}</h3>
                      </div>
                      <div className="p-3 bg-[#EBF5EE] rounded-lg text-[#1E5E3A]">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">Pending Orders</p>
                        <h3 className="text-2xl font-serif font-bold text-[#6A2B15] mt-1">{pendingOrdersCount}</h3>
                      </div>
                      <div className="p-3 bg-[#FCF0F0] rounded-lg text-[#9E2A2B]">
                        <Package className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">Customers</p>
                        <h3 className="text-2xl font-serif font-bold text-[#6A2B15] mt-1">{customersCount}</h3>
                      </div>
                      <div className="p-3 bg-[#EDEEF9] rounded-lg text-[#3F51B5]">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Graphical Report Chart */}
                  <div className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-serif text-[#6A2B15] font-bold">Sales Performance Matrix</h3>
                        <p className="text-xs text-[#8C7A6B]">Monthly growth trends and metrics</p>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 bg-[#F4ECDF] text-[#6A2B15] rounded-full uppercase tracking-wider">Live Tracker</span>
                    </div>
                    
                    {/* SVG Chart */}
                    <div className="h-64 w-full bg-[#FAF7F2] rounded-lg p-4 flex flex-col justify-between border border-[#E5D9C8]/30">
                      <div className="flex-1 relative flex items-end">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                          <div className="border-b border-[#E5D9C8]"></div>
                          <div className="border-b border-[#E5D9C8]"></div>
                          <div className="border-b border-[#E5D9C8]"></div>
                          <div className="border-b border-[#E5D9C8]"></div>
                        </div>
                        
                        {/* SVG Drawing Graph */}
                        <svg className="w-full h-full absolute inset-0 pt-4" viewBox="0 0 500 200" preserveAspectRatio="none">
                          {/* Area under curve */}
                          <path
                            d="M 0,200 L 80,160 L 160,110 L 240,130 L 320,80 L 400,60 L 480,20 L 500,200 Z"
                            fill="url(#gradient)"
                            opacity="0.15"
                          />
                          {/* Line */}
                          <path
                            d="M 0,200 L 80,160 L 160,110 L 240,130 L 320,80 L 400,60 L 480,20"
                            fill="none"
                            stroke="#6A2B15"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          {/* Dots */}
                          {[
                            {x: 80, y: 160}, {x: 160, y: 110}, {x: 240, y: 130},
                            {x: 320, y: 80}, {x: 400, y: 60}, {x: 480, y: 20}
                          ].map((pt, i) => (
                            <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="#E3C397" stroke="#6A2B15" strokeWidth="2" />
                          ))}

                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#6A2B15" />
                              <stop offset="100%" stopColor="#FAF7F2" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      
                      {/* Months */}
                      <div className="flex justify-between text-xs text-[#8C7A6B] font-medium pt-2 border-t border-[#E5D9C8]/50 px-2 mt-2">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul (Current)</span>
                      </div>
                    </div>
                  </div>

                  {/* Orders & Low Stock split */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Recent Orders log */}
                    <div className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-serif text-[#6A2B15] font-bold">Recent Inbound Orders</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-xs text-[#9E2A2B] font-bold hover:underline">View All</button>
                      </div>
                      <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#E5D9C8] text-left text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">
                              <th className="py-2">Order #</th>
                              <th className="py-2">Customer</th>
                              <th className="py-2">Amount</th>
                              <th className="py-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(0, 4).map((o) => (
                              <tr key={o._id} className="border-b border-[#E5D9C8]/40 hover:bg-[#FAF7F2]/40 transition">
                                <td className="py-3 font-semibold text-[#6A2B15]">{o.orderNumber}</td>
                                <td className="py-3 text-[#5C4D3E]">{o.customerName}</td>
                                <td className="py-3 font-medium text-[#6A2B15]">₹{o.totalAmount}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    o.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    o.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                    o.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {o.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Low Stock inventory tracker */}
                    <div className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-serif text-[#6A2B15] font-bold">Inventory Alerts</h3>
                        <button onClick={() => { setActiveTab('products'); setSubTab('inventory'); }} className="text-xs text-[#9E2A2B] font-bold hover:underline">Manage Stock</button>
                      </div>
                      <div className="space-y-4">
                        {products.slice(0, 4).map((p) => {
                          const stockPct = Math.min(100, (p.stock / 20) * 100);
                          return (
                            <div key={p._id} className="flex flex-col gap-1">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-[#6A2B15] truncate max-w-[250px]">{p.name}</span>
                                <span className="text-xs font-semibold text-[#7D6B5A]">{p.stock} remaining</span>
                              </div>
                              <div className="w-full h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E5D9C8]/30">
                                <div 
                                  className={`h-full rounded-full ${
                                    p.stock <= 5 ? 'bg-[#9E2A2B]' : p.stock <= 10 ? 'bg-[#D97706]' : 'bg-[#1E5E3A]'
                                  }`}
                                  style={{ width: `${stockPct}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PRODUCTS WORKSPACE */}
              {activeTab === 'products' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Products Toolbar Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5D9C8]/60 pb-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSubTab('')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                          subTab === '' ? 'bg-[#6A2B15] text-white' : 'bg-white border border-[#E5D9C8]/80 hover:bg-[#FAF7F2]'
                        }`}
                      >
                        All Products
                      </button>
                      <button
                        onClick={() => {
                          setSubTab('add-product');
                          setEditingProduct(null);
                          setProductForm({ name: '', price: '', originalPrice: '', image: '', category: 'Banarasi', fabric: '', color: '', stock: 10, isNew: false, isBestSeller: false, badge: '', description: '', images: [], gridImage: '' });
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 ${
                          subTab === 'add-product' ? 'bg-[#6A2B15] text-white' : 'bg-white border border-[#E5D9C8]/80 hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <Plus className="w-4 h-4" /> Add Product
                      </button>
                      <button
                        onClick={() => setSubTab('inventory')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                          subTab === 'inventory' ? 'bg-[#6A2B15] text-white' : 'bg-white border border-[#E5D9C8]/80 hover:bg-[#FAF7F2]'
                        }`}
                      >
                        Inventory Stock
                      </button>
                    </div>

                    {subTab !== 'add-product' && (
                      <div className="relative">
                        <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 pr-4 py-2 rounded-lg border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-sm bg-white w-64"
                        />
                      </div>
                    )}
                  </div>

                  {/* SubTab Views: All Products List */}
                  {subTab === '' && (
                    <div className="bg-white rounded-xl border border-[#E5D9C8]/60 shadow-sm overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#FAF7F2] text-left text-xs font-bold text-[#7D6B5A] uppercase tracking-wider border-b border-[#E5D9C8]">
                            <th className="p-4 w-16">Preview</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Fabric/Color</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products
                            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((p) => (
                              <tr key={p._id} className="border-b border-[#E5D9C8]/40 hover:bg-[#FAF7F2]/20 transition">
                                <td className="p-4">
                                  <img 
                                    src={p.image} 
                                    alt={p.name} 
                                    className="w-12 h-14 object-cover rounded border border-[#E5D9C8]"
                                    onError={(e) => { e.target.src = '/assets/about/story_tradition.jpg'; }}
                                  />
                                </td>
                                <td className="p-4 font-bold text-[#6A2B15]">
                                  {p.name}
                                  {p.badge && <span className="ml-2 text-[9px] bg-[#9E2A2B] text-white px-1.5 py-0.5 rounded font-bold">{p.badge}</span>}
                                </td>
                                <td className="p-4 text-[#5C4D3E]">{p.category}</td>
                                <td className="p-4 font-semibold text-[#6A2B15]">₹{p.price}</td>
                                <td className="p-4 text-xs text-[#8C7A6B]">
                                  <div>{p.fabric || 'N/A'}</div>
                                  <div className="font-semibold">{p.color || 'Mixed'}</div>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    p.stock <= 5 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                                  }`}>
                                    {p.stock} items
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-center gap-2">
                                    <button 
                                      onClick={() => {
                                        setEditingProduct(p);
                                        setProductForm({
                                          name: p.name,
                                          price: p.price,
                                          originalPrice: p.originalPrice || '',
                                          image: p.image,
                                          category: p.category,
                                          fabric: p.fabric || '',
                                          color: p.color || '',
                                          stock: p.stock || 10,
                                          isNew: p.isNew || false,
                                          isBestSeller: p.isBestSeller || false,
                                          badge: p.badge || '',
                                          description: p.description || '',
                                          images: p.images || [],
                                          gridImage: p.gridImage || ''
                                        });
                                        setSubTab('add-product');
                                      }}
                                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                                      title="Edit Product"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => deleteProduct(p._id)}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* SubTab Views: Add/Edit Saree Product Form */}
                  {subTab === 'add-product' && (
                    <form onSubmit={saveProduct} className="bg-white rounded-xl border border-[#E5D9C8]/60 shadow-sm p-8 max-w-4xl mx-auto space-y-6">
                      <h3 className="text-lg font-serif font-bold text-[#6A2B15] border-b border-[#E5D9C8] pb-3">
                        {editingProduct ? 'Edit Saree Specifications' : 'Add New Saree Product'}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1">Product Title *</label>
                            <input 
                              type="text" 
                              required
                              value={productForm.name}
                              onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full p-2.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-sm bg-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1">Sale Price (₹) *</label>
                              <input 
                                type="number" 
                                required
                                value={productForm.price}
                                onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                                className="w-full p-2.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-sm bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1">MRP Original Price (₹)</label>
                              <input 
                                type="number" 
                                value={productForm.originalPrice}
                                onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                                className="w-full p-2.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-sm bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1">Category *</label>
                              <select 
                                value={productForm.category}
                                onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full p-2.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-sm bg-white"
                              >
                                <option value="Banarasi">Banarasi Silk</option>
                                <option value="Kanjivaram">Kanjivaram Silk</option>
                                <option value="Silk Sarees">Pure Silk</option>
                                <option value="Cotton Sarees">Traditional Cotton</option>
                                <option value="Kerala Kasavu">Kerala Kasavu</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1">Fabric details</label>
                              <input 
                                type="text"
                                placeholder="e.g. Kanjivaram Silk"
                                value={productForm.fabric}
                                onChange={(e) => setProductForm(prev => ({ ...prev, fabric: e.target.value }))}
                                className="w-full p-2.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-sm bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1">Color Shades (Select multiple)</label>
                              <div className="w-full p-2.5 rounded border border-[#E5D9C8] text-sm bg-white max-h-[150px] overflow-y-auto space-y-2">
                                {filterConfig.colors.length === 0 ? (
                                  <span className="text-xs text-[#8C7A6B]">No colors configured. Add them in Filter Settings.</span>
                                ) : (
                                  filterConfig.colors.map((c) => {
                                    const isChecked = productForm.color
                                      ? productForm.color.toLowerCase().split(',').map(item => item.trim()).includes(c.name.toLowerCase())
                                      : false;
                                    return (
                                      <label key={c.name} className="flex items-center gap-2.5 text-sm text-[#4A3B32] cursor-pointer hover:bg-[#FAF7EC] p-1 rounded transition-colors">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => {
                                            const currentColors = productForm.color
                                              ? productForm.color.split(',').map(item => item.trim()).filter(Boolean)
                                              : [];
                                            let updatedColors;
                                            if (e.target.checked) {
                                              updatedColors = [...currentColors, c.name];
                                            } else {
                                              updatedColors = currentColors.filter(colorName => colorName.toLowerCase() !== c.name.toLowerCase());
                                            }
                                            setProductForm(prev => ({ ...prev, color: updatedColors.join(',') }));
                                          }}
                                          className="rounded border-[#E5D9C8] text-[#8C3B1F] focus:ring-[#8C3B1F] w-4 h-4 cursor-pointer"
                                        />
                                        <span
                                          className="w-3.5 h-3.5 rounded-full border border-gray-350 inline-block shadow-inner"
                                          style={{ backgroundColor: c.hex }}
                                        />
                                        <span>{c.name}</span>
                                      </label>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1">Initial Stock *</label>
                              <input 
                                type="number" 
                                required
                                value={productForm.stock}
                                onChange={(e) => setProductForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                                className="w-full p-2.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-sm bg-white"
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1">Saree Description</label>
                            <textarea 
                              placeholder="Describe the weave, borders, patterns, and style of this saree..."
                              value={productForm.description || ''}
                              onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                              rows={4}
                              className="w-full p-2.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-sm bg-white"
                            />
                          </div>
                        </div>

                        {/* Image uploads column */}
                        <div className="flex flex-col gap-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1">Saree Image Source</label>
                            
                            {/* Cloudinary Drag-Drop File Uploader */}
                            <div className="border-2 border-dashed border-[#E5D9C8] hover:border-[#6A2B15] transition rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer relative bg-[#FAF7F2]">
                              <input 
                                type="file" 
                                onChange={(e) => handleImageUpload(e, 'product')}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                accept="image/*"
                                disabled={uploadingImage}
                              />
                              {uploadingImage ? (
                                <div className="space-y-2">
                                  <RefreshCw className="w-8 h-8 text-[#9E2A2B] animate-spin mx-auto" />
                                  <p className="text-xs text-[#6A2B15] font-semibold">Uploading to Cloudinary...</p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Upload className="w-8 h-8 text-[#8C7A6B] mx-auto" />
                                  <p className="text-xs text-[#6A2B15] font-semibold">Upload Image File</p>
                                  <p className="text-[10px] text-[#A59483]">Supports JPG, PNG, WEBP (Uploaded directly to Cloudinary)</p>
                                </div>
                              )}
                            </div>

                            {/* Direct URL input fallback */}
                            <div className="mt-4">
                              <span className="text-[10px] font-semibold text-[#8C7A6B] uppercase block mb-1">Or Paste Image URL</span>
                              <input 
                                type="text"
                                placeholder="https://..."
                                value={productForm.image}
                                onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                                className="w-full p-2.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-sm bg-white"
                              />
                            </div>
                          </div>

                          {/* Grid Image */}
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1">Grid / Hover Image (Optional)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                placeholder="Paste grid image URL or upload file"
                                value={productForm.gridImage || ''}
                                onChange={(e) => setProductForm(prev => ({ ...prev, gridImage: e.target.value }))}
                                className="flex-1 p-2.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-sm bg-white"
                              />
                              <div className="relative border border-[#E5D9C8] hover:border-[#6A2B15] transition rounded px-3 flex items-center justify-center bg-[#FAF7F2] text-xs font-semibold cursor-pointer">
                                <input 
                                  type="file" 
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setUploadingImage(true);
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onloadend = async () => {
                                      try {
                                        const res = await fetch('/api/upload', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ image: reader.result })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                          setProductForm(prev => ({ ...prev, gridImage: data.url }));
                                          showNotification('Grid image uploaded successfully!');
                                        } else {
                                          showNotification(data.error || 'Upload failed', 'error');
                                        }
                                      } catch (err) {
                                        showNotification('Upload failed', 'error');
                                      } finally {
                                        setUploadingImage(false);
                                      }
                                    };
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  accept="image/*"
                                />
                                <span>Upload</span>
                              </div>
                            </div>
                            {productForm.gridImage && (
                              <div className="mt-2 flex items-center gap-2">
                                <img src={productForm.gridImage} alt="Grid Preview" className="w-10 h-12 object-cover rounded border border-[#E5D9C8]" />
                                <span className="text-[10px] text-[#8C7A6B] truncate flex-1">{productForm.gridImage}</span>
                              </div>
                            )}
                          </div>

                          {/* Multiple Gallery Images */}
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1">Additional Gallery Images</label>
                            
                            {/* Input to add url or upload */}
                            <div className="flex gap-2 mb-2">
                              <input 
                                type="text"
                                id="new-gallery-image-url"
                                placeholder="Paste extra image URL or upload"
                                className="flex-1 p-2.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-sm bg-white"
                              />
                              <div className="relative border border-[#E5D9C8] hover:border-[#6A2B15] transition rounded px-3 flex items-center justify-center bg-[#FAF7F2] text-xs font-semibold cursor-pointer">
                                <input 
                                  type="file" 
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setUploadingImage(true);
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onloadend = async () => {
                                      try {
                                        const res = await fetch('/api/upload', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ image: reader.result })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                          setProductForm(prev => ({ ...prev, images: [...(prev.images || []), data.url] }));
                                          showNotification('Gallery image added successfully!');
                                        } else {
                                          showNotification(data.error || 'Upload failed', 'error');
                                        }
                                      } catch (err) {
                                        showNotification('Upload failed', 'error');
                                      } finally {
                                        setUploadingImage(false);
                                      }
                                    };
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  accept="image/*"
                                />
                                <span>Upload</span>
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById('new-gallery-image-url');
                                  if (input && input.value) {
                                    setProductForm(prev => ({ ...prev, images: [...(prev.images || []), input.value] }));
                                    input.value = '';
                                  }
                                }}
                                className="bg-[#6A2B15] text-[#FFFFF0] px-3.5 rounded text-xs font-semibold hover:bg-[#8C3B1F]"
                              >
                                Add
                              </button>
                            </div>

                            {/* Previews grid */}
                            {productForm.images && productForm.images.length > 0 && (
                              <div className="grid grid-cols-4 gap-2 mt-2 p-2 border border-[#E5D9C8]/40 rounded bg-[#FAF7F2]/20">
                                {productForm.images.map((url, idx) => (
                                  <div key={idx} className="relative group aspect-square rounded border border-[#E5D9C8] overflow-hidden bg-white">
                                    <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                    <button 
                                      type="button"
                                      onClick={() => setProductForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Image preview frame */}
                          {productForm.image && (
                            <div className="border border-[#E5D9C8] rounded p-2 flex items-center gap-3 bg-[#FAF7F2]/40">
                              <img src={productForm.image} alt="Preview" className="w-14 h-16 object-cover rounded border border-[#E5D9C8]" />
                              <div className="truncate text-xs flex-1">
                                <p className="font-semibold text-[#6A2B15]">Image Loaded:</p>
                                <p className="text-[10px] text-[#8C7A6B] truncate">{productForm.image}</p>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setProductForm(prev => ({ ...prev, image: '' }))}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {/* Checkboxes row */}
                          <div className="flex gap-6 mt-2 border-t border-[#E5D9C8]/40 pt-4">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#6A2B15]">
                              <input 
                                type="checkbox" 
                                checked={productForm.isNew}
                                onChange={(e) => setProductForm(prev => ({ ...prev, isNew: e.target.checked }))}
                                className="rounded text-[#6A2B15] focus:ring-[#6A2B15] w-4 h-4"
                              />
                              <span>Mark as New Saree</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#6A2B15]">
                              <input 
                                type="checkbox" 
                                checked={productForm.isBestSeller}
                                onChange={(e) => setProductForm(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                                className="rounded text-[#6A2B15] focus:ring-[#6A2B15] w-4 h-4"
                              />
                              <span>Mark as Best Seller</span>
                            </label>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-1">Badge (e.g. NEW, 15% OFF)</label>
                            <input 
                              type="text" 
                              value={productForm.badge}
                              onChange={(e) => setProductForm(prev => ({ ...prev, badge: e.target.value }))}
                              placeholder="e.g. NEW"
                              className="w-full p-2.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-sm bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#E5D9C8] pt-6 flex justify-end gap-3">
                        <button 
                          type="button" 
                          onClick={() => { setSubTab(''); setEditingProduct(null); }}
                          className="px-5 py-2.5 rounded-lg border border-[#E5D9C8] hover:bg-[#FAF7F2] text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="px-5 py-2.5 rounded-lg bg-[#6A2B15] text-white hover:bg-[#8C3B1F] text-sm font-medium"
                        >
                          Save Product Details
                        </button>
                      </div>
                    </form>
                  )}

                  {/* SubTab Views: Inventory Manager */}
                  {subTab === 'inventory' && (
                    <div className="bg-white rounded-xl border border-[#E5D9C8]/60 shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-lg font-serif font-bold text-[#6A2B15]">Inventory Stock Control</h3>
                          <p className="text-xs text-[#8C7A6B]">Modify item quantities across collections instantly</p>
                        </div>
                      </div>

                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#FAF7F2] text-left text-xs font-bold text-[#7D6B5A] uppercase tracking-wider border-b border-[#E5D9C8]">
                            <th className="p-4 w-16">Preview</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Current Stock</th>
                            <th className="p-4">Stock Level</th>
                            <th className="p-4 text-center">Update Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((p) => (
                            <tr key={p._id} className="border-b border-[#E5D9C8]/40">
                              <td className="p-4">
                                <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded border" />
                              </td>
                              <td className="p-4 font-medium text-[#6A2B15]">{p.name}</td>
                              <td className="p-4 text-[#8C7A6B]">{p.category}</td>
                              <td className="p-4 font-bold">{p.stock}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  p.stock <= 5 ? 'bg-red-100 text-red-800' : p.stock <= 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {p.stock <= 5 ? 'CRITICAL LOW' : p.stock <= 10 ? 'MEDIUM STOCK' : 'IN STOCK'}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center gap-1">
                                  <button 
                                    onClick={async () => {
                                      const updatedStock = Math.max(0, p.stock - 1);
                                      const res = await fetch('/api/products', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ ...p, stock: updatedStock })
                                      });
                                      if (res.ok) fetchData();
                                    }}
                                    className="px-2 py-1 bg-[#FAF7F2] border border-[#E5D9C8] rounded hover:bg-[#E5D9C8] font-semibold text-xs"
                                  >
                                    -
                                  </button>
                                  <input 
                                    type="number" 
                                    value={p.stock}
                                    onChange={async (e) => {
                                      const updatedStock = Number(e.target.value);
                                      await fetch('/api/products', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ ...p, stock: updatedStock })
                                      });
                                      fetchData();
                                    }}
                                    className="w-12 p-1 border text-center text-xs rounded"
                                  />
                                  <button 
                                    onClick={async () => {
                                      const updatedStock = p.stock + 1;
                                      const res = await fetch('/api/products', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ ...p, stock: updatedStock })
                                      });
                                      if (res.ok) fetchData();
                                    }}
                                    className="px-2 py-1 bg-[#FAF7F2] border border-[#E5D9C8] rounded hover:bg-[#E5D9C8] font-semibold text-xs"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              )}

              {/* 3. ORDERS WORKSPACE */}
              {activeTab === 'orders' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* SubTabs selector */}
                  <div className="flex gap-2 border-b border-[#E5D9C8]/60 pb-6">
                    <button
                      onClick={() => setSubTab('')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        subTab === '' ? 'bg-[#6A2B15] text-white' : 'bg-white border border-[#E5D9C8]/80 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      Inbound Orders
                    </button>
                    <button
                      onClick={() => setSubTab('refunds')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        subTab === 'refunds' ? 'bg-[#6A2B15] text-white' : 'bg-white border border-[#E5D9C8]/80 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      Returns &amp; Refunds
                    </button>
                  </div>

                  {subTab === '' && (
                    <div className="bg-white rounded-xl border border-[#E5D9C8]/60 shadow-sm overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#FAF7F2] text-left text-xs font-bold text-[#7D6B5A] uppercase tracking-wider border-b border-[#E5D9C8]">
                            <th className="p-4">Order Number</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Order Items Count</th>
                            <th className="p-4">Total Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Manage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((o) => (
                            <tr key={o._id} className="border-b border-[#E5D9C8]/40 hover:bg-[#FAF7F2]/20 transition">
                              <td className="p-4">
                                <div className="font-bold text-[#6A2B15]">{o.orderNumber}</div>
                                {o.trackingId ? (
                                  <div className="flex items-center gap-1 text-[11px] font-mono text-purple-700 font-semibold mt-0.5" title={`Courier: ${o.courierPartner || 'Courier'} | AWB: ${o.trackingId}`}>
                                    <Truck className="w-3 h-3 shrink-0" />
                                    <span className="truncate max-w-[120px]">{o.trackingId}</span>
                                  </div>
                                ) : o.status === 'Shipped' ? (
                                  <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded inline-flex items-center gap-1 mt-0.5 font-medium">
                                    <span>⚠️ Missing tracking</span>
                                  </div>
                                ) : null}
                              </td>
                              <td className="p-4 text-[#6A2B15] font-semibold">{o.customerName}</td>
                              <td className="p-4 text-[#8C7A6B]">{o.customerEmail}</td>
                              <td className="p-4">{o.items.length} Saree(s)</td>
                              <td className="p-4 font-semibold text-[#6A2B15]">₹{o.totalAmount}</td>
                              <td className="p-4">
                                <select 
                                  value={o.status}
                                  onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                                  className={`px-2.5 py-1 text-xs rounded border focus:outline-none font-bold ${
                                    o.status === 'Delivered' ? 'bg-green-50 border-green-300 text-green-800' :
                                    o.status === 'Processing' ? 'bg-blue-50 border-blue-300 text-blue-800' :
                                    o.status === 'Pending' ? 'bg-yellow-50 border-yellow-300 text-yellow-800' :
                                    o.status === 'Shipped' ? 'bg-purple-50 border-purple-300 text-purple-800' :
                                    'bg-red-50 border-red-300 text-red-800'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center">
                                  <button 
                                    onClick={() => setSelectedOrder(o)}
                                    className="p-1.5 text-[#9E2A2B] hover:bg-[#FAF7F2] rounded transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                                    title="View Details & Tracking"
                                  >
                                    <Eye className="w-4 h-4" /> View Details
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Return Refund Simulator */}
                  {subTab === 'refunds' && (
                    <div className="bg-white rounded-xl border border-[#E5D9C8]/60 shadow-sm p-8 max-w-4xl mx-auto space-y-6">
                      <h3 className="text-lg font-serif font-bold text-[#6A2B15] border-b border-[#E5D9C8] pb-3">Returns &amp; Refund Request Center</h3>
                      <p className="text-sm text-[#8C7A6B]">Displaying recent user refund cases. Admin verification is required for processing bank credits.</p>

                      <div className="space-y-4">
                        <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#6A2B15]">Case #RF-9943</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800">Return Pending</span>
                            </div>
                            <p className="text-xs text-[#5C4D3E] mt-1">Saree model: Rose Gold Banarasi Silk (Ordered by Priya Nair)</p>
                            <p className="text-xs text-[#8C7A6B]">Reason: Saree has a weaving misalignment on the border folds</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => showNotification('Refund rejected. Saree tag policy violated.', 'error')}
                              className="px-3 py-1.5 bg-white border border-[#E5D9C8] hover:bg-red-50 text-red-700 text-xs font-bold rounded"
                            >
                              Reject Case
                            </button>
                            <button 
                              onClick={() => showNotification('Refund processed successfully!')}
                              className="px-3 py-1.5 bg-[#6A2B15] text-white hover:bg-[#8C3B1F] text-xs font-bold rounded"
                            >
                              Approve &amp; Refund (₹2,799)
                            </button>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-green-200 bg-green-50/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 opacity-75">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#6A2B15]">Case #RF-9872</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-800">Refund Credited</span>
                            </div>
                            <p className="text-xs text-[#5C4D3E] mt-1">Saree model: Beige Golden Zari Saree (Ordered by Aishwarya Sen)</p>
                            <p className="text-xs text-[#8C7A6B]">Reason: Color shades differ slightly from desktop photos</p>
                          </div>
                          <span className="text-xs font-bold text-[#1E5E3A] bg-green-50 px-3 py-1 rounded-full">Completed ₹2,499</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Details Modal overlay */}
                  {selectedOrder && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                      <div className="bg-white rounded-xl shadow-2xl border border-[#E5D9C8] w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                        <button 
                          onClick={() => { setSelectedOrder(null); setCopiedAddress(false); }} 
                          className="absolute right-4 top-4 p-1.5 rounded hover:bg-[#FAF7F2] transition"
                        >
                          <X className="w-5 h-5 text-[#8C7A6B]" />
                        </button>

                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-serif font-bold text-[#6A2B15]">Order Details</h3>
                          <span className="font-mono text-xs px-2.5 py-0.5 bg-[#FAF7F2] border border-[#E5D9C8] rounded text-[#8C3B1F] font-bold">
                            {selectedOrder.orderNumber}
                          </span>
                        </div>
                        <p className="text-xs text-[#8C7A6B]">Placed on: {new Date(selectedOrder.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>

                        {/* Top Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-[#E5D9C8]/60 py-4 my-4 text-sm">
                          <div>
                            <p className="text-xs uppercase font-semibold text-[#8C7A6B] flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-[#8C3B1F]" />
                              Customer Information
                            </p>
                            <p className="font-bold text-[#6A2B15] mt-1">{selectedOrder.customerName}</p>
                            <p className="text-xs text-[#5C4D3E] flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-[#8C7A6B]" />
                              {selectedOrder.customerEmail}
                            </p>
                            {selectedOrder.customerPhone && (
                              <p className="text-xs text-[#5C4D3E] flex items-center gap-1 mt-0.5 font-medium">
                                <Phone className="w-3 h-3 text-[#8C7A6B]" />
                                {selectedOrder.customerPhone}
                              </p>
                            )}
                          </div>

                          <div>
                            <p className="text-xs uppercase font-semibold text-[#8C7A6B] flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-[#8C3B1F]" />
                              Fulfillment &amp; Status
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-[#8C7A6B]">Order:</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                selectedOrder.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                selectedOrder.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {selectedOrder.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-xs text-[#8C7A6B]">Payment:</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                selectedOrder.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {selectedOrder.paymentStatus || 'Paid'}
                              </span>
                            </div>
                            {selectedOrder.paymentId && (
                              <p className="text-[10px] font-mono text-[#8C7A6B] mt-1 truncate" title={selectedOrder.paymentId}>
                                Ref: {selectedOrder.paymentId}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* SHIPPING & DELIVERY ADDRESS */}
                        <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E5D9C8] space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#6A2B15] flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-[#8C3B1F]" />
                              Shipping &amp; Delivery Address
                            </span>

                            {selectedOrder.shippingAddress?.address && (
                              <button
                                type="button"
                                onClick={() => {
                                  const text = `${selectedOrder.customerName}\nPhone: ${selectedOrder.customerPhone || ''}\n${selectedOrder.shippingAddress.address}\n${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state} - ${selectedOrder.shippingAddress.pincode}`;
                                  navigator.clipboard.writeText(text);
                                  setCopiedAddress(true);
                                  setTimeout(() => setCopiedAddress(false), 2000);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-white border border-[#D5C7B7] hover:bg-[#FAF7F2] text-[#6A2B15] rounded transition shadow-2xs cursor-pointer"
                              >
                                {copiedAddress ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                    <span className="text-green-700">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Label</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {selectedOrder.shippingAddress?.address ? (
                            <div className="text-xs text-[#5C4D3E] space-y-1 pt-1 leading-relaxed">
                              <p className="font-semibold text-[#6A2B15]">{selectedOrder.customerName}</p>
                              <p>{selectedOrder.shippingAddress.address}</p>
                              <p>
                                <span className="font-medium text-[#6A2B15]">{selectedOrder.shippingAddress.city}</span>, {selectedOrder.shippingAddress.state} — <span className="font-bold text-[#8C3B1F]">{selectedOrder.shippingAddress.pincode}</span>
                              </p>
                              {selectedOrder.customerPhone && (
                                <p className="pt-0.5 text-[#6A2B15] font-medium flex items-center gap-1">
                                  <span>Phone:</span>
                                  <span className="font-bold">{selectedOrder.customerPhone}</span>
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-[#8C7A6B] italic py-1">
                              {(() => {
                                const customer = customers.find(c => c.email?.toLowerCase() === selectedOrder.customerEmail?.toLowerCase());
                                if (customer && customer.address) {
                                  return (
                                    <div className="not-italic text-[#5C4D3E] space-y-0.5">
                                      <p className="text-[11px] text-[#A34320] font-semibold">From Customer Profile:</p>
                                      <p>{customer.address}</p>
                                      <p>{customer.city}, {customer.state} - {customer.pincode}</p>
                                      {customer.phone && <p>Phone: {customer.phone}</p>}
                                    </div>
                                  );
                                }
                                return 'No detailed shipping address recorded for this order.';
                              })()}
                            </div>
                          )}
                        </div>

                        {/* SHIPMENT & TRACKING MANAGEMENT */}
                        <div className="p-4 rounded-lg bg-[#FAF7F2]/60 border border-[#E5D9C8] space-y-3 mb-4 shadow-2xs">
                          <div className="flex items-center justify-between border-b border-[#E5D9C8]/60 pb-2.5">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded bg-white text-[#8C3B1F] border border-[#E5D9C8]/60 shadow-2xs">
                                <Truck className="w-4 h-4 text-[#8C3B1F]" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6A2B15]">
                                  Shipment &amp; Tracking Information
                                </h4>
                                <p className="text-[11px] text-[#8C7A6B]">
                                  Add AWB tracking ID &amp; carrier link so the customer can track their delivery live.
                                </p>
                              </div>
                            </div>

                            {selectedOrder.trackingId ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 rounded-full">
                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                                Tracking Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                                Awaiting Tracking
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <label className="block text-[11px] font-bold text-[#6A2B15] mb-1">
                                Courier Partner
                              </label>
                              <input
                                type="text"
                                list="courierPartnersList"
                                value={trackingForm.courierPartner}
                                onChange={(e) => setTrackingForm(prev => ({ ...prev, courierPartner: e.target.value }))}
                                placeholder="e.g. Delhivery, DTDC, India Post"
                                className="w-full text-xs px-3 py-2 border border-[#E5D9C8] rounded bg-white focus:border-[#8C3B1F] focus:outline-none"
                              />
                              <datalist id="courierPartnersList">
                                <option value="Delhivery" />
                                <option value="India Post" />
                                <option value="Blue Dart" />
                                <option value="DTDC" />
                                <option value="Shiprocket" />
                                <option value="Ekart Logistics" />
                                <option value="Shadowfax" />
                                <option value="Professional Couriers" />
                                <option value="Trackon" />
                                <option value="XpressBees" />
                              </datalist>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-[#6A2B15] mb-1">
                                Shipment / Tracking ID (AWB)
                              </label>
                              <input
                                type="text"
                                value={trackingForm.trackingId}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTrackingForm(prev => {
                                    const next = { ...prev, trackingId: val };
                                    if (val && !prev.trackingUrl) {
                                      const partner = (prev.courierPartner || '').toLowerCase();
                                      if (partner.includes('delhivery')) {
                                        next.trackingUrl = `https://www.delhivery.com/track/package/${val}`;
                                      } else if (partner.includes('shiprocket')) {
                                        next.trackingUrl = `https://shiprocket.co/tracking/${val}`;
                                      } else if (partner.includes('blue dart')) {
                                        next.trackingUrl = `https://www.bluedart.com/tracking?trackNumber=${val}`;
                                      }
                                    }
                                    return next;
                                  });
                                }}
                                placeholder="e.g. DEL78349201"
                                className="w-full text-xs px-3 py-2 border border-[#E5D9C8] rounded bg-white focus:border-[#8C3B1F] focus:outline-none font-mono"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[11px] font-bold text-[#6A2B15]">
                                  Shipment Tracking Link (URL)
                                </label>
                                {trackingForm.trackingUrl && (
                                  <a
                                    href={trackingForm.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-semibold text-[#8C3B1F] hover:underline inline-flex items-center gap-1"
                                  >
                                    <span>Test Link</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                              <input
                                type="url"
                                value={trackingForm.trackingUrl}
                                onChange={(e) => setTrackingForm(prev => ({ ...prev, trackingUrl: e.target.value }))}
                                placeholder="https://www.delhivery.com/track/package/..."
                                className="w-full text-xs px-3 py-2 border border-[#E5D9C8] rounded bg-white focus:border-[#8C3B1F] focus:outline-none font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-[#6A2B15] mb-1">
                                Order Fulfillment Status
                              </label>
                              <select
                                value={trackingForm.status}
                                onChange={(e) => setTrackingForm(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full text-xs px-3 py-2 border border-[#E5D9C8] rounded bg-white focus:border-[#8C3B1F] focus:outline-none font-semibold text-[#6A2B15]"
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>

                            <div className="flex items-end gap-2">
                              <button
                                type="button"
                                disabled={savingTracking}
                                onClick={() => updateOrderTracking(selectedOrder._id, trackingForm)}
                                className="flex-1 py-2 px-3 bg-[#6A2B15] hover:bg-[#8C3B1F] text-white text-xs font-bold rounded transition cursor-pointer disabled:opacity-50 shadow-xs flex items-center justify-center gap-1.5"
                              >
                                {savingTracking ? (
                                  <span>Saving...</span>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Save Tracking</span>
                                  </>
                                )}
                              </button>

                              {selectedOrder.status !== 'Shipped' && (
                                <button
                                  type="button"
                                  disabled={savingTracking}
                                  onClick={() => {
                                    const updated = { ...trackingForm, status: 'Shipped' };
                                    setTrackingForm(updated);
                                    updateOrderTracking(selectedOrder._id, updated);
                                  }}
                                  className="py-2 px-3 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded transition cursor-pointer disabled:opacity-50 shadow-xs flex items-center gap-1"
                                  title="Mark order as Shipped and save tracking details"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Ship Order</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Items Ordered */}
                        <div className="space-y-3">
                          <p className="text-xs uppercase font-semibold text-[#8C7A6B]">Items Ordered ({selectedOrder.items?.length || 0})</p>
                          <div className="divide-y divide-[#FAF7F2] max-h-48 overflow-y-auto pr-1">
                            {selectedOrder.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center py-2">
                                <div className="flex items-center gap-3">
                                  <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded border border-[#E5D9C8]/60" />
                                  <div>
                                    <p className="text-sm font-semibold text-[#6A2B15]">{item.name}</p>
                                    <p className="text-xs text-[#8C7A6B]">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="font-bold text-[#6A2B15]">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-[#E5D9C8]/60 space-y-1.5">
                          {selectedOrder.shippingFee !== undefined && (
                            <div className="flex justify-between items-center text-xs text-[#5C4D3E]">
                              <span>Delivery Fee</span>
                              <span className="font-semibold text-[#6A2B15]">
                                {selectedOrder.shippingFee > 0 ? `₹${selectedOrder.shippingFee}` : 'FREE'}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#6A2B15]">Grand Total</span>
                            <span className="text-xl font-serif font-bold text-[#9E2A2B]">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#FAF7F2]">
                          <button 
                            onClick={() => { setSelectedOrder(null); setCopiedAddress(false); }}
                            className="px-5 py-2.5 bg-[#6A2B15] text-white hover:bg-[#8C3B1F] text-xs font-bold uppercase tracking-wider rounded-lg transition shadow cursor-pointer"
                          >
                            Close Details
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 4. CUSTOMERS WORKSPACE */}
              {activeTab === 'customers' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-xl border border-[#E5D9C8]/60 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5D9C8]/60">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-[#6A2B15]">Customer Database &amp; Rewards</h3>
                        <p className="text-xs text-[#8C7A6B]">
                          Manage registered customers, view their purchase history, and issue single-use custom gift coupons.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openCouponModal(null, 'all')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#6A2B15] text-white rounded-lg text-xs font-semibold hover:bg-[#8C3B1F] transition shadow-xs cursor-pointer"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>Seasonal Campaign</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openCouponModal(null, 'min_spent')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 transition shadow-xs cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Reward VIP Patrons</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#FAF7F2] text-left text-xs font-bold text-[#7D6B5A] uppercase tracking-wider border-b border-[#E5D9C8]">
                            <th className="p-4">Customer</th>
                            <th className="p-4">Contact &amp; Address</th>
                            <th className="p-4 text-center">Orders</th>
                            <th className="p-4 text-right">Total Spent</th>
                            <th className="p-4 text-center">Reward Coupon</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="p-8 text-center text-xs text-[#8C7A6B]">
                                No customers registered yet.
                              </td>
                            </tr>
                          ) : (
                            customers.map((c) => {
                              const customerOrders = orders.filter(o => o.customerEmail && o.customerEmail.toLowerCase() === c.email.toLowerCase());
                              const totalSpent = customerOrders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.totalAmount : sum, 0);
                              const orderCount = customerOrders.length;
                              const isVip = totalSpent >= 5000;
                              
                              // Check active coupons assigned to this customer
                              const assignedCoupons = coupons.filter(coup => 
                                (coup.assignedTo && coup.assignedTo.includes(c.email.toLowerCase())) ||
                                (coup.targetType === 'min_spent' && totalSpent >= (coup.minCustomerSpent || 0))
                              );

                              return (
                                <tr key={c._id || c.email} className="border-b border-[#E5D9C8]/40 hover:bg-[#FAF7F2]/30 transition">
                                  <td className="p-4">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E5D9C8] flex items-center justify-center font-bold text-xs text-[#6A2B15]">
                                        {(c.name || 'U').charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <div className="font-bold text-[#6A2B15] flex items-center gap-1.5">
                                          <span>{c.name}</span>
                                          {isVip && (
                                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded border border-amber-300">
                                              VIP
                                            </span>
                                          )}
                                        </div>
                                        <div className="font-mono text-[10px] text-[#8C3B1F] bg-[#FAF7F2] border border-[#E5D9C8] px-1.5 py-0.2 rounded inline-block mt-0.5 font-bold">
                                          {c.customerId || `SK-USR-${(c._id || '').toString().slice(-6).toUpperCase()}`}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="p-4 text-[#8C7A6B]">
                                    <div className="space-y-0.5 text-xs">
                                      <div className="text-[#5C4D3E] font-medium">{c.email}</div>
                                      {c.phone && <div className="text-[11px] text-[#8C7A6B]">📞 {c.phone}</div>}
                                      {c.address && (
                                        <div className="text-[11px] text-[#8C7A6B] truncate max-w-xs" title={`${c.address}, ${c.city || ''} ${c.pincode || ''}`}>
                                          📍 {c.address}, {c.city || ''} {c.pincode ? `- ${c.pincode}` : ''}
                                        </div>
                                      )}
                                    </div>
                                  </td>

                                  <td className="p-4 text-center font-medium">
                                    <span className="inline-block px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5D9C8] text-xs font-semibold text-[#6A2B15]">
                                      {orderCount} {orderCount === 1 ? 'order' : 'orders'}
                                    </span>
                                  </td>

                                  <td className="p-4 text-right">
                                    <div className="font-bold text-[#6A2B15]">₹{totalSpent.toLocaleString()}</div>
                                    <div className="text-[10px] text-[#8C7A6B]">lifetime</div>
                                  </td>

                                  <td className="p-4 text-center">
                                    <div className="flex flex-col items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => openCouponModal(c, 'specific')}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#FAF7F2] text-[#6A2B15] border border-[#D5C7B7] hover:bg-[#6A2B15] hover:text-white rounded-lg transition shadow-2xs cursor-pointer"
                                        title={`Create single-use coupon for ${c.name}`}
                                      >
                                        <Gift className="w-3.5 h-3.5 text-[#8C3B1F] group-hover:text-white" />
                                        <span>Gift Coupon</span>
                                      </button>
                                      {assignedCoupons.length > 0 && (
                                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                          {assignedCoupons.length} offer(s) assigned
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. REVIEWS WORKSPACE */}
              {activeTab === 'reviews' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-xl border border-[#E5D9C8]/60 shadow-sm p-6">
                    <h3 className="text-lg font-serif font-bold text-[#6A2B15] mb-2">Review Management &amp; Moderation</h3>
                    <p className="text-xs text-[#8C7A6B] mb-6">Verify and approve reviews to be rendered on front-facing Saree collections.</p>

                    <div className="space-y-6">
                      {reviews.map((r) => (
                        <div key={r._id} className="p-4 rounded-xl border border-[#E5D9C8]/50 flex justify-between items-start gap-4 hover:shadow-sm transition bg-[#FAF7F2]/10">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-[#6A2B15]">{r.customerName}</span>
                              <div className="flex text-yellow-500 font-bold text-xs">
                                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                              </div>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                r.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                r.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {r.status}
                              </span>
                            </div>
                            <p className="text-xs text-[#5C4D3E] font-medium">Saree: {r.productName}</p>
                            <p className="text-xs text-[#7D6B5A] italic font-serif leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {r.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => updateReviewStatus(r._id, 'Rejected')}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded border border-red-200"
                                  title="Reject Saree Review"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => updateReviewStatus(r._id, 'Approved')}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded border border-green-200"
                                  title="Approve Saree Review"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {r.status === 'Approved' && (
                              <button 
                                onClick={() => updateReviewStatus(r._id, 'Rejected')}
                                className="px-2 py-1 text-red-700 hover:bg-red-50 text-xs border border-red-200 rounded"
                              >
                                Revoke Approval
                              </button>
                            )}
                            {r.status === 'Rejected' && (
                              <button 
                                onClick={() => updateReviewStatus(r._id, 'Approved')}
                                className="px-2 py-1 text-green-700 hover:bg-green-50 text-xs border border-green-200 rounded"
                              >
                                Re-Approve
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. MARKETING WORKSPACE */}
              {activeTab === 'marketing' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Marketing SubTabs */}
                  <div className="flex gap-2 border-b border-[#E5D9C8]/60 pb-6">
                    <button
                      onClick={() => setSubTab('')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        subTab === '' ? 'bg-[#6A2B15] text-white' : 'bg-white border border-[#E5D9C8]/80 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      Promo Coupons
                    </button>
                    <button
                      onClick={() => setSubTab('banners')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        subTab === 'banners' ? 'bg-[#6A2B15] text-white' : 'bg-white border border-[#E5D9C8]/80 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      Homepage Banners
                    </button>
                  </div>

                  {subTab === '' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Create Form */}
                      <form onSubmit={saveCoupon} className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm space-y-4 h-fit">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h4 className="font-serif font-bold text-[#6A2B15]">Create Coupon &amp; Rules</h4>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            1x Use Per User
                          </span>
                        </div>
                        
                        <div>
                          <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Coupon Code *</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              required
                              placeholder="SAKHI-ROYAL-30"
                              value={couponForm.code}
                              onChange={(e) => setCouponForm(prev => ({ ...prev, code: e.target.value.toUpperCase().replace(/\s+/g, '') }))}
                              className="w-full p-2 border border-[#E5D9C8] rounded text-sm bg-white font-mono font-bold text-[#6A2B15]"
                            />
                            <button
                              type="button"
                              onClick={() => setCouponForm(prev => ({ ...prev, code: `SAKHI-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}` }))}
                              className="px-2.5 py-1 text-xs border border-[#D5C7B7] rounded hover:bg-[#FAF7F2] text-[#6A2B15]"
                              title="Generate Random Code"
                            >
                              Auto
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Discount Type *</label>
                            <select 
                              value={couponForm.discountType}
                              onChange={(e) => setCouponForm(prev => ({ ...prev, discountType: e.target.value }))}
                              className="w-full p-2 border border-[#E5D9C8] rounded text-sm bg-white"
                            >
                              <option value="Percentage">Percentage (%)</option>
                              <option value="Fixed">Flat Amount (₹)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Discount Value *</label>
                            <input 
                              type="number" 
                              required
                              min="1"
                              placeholder={couponForm.discountType === 'Percentage' ? '30' : '100'}
                              value={couponForm.discountValue}
                              onChange={(e) => setCouponForm(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                              className="w-full p-2 border border-[#E5D9C8] rounded text-sm bg-white font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">
                              Min. Order (₹)
                            </label>
                            <input 
                              type="number" 
                              min="0"
                              placeholder="1499"
                              value={couponForm.minOrderAmount}
                              onChange={(e) => setCouponForm(prev => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
                              className="w-full p-2 border border-[#E5D9C8] rounded text-sm bg-white"
                            />
                            <p className="text-[10px] text-[#8C7A6B] mt-0.5">e.g. Orders above ₹1,499</p>
                          </div>
                          <div>
                            <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Expiry Date *</label>
                            <input 
                              type="date" 
                              required
                              value={couponForm.expiryDate}
                              onChange={(e) => setCouponForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                              className="w-full p-2 border border-[#E5D9C8] rounded text-sm bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Target Audience</label>
                          <select 
                            value={couponForm.targetType}
                            onChange={(e) => setCouponForm(prev => ({ ...prev, targetType: e.target.value }))}
                            className="w-full p-2 border border-[#E5D9C8] rounded text-sm bg-white"
                          >
                            <option value="all">All Customers (Seasonal Broadcast)</option>
                            <option value="specific">Specific Customer (Individual Gift)</option>
                            <option value="min_spent">VIP Patrons (Spent above threshold)</option>
                          </select>
                        </div>

                        {couponForm.targetType === 'specific' && (
                          <div>
                            <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Customer Email *</label>
                            <input 
                              type="email" 
                              required
                              placeholder="customer@example.com"
                              value={couponForm.assignedTo}
                              onChange={(e) => setCouponForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                              className="w-full p-2 border border-[#E5D9C8] rounded text-sm bg-white"
                            />
                          </div>
                        )}

                        {couponForm.targetType === 'min_spent' && (
                          <div>
                            <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Minimum Customer Spend (₹) *</label>
                            <input 
                              type="number" 
                              min="0"
                              placeholder="5000"
                              value={couponForm.minCustomerSpent}
                              onChange={(e) => setCouponForm(prev => ({ ...prev, minCustomerSpent: Number(e.target.value) }))}
                              className="w-full p-2 border border-[#E5D9C8] rounded text-sm bg-white"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Offer Description</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Seasonal 30% OFF on all sarees above ₹1,499"
                            value={couponForm.description}
                            onChange={(e) => setCouponForm(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full p-2 border border-[#E5D9C8] rounded text-sm bg-white text-xs"
                          />
                        </div>

                        <div className="p-2.5 bg-[#FAF7F2] border border-[#E5D9C8] rounded-lg text-[11px] text-[#6A2B15] space-y-1">
                          <p className="font-bold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#8C3B1F]" />
                            Single-Use Guarantee
                          </p>
                          <p className="text-[#8C7A6B]">
                            Each customer can use this coupon only once. Once used, it cannot be reused. Eligible customers see it automatically in their Profile.
                          </p>
                        </div>

                        <button 
                          type="submit" 
                          disabled={savingCoupon}
                          className="w-full py-2.5 bg-[#6A2B15] text-white rounded-lg text-sm font-semibold hover:bg-[#8C3B1F] transition shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          {savingCoupon ? 'Saving Coupon...' : 'Create & Publish Coupon'}
                        </button>
                      </form>

                      {/* Right: List Table */}
                      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm overflow-x-auto">
                        <div className="flex items-center justify-between mb-4 border-b pb-2">
                          <div>
                            <h4 className="font-serif font-bold text-[#6A2B15]">Active Coupons &amp; Campaigns</h4>
                            <p className="text-xs text-[#8C7A6B]">Coupons enforced with minimum order value and 1x single use per user.</p>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5D9C8] text-[#6A2B15]">
                            {coupons.length} Active Codes
                          </span>
                        </div>
                        
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs font-bold text-[#7D6B5A] uppercase border-b bg-[#FAF7F2]/50">
                              <th className="py-2.5 px-3">Code &amp; Offer</th>
                              <th className="py-2.5 px-3">Discount</th>
                              <th className="py-2.5 px-3">Rules</th>
                              <th className="py-2.5 px-3">Audience</th>
                              <th className="py-2.5 px-3 text-center">Used</th>
                              <th className="py-2.5 px-3 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {coupons.length === 0 ? (
                              <tr>
                                <td colSpan="6" className="py-8 text-center text-xs text-[#8C7A6B]">
                                  No coupons created yet. Use the form on the left to add one.
                                </td>
                              </tr>
                            ) : (
                              coupons.map((c) => (
                                <tr key={c._id} className="border-b hover:bg-[#FAF7F2]/20 transition">
                                  <td className="py-3 px-3">
                                    <div className="font-mono font-bold text-[#6A2B15] text-sm">{c.code}</div>
                                    {c.description && <div className="text-[11px] text-[#8C7A6B] truncate max-w-xs">{c.description}</div>}
                                    <div className="text-[10px] text-[#A59483]">
                                      Expires: {new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                                      {c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-xs text-[#5C4D3E]">
                                    {c.minOrderAmount > 0 ? (
                                      <span className="font-medium text-[#6A2B15]">Min. ₹{c.minOrderAmount}</span>
                                    ) : (
                                      <span className="text-[#8C7A6B]">No Min</span>
                                    )}
                                    <div className="text-[10px] text-amber-800 font-semibold">1x use per user</div>
                                  </td>
                                  <td className="py-3 px-3 text-xs">
                                    {c.targetType === 'all' && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                        All Users
                                      </span>
                                    )}
                                    {c.targetType === 'specific' && (
                                      <div>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                          Individual
                                        </span>
                                        <div className="text-[10px] text-[#8C7A6B] truncate max-w-[120px]" title={(c.assignedTo || []).join(', ')}>
                                          {(c.assignedTo || []).join(', ')}
                                        </div>
                                      </div>
                                    )}
                                    {c.targetType === 'min_spent' && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                        VIP &gt; ₹{c.minCustomerSpent}
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5D9C8] font-bold text-xs text-[#6A2B15]">
                                      {c.usedBy ? c.usedBy.length : 0}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <button 
                                      onClick={() => deleteCoupon(c._id)} 
                                      className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition cursor-pointer"
                                      title="Delete Coupon"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Homepage Banners Configurer */}
                  {subTab === 'banners' && (
                    <div className="bg-white rounded-xl border border-[#E5D9C8]/60 shadow-sm p-8 max-w-4xl mx-auto space-y-6">
                      <h3 className="text-lg font-serif font-bold text-[#6A2B15] border-b pb-3">Homepage Carousel Banners</h3>
                      
                      <div className="space-y-4">
                        <div className="border border-[#E5D9C8] rounded-lg p-4 flex gap-4 bg-[#FAF7F2]/35">
                          <img src="/assets/desktop/herodesk.png" alt="Hero Banner" className="w-32 h-20 object-cover rounded border" onError={(e) => { e.target.src = '/assets/about/story_tradition.jpg'; }} />
                          <div className="flex-1 space-y-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-800">Desktop Banner 1</span>
                            <h4 className="font-serif font-bold text-sm text-[#6A2B15]">Bridal Kasavu Silk Collection</h4>
                            <p className="text-xs text-[#8C7A6B]">Active and rendering on main page header slider.</p>
                          </div>
                          <button className="px-3 py-1.5 border hover:bg-[#FAF7F2] rounded text-xs font-semibold h-fit self-center">Edit Slide</button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* FILTER CONFIGURATION WORKSPACE */}
              {activeTab === 'filters' && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="bg-white rounded-xl border border-[#E5D9C8]/60 shadow-sm p-6">
                    <h3 className="text-lg font-serif font-bold text-[#6A2B15]">Dynamic Shop Filters Manager</h3>
                    <p className="text-xs text-[#8C7A6B] mb-6">Add, edit, or remove filter parameters that customers use to search sarees in the shop.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      
                      {/* 1. CATEGORIES COLUMN */}
                      <div className="space-y-4 border-r border-[#E5D9C8]/40 pr-0 lg:pr-8">
                        <h4 className="font-serif font-bold text-[#6A2B15] border-b pb-2 flex justify-between items-center">
                          <span>Saree Categories</span>
                          <span className="text-xs text-[#8C7A6B]">({filterConfig.categories.length})</span>
                        </h4>
                        
                        {/* List */}
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {filterConfig.categories.map((cat, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2.5 rounded bg-[#FAF7F2]/45 border border-[#E5D9C8]/40 text-xs">
                              <div>
                                <p className="font-bold text-[#6A2B15]">{cat.label}</p>
                                <p className="text-[10px] text-[#8C7A6B]">Value: {cat.value}</p>
                              </div>
                              {cat.value !== 'All' && (
                                <button 
                                  onClick={() => {
                                    const updated = filterConfig.categories.filter((_, i) => i !== idx);
                                    saveFilterConfig({ ...filterConfig, categories: updated });
                                  }}
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Add Form */}
                        <div className="pt-4 border-t border-[#FAF7F2] space-y-2">
                          <p className="text-[11px] font-bold text-[#6A2B15] uppercase tracking-wider">Add Category</p>
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              placeholder="Label (e.g. Georgette)" 
                              id="new-cat-label"
                              className="p-2 border text-xs rounded bg-white"
                            />
                            <input 
                              type="text" 
                              placeholder="Value (e.g. Georgette)" 
                              id="new-cat-value"
                              className="p-2 border text-xs rounded bg-white"
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const labelEl = document.getElementById('new-cat-label');
                              const valEl = document.getElementById('new-cat-value');
                              if (!labelEl.value || !valEl.value) return;
                              const updated = [...filterConfig.categories, { label: labelEl.value, value: valEl.value }];
                              saveFilterConfig({ ...filterConfig, categories: updated });
                              labelEl.value = '';
                              valEl.value = '';
                            }}
                            className="w-full py-2 bg-[#6A2B15] text-white text-xs font-semibold rounded hover:bg-[#8C3B1F] transition flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Category
                          </button>
                        </div>
                      </div>

                      {/* 2. FABRICS COLUMN */}
                      <div className="space-y-4 border-r border-[#E5D9C8]/40 pr-0 lg:pr-8">
                        <h4 className="font-serif font-bold text-[#6A2B15] border-b pb-2 flex justify-between items-center">
                          <span>Saree Fabrics</span>
                          <span className="text-xs text-[#8C7A6B]">({filterConfig.fabrics.length})</span>
                        </h4>
                        
                        {/* List */}
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {filterConfig.fabrics.map((fab, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2.5 rounded bg-[#FAF7F2]/45 border border-[#E5D9C8]/40 text-xs">
                              <div>
                                <p className="font-bold text-[#6A2B15]">{fab.label}</p>
                                <p className="text-[10px] text-[#8C7A6B]">Value: {fab.value}</p>
                              </div>
                              <button 
                                onClick={() => {
                                  const updated = filterConfig.fabrics.filter((_, i) => i !== idx);
                                  saveFilterConfig({ ...filterConfig, fabrics: updated });
                                }}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Form */}
                        <div className="pt-4 border-t border-[#FAF7F2] space-y-2">
                          <p className="text-[11px] font-bold text-[#6A2B15] uppercase tracking-wider">Add Fabric Type</p>
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              placeholder="Label (e.g. Linen)" 
                              id="new-fab-label"
                              className="p-2 border text-xs rounded bg-white"
                            />
                            <input 
                              type="text" 
                              placeholder="Value (e.g. Linen)" 
                              id="new-fab-value"
                              className="p-2 border text-xs rounded bg-white"
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const labelEl = document.getElementById('new-fab-label');
                              const valEl = document.getElementById('new-fab-value');
                              if (!labelEl.value || !valEl.value) return;
                              const updated = [...filterConfig.fabrics, { label: labelEl.value, value: valEl.value }];
                              saveFilterConfig({ ...filterConfig, fabrics: updated });
                              labelEl.value = '';
                              valEl.value = '';
                            }}
                            className="w-full py-2 bg-[#6A2B15] text-white text-xs font-semibold rounded hover:bg-[#8C3B1F] transition flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Fabric
                          </button>
                        </div>
                      </div>

                      {/* 3. COLORS COLUMN */}
                      <div className="space-y-4">
                        <h4 className="font-serif font-bold text-[#6A2B15] border-b pb-2 flex justify-between items-center">
                          <span>Saree Colors</span>
                          <span className="text-xs text-[#8C7A6B]">({filterConfig.colors.length})</span>
                        </h4>
                        
                        {/* List */}
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                          {filterConfig.colors.map((color, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 rounded bg-[#FAF7F2]/45 border border-[#E5D9C8]/40 text-xs">
                              <div className="flex items-center gap-2">
                                <span 
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color.hex }}
                                ></span>
                                <div>
                                  <p className="font-bold text-[#6A2B15] text-[11px]">{color.name}</p>
                                  <p className="text-[9px] text-[#8C7A6B]">{color.hex}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  const updated = filterConfig.colors.filter((_, i) => i !== idx);
                                  saveFilterConfig({ ...filterConfig, colors: updated });
                                }}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Form */}
                        <div className="pt-4 border-t border-[#FAF7F2] space-y-2">
                          <p className="text-[11px] font-bold text-[#6A2B15] uppercase tracking-wider">Add Color Shade</p>
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              placeholder="Name (e.g. Orange)" 
                              id="new-col-name"
                              className="p-2 border text-xs rounded bg-white"
                            />
                            <div className="flex gap-1 items-center">
                              <input 
                                type="text" 
                                placeholder="#FF5733" 
                                id="new-col-hex"
                                className="p-2 border text-xs rounded bg-white w-full"
                              />
                            </div>
                          </div>
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-semibold text-[#8C7A6B] uppercase mb-1">
                            <input 
                              type="checkbox" 
                              id="new-col-border"
                              className="rounded border-[#E5D9C8] focus:ring-[#6A2B15] text-[#6A2B15] w-3 h-3"
                            />
                            <span>Add border frame (for light colors)</span>
                          </label>
                          <button 
                            type="button"
                            onClick={() => {
                              const nameEl = document.getElementById('new-col-name');
                              const hexEl = document.getElementById('new-col-hex');
                              const borderEl = document.getElementById('new-col-border');
                              if (!nameEl.value || !hexEl.value) return;
                              const updated = [...filterConfig.colors, { name: nameEl.value, hex: hexEl.value, border: borderEl.checked }];
                              saveFilterConfig({ ...filterConfig, colors: updated });
                              nameEl.value = '';
                              hexEl.value = '';
                              borderEl.checked = false;
                            }}
                            className="w-full py-2 bg-[#6A2B15] text-white text-xs font-semibold rounded hover:bg-[#8C3B1F] transition flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Color
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* 7. CONTENT WORKSPACE */}
              {activeTab === 'content' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Content Hub tabs */}
                  <div className="flex gap-2 border-b border-[#E5D9C8]/60 pb-6">
                    <button
                      onClick={() => setSubTab('')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        subTab === '' ? 'bg-[#6A2B15] text-white' : 'bg-white border border-[#E5D9C8]/80 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      Blog Posts
                    </button>
                    <button
                      onClick={() => setSubTab('faqs')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        subTab === 'faqs' ? 'bg-[#6A2B15] text-white' : 'bg-white border border-[#E5D9C8]/80 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      FAQ Management
                    </button>
                  </div>

                  {subTab === '' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Add/Edit Blog */}
                      <form onSubmit={saveBlog} className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm space-y-4 h-fit">
                        <h4 className="font-serif font-bold text-[#6A2B15] border-b pb-2">Create Blog Post</h4>
                        
                        <div>
                          <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Post Title *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Art of Weaving Silk"
                            value={blogForm.title}
                            onChange={(e) => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full p-2 border rounded text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Brief Summary *</label>
                          <input 
                            type="text" 
                            required
                            value={blogForm.summary}
                            onChange={(e) => setBlogForm(prev => ({ ...prev, summary: e.target.value }))}
                            className="w-full p-2 border rounded text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Banner Image URL</label>
                          
                          {/* Cloudinary Drag-Drop File Uploader */}
                          <div className="border-2 border-dashed border-[#E5D9C8] hover:border-[#6A2B15] transition rounded p-4 flex flex-col items-center justify-center text-center cursor-pointer relative bg-[#FAF7F2] mt-1">
                            <input 
                              type="file" 
                              onChange={(e) => handleImageUpload(e, 'blog')}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              accept="image/*"
                              disabled={uploadingImage}
                            />
                            <Upload className="w-5 h-5 text-[#8C7A6B] mx-auto" />
                            <p className="text-[11px] text-[#6A2B15] font-semibold mt-1">Upload File (Cloudinary)</p>
                          </div>

                          <input 
                            type="text" 
                            placeholder="Or paste image URL"
                            value={blogForm.image}
                            onChange={(e) => setBlogForm(prev => ({ ...prev, image: e.target.value }))}
                            className="w-full p-2 border rounded text-sm bg-white mt-2"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Author</label>
                          <input 
                            type="text" 
                            value={blogForm.author}
                            onChange={(e) => setBlogForm(prev => ({ ...prev, author: e.target.value }))}
                            className="w-full p-2 border rounded text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">HTML Content *</label>
                          <textarea 
                            rows="4"
                            required
                            placeholder="<p>Post body details...</p>"
                            value={blogForm.content}
                            onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full p-2 border rounded text-sm bg-white"
                          ></textarea>
                        </div>

                        <button type="submit" className="w-full py-2 bg-[#6A2B15] text-white rounded text-sm font-semibold hover:bg-[#8C3B1F] transition">
                          Publish Article
                        </button>
                      </form>

                      {/* Blog Listing */}
                      <div className="md:col-span-2 space-y-4">
                        {blogs.map((b) => (
                          <div key={b._id} className="bg-white p-4 rounded-xl border border-[#E5D9C8]/60 shadow-sm flex gap-4 items-center">
                            <img src={b.image} alt={b.title} className="w-20 h-20 object-cover rounded border border-[#E5D9C8]" onError={(e) => { e.target.src = '/assets/about/story_tradition.jpg'; }} />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif font-bold text-base text-[#6A2B15] truncate">{b.title}</h4>
                              <p className="text-xs text-[#8C7A6B] truncate">{b.summary}</p>
                              <p className="text-[10px] text-[#A59483] mt-1">Author: {b.author} | Published: {new Date(b.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => deleteBlog(b._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FAQ list */}
                  {subTab === 'faqs' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* FAQ Add Form */}
                      <form onSubmit={saveFaq} className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm space-y-4 h-fit">
                        <h4 className="font-serif font-bold text-[#6A2B15] border-b pb-2">Add FAQ Question</h4>
                        
                        <div>
                          <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Question *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Do you offer silk mark tags?"
                            value={faqForm.question}
                            onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                            className="w-full p-2 border rounded text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">FAQ Category</label>
                          <input 
                            type="text" 
                            placeholder="General"
                            value={faqForm.category}
                            onChange={(e) => setFaqForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full p-2 border rounded text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Answer *</label>
                          <textarea 
                            rows="3"
                            required
                            value={faqForm.answer}
                            onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                            className="w-full p-2 border rounded text-sm bg-white"
                          ></textarea>
                        </div>

                        <button type="submit" className="w-full py-2 bg-[#6A2B15] text-white rounded text-sm font-semibold hover:bg-[#8C3B1F] transition">
                          Add FAQ
                        </button>
                      </form>

                      {/* FAQs list table */}
                      <div className="md:col-span-2 bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm space-y-4">
                        {faqs.map((f) => (
                          <div key={f._id} className="border-b border-[#FAF7F2] pb-3 flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[9px] font-bold bg-[#FAF7F2] text-[#6A2B15] border px-1.5 py-0.5 rounded uppercase tracking-wider">{f.category}</span>
                              <h5 className="font-serif font-bold text-sm text-[#6A2B15] mt-2">{f.question}</h5>
                              <p className="text-xs text-[#8C7A6B] mt-1">{f.answer}</p>
                            </div>
                            <button onClick={() => deleteFaq(f._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 8. CONTACT MESSAGES WORKSPACE */}
              {activeTab === 'contact' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-xl border border-[#E5D9C8]/60 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-[#6A2B15]">Inbound Contact Inquiries</h3>
                        <p className="text-xs text-[#8C7A6B]">Displaying real-time customer questions synced from MongoDB database</p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#FCF0F0] text-[#9E2A2B] text-xs font-bold">{messages.length} Inquiry(s)</span>
                    </div>

                    <div className="space-y-4">
                      {messages.map((m) => (
                        <div key={m._id} className="p-4 border border-[#E5D9C8]/60 rounded-xl hover:shadow-sm transition bg-[#FAF7F2]/10 space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-bold text-[#6A2B15] text-sm">{m.name}</span>
                              <span className="mx-2 text-[#E5D9C8]">|</span>
                              <span className="text-xs font-medium text-[#7D6B5A]">{m.email}</span>
                              {m.phone && (
                                <>
                                  <span className="mx-2 text-[#E5D9C8]">|</span>
                                  <span className="text-xs text-[#8C7A6B]">Ph: {m.phone}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-[#A59483]">{new Date(m.createdAt).toLocaleString()}</span>
                              <button 
                                onClick={() => deleteContactMessage(m._id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Delete Message"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-xs bg-white border border-[#E5D9C8]/40 rounded p-3 text-[#5C4D3E] space-y-1">
                            <p className="font-bold text-[#6A2B15] border-b pb-1 mb-1">Subject: {m.subject || 'No Subject'}</p>
                            <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                          </div>
                        </div>
                      ))}
                      {messages.length === 0 && (
                        <p className="text-sm text-center text-[#8C7A6B] py-8">Inbox is empty. Submit a form in the client contact section to verify.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 9. SALES & PERFORMANCE REPORTS */}
              {activeTab === 'reports' && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm">
                      <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">Average Order Basket</p>
                      <h4 className="text-2xl font-serif font-bold text-[#6A2B15] mt-1">₹3,450</h4>
                      <p className="text-[11px] text-green-700 mt-2 font-medium">↑ 12% vs last month</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm">
                      <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">Conversion rate</p>
                      <h4 className="text-2xl font-serif font-bold text-[#6A2B15] mt-1">3.12%</h4>
                      <p className="text-[11px] text-green-700 mt-2 font-medium">↑ 0.4% vs last month</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm">
                      <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wider">Return Rate percentage</p>
                      <h4 className="text-2xl font-serif font-bold text-[#6A2B15] mt-1">1.8%</h4>
                      <p className="text-[11px] text-red-700 mt-2 font-medium">↓ 0.2% improvement</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-[#E5D9C8]/60 shadow-sm space-y-4">
                    <h3 className="text-lg font-serif font-bold text-[#6A2B15]">Monthly Revenue Target Reports</h3>
                    <p className="text-xs text-[#8C7A6B]">Graphical projection metrics for Q3 2026 sales performance.</p>
                    <div className="h-60 bg-[#FAF7F2] rounded-lg p-6 flex flex-col justify-end border">
                      <div className="h-full flex items-end gap-10 justify-center">
                        <div className="w-12 bg-[#8C3B1F] hover:bg-[#6A2B15] transition-all rounded-t-md h-[40%] text-center text-white text-[10px] py-1 font-bold">₹12k</div>
                        <div className="w-12 bg-[#8C3B1F] hover:bg-[#6A2B15] transition-all rounded-t-md h-[55%] text-center text-white text-[10px] py-1 font-bold">₹18k</div>
                        <div className="w-12 bg-[#8C3B1F] hover:bg-[#6A2B15] transition-all rounded-t-md h-[70%] text-center text-white text-[10px] py-1 font-bold">₹22k</div>
                        <div className="w-12 bg-[#E3C397] hover:bg-[#c9a777] transition-all rounded-t-md h-[95%] text-center text-[#6A2B15] text-[10px] py-1 font-bold">₹31k</div>
                      </div>
                      <div className="flex justify-between border-t border-[#E5D9C8] pt-2 text-xs text-[#8C7A6B] font-semibold mt-2 px-10">
                        <span>April</span>
                        <span>May</span>
                        <span>June</span>
                        <span>July (Goal Met)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 10. APP SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-xl border border-[#E5D9C8]/60 shadow-sm p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
                  
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#6A2B15] border-b pb-2 mb-4">Payment Gateways</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-[#E5D9C8] rounded bg-[#FAF7F2]/30 space-y-2">
                        <span className="text-xs font-bold text-[#6A2B15]">Razorpay API Integration</span>
                        <input type="text" placeholder="Key ID: rzp_live_xxxxxxxx" className="w-full p-2 border text-xs bg-white rounded" />
                        <span className="text-[10px] text-green-700 font-bold block">● Connected &amp; Live</span>
                      </div>
                      <div className="p-4 border border-[#E5D9C8] rounded bg-[#FAF7F2]/30 space-y-2">
                        <span className="text-xs font-bold text-[#6A2B15]">Stripe Payments</span>
                        <input type="password" value="sk_live_••••••••" disabled className="w-full p-2 border text-xs bg-gray-100 rounded" />
                        <span className="text-[10px] text-[#A59483] block">Sandbox Testing mode</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveShippingRates} className="border border-[#E5D9C8] rounded-xl bg-white p-6 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E5D9C8]/60 gap-2">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-[#6A2B15] flex items-center gap-2">
                          <Truck className="w-5 h-5 text-[#8C3B1F]" />
                          Shipping Rates &amp; Pincode Delivery Settings
                        </h3>
                        <p className="text-xs text-[#8C7A6B]">
                          Configured rates apply automatically to every product order based on the customer&apos;s delivery pincode.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={savingShippingRates}
                        className="px-4 py-2 bg-[#6A2B15] hover:bg-[#8C3B1F] text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <Check className="w-4 h-4" />
                        <span>{savingShippingRates ? 'Saving...' : 'Save Shipping Rates'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Kerala Local Shipping */}
                      <div className="p-4 border border-[#E5D9C8] rounded-xl bg-[#FAF7F2]/40 space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-[#6A2B15]">
                            Kerala State Local Delivery (₹)
                          </label>
                          <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                            Pincodes: 67xxxx, 68xxxx, 69xxxx
                          </span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-[#8C7A6B]">₹</span>
                          <input
                            type="number"
                            required
                            min="0"
                            value={shippingRates.keralaLocal}
                            onChange={(e) => setShippingRates(prev => ({ ...prev, keralaLocal: Number(e.target.value) }))}
                            className="w-full pl-7 pr-3 py-2 border border-[#E5D9C8] rounded-lg text-sm bg-white font-bold text-[#6A2B15]"
                          />
                        </div>
                        <p className="text-[11px] text-[#8C7A6B]">
                          Automatically applied when the destination pincode is in Kerala.
                        </p>
                      </div>

                      {/* Pan-India Standard Shipping */}
                      <div className="p-4 border border-[#E5D9C8] rounded-xl bg-[#FAF7F2]/40 space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-[#6A2B15]">
                            Pan-India Standard Delivery (₹)
                          </label>
                          <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                            All Other Indian Pincodes
                          </span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-[#8C7A6B]">₹</span>
                          <input
                            type="number"
                            required
                            min="0"
                            value={shippingRates.panIndiaStandard}
                            onChange={(e) => setShippingRates(prev => ({ ...prev, panIndiaStandard: Number(e.target.value) }))}
                            className="w-full pl-7 pr-3 py-2 border border-[#E5D9C8] rounded-lg text-sm bg-white font-bold text-[#6A2B15]"
                          />
                        </div>
                        <p className="text-[11px] text-[#8C7A6B]">
                          Default delivery charge applied to every order (e.g. ₹49).
                        </p>
                      </div>

                      {/* International Delivery */}
                      <div className="p-4 border border-[#E5D9C8] rounded-xl bg-[#FAF7F2]/40 space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-[#6A2B15]">
                            International Worldwide (DHL Express) (₹)
                          </label>
                          <span className="text-[10px] font-semibold bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                            Outside India
                          </span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs font-bold text-[#8C7A6B]">₹</span>
                          <input
                            type="number"
                            required
                            min="0"
                            value={shippingRates.international}
                            onChange={(e) => setShippingRates(prev => ({ ...prev, international: Number(e.target.value) }))}
                            className="w-full pl-7 pr-3 py-2 border border-[#E5D9C8] rounded-lg text-sm bg-white font-bold text-[#6A2B15]"
                          />
                        </div>
                        <p className="text-[11px] text-[#8C7A6B]">
                          Flat express international air shipping charge.
                        </p>
                      </div>

                      {/* Free Shipping Rule Toggle */}
                      <div className="p-4 border border-[#E5D9C8] rounded-xl bg-[#FAF7F2]/40 space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-[#6A2B15]">
                            Free Shipping Threshold Rule
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={shippingRates.enableFreeShipping}
                              onChange={(e) => setShippingRates(prev => ({ ...prev, enableFreeShipping: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6A2B15]"></div>
                          </label>
                        </div>
                        {shippingRates.enableFreeShipping ? (
                          <div>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-xs font-bold text-[#8C7A6B]">₹</span>
                              <input
                                type="number"
                                min="0"
                                value={shippingRates.freeShippingThreshold}
                                onChange={(e) => setShippingRates(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                                className="w-full pl-7 pr-3 py-2 border border-[#E5D9C8] rounded-lg text-sm bg-white font-bold text-[#6A2B15]"
                              />
                            </div>
                            <p className="text-[11px] text-emerald-700 font-medium mt-1">
                              Orders above ₹{shippingRates.freeShippingThreshold} qualify for Free Delivery.
                            </p>
                          </div>
                        ) : (
                          <p className="text-[11px] text-[#8C7A6B] pt-2">
                            Free shipping disabled. Standard delivery charge (₹{shippingRates.panIndiaStandard}) will strictly apply to every order.
                          </p>
                        )}
                      </div>
                    </div>
                  </form>

                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#6A2B15] border-b pb-2 mb-4">Admin Users &amp; Roles</h3>
                    <div className="flex items-center gap-3 border p-3 rounded bg-[#FAF7F2]/45">
                      <div className="w-8 h-8 rounded-full bg-[#8C3B1F] text-[#E3C397] flex items-center justify-center font-bold text-xs">M</div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#6A2B15]">Maya Nair</p>
                        <p className="text-[10px] text-[#8C7A6B]">Store Owner (Super Admin)</p>
                      </div>
                      <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">Active</span>
                    </div>
                  </div>

                </div>
              )}
            </>
          )}

          {/* Coupon Creation / Gift Modal */}
          {showCouponModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl border border-[#E5D9C8] w-full max-w-xl p-6 relative max-h-[90vh] overflow-y-auto">
                <button 
                  type="button"
                  onClick={() => { setShowCouponModal(false); setEditingCoupon(null); }} 
                  className="absolute right-4 top-4 p-1.5 rounded hover:bg-[#FAF7F2] transition cursor-pointer"
                >
                  <X className="w-5 h-5 text-[#8C7A6B]" />
                </button>

                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E5D9C8] text-[#8C3B1F]">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#6A2B15]">
                      {couponForm.targetType === 'specific' ? 'Gift Customer Exclusive Coupon' : 'Seasonal / Campaign Coupon'}
                    </h3>
                    <p className="text-xs text-[#8C7A6B]">
                      {couponForm.targetType === 'specific' 
                        ? `Assign a single-use reward code directly to ${couponForm.assignedTo || 'this customer'}` 
                        : 'Create a single-use coupon campaign for eligible customers'}
                    </p>
                  </div>
                </div>

                <form onSubmit={saveCoupon} className="space-y-4 mt-5">
                  {/* Target Audience Selector */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1.5">Target Audience *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setCouponForm(prev => ({ ...prev, targetType: 'specific' }))}
                        className={`p-2.5 rounded-lg border text-left text-xs font-semibold cursor-pointer transition ${
                          couponForm.targetType === 'specific' 
                            ? 'border-[#8C3B1F] bg-[#FAF7F2] text-[#6A2B15] ring-1 ring-[#8C3B1F]' 
                            : 'border-[#E5D9C8] bg-white text-[#7D6B5A] hover:bg-[#FAF7F2]/40'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5 text-[#8C3B1F]" />
                          Specific Customer
                        </div>
                        <div className="text-[10px] text-[#8C7A6B] mt-0.5">Individual gift</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCouponForm(prev => ({ ...prev, targetType: 'all', assignedTo: '' }))}
                        className={`p-2.5 rounded-lg border text-left text-xs font-semibold cursor-pointer transition ${
                          couponForm.targetType === 'all' 
                            ? 'border-[#8C3B1F] bg-[#FAF7F2] text-[#6A2B15] ring-1 ring-[#8C3B1F]' 
                            : 'border-[#E5D9C8] bg-white text-[#7D6B5A] hover:bg-[#FAF7F2]/40'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#8C3B1F]" />
                          All Customers
                        </div>
                        <div className="text-[10px] text-[#8C7A6B] mt-0.5">Seasonal broadcast</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCouponForm(prev => ({ ...prev, targetType: 'min_spent', assignedTo: '' }))}
                        className={`p-2.5 rounded-lg border text-left text-xs font-semibold cursor-pointer transition ${
                          couponForm.targetType === 'min_spent' 
                            ? 'border-[#8C3B1F] bg-[#FAF7F2] text-[#6A2B15] ring-1 ring-[#8C3B1F]' 
                            : 'border-[#E5D9C8] bg-white text-[#7D6B5A] hover:bg-[#FAF7F2]/40'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-[#8C3B1F]" />
                          VIP Patrons
                        </div>
                        <div className="text-[10px] text-[#8C7A6B] mt-0.5">Spent above ₹X</div>
                      </button>
                    </div>
                  </div>

                  {couponForm.targetType === 'specific' && (
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Customer Email *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="e.g. arjun@gmail.com"
                        value={couponForm.assignedTo}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                        className="w-full p-2.5 border border-[#E5D9C8] rounded-lg text-sm bg-white"
                      />
                      <p className="text-[11px] text-[#8C7A6B] mt-1">This coupon will appear in this customer's profile and can only be used by them.</p>
                    </div>
                  )}

                  {couponForm.targetType === 'min_spent' && (
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Minimum Customer Lifetime Spend (₹) *</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        placeholder="5000"
                        value={couponForm.minCustomerSpent}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, minCustomerSpent: Number(e.target.value) }))}
                        className="w-full p-2.5 border border-[#E5D9C8] rounded-lg text-sm bg-white font-bold"
                      />
                      <p className="text-[11px] text-[#8C7A6B] mt-1">Visible and usable only by customers who have spent at least this much.</p>
                    </div>
                  )}

                  {/* Code */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Coupon Code *</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        required
                        placeholder="SAKHI-ROYAL-30"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, code: e.target.value.toUpperCase().replace(/\s+/g, '') }))}
                        className="w-full p-2.5 border border-[#E5D9C8] rounded-lg text-sm bg-white font-mono font-bold text-[#6A2B15]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const prefix = couponForm.targetType === 'specific' ? 'GIFT' : 'SEASON';
                          setCouponForm(prev => ({ ...prev, code: `SAKHI-${prefix}-${Math.floor(100 + Math.random() * 900)}` }));
                        }}
                        className="px-3 py-2 text-xs font-semibold border border-[#D5C7B7] rounded-lg hover:bg-[#FAF7F2] text-[#6A2B15] whitespace-nowrap cursor-pointer"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  {/* Discount Rules */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Discount Type *</label>
                      <select 
                        value={couponForm.discountType}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, discountType: e.target.value }))}
                        className="w-full p-2.5 border border-[#E5D9C8] rounded-lg text-sm bg-white"
                      >
                        <option value="Percentage">Percentage (%)</option>
                        <option value="Fixed">Flat Amount (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Discount Value *</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        placeholder={couponForm.discountType === 'Percentage' ? '30' : '500'}
                        value={couponForm.discountValue}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                        className="w-full p-2.5 border border-[#E5D9C8] rounded-lg text-sm bg-white font-bold"
                      />
                    </div>
                  </div>

                  {/* Min Order & Expiry */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">
                        Min Order Value (₹) *
                      </label>
                      <input 
                        type="number" 
                        min="0"
                        placeholder="1499"
                        value={couponForm.minOrderAmount}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, minOrderAmount: Number(e.target.value) }))}
                        className="w-full p-2.5 border border-[#E5D9C8] rounded-lg text-sm bg-white"
                      />
                      <p className="text-[10px] text-[#8C7A6B] mt-0.5">e.g. Orders above ₹1,499</p>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Expiry Date *</label>
                      <input 
                        type="date" 
                        required
                        value={couponForm.expiryDate}
                        onChange={(e) => setCouponForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full p-2.5 border border-[#E5D9C8] rounded-lg text-sm bg-white"
                      />
                    </div>
                  </div>

                  {/* Offer Description */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#8C7A6B] mb-1">Description / Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Exclusive 30% OFF on all orders above ₹1,499"
                      value={couponForm.description}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-2.5 border border-[#E5D9C8] rounded-lg text-sm bg-white"
                    />
                  </div>

                  {/* Single Use Rule Banner */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Strict Single-Use Rule Enforced</p>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Each customer can redeem this code exactly once. It will appear directly in their customer profile and cannot be reused after ordering.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[#E5D9C8]/60">
                    <button
                      type="button"
                      onClick={() => { setShowCouponModal(false); setEditingCoupon(null); }}
                      className="px-4 py-2 text-xs font-semibold text-[#7D6B5A] hover:bg-[#FAF7F2] rounded-lg border border-[#D5C7B7] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingCoupon}
                      className="px-5 py-2 text-xs font-bold text-white bg-[#6A2B15] hover:bg-[#8C3B1F] rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {savingCoupon ? (
                        <span>Saving...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{couponForm.targetType === 'specific' ? 'Gift Coupon Now' : 'Create Campaign'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
