'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types/product';
import { getProductById } from '@/lib/products';
import { trackAddToCart as dispatchAddToCart, trackRemoveFromCart as dispatchRemoveFromCart } from '@/lib/storefrontAnalytics';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  comboSubtotal: number;
  comboDiscount: number;
  comboDiscountPercent: number;
  totalPayable: number;
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
    packCount?: number,
    isComboItem?: boolean,
    isSecondVariantOffer?: boolean,
    originalUnitPrice?: number
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
          const variant = product.variants && product.variants.length > 0 ? product.variants.find(
            (v) => (item.variantId !== undefined && v.id === item.variantId) || (item.selectedVariant && v.name === item.selectedVariant)
          ) : undefined;

          let selectedVariant = item.selectedVariant;
          let variantPrice = item.variantPrice ?? product.price;
          let variantId = item.variantId;
          let isSecondVariantOffer = false;

          if (variant) {
            if (variant.inStock === false) return [];
            selectedVariant = variant.name;
            variantId = variant.id;
            variantPrice = item.variantPrice ?? variant.price ?? product.price;
          } else {
            // Simple product without backend-configured variants
            selectedVariant = undefined;
            variantId = undefined;
            variantPrice = product.price;
          }

          return [{
            ...item,
            product,
            selectedVariant,
            variantId,
            variantPrice,
            isSecondVariantOffer,
            originalUnitPrice: item.originalUnitPrice ?? product.price,
          }];
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

  // Combo Builder eligible cart value and discounts:
  // - Cart value above ₹3,000 -> 10% discount on combo builder items
  // - Cart value above ₹5,000 -> 15% discount on combo builder items
  // Applies dynamically, single tier only, never stacked.
  const comboSubtotal = items
    .filter((i) => i.isComboItem)
    .reduce((sum, item) => sum + (item.variantPrice ?? item.product.price) * item.quantity, 0);

  const comboDiscountPercent = comboSubtotal > 5000 ? 15 : comboSubtotal > 3000 ? 10 : 0;
  const comboDiscount = Math.round(comboSubtotal * (comboDiscountPercent / 100));
  const totalPayable = Math.max(0, subtotal - comboDiscount);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedVariant?: string,
    variantPrice?: number,
    variantId?: number,
    packCount?: number,
    isComboItem = false,
    isSecondVariantOffer = false,
    originalUnitPrice?: number
  ) => {
    const canonical = getProductById(product.id);
    if (!canonical?.inStock || !Number.isInteger(quantity) || quantity < 1) return;
    product = canonical;

    // 1. Check if matching WooCommerce variant exists
    const variant = product.variants && product.variants.length > 0 ? product.variants.find(
      (v) => (variantId !== undefined && v.id === variantId) || (selectedVariant && v.name === selectedVariant)
    ) : undefined;

    if (variant) {
      if (variant.inStock === false) return;
      selectedVariant = variant.name;
      variantId = variant.id;
      variantPrice = variantPrice ?? variant.price;
    } else {
      // Simple product without backend-configured variants
      selectedVariant = undefined;
      variantId = undefined;
      variantPrice = product.price;
    }

    packCount = 1;
    isSecondVariantOffer = false;

    originalUnitPrice = originalUnitPrice ?? product.price;

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
        if (isComboItem) next[existingIndex].isComboItem = true;
        if (isSecondVariantOffer) next[existingIndex].isSecondVariantOffer = true;
        next[existingIndex].originalUnitPrice = originalUnitPrice;
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedVariant,
          variantPrice,
          variantId,
          packCount,
          isComboItem,
          isSecondVariantOffer,
          originalUnitPrice,
        },
      ];
    });
    dispatchAddToCart(product, quantity, selectedVariant, variantPrice);
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
    const itemToRemove = items.find(
      (item) => item.product.id === productId && item.selectedVariant === variant
    );
    if (itemToRemove) {
      dispatchRemoveFromCart(itemToRemove.product, itemToRemove.quantity, itemToRemove.selectedVariant);
    }
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
        comboSubtotal,
        comboDiscount,
        comboDiscountPercent,
        totalPayable,
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
