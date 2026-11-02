import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | AyurRaksha Online',
  description: 'Official AyurRaksha shipping terms: 1-2 business day dispatch from Chennai, 100% free delivery on prepaid orders across India, COD terms, and live tracking.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/shipping-policy/`,
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <Breadcrumb items={[{ name: 'Shipping Policy', url: '/shipping-policy' }]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-stone-100">
            <span className="w-2.5 h-8 bg-botanical rounded-full" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Shipping &amp; Delivery Policy
            </h1>
          </div>

          <div className="prose prose-stone text-xs sm:text-sm text-charcoal leading-relaxed space-y-5">
            <p>
              At <strong>AyurRakshaOnline.com</strong>, an e-commerce initiative of <strong>VPrime Innovations</strong>, we take utmost care to ensure that your authentic Ayurvedic formulations, tonics, oils, and health supplements reach you in pristine condition, securely packaged, and strictly on schedule.
            </p>

            <div className="bg-[#E8EFE6]/60 rounded-xl p-4 sm:p-5 border border-[#2D5A43]/20 space-y-1 text-forest">
              <p className="font-bold">Shipping Highlights at a Glance:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li><strong>Prepaid Orders:</strong> 100% Free Shipping throughout India (UPI, NetBanking, Cards).</li>
                <li><strong>Cash on Delivery (COD):</strong> Flat ₹100 handling fee per order.</li>
                <li><strong>Dispatch Hub:</strong> Direct dispatch from Chennai, Tamil Nadu within 1–2 business days.</li>
                <li><strong>Metro Timelines:</strong> 2–5 business days | <strong>Non-Metro Timelines:</strong> 5–7 business days.</li>
              </ul>
            </div>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">1. Delivery Locations &amp; Serviceability</h2>
            <p>
              We deliver to all serviceable PIN codes across India through established domestic logistics networks including Blue Dart, Delhivery, DTDC, and India Post. International shipping is currently not supported; orders can only be shipped to valid Indian postal addresses.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">2. Processing Time &amp; Dispatch Cut-offs</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>All orders are verified and handed over to our courier partners within <strong>1–2 business days</strong> from our Chennai manufacturing and fulfillment center.</li>
              <li>Orders placed before <strong>3:00 PM IST</strong> on a business day are queued for same-day packing and verification.</li>
              <li>Orders placed after 3:00 PM IST, on Sundays, or on statutory public holidays are processed on the immediate following business day.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">3. Shipping Fees &amp; Payment Options</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Prepaid Orders:</strong> Free shipping is provided automatically on all prepaid orders regardless of cart value. Additionally, prepaid orders receive an automatic <strong>5% extra discount</strong> at checkout.</li>
              <li><strong>Cash on Delivery (COD):</strong> A flat ₹100 convenience and courier cash handling charge applies to COD orders. COD service is subject to courier availability in the customer’s area.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">4. Estimated Delivery Timelines</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>South India &amp; Major Metro Cities</strong> (Chennai, Bengaluru, Hyderabad, Mumbai, Delhi-NCR, Kolkata, Pune): <strong>2–5 business days</strong> from dispatch.</li>
              <li><strong>Tier-2 &amp; Tier-3 Regional Locations:</strong> <strong>5–7 business days</strong> from dispatch.</li>
              <li><strong>Remote / North-East / Island Locations:</strong> <strong>7–10 business days</strong> depending on regional transport logistics.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">5. Live Shipment Tracking</h2>
            <p>
              As soon as your package is dispatched from our Chennai hub, you will receive an automated confirmation via SMS and email containing your Consignment Tracking Number (AWB) and a direct link to track your shipment in real time. You can also verify status on our dedicated <a href="/order-tracking" className="text-botanical font-semibold underline">Order Tracking</a> page.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">6. Transit Damage &amp; Tamper Guarantee</h2>
            <p>
              Every AyurRaksha shipment is sealed in tamper-evident corrugated boxes with protective bubble cushioning for glass and liquid bottles. If your package arrives visibly torn, crushed, or tampered with:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Please do not accept delivery from the courier, or note the damage on the courier receipt.</li>
              <li>Take a clear photograph or video of the parcel and reach us immediately at <a href={`mailto:${SITE_CONFIG.ordersEmail}`} className="text-botanical font-semibold underline">{SITE_CONFIG.ordersEmail}</a> or WhatsApp <strong>{SITE_CONFIG.displayPhone}</strong>.</li>
              <li>We will arrange a free immediate replacement dispatch within 24 hours.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">7. Contact Shipping Support</h2>
            <p>
              For delivery updates, address modifications prior to dispatch, or courier delays, please reach our logistics desk:
            </p>
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs sm:text-sm font-sans space-y-1">
              <p><strong>Fulfillment Desk:</strong> VPrime Innovations, 251, First Floor, New Tiny Sector, Ambattur Industrial Estate, Chennai 600058</p>
              <p><strong>Email:</strong> <a href={`mailto:${SITE_CONFIG.email}`} className="text-botanical font-semibold underline">{SITE_CONFIG.email}</a></p>
              <p><strong>Customer Care &amp; WhatsApp:</strong> <a href={SITE_CONFIG.whatsappUrl} className="text-botanical font-semibold underline">{SITE_CONFIG.displayPhone}</a> (Mon–Sat, 9:30 AM – 6:30 PM IST)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
