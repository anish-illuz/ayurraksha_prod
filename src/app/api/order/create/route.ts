import { NextResponse } from 'next/server';
import { fetchCmsCommerce } from '@/lib/cms';
import { getProductById } from '@/lib/products';
import {
  comboSubtotalPaise as computeComboSubtotalPaise,
  comboCouponFor,
  comboDiscountRupees,
} from '@/lib/comboPricing';
import { resolveItemVariant } from '@/lib/orderItemResolution';
import { SITE_CONFIG } from '@/data/siteConfig';

const WORDPRESS_BASE = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.ayurrakshaonline.com';
const WORDPRESS_STORE_API = `${WORDPRESS_BASE}/wp-json/wc/store/v1`;

// State name to state code abbreviation mapping for India
const STATE_CODE_MAP: Record<string, string> = {
  'Tamil Nadu': 'TN',
  'Karnataka': 'KA',
  'Kerala': 'KL',
  'Andhra Pradesh': 'AP',
  'Telangana': 'TG',
  'Maharashtra': 'MH',
  'Delhi': 'DL',
  'Gujarat': 'GJ',
  'West Bengal': 'WB',
  'Uttar Pradesh': 'UP',
  'Rajasthan': 'RJ',
  'Punjab': 'PB',
  'Haryana': 'HR',
  'Madhya Pradesh': 'MP',
  'Bihar': 'BR',
  'Odisha': 'OR',
};

/**
 * Record the COD delivery charge on a placed WooCommerce order as a fee line
 * item (authenticated WC REST API, same application-password credentials the
 * Razorpay verify route uses), so the backend order total matches the amount
 * the customer pays in cash at the doorstep. Idempotent: skips when a COD fee
 * line already exists. Failures are logged, never thrown — the order is
 * already recorded; fee bookkeeping must not break checkout.
 */
