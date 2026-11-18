/**
 * Formats pack sizes and measurements so that quantities and units (e.g. 100g, 250g, 50ml)
 * never break across lines.
 */
export function formatPackMeasurement(text?: string): string {
  if (!text) return '';
  // Replace loose spaces between number and unit with non-breaking space
  return text
    .replace(/(\d+)\s*(g|kg|ml|mg|l|gm|gms)\b/gi, '$1 $2')
    .replace(/\s*×\s*/g, ' × ');
}

/**
 * Extracts a concise pack-size badge for small thumbnail tiles (e.g. "40 Sachets (5g)")
 */
export function getCompactPackBadge(specNetQuantity?: string): string {
  if (!specNetQuantity) return 'Pre-Measured';
  // e.g. "40 sachets × 5g = 200g" -> "40 Sachets (5g)" or "40 Sachets"
  const parts = specNetQuantity.split('=');
  const primary = parts[0]?.trim();
  if (primary) {
    return primary.replace(/(\d+)\s*(g|kg|ml|mg|l|gm|gms)\b/gi, '$1$2');
  }
  return specNetQuantity;
}

/**
 * Parses ACF `product_specifications` from WordPress backend
 * (cms.ayurrakshaonline.com) and extracts the appropriate pack/size/form badge.
 * If no specification data is available, returns null so the UI can hide the element.
 */
export function getProductSpecBadge(product?: {
  productSpecifications?: string;
  acf?: { product_specifications?: string };
}): string | null {
  if (!product) return null;
  const rawText = (product.acf?.product_specifications || product.productSpecifications || '').trim();
  if (!rawText) return null;

  const text = rawText.replace(/\s+/g, ' ').trim();
  const multiWordLabels =
    'Product Type|Product Form|Net Quantity|Country of Origin|Shelf Life|Pack Size|Form Factor|Storage Method|Product name|Product type';
  const labelRegex = new RegExp(`((?:${multiWordLabels})|[A-Z][A-Za-z0-9]{1,19})\\s*:\\s*`, 'gi');

  const markers: { label: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = labelRegex.exec(text)) !== null) {
    markers.push({ label: m[1].trim(), start: m.index, end: m.index + m[0].length });
  }

  const rows: { label: string; value: string }[] = [];
  if (markers.length > 0) {
    markers.forEach((mk, i) => {
      const valueEnd = i + 1 < markers.length ? markers[i + 1].start : text.length;
      const value = text.slice(mk.end, valueEnd).replace(/^[,\s]+|[,\.;\s]+$/g, '').trim();
      if (mk.label && value) rows.push({ label: mk.label, value });
    });
  }

  if (rows.length > 0) {
    // 1. Prioritize Net Quantity or Pack Size if provided in the specification
    const qty = rows.find((r) => /^(Net\s*Quantity|Pack\s*Size|Quantity)$/i.test(r.label));
    if (qty && qty.value) {
      return formatPackMeasurement(qty.value);
    }

    // 2. Product Form or Form
    const form = rows.find((r) => /^(Product\s*Form|Form)$/i.test(r.label));
    if (form && form.value) {
      // Ignore placeholder text like "To be confirmed"
      if (/to be confirmed/i.test(form.value)) return null;
      return form.value;
    }
  }

  // 3. If direct short string without key-value colons
  if (!text.includes(':') && text.length > 0 && text.length <= 40 && !/swish|inhale|swallow|external/i.test(text)) {
    return formatPackMeasurement(text);
  }

  return null;
}

