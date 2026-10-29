import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | AyurRaksha Online',
  description: 'Learn about AyurRaksha delivery timelines, free shipping on prepaid orders, and Cash on Delivery terms across India.',
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
          <h1 className="font-serif text-3xl font-bold text-forest mb-6 pb-4 border-b border-stone-100">
            Shipping &amp; Delivery Policy
          </h1>

          <div className="prose prose-stone text-xs sm:text-sm text-charcoal leading-relaxed space-y-4">
            <p>
              At <strong>AyurRakshaOnline.com</strong>, an initiative of <strong>VPrime Innovations</strong>, we strive to deliver your products in pristine condition, securely packaged, and on schedule. Below is an overview of our delivery terms:
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">1. Shipping Locations</h2>
            <p>
              We currently ship across all pin codes in India through leading domestic courier networks. International shipping is not available at this time.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">2. Processing Time</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Orders are processed and dispatched within 1–2 business days from our Chennai fulfillment facility.</li>
              <li>Orders placed after 3:00 PM IST or on weekends and national holidays will be processed on the following business day.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">3. Shipping Charges</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Prepaid Orders:</strong> 100% Free Shipping throughout India on all orders paid via UPI, NetBanking, Credit Card, or Debit Card.</li>
              <li><strong>Cash on Delivery (COD):</strong> A nominal courier handling convenience fee of ₹100 applies per order.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">4. Estimated Delivery Time</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Metro cities</strong> (Chennai, Bengaluru, Mumbai, Delhi-NCR, Hyderabad, Kolkata): 2–5 business days.</li>
              <li><strong>Non-metro and regional locations:</strong> 5–7 business days.</li>
              <li>Delivery times may vary slightly during regional festivals or unexpected courier service disruptions.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">5. Order Tracking</h2>
            <p>
              Once your order has been dispatched, you will receive an SMS and email notification with your tracking number and live status tracking link.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest mt-6 mb-2">6. Delivery Inquiries &amp; Support</h2>
            <p>
              In case of delivery delays or packaging concerns, please contact our support team at <a href={`mailto:${SITE_CONFIG.email}`} className="text-botanical font-semibold underline">{SITE_CONFIG.email}</a> or call/WhatsApp us at <strong>{SITE_CONFIG.displayPhone}</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
