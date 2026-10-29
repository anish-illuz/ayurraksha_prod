'use client';

import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, PhoneCall } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

const ANNOUNCEMENTS = [
  {
    icon: ShieldCheck,
    text: 'The Purity of Nature. The Wisdom of Ayurveda.',
  },
  {
    icon: Truck,
    text: 'Free shipping on all prepaid orders across India',
  },
  {
    icon: PhoneCall,
    text: `Order support & consultations: ${SITE_CONFIG.displayPhone}`,
  },
];

export const AnnouncementBar: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = ANNOUNCEMENTS[index];
  const IconComponent = current.icon;

  return (
    <aside aria-label="Announcement" className="bg-[#17362B] text-[#FAF9F5] text-xs py-2 px-3 sm:px-4 border-b border-[#0f241d] select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile single cycling item - strictly centered, single line, no wrapping */}
        <div className="flex md:hidden items-center justify-center w-full gap-1.5 text-center text-[10.5px] min-[360px]:text-[11.5px] font-medium text-[#FAF9F5] tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300">
          <IconComponent size={13} className="text-[#FAF9F5] flex-shrink-0" />
          <span className="truncate">{current.text}</span>
        </div>

        {/* Desktop balanced 3-item strip */}
        <div className="hidden md:flex items-center justify-between w-full text-[11px] font-medium text-[#FAF9F5]">
          <div className="flex items-center gap-1.5">
            <Truck size={13} className="text-[#FAF9F5]" />
            <span>Free Delivery On All Prepaid Orders Across India</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#FAF9F5]/95">
            <ShieldCheck size={13} className="text-[#FAF9F5]" />
            <span>The Purity of Nature. The Wisdom of Ayurveda.</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-semibold transition-colors text-[#FAF9F5]"
            >
              Order Help &amp; Support: {SITE_CONFIG.displayPhone}
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
