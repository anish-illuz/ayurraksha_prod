import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Stethoscope, Award, HeartHandshake } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'About AyurRaksha | Dr. Jegajothi Pandian & VPrime Innovations',
  description:
    'Learn about AyurRaksha, an initiative of VPrime Innovations in Chennai. Discover our clinical formulation approach guided by Dr. Jegajothi Pandian.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/about/`,
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <Breadcrumb items={[{ name: 'About Us', url: '/about' }]} />

      {/* Hero Header - Compact Spacing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 sm:pt-12 sm:pb-6 text-center">
        <span className="text-xs font-semibold text-botanical uppercase tracking-widest block mb-2.5 font-sans">
          Our Heritage &amp; Purpose
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-forest max-w-3xl mx-auto leading-tight">
          Bridging Classical Ayurvedic Purity with Contemporary Science
        </h1>
        <p className="mt-3 text-base sm:text-lg text-charcoal max-w-2xl mx-auto leading-relaxed font-sans">
          At AyurRaksha, we believe genuine healing begins from within — through botanical nutrition, holistic equilibrium, and conscious living.
        </p>
      </section>

      {/* Main Narrative with Authentic Ayurvedic Formulation Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-stone-200 shadow-xs">
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-forest">
              The AyurRaksha Journey
            </h2>
            <p className="text-base text-charcoal leading-relaxed font-sans">
              AyurRaksha is a proud initiative of <strong>VPrime Innovations</strong>, a Chennai-based health-tech and wellness company dedicated to non-invasive, sustainable therapeutics.
            </p>
            <p className="text-sm sm:text-base text-charcoal/85 leading-relaxed font-sans">
              Our journey began with a definitive objective: to bridge the gap between ancient Ayurvedic manuscripts (Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya) and modern-day wellness realities. Fast-paced lifestyles, environmental stressors, and synthetic diets demand therapeutic solutions that are both authentically natural and clinically consistent.
            </p>
            <p className="text-sm sm:text-base text-charcoal/85 leading-relaxed font-sans">
              Through disciplined extraction methodologies, batch testing, and clinical validation, we have formulated a comprehensive catalogue of 44 health remedies addressing liver health, joint mobility, dermatological care, cardiovascular support, and digestive vitality.
            </p>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-button text-sm font-semibold bg-forest hover:bg-forest-light text-white transition-colors font-sans shadow-xs"
              >
                <span>Explore Our Formulations</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card border border-stone-200">
              <Image
                src="/images/categories/cat-digestive-health.webp"
                alt="Authentic AyurRaksha Medicinal Botanical Formulations and Herbal Preparation"
                fill
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Leadership Profile with Photo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-[#F0F4EF] rounded-3xl p-6 sm:p-10 lg:p-12 border border-border-botanical">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary/25 shadow-md bg-sage">
              <Image
                src="/images/brand/dr-jegajothi-pandian.webp"
                alt="Dr. Jegajothi Pandian - Formulation Leadership"
                fill
                sizes="128px"
                className="object-cover object-top"
              />
            </div>
            <span className="text-xs font-bold text-botanical uppercase tracking-wider block font-sans">
              Formulation Leadership
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest">
              {SITE_CONFIG.doctor.name}
            </h2>
            <p className="text-sm sm:text-base font-semibold text-charcoal font-sans">
              {SITE_CONFIG.doctor.title}
            </p>
            <p className="text-sm sm:text-base text-charcoal/85 leading-relaxed font-sans max-w-2xl mx-auto">
              With over 25 years of devoted clinical Ayurvedic practice, Dr. Jegajothi Pandian guides every formulation developed at AyurRaksha. His expertise combines classical pulse examination and botanical pharmacodynamics with modern safety standards, ensuring every product is pure, potent, and gentle on the human system.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Clinical Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-xs font-semibold text-botanical uppercase tracking-wider block mb-1 font-sans">
            Our Standard of Purity
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-forest">
            The AyurRaksha Clinical Commitment
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 bg-white rounded-card border border-stone-200 space-y-2">
            <ShieldCheck size={22} className="text-botanical" />
            <h3 className="font-heading text-base font-bold text-forest">Zero Steroids or Adulterants</h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-sans">
              We never use synthetic steroids, heavy metal enhancers, or hidden drugs. Our products are 100% natural herbal extracts.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-card border border-stone-200 space-y-2">
            <Award size={22} className="text-botanical" />
            <h3 className="font-heading text-base font-bold text-forest">Standardized Extraction</h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-sans">
              Herbs are extracted at specific active phyto-chemical concentrations to ensure identical therapeutic strength in every batch.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-card border border-stone-200 space-y-2">
            <HeartHandshake size={22} className="text-botanical" />
            <h3 className="font-heading text-base font-bold text-forest">Ethical Botanical Sourcing</h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-sans">
              We partner directly with sustainable Ayurvedic growers and regional wildcrafters across South India.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white rounded-card border border-stone-200 space-y-2">
            <CheckCircle2 size={22} className="text-botanical" />
            <h3 className="font-heading text-base font-bold text-forest">Doctor Consultation</h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-sans">
              Every customer has direct access to our clinical team on WhatsApp and phone for personalized dosage guidance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
