'use client';

import React, { createContext, useContext, useState } from 'react';
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
  currentPrice: number;
  currentRegularPrice: number;
  currentDiscount: number;
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
  const [quantity, setQuantity] = useState(1);
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
        },
        {
          id: 'family',
          name: '3-Month Family Regimen',
          subtitle: '120 Sachets (600g net)',
          price: Math.round(product.price * 2.65),
          regularPrice: Math.round(product.price * 3.4),
          discountBadge: 'Save 22%',
        },
      ];

  const [selectedPackId, setSelectedPackId] = useState<string>(
    packOptions.find((p) => p.isDefault)?.id || packOptions[0].id
  );

  const selectedPack = packOptions.find((p) => p.id === selectedPackId) || packOptions[0];
  const currentPrice = selectedPack.price;
  const currentRegularPrice = selectedPack.regularPrice || product.regularPrice;
  const currentDiscount = currentRegularPrice > currentPrice
    ? Math.round(((currentRegularPrice - currentPrice) / currentRegularPrice) * 100)
    : product.discountPercent;

  const isAvailable = product.inStock;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(product, quantity, selectedPack.name, currentPrice);
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
        currentPrice,
        currentRegularPrice,
        currentDiscount,
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
