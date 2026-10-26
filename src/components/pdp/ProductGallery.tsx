'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0
    ? images
    : ['https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg'];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {/* Thumbnails list (vertical on desktop, horizontal on mobile) */}
      {displayImages.length > 1 && (
        <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] flex-shrink-0 py-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`View image ${idx + 1} of ${productName}`}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg p-1 bg-white border-2 transition-all flex-shrink-0 ${
                selectedIndex === idx
                  ? 'border-botanical shadow-sm'
                  : 'border-stone-200 hover:border-stone-300 opacity-80 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Large Image Container */}
      <div className="relative flex-grow aspect-square bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-10 shadow-xs flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={currentImage}
            alt={productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 550px"
            className="object-contain transition-opacity duration-300"
          />
        </div>
      </div>
    </div>
  );
};
