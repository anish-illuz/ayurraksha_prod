'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Leaf, FileCheck, Package } from 'lucide-react';
import { Product } from '@/types/product';
import { getCompactPackBadge } from '@/lib/formatPack';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  product?: Product;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName, product }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0
    ? images
    : ['/images/products/ayur-raksha-detox-tea.webp'];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const heroBadge = product?.heroImageBadge || '100% AYURVEDIC FORMULA | Pure Herbal Blends';
  const heroTag = product?.heroImageTag || `Hand-curated ${productName.replace(/^AyurRaksha\s*/i, '')}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image Container with Reference Badge Overlays */}
      <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-xs flex items-center justify-center overflow-hidden group">
        {/* Top-Left Authentic Formula Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#16382C]/90 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide shadow-sm border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{heroBadge}</span>
        </div>

        {/* Bottom-Right Curated Herb Tag */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#16382C]/90 backdrop-blur-md text-emerald-200 text-xs font-semibold shadow-sm border border-emerald-500/30">
          <Leaf size={13} className="text-emerald-400" />
          <span>{heroTag}</span>
        </div>

        {/* Main Product Image */}
        <div className="relative w-full h-full">
          <Image
            src={currentImage}
            alt={productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-contain w-full h-full p-2 transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* Compact 4 Key Benefit Tiles Row */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Tile 1: Primary Pack Photo Thumbnail */}
        <button
          onClick={() => setSelectedIndex(0)}
          className={`h-16 sm:h-20 rounded-xl p-1 bg-white border-2 transition-all flex items-center justify-center overflow-hidden ${
            selectedIndex === 0
              ? 'border-botanical shadow-2xs'
              : 'border-stone-200 hover:border-stone-300 opacity-90'
          }`}
          title="Pack View"
        >
          <div className="relative w-full h-full">
            <Image
              src={displayImages[0]}
              alt={`${productName} pack view`}
              fill
              sizes="90px"
              className="object-contain"
            />
          </div>
        </button>

        {/* Tile 2: Pre-Measured Packaging */}
        <div className="h-16 sm:h-20 rounded-xl p-1.5 bg-[#EEF5EE]/80 border border-emerald-900/10 flex flex-col items-center justify-center text-center">
          <div className="w-6 h-6 rounded-full bg-white text-botanical flex items-center justify-center mb-1 shadow-2xs shrink-0">
            <Package size={13} />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-forest leading-tight line-clamp-2 px-0.5">
            {getCompactPackBadge(product?.specNetQuantity)}
          </span>
        </div>

        {/* Tile 3: Whole Botanical Ingredients */}
        <div className="h-16 sm:h-20 rounded-xl p-1.5 bg-[#EEF5EE]/80 border border-emerald-900/10 flex flex-col items-center justify-center text-center">
          <div className="w-6 h-6 rounded-full bg-white text-botanical flex items-center justify-center mb-1 shadow-2xs shrink-0">
            <Leaf size={13} />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-forest leading-tight line-clamp-2">
            Whole Botanicals
          </span>
        </div>

        {/* Tile 4: Analytical Purity */}
        <div className="h-16 sm:h-20 rounded-xl p-1.5 bg-[#EEF5EE]/80 border border-emerald-900/10 flex flex-col items-center justify-center text-center">
          <div className="w-6 h-6 rounded-full bg-white text-botanical flex items-center justify-center mb-1 shadow-2xs shrink-0">
            <FileCheck size={13} />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-forest leading-tight line-clamp-2">
            COA Lab Pure
          </span>
        </div>
      </div>
    </div>
  );
};
