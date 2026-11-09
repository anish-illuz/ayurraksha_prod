/**
 * Canonical CMS Product ID Resolution Mapping
 *
 * Maps storefront products (slugs and IDs) to their live WooCommerce product IDs (85-124)
 * on cms.ayurrakshaonline.com.
 *
 * This ensures 100% ID synchronization across:
 * 1. WooCommerce Backend
 * 2. Meta Product Catalogue (XML/CSV feed)
 * 3. Meta Pixel (ViewContent, AddToCart, InitiateCheckout, Purchase)
 * 4. Meta Conversions API (CAPI)
 */

export const CMS_PRODUCT_ID_MAP: Record<string, number> = {
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

  // Curated Combo Packs mapped to their primary flagship formulation on CMS
  'ayur-raksha-cardiac-combo': 108, // Save Heart
  'ayur-raksha-breathe-well-pack': 115, // Esnovate
  'ayur-raksha-join-well-pack': 113, // Divine Healing Oil
  'ayur-raksha-sleep-well-pack': 120, // Sleep Well
  'ayur-raksha-dia-well-pack': 104, // Dia Well
  'piles-well-pack': 119, // PI Well
  'flow-well-pack': 110, // Flow Well
  'skin-well-pack': 107, // Skin Well
};

const DEFAULT_CMS_PRODUCT_ID = 114; // BoozLiv flagship

/**
 * Resolves any storefront product reference into a stable WooCommerce CMS Product ID string.
 */
export function getCmsProductId(product: { id?: number; slug?: string } | null | undefined): string {
  if (!product) return String(DEFAULT_CMS_PRODUCT_ID);

  const slug = (product.slug || '').toLowerCase().trim();
  if (slug && CMS_PRODUCT_ID_MAP[slug]) {
    return String(CMS_PRODUCT_ID_MAP[slug]);
  }

  const numericId = Number(product.id);
  if (numericId >= 85 && numericId <= 124) {
    return String(numericId);
  }

  return String(DEFAULT_CMS_PRODUCT_ID);
}
