'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load cart from localStorage on mount (client-side)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('sakhi_cart_items');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem('sakhi_wishlist_items');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
  }, []);

  // Sync cart to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem('sakhi_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('sakhi_wishlist_items', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistItems]);

  /* ── Add Product To Cart ── */
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        // Increment quantity if item already exists
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        // Add new product item
        const newItem = {
          id: product.id,
          name: product.name,
          fabric: product.fabric || 'Silk',
          color: product.color || 'Classic',
          price: product.price,
          originalPrice: product.originalPrice || Math.round(product.price * 1.25),
          quantity: 1,
          image: product.image || '/assets/about/hero_stack.jpg',
          wishlisted: wishlistItems.includes(product.id),
        };
        return [...prevItems, newItem];
      }
    });
  };

  /* ── Update Quantity (Auto-remove when reduced from 1 to 0) ── */
  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) {
              return null; // Marked for removal
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean); // Filters out null (removed) items automatically
    });
  };

  /* ── Explicit Remove Item ── */
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  /* ── Clear Cart ── */
  const clearCart = () => {
    setCartItems([]);
  };

  /* ── Toggle Wishlist ── */
  const toggleWishlist = (id) => {
    setWishlistItems((prev) => {
      const isWishlisted = prev.includes(id);
      return isWishlisted ? prev.filter((item) => item !== id) : [...prev, id];
    });
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, wishlisted: !item.wishlisted } : item))
    );
  };

  /* Total Count of all items in cart */
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  /* Total Wishlist count */
  const wishlistCount = wishlistItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        wishlistItems,
        wishlistCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleWishlist,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
