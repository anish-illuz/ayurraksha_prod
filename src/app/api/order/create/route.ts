import { NextResponse } from 'next/server';

const WORDPRESS_STORE_API = 'https://www.ayurrakshaonline.com/wp-json/wc/store/v1';

// Mapping for WooCommerce variable products to ensure add-to-cart succeeds
const VARIABLE_PRODUCT_MAP: Record<number, number> = {
  14561: 14562, // BPain Out Capsules
  11605: 17508, // Breathe Well Pack
  11457: 11474, // Dia Well Pack
  11803: 11810, // BoozNil
  7689: 9630,   // Ayur Raksha Divine Healing Oil
  7694: 7726,   // BoozLiv
  6381: 7618,   // Esnovate Immunity Boosting Capsules
  4673: 9252,   // Flow Well Pack
  4666: 10756,  // Ayur Raksha Skin Well Pack
};

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
    const { items, customer, paymentMethod, customerNote } = body;

    if (!items || !items.length) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return NextResponse.json({ success: false, error: 'Missing customer shipping details' }, { status: 400 });
    }

    // Step 1: Initialize WooCommerce Cart Session
    const cartInitRes = await fetch(`${WORDPRESS_STORE_API}/cart`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Ayurraksha-Storefront/2.0',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    let nonce = cartInitRes.headers.get('Nonce') || '';
    let cartToken = cartInitRes.headers.get('Cart-Token') || '';

    // Step 2: Add all items to WooCommerce cart session
    for (const item of items) {
      const productId = item.product?.id || item.id;
      const targetId = VARIABLE_PRODUCT_MAP[productId] || productId;
      const quantity = item.quantity || 1;

      const addRes = await fetch(`${WORDPRESS_STORE_API}/cart/add-item`, {
        method: 'POST',
        headers: {
          'User-Agent': 'Ayurraksha-Storefront/2.0',
          'Content-Type': 'application/json',
          'Nonce': nonce,
          'Cart-Token': cartToken,
        },
        body: JSON.stringify({
          id: targetId,
          quantity: quantity,
        }),
      });

      // Update session tokens if changed
      if (addRes.headers.get('Nonce')) nonce = addRes.headers.get('Nonce') || nonce;
      if (addRes.headers.get('Cart-Token')) cartToken = addRes.headers.get('Cart-Token') || cartToken;

      if (!addRes.ok) {
        // Fallback: retry with original product ID if mapping failed
        if (targetId !== productId) {
          await fetch(`${WORDPRESS_STORE_API}/cart/add-item`, {
            method: 'POST',
            headers: {
              'User-Agent': 'Ayurraksha-Storefront/2.0',
              'Content-Type': 'application/json',
              'Nonce': nonce,
              'Cart-Token': cartToken,
            },
            body: JSON.stringify({
              id: productId,
              quantity: quantity,
            }),
          });
        }
      }
    }

    // Split name into first and last
    const nameParts = (customer.name || '').trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '';

    const stateCode = STATE_CODE_MAP[customer.state] || customer.state || 'TN';

    // Step 3: Execute Checkout on WooCommerce Store API
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
      customer_note: customerNote || 'Order placed via Ayurraksha Next.js storefront',
    };

    const checkoutRes = await fetch(`${WORDPRESS_STORE_API}/checkout`, {
      method: 'POST',
      headers: {
        'User-Agent': 'Ayurraksha-Storefront/2.0',
        'Content-Type': 'application/json',
        'Nonce': nonce,
        'Cart-Token': cartToken,
      },
      body: JSON.stringify(checkoutPayload),
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
    // Graceful fallback order number so user is never blocked
    const fallbackNumber = `WC-${Date.now().toString().slice(-6)}`;
    return NextResponse.json({
      success: false,
      fallbackOrderNumber: fallbackNumber,
      error: error.message || 'Failed to record order in WooCommerce',
    }, { status: 500 });
  }
}
