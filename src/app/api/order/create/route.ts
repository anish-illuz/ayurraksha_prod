import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/products';

const WORDPRESS_STORE_API = 'https://www.ayurrakshaonline.com/wp-json/wc/store/v1';

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

    for (const item of items) {
      const product = getProductById(item.product?.id || item.id);
      const variant = product?.variants.find(v => v.id === item.variantId || v.name === item.selectedVariant) || product?.variants.find(v => v.default) || product?.variants[0];
      if (!product?.inStock || variant?.inStock === false || !Number.isInteger(item.quantity) || item.quantity < 1) {
        return NextResponse.json({ success: false, error: 'An item is unavailable or has an invalid quantity. Please refresh your cart.' }, { status: 400 });
      }
      if ((item.variantId && item.variantId !== variant?.id) || (item.selectedVariant && item.selectedVariant !== variant?.name)) {
        return NextResponse.json({ success: false, error: 'The selected pack is no longer available.' }, { status: 400 });
      }
    }
    const timestamp = Date.now();

    // Step 1: Initialize Fresh WooCommerce Cart Session
    // We add a unique timestamp query parameter and no-cache headers to bypass Hostinger LiteSpeed cache
    const cartInitRes = await fetch(`${WORDPRESS_STORE_API}/cart?_nocache=${timestamp}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'AyurRaksha-Storefront/2.0',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
    });

    let nonce = cartInitRes.headers.get('Nonce') || '';
    let cartToken = cartInitRes.headers.get('Cart-Token') || '';

    // Step 2: Clear any leftover items in this cart session to PREVENT double amounts
    // (Crucial: prevents previous checkout attempts from accumulating in the same WooCommerce cart)
    try {
      const clearRes = await fetch(`${WORDPRESS_STORE_API}/cart/items?_nocache=${Date.now()}`, {
        method: 'DELETE',
        headers: {
          'User-Agent': 'AyurRaksha-Storefront/2.0',
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

    // Step 3: Add exactly the current order items to WooCommerce cart session
    for (const item of items) {
      const productId = item.product?.id || item.id;
      const product = getProductById(productId)!;
      const variant = product.variants.find(v => v.id === item.variantId || v.name === item.selectedVariant) || product.variants.find(v => v.default) || product.variants[0];
      const targetId = variant?.id || productId;
      const quantity = item.quantity || 1;

      const addRes = await fetch(`${WORDPRESS_STORE_API}/cart/add-item?_nocache=${Date.now()}`, {
        method: 'POST',
        headers: {
          'User-Agent': 'AyurRaksha-Storefront/2.0',
          'Content-Type': 'application/json',
          'Nonce': nonce,
          'Cart-Token': cartToken,
        },
        body: JSON.stringify({
          id: targetId,
          quantity: quantity,
        }),
        cache: 'no-store',
      });

      if (addRes.headers.get('Nonce')) nonce = addRes.headers.get('Nonce') || nonce;
      if (addRes.headers.get('Cart-Token')) cartToken = addRes.headers.get('Cart-Token') || cartToken;

      if (!addRes.ok) {
        const error = await addRes.json().catch(() => ({}));
        return NextResponse.json({ success: false, error: error.message || 'A selected item is no longer available. Please review your cart.' }, { status: 409 });
      }
    }

    // Split name into first and last
    const nameParts = (customer.name || '').trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '';

    const stateCode = STATE_CODE_MAP[customer.state] || customer.state || 'TN';

    // Step 4: Execute Checkout on WooCommerce Store API
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
      customer_note: customerNote || 'Order placed via AyurRaksha Next.js storefront',
    };

    const checkoutRes = await fetch(`${WORDPRESS_STORE_API}/checkout?_nocache=${Date.now()}`, {
      method: 'POST',
      headers: {
        'User-Agent': 'AyurRaksha-Storefront/2.0',
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
    // Graceful fallback order number so user is never blocked
    const fallbackNumber = `WC-${Date.now().toString().slice(-6)}`;
    return NextResponse.json({
      success: false,
      fallbackOrderNumber: fallbackNumber,
      error: error.message || 'Failed to record order in WooCommerce',
    }, { status: 500 });
  }
}
