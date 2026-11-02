'use client';

import React, { useEffect, useState } from 'react';
import { X, MessageSquare, Phone, ShieldCheck, CheckCircle2, User, Mail } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';
import { ComboProduct } from '@/types/combo';
import { trackComboEvent } from '@/lib/comboAnalytics';

interface ComboConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedConcernName?: string;
  selectedProducts?: ComboProduct[];
  consultationFocus?: string;
  consultationHeading?: string;
  consultationSubtitle?: string;
}

export const ComboConsultModal: React.FC<ComboConsultModalProps> = ({
  isOpen,
  onClose,
  selectedConcernName,
  selectedProducts = [],
  consultationFocus = 'Skin Care Guidance',
  consultationHeading = 'Free Ayurvedic Doctor Consultation',
  consultationSubtitle = 'Speak with a certified Ayurvedic physician about your health symptoms and suitable formulations.',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('Tamil');
  const [userNote, setUserNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSubmitted(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generate WhatsApp prefilled message with context
  const comboSummary = selectedProducts.length > 0
    ? selectedProducts.map((p) => p.name).join(', ')
    : 'None yet';

  const whatsappMessage = encodeURIComponent(
    `Hello AyurRaksha / VPrime Healthcare,\n\nI would like to book a FREE Ayurvedic Doctor Consultation for ${consultationFocus}.\n\n` +
      `Focus / Concern: ${selectedConcernName || 'General Consultation'}\n` +
      `Preferred Language: ${preferredLanguage}\n` +
      `Selected Products in Combo: ${comboSummary}\n` +
      (name ? `Name: ${name}\n` : '') +
      (userNote ? `Note: ${userNote}\n` : '')
  );

  const directWhatsappUrl = `https://wa.me/919940388877?text=${whatsappMessage}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    trackComboEvent({
      event: 'consult_click',
      placement: 'modal_submit',
      current_concern: selectedConcernName,
      cart_count: selectedProducts.length,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consult-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#123b2d] text-white p-5 sm:p-6 flex items-start justify-between relative">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-[#e2bf88] block mb-1">
              VPrime Health Care • Clinical Support
            </span>
            <h3 id="consult-modal-title" className="font-heading text-xl sm:text-2xl font-normal text-white">
              {consultationHeading}
            </h3>
            <p className="text-xs text-emerald-100/80 mt-1">
              {consultationSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-2xl font-bold text-[#18372b]">
                  Consultation Request Received!
                </h4>
                <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                  Thank you, {name || 'valued customer'}. A VPrime Ayurvedic physician will contact you shortly on {phone || 'your phone'} in {preferredLanguage}.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  <MessageSquare size={16} />
                  <span>Connect Directly on WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-500 hover:text-stone-800 underline block mx-auto pt-2"
              >
                Return to Combo Builder
              </button>
            </div>
          ) : (
            <>
              {/* Context Summary Pill */}
              <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-3.5 space-y-1.5 text-xs text-stone-700">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Selected Skin Concern:</span>
                  <span className="font-bold text-[#18372b]">
                    {selectedConcernName || 'General Exploration'}
                  </span>
                </div>
                {selectedProducts.length > 0 && (
                  <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                    <span className="text-stone-500 font-medium">Products in Combo:</span>
                    <span className="font-semibold text-stone-800">
                      {selectedProducts.length} {selectedProducts.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                )}
              </div>

              {/* Instant WhatsApp Option */}
              <div className="space-y-2">
                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>Instant Consultation on WhatsApp ↗</span>
                </a>
                <p className="text-[11px] text-center text-stone-500">
                  Connect immediately with our clinical coordination desk.
                </p>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                  Or request a callback
                </span>
              </div>

              {/* Callback Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="consult-name" className="text-xs font-semibold text-stone-700 block mb-1">
                    Your Name *
                  </label>
                  <input
                    id="consult-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:bg-white focus:outline-none focus:border-[#18372b]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="consult-phone" className="text-xs font-semibold text-stone-700 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="consult-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 99999 99999"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:bg-white focus:outline-none focus:border-[#18372b]"
                    />
                  </div>

                  <div>
                    <label htmlFor="consult-lang" className="text-xs font-semibold text-stone-700 block mb-1">
                      Preferred Language
                    </label>
                    <select
                      id="consult-lang"
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:bg-white focus:outline-none focus:border-[#18372b] cursor-pointer"
                    >
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                      <option value="Malayalam">Malayalam (മലയാളം)</option>
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="consult-note" className="text-xs font-semibold text-stone-700 block mb-1">
                    Specific Symptoms or Questions (Optional)
                  </label>
                  <textarea
                    id="consult-note"
                    rows={2}
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="Briefly describe your skin symptoms, duration, or any questions..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:bg-white focus:outline-none focus:border-[#18372b]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#18372b] hover:bg-[#23533e] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  Request Free Callback
                </button>
              </form>

              {/* Doctor Details Note */}
              <div className="flex items-center gap-2 pt-2 text-[11px] text-stone-500 border-t border-stone-100">
                <ShieldCheck size={14} className="text-emerald-700 flex-shrink-0" />
                <span>
                  Consultations conducted by Dr. Jegajothi Pandian &amp; qualified VPrime Ayurvedic physicians.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
