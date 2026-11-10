'use client';

import React, { createContext, useContext, useState } from 'react';
import { Product, PackOption } from '@/types/product';
import { useCart } from '@/lib/cartContext';
import { formatPackMeasurement } from '@/lib/formatPack';

interface PDPContextType {
  product: Product;
  hasVariants: boolean;
  packOptions: PackOption[];
  selectedPack: PackOption;
  selectedPackId: string;
  setSelectedPackId: (id: string) => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  currentPrice: number;
  currentRegularPrice: number;
  currentDiscount: number;
  unitPrice: number;
  totalPrice: number;
  isSecondVariant: boolean;
  savingsAmount: number;
  isAvailable: boolean;
  isAdded: boolean;
  handleAddToCart: () => void;
}

const PDPContext = createContext<PDPContextType | undefined>(undefined);

export const PDPProvider: React.FC<{
  product: Product;
  children: React.ReactNode;
}> = ({ product, children }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Requirement: Display variants ONLY when available and configured in the backend (cms)
  // Backend is the single source of truth. Simple products must be displayed as simple products without artificial variants.
  const hasVariants = Boolean(product.variants && product.variants.length > 1);

  const packOptions: PackOption[] = hasVariants
    ? product.variants.map((v, idx) => ({
        id: v.slug || String(v.id || idx),
        name: v.name,
        subtitle: (v as any).attributes ? Object.values((v as any).attributes).join(', ') : (formatPackMeasurement(product.specNetQuantity) || ''),
        price: v.price ?? product.price,
        regularPrice: v.regularPrice ?? v.price ?? product.price,
        discountBadge: v.discountPercent && v.discountPercent > 0 ? `Save ${v.discountPercent}%` : undefined,
        isDefault: v.default || idx === 0,
        packCount: 1,
      }))
    : [];

  const defaultPack: PackOption = hasVariants && packOptions.length > 0
    ? (packOptions.find((p) => p.isDefault) || packOptions[0])
    : {
        id: 'simple',
        name: 'Standard',
        subtitle: formatPackMeasurement(product.specNetQuantity) || '',
        price: product.price,
        regularPrice: product.regularPrice || product.price,
        isDefault: true,
        packCount: 1,
      };

  const [selectedPackId, setSelectedPackIdState] = useState<string>(defaultPack.id);
  const [quantity, setQuantity] = useState<number>(1);

  const selectedPack = hasVariants && packOptions.length > 0
    ? (packOptions.find((p) => p.id === selectedPackId) || defaultPack)
    : defaultPack;

  const setSelectedPackId = (id: string) => {
    setSelectedPackIdState(id);
  };

  // Pricing calculations
  // Single/Simple Product: unit price = product.price, total = product.price * quantity
  // Variable Product: unit price = variant.price, total = variant.price * quantity
  const unitPrice = selectedPack.price;
  const currentPrice = selectedPack.price;
  const currentRegularPrice = selectedPack.regularPrice || selectedPack.price;
  const currentDiscount = currentRegularPrice > currentPrice
    ? Math.round(((currentRegularPrice - currentPrice) / currentRegularPrice) * 100)
    : 0;

  const totalPrice = unitPrice * quantity;
  const savingsAmount = Math.max(0, (currentRegularPrice - currentPrice) * quantity);

  // Backward compatibility flag for components expecting boolean
  const isSecondVariant = false;

  const incrementQuantity = () => {
    setQuantity((q) => q + 1);
  };

  const decrementQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const isAvailable = product.inStock;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    const matchingVariant = hasVariants
      ? product.variants.find((v) => (v.slug && v.slug === selectedPack.id) || v.name === selectedPack.name)
      : undefined;

    addToCart(
      product,
      quantity,
      hasVariants ? selectedPack.name : undefined,
      unitPrice,
      matchingVariant?.id,
      1,
      false,
      false,
      currentRegularPrice
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <PDPContext.Provider
      value={{
        product,
        hasVariants,
        packOptions,
        selectedPack,
        selectedPackId,
        setSelectedPackId,
        quantity,
        setQuantity,
        incrementQuantity,
        decrementQuantity,
        currentPrice,
        currentRegularPrice,
        currentDiscount,
        unitPrice,
        totalPrice,
        isSecondVariant,
        savingsAmount,
        isAvailable,
        isAdded,
        handleAddToCart,
      }}
    >
      {children}
    </PDPContext.Provider>
  );
};

export const usePDP = (): PDPContextType => {
  const context = useContext(PDPContext);
  if (!context) {
    throw new Error('usePDP must be used within a PDPProvider');
  }
  return context;
};
