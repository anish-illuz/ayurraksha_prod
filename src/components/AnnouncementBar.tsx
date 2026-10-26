'use client';

import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, PhoneCall } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

const ANNOUNCEMENTS = [
  {
    icon: Truck,
    text: 'Free delivery on all prepaid orders across India',
  },
  {
    icon: ShieldCheck,
    text: 'Authentic Ayurvedic formulations guided by Dr. Jegajothi Pandian',
  },
  {
    icon: PhoneCall,
    text: `Support & Consultation: ${SITE_CONFIG.displayPhone}`,
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
    <aside aria-label="Announcement" className="bg-botanical text-white text-xs py-2 px-4 border-b border-botanical-dark/30 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile single cycling item */}
        <div className="flex md:hidden items-center justify-center w-full gap-2 text-center text-[11px] font-medium transition-all duration-300">
          <IconComponent size={13} className="text-white flex-shrink-0" />
          <span>{current.text}</span>
        </div>

        {/* Desktop balanced 3-item strip */}
        <div className="hidden md:flex items-center justify-between w-full text-[11px] font-medium text-white">
          <div className="flex items-center gap-1.5">
            <Truck size={13} className="text-white" />
            <span>Get Free Shipping On Prepaid Orders Across India</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/95">
            <ShieldCheck size={13} className="text-white" />
            <span>Formulated with Clinical Ayurvedic Purity • Chennai, India</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-semibold transition-colors"
            >
              Consult a Specialist: {SITE_CONFIG.displayPhone}
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
