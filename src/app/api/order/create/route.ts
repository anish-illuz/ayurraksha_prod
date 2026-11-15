import { NextResponse } from 'next/server';
import { fetchCmsCommerce } from '@/lib/cms';
import { getProductById } from '@/lib/products';

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, paymentMethod, customerNote, tierDiscount, tierDiscountPercent, attribution } = body;

    if (!items || !items.length) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return NextResponse.json({ success: false, error: 'Missing customer shipping details' }, { status: 400 });
    }

    // Extract client network and browser context for authentic order attribution
    const headerUserAgent = req.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
    const forwardedFor = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '';
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

      const variant = product.variantDetails.find((entry) => entry.id === item.variantId);
      if ((product.type === 'variable' || item.variantId !== undefined) && !variant?.inStock) return null;

      return {
        id: variant?.id ?? product.cmsProductId,
        name: product.name,
        variantName: variant?.variationLabel,
        quantity: item.quantity as number,
        price: variant?.price ?? product.price,
      };
    }));
    const orderItems = resolvedItems.filter((item): item is NonNullable<typeof item> => item !== null);
    if (orderItems.length !== items.length) {
      return NextResponse.json({ success: false, error: 'An item is unavailable or has an invalid quantity. Please refresh your cart.' }, { status: 400 });
    }

    const calculatedSubtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const serverTierPercent = calculatedSubtotal >= 5000 ? 15 : calculatedSubtotal >= 2000 ? 10 : 0;
    const serverTierDiscount = Math.round(calculatedSubtotal * (serverTierPercent / 100));
    let enhancedNote = customerNote || '';
    if (serverTierDiscount > 0) {
      enhancedNote += ` | Automatic Volume Discount: ${serverTierPercent}% OFF (-₹${serverTierDiscount}) [Subtotal: ₹${calculatedSubtotal}, Net: ₹${calculatedSubtotal - serverTierDiscount}]`;
    }
    const timestamp = Date.now();

    // Step 1: Initialize Fresh WooCommerce Cart Session
    // Bypass Hostinger LiteSpeed cache with no-cache headers and timestamp
    const clientUserAgent = clientAttribution.user_agent || headerUserAgent;
    const clientIpHeaders: Record<string, string> = clientIp
      ? { 'X-Forwarded-For': clientIp, 'X-Real-IP': clientIp }
      : {};

    const cartInitRes = await fetch(`${WORDPRESS_STORE_API}/cart?_nocache=${timestamp}`, {
      method: 'GET',
      headers: {
        'User-Agent': clientUserAgent,
        ...clientIpHeaders,
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
          ...clientIpHeaders,
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
          ...clientIpHeaders,
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

    // Split name into first and last
    const nameParts = (customer.name || '').trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '';

    const stateCode = STATE_CODE_MAP[customer.state] || customer.state || 'TN';

    // Step 4: Update customer address on cart to calculate shipping rates and enable COD
    try {
      const updateCustRes = await fetch(`${WORDPRESS_STORE_API}/cart/update-customer?_nocache=${Date.now()}`, {
        method: 'POST',
        headers: {
          'User-Agent': clientUserAgent,
          ...clientIpHeaders,
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
        ...clientIpHeaders,
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

    return NextResponse.json({
      success: true,
      orderId: orderData.order_id,
      orderNumber: orderData.order_number || String(orderData.order_id),
      orderKey: orderData.order_key,
      status: orderData.status,
      paymentResult: orderData.payment_result,
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
