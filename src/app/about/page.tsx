import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Award, HeartHandshake, MessageSquare, Sparkles } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'About AyurRaksha | Rooted in Tradition. Guided by Care.',
  description:
    'Bringing the wisdom of Indian wellness traditions into everyday life. An initiative of VPrime Innovations in Chennai, guided by Dr. Jegajothi Pandian.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/about/`,
  },
};

export default function AboutPage() {
  const whatsappUrl = `https://wa.me/919940388877?text=${encodeURIComponent(
    'Hello AyurRaksha Clinical Team, I would like to speak with your team about personalized wellness guidance.'
  )}`;

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <Breadcrumb items={[{ name: 'About Us', url: '/about' }]} />

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 sm:pt-14 sm:pb-8 text-center">
        <span className="text-xs font-semibold text-botanical uppercase tracking-widest block mb-2.5 font-sans">
          AyurRaksha Wellness
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-forest max-w-4xl mx-auto leading-tight">
          Rooted in Tradition. Guided by Care.
        </h1>
        <p className="mt-3 text-lg sm:text-xl font-medium text-forest/90 max-w-2xl mx-auto">
          Bringing the wisdom of Indian wellness traditions into everyday life.
        </p>
        <div className="mt-4 text-sm sm:text-base text-[#37443D] max-w-3xl mx-auto leading-relaxed space-y-3 font-sans font-normal">
          <p>
            At AyurRaksha, we believe that caring for your health is a personal journey—one shaped by your lifestyle, your needs and the choices you make every day.
          </p>
          <p>
            Inspired by the enduring traditions of Ayurveda and Siddha, we bring you Ayurvedic and herbal wellness products that help you make thoughtful care part of your daily routine.
          </p>
        </div>
      </section>

      {/* 2. THE AYURRAKSHA STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-stone-200 shadow-xs">
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <span className="text-xs font-bold text-botanical uppercase tracking-wider block font-sans">
              Our Foundations
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-forest">
              The AyurRaksha Story
            </h2>
            <div className="text-sm sm:text-base text-[#37443D] leading-relaxed space-y-3.5 font-sans">
              <p>
                AyurRaksha is an initiative of <strong className="font-semibold text-forest">VPrime Innovations</strong>, based in Chennai, with a shared belief that wellness begins with understanding the person as a whole.
              </p>
              <p>
                In the midst of busy lives, caring for ourselves can sometimes become an afterthought. A nourishing meal, a restful night, a soothing oil ritual or a moment to pause—these simple acts of care can help us reconnect with our well-being.
              </p>
              <p>
                Through AyurRaksha, we aim to make traditional wellness more approachable for today’s families. Our collection brings together herbal teas, supplements, oils, skin-care products and wellness packs, so you can explore products suited to your individual needs.
              </p>
              <p>
                Because no two journeys are the same, we believe in making informed choices and seeking guidance whenever it is needed.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-forest hover:bg-forest-light text-white transition-all font-sans shadow-xs hover:shadow"
              >
                <span>Explore Our Products</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card border border-stone-200">
              <Image
                src="/images/categories/cat-digestive-health.webp"
                alt="AyurRaksha Botanical Formulations and Herbal Traditions"
                fill
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEET DR. JEGAJOTHI PANDIAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-[#F0F4EF] rounded-3xl p-6 sm:p-10 lg:p-12 border border-border-botanical">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary/25 shadow-md bg-sage">
              <Image
                src="/images/brand/dr-jegajothi-pandian.webp"
                alt="Dr. Jegajothi Pandian - Siddha Physician and Researcher"
                fill
                sizes="128px"
                className="object-cover object-[center_16%]"
              />
            </div>
            <span className="text-xs font-bold text-botanical uppercase tracking-wider block font-sans">
              Clinical Experience &amp; Research
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest">
              Meet Dr. Jegajothi Pandian
            </h2>
            <p className="text-base sm:text-lg font-serif font-bold text-forest/90">
              Tradition, Experience and a Research-Oriented Approach
            </p>
            <div className="text-xs sm:text-sm font-semibold text-botanical uppercase tracking-wide space-y-0.5">
              <p>Former Director, Central Council for Research in Siddha</p>
              <p>Honorary Consultant, VPrime Healthcare &amp; Therapeutic Center</p>
            </div>
            <div className="text-sm sm:text-base text-[#37443D] leading-relaxed space-y-3 font-sans text-left sm:text-center pt-2">
              <p>
                Dr. Jegajothi Pandian is a Siddha physician and researcher with more than 30 years of clinical experience. His work spans Siddha medicine, medicinal plants, clinical research and the care of people living with long-term health concerns.
              </p>
              <p>
                His research contributions include work related to psoriasis and medicinal plants, reflecting his commitment to understanding traditional Siddha knowledge through a research-oriented approach.
              </p>
              <p>
                As an Honorary Consultant at VPrime Healthcare &amp; Therapeutic Center, Dr. Pandian brings a thoughtful perspective to holistic care—one that recognises the importance of understanding each person’s health, habits and individual needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR APPROACH TO WELL-BEING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-stone-200 shadow-xs">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-botanical uppercase tracking-wider block font-sans text-center">
              Our Perspective
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-forest text-center">
              Our Approach to Well-Being
            </h2>
            <p className="text-lg sm:text-xl font-serif font-bold text-forest/90 text-center">
              Looking Beyond a Single Concern
            </p>
            <div className="text-sm sm:text-base text-[#37443D] leading-relaxed space-y-3.5 font-sans pt-2">
              <p>
                Traditional systems of wellness encourage us to look at the whole person. The way we eat, the water we drink, the quality of our sleep, our digestive health and the stress we carry can all be part of a wider conversation about well-being.
              </p>
              <p>
                This perspective is especially meaningful when caring for concerns that may require patience and ongoing attention, including skin health. Alongside suitable care, everyday habits such as balanced eating, safe drinking water, adequate rest and stress management can support overall well-being.
              </p>
              <p>
                We also recognise the important role of modern medicine in the diagnosis and treatment of health conditions. Traditional approaches to lifestyle and wellness can be considered alongside appropriate medical care, with guidance suited to the individual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE AYURRAKSHA PROMISE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-xs font-semibold text-botanical uppercase tracking-wider block mb-1 font-sans">
            Our Standard of Purity
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-forest">
            The AyurRaksha Promise
          </h2>
          <p className="text-base text-charcoal/75 mt-1 font-sans">
            The AyurRaksha Clinical Commitment
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-heading text-base font-bold text-forest">Zero Steroids or Adulterants</h3>
            <p className="text-xs sm:text-sm text-[#37443D] leading-relaxed font-sans">
              We never use synthetic steroids, heavy metal enhancers, or hidden drugs. Our products are 100% natural herbal extracts.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Award size={22} />
            </div>
            <h3 className="font-heading text-base font-bold text-forest">Standardized Extraction</h3>
            <p className="text-xs sm:text-sm text-[#37443D] leading-relaxed font-sans">
              Herbs are extracted at specific active phyto-chemical concentrations to ensure identical therapeutic strength in every batch.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <HeartHandshake size={22} />
            </div>
            <h3 className="font-heading text-base font-bold text-forest">Ethical Botanical Sourcing</h3>
            <p className="text-xs sm:text-sm text-[#37443D] leading-relaxed font-sans">
              We partner directly with sustainable Ayurvedic growers and regional botanical collectors across South India.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-2.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 size={22} />
            </div>
            <h3 className="font-heading text-base font-bold text-forest">Doctor Consultation</h3>
            <p className="text-xs sm:text-sm text-[#37443D] leading-relaxed font-sans">
              Every customer has direct access to our clinical team on WhatsApp and phone for personalized dosage guidance.
            </p>
          </div>
        </div>
      </section>

      {/* 6. YOUR WELLNESS JOURNEY, YOUR WAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-[#16382C] text-white rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-md relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold text-[#C8A25D] uppercase tracking-widest block font-sans">
              Take the Next Step
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Your Wellness Journey, Your Way
            </h2>
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-sans">
              Whether you are exploring traditional wellness for the first time or looking for products to support an existing routine, we are here to help you take the next step with confidence.
            </p>
            <p className="text-base sm:text-lg font-medium text-white/95 pt-1">
              Explore the collection. Discover what feels right for you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-bold bg-[#C8A25D] hover:bg-[#B38F4D] text-[#16382C] transition-all shadow-sm"
              >
                Shop AyurRaksha
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                <span>Speak to Our Team</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
