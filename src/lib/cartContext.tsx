'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types/product';
import { getProductById } from '@/lib/products';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (
    product: Product,
    quantity?: number,
    selectedVariant?: string,
    variantPrice?: number,
    variantId?: number,
    packCount?: number
  ) => void;
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
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed.flatMap((item: CartItem) => {
          const product = getProductById(item.product?.id);
          if (!product?.inStock || !Number.isInteger(item.quantity) || item.quantity < 1) return [];

          // 1. Check if matching WooCommerce variant exists
          const variant = product.variants.find(
            (v) => (item.variantId !== undefined && v.id === item.variantId) || (item.selectedVariant && v.name === item.selectedVariant)
          );

          // 2. Check if matching packOption exists on product
          const packOption = product.packOptions?.find(
            (p) => p.name === item.selectedVariant || p.id === item.selectedVariant
          );

          let selectedVariant = item.selectedVariant;
          let variantPrice = item.variantPrice;
          let variantId = item.variantId;

          if (variant) {
            if (variant.inStock === false) return [];
            selectedVariant = variant.name;
            variantId = variant.id;
            variantPrice = item.variantPrice ?? variant.price;
          } else if (packOption) {
            selectedVariant = packOption.name;
            variantPrice = item.variantPrice ?? packOption.price;
          } else if (item.variantPrice !== undefined) {
            // Preserve custom pack course pricing
            selectedVariant = item.selectedVariant || 'Standard';
            variantPrice = item.variantPrice;
          } else {
            const defaultVariant = product.variants.find((v) => v.default) || product.variants[0];
            if (defaultVariant?.inStock === false) return [];
            selectedVariant = defaultVariant?.name;
            variantId = defaultVariant?.id;
            variantPrice = defaultVariant?.price ?? product.price;
          }

          return [{ ...item, product, selectedVariant, variantId, variantPrice }];
        }));
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
    const itemPrice = item.variantPrice ?? item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedVariant?: string,
    variantPrice?: number,
    variantId?: number,
    packCount?: number
  ) => {
    const canonical = getProductById(product.id);
    if (!canonical?.inStock || !Number.isInteger(quantity) || quantity < 1) return;
    product = canonical;

    // 1. Check if matching WooCommerce variant exists
    const variant = product.variants.find(
      (v) => (variantId !== undefined && v.id === variantId) || (selectedVariant && v.name === selectedVariant)
    );

    // 2. Check if matching packOption exists on product
    const packOption = product.packOptions?.find(
      (p) => p.name === selectedVariant || p.id === selectedVariant
    );

    if (variant) {
      if (variant.inStock === false) return;
      selectedVariant = variant.name;
      variantId = variant.id;
      variantPrice = variantPrice ?? variant.price;
    } else if (packOption) {
      selectedVariant = packOption.name;
      variantPrice = variantPrice ?? packOption.price;
      if (!packCount && packOption.packCount) {
        packCount = packOption.packCount;
      }
    } else if (variantPrice !== undefined) {
      // Preserve custom pack course pricing passed by PDP course selector
      selectedVariant = selectedVariant || 'Standard Course';
    } else {
      const defaultVariant = product.variants.find((v) => v.default) || product.variants[0];
      if (defaultVariant?.inStock === false) return;
      selectedVariant = defaultVariant?.name;
      variantId = defaultVariant?.id;
      variantPrice = defaultVariant?.price ?? product.price;
    }

    if (!packCount) {
      // Infer pack count from variant name or subtitle if not explicitly supplied
      const lower = (selectedVariant || '').toLowerCase();
      if (lower.includes('3-month') || lower.includes('3 month') || lower.includes('3 pack') || lower.includes('three pack')) {
        packCount = 3;
      } else if (lower.includes('2-month') || lower.includes('2 month') || lower.includes('2 pack') || lower.includes('two bottle') || lower.includes('pack of 2')) {
        packCount = 2;
      } else if (lower.includes('4 bottle') || lower.includes('four bottle')) {
        packCount = 4;
      } else {
        packCount = 1;
      }
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedVariant === selectedVariant
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        if (variantPrice !== undefined) next[existingIndex].variantPrice = variantPrice;
        if (variantId !== undefined) next[existingIndex].variantId = variantId;
        if (packCount !== undefined) next[existingIndex].packCount = packCount;
        return next;
      }
      return [...prev, { product, quantity, selectedVariant, variantPrice, variantId, packCount }];
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

  // In-site checkout URL
  const checkoutUrl = '/checkout';

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
