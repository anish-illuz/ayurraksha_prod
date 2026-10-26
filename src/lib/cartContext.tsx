'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types/product';
import { SITE_CONFIG } from '@/data/siteConfig';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  updateQuantity: (productId: number, quantity: number, variant?: string) => void;
  removeFromCart: (productId: number, variant?: string) => void;
  clearCart: () => void;
  checkoutUrl: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'ayurraksha_cart_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items, mounted]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (product: Product, quantity = 1, selectedVariant?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedVariant === selectedVariant
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedVariant }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedVariant === variant) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: number, variant?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedVariant === variant)
      )
    );
  };

  const clearCart = () => setItems([]);

  // Generate checkout URL linking to WooCommerce with first product or direct checkout
  // If multiple items, points to /checkout on the live domain
  const checkoutUrl = items.length === 1
    ? `https://www.ayurrakshaonline.com/checkout/?add-to-cart=${items[0].product.id}&quantity=${items[0].quantity}`
    : 'https://www.ayurrakshaonline.com/checkout/';

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        checkoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
