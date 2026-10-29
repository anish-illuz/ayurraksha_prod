import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'Terms of Service | AyurRaksha Online',
  description: 'Read the terms of service, conditions of purchase, and regulatory notices for AyurRaksha Online.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/terms-of-service/`,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <Breadcrumb items={[{ name: 'Terms of Service', url: '/terms-of-service' }]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xs">
          <h1 className="font-serif text-3xl font-bold text-forest mb-6 pb-4 border-b border-stone-100">
            Terms of Service
          </h1>

          <div className="prose prose-stone text-xs sm:text-sm text-charcoal leading-relaxed space-y-4">
            <p>
              Welcome to <strong>AyurRakshaOnline.com</strong>. This website is owned and operated by <strong>VPrime Innovations</strong>, having its principal place of business at 251, First Floor, New Tiny Sector, Ambattur Industrial Estate, Chennai 600058, Tamil Nadu, India.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing, browsing, or purchasing products through this platform, you agree to be bound by these Terms of Service, our Privacy Policy, and our Refund &amp; Shipping Policies. If you do not agree with any part of these terms, please refrain from using our services.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">2. Ayurvedic &amp; Wellness Disclaimer</h2>
            <p>
              The formulations, tonics, oils, and dietary supplements provided on this website are classical Ayurvedic and herbal health preparations. They are designed to support physiological vitality, metabolic harmony, and general wellness. Information on this site is provided for educational purposes and should not be construed as medical advice. Always consult a certified Ayurvedic doctor or your medical practitioner regarding specific chronic health conditions.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">3. Product Pricing &amp; Orders</h2>
            <p>
              All prices are listed in Indian Rupees (INR) and are inclusive of applicable goods and services taxes (GST). We reserve the right to modify pricing, discontinue formulations, or update product descriptions at our discretion without prior notice.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">4. Payment Methods &amp; Security</h2>
            <p>
              We accept digital payments through Razorpay (UPI, RuPay, Visa, MasterCard, NetBanking) and Cash on Delivery (COD) for eligible domestic pin codes. All transactions are encrypted according to industry security standards.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">5. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms and any separate agreements shall be governed by and construed in accordance with the laws of India, with exclusive jurisdiction in the competent courts of Chennai, Tamil Nadu.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">6. Contact Information</h2>
            <p>
              Inquiries regarding these terms may be directed to <a href={`mailto:${SITE_CONFIG.corporateEmail}`} className="text-botanical font-semibold underline">{SITE_CONFIG.corporateEmail}</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
