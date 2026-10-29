'use client';

import React, { useState } from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle, Send } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    concern: 'Order Related',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData({ name: '', email: '', phone: '', concern: 'Order Related', message: '' });
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <Breadcrumb items={[{ name: 'Contact Us', url: '/contact' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-botanical uppercase tracking-wider block mb-2">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
            Customer Support &amp; Clinical Inquiries
          </h1>
          <p className="mt-2 text-sm text-charcoal-muted leading-relaxed">
            Have questions about an ongoing order, delivery timelines, or need guidance choosing a formulation? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-card border border-stone-200 shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-forest">
                AyurRaksha Clinic &amp; Office
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-charcoal">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-botanical flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-forest">Address:</strong>
                    <span>
                      {SITE_CONFIG.legalName}<br />
                      {SITE_CONFIG.address.street},<br />
                      {SITE_CONFIG.address.area},<br />
                      {SITE_CONFIG.address.city} – {SITE_CONFIG.address.postalCode},<br />
                      {SITE_CONFIG.address.state}, India.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-botanical flex-shrink-0" />
                  <div>
                    <strong className="block text-forest">Phone &amp; Orders:</strong>
                    <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-botanical font-semibold">
                      {SITE_CONFIG.displayPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-botanical flex-shrink-0" />
                  <div>
                    <strong className="block text-forest">Customer Support Email:</strong>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-botanical">
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-botanical flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-forest">Operating Hours:</strong>
                    <span>Monday to Saturday: 9:30 AM – 6:30 PM IST</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-stone-100">
                <a
                  href={SITE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-button text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>Immediate Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-card border border-stone-200 shadow-xs">
            <h2 className="font-serif text-xl font-bold text-forest mb-1">
              Send us a Message
            </h2>
            <p className="text-xs text-charcoal-muted mb-6">
              Fill out the form below and our team will get back to you within 24 business hours.
            </p>

            {isSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle size={32} className="text-emerald-700 mx-auto" />
                <h3 className="font-bold text-forest text-base">Message Sent Successfully!</h3>
                <p className="text-xs text-charcoal-muted">
                  Thank you for reaching out. An AyurRaksha wellness specialist will contact you shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-botanical hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="text-xs font-semibold text-charcoal block mb-1">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 rounded-button text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-botanical"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="text-xs font-semibold text-charcoal block mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 99999 99999"
                      className="w-full px-3.5 py-2.5 rounded-button text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-botanical"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className="text-xs font-semibold text-charcoal block mb-1">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-button text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-botanical"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-concern" className="text-xs font-semibold text-charcoal block mb-1">
                      Subject / Inquiry Type
                    </label>
                    <select
                      id="contact-concern"
                      value={formData.concern}
                      onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-button text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-botanical cursor-pointer"
                    >
                      <option value="Order Related">Order &amp; Delivery Tracking</option>
                      <option value="Product Formulation">Product Formulation &amp; Dosage</option>
                      <option value="Doctor Consultation">Doctor Consultation Request</option>
                      <option value="Refund or Return">Refund &amp; Return Query</option>
                      <option value="Wholesale Inquiry">Corporate / Trade Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-xs font-semibold text-charcoal block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist your wellness journey?"
                    className="w-full px-3.5 py-2.5 rounded-button text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-botanical"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-button text-xs font-semibold bg-forest hover:bg-forest-light text-white transition-colors"
                >
                  <Send size={14} />
                  <span>Submit Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map Embed */}
        <div className="mt-12 rounded-2xl overflow-hidden border border-stone-200 shadow-xs h-72 sm:h-96">
          <iframe
            src="https://maps.google.com/maps?q=VPrime%20Innovations%2C%20Ambattur%20Industrial%20Estate%2C%20Chennai%20600058&t=m&z=15&output=embed&iwloc=near"
            title="AyurRaksha Location in Ambattur Industrial Estate, Chennai"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
