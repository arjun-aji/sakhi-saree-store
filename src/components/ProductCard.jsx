'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Check, X, Star, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({
  id,
  image,
  name,
  price,
  originalPrice,
  badge,
  isNew,
  isBestSeller,
  fabric,
  color,
  slug,
  description,
  images = [],
  gridImage,
}) {
  const { addToCart, wishlistItems, toggleWishlist } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal states
  const [activeImage, setActiveImage] = useState(image);
  const [reviewsList, setReviewsList] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  
  // Review form states
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const isWishlisted = wishlistItems.includes(id);

  // Initialize active image when modal opens or image changes
  useEffect(() => {
    setActiveImage(image);
  }, [image, isModalOpen]);

  // Load reviews when modal is opened
  useEffect(() => {
    if (isModalOpen) {
      async function fetchReviews() {
        setIsLoadingReviews(true);
        try {
          const res = await fetch('/api/reviews');
          const data = await res.json();
          if (data.success && Array.isArray(data.reviews)) {
            const filtered = data.reviews.filter(r => r.productName === name && r.status === 'Approved');
            setReviewsList(filtered);
          }
        } catch (err) {
          console.error('Failed to load reviews:', err);
        } finally {
          setIsLoadingReviews(false);
        }
      }
      fetchReviews();
    }
  }, [isModalOpen, name]);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id,
      name,
      price,
      originalPrice,
      fabric,
      color,
      image,
      slug,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: name,
          customerName: reviewForm.name,
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccess(true);
        setReviewForm({ name: '', rating: 5, comment: '' });
        setTimeout(() => setReviewSuccess(false), 3000);
        // Show immediately in the list as approved for instant feedback
        setReviewsList(prev => [{
          productName: name,
          customerName: data.review?.customerName || reviewForm.name,
          rating: data.review?.rating || reviewForm.rating,
          comment: data.review?.comment || reviewForm.comment,
          createdAt: new Date().toISOString()
        }, ...prev]);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const displayBadge = badge || (isNew ? 'NEW' : isBestSeller ? 'BESTSELLER' : null);

  // Compile all unique images for the gallery
  const galleryImages = Array.from(new Set([image, gridImage, ...images].filter(Boolean)));

  // Calculate average rating
  const averageRating = reviewsList.length > 0 
    ? (reviewsList.reduce((acc, curr) => acc + curr.rating, 0) / reviewsList.length).toFixed(1)
    : null;

  return (
    <>
      <div className="group flex flex-col border border-[#E5DACD] p-2 hover:border-[#C59B27]/50 transition-colors duration-300">
        {/* Saree Image Container — portrait */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFE6DD] mb-1.5 cursor-pointer"
        >
          <Image
            src={image || '/assets/about/hero_stack.jpg'}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Left Badge */}
          {displayBadge && (
            <div className="absolute top-2 left-2 bg-[#2A0E11] text-[#F7EFE8] text-[8px] sm:text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm shadow-xs z-10 pointer-events-none">
              {displayBadge}
            </div>
          )}

          {/* Top Right Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label="Add to Wishlist"
            className="absolute top-2 right-2 p-1 hover:bg-[#F7EFE8]/70 rounded-full text-[#3D1418] hover:text-[#8B2635] transition-all duration-200 z-10"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.75] transition-colors ${
                isWishlisted ? 'fill-[#8B2635] text-[#8B2635]' : 'text-white drop-shadow'
              }`}
            />
          </button>
        </div>

        {/* Product Details */}
        <div className="space-y-0 mb-1.5 flex-1">
          {/* Title */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-left block w-full"
          >
            <h3 className="font-serif-luxury text-[11px] sm:text-xs font-medium text-[#2A0E11] group-hover:text-[#8B2635] transition-colors leading-snug line-clamp-1">
              {name}
            </h3>
          </button>

          {/* Price Row */}
          <div className="flex items-baseline gap-1">
            <span className="font-serif-luxury text-[11px] sm:text-xs font-bold text-[#2A0E11]">
              ₹{price?.toLocaleString('en-IN')}
            </span>
            {originalPrice && (
              <span className="text-[9px] sm:text-[10px] text-[#8A786D] line-through font-normal">
                ₹{originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Add To Cart Button */}
        <button
          type="button"
          onClick={handleAddToCartClick}
          className={`w-full inline-flex items-center justify-center gap-1 border py-1 px-2 text-[8.5px] sm:text-[9.5px] font-bold tracking-widest uppercase transition-all duration-300 ${
            addedToCart
              ? 'bg-[#1E5631] text-white border-[#1E5631]'
              : 'bg-transparent hover:bg-[#2A0E11] border-[#C5B9AD] hover:border-[#2A0E11] text-[#3D1418] hover:text-[#F7EFE8]'
          }`}
        >
          {addedToCart ? (
            <>
              <span>ADDED TO CART</span>
              <Check className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>ADD TO CART</span>
              <ShoppingCart className="w-3 h-3 stroke-[1.75]" />
            </>
          )}
        </button>
      </div>

      {/* QUICK VIEW POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          {/* Modal Container */}
          <div className="bg-[#F7EFE8] max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#E2D4C5] shadow-2xl rounded-lg p-5 sm:p-7 relative flex flex-col md:flex-row gap-6">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#EFE6DD] text-[#3D1418] transition z-10"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Image Gallery */}
            <div className="w-full md:w-1/2 flex flex-col gap-3">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFE6DD] rounded border border-[#E2D4C5]">
                <Image
                  src={activeImage || '/assets/about/hero_stack.jpg'}
                  alt={name}
                  fill
                  className="object-cover object-center"
                />
                {displayBadge && (
                  <span className="absolute top-3 left-3 bg-[#2A0E11] text-[#F7EFE8] text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-sm">
                    {displayBadge}
                  </span>
                )}
              </div>
              
              {/* Thumbnails Row */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-12 h-14 flex-shrink-0 border-2 rounded overflow-hidden transition-all ${
                        activeImage === img ? 'border-[#8B2635] scale-105' : 'border-[#E2D4C5] hover:border-[#8B2635]/65'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${name} gallery ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Saree Details & Reviews */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div>
                <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-[#2A0E11] leading-tight">
                  {name}
                </h2>
                
                {/* Price */}
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif-luxury text-lg font-bold text-[#2A0E11]">
                    ₹{price?.toLocaleString('en-IN')}
                  </span>
                  {originalPrice && (
                    <span className="text-xs text-[#8A786D] line-through font-normal">
                      ₹{originalPrice?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Rating summary */}
                {averageRating && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#8B2635] font-semibold">
                    <div className="flex text-[#C59B27]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < Math.round(Number(averageRating)) ? 'fill-[#C59B27]' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span>{averageRating} / 5.0 ({reviewsList.length} reviews)</span>
                  </div>
                )}
              </div>

              {/* Saree attributes */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-[#E2D4C5]/60 py-2 text-[#4E3F3B]">
                <div>
                  <span className="font-semibold text-[#8C7A6B] uppercase tracking-wider block text-[10px]">Fabric</span>
                  <span>{fabric || 'Premium Silk Blend'}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#8C7A6B] uppercase tracking-wider block text-[10px]">Color shade</span>
                  <span>{color || 'Mixed'}</span>
                </div>
              </div>

              {/* Saree Description */}
              <div className="text-xs text-[#4E3F3B] leading-relaxed max-h-[120px] overflow-y-auto pr-1">
                <span className="font-semibold text-[#8C7A6B] uppercase tracking-wider block text-[10px] mb-1">Details & Styling</span>
                <p>
                  {description || `Experience the timeless elegance of this handloomed saree. Expertly crafted in rich color shades and fine textures, this piece features gorgeous gold border patterns and a royal heritage look. Perfect for traditional gatherings and festive elegance.`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                    addedToCart
                      ? 'bg-[#1E5631] text-white border-[#1E5631]'
                      : 'bg-[#2A0E11] border-[#2A0E11] text-[#F7EFE8] hover:bg-[#3D1418]'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{addedToCart ? 'ADDED TO CART' : 'ADD TO CART'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWishlistClick}
                  className={`p-2.5 border border-[#C5B9AD] rounded hover:bg-[#FAF7F2] transition text-[#3D1418]`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#8B2635] text-[#8B2635]' : 'text-gray-500'}`} />
                </button>
              </div>

              {/* Reviews & Submit Form Section */}
              <div className="mt-2 border-t border-[#E2D4C5]/60 pt-4 flex-1 flex flex-col gap-4 min-h-[180px]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Customer Reviews ({reviewsList.length})</span>
                </h4>

                {/* Reviews List */}
                <div className="flex-1 max-h-[140px] overflow-y-auto space-y-3 pr-1 text-xs">
                  {isLoadingReviews ? (
                    <p className="text-[#8C7A6B]">Loading reviews...</p>
                  ) : reviewsList.length === 0 ? (
                    <p className="text-[#8C7A6B] italic">No reviews yet. Be the first to share your thoughts!</p>
                  ) : (
                    reviewsList.map((rev, idx) => (
                      <div key={idx} className="border-b border-[#E2D4C5]/30 pb-2">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-semibold text-[#2A0E11]">{rev.customerName}</span>
                          <div className="flex text-[#C59B27]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-2.5 h-2.5 ${i < rev.rating ? 'fill-[#C59B27]' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#4E3F3B] leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Review Form */}
                <form onSubmit={handleReviewSubmit} className="space-y-2 border-t border-[#E2D4C5]/30 pt-3">
                  <span className="font-semibold text-[#8C7A6B] uppercase tracking-wider block text-[10px]">Add a Saree Review</span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                      className="col-span-2 p-1.5 rounded border border-[#E2D4C5] focus:outline-none focus:ring-1 focus:ring-[#2A0E11] text-xs bg-white"
                    />
                    
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                      className="p-1.5 rounded border border-[#E2D4C5] focus:outline-none focus:ring-1 focus:ring-[#2A0E11] text-xs bg-white text-[#2A0E11]"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write your review comments here..."
                      required
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="flex-1 p-1.5 rounded border border-[#E2D4C5] focus:outline-none focus:ring-1 focus:ring-[#2A0E11] text-xs bg-white"
                    />
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-[#2A0E11] text-[#F7EFE8] px-3 py-1 rounded text-xs font-semibold hover:bg-[#3D1418] disabled:opacity-50 flex-shrink-0"
                    >
                      {submittingReview ? 'Sending...' : 'Post'}
                    </button>
                  </div>
                  {reviewSuccess && (
                    <p className="text-[10px] text-green-700 font-semibold">Thank you! Your review was successfully submitted.</p>
                  )}
                </form>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
