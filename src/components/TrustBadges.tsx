import React from 'react';
import { ShieldCheck, Stethoscope, Award, Lock } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Stethoscope,
      title: 'Doctor Formulated',
      subtitle: (
        <span>Formulated by <span className="whitespace-nowrap">Dr.&nbsp;Jegajothi&nbsp;Pandian</span></span>
      ),
    },
    {
      icon: ShieldCheck,
      title: '100% Natural Herbal Ingredients',
      subtitle: 'Natural botanicals, zero steroids',
    },
    {
      icon: Award,
      title: 'Quality Tested',
      subtitle: 'Rigorous safety & purity testing',
    },
    {
      icon: Lock,
      title: 'Secure Checkout',
      subtitle: 'Secure checkout & discreet packaging',
    },
  ];

  return (
    <section className="bg-white py-4 sm:py-8 px-4 sm:px-6 lg:px-8 border-b border-stone-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/70 transition-all duration-200 hover:border-primary/30 h-full"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-sage flex items-center justify-center text-primary flex-shrink-0 shadow-xs">
                  <Icon size={20} className="stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading text-sm sm:text-base font-bold text-primary leading-tight sm:leading-snug">
                    {b.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#24332B] mt-1 leading-snug font-sans">
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
