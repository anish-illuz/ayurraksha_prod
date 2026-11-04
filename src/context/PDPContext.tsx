'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PackOption } from '@/types/product';
import { useCart } from '@/lib/cartContext';
import { formatPackMeasurement } from '@/lib/formatPack';

interface PDPContextType {
  product: Product;
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

  // Compute Pack / Course Options
  const packOptions: PackOption[] = product.packOptions && product.packOptions.length > 0
    ? product.packOptions
    : [
        {
          id: 'standard',
          name: 'Standard Course',
          subtitle: formatPackMeasurement(product.specNetQuantity) || '40 Sachets × 5g (200g net)',
          price: product.price,
          regularPrice: product.regularPrice > product.price ? product.regularPrice : Math.round(product.price * 1.15),
          isDefault: true,
          packCount: 1,
        },
        {
          id: 'family',
          name: '3-Month Family Regimen',
          subtitle: '3 Packs Value Bundle',
          price: Math.round(product.price * 2.65),
          regularPrice: Math.round(product.price * 3.4),
          discountBadge: 'Save 22%',
          packCount: 3,
        },
      ];

  const defaultPack = packOptions.find((p) => p.isDefault) || packOptions[0];
  const [selectedPackId, setSelectedPackIdState] = useState<string>(defaultPack.id);
  const [quantity, setQuantity] = useState<number>(defaultPack.packCount || 1);

  const selectedPack = packOptions.find((p) => p.id === selectedPackId) || packOptions[0];
  const packMultiplier = selectedPack.packCount || 1;

  // When switching pack variant, update quantity to match that pack's unit count (e.g. 1 for standard, 3 for 3-month)
  const setSelectedPackId = (id: string) => {
    setSelectedPackIdState(id);
    const newPack = packOptions.find((p) => p.id === id);
    const newPackCount = newPack?.packCount || 1;
    setQuantity(newPackCount);
  };

  const currentPrice = selectedPack.price;
  const currentRegularPrice = selectedPack.regularPrice || product.regularPrice;
  const currentDiscount = currentRegularPrice > currentPrice
    ? Math.round(((currentRegularPrice - currentPrice) / currentRegularPrice) * 100)
    : product.discountPercent;

  // Unit price per individual pack
  const unitPrice = currentPrice / packMultiplier;
  // Total price based on selected quantity
  const totalPrice = Math.round(unitPrice * quantity);

  const incrementQuantity = () => {
    setQuantity((q) => q + packMultiplier);
  };

  const decrementQuantity = () => {
    setQuantity((q) => Math.max(packMultiplier, q - packMultiplier));
  };

  const isAvailable = product.inStock;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(product, quantity, selectedPack.name, unitPrice, undefined, packMultiplier);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <PDPContext.Provider
      value={{
        product,
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
