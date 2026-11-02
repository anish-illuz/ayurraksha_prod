import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'Regulatory & Medical Disclaimer | AyurRaksha Online',
  description: 'Read the official AYUSH regulatory, dietary supplement, and medical guidance disclaimers for AyurRaksha products formulated under Dr. Jegajothi Pandian.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/disclaimer/`,
  },
};

export default function DisclaimerPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <Breadcrumb items={[{ name: 'Medical Disclaimer', url: '/disclaimer' }]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-stone-100">
            <span className="w-2.5 h-8 bg-botanical rounded-full" />
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Regulatory &amp; Medical Disclaimer
            </h1>
          </div>

          <div className="prose prose-stone text-xs sm:text-sm text-charcoal leading-relaxed space-y-5">
            <div className="bg-[#E8EFE6]/60 rounded-xl p-4 sm:p-5 border border-[#2D5A43]/20 text-forest text-xs sm:text-sm leading-relaxed">
              <strong>Mandatory Regulatory Notice:</strong> The information, clinical case narratives, and product recommendations published on <strong>AyurRakshaOnline.com</strong> (an initiative of <strong>VPrime Innovations</strong>) are strictly intended for holistic wellness education, dietary lifestyle balance, and Ayurvedic literacy. They do not constitute formal medical diagnosis or prescription.
            </div>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">1. Nature of Ayurvedic Formulations</h2>
            <p>
              AyurRaksha formulations—including our classical herbal tonics (e.g., BoozLiv, Purna Sakthi), topical soothing oils (e.g., Divine Healing Oil, Etioment Roll-on), and dietary supplement capsules—are formulated in Chennai under the direction of <strong>Dr. Jegajothi Pandian</strong> using time-honored Ayurvedic botanical principles. These products are classified as Ayurvedic Proprietary Medicines and Dietary Supplements under applicable Indian AYUSH guidelines.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">2. Drugs &amp; Magic Remedies (DMR) Act Compliance</h2>
            <p>
              In strict adherence to the <em>Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954</em> and the <em>Drugs and Cosmetics Act, 1940</em>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>AyurRaksha products are <strong>not intended to diagnose, treat, cure, or prevent any chronic disease</strong>, including but not limited to liver cirrhosis, cancer, chronic kidney failure, diabetes mellitus, cardiovascular arrest, or systemic blindness.</li>
              <li>Therapeutic references on this site pertain to general physiological organ support, metabolic balance (Agni), tissue rejuvenation (Rasayana), and topical dermatological soothing.</li>
              <li>Customer testimonials, patient case reflections, and practitioner observations describe individual experiences and do not guarantee uniform outcomes for all individuals.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">3. Doctor Consultation &amp; Concurrent Medical Therapy</h2>
            <p>
              If you are pregnant, nursing, taking prescription pharmaceuticals (such as blood thinners, immunosuppressants, or anti-diabetic medications), or scheduled for surgery:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Do not discontinue</strong> your prescribed allopathic treatments or pharmaceutical regimen without the direct supervision of your treating physician.</li>
              <li>Always inform your medical practitioner or consult our chief Ayurvedic Medical Officer via our dedicated WhatsApp consultation desk before beginning any intensive dietary supplement cycle.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">4. Topical Products &amp; Patch Test Requirement</h2>
            <p>
              Prior to regular application of any herbal oil, ointment, roll-on, or topical balm (such as SP Soryn Cream, Etioment Pain Relief Oil, or Skin Conditioning Oil), we advise performing a preliminary patch test on a small area of the inner forearm. If irritation, rash, or redness develops, discontinue use immediately and cleanse the area with mild soap and water.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">5. Accuracy of Information &amp; Website Content</h2>
            <p>
              While VPrime Innovations makes every reasonable effort to keep product descriptions, ingredient breakdowns, dosage directions, and packaging specifications accurate and up to date, formulations and packaging may occasionally undergo refinements based on seasonal herbal harvest availability.
            </p>

            <h2 className="font-serif text-lg font-bold text-forest pt-2">6. Clinical Desk &amp; Regulatory Inquiries</h2>
            <p>
              For any questions regarding ingredients, batch testing, certification, or clinical guidance, please reach our medical support desk:
            </p>
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-1.5 font-sans">
              <p><strong>Entity:</strong> VPrime Innovations (AyurRaksha Online)</p>
              <p><strong>Chief Formulation Scientist:</strong> Dr. Jegajothi Pandian</p>
              <p><strong>Registered Address:</strong> 251, First Floor, New Tiny Sector, Ambattur Industrial Estate, Chennai 600058, Tamil Nadu, India</p>
              <p><strong>Clinical WhatsApp Desk:</strong> <a href={SITE_CONFIG.whatsappUrl} className="text-botanical font-semibold underline">{SITE_CONFIG.displayPhone}</a></p>
              <p><strong>Email:</strong> <a href={`mailto:${SITE_CONFIG.email}`} className="text-botanical font-semibold underline">{SITE_CONFIG.email}</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
