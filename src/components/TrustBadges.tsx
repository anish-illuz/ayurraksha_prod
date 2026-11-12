import React from 'react';
import { Stethoscope, Leaf, ShieldCheck, Lock } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Stethoscope,
      title: 'Doctor Guidance',
      subtitle: 'Ayurvedic consultation available',
    },
    {
      icon: Leaf,
      title: 'Botanical Formulations',
      subtitle: 'Rooted in Ayurvedic traditions',
    },
    {
      icon: ShieldCheck,
      title: 'Quality Standards',
      subtitle: 'Verified manufacturing practices',
    },
    {
      icon: Lock,
      title: 'Secure Shopping',
      subtitle: 'Safe checkout & order support',
    },
  ];

  return (
    <section className="bg-white py-4 sm:py-6 px-4 sm:px-6 lg:px-8 border-b border-stone-100">
      <div className="max-w-7xl mx-auto">
        {/* Single clean horizontal trust strip (matching document & Image 3) */}
        <div className="bg-[#0D2E22] rounded-2xl sm:rounded-3xl px-4 py-5 sm:px-8 sm:py-6 text-white shadow-sm border border-[#164232]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-center">
            {badges.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center px-2 py-1 space-y-1.5"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#EAD3A2] flex-shrink-0 mb-0.5">
                    <Icon size={20} className="stroke-[2.2]" />
                  </div>
                  <h4 className="font-heading text-sm sm:text-base font-semibold text-white tracking-wide leading-tight">
                    {b.title}
                  </h4>
                  <p className="text-xs sm:text-[13px] text-[#F6F1E7]/80 leading-snug font-sans max-w-[200px]">
                    {b.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
