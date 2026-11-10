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

  // Compute Pack / Course Options
  // Variant 1: Standard / 1 Unit (normal price)
  // Variant 2: 3 Units Bundle with 5% discount on the 3 units total
  const threePackDiscountedPrice = Math.round(product.price * 3 * 0.95);
  const threePackRegularPrice = product.price * 3;

  const packOptions: PackOption[] = product.packOptions && product.packOptions.length > 0
    ? product.packOptions
    : [
        {
          id: 'standard',
          name: 'Standard Course',
          subtitle: formatPackMeasurement(product.specNetQuantity) || '40 Sachets × 5g (200g net)',
          price: product.price,
          regularPrice: product.price,
          isDefault: true,
          packCount: 1,
        },
        {
          id: 'family',
          name: '3-Month Family Regimen',
          subtitle: '3 Packs Value Bundle',
          price: threePackDiscountedPrice,
          regularPrice: threePackRegularPrice,
          discountBadge: 'Save 5%',
          packCount: 3,
        },
      ];

  const defaultPack = packOptions.find((p) => p.isDefault) || packOptions[0];
  const [selectedPackId, setSelectedPackIdState] = useState<string>(defaultPack.id);
  const [quantity, setQuantity] = useState<number>(defaultPack.packCount || 1);

  const selectedPack = packOptions.find((p) => p.id === selectedPackId) || packOptions[0];
  const isSecondVariant = packOptions.length > 1 && selectedPack.id === packOptions[1].id;

  // When switching pack variant:
  // - If selecting the 2nd variant: automatically set quantity to 3
  // - If switching back to the 1st variant: restore normal quantity (1)
  const setSelectedPackId = (id: string) => {
    setSelectedPackIdState(id);
    const isSecond = packOptions.length > 1 && id === packOptions[1].id;
    if (isSecond) {
      setQuantity(3);
    } else {
      setQuantity(1);
    }
  };

  // Pricing calculations
  // Variant 1: normal price, 0% discount
  // Variant 2: 5% discount on 3 units
  const currentRegularPrice = isSecondVariant
    ? quantity * product.price
    : product.price * quantity;

  const currentPrice = isSecondVariant
    ? Math.round(quantity * (product.price * 0.95))
    : product.price * quantity;

  const currentDiscount = isSecondVariant ? 5 : 0;
  const unitPrice = isSecondVariant ? Math.round(3 * product.price * 0.95) / 3 : product.price;
  const totalPrice = currentPrice;
  const savingsAmount = Math.max(0, currentRegularPrice - currentPrice);

  const incrementQuantity = () => {
    setQuantity((q) => q + (isSecondVariant ? 3 : 1));
  };

  const decrementQuantity = () => {
    setQuantity((q) => Math.max(isSecondVariant ? 3 : 1, q - (isSecondVariant ? 3 : 1)));
  };

  const isAvailable = product.inStock;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(
      product,
      quantity,
      selectedPack.name,
      isSecondVariant ? unitPrice : product.price,
      undefined,
      isSecondVariant ? 3 : 1,
      false, // isComboItem = false (individual product page offer)
      isSecondVariant, // isSecondVariantOffer = true when 2nd variant
      product.price
    );
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
