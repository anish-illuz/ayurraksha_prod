import type { Product } from '@/types/product';

/**
 * Strict resolver for the WordPress ACF `recommended_products` field.
 *
 * The field holds free text: the editor types the names of the products they
 * picked for the product being viewed, e.g.
 *   "AyurRaksha Skin Conditioning Oil AyurRaksha SkinWell Soap"
 *
 * That text rarely matches catalog `name` values exactly (the editor writes
 * "AyurRaksha Sleep Well Capsules" for the catalog product "Sleep Well Food
 * Supplement Capsules"), so each catalog product carries a signature of
 * token sequences that identify it. A product is returned ONLY when every
 * one of its signature groups is present in the CMS text:
 *
 *   - each group is a list of alternative token sequences (a space inside a
 *     sequence means the tokens must sit next to each other, "b pain");
 *   - ALL groups of a signature must be satisfied;
 *   - groups are AND-ed so partial mentions of a different product (e.g.
 *     "cream" inside "SP Soryn Cream") can never leak a second product in.
 *
 * The ACF field is the single source of truth for the PDP's Recommended
 * Products section: nothing is filled in from related products, bestsellers,
 * recently viewed, category or tag matches. A mention that resolves to no
 * catalog product (e.g. "AyurRaksha Breathe Well Pack", not in the catalog)
 * is dropped silently, and an empty field returns an empty array so the
 * section hides itself.
 *
 * Results keep the order the products appear in the CMS text. New catalog
 * products without a table entry fall back to a signature derived from
 * their name, so explicit selections keep resolving without editing this
 * file; extend SIGNATURES when a product needs looser matching.
 */

/** Brand words that never identify a product on their own. */
const BRAND_TOKENS = new Set([
  'ayur', 'raksha', 'organics', 'organic', 'ayurvedic',
]);

/** Form-factor / marketing words that never identify a product on their own. */
const GENERIC_TOKENS = new Set([
  'tea', 'oil', 'cream', 'powder', 'tonic', 'capsule', 'capsules',
  'tablet', 'tablets', 'soap', 'shampoo', 'food', 'supplement',
  'supplements', 'pack', 'tin', 'tins', 'pcs', 'box', 'boxes',
  'roll', 'on', 'well', 'bath', 'herbal',
]);

/**
 * AND-groups of OR-alternatives per storefront slug. A group's alternatives
 * are token sequences in the (lower-cased, symbol-stripped) CMS text.
 */
const SIGNATURES: Record<string, string[][]> = {
  'boozliv': [['boozliv']],
  'booznil': [['booznil']],
  'divine-healing-oil': [['divine']],
  'ayurraksha-detox-tea': [['detox']],
  'migro-prime-tablets': [['migro']],
  'etioment-pain-relief-roll-on-50ml': [['roll'], ['etioment', 'etionment']],
  'etionment-pain-relief-cream': [['cream', 'balm'], ['etioment', 'etionment']],
  'ayur-raksha-superheal-o3-cream': [['superheal']],
  'ayur-raksha-dant-swasthya': [['dant', 'swasthya']],
  'ayur-raksha-premium-high-fiber-health-mix': [['fiber']],
  'ayur-raksha-gargling-oil': [['gargling']],
  'ayur-raksha-alg': [['alg']],
  'ayur-raksha-creat-capsules': [['creat']],
  'ayur-raksha-imu-360': [['imu']],
  'bpain-out-capsules': [['bpain', 'b pain']],
  'ayur-raksha-herbal-shampoo': [['shampoo']],
  'hair-well-food-supplement-capsules': [['hair'], ['well']],
  'ayur-raksha-skin-conditioning-oil': [['skin'], ['conditioning']],
  'sp-soryn-cream': [['soryn']],
  'b-derma-capsules': [['derma']],
  'ayur-raksha-skin-well-food-moisturising-gel': [['moisturising', 'moisturizing']],
  'ayur-raksha-beta-powder': [['beta']],
  'dia-well-food-supplement-capsules': [['dia']],
  'b-gasonil': [['gasonil']],
  // "skin well" alone is shared with the Moisturising Gel family, so the
  // supplement/capsules group is required on top of "skin" + "well".
  'skin-well-food-supplement-capsules': [['skin'], ['well'], ['supplement', 'capsules']],
  'ayur-raksha-skinwell-soap-pack-of-2': [['skinwell']],
  'flow-well-food-supplement-capsules': [['flow']],
  'organics-laxahealth-tea-tin': [['laxa', 'laxahealth']],
  'purna-sakthi-tonic': [['purna', 'sakthi']],
  'esnovate-immunity-boosting-capsules': [['esnovate']],
  'dhayani-herbal-hair-oil-100ml': [['dhayani']],
  'organics-herbo-protein-powder': [['herbo', 'protein']],
  'organics-hibiscus-tea-tin': [['hibiscus']],
  'pi-well-food-supplement-capsules': [['pi'], ['well']],
  'sleep-well-food-supplement-capsules': [['sleep']],
  'ayurraksha-kalonji-soap': [['kalonji']],
  'ayurraksha-vital-o3-anti-vitiligo-cream': [['vital', 'vitiligo']],
  'ayurraksha-immuno3-immunity-booster-capsules': [['immuno', 'immune']],
  'ayur-raksha-foot-bath-powder': [['foot']],
  'save-heart': [['save', 'heart']],
};

