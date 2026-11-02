import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'Terms and Conditions | AyurRaksha Online',
  description: 'Terms and conditions governing the purchase of authentic Ayurvedic products, account use, payments, and legal jurisdiction of AyurRaksha Online.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/terms-of-service/`,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <Breadcrumb items={[{ name: 'Terms & Conditions', url: '/terms-of-service' }]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-stone-100">
            <span className="w-2.5 h-8 bg-botanical rounded-full" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Terms &amp; Conditions
            </h1>
          </div>

          <div className="prose prose-stone text-xs sm:text-sm text-charcoal leading-relaxed space-y-5">
            <p className="text-xs text-stone-500">
              <strong>Effective Date:</strong> July 5, 2025 | <strong>Last Updated:</strong> November 2, 2026
            </p>

            <p>
              Welcome to <strong>AyurRakshaOnline.com</strong> (the &ldquo;Website&rdquo;). This platform is owned, managed, and operated by <strong>VPrime Innovations</strong>, a registered commercial entity organized and existing under the laws of India, having its principal place of business at 251, First Floor, New Tiny Sector, Ambattur Industrial Estate, Chennai 600058, Tamil Nadu, India.
            </p>

            <p>
              By accessing, browsing, registering an account, or placing an order on this Website, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions (&ldquo;Terms&rdquo;), alongside our <a href="/privacy-policy" className="text-botanical font-semibold underline">Privacy Policy</a>, <a href="/shipping-policy" className="text-botanical font-semibold underline">Shipping Policy</a>, and <a href="/refund-returns" className="text-botanical font-semibold underline">Refund Policy</a>.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">1. Eligibility &amp; Permitted Website Usage</h2>
            <p>
              You represent that you are at least 18 years of age or possess the legal capacity to enter into binding contracts under the <em>Indian Contract Act, 1872</em>. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Use the Website for any unlawful, deceptive, or fraudulent purpose.</li>
              <li>Attempt to compromise the security, integrity, or server architecture of the platform.</li>
              <li>Reproduce, scrape, republish, or commercialize product descriptions, clinical case studies, or photography without written consent from VPrime Innovations.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">2. Products &amp; Wellness Nature of Formulations</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>All formulations offered on AyurRakshaOnline.com are classical and proprietary Ayurvedic dietary supplements, herbal tonics, and topical preparations.</li>
              <li>These formulations are engineered to support holistic well-being and bodily balance. <strong>They are not synthetic pharmaceutical drugs and are not sold to cure, prevent, or diagnose any medical illness.</strong></li>
              <li>Product imagery, pack descriptions, and herbal profiles are published for informational purposes. Individual constitutional response (Prakriti / Dosha balance) may vary.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">3. Product Pricing, Taxes &amp; Discounts</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>All product prices displayed on the Website are in Indian Rupees (INR) and are inclusive of statutory Goods and Services Tax (GST).</li>
              <li>Prices, active promotional discounts (such as our 10% and 15% custom combo volume tiers), and product availability are subject to change without prior notice.</li>
              <li>In the rare event of a typographical or system pricing error, VPrime Innovations reserves the right to cancel or adjust affected orders prior to dispatch.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">4. Orders, Payments &amp; Gateway Security</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>By submitting an order, you warrant that you are authorized to use the chosen payment method.</li>
              <li>Digital payments are processed via certified, encrypted payment gateways (Razorpay) supporting UPI, Credit Cards, Debit Cards, and NetBanking. VPrime Innovations does not retain customer card numbers or CVV details on its servers.</li>
              <li>For Cash on Delivery (COD) orders, full payment must be tendered in cash to the courier representative before handover of the sealed parcel.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">5. Intellectual Property Rights</h2>
            <p>
              The trademarks &ldquo;AyurRaksha&rdquo;, formulation brand names (including BoozLiv, Divine Healing Oil, SP Soryn, Save Heart, Purna Sakthi), logo assets, website design tokens, source code, and editorial blog articles are the exclusive intellectual property of VPrime Innovations. Unauthorized use is strictly prohibited under the <em>Copyright Act, 1957</em> and <em>Trade Marks Act, 1999</em>.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable Indian law, VPrime Innovations, its officers, Dr. Jegajothi Pandian, and employees shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our products or website services. Our maximum aggregate liability shall not exceed the actual purchase price paid by the customer for the specific product in dispute.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">7. Governing Law &amp; Exclusive Jurisdiction</h2>
            <p>
              These Terms and any transactional agreements executed through this Website shall be governed by and construed in accordance with the laws of the Republic of India. In the event of any legal dispute or claim, the courts situated in <strong>Chennai, Tamil Nadu, India</strong> shall possess exclusive territorial jurisdiction.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">8. Corporate &amp; Legal Inquiries</h2>
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs sm:text-sm font-sans space-y-1">
              <p><strong>Entity:</strong> VPrime Innovations</p>
              <p><strong>Corporate Contact:</strong> <a href={`mailto:${SITE_CONFIG.corporateEmail}`} className="text-botanical font-semibold underline">{SITE_CONFIG.corporateEmail}</a></p>
              <p><strong>Customer Support:</strong> <a href={`mailto:${SITE_CONFIG.email}`} className="text-botanical font-semibold underline">{SITE_CONFIG.email}</a></p>
              <p><strong>Registered Address:</strong> 251, First Floor, New Tiny Sector, Ambattur Industrial Estate, Chennai 600058, Tamil Nadu, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
