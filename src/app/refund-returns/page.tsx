import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'Refund, Return & Cancellation Policy | AyurRaksha Online',
  description: 'Understand the official AyurRaksha 7-day return guidelines, cancellation terms, refund methods, and consumer hygiene standards.',
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
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-stone-100">
            <span className="w-2.5 h-8 bg-botanical rounded-full" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Refund, Return &amp; Cancellation Policy
            </h1>
          </div>

          <div className="prose prose-stone text-xs sm:text-sm text-charcoal leading-relaxed space-y-5">
            <p>
              At <strong>AyurRakshaOnline.com</strong>, we are committed to complete transparency, product efficacy, and patient satisfaction. If you encounter any issue with your purchase, our customer care team processes cancellations, returns, and refunds in accordance with the terms below.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">1. Order Cancellation Terms</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Prior to Dispatch:</strong> You may cancel your order at any time before it has been handed over to the courier partner by contacting us at <a href={`mailto:${SITE_CONFIG.ordersEmail}`} className="text-botanical font-semibold underline">{SITE_CONFIG.ordersEmail}</a> or via WhatsApp at <strong>{SITE_CONFIG.displayPhone}</strong>. Full 100% refund is initiated immediately to your original payment mode with zero cancellation fees.</li>
              <li><strong>Post Dispatch:</strong> Once an order has been dispatched and an AWB tracking number generated, cancellations cannot be processed mid-transit. The shipment must either be rejected upon delivery attempt or returned in its unopened condition under our standard return policy.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">2. Eligibility for Returns (7-Day Policy)</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Return requests must be initiated within <strong>7 calendar days</strong> from the recorded delivery date.</li>
              <li>The item must be in its original, unopened packaging with all inner induction seals, outer caps, hologram batch stickers, and tamper-evident bands completely intact.</li>
              <li>Due to mandatory statutory hygiene and pharmaceutical regulations governing Ayurvedic consumable supplements and topical oils, <strong>products with broken inner or outer seals cannot be returned or reused</strong>.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">3. Non-Returnable &amp; Non-Refundable Items</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Any health supplement, herbal tonic, or cosmetic oil where the protective safety seal has been opened, broken, or tampered with.</li>
              <li>Products showing physical damage, water contact, or discoloration resulting from improper storage after delivery.</li>
              <li>Clearance items or special customized combo bundles explicitly marked as non-returnable at checkout.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">4. Transit Damage, Leakage, or Incorrect Item</h2>
            <p>
              If your shipment arrives damaged, leaking, or with an incorrect product variant:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Email us within <strong>48 hours</strong> of delivery at <a href={`mailto:${SITE_CONFIG.ordersEmail}`} className="text-botanical font-semibold underline">{SITE_CONFIG.ordersEmail}</a> with your Order ID and 2–3 clear photographs showing the outer box, shipping label, and the affected item.</li>
              <li>AyurRaksha will provide an <strong>immediate free replacement</strong> or a <strong>100% full refund</strong>, including any shipping fees paid.</li>
              <li>You do not bear any reverse shipping expenses for verified transit damage or fulfillment errors.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">5. Step-by-Step Return Process</h2>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li><strong>Initiate Request:</strong> Email <a href={`mailto:${SITE_CONFIG.ordersEmail}`} className="text-botanical font-semibold underline">{SITE_CONFIG.ordersEmail}</a> with your Order Number and reason for return.</li>
              <li><strong>Pickup Coordination:</strong> Our Chennai fulfillment desk will arrange reverse courier pickup from your delivery address via Delhivery/Blue Dart. If reverse pickup is unavailable in your regional PIN code, our team will provide instructions for self-dispatch and reimburse standard courier costs.</li>
              <li><strong>Inspection:</strong> Upon receipt at our facility, our quality team inspects the safety seals and packaging integrity within 24–48 business hours.</li>
            </ol>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">6. Refund Timelines &amp; Payment Methods</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Prepaid Transactions:</strong> Refunds are credited back to the original source (Credit Card, Debit Card, UPI handle, or NetBanking account) within <strong>7–10 business days</strong> following inspection approval.</li>
              <li><strong>Cash on Delivery (COD) Orders:</strong> Refunds are issued via direct NEFT / IMPS bank transfer. Our finance desk will request your Account Holder Name, Bank Account Number, and IFSC Code via secure email. Bank transfers are credited within <strong>3–5 business days</strong> of detail verification.</li>
              <li>Convenience COD courier handling charges (₹100) are non-refundable for non-defective change-of-mind returns.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">7. Contact Returns &amp; Grievance Redressal</h2>
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs sm:text-sm font-sans space-y-1">
              <p><strong>Returns Desk:</strong> VPrime Innovations — AyurRaksha Returns Department</p>
              <p><strong>Address:</strong> 251, First Floor, New Tiny Sector, Ambattur Industrial Estate, Chennai 600058, Tamil Nadu</p>
              <p><strong>Orders &amp; Returns Email:</strong> <a href={`mailto:${SITE_CONFIG.ordersEmail}`} className="text-botanical font-semibold underline">{SITE_CONFIG.ordersEmail}</a></p>
              <p><strong>WhatsApp Support:</strong> <a href={SITE_CONFIG.whatsappUrl} className="text-botanical font-semibold underline">{SITE_CONFIG.displayPhone}</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