/** Lower-case tokens of a raw string, symbols stripped. */
function tokensOf(value: string): string[] {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean);
}

/**
 * Fallback signature for catalog products not in SIGNATURES: every
 * distinctive word of the name (and slug) becomes a required group, which
 * is the conservative choice - it can miss a heavily abbreviated mention,
 * but it can never add a product the editor did not select.
 */
function autoSignature(product: Product): string[][] {
  const seen = new Set<string>();
  const words: string[] = [];
  for (const token of [...tokensOf(product.name), ...tokensOf(product.slug)]) {
    if (seen.has(token)) continue;
    seen.add(token);
    if (token.length < 3) continue;
    if (/^\d+$/.test(token)) continue;
    if (BRAND_TOKENS.has(token)) continue;
    if (GENERIC_TOKENS.has(token)) continue;
    words.push(token);
  }
  return words.map((w) => [w]);
}

function sequenceAt(tokens: string[], start: number, seq: string[]): boolean {
  if (start + seq.length > tokens.length) return false;
  for (let i = 0; i < seq.length; i += 1) {
    if (tokens[start + i] !== seq[i]) return false;
  }
  return true;
}

export function matchRecommendedProducts(
  recommendedText: string | undefined,
  catalog: Product[],
  currentProduct: Product | undefined,
  limit = 4
): Product[] {
  const raw = (recommendedText || '').trim();
  if (!raw) return [];

  const tokens = tokensOf(raw);
  if (tokens.length === 0) return [];

  const hits: { product: Product; pos: number; strength: number }[] = [];

  for (const product of catalog) {
    if (currentProduct && product.id === currentProduct.id) continue;

    const signature = SIGNATURES[product.slug] ?? autoSignature(product);
    if (signature.length === 0) continue; // nothing distinctive to verify

    let firstPos = -1;
    let strength = 0;
    let matched = true;

    for (const group of signature) {
      let groupPos = -1;
      for (const alternative of group) {
        const seq = alternative.split(' ');
        for (let i = 0; i + seq.length <= tokens.length; i += 1) {
          if (sequenceAt(tokens, i, seq)) {
            groupPos = i;
            break;
          }
        }
        if (groupPos !== -1) break;
      }
      if (groupPos === -1) {
        matched = false;
        break;
      }
      strength += 1;
      if (firstPos === -1 || groupPos < firstPos) firstPos = groupPos;
    }

    if (matched) {
      hits.push({ product, pos: firstPos, strength });
    }
  }

  // Selection order from the CMS field; break ties by signature strength.
  hits.sort(
    (a, b) => a.pos - b.pos || b.strength - a.strength || a.product.id - b.product.id
  );

  return hits.slice(0, limit).map((h) => h.product);
}
