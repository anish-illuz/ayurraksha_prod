import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Stethoscope,
  Activity,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'About VPrime Wellness | Parent Company of AyurRaksha',
  description:
    'Behind AyurRaksha stands VPrime Wellness (VPrime Innovations / VPrime Health Care), anchoring botanical excellence, clinical care, and preventive wellness across Chennai.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/vprime-health-centre-wellness-therapy/`,
  },
};

export default function VPrimeWellnessPage() {
  return (
    <div className="bg-white text-[#1c2820] min-h-screen">
      <Breadcrumb items={[{ name: 'About VPrime Wellness', url: '/vprime-health-centre-wellness-therapy' }]} />

      <main>
        {/* 1. HERO SECTION */}
        <section id="vprime-overview" className="relative overflow-hidden bg-gradient-to-b from-[#fbfaf6] via-white to-[#fbfaf6]/40 pt-12 pb-20 lg:pt-16 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              {/* Left Column: Copy & Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 bg-[#eaf4ee] text-[#15803d] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase font-sans">
                  <CheckCircle2 size={14} className="text-[#15803d]" />
                  <span>The Company Behind AyurRaksha</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-heading font-bold text-[#0d402b] leading-[1.15] tracking-tight">
                  Meet VPrime Wellness
                </h1>

                <p className="text-xl sm:text-2xl font-serif text-stone-700 italic font-normal">
                  The Parent Company Guiding AyurRaksha’s Vision
                </p>

                <p className="text-base sm:text-lg text-[#526058] leading-relaxed max-w-2xl font-sans font-normal">
                  Behind <strong className="text-[#1c2820]">AyurRaksha</strong> stands <strong className="text-[#1c2820]">VPrime Wellness</strong> (VPrime Innovations / VPrime Health Care), the guiding organization anchoring the brand&apos;s commitment to holistic health, botanical excellence, and preventive wellness. Rooted in real clinical care and classical Ayurvedic sciences, VPrime shapes products designed to restore natural equilibrium.
                </p>

                {/* Dual Action CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="https://www.vprimewellness.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-[#0d402b] hover:bg-[#093020] text-white px-8 py-3.5 rounded-full font-medium shadow-md shadow-[#0d402b]/15 hover:shadow-lg transition-all duration-200 text-sm font-sans"
                  >
                    <span>Learn More</span>
                    <ArrowRight size={16} className="ml-2" />
                  </a>
                  <a
                    href="#ayurraksha-brand"
                    className="inline-flex items-center justify-center border border-[#0d402b] text-[#0d402b] hover:bg-[#0d402b]/5 px-8 py-3.5 rounded-full font-medium transition-all duration-200 text-sm font-sans"
                  >
                    Explore AyurRaksha Formulations
                  </a>
                </div>

                {/* Trust Metrics Bar */}
                <div className="pt-8 border-t border-[#e7e5dc] grid grid-cols-3 gap-4 max-w-lg font-sans">
                  <div>
                    <span className="block text-2xl font-bold text-[#0d402b] font-heading">2+</span>
                    <span className="text-xs text-[#526058] font-medium">Chennai Wellness Clinics</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-[#0d402b] font-heading">100%</span>
                    <span className="text-xs text-[#526058] font-medium">Pure Herbal Botanicals</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-[#0d402b] font-heading">Pan-India</span>
                    <span className="text-xs text-[#526058] font-medium">Direct Home Delivery</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Visual Corporate Card */}
              <div className="lg:col-span-5">
                <div className="relative bg-gradient-to-tr from-[#fbfaf6] via-white to-[#eaf4ee]/30 rounded-3xl p-6 sm:p-8 border border-[#e7e5dc] shadow-xl shadow-[#0d402b]/5 overflow-hidden">

                  <div className="absolute -top-4 -right-4 bg-emerald-600 text-white text-[11px] font-semibold px-3.5 py-1 rounded-full shadow-xs tracking-wide z-10 font-sans">
                    Holistic Clinical Care
                  </div>

                  <div className="relative rounded-2xl overflow-hidden shadow-md border border-stone-200/80 group mb-6 aspect-[4/3]">
                    <Image
                      src="/images/about/about-story.webp"
                      alt="VPrime Wellness Botanical Care & Natural Health"
                      fill
                      sizes="(max-width: 1024px) 100vw, 450px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d402b]/90 via-[#0d402b]/30 to-transparent flex flex-col justify-end p-5">
                      <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 inline-flex items-center justify-center max-w-xs shadow-md">
                        <span className="font-heading font-bold text-lg text-[#0d402b]">VPrime Health Care</span>
                      </div>
                      <p className="text-xs text-emerald-100 font-medium mt-2 font-sans">
                        Pioneering holistic Ayurvedic therapies &amp; clinical wellness across Tamil Nadu
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 font-sans">
                    <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-stone-200/70">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-emerald-100/80 text-[#15803d] shrink-0 mt-0.5">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#0d402b] font-heading">VPrime Wellness Integrated Clinics</h4>
                          <p className="text-xs text-[#526058] mt-0.5">Operating specialized holistic clinics at Anna Nagar &amp; Velachery in Chennai.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-stone-200/70">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-emerald-100/80 text-[#15803d] shrink-0 mt-0.5">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#0d402b] font-heading">Ayurvedic Stewardship by VPrime Wellness</h4>
                          <p className="text-xs text-[#526058] mt-0.5">Overseeing formulation safety, botanical integrity, and practitioner guidance for AyurRaksha.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#e7e5dc] flex items-center justify-between text-xs text-stone-500 font-sans">
                    <span className="flex items-center gap-1 font-medium text-[#1c2820]">
                      <MapPin size={14} className="text-[#15803d]" />
                      Anna Nagar &amp; Velachery, Chennai
                    </span>
                    <span className="text-[#15803d] font-semibold">VPrime Wellness Clinics</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. WHO WE ARE (4 Pillars + Clinical Modalities) */}
        <section id="who-we-are" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="text-xs font-bold tracking-widest uppercase text-[#15803d] bg-emerald-50 px-3.5 py-1.5 rounded-full font-sans">
                WHO WE ARE
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0d402b] leading-tight">
                Rooted in Wellness. Guided by Purpose.
              </h2>
              <p className="text-base sm:text-lg text-[#526058] leading-relaxed font-sans">
                At VPrime Health Care Clinic, true healing goes beyond treating superficial symptoms — it means restoring lasting balance in the <strong className="text-[#0d402b]">Body, Mind, and Soul</strong>. As the parent company of AyurRaksha, VPrime Wellness provides the clinical foundation, organizational backing, and holistic healthcare philosophy that shapes each formulation.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

              <div className="bg-[#fbfaf6]/60 hover:bg-[#fbfaf6] border border-[#e7e5dc] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between font-sans">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#e7e5dc] flex items-center justify-center text-[#0d402b] shadow-xs">
                    <Activity size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0d402b] font-heading">Personalized Wellness Plans</h3>
                  <p className="text-sm text-[#526058] leading-relaxed">
                    Tailored regimens that grow with individuals, ensuring targeted physiological recovery, optimal nutrition, and sustainable vitality.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#e7e5dc] text-xs font-semibold text-[#15803d]">Individualized Care</div>
              </div>

              <div className="bg-[#fbfaf6]/60 hover:bg-[#fbfaf6] border border-[#e7e5dc] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between font-sans">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#e7e5dc] flex items-center justify-center text-[#0d402b] shadow-xs">
                    <Heart size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0d402b] font-heading">Natural, Non-Invasive Healing</h3>
                  <p className="text-sm text-[#526058] leading-relaxed">
                    Therapies and formulations engineered to stimulate the body&apos;s self-healing mechanisms without dependency or invasive trauma.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#e7e5dc] text-xs font-semibold text-[#15803d]">Pure &amp; Gentle Restoration</div>
              </div>

              <div className="bg-[#fbfaf6]/60 hover:bg-[#fbfaf6] border border-[#e7e5dc] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between font-sans">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#e7e5dc] flex items-center justify-center text-[#0d402b] shadow-xs">
                    <Stethoscope size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0d402b] font-heading">Certified Holistic Practitioners</h3>
                  <p className="text-sm text-[#526058] leading-relaxed">
                    A multidisciplinary team bringing together ancient Ayurvedic knowledge, naturopathic insights, and structured health counseling.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#e7e5dc] text-xs font-semibold text-[#15803d]">Clinical Discipline</div>
              </div>

              <div className="bg-[#fbfaf6]/60 hover:bg-[#fbfaf6] border border-[#e7e5dc] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between font-sans">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#e7e5dc] flex items-center justify-center text-[#0d402b] shadow-xs">
                    <Sparkles size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0d402b] font-heading">Serene Clinical Standards</h3>
                  <p className="text-sm text-[#526058] leading-relaxed">
                    Pristine, tranquil healthcare spaces in Chennai designed to alleviate patient stress and enhance psychological and physical healing.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#e7e5dc] text-xs font-semibold text-[#15803d]">Hygienic Care Sanctuaries</div>
              </div>

            </div>

            {/* Clinical Modalities & Therapies */}
            <div className="mt-16 pt-14 border-t border-[#e7e5dc]">
              <div className="text-center max-w-3xl mx-auto mb-10 space-y-2 font-sans">
                <span className="text-xs font-bold tracking-widest uppercase text-[#15803d] bg-emerald-50 px-3.5 py-1.5 rounded-full">
                  CLINICAL EXCELLENCE IN PRACTICE
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#0d402b]">
                  VPrime Wellness Clinical Modalities &amp; Therapies
                </h3>
                <p className="text-sm sm:text-base text-[#526058]">
                  Experience the specialized non-invasive treatments offered across VPrime Wellness health centers in Chennai.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">

                <div className="bg-white rounded-2xl overflow-hidden border border-[#e7e5dc] shadow-xs hover:shadow-md transition-shadow group flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <Image
                      src="/images/combos/ayur-raksha-joint-well-pack.webp"
                      alt="Padha Guasa & Musculoskeletal Therapy at VPrime Wellness"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0d402b] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                      Joint Care
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-base font-bold text-[#0d402b] font-heading">Padha Guasa &amp; Musculoskeletal Care</h4>
                      <p className="text-xs text-[#526058] leading-relaxed mt-1">Targeted reflexology and deep tissue relief for chronic knee strain, spinal stiffness, and sciatica.</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#15803d] pt-2 border-t border-stone-100 block">VPrime Wellness Clinics</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-[#e7e5dc] shadow-xs hover:shadow-md transition-shadow group flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <Image
                      src="/images/categories/liver-wellness.webp"
                      alt="Colon Hydrotherapy & Digestive Balancing at VPrime Wellness"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0d402b] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                      Digestive Detox
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-base font-bold text-[#0d402b] font-heading">Colon Detox &amp; Gut Restoration</h4>
                      <p className="text-xs text-[#526058] leading-relaxed mt-1">Gentle internal cleansing promoting toxin elimination, metabolic balance, and liver vitality.</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#15803d] pt-2 border-t border-stone-100 block">VPrime Wellness Clinics</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-[#e7e5dc] shadow-xs hover:shadow-md transition-shadow group flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <Image
                      src="/images/products/sp-soryn-cream.webp"
                      alt="Skin Rejuvenation & Detox Therapy at VPrime Wellness"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0d402b] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                      Dermatology
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-base font-bold text-[#0d402b] font-heading">Skin Rejuvenation &amp; Blood Purification</h4>
                      <p className="text-xs text-[#526058] leading-relaxed mt-1">Holistic botanical therapies designed to cleanse bloodstream impurities and revive natural skin glow.</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#15803d] pt-2 border-t border-stone-100 block">VPrime Wellness Clinics</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-[#e7e5dc] shadow-xs hover:shadow-md transition-shadow group flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <Image
                      src="/images/products/purna-sakthi-tonic.webp"
                      alt="Vitality & Immunity Formulations by VPrime Wellness"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0d402b] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                      Vitality &amp; Herbs
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-base font-bold text-[#0d402b] font-heading">Vitality &amp; Immunity Formulations</h4>
                      <p className="text-xs text-[#526058] leading-relaxed mt-1">Translating clinical insights into high-potency daily herbal supplements for enduring health.</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#15803d] pt-2 border-t border-stone-100 block">VPrime Wellness Research</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* 3. OUR STORY & HERITAGE */}
        <section id="our-story" className="py-20 bg-[#fbfaf6] border-y border-[#e7e5dc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Narrative Left Column */}
              <div className="lg:col-span-6 space-y-6 font-sans">
                <span className="text-xs font-bold tracking-widest uppercase text-[#15803d] bg-emerald-100/70 px-3.5 py-1.5 rounded-full">
                  OUR JOURNEY
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0d402b] leading-tight">
                  The Vision Behind VPrime Wellness
                </h2>
                <div className="space-y-4 text-[#526058] text-base leading-relaxed">
                  <p>
                    VPrime Wellness started with a foundational observation: while modern lifestyles grow faster and more demanding, real health requires unhurried, time-tested restorative balance. At our holistic health clinics across Chennai, we have welcomed individuals experiencing metabolic strain, chronic joint stiffness, digestive concerns, and fatigue.
                  </p>
                  <p>
                    Witnessing the profound transformation brought by targeted herbal therapies and lifestyle recalibration inspired a larger mission: <strong className="text-[#1c2820]">Why should exceptional Ayurvedic care remain confined to clinic walls?</strong>
                  </p>
                  <p>
                    To answer this, VPrime founded <strong className="text-[#0d402b]">AyurRaksha</strong> — a consumer-centric Ayurvedic brand translating clinical botanical expertise into high-grade, everyday health supplements and oils. Through AyurRaksha, VPrime&apos;s standard of uncompromised purity and therapeutic potency is delivered to doorsteps across India.
                  </p>
                </div>

                {/* Clinic feature highlight */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-4 rounded-xl border border-[#e7e5dc] shadow-xs">
                    <span className="text-xs font-semibold uppercase text-[#15803d]">Clinical Heritage</span>
                    <p className="text-sm font-bold text-[#0d402b] mt-1 font-heading">Anna Nagar Clinic</p>
                    <p className="text-xs text-stone-500 mt-0.5">Advanced Ayurvedic Care &amp; Naturopathy</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#e7e5dc] shadow-xs">
                    <span className="text-xs font-semibold uppercase text-[#15803d]">Restorative Care</span>
                    <p className="text-sm font-bold text-[#0d402b] mt-1 font-heading">Velachery Clinic</p>
                    <p className="text-xs text-stone-500 mt-0.5">Integrative Non-Invasive Therapies</p>
                  </div>
                </div>
              </div>

              {/* Editorial Card Visual Right Column */}
              <div className="lg:col-span-6">
                <div className="relative bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#e7e5dc] shadow-md space-y-6 font-sans">

                  <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-[16/9] group">
                    <Image
                      src="/images/about/therapy-room.webp"
                      alt="VPrime Wellness Clinical Therapy Room, Chennai"
                      fill
                      sizes="(max-width: 1024px) 100vw, 500px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#062316]/80 via-transparent to-transparent flex items-end p-4">
                      <p className="text-xs text-emerald-100 font-medium">VPrime Wellness Clinical Therapy, Chennai</p>
                    </div>
                  </div>

                  <div className="border-l-4 border-[#0d402b] pl-6 space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#d97706]">A Guiding Healthcare Philosophy</p>
                    <blockquote className="text-xl sm:text-2xl font-serif text-[#0d402b] italic leading-snug">
                      &ldquo;Healing is not an artificial quick fix. It is an intentional restoration of harmony between your body&apos;s internal vitality and nature&apos;s timeless pharmacopeia.&rdquo;
                    </blockquote>
                    <div className="pt-2">
                      <p className="text-sm font-bold text-[#1c2820]">VPrime Wellness Clinical Advisory Council</p>
                      <p className="text-xs text-[#526058]">VPrime Wellness Health Care &amp; AyurRaksha Research</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-stone-200/80 space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#15803d] flex items-center justify-center font-bold text-xs shrink-0">1</div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#0d402b]">VPrime Wellness Chennai Clinics</h4>
                        <p className="text-xs text-[#526058]">Providing hands-on holistic therapies and doctor consultations in Anna Nagar &amp; Velachery.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#15803d] flex items-center justify-center font-bold text-xs shrink-0">2</div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#0d402b]">Botanical Standardization by VPrime Wellness</h4>
                        <p className="text-xs text-[#526058]">Synthesizing clinical observations into standardized Ayurvedic formulations.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#15803d] flex items-center justify-center font-bold text-xs shrink-0">3</div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#0d402b]">AyurRaksha Pan-India Reach</h4>
                        <p className="text-xs text-[#526058]">Empowering thousands of families with certified VPrime Wellness products delivered directly home.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. OUR PHILOSOPHY SECTION */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 font-sans">
              <span className="text-xs font-bold tracking-widest uppercase text-[#15803d] bg-emerald-50 px-3.5 py-1.5 rounded-full">
                WHAT GUIDES US
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0d402b]">
                A Thoughtful Approach to Health &amp; Wellbeing
              </h2>
              <p className="text-base text-[#526058]">
                Our approach begins with a simple idea: wellbeing deserves care, authentic attention, and a long-term perspective.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">

              <div className="p-6 rounded-2xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/50 hover:shadow-md transition-shadow">
                <span className="text-xs font-semibold text-[#15803d]">01 / PURPOSE</span>
                <h3 className="text-lg font-bold font-heading text-[#0d402b] mt-2 mb-2">Purpose-Led Wellness</h3>
                <p className="text-sm text-[#526058] leading-relaxed">
                  Every initiative, formulation, and therapy is crafted with one solitary goal: genuine, lasting harmony across body, mind, and spirit.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/50 hover:shadow-md transition-shadow">
                <span className="text-xs font-semibold text-[#15803d]">02 / HERITAGE</span>
                <h3 className="text-lg font-bold font-heading text-[#0d402b] mt-2 mb-2">Respect for Traditional Knowledge</h3>
                <p className="text-sm text-[#526058] leading-relaxed">
                  Honoring centuries of classical Ayurvedic texts while applying modern microbiological testing and strict quality protocols.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/50 hover:shadow-md transition-shadow">
                <span className="text-xs font-semibold text-[#15803d]">03 / NATURE</span>
                <h3 className="text-lg font-bold font-heading text-[#0d402b] mt-2 mb-2">Natural &amp; Non-Invasive Care</h3>
                <p className="text-sm text-[#526058] leading-relaxed">
                  Zero tolerance for toxic binders, adulterated herbal extracts, or harsh interventions. We champion the gentle restorative power of plants.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/50 hover:shadow-md transition-shadow">
                <span className="text-xs font-semibold text-[#15803d]">04 / LONGEVITY</span>
                <h3 className="text-lg font-bold font-heading text-[#0d402b] mt-2 mb-2">Long-Term Wellbeing</h3>
                <p className="text-sm text-[#526058] leading-relaxed">
                  Shifting the paradigm from reactive crisis suppression to proactive, sustainable health habits that build lasting vitality.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 5. AYURRAKSHA BRAND SHOWCASE SECTION */}
        <section id="ayurraksha-brand" className="py-20 bg-[#fbfaf6] border-y border-[#e7e5dc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 font-sans">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs font-bold tracking-widest uppercase text-[#15803d] bg-emerald-100/80 px-3.5 py-1.5 rounded-full">
                  PART OF VPRIME WELLNESS
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0d402b]">
                  Meet AyurRaksha: Botanical Care For Everyday Living
                </h2>
                <p className="text-base text-[#526058] leading-relaxed">
                  AyurRaksha is proudly conceptualized and stewarded by <strong className="text-[#0d402b]">VPrime Wellness</strong>, bringing a dedicated range of targeted botanical formulations from clinical practice to customers nationwide. Explore authentic Ayurvedic remedies developed under the rigorous healthcare standards of VPrime Wellness.
                </p>
              </div>
              <div className="flex items-center space-x-3 shrink-0">
                <Link
                  href="/shop"
                  className="bg-[#0d402b] hover:bg-[#062316] text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
                >
                  Explore All Products
                </Link>
              </div>
            </div>

            {/* 3-Product Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">

              {/* Product 1: BoozLiv */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#e7e5dc] hover:shadow-lg transition-all duration-300 flex flex-col group">
                <div className="relative overflow-hidden bg-stone-100 aspect-square">
                  <span className="absolute top-3 left-3 z-10 bg-[#0d402b] text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-wide uppercase">
                    Bestseller
                  </span>
                  <Image
                    src="/images/products/boozliv.webp"
                    alt="BoozLiv Herbal Liver Syrup"
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-xs mb-1.5">
                      <div className="flex text-amber-500 text-xs">★★★★★</div>
                      <span className="text-stone-500 font-medium">4.8 (12 Reviews)</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0d402b] font-heading">BoozLiv Liver Wellness Syrup</h3>
                    <p className="text-xs text-[#526058] mt-1">High-quality botanical extracts formulated for liver detox, enzyme harmony &amp; metabolism support.</p>
                    <div className="mt-2 inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Syrup Sachets (30-Day Pack)
                    </div>
                  </div>
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#1c2820]">₹2,400</span>
                        <span className="text-xs line-through text-stone-400">₹2,600</span>
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold">8% Off Prepaid</span>
                    </div>
                    <Link
                      href="/product/boozliv"
                      className="bg-[#0d402b] hover:bg-[#062316] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowRight size={14} />
                      View Product
                    </Link>
                  </div>
                </div>
              </div>

              {/* Product 2: Divine Healing Oil */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#e7e5dc] hover:shadow-lg transition-all duration-300 flex flex-col group">
                <div className="relative overflow-hidden bg-stone-100 aspect-square">
                  <span className="absolute top-3 left-3 z-10 bg-[#0d402b] text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-wide uppercase">
                    Bestseller
                  </span>
                  <Image
                    src="/images/products/divine-healing-oil.webp"
                    alt="AyurRaksha Divine Healing Oil"
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-xs mb-1.5">
                      <div className="flex text-amber-500 text-xs">★★★★★</div>
                      <span className="text-stone-500 font-medium">4.8 (12 Reviews)</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0d402b] font-heading">AyurRaksha Divine Healing Oil</h3>
                    <p className="text-xs text-[#526058] mt-1">Traditional herbal medicated oil for joint lubrication, muscle aches, and deep therapeutic tissue comfort.</p>
                    <div className="mt-2 inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Topical Oil (100 mL)
                    </div>
                  </div>
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#1c2820]">₹999</span>
                      <span className="block text-[11px] text-stone-500">100% Ayurvedic</span>
                    </div>
                    <Link
                      href="/product/divine-healing-oil"
                      className="bg-[#0d402b] hover:bg-[#062316] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowRight size={14} />
                      View Product
                    </Link>
                  </div>
                </div>
              </div>

              {/* Product 3: Skin Well Capsules */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#e7e5dc] hover:shadow-lg transition-all duration-300 flex flex-col group">
                <div className="relative overflow-hidden bg-stone-100 aspect-square">
                  <span className="absolute top-3 left-3 z-10 bg-[#0d402b] text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-wide uppercase">
                    Bestseller
                  </span>
                  <Image
                    src="/images/products/skin-well-food-supplement-capsules.webp"
                    alt="Skin Well Food Supplement Capsules"
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-xs mb-1.5">
                      <div className="flex text-amber-500 text-xs">★★★★★</div>
                      <span className="text-stone-500 font-medium">4.8 Reviews</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0d402b] font-heading">Skin Well Food Supplement</h3>
                    <p className="text-xs text-[#526058] mt-1">Potent herbal botanical capsules formulated to purify blood toxins and enhance natural skin resilience.</p>
                    <div className="mt-2 inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Capsules (60 Count)
                    </div>
                  </div>
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#1c2820]">₹1,100</span>
                      <span className="block text-[11px] text-emerald-600 font-semibold">Free Delivery</span>
                    </div>
                    <Link
                      href="/product/skin-well-food-supplement-capsules"
                      className="bg-[#0d402b] hover:bg-[#062316] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowRight size={14} />
                      View Product
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. OUR COMMITMENT SECTION */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#0d402b] to-[#062316] rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden font-sans">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-700/20 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-4">
                <span className="text-xs font-bold tracking-widest uppercase text-emerald-300">
                  OUR COMMITMENT
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold leading-tight">
                  Purpose, Care, and Uncompromising Trust
                </h2>
                <p className="text-emerald-100/90 text-base leading-relaxed">
                  When you choose AyurRaksha, you receive more than an Ayurvedic supplement. You gain the backing of VPrime Wellness — an institution dedicated to patient well-being, scientific botanical validation, and ethical healthcare practices.
                </p>
              </div>

              <div className="relative z-10 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-emerald-800/80">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-emerald-100">Authentic Botanical Sourcing</h3>
                  <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                    Herbs harvested at optimal potency seasons, verifying traditional lineage and active phytochemical density.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-emerald-100">Ethical &amp; Transparent Standards</h3>
                  <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                    Manufactured under stringent GMP certified protocols with rigorous testing for heavy metals and purity.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300">
                    <HeartHandshake size={20} />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-emerald-100">Patient-Centric Guidance</h3>
                  <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                    Empowered by our clinical consultation team in Chennai, ready to assist customers with genuine Ayurvedic advice.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 7. FAQ SECTION */}
        <section id="faq" className="py-20 bg-[#fbfaf6] border-t border-[#e7e5dc]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
            <div className="text-center space-y-3 mb-14">
              <span className="text-xs font-bold tracking-widest uppercase text-[#15803d] bg-emerald-100 px-3.5 py-1.5 rounded-full">
                CLARITY &amp; ASSURANCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0d402b]">
                Frequently Asked Questions
              </h2>
              <p className="text-[#526058] text-sm sm:text-base">
                Everything you need to know about VPrime Wellness, our clinical foundation, and AyurRaksha.
              </p>
            </div>

            {/* FAQs as clear structured accordions */}
            <div className="space-y-4">

              <details className="bg-white rounded-xl border border-[#e7e5dc] shadow-xs p-6 space-y-2 group">
                <summary className="list-none text-base font-semibold text-[#0d402b] flex items-center justify-between cursor-pointer">
                  <span>1. What is VPrime Wellness?</span>
                  <ChevronDown size={18} className="text-[#0d402b] transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-[#526058] leading-relaxed">
                  VPrime Wellness (operating as VPrime Health Care and VPrime Innovations) is the parent organization behind AyurRaksha. VPrime provides organizational stewardship, clinical expertise, research backing, and holistic healthcare philosophy for all consumer wellness products under the AyurRaksha brand.
                </p>
              </details>

              <details className="bg-white rounded-xl border border-[#e7e5dc] shadow-xs p-6 space-y-2 group">
                <summary className="list-none text-base font-semibold text-[#0d402b] flex items-center justify-between cursor-pointer">
                  <span>2. How is VPrime Wellness connected to AyurRaksha?</span>
                  <ChevronDown size={18} className="text-[#0d402b] transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-[#526058] leading-relaxed">
                  AyurRaksha is the consumer-facing Ayurvedic brand owned and guided by VPrime Wellness. While VPrime operates physical health clinics and specialized wellness therapies, AyurRaksha packages these clinical insights into accessible, high-quality, standardized herbal products delivered across India.
                </p>
              </details>

              <details className="bg-white rounded-xl border border-[#e7e5dc] shadow-xs p-6 space-y-2 group">
                <summary className="list-none text-base font-semibold text-[#0d402b] flex items-center justify-between cursor-pointer">
                  <span>3. Where can I explore AyurRaksha products?</span>
                  <ChevronDown size={18} className="text-[#0d402b] transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-[#526058] leading-relaxed">
                  You can explore, read verified customer reviews, and securely order all AyurRaksha formulations on our official online portal at <Link href="/shop" className="text-[#15803d] font-semibold underline">www.ayurrakshaonline.com</Link> with free home delivery on all prepaid orders nationwide.
                </p>
              </details>

              <details className="bg-white rounded-xl border border-[#e7e5dc] shadow-xs p-6 space-y-2 group">
                <summary className="list-none text-base font-semibold text-[#0d402b] flex items-center justify-between cursor-pointer">
                  <span>4. Does VPrime Wellness operate physical health clinics?</span>
                  <ChevronDown size={18} className="text-[#0d402b] transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-[#526058] leading-relaxed">
                  Yes. VPrime Health Care Clinic operates physical holistic centers in Anna Nagar and Velachery, Chennai. The clinics specialize in non-invasive healing, authentic Ayurvedic Panchakarma, therapeutic neuro-hydro therapies, and individualized consultations with certified wellness doctors.
                </p>
              </details>

              <details className="bg-white rounded-xl border border-[#e7e5dc] shadow-xs p-6 space-y-2 group">
                <summary className="list-none text-base font-semibold text-[#0d402b] flex items-center justify-between cursor-pointer">
                  <span>5. Are AyurRaksha formulations backed by clinical and Ayurvedic expertise?</span>
                  <ChevronDown size={18} className="text-[#0d402b] transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-[#526058] leading-relaxed">
                  Absolutely. Each AyurRaksha product (such as BoozLiv, Divine Healing Oil, and Skin Well Capsules) is formulated through deep botanical research and adheres strictly to classical Ayurvedic principles, backed by modern quality, microbiological, and toxicology checks.
                </p>
              </details>

            </div>

            {/* Help Desk Banner */}
            <div className="mt-12 bg-white rounded-2xl p-6 border border-[#e7e5dc] text-center space-y-3">
              <p className="text-sm font-semibold text-[#0d402b]">Still have questions regarding our treatments or products?</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="tel:+919940388877"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-[#0d402b] text-white hover:bg-[#062316] transition-all"
                >
                  <Phone size={14} />
                  <span>Call +91 99403 88877</span>
                </a>
                <a
                  href="mailto:info@vprimecorp.in"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full border border-stone-300 text-[#1c2820] hover:bg-stone-50 transition-all"
                >
                  <Mail size={14} />
                  <span>Email Care Team</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* 8. FINAL CTA SECTION */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
            <div className="bg-[#f5f2ea]/90 rounded-3xl p-10 sm:p-14 border border-[#e7e5dc] text-center max-w-4xl mx-auto space-y-6">
              <span className="text-xs font-bold tracking-widest uppercase text-[#15803d] bg-emerald-100/90 px-3.5 py-1.5 rounded-full">
                EXPLORE AYURRAKSHA
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-bold text-[#0d402b]">
                Discover the AyurRaksha Collection
              </h2>
              <p className="text-base sm:text-lg text-[#526058] max-w-xl mx-auto">
                Experience Ayurvedic formulations designed under the guidance of VPrime Wellness. Created for vitality, everyday renewal, and lasting comfort.
              </p>
              <div className="pt-2 flex flex-wrap justify-center items-center gap-4">
                <Link
                  href="/shop"
                  className="bg-[#0d402b] hover:bg-[#062316] text-white px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide shadow-md transition-all"
                >
                  Shop AyurRaksha Products
                </Link>
                <a
                  href="https://www.vprimewellness.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#0d402b] text-[#0d402b] hover:bg-[#0d402b]/5 px-8 py-3.5 rounded-full text-sm font-semibold transition-all"
                >
                  <span>Visit VPrime Wellness</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
