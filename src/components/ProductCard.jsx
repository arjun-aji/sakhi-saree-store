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
          className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF7EC] mb-1.5 cursor-pointer"
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
            <div className="absolute top-2 left-2 bg-[#6A2B15] text-[#FFFFF0] text-[8px] sm:text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm shadow-xs z-10 pointer-events-none">
              {displayBadge}
            </div>
          )}

          {/* Top Right Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label="Add to Wishlist"
            className="absolute top-2 right-2 p-1 hover:bg-[#FFFFF0]/70 rounded-full text-[#8C3B1F] hover:text-[#B84D28] transition-all duration-200 z-10"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.75] transition-colors ${
                isWishlisted ? 'fill-[#B84D28] text-[#B84D28]' : 'text-white drop-shadow'
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
            <h3 className="font-serif-luxury text-[11px] sm:text-xs font-medium text-[#6A2B15] group-hover:text-[#B84D28] transition-colors leading-snug line-clamp-1">
              {name}
            </h3>
          </button>

          {/* Price Row */}
          <div className="flex items-baseline gap-1">
            <span className="font-serif-luxury text-[11px] sm:text-xs font-bold text-[#6A2B15]">
              ₹{price?.toLocaleString('en-IN')}
            </span>
            {originalPrice && (
              <span className="text-[9px] sm:text-[10px] text-[#8A786D] line-through font-normal">
                ₹{originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Add To Cart & WhatsApp Row */}
        <div className="flex gap-1 w-full">
          {/* Add To Cart Button */}
          <button
            type="button"
            onClick={handleAddToCartClick}
            className={`flex-grow inline-flex items-center justify-center gap-1 border py-1 px-1 text-[8.5px] sm:text-[9.5px] font-bold tracking-widest uppercase transition-all duration-300 ${
              addedToCart
                ? 'bg-[#1E5631] text-white border-[#1E5631]'
                : 'bg-transparent hover:bg-[#6A2B15] border-[#C5B9AD] hover:border-[#6A2B15] text-[#8C3B1F] hover:text-[#FFFFF0]'
            }`}
          >
            {addedToCart ? (
              <>
                <span>ADDED</span>
                <Check className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>ADD TO CART</span>
                <ShoppingCart className="w-3 h-3 stroke-[1.75]" />
              </>
            )}
          </button>

          {/* WhatsApp Buy Button */}
          <a
            href={`https://wa.me/919746598789?text=${encodeURIComponent(`Hi! I am interested in buying the saree: ${name} (Price: ₹${price}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Buy on WhatsApp"
            className="inline-flex items-center justify-center p-1.5 bg-[#1E5631] hover:bg-[#153e22] text-white border border-[#1E5631] transition-all duration-300"
          >
            <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* QUICK VIEW POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          {/* Modal Container */}
          <div className="bg-[#FFFFF0] max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#E5D9C8] shadow-2xl rounded-lg p-5 sm:p-7 relative flex flex-col md:flex-row gap-6">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#FAF7EC] text-[#8C3B1F] transition z-10"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Image Gallery */}
            <div className="w-full md:w-1/2 flex flex-col gap-3">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF7EC] rounded border border-[#E5D9C8]">
                <Image
                  src={activeImage || '/assets/about/hero_stack.jpg'}
                  alt={name}
                  fill
                  className="object-cover object-center"
                />
                {displayBadge && (
                  <span className="absolute top-3 left-3 bg-[#6A2B15] text-[#FFFFF0] text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-sm">
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
                        activeImage === img ? 'border-[#B84D28] scale-105' : 'border-[#E5D9C8] hover:border-[#B84D28]/65'
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
                <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-[#6A2B15] leading-tight">
                  {name}
                </h2>
                
                {/* Price */}
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif-luxury text-lg font-bold text-[#6A2B15]">
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
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#B84D28] font-semibold">
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
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-[#E5D9C8]/60 py-2 text-[#4E3F3B]">
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
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddToCartClick}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                      addedToCart
                        ? 'bg-[#1E5631] text-white border-[#1E5631]'
                        : 'bg-[#6A2B15] border-[#6A2B15] text-[#FFFFF0] hover:bg-[#8C3B1F]'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{addedToCart ? 'ADDED TO CART' : 'ADD TO CART'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWishlistClick}
                    className={`p-2.5 border border-[#C5B9AD] rounded hover:bg-[#FAF7F2] transition text-[#8C3B1F]`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#B84D28] text-[#B84D28]' : 'text-gray-500'}`} />
                  </button>
                </div>

                <a
                  href={`https://wa.me/919746598789?text=${encodeURIComponent(`Hi! I am interested in buying the saree: ${name} (Price: ₹${price}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold tracking-widest uppercase transition-all duration-300 bg-[#1E5631] hover:bg-[#153e22] text-white rounded shadow-sm text-center cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  <span>Buy on WhatsApp</span>
                </a>
              </div>

              {/* Reviews & Submit Form Section */}
              <div className="mt-2 border-t border-[#E5D9C8]/60 pt-4 flex-1 flex flex-col gap-4 min-h-[180px]">
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
                      <div key={idx} className="border-b border-[#E5D9C8]/30 pb-2">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-semibold text-[#6A2B15]">{rev.customerName}</span>
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
                <form onSubmit={handleReviewSubmit} className="space-y-2 border-t border-[#E5D9C8]/30 pt-3">
                  <span className="font-semibold text-[#8C7A6B] uppercase tracking-wider block text-[10px]">Add a Saree Review</span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                      className="col-span-2 p-1.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-xs bg-white"
                    />
                    
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                      className="p-1.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-xs bg-white text-[#6A2B15]"
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
                      className="flex-1 p-1.5 rounded border border-[#E5D9C8] focus:outline-none focus:ring-1 focus:ring-[#6A2B15] text-xs bg-white"
                    />
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-[#6A2B15] text-[#FFFFF0] px-3 py-1 rounded text-xs font-semibold hover:bg-[#8C3B1F] disabled:opacity-50 flex-shrink-0"
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
