'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import {
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Banknote,
  AlertCircle,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { SITE_CONFIG } from '@/data/siteConfig';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface OrderSuccess {
  orderId: string;
  paymentId?: string;
  paymentMethod: 'razorpay' | 'cod';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  items: any[];
  totalAmount: number;
}

export default function CheckoutPage() {
  const { items, itemCount, subtotal, clearCart } = useCart();

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    notes: '',
  });

  const [previousAttemptOrderId, setPreviousAttemptOrderId] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderSuccess | null>(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  // Razorpay credentials fetched from WordPress backend
  const [razorpayConfig, setRazorpayConfig] = useState<{
    key: string;
    name: string;
    currency: string;
  } | null>(null);

  useEffect(() => {
    // Fetch live Razorpay details from WordPress backend route
    fetch('/api/razorpay/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.key) {
          setRazorpayConfig({
            key: data.key,
            name: data.name || 'AyurRaksha',
            currency: data.currency || 'INR',
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching Razorpay config:', err);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  // Pricing calculations
  // Automatic Volume Discount:
  // - Orders > ₹5,000 -> 15% OFF
  // - Orders > ₹2,000 -> 10% OFF
  const tierDiscountPercent = subtotal >= 5000 ? 15 : subtotal >= 2000 ? 10 : 0;
  const tierDiscount = Math.round(subtotal * (tierDiscountPercent / 100));
  const discountedSubtotal = subtotal - tierDiscount;

  // Prepaid: Free delivery + 5% extra discount
  // COD: Flat ₹100 COD fee
  const prepaidDiscount = paymentMethod === 'razorpay' ? Math.round(discountedSubtotal * 0.05) : 0;
  const shippingFee = paymentMethod === 'razorpay' ? 0 : 100;
  const totalPayable = Math.max(0, discountedSubtotal - prepaidDiscount + shippingFee);

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your full name';
    if (!formData.phone.trim() || formData.phone.trim().length < 10) return 'Please enter a valid 10-digit mobile number';
    if (!formData.address.trim()) return 'Please enter your street address';
    if (!formData.city.trim()) return 'Please enter your city';
    if (!formData.pincode.trim() || formData.pincode.trim().length < 6) return 'Please enter a valid 6-digit PIN code';
    return null;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Record order in WooCommerce backend and get the real WooCommerce Order Number
    let wooOrderNumber = '';
    let wooOrderId = '';

    try {
      const note = formData.notes
        ? previousAttemptOrderId
          ? `${formData.notes} | Switched to ${paymentMethod.toUpperCase()} (Prev: #${previousAttemptOrderId})`
          : formData.notes
        : previousAttemptOrderId
        ? `Switched to ${paymentMethod.toUpperCase()} (Previous attempt: #${previousAttemptOrderId})`
        : `Order placed via ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}`;

      const orderRes = await fetch('/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customer: formData,
          paymentMethod,
          customerNote: note,
          tierDiscount,
          tierDiscountPercent,
        }),
      });

      const orderData = await orderRes.json();
      if (orderData.orderNumber) {
        wooOrderNumber = String(orderData.orderNumber);
        wooOrderId = String(orderData.orderId || orderData.orderNumber);
        setPreviousAttemptOrderId(wooOrderNumber);
      } else {
        wooOrderNumber = orderData.fallbackOrderNumber || `AYUR-${Date.now().toString().slice(-6)}`;
      }
    } catch (err) {
      console.error('WooCommerce order recording error:', err);
      wooOrderNumber = `AYUR-${Date.now().toString().slice(-6)}`;
    }

    if (paymentMethod === 'cod') {
      // Direct Cash on Delivery order recorded in WooCommerce
      const orderSummary: OrderSuccess = {
        orderId: wooOrderNumber,
        paymentMethod: 'cod',
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        shippingAddress: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        items: [...items],
        totalAmount: totalPayable,
      };
      setCompletedOrder(orderSummary);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ayurraksha_has_ordered', 'true');
      }
      clearCart();
      setIsProcessing(false);
      return;
    }

    // Razorpay Online Payment Flow
    if (typeof window === 'undefined' || !window.Razorpay) {
      setErrorMessage('Payment gateway is loading. Please try again in a few seconds.');
      setIsProcessing(false);
      return;
    }

    const key = razorpayConfig?.key || 'rzp_live_kWyXoOFkrDjUBk';

    const options = {
      key: key,
      amount: Math.round(totalPayable * 100), // in paise
      currency: razorpayConfig?.currency || 'INR',
      name: razorpayConfig?.name || 'AyurRaksha',
      description: `Order #${wooOrderNumber} (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`,
      image: 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/cropped-Ayur-Raksha-Favicon-192x192.png',
      handler: function (response: any) {
        setIsProcessing(false);
        const orderSummary: OrderSuccess = {
          orderId: wooOrderNumber,
          paymentId: response.razorpay_payment_id,
          paymentMethod: 'razorpay',
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          shippingAddress: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          items: [...items],
          totalAmount: totalPayable,
        };
        setCompletedOrder(orderSummary);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ayurraksha_has_ordered', 'true');
        }
        clearCart();
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        woocommerce_order_number: wooOrderNumber,
        woocommerce_order_id: wooOrderId,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      },
      theme: {
        color: '#80A03C',
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          setErrorMessage('Online payment was cancelled or closed. You can retry payment or switch to Cash on Delivery below.');
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setIsProcessing(false);
        setErrorMessage(response.error.description || 'Payment failed. Please try again or choose Cash on Delivery.');
      });
      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage('Could not open payment gateway. Please check your details or try COD.');
    }
  };

  // SUCCESS STATE SCREEN
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-lg text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-botanical flex items-center justify-center mx-auto mb-6 shadow-xs border border-emerald-100">
            <CheckCircle2 size={44} />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-botanical bg-sage-light px-3 py-1 rounded-full">
            Order Confirmed
          </span>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-forest mt-3">
            Thank you, {completedOrder.customerName}!
          </h1>

          <p className="text-sm sm:text-base text-charcoal-muted mt-2">
            Your order has been received and is being prepared with doctor-guided clinical care.
          </p>

          <div className="mt-6 p-5 bg-[#F9FAF6] rounded-2xl border border-stone-200 text-left space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm border-b border-stone-200 pb-3">
              <span className="text-charcoal-muted">Order ID:</span>
              <span className="font-mono font-bold text-forest">{completedOrder.orderId}</span>
            </div>

            {completedOrder.paymentId && (
              <div className="flex items-center justify-between text-xs sm:text-sm border-b border-stone-200 pb-3">
                <span className="text-charcoal-muted">Razorpay Payment ID:</span>
                <span className="font-mono font-semibold text-charcoal">{completedOrder.paymentId}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs sm:text-sm border-b border-stone-200 pb-3">
              <span className="text-charcoal-muted">Payment Mode:</span>
              <span className="font-semibold text-charcoal capitalize">
                {completedOrder.paymentMethod === 'razorpay' ? 'Prepaid Online (Razorpay)' : 'Cash on Delivery (COD)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm border-b border-stone-200 pb-3">
              <span className="text-charcoal-muted">Amount:</span>
              <span className="font-bold text-forest text-base sm:text-lg">
                ₹{completedOrder.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="text-xs sm:text-sm pt-1">
              <span className="text-charcoal-muted block">Delivering To:</span>
              <span className="font-medium text-charcoal mt-1 block">
                {completedOrder.shippingAddress}, {completedOrder.city}, {completedOrder.state} - {completedOrder.pincode}
              </span>
              <span className="text-xs text-charcoal-muted mt-0.5 block">Phone: {completedOrder.customerPhone}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/919940388877?text=Hi%20AyurRaksha,%20I%20placed%20order%20${completedOrder.orderId}.%20Please%20confirm.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-md transition-all"
            >
              <MessageSquare size={18} />
              <span>Track on WhatsApp</span>
            </a>

            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-forest hover:bg-forest-light text-white transition-all shadow-xs"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART SCREEN
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-200 p-8 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-sage-light text-botanical flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-forest">Your cart is empty</h2>
          <p className="text-sm text-charcoal-muted mt-2">
            Please add doctor-formulated remedies to your cart before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-botanical hover:bg-forest text-white transition-all shadow-md"
          >
            <span>Explore Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Razorpay Standard Checkout SDK */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayReady(true)}
      />

      <div className="min-h-screen bg-[#FAF7F2] pb-20">
        {/* Checkout Header */}
        <header className="bg-white border-b border-stone-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="relative h-10 w-36 block">
              <Image
                src="/images/logo.png"
                alt="AyurRaksha"
                fill
                sizes="144px"
                className="object-contain object-left"
              />
            </Link>
            <div className="flex items-center gap-2 text-xs font-semibold text-forest bg-sage-light px-3 py-1.5 rounded-full border border-[#DCE8CD]">
              <Lock size={14} className="text-botanical" />
              <span>100% Secure Checkout</span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left 7 Columns: Delivery & Payment Details Form */}
            <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">

              {/* Error banner */}
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-sm">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Contact Information */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h2 className="font-heading text-lg font-bold text-forest">
                    1. Contact Information
                  </h2>
                  <span className="text-xs text-charcoal-muted">For order &amp; delivery updates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-botanical focus:ring-1 focus:ring-botanical"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-botanical focus:ring-1 focus:ring-botanical"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="For invoice and receipt"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-botanical focus:ring-1 focus:ring-botanical"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h2 className="font-heading text-lg font-bold text-forest">
                    2. Delivery Address
                  </h2>
                  <span className="text-xs text-charcoal-muted">Discreet doorstep packaging</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                      Street Address / House / Flat *
                    </label>
                    <textarea
                      name="address"
                      rows={2}
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Door no, Building name, Street, Landmark"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-botanical focus:ring-1 focus:ring-botanical"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-botanical focus:ring-1 focus:ring-botanical"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        State *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-3 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-botanical bg-white"
                      >
                        {[
                          'Tamil Nadu',
                          'Karnataka',
                          'Kerala',
                          'Andhra Pradesh',
                          'Telangana',
                          'Maharashtra',
                          'Delhi',
                          'Gujarat',
                          'West Bengal',
                          'Uttar Pradesh',
                          'Rajasthan',
                          'Other State',
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="6 digits"
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-botanical focus:ring-1 focus:ring-botanical"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Payment Method Choice */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h2 className="font-heading text-lg font-bold text-forest">
                    3. Payment Method
                  </h2>
                  <span className="text-xs font-bold text-botanical">Direct Razorpay Gateway</span>
                </div>

                <div className="space-y-3">
                  {/* Option 1: Razorpay Online Payment */}
                  <label
                    className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'razorpay'
                        ? 'border-botanical bg-[#FAFBF6] shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="mt-1 h-4 w-4 text-botanical focus:ring-botanical"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-forest flex items-center gap-2">
                            <CreditCard size={18} className="text-botanical" />
                            <span>Online Payment via Razorpay</span>
                          </span>
                          <span className="text-xs font-bold text-botanical bg-[#EBF3DF] px-2.5 py-0.5 rounded-full">
                            Extra 5% OFF + Free Delivery
                          </span>
                        </div>
                        <p className="text-xs text-charcoal-muted mt-1">
                          UPI (Google Pay, PhonePe, Paytm), All Debit/Credit Cards, NetBanking.
                        </p>
                        <div className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-stone-500">
                          <ShieldCheck size={14} className="text-emerald-600" />
                          <span>Direct instant verification via Razorpay • 100% Encrypted</span>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery */}
                  <label
                    className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-botanical bg-[#FAFBF6] shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 h-4 w-4 text-botanical focus:ring-botanical"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-charcoal flex items-center gap-2">
                            <Banknote size={18} className="text-stone-600" />
                            <span>Cash on Delivery (COD)</span>
                          </span>
                          <span className="text-xs text-stone-500 font-medium">+₹100 COD fee</span>
                        </div>
                        <p className="text-xs text-charcoal-muted mt-1">
                          Pay in cash or UPI when your order arrives at your doorstep.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl text-base font-bold uppercase tracking-wider bg-botanical hover:bg-forest text-white shadow-lg shadow-botanical/25 transition-all active:scale-[0.99] disabled:bg-stone-300 disabled:cursor-not-allowed"
                >
                  <Lock size={18} />
                  <span>
                    {isProcessing
                      ? 'Processing Order...'
                      : paymentMethod === 'razorpay'
                      ? `Pay ₹${totalPayable.toLocaleString('en-IN')} via Razorpay`
                      : `Confirm COD Order (₹${totalPayable.toLocaleString('en-IN')})`}
                  </span>
                </button>
              </div>
            </form>

            {/* Right 5 Columns: Order Summary Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-heading text-lg font-bold text-forest">
                    Order Summary ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </h3>
                  <Link href="/cart" className="text-xs font-semibold text-botanical hover:underline">
                    Edit Cart
                  </Link>
                </div>

                {/* Items List */}
                <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const unitPrice = item.variantPrice ?? item.product.price;
                    const lineTotal = unitPrice * item.quantity;
                    return (
                      <div
                        key={`${item.product.id}-${item.selectedVariant || 'default'}`}
                        className="py-3.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-14 h-14 bg-[#FAF8F5] rounded-xl border border-stone-200 p-1 flex-shrink-0">
                            <Image
                              src={item.product.images[0] || 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/1.png'}
                              alt={item.product.name}
                              fill
                              sizes="56px"
                              className="object-contain"
                            />
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-forest text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-charcoal truncate">
                              {item.product.name}
                            </p>
                            {item.selectedVariant && (
                              <p className="text-xs font-semibold text-emerald-800 truncate">
                                Pack: {item.selectedVariant}
                                {item.packCount && item.packCount > 1 && (
                                  <span className="ml-1 text-[11px] font-normal text-stone-500">
                                    ({item.packCount * item.quantity} packs total)
                                  </span>
                                )}
                              </p>
                            )}
                            <span className="text-xs text-charcoal-muted">
                              Qty: {item.quantity} × ₹{unitPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm sm:text-base font-bold text-forest flex-shrink-0">
                          ₹{lineTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Cost Breakdown */}
                <div className="border-t border-stone-200 pt-4 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Subtotal</span>
                    <span className="font-semibold text-charcoal">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {tierDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                      <span>Volume Discount ({tierDiscountPercent}% OFF)</span>
                      <span>-₹{tierDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {prepaidDiscount > 0 && (
                    <div className="flex items-center justify-between text-botanical font-semibold">
                      <span>Prepaid Special Discount (5%)</span>
                      <span>-₹{prepaidDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Delivery Charges</span>
                    {shippingFee === 0 ? (
                      <span className="font-bold text-botanical">FREE</span>
                    ) : (
                      <span className="font-semibold text-charcoal">+₹100</span>
                    )}
                  </div>

                  <div className="border-t border-stone-200 pt-3 flex items-baseline justify-between">
                    <span className="text-sm sm:text-base font-bold text-forest">Total Payable</span>
                    <span className="text-xl sm:text-2xl font-bold text-forest">
                      ₹{totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Razorpay Trust Strip */}
                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-stone-600">
                    <ShieldCheck size={16} className="text-botanical" />
                    <span>Verified Razorpay Secured Checkout</span>
                  </div>
                  <p className="text-[11px] text-center text-stone-400">
                    UPI • Google Pay • PhonePe • Paytm • Visa • Mastercard • NetBanking
                  </p>
                </div>
              </div>

              {/* Consultation Assistance Card */}
              <div className="bg-sage-light p-4 rounded-2xl border border-[#DCE4CF] flex items-start gap-3 text-xs text-charcoal-muted">
                <Phone size={18} className="text-botanical flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-forest block">Need Order Assistance?</span>
                  <p className="mt-0.5">
                    Connect directly with our Chennai clinic team on WhatsApp:{' '}
                    <a
                      href={SITE_CONFIG.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-botanical underline"
                    >
                      {SITE_CONFIG.displayPhone}
                    </a>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
