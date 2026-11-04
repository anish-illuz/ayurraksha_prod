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
