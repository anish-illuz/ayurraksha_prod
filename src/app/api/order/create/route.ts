import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/products';

const WORDPRESS_BASE = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.ayurrakshaonline.com';
const WORDPRESS_STORE_API = `${WORDPRESS_BASE}/wp-json/wc/store/v1`;

// Comprehensive mapping from storefront product slugs/IDs to live WooCommerce product IDs on cms.ayurrakshaonline.com
const CMS_PRODUCT_ID_MAP: Record<string, number> = {
  // Individual formulations
  'ayurraksha-detox-tea': 85,
  'migro-prime-tablets': 86,
  'etioment-pain-relief-roll-on-50ml': 87,
  'ayur-raksha-superheal-o3-cream': 88,
  'ayurraksha-superheal-o3-cream': 88,
  'ayur-raksha-dant-swasthya': 89,
  'ayurraksha-dant-swasthya': 89,
  'ayur-raksha-premium-high-fiber-health-mix': 90,
  'ayurraksha-premium-high-fiber-health-mix': 90,
  'ayur-raksha-gargling-oil': 91,
  'ayurraksha-gargling-oil': 91,
  'ayur-raksha-alg': 92,
  'ayurraksha-alg': 92,
  'ayur-raksha-creat-capsules': 93,
  'ayurraksha-creat-capsules': 93,
  'ayur-raksha-imu-360': 94,
  'ayurraksha-imu-360': 94,
  'bpain-out-capsules': 95,
  'ayurraksha-bpain-out-capsules': 95,
  'ayur-raksha-herbal-shampoo': 96,
  'ayurraksha-herbal-shampoo': 96,
  'hair-well-food-supplement-capsules': 97,
  'ayurraksha-hair-well-food-supplement-capsules': 97,
  'ayur-raksha-skin-conditioning-oil': 98,
  'ayurraksha-skin-conditioning-oil': 98,
  'sp-soryn-cream': 99,
  'ayurraksha-sp-soryn-cream': 99,
  'b-derma-capsules': 100,
  'ayurraksha-b-derma-capsules': 100,
  'ayur-raksha-skin-well-food-moisturising-gel': 101,
  'ayurraksha-skin-well-food-moisturising-gel': 101,
  'ayur-raksha-beta-powder': 102,
  'ayurraksha-beta-powder': 102,
  'etionment-pain-relief-cream': 103,
  'etioment-balm': 103,
  'dia-well-food-supplement-capsules': 104,
  'b-gasonil': 105,
  'b-gasonil-capsules': 105,
  'booznil': 106,
  'skin-well-food-supplement-capsules': 107,
  'skin-well-capsules': 107,
  'save-heart': 108,
  'ayur-raksha-skinwell-soap-pack-of-2': 109,
  'skinwell-soap-pack-of-2': 109,
  'flow-well-food-supplement-capsules': 110,
  'flow-well-capsules': 110,
  'organics-laxahealth-tea-tin': 111,
  'laxa-health-tea-tin': 111,
  'purna-sakthi-tonic': 112,
  'purna-sakthi': 112,
  'divine-healing-oil': 113,
  'boozliv': 114,
  'esnovate-immunity-boosting-capsules': 115,
  'esnovate-capsules': 115,
  'dhayani-herbal-hair-oil-100ml': 116,
  'organics-herbo-protein-powder': 117,
  'herbo-protein-powder': 117,
  'organics-hibiscus-tea-tin': 118,
  'hibiscus-tea-tin': 118,
  'pi-well-food-supplement-capsules': 119,
  'sleep-well-food-supplement-capsules': 120,
  'sleep-well-capsules': 120,
  'ayurraksha-foot-bath-powder-300g': 121,
  'ayur-raksha-foot-bath-powder': 121,
  'ayurraksha-kalonji-soap': 122,
  'ayurraksha-vital-o3-anti-vitiligo-cream': 123,
  'ayurraksha-immuno3-immunity-booster-capsules': 124,
};

// Fallback product ID if a product cannot be mapped
const DEFAULT_CMS_PRODUCT_ID = 114; // BoozLiv

