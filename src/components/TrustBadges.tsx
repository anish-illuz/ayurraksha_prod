import React from 'react';
import { ShieldCheck, Stethoscope, Award, Truck, Lock } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Stethoscope,
      title: 'Doctor Formulated',
      subtitle: 'Clinical expertise by Dr. Jegajothi Pandian',
    },
    {
      icon: ShieldCheck,
      title: '100% Classical Ayurveda',
      subtitle: 'Pure botanicals & ethical extracts',
    },
    {
      icon: Award,
      title: 'Batch Quality Assured',
      subtitle: 'Rigorous testing & safety standards',
    },
    {
      icon: Truck,
      title: 'Free Prepaid Delivery',
      subtitle: 'Across all metro & non-metro India',
    },
    {
      icon: Lock,
      title: 'Secure & Discreet',
      subtitle: 'Tamper-evident packaging & privacy',
    },
  ];

  return (
    <section className="border-y border-stone-200/80 bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center text-botanical flex-shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-charcoal leading-snug">
                    {b.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-charcoal-muted mt-0.5 leading-normal">
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
