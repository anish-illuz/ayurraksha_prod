import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'Refund and Returns Policy | AyurRaksha Online',
  description: 'Understand our 7-day return terms, conditions for health supplements, and refund procedure.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/refund-returns/`,
  },
};

export default function RefundReturnsPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <Breadcrumb items={[{ name: 'Refund & Returns Policy', url: '/refund-returns' }]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xs">
          <h1 className="font-serif text-3xl font-bold text-forest mb-6 pb-4 border-b border-stone-100">
            Refund and Returns Policy
          </h1>

          <div className="prose prose-stone text-xs sm:text-sm text-charcoal leading-relaxed space-y-4">
            <p>
              At <strong>AyurRakshaOnline.com</strong>, we are committed to complete transparency and customer satisfaction. If you encounter an issue with your delivery, we process returns and refunds under the following clear conditions:
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">1. Eligibility for Return</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Return requests must be initiated within <strong>7 days</strong> of delivery.</li>
              <li>The item must be in its original, unopened packaging with all safety seals, batch hologram labels, and caps intact.</li>
              <li>Due to mandatory health, hygiene, and pharmaceutical safety regulations, health supplements, tonics, and topical ointments cannot be returned once the inner or outer seal has been broken.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">2. Non-Returnable Items</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Any health supplement, tonic, or oil where the tamper-evident seal is broken or used.</li>
              <li>Products showing physical damage due to improper customer storage or mishandling.</li>
              <li>Clearance or special promotional sale bundles explicitly designated non-returnable.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">3. Return Process</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email us at <a href={`mailto:${SITE_CONFIG.ordersEmail}`} className="text-botanical font-semibold underline">{SITE_CONFIG.ordersEmail}</a> with your Order ID, contact number, and photographs of the product condition.</li>
              <li>Our Chennai support hub will review the claim and arrange for reverse pickup via our logistics partner, or provide return dispatch instructions.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">4. Return Shipping Charges</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>If the return is due to a transit defect, leakage, or incorrect SKU delivered, AyurRaksha covers 100% of reverse courier costs and issues an immediate replacement or full refund.</li>
              <li>For returns arising from customer change of mind (on sealed items), reverse shipping charges may be deducted from the refund.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">5. Refund Mode &amp; Timelines</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Once the returned shipment is received and inspected at our Chennai facility, we notify you via email of the approval.</li>
              <li>Approved refunds are credited to the original payment source (Credit/Debit Card, UPI, or NetBanking) within <strong>7–10 business days</strong>.</li>
              <li>For Cash on Delivery orders, refunds are credited via direct NEFT/IMPS bank transfer upon receipt of customer bank account details.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">6. Contact Support</h2>
            <p>
              For any questions regarding a pending return or refund status, please reach us directly at <a href={`mailto:${SITE_CONFIG.ordersEmail}`} className="text-botanical font-semibold">{SITE_CONFIG.ordersEmail}</a> or WhatsApp <strong>{SITE_CONFIG.displayPhone}</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