function resolveCmsProductId(item: any): number {
  const product = getProductById(item.product?.id || item.id);
  const slug = (item.product?.slug || product?.slug || item.slug || '').toLowerCase();

  if (slug && CMS_PRODUCT_ID_MAP[slug]) {
    return CMS_PRODUCT_ID_MAP[slug];
  }

  // Check if ID is already a valid CMS ID (between 85 and 124)
  const numericId = Number(item.product?.id || item.id);
  if (numericId >= 85 && numericId <= 124) {
    return numericId;
  }

  return DEFAULT_CMS_PRODUCT_ID;
}

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

    // Server-side validation of subtotal and volume tier discount
    const calculatedSubtotal = items.reduce((acc: number, item: any) => {
      const product = getProductById(item.product?.id || item.id);
      const price = item.variantPrice ?? product?.price ?? item.price ?? 0;
      return acc + price * (item.quantity || 1);
    }, 0);

    const serverTierPercent = calculatedSubtotal >= 5000 ? 15 : calculatedSubtotal >= 2000 ? 10 : 0;
    const serverTierDiscount = Math.round(calculatedSubtotal * (serverTierPercent / 100));

    // Append discount record to customer note for WooCommerce admin visibility
    let enhancedNote = customerNote || '';
    if (serverTierDiscount > 0) {
      enhancedNote += ` | Automatic Volume Discount: ${serverTierPercent}% OFF (-₹${serverTierDiscount}) [Subtotal: ₹${calculatedSubtotal}, Net: ₹${calculatedSubtotal - serverTierDiscount}]`;
    }

    for (const item of items) {
      const product = getProductById(item.product?.id || item.id);
      let variant: any;
      if (item.variantId) {
        // A variation was selected: it must match a real, in-stock variant of this product.
        variant = product?.variants?.find(v => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json({ success: false, error: 'An item in your cart is no longer available. Please refresh your cart.' }, { status: 400 });
        }
      } else if (product?.variants && product.variants.length > 0) {
        variant = product.variants.find(v => v.name === item.selectedVariant) || undefined;
      }
      if (!product?.inStock || variant?.inStock === false || !Number.isInteger(item.quantity) || item.quantity < 1) {
        return NextResponse.json({ success: false, error: 'An item is unavailable or has an invalid quantity. Please refresh your cart.' }, { status: 400 });
      }
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
    for (const item of items) {
      const product = getProductById(item.product?.id || item.id);
      const targetId = resolveCmsProductId(item);

      // item.quantity is already the physical pack quantity (e.g. 3 for 3-Month Family Regimen)
      const targetQuantity = item.quantity || 1;
      const itemName = product?.name || item.name || `Product #${targetId}`;
      const variantName = item.selectedVariant ? ` (${item.selectedVariant})` : '';
      itemManifest.push(`${itemName}${variantName} x ${targetQuantity}`);

      // The WooCommerce Store API selects a variation via its attribute map
      // (e.g. { pa_packs: "30-days-pack" }), not by variation id. Resolve it from
      // the matching variant in the catalog (which carries the synced attribute map).
      const matchedVariant = item.variantId
        ? product?.variants?.find((v) => v.id === item.variantId)
        : undefined;
      const variationAttributes: Record<string, string> | undefined =
        matchedVariant?.attributes && Object.keys(matchedVariant.attributes).length > 0
          ? matchedVariant.attributes
          : undefined;

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
          id: targetId,
          quantity: targetQuantity,
          ...(variationAttributes ? { attributes: variationAttributes } : {}),
        }),
        cache: 'no-store',
      });

      if (addRes.headers.get('Nonce')) nonce = addRes.headers.get('Nonce') || nonce;
      if (addRes.headers.get('Cart-Token')) cartToken = addRes.headers.get('Cart-Token') || cartToken;

      if (!addRes.ok) {
        console.warn(`Failed to add item ${targetId} to WooCommerce cart. Retrying with default product.`);
        // Graceful fallback to default CMS product so order is recorded in WooCommerce
        const fallbackRes = await fetch(`${WORDPRESS_STORE_API}/cart/add-item?_nocache=${Date.now()}`, {
          method: 'POST',
          headers: {
            'User-Agent': clientUserAgent,
            ...clientIpHeaders,
            'Content-Type': 'application/json',
            'Nonce': nonce,
            'Cart-Token': cartToken,
          },
          body: JSON.stringify({
            id: DEFAULT_CMS_PRODUCT_ID,
            quantity: targetQuantity,
            variation_id: 0,
          }),
          cache: 'no-store',
        });
        if (fallbackRes.headers.get('Nonce')) nonce = fallbackRes.headers.get('Nonce') || nonce;
        if (fallbackRes.headers.get('Cart-Token')) cartToken = fallbackRes.headers.get('Cart-Token') || cartToken;
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
    const fallbackNumber = `WC-${Date.now().toString().slice(-6)}`;
    return NextResponse.json({
      success: false,
      fallbackOrderNumber: fallbackNumber,
      error: error.message || 'Failed to record order in WooCommerce',
    }, { status: 500 });
  }
}
