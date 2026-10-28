import React from 'react';
import { Package, MessageSquare, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SITE_CONFIG } from '@/data/siteConfig';

export default function OrderTrackingPage() {
  return (
    <div className="bg-ivory min-h-[60vh] pb-12">
      <Breadcrumb items={[{ name: 'Order Tracking', url: '/order-tracking' }]} />
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        <Package className="text-primary mb-4" size={32} />
        <h1 className="font-heading text-4xl text-primary mb-4">Track your order</h1>
        <p className="text-charcoal-muted leading-relaxed">Sign in to your store account to view your orders. For a guest order or courier tracking number, contact our support team with the order number from your confirmation email.</p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <a href="https://www.ayurrakshaonline.com/my-account/orders/" className="inline-flex justify-center items-center gap-2 rounded-xl bg-primary text-white px-5 py-3 text-sm font-semibold">View my orders <ArrowRight size={16} /></a>
          <a href="https://wa.me/919940388877?text=Hello%20Ayurraksha%2C%20I%20would%20like%20to%20track%20my%20order.%20My%20order%20number%20is%3A%20" target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center gap-2 rounded-xl border border-primary text-primary px-5 py-3 text-sm font-semibold"><MessageSquare size={16} /> Ask for tracking details</a>
        </div>
        <p className="mt-6 text-sm text-charcoal-muted">You can also call <a className="text-primary underline" href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.displayPhone}</a>.</p>
      </div>
    </div>
  );
}
