import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Stethoscope, Award, HeartHandshake } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'About Ayurraksha | Dr. Jegajothi Pandian & VPrime Innovations',
  description:
    'Learn about Ayurraksha, an initiative of VPrime Innovations in Chennai. Discover our clinical formulation approach guided by Dr. Jegajothi Pandian.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/about/`,
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <Breadcrumb items={[{ name: 'About Us', url: '/about' }]} />

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
        <span className="text-xs font-semibold text-botanical uppercase tracking-widest block mb-3">
          Our Heritage &amp; Purpose
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest max-w-3xl mx-auto leading-tight">
          Bridging Classical Ayurvedic Purity with Contemporary Science
        </h1>
        <p className="mt-4 text-sm sm:text-base text-charcoal-muted max-w-2xl mx-auto leading-relaxed">
          At Ayurraksha, we believe genuine healing begins from within — through botanical nutrition, holistic equilibrium, and conscious living.
        </p>
      </section>

      {/* Main Narrative with Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xs">
          <div className="lg:col-span-6 space-y-5">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              The Ayurraksha Journey
            </h2>
            <p className="text-sm text-charcoal leading-relaxed">
              Ayurraksha is a proud initiative of <strong>VPrime Innovations</strong>, a Chennai-based health-tech and wellness company dedicated to non-invasive, sustainable therapeutics.
            </p>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              Our journey began with a definitive objective: to bridge the gap between ancient Ayurvedic manuscripts (Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya) and modern-day wellness realities. Fast-paced lifestyles, environmental stressors, and synthetic diets demand therapeutic solutions that are both authentically natural and clinically consistent.
            </p>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              Through disciplined extraction methodologies, batch testing, and clinical validation, we have formulated a comprehensive catalogue of 44 health remedies addressing liver health, joint mobility, dermatological care, cardiovascular support, and digestive vitality.
            </p>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-button text-xs font-semibold bg-forest hover:bg-forest-light text-white transition-colors"
              >
                <span>Explore Our Formulations</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card border border-stone-200">
              <Image
                src="https://www.ayurrakshaonline.com/wp-content/uploads/2025/06/Ayurvedic-tonic-for-liver.jpg"
                alt="Ayurraksha Ayurvedic Botanicals and Formulations"
                fill
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Leadership Profile */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#F0F4EF] rounded-3xl p-8 sm:p-12 border border-border-botanical">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-botanical text-ivory flex items-center justify-center mx-auto mb-2 shadow-xs">
              <Stethoscope size={26} />
            </div>
            <span className="text-xs font-bold text-botanical uppercase tracking-wider block">
              Formulation Leadership
            </span>
            <h2 className="font-serif text-3xl font-bold text-forest">
              {SITE_CONFIG.doctor.name}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-charcoal">
              {SITE_CONFIG.doctor.title}
            </p>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              With over 25 years of devoted clinical Ayurvedic practice, Dr. Jegajothi Pandian guides every formulation developed at Ayurraksha. His expertise combines classical pulse examination and botanical pharmacodynamics with modern safety standards, ensuring every product is pure, potent, and gentle on the human system.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Clinical Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-botanical uppercase tracking-wider block mb-1">
            Our Standard of Purity
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            The Ayurraksha Clinical Commitment
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-card border border-stone-200 space-y-2">
            <ShieldCheck size={22} className="text-botanical" />
            <h3 className="text-sm font-bold text-forest">Zero Steroids or Adulterants</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              We never use synthetic steroids, heavy metal enhancers, or hidden drugs. Our products are 100% natural herbal extracts.
            </p>
          </div>

          <div className="p-6 bg-white rounded-card border border-stone-200 space-y-2">
            <Award size={22} className="text-botanical" />
            <h3 className="text-sm font-bold text-forest">Standardized Extraction</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Herbs are extracted at specific active phyto-chemical concentrations to ensure identical therapeutic strength in every batch.
            </p>
          </div>

          <div className="p-6 bg-white rounded-card border border-stone-200 space-y-2">
            <HeartHandshake size={22} className="text-botanical" />
            <h3 className="text-sm font-bold text-forest">Ethical Botanical Sourcing</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              We partner directly with sustainable Ayurvedic growers and regional wildcrafters across South India.
            </p>
          </div>

          <div className="p-6 bg-white rounded-card border border-stone-200 space-y-2">
            <CheckCircle2 size={22} className="text-botanical" />
            <h3 className="text-sm font-bold text-forest">Doctor Consultation</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Every customer has direct access to our clinical team on WhatsApp and phone for personalized dosage guidance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
