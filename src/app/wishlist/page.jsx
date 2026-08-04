'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { Heart, ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';
import { products as localProducts } from '@/data/products';

export default function WishlistPage() {
  const { wishlistItems } = useCart();
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all products to filter wishlisted ones
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
        console.error('Error fetching products, falling back to local:', err);
      }

      // Fallback
      setProductsList(localProducts.map(p => ({ ...p, id: p.id || p._id })));
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  // Filter wishlisted products
  const wishlistedProducts = productsList.filter(
    (product) => wishlistItems.includes(product.id) || wishlistItems.includes(product._id)
  );

  return (
    <div className="min-h-screen bg-[#FFFFF0] text-[#2D2625] flex flex-col">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest text-[#8C7A6B] uppercase mb-6">
          <Link href="/" className="hover:text-[#B84D28] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#8C3B1F]">Wishlist</span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8 space-y-1">
          <div className="inline-flex items-center justify-center gap-1.5 text-[#8B5A3C] uppercase tracking-[0.25em] text-[10px] font-bold">
            <span>MY COLLECTION</span>
            <Heart className="w-3.5 h-3.5 text-[#B84D28] fill-[#B84D28]" />
          </div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#6A2B15] tracking-tight">
            Your Wishlist
          </h1>
          <p className="text-xs text-[#8A786D] max-w-md mx-auto">
            Sarees you have saved to purchase later or admire.
          </p>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 text-[#B84D28] animate-spin" />
            <p className="text-xs font-bold tracking-widest text-[#8C7A6B] uppercase">Loading your wishlist...</p>
          </div>
        ) : wishlistedProducts.length === 0 ? (
          /* Empty Wishlist State */
          <div className="max-w-md mx-auto text-center py-16 px-6 border border-[#E5DACD] bg-[#FAF7F2]/50 rounded-lg space-y-6">
            <div className="w-16 h-16 bg-[#FAF7EC] rounded-full flex items-center justify-center mx-auto text-[#8A786D]">
              <Heart className="w-8 h-8 stroke-[1.25]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-serif-luxury text-lg font-medium text-[#6A2B15]">Your Wishlist is Empty</h2>
              <p className="text-xs text-[#8A786D] leading-relaxed">
                Explore our handwoven sarees, bridal collections, and new arrivals to add your favorites here.
              </p>
            </div>
            <Link
              href="/#shop"
              className="inline-flex items-center justify-center gap-2 bg-[#6A2B15] hover:bg-[#8C3B1F] text-[#FFFFF0] px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded shadow-xs w-full"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Sarees</span>
            </Link>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((product) => (
              <ProductCard
                key={product.id || product._id}
                id={product.id || product._id}
                image={product.image}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                badge={product.badge}
                isNew={product.isNew}
                isBestSeller={product.isBestSeller}
                fabric={product.fabric}
                color={product.color}
                slug={product.slug}
                description={product.description}
                images={product.images}
                gridImage={product.gridImage}
              />
            ))}
          </div>
        )}

        {/* Back to Shop Link */}
        {wishlistedProducts.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/#shop"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#B84D28] hover:text-[#8C3B1F] uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