async function recordCodFeeLineItem(
  wooOrderId: string | number,
  codFeeRupees: number,
  userAgent?: string,
  prefetchedOrder?: any,
): Promise<void> {
  const ck = process.env.WC_CONSUMER_KEY;
  const cs = process.env.WC_CONSUMER_SECRET;
  if (!ck || !cs) {
    console.warn('[OrderCreate] WC_CONSUMER_KEY / WC_CONSUMER_SECRET not set; the COD delivery-charge fee was not recorded on the order.');
    return;
  }

  const url = `${WORDPRESS_BASE}/wp-json/wc/v3/orders/${encodeURIComponent(String(wooOrderId))}`;

  // Resolve the order object: prefer the REST v3 order the caller already
  // fetched (avoids a duplicate GET); otherwise read it now to keep any
  // existing fee lines and stay retry-safe.
  let order: any = prefetchedOrder;
  if (!order) {
    try {
      const getRes = await fetch(url, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${ck}:${cs}`).toString('base64')}`,
          'Content-Type': 'application/json',
          'User-Agent': userAgent || 'AyurRaksha-NextJS/1.0',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      if (!getRes.ok) {
        console.warn(`[OrderCreate] Could not read order #${wooOrderId} for COD fee recording (HTTP ${getRes.status}).`);
        return;
      }
      order = await getRes.json().catch(() => null);
    } catch (readErr) {
      console.warn(`[OrderCreate] Could not read order #${wooOrderId} for COD fee recording:`, readErr);
      return;
    }
  }
  if (!order) {
    console.warn(`[OrderCreate] No order data available for #${wooOrderId}; COD fee not recorded.`);
    return;
  }

  // Keep any existing fee lines; skip when a COD fee is already recorded
  // (retry-safe). The WC REST v3 order field is `fee_lines` — the older
  // `fee_line_items` spelling is silently ignored by the API, so the fee
  // must go under `fee_lines` or the order total never moves.
  const existingFees: any[] = Array.isArray(order.fee_lines) ? order.fee_lines : [];
  if (existingFees.some((f) => /cod/i.test(String(f?.name || '')))) return;

  try {
    const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
    const headers = {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      'User-Agent': userAgent || 'AyurRaksha-NextJS/1.0',
      'Accept': 'application/json',
    };
    const orderTotalRupees = Number(order.total ?? 0);
    const putRes = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        fee_lines: [
          ...existingFees,
          {
            name: 'COD Delivery Charge',
            total: codFeeRupees.toFixed(2),
            total_tax: '0.00',
            tax_class: '',
          },
        ],
      }),
      cache: 'no-store',
    });

    if (!putRes.ok) {
      console.warn(`[OrderCreate] COD fee line item not recorded for order #${wooOrderId} (HTTP ${putRes.status}):`, await putRes.text().catch(() => ''));
      return;
    }

    // WooCommerce recalculates the order total when fee lines change
    // (verified live: total moved +100 on a real order). Confirm it moved;
    // if it did not, set the total explicitly as a fallback.
    const afterRes = await fetch(url, { headers, cache: 'no-store' });
    const after = afterRes.ok ? await afterRes.json().catch(() => null) : null;
    const expectedTotal = orderTotalRupees + codFeeRupees;
    if (after && Math.abs(Number(after.total ?? 0) - expectedTotal) > 0.005) {
      const totalRes = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ total: expectedTotal.toFixed(2) }),
        cache: 'no-store',
      });
      if (!totalRes.ok) {
        console.warn(`[OrderCreate] COD fee recorded but order #${wooOrderId} total did not recalc and explicit total set failed (HTTP ${totalRes.status}).`);
      }
    }
    console.log(`[OrderCreate] COD delivery charge of ${codFeeRupees} INR recorded on order #${wooOrderId}.`);
  } catch (feeErr) {
    console.warn('[OrderCreate] Could not record COD fee line item:', feeErr);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, paymentMethod, customerNote, attribution } = body;

    if (!items || !items.length) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return NextResponse.json({ success: false, error: 'Missing customer shipping details' }, { status: 400 });
    }

    // Extract the browser user-agent for attribution context.
    //
    // SECURITY (P1): We deliberately do NOT read or forward a client-supplied
    // X-Forwarded-For / X-Real-IP to the WooCommerce Store API. That value is
    // controllable by the requester (a browser can send its own X-Forwarded-For),
    // so forwarding it would let a customer poison the IP WooCommerce records
    // for fraud detection and order attribution. The authoritative client IP is
    // the one the trusted edge/VPS proxy attaches to the real inbound
    // connection, which the Next.js server (and therefore the Store API calls
    // it makes) already presents directly. We rely on that instead.
    const headerUserAgent = req.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
    const headerReferer = req.headers.get('referer') || '';

    // Prepare complete WooCommerce 8.5+ Order Attribution payload
    const nowUtc = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const clientAttribution = attribution || {};

    const sourceType = clientAttribution.source_type || (
      clientAttribution.utm_source ? 'utm' :
      headerReferer.includes('google.') ? 'organic' :
      headerReferer && !headerReferer.includes('ayurrakshaonline.com') ? 'referral' :
      'typein'
    );

    const orderAttribution = {
      source_type: sourceType,
      referrer: clientAttribution.referrer || headerReferer || '(none)',
      utm_source: clientAttribution.utm_source || '(none)',
      utm_medium: clientAttribution.utm_medium || (sourceType === 'organic' ? 'organic' : sourceType === 'referral' ? 'referral' : '(none)'),
      utm_campaign: clientAttribution.utm_campaign || '(none)',
      utm_content: clientAttribution.utm_content || '(none)',
      utm_id: clientAttribution.utm_id || '(none)',
      utm_term: clientAttribution.utm_term || '(none)',
      utm_source_platform: clientAttribution.utm_source_platform || '(none)',
      utm_creative_format: clientAttribution.utm_creative_format || '(none)',
      utm_marketing_tactic: clientAttribution.utm_marketing_tactic || '(none)',
      session_entry: clientAttribution.session_entry || 'https://www.ayurrakshaonline.com/',
      session_start_time: clientAttribution.session_start_time || nowUtc,
      session_pages: String(clientAttribution.session_pages || '1'),
      session_count: String(clientAttribution.session_count || '1'),
      user_agent: clientAttribution.user_agent || headerUserAgent,
    };

    const resolvedItems = await Promise.all(items.map(async (item: any) => {
      const bundled = getProductById(item.product?.id || item.id);
      const slug = bundled?.slug || item.product?.slug || item.slug;
      const product = typeof slug === 'string' ? await fetchCmsCommerce(slug) : null;
      if (!product?.inStock || !Number.isInteger(item.quantity) || item.quantity < 1) return null;

      // Resolve the WooCommerce id/price to book this line against. A variable
      // product MUST be booked against a live variation id — sending the
      // parent id makes the Store API reject the whole order. When the cart
      // item carries no (or a stale) variantId we fall back to the default
      // in-stock live variation so the order still records; an explicitly
      // requested out-of-stock pack still rejects. Rule lives in
      // lib/orderItemResolution (shared, unit-tested).
      const target = resolveItemVariant(product.type, product.variantDetails, item.variantId);
      if (!target) return null;

      return {
        id: target.useParent ? product.cmsProductId : target.variantId,
        name: product.name,
        variantName: target.useParent ? undefined : target.label,
        quantity: item.quantity as number,
        price: (target.useParent ? undefined : target.price) ?? product.price,
        isComboItem: item.isComboItem === true,
      };
    }));
    const orderItems = resolvedItems.filter((item): item is NonNullable<typeof item> => item !== null);
    if (orderItems.length !== items.length) {
      return NextResponse.json({ success: false, error: 'An item is unavailable or has an invalid quantity. Please refresh your cart.' }, { status: 400 });
    }

    // Combo Builder Volume Discount — a real WooCommerce percent coupon applied
    // to the cart below, so the backend order total matches the front-end charge.
    // Gated on combo-builder items only; the tier is chosen from the combo-item
    // subtotal (the same rule as the front-end, shared via lib/comboPricing).
    const comboSubtotalPaise = computeComboSubtotalPaise(orderItems);
    const comboTier = comboCouponFor(comboSubtotalPaise);
    const comboCoupon = comboTier?.coupon ?? null;
    const comboCouponPercent = comboTier?.percent ?? 0;
    let enhancedNote = customerNote || '';
    if (comboCoupon) {
      enhancedNote += ` | Combo Volume Discount: ${comboCoupon} (${comboCouponPercent}% OFF applied)`;
    }
    const timestamp = Date.now();

    // Step 1: Initialize Fresh WooCommerce Cart Session
    // Bypass Hostinger LiteSpeed cache with no-cache headers and timestamp
    const clientUserAgent = clientAttribution.user_agent || headerUserAgent;
    // No client-supplied IP headers are forwarded to WooCommerce (see security
    // note above). The Store API calls inherit the real inbound connection IP
    // from the server's trusted proxy layer.

    const cartInitRes = await fetch(`${WORDPRESS_STORE_API}/cart?_nocache=${timestamp}`, {
      method: 'GET',
      headers: {
        'User-Agent': clientUserAgent,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
    });

    let nonce = cartInitRes.headers.get('Nonce') || '';
    let cartToken = cartInitRes.headers.get('Cart-Token') || '';

    // Step 2: Clear any leftover items in this cart session to prevent accumulation
    try {
      const clearRes = await fetch(`${WORDPRESS_STORE_API}/cart/items?_nocache=${Date.now()}`, {
        method: 'DELETE',
        headers: {
          'User-Agent': clientUserAgent,
          'Nonce': nonce,
          'Cart-Token': cartToken,
        },
        cache: 'no-store',
      });
      if (clearRes.headers.get('Nonce')) nonce = clearRes.headers.get('Nonce') || nonce;
      if (clearRes.headers.get('Cart-Token')) cartToken = clearRes.headers.get('Cart-Token') || cartToken;
    } catch (clearErr) {
      console.warn('Could not clear cart session items:', clearErr);
    }

    // Step 3: Add the order items using resolved live CMS product IDs
    const itemManifest: string[] = [];
    for (const item of orderItems) {
      const variantName = item.variantName ? ` (${item.variantName})` : '';
      itemManifest.push(`${item.name}${variantName} x ${item.quantity}`);

      const addRes = await fetch(`${WORDPRESS_STORE_API}/cart/add-item?_nocache=${Date.now()}`, {
        method: 'POST',
        headers: {
          'User-Agent': clientUserAgent,
          'Content-Type': 'application/json',
          'Nonce': nonce,
          'Cart-Token': cartToken,
        },
        body: JSON.stringify({
          id: item.id,
          quantity: item.quantity,
        }),
        cache: 'no-store',
      });

      if (addRes.headers.get('Nonce')) nonce = addRes.headers.get('Nonce') || nonce;
      if (addRes.headers.get('Cart-Token')) cartToken = addRes.headers.get('Cart-Token') || cartToken;

      if (!addRes.ok) {
        throw new Error(`WooCommerce could not add product ${item.id} to the cart`);
      }
    }

    // Split name into first and last. WooCommerce's Store API validates
    // addresses and rejects the checkout when last_name is an empty string
    // (woocommerce_rest_invalid_address: "Last name is required"). Customers who
    // enter a single-word name leave last_name empty, which silently blocks the
    // order from being recorded in the backend. Fall back to the first name so
    // last_name is never empty and the order always lands in WooCommerce.
    const nameParts = (customer.name || '').trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || firstName;

    const stateCode = STATE_CODE_MAP[customer.state] || customer.state || 'TN';

    // Step 4: Update customer address on cart to calculate shipping rates and enable COD
    try {
      const updateCustRes = await fetch(`${WORDPRESS_STORE_API}/cart/update-customer?_nocache=${Date.now()}`, {
        method: 'POST',
        headers: {
          'User-Agent': clientUserAgent,
          'Content-Type': 'application/json',
          'Nonce': nonce,
          'Cart-Token': cartToken,
        },
        body: JSON.stringify({
          shipping_address: {
            first_name: firstName,
            last_name: lastName,
            address_1: customer.address,
            city: customer.city,
            state: stateCode,
            postcode: customer.pincode,
            country: 'IN',
            phone: customer.phone,
          },
          billing_address: {
            first_name: firstName,
            last_name: lastName,
            address_1: customer.address,
            city: customer.city,
            state: stateCode,
            postcode: customer.pincode,
            country: 'IN',
            email: customer.email || 'orders@ayurrakshaonline.com',
            phone: customer.phone,
          },
        }),
        cache: 'no-store',
      });
      if (updateCustRes.headers.get('Nonce')) nonce = updateCustRes.headers.get('Nonce') || nonce;
      if (updateCustRes.headers.get('Cart-Token')) cartToken = updateCustRes.headers.get('Cart-Token') || cartToken;
    } catch (custErr) {
      console.warn('Customer update error:', custErr);
    }

    // Step 4b: Apply the Combo Builder volume-discount coupon so the backend
    // order total matches the front-end charge. The WooCommerce percent coupon
    // is enforced by the store (min-spend + percent), and we read the cart back
    // to verify it actually applied. If it did not, abort: we never book a
    // full-price order for a customer who was charged the discounted amount.
    let lastVerifiedCartData: any = null;
    if (comboCoupon) {
      const applyRes = await fetch(`${WORDPRESS_STORE_API}/cart/apply-coupon?_nocache=${Date.now()}`, {
        method: 'POST',
        headers: {
          'User-Agent': clientUserAgent,
          'Content-Type': 'application/json',
          'Nonce': nonce,
          'Cart-Token': cartToken,
        },
        body: JSON.stringify({ code: comboCoupon }),
        cache: 'no-store',
      });

      if (applyRes.headers.get('Nonce')) nonce = applyRes.headers.get('Nonce') || nonce;
      if (applyRes.headers.get('Cart-Token')) cartToken = applyRes.headers.get('Cart-Token') || cartToken;

      if (!applyRes.ok) {
        const errData = await applyRes.json().catch(() => ({}));
        console.error('WooCommerce coupon apply error:', errData);
        throw new Error(`WooCommerce could not apply coupon ${comboCoupon}`);
      }

      const cartVerify = await fetch(`${WORDPRESS_STORE_API}/cart?_nocache=${Date.now()}`, {
        method: 'GET',
        headers: {
          'User-Agent': clientUserAgent,
          'Accept': 'application/json',
          'Nonce': nonce,
          'Cart-Token': cartToken,
        },
        cache: 'no-store',
      });
      const cartData = await cartVerify.json().catch(() => null);
      lastVerifiedCartData = cartData;
      const appliedCodes: string[] = Array.isArray(cartData?.coupons)
        ? cartData.coupons.map((c: any) => String(c?.code || '').toUpperCase())
        : [];
      const discountPaise = Number(cartData?.totals?.total_discount ?? 0);
      if (
        !appliedCodes.includes(comboCoupon.toUpperCase()) ||
        !Number.isFinite(discountPaise) ||
        discountPaise <= 0
      ) {
        console.error('Combo coupon did not register on the cart:', {
          coupon: comboCoupon,
          appliedCodes,
          discountPaise,
        });
        throw new Error('Could not apply the combo discount; order not placed.');
      }
    }

    // Step 4c: Capture the cart's discounted total in paise BEFORE checkout.
    // This is the authoritative charge for prepaid orders: the WooCommerce
    // store has already computed items + combo-coupon discount (+ free
    // shipping) on the live cart, so this paise total is exactly what the
    // front-end promised and what the backend order books. The front-end rule
    // (item subtotal − combo discount, shared lib/comboPricing) is only the
    // fallback when the cart is unreadable.
    //
    // NOTE: the Store API POST /checkout response only carries
    // { id, status, payment_result, payment_result_meta_data } — no money
    // fields at all. The old code read `orderData.totals?.total_price` from
    // it, always got 0, and silently fell back to the full undiscounted item
    // sum, which is what overcharged prepaid customers (₹8,000 instead of
    // ₹6,800). Computing the amount here, from the cart, fixes it.
    let preCheckoutCart = lastVerifiedCartData;
    if (!preCheckoutCart) {
      const preCheckoutCartRes = await fetch(`${WORDPRESS_STORE_API}/cart?_nocache=${Date.now()}`, {
        method: 'GET',
        headers: {
          'User-Agent': clientUserAgent,
          'Accept': 'application/json',
          'Nonce': nonce,
          'Cart-Token': cartToken,
        },
        cache: 'no-store',
      });
      preCheckoutCart = await preCheckoutCartRes.json().catch(() => null);
    }
    const cartTotalPaise = Number(preCheckoutCart?.totals?.total_price ?? 0);
    const itemSubtotalPaise = Math.round(
      orderItems.reduce((acc, it) => acc + (Number(it.price) * it.quantity), 0) * 100,
    );
    const comboDiscountPaise = Math.round(comboDiscountRupees(comboSubtotalPaise) * 100);
    // Authoritative discounted paise: prefer the live cart total, fall back
    // to the front-end rule (itemSubtotal − comboDiscount).
    const effectiveDiscountedPaise = Number.isFinite(cartTotalPaise) && cartTotalPaise > 0
      ? cartTotalPaise
      : Math.max(0, itemSubtotalPaise - comboDiscountPaise);

    // Step 5: Execute Checkout on WooCommerce Store API with native Order Attribution extension
    const originLabel =
      orderAttribution.source_type === 'utm'
        ? `Campaign (${orderAttribution.utm_source}${orderAttribution.utm_campaign && orderAttribution.utm_campaign !== '(none)' ? ' / ' + orderAttribution.utm_campaign : ''})`
        : orderAttribution.source_type === 'organic'
        ? `Organic Search (${orderAttribution.utm_source})`
        : orderAttribution.source_type === 'referral'
        ? `Referral (${orderAttribution.referrer})`
        : 'Direct (Storefront)';

    const formattedNote = [
      enhancedNote ? `Notes & Discounts: ${enhancedNote}` : '',
      `Order Items: ${itemManifest.join(', ')}`,
      `Payment Mode: ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid Online (Razorpay)'}`,
      `Origin: ${originLabel}`,
      'Channel: AyurRaksha Storefront',
    ].filter(Boolean).join(' | ');

    const checkoutPayload = {
      billing_address: {
        first_name: firstName,
        last_name: lastName,
        address_1: customer.address,
        city: customer.city,
        state: stateCode,
        postcode: customer.pincode,
        country: 'IN',
        email: customer.email || 'orders@ayurrakshaonline.com',
        phone: customer.phone,
      },
      shipping_address: {
        first_name: firstName,
        last_name: lastName,
        address_1: customer.address,
        city: customer.city,
        state: stateCode,
        postcode: customer.pincode,
        country: 'IN',
        phone: customer.phone,
      },
      payment_method: paymentMethod === 'cod' ? 'cod' : 'razorpay',
      customer_note: formattedNote,
      extensions: {
        'woocommerce/order-attribution': orderAttribution,
      },
    };

    const checkoutRes = await fetch(`${WORDPRESS_STORE_API}/checkout?_nocache=${Date.now()}`, {
      method: 'POST',
      headers: {
        'User-Agent': clientUserAgent,
        'Content-Type': 'application/json',
        'Nonce': nonce,
        'Cart-Token': cartToken,
      },
      body: JSON.stringify(checkoutPayload),
      cache: 'no-store',
    });

    if (!checkoutRes.ok) {
      const errData = await checkoutRes.json().catch(() => ({}));
      console.error('WooCommerce checkout error:', errData);
      throw new Error(errData.message || `WooCommerce returned status ${checkoutRes.status}`);
    }

    const orderData = await checkoutRes.json();

    // The WooCommerce Store API checkout response is minimal: { id, status,
    // payment_result, payment_result_meta_data }. The numeric order id lives
    // at `id` — there is NO order_id / order_number / totals in this
    // response, so the full order (order number, order key, fee lines) must
    // be fetched via the authenticated WC REST API below.
    const checkoutOrderId =
      Number(orderData.id ?? orderData.order_id ?? 0) || null;

    const ck = process.env.WC_CONSUMER_KEY;
    const cs = process.env.WC_CONSUMER_SECRET;
    let restOrder: any = null;
    if (checkoutOrderId && ck && cs) {
      try {
        const restAuth = `Basic ${Buffer.from(`${ck}:${cs}`).toString('base64')}`;
        const getRes = await fetch(`${WORDPRESS_BASE}/wp-json/wc/v3/orders/${checkoutOrderId}`, {
          headers: {
            'Authorization': restAuth,
            'Content-Type': 'application/json',
            'User-Agent': 'AyurRaksha-NextJS/1.0',
            'Accept': 'application/json',
          },
          cache: 'no-store',
        });
        if (getRes.ok) restOrder = await getRes.json().catch(() => null);
      } catch (restErr) {
        console.warn('[OrderCreate] Could not fetch full order via WC REST:', restErr);
      }
    }

    // COD delivery charge: the front-end shows the customer a COD total that
    // includes the ₹100 fee, but the WooCommerce order only carries the
    // (discounted) product total, so the backend order would read ₹100 short
    // of what the customer actually pays in cash at the doorstep. Record the
    // fee as an explicit fee line item so the backend order reconciles with
    // the cash amount due.
    if (paymentMethod === 'cod' && checkoutOrderId) {
      await recordCodFeeLineItem(checkoutOrderId, SITE_CONFIG.shipping.codFee, clientUserAgent, restOrder);
    }

    const orderNumber = restOrder?.number != null
      ? String(restOrder.number)
      : checkoutOrderId
        ? String(checkoutOrderId)
        : String(orderData.order_id ?? orderData.id ?? 'unknown');

    // If paying via Razorpay, pre-create a Razorpay Order so the client SDK
    // binds to the exact amount and returns razorpay_order_id and razorpay_signature
    // on success (enabling server-side HMAC signature verification).
    let razorpayOrderId: string | null = null;
    let razorpayAmount: number | null = null;

    if (paymentMethod === 'razorpay') {
      const rzpKey = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_kWyXoOFkrDjUBk';
      const rzpSecret = process.env.RAZORPAY_SECRET_KEY;

      // Charge the discounted amount the front-end promised. Authoritative
      // source is the live cart total read in Step 4c (the combo coupon is
      // already applied, so it is the post-discount paise total the customer
      // will pay; prepaid delivery is free, so no shipping is added). The
      // front-end rule (item subtotal − combo discount) is only the fallback.
      // The old code read `orderData.totals?.total_price` — a field that does
      // not exist on the checkout response — and silently fell back to the
      // full undiscounted item sum, which is what overcharged prepaid
      // customers (₹8,000 instead of ₹6,800).
      const totalPaise = effectiveDiscountedPaise;

      if (rzpKey && rzpSecret && totalPaise > 0) {
        try {
          const auth = Buffer.from(`${rzpKey}:${rzpSecret}`).toString('base64');
          const rzpOrderRes = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
              'User-Agent': 'AyurRaksha-NextJS/1.0',
            },
            body: JSON.stringify({
              amount: totalPaise,
              currency: 'INR',
              receipt: orderNumber,
              notes: {
                woocommerce_order_id: String(checkoutOrderId ?? ''),
                woocommerce_order_number: orderNumber,
              },
            }),
          });

          if (rzpOrderRes.ok) {
            const rzpOrderData = await rzpOrderRes.json();
            razorpayOrderId = rzpOrderData.id;
            razorpayAmount = rzpOrderData.amount;
          } else {
            console.warn('[OrderCreate] Razorpay order creation returned status', rzpOrderRes.status, await rzpOrderRes.text().catch(() => ''));
          }
        } catch (rzpErr) {
          console.warn('[OrderCreate] Could not pre-create Razorpay order:', rzpErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderId: checkoutOrderId,
      orderNumber,
      orderKey: restOrder?.order_key ?? orderData.order_key,
      status: orderData.status ?? restOrder?.status,
      paymentResult: orderData.payment_result,
      razorpayOrderId,
      razorpayAmount,
      source: 'woocommerce_store_api',
    });
  } catch (error: any) {
    console.error('Error creating order in WooCommerce:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to record order in WooCommerce',
    }, { status: 500 });
  }
}
