import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'Privacy Policy | Ayurraksha Online',
  description: 'Understand how Ayurraksha and VPrime Innovations protect, collect, and handle your personal data and order information.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/privacy-policy/`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <Breadcrumb items={[{ name: 'Privacy Policy', url: '/privacy-policy' }]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xs">
          <h1 className="font-serif text-3xl font-bold text-forest mb-6 pb-4 border-b border-stone-100">
            Privacy Policy
          </h1>

          <div className="prose prose-stone text-xs sm:text-sm text-charcoal leading-relaxed space-y-4">
            <p>
              At <strong>AyurrakshaOnline.com</strong> (VPrime Innovations), we value and respect your privacy. This policy outlines how your personal information is gathered, protected, and utilized when you visit or place an order on our platform.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">1. Information We Collect</h2>
            <p>
              When you purchase from Ayurraksha or interact with our consultation desk, we collect essential details to fulfill your orders, including your name, delivery address, phone number, and email address. We do not store your credit card or banking credentials on our servers; payments are processed securely through certified PCI-DSS compliant gateways (such as Razorpay).
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">2. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To fulfill, process, and ship your ordered Ayurvedic formulations.</li>
              <li>To provide order tracking notifications via SMS and email.</li>
              <li>To offer clinical consultation or dosage advice when requested via WhatsApp.</li>
              <li>To prevent fraudulent transactions and comply with applicable statutory Indian tax regulations.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">3. Data Sharing &amp; Third Parties</h2>
            <p>
              We never sell, rent, or trade your personal data to external advertisers. We only share necessary customer data with trusted fulfillment partners (such as courier networks) solely for order delivery and with payment processors to execute your transactions.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">4. Data Security</h2>
            <p>
              All customer interactions and transactions are secured using standard SSL (Secure Socket Layer) 256-bit encryption. Our servers and data handling procedures follow strict administrative and technical safeguards.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">5. Updates &amp; Contact</h2>
            <p>
              If you have any questions about this privacy statement or wish to request data deletion, contact us at <a href={`mailto:${SITE_CONFIG.email}`} className="text-botanical font-semibold underline">{SITE_CONFIG.email}</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
