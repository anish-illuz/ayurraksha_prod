import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'Privacy Policy | AyurRaksha Online',
  description: 'Learn how AyurRaksha and VPrime Innovations collect, protect, and handle your personal data in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.',
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
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-stone-100">
            <span className="w-2.5 h-8 bg-botanical rounded-full" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Privacy Policy
            </h1>
          </div>

          <div className="prose prose-stone text-xs sm:text-sm text-charcoal leading-relaxed space-y-5">
            <p className="text-xs text-stone-500">
              <strong>Last Updated:</strong> November 2, 2026 | <strong>Compliant with:</strong> DPDP Act, 2023 &amp; IT Rules, 2011
            </p>

            <p>
              At <strong>AyurRakshaOnline.com</strong> (operated by <strong>VPrime Innovations</strong>, Ambattur, Chennai), we value your trust and are committed to safeguarding your personal data and privacy. This Privacy Policy details our practices regarding the collection, processing, protection, and disclosure of information when you access our website or order our authentic Ayurvedic wellness products.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">1. Personal Information We Collect</h2>
            <p>We collect strictly necessary customer information to fulfill commerce obligations and provide clinical support:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Contact &amp; Identity Data:</strong> Full Name, Mobile Phone Number, and Email Address.</li>
              <li><strong>Shipping &amp; Delivery Data:</strong> Complete Street Address, City, State, and 6-digit Indian Postal PIN Code.</li>
              <li><strong>Transactional Data:</strong> Order reference numbers, product items purchased, pack sizes, and payment status. <em>(Note: We do not collect or store credit card numbers, CVVs, or NetBanking passwords; all transactions occur securely via PCI-DSS certified gateway partners like Razorpay.)</em></li>
              <li><strong>Consultation Inquiries:</strong> Voluntary health indications or queries submitted through our official WhatsApp consultation desk.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">2. Purpose &amp; Lawful Basis of Processing</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Order Processing &amp; Fulfillment:</strong> Preparing, packaging, invoicing, and delivering your ordered formulations.</li>
              <li><strong>Customer Communication:</strong> Dispatching tracking links, delivery SMS alerts, order confirmation emails, and delivery status updates.</li>
              <li><strong>Clinical Guidance:</strong> Providing dosage advice or formulation guidance when specifically requested by the patient.</li>
              <li><strong>Statutory Compliance:</strong> Maintaining GST tax invoices and accounting records in compliance with Indian commercial law.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">3. Zero Third-Party Data Sale</h2>
            <p>
              <strong>We do not sell, rent, trade, or monetize your personal information to third-party data brokers or marketing agencies.</strong> Your data is accessed strictly by authorized personnel and verified logistical partners essential to the execution of your order.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">4. Trusted Service Providers &amp; Disclosures</h2>
            <p>We share limited customer data strictly on a need-to-know basis with:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Domestic Logistics Partners:</strong> Courier companies (Blue Dart, Delhivery, DTDC, India Post) to physically transport and deliver your shipment.</li>
              <li><strong>Payment Gateways:</strong> Razorpay Software Private Limited for encrypted tokenized transaction authorization.</li>
              <li><strong>Statutory &amp; Law Enforcement Bodies:</strong> Only when compelled by legal summons or applicable judicial process in India.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">5. Data Security Safeguards</h2>
            <p>
              We implement industry-standard technical and organizational security measures to protect your information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>All web traffic between your browser and our servers is secured with 256-bit TLS/SSL encryption.</li>
              <li>Server infrastructure is protected with firewalls and automated intrusion monitoring.</li>
              <li>Access to customer billing records is restricted strictly to designated fulfillment coordinators.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">6. Customer Rights Under the DPDP Act</h2>
            <p>
              In accordance with the <em>Digital Personal Data Protection Act, 2023</em>, you have the right to request a summary of your personal data held by us, request correction of inaccurate details, or request deletion of non-statutory records by sending an email to our data privacy officer.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">7. Grievance Officer &amp; Privacy Contact</h2>
            <p>
              For privacy queries, data access requests, or grievance redressal, please contact our designated coordinator:
            </p>
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs sm:text-sm font-sans space-y-1">
              <p><strong>Grievance Coordinator:</strong> VPrime Innovations — Legal &amp; Data Compliance</p>
              <p><strong>Address:</strong> 251, First Floor, New Tiny Sector, Ambattur Industrial Estate, Chennai 600058, Tamil Nadu, India</p>
              <p><strong>Privacy Inquiries Email:</strong> <a href={`mailto:${SITE_CONFIG.corporateEmail}`} className="text-botanical font-semibold underline">{SITE_CONFIG.corporateEmail}</a></p>
              <p><strong>General Support Email:</strong> <a href={`mailto:${SITE_CONFIG.email}`} className="text-botanical font-semibold underline">{SITE_CONFIG.email}</a></p>
              <p><strong>Helpline:</strong> {SITE_CONFIG.displayPhone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
