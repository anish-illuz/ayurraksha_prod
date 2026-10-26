import React from 'react';
import { ShieldCheck, Stethoscope, Award, Truck, Lock } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Stethoscope,
      title: 'Doctor Formulated',
      subtitle: 'Formulated by Dr. Jegajothi Pandian',
    },
    {
      icon: ShieldCheck,
      title: '100% Pure & Herbal',
      subtitle: 'Natural botanicals, zero steroids',
    },
    {
      icon: Award,
      title: 'Lab Tested Quality',
      subtitle: 'Rigorous safety & purity testing',
    },
    {
      icon: Truck,
      title: 'Free Delivery Across India',
      subtitle: 'On all prepaid online orders',
    },
    {
      icon: Lock,
      title: 'Safe & Secure Pay',
      subtitle: 'Secure checkout & discreet packaging',
    },
  ];

  return (
    <section className="border-y border-stone-200/80 bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-sage-light flex items-center justify-center text-botanical flex-shrink-0 shadow-xs">
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-forest leading-snug">
                    {b.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-normal">
                    {b.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
