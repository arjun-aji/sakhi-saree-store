import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Review from '@/models/Review';
import Coupon from '@/models/Coupon';
import Blog from '@/models/Blog';
import FAQ from '@/models/FAQ';
import FilterConfig from '@/models/FilterConfig';
import { products } from '@/data/products';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await connectDB();

    // 1. Seed Products if empty or force-refresh
    // We will clear existing products to have a fresh state aligned with data/products.js
    await Product.deleteMany({});
    const formattedProducts = products.map(p => ({
      name: p.name,
      image: p.image,
      price: p.price,
      originalPrice: p.originalPrice || p.price + 500,
      badge: p.badge || '',
      isNew: p.isNew || false,
      isBestSeller: p.isBestSeller || false,
      category: p.category,
      fabric: p.fabric || 'Silk Blend',
      color: p.color || 'Mixed',
      slug: p.slug || p.name.toLowerCase().replace(/ /g, '-'),
      stock: Math.floor(Math.random() * 20) + 5,
    }));
    const seededProducts = await Product.insertMany(formattedProducts);
    console.log(`Seeded ${seededProducts.length} products`);

    // 2. Clear Orders (keeping it empty for clean user testing)
    await Order.deleteMany({});

    // 3. Seed Reviews
    await Review.deleteMany({});
    const sampleReviews = [
      {
        productName: seededProducts[0].name,
        customerName: 'Divya R.',
        rating: 5,
        comment: 'Absolutely stunning Banarasi saree! The texture is soft, and the gold weave looks extremely royal. Perfect for wedding functions.',
        status: 'Approved'
      },
      {
        productName: seededProducts[1].name,
        customerName: 'Sruthy Thomas',
        rating: 4,
        comment: 'Lovely authentic Kanjivaram saree. The emerald green shade is gorgeous. Knocked off one star only because shipping took a couple of extra days.',
        status: 'Approved'
      },
      {
        productName: seededProducts[2].name,
        customerName: 'Sandhya J.',
        rating: 5,
        comment: 'So smooth and lightweight! I received so many compliments when I wore this purple silk saree.',
        status: 'Pending'
      }
    ];
    await Review.insertMany(sampleReviews);

    // 4. Seed Coupons
    await Coupon.deleteMany({});
    const sampleCoupons = [
      {
        code: 'WELCOME10',
        discountType: 'Percentage',
        discountValue: 10,
        expiryDate: new Date('2026-12-31'),
        active: true
      },
      {
        code: 'FESTIVE500',
        discountType: 'Fixed',
        discountValue: 500,
        expiryDate: new Date('2026-10-31'),
        active: true
      }
    ];
    await Coupon.insertMany(sampleCoupons);

    // 5. Seed Blogs
    await Blog.deleteMany({});
    const sampleBlogs = [
      {
        title: 'The Art of Draping: Traditional Kerala Kasavu Sarees',
        summary: 'Explore the history, meaning, and elegant ways to drape the iconic cream-and-gold Kerala Kasavu saree.',
        content: '<p>The traditional Kerala Kasavu saree, with its signature golden border, represents purity and elegance. Dating back centuries, it has evolved into a style statement for festive occasions...</p>',
        image: '/assets/about/story_tradition.jpg',
        author: 'Maya Nair'
      },
      {
        title: 'How to Care for Your Precious Handwoven Silk Sarees',
        summary: 'A simple guide to washing, ironing, and storing your silk sarees so they remain brand new for generations.',
        content: '<p>Silk sarees are heirloom items. To keep them looking fresh, store them wrapped in muslin cloths, change folding patterns regularly to avoid tears along creases, and dry clean only...</p>',
        image: '/assets/about/story_crafted.jpg',
        author: 'Admin'
      }
    ];
    await Blog.insertMany(sampleBlogs);

    // 6. Seed FAQs
    await FAQ.deleteMany({});
    const sampleFAQs = [
      {
        question: 'Do you ship internationally?',
        answer: 'Yes! We ship our handpicked sarees worldwide. International shipping rates are calculated at checkout based on package weight and destination.',
        category: 'Shipping'
      },
      {
        question: 'What is your return policy?',
        answer: 'Since our sarees are handwoven and checked for quality before dispatch, we accept returns only in case of transit damage or wrong product delivered. Please contact us within 48 hours of delivery.',
        category: 'Returns'
      },
      {
        question: 'Are all your sarees 100% authentic handloom?',
        answer: 'Yes, we source directly from master weavers and artisans across Kerala, Banaras, and Kanchipuram to ensure 100% authentic materials and craftsmanship.',
        category: 'Product Details'
      }
    ];
    await FAQ.insertMany(sampleFAQs);

    // 7. Seed Filter Configurations
    await FilterConfig.deleteMany({});
    const defaultFilters = {
      categories: [
        { label: 'All Sarees', value: 'All' },
        { label: 'Silk Sarees', value: 'Silk Sarees' },
        { label: 'Kanjivaram', value: 'Kanjivaram' },
        { label: 'Banarasi', value: 'Banarasi' },
        { label: 'Cotton Sarees', value: 'Cotton Sarees' },
        { label: 'Tussar Sarees', value: 'Tussar Sarees' }
      ],
      fabrics: [
        { label: 'Silk', value: 'Silk' },
        { label: 'Kanjivaram Silk', value: 'Kanjivaram Silk' },
        { label: 'Banarasi Silk', value: 'Banarasi Silk' },
        { label: 'Cotton', value: 'Cotton' },
        { label: 'Tussar', value: 'Tussar' }
      ],
      colors: [
        { name: 'Red', hex: '#8B2635', border: false },
        { name: 'Purple', hex: '#4A154B', border: false },
        { name: 'Green', hex: '#1E5631', border: false },
        { name: 'Blue', hex: '#1B365D', border: false },
        { name: 'Yellow', hex: '#D4AF37', border: false },
        { name: 'Pink', hex: '#E8A598', border: false },
        { name: 'Cream', hex: '#F5ECE4', border: true },
        { name: 'Black', hex: '#2A0E11', border: false }
      ]
    };
    await FilterConfig.create(defaultFilters);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with products, orders, reviews, coupons, blogs, FAQs, and filters'
    });
  } catch (error) {
    console.error('Seeder Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Seeding failed' },
      { status: 500 }
    );
  }
}
