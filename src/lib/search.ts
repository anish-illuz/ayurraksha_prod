/**
 * Typo-Tolerant Search & Smart Recommendation Engine
 *
 * Designed for Ayurvedic e-commerce search with:
 *  1. Exact & Substring Matching
 *  2. Damerau-Levenshtein Typo Tolerance (e.g. "Skinwel" -> "SkinWell", "Boozlv" -> "BoozLiv")
 *  3. Partial & Token-level Prefix Matching (e.g. "div heal" -> "Divine Healing Oil")
 *  4. Health Concern & Category Matching
 *  5. Smart Recommendations when exact queries are unavailable
 *  6. Catalog Hydration from cms.ayurrakshaonline.com
 */

import { Product } from '@/types/product';

export type SearchMatchType = 'exact' | 'typo' | 'partial' | 'related' | 'recommended';

export interface SearchResultItem {
  product: Product;
  matchType: SearchMatchType;
  matchReason?: string;
  score: number;
}

export interface SearchResponse {
  query: string;
  correctedQuery?: string;
  hasExactMatch: boolean;
  results: SearchResultItem[];
  suggestedAlternatives: SearchResultItem[];
}

/**
 * Standardize text for normalized comparison:
 * lowercases, strips special characters, normalizes multiple spaces.
 */
export function normalizeSearchToken(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Compute Damerau-Levenshtein distance between two strings
 * (supports insertions, deletions, substitutions, and adjacent transpositions).
 */
export function damerauLevenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const al = a.length;
  const bl = b.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= al; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let min = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition check
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        min = Math.min(min, matrix[i - 2][j - 2] + 1);
      }

      matrix[i][j] = min;
    }
  }

  return matrix[al][bl];
}

/**
 * Check if word 'queryWord' is a typo of 'targetWord'
 * Tolerates:
 * - 0 edits for length <= 2
 * - 1 edit for length between 3 and 6
 * - 2 edits for length >= 7
 */
export function isTypoMatch(queryWord: string, targetWord: string): boolean {
  if (queryWord === targetWord) return true;
  const qLen = queryWord.length;
  const tLen = targetWord.length;

  if (Math.abs(qLen - tLen) > 2) return false;
  if (qLen < 3) return queryWord === targetWord;

  const maxDistance = qLen >= 7 ? 2 : 1;
  const dist = damerauLevenshtein(queryWord, targetWord);
  return dist <= maxDistance;
}

/**
 * Common typo alias dictionary for brand & Ayurvedic terms to handle high-frequency mistakes
 */
const BRAND_SYNONYMS: Record<string, string[]> = {
  skinwell: ['skinwel', 'skinwelll', 'sknwell', 'skin wel', 'skinwel soap'],
  boozliv: ['boozlv', 'booz live', 'bozliv', 'boosliv', 'boozeliv'],
  divine: ['devine', 'divin', 'divne', 'healing oil'],
  migro: ['migroprime', 'migra', 'migrain', 'migraine', 'migro prime'],
  kalonji: ['kalongi', 'kalanji', 'kalonjee', 'black seed'],
  immuno3: ['immuno', 'imuno', 'immune', 'immunity booster', 'immuno 3'],
  vital: ['vittal', 'vitiligo', 'anti vitiligo', 'vital o3'],
  dhayani: ['dayani', 'dhyani', 'dahyani', 'herbal oil'],
  hibiscus: ['hibicus', 'hibiscos', 'hibiscus tea', 'rosella'],
  sleepwell: ['sleep well', 'slepwell', 'sleepwel'],
  piwell: ['pi well', 'piwel', 'pwell'],
};

/**
 * Main search function across products
 */
export function searchProductsEnhanced(query: string, products: Product[]): SearchResponse {
  const cleanQ = normalizeSearchToken(query);
  if (!cleanQ || cleanQ.length < 1) {
    return {
      query,
      hasExactMatch: false,
      results: [],
      suggestedAlternatives: [],
    };
  }

  const queryTokens = cleanQ.split(' ').filter(Boolean);
  const exactMatches: SearchResultItem[] = [];
  const typoMatches: SearchResultItem[] = [];
  const partialMatches: SearchResultItem[] = [];
  const relatedMatches: SearchResultItem[] = [];
  const seenProductIds = new Set<number>();

  // Check for common brand synonyms
  let detectedCorrection: string | undefined;
  for (const [canonical, aliases] of Object.entries(BRAND_SYNONYMS)) {
    if (aliases.some((a) => cleanQ === a || cleanQ.includes(a))) {
      detectedCorrection = canonical;
      break;
    }
  }

  for (const p of products) {
    const pNameNorm = normalizeSearchToken(p.name);
    const pSlugNorm = normalizeSearchToken(p.slug);
    const pNameTokens = pNameNorm.split(' ').filter(Boolean);
    const pConcernsNorm = p.healthConcerns.map(normalizeSearchToken);
    const pCatsNorm = p.categories.map(normalizeSearchToken);
    const pDescNorm = normalizeSearchToken(p.cleanDescription || p.shortDescription || '');

    // 1. EXACT & SUBSTRING MATCH in name or slug (Score 100)
    if (pNameNorm === cleanQ || pSlugNorm === cleanQ) {
      exactMatches.push({
        product: p,
        matchType: 'exact',
        matchReason: 'Exact name match',
        score: 100,
      });
      seenProductIds.add(p.id);
      continue;
    }

    if (pNameNorm.includes(cleanQ)) {
      exactMatches.push({
        product: p,
        matchType: 'exact',
        matchReason: 'Direct product match',
        score: 90,
      });
      seenProductIds.add(p.id);
      continue;
    }

    // 2. BRAND SYNONYM MATCH (Score 85)
    if (detectedCorrection && (pNameNorm.includes(detectedCorrection) || pSlugNorm.includes(detectedCorrection))) {
      typoMatches.push({
        product: p,
        matchType: 'typo',
        matchReason: `Suggested match for "${query}"`,
        score: 85,
      });
      seenProductIds.add(p.id);
      continue;
    }

    // 3. TYPO-TOLERANT TOKEN MATCHING (Score based on token coverage)
    let matchedTokenCount = 0;
    let typoMatchedWord = '';

    for (const qTok of queryTokens) {
      if (qTok.length < 2) continue;
      // Exact token match
      if (pNameTokens.some((pTok) => pTok === qTok || pTok.startsWith(qTok))) {
        matchedTokenCount += 1;
        continue;
      }
      // Typo token match
      const foundTypo = pNameTokens.find((pTok) => isTypoMatch(qTok, pTok));
      if (foundTypo) {
        matchedTokenCount += 1;
        typoMatchedWord = foundTypo;
      }
    }

    if (matchedTokenCount > 0) {
      const coverageRatio = matchedTokenCount / queryTokens.length;
      // If matches all or most query tokens, rank very high (up to 85)
      const score = Math.round(50 + coverageRatio * 35);
      typoMatches.push({
        product: p,
        matchType: coverageRatio === 1 && typoMatchedWord ? 'typo' : 'partial',
        matchReason: typoMatchedWord
          ? `Matches similar spelling (${typoMatchedWord})`
          : 'Name match',
        score,
      });
      seenProductIds.add(p.id);
      continue;
    }

    // 4. PARTIAL TOKEN MATCHING (Score 60-70)
    // Matches if every query token matches a prefix or substring in product name
    const allTokensMatchName = queryTokens.every((qTok) =>
      pNameTokens.some((pTok) => pTok.startsWith(qTok) || pTok.includes(qTok))
    );

    if (allTokensMatchName && queryTokens.length > 0) {
      partialMatches.push({
        product: p,
        matchType: 'partial',
        matchReason: 'Partial name match',
        score: 65,
      });
      seenProductIds.add(p.id);
      continue;
    }

    // 5. HEALTH CONCERN & CATEGORY MATCHING (Score 50-60)
    const matchesConcern = pConcernsNorm.some((c) =>
      queryTokens.some((qTok) => c.includes(qTok) || qTok.includes(c))
    );
    const matchesCategory = pCatsNorm.some((cat) =>
      queryTokens.some((qTok) => cat.includes(qTok) || qTok.includes(cat))
    );

    if (matchesConcern || matchesCategory) {
      relatedMatches.push({
        product: p,
        matchType: 'related',
        matchReason: matchesConcern
          ? `Formulation for ${p.healthConcerns[0] || 'wellness'}`
          : `Category: ${p.categories[0] || 'Ayurvedic'}`,
        score: 55,
      });
      seenProductIds.add(p.id);
      continue;
    }

    // 6. DESCRIPTION / INGREDIENT MENTION (Score 40)
    const matchesDesc = queryTokens.some((qTok) => qTok.length > 3 && pDescNorm.includes(qTok));
    if (matchesDesc) {
      relatedMatches.push({
        product: p,
        matchType: 'related',
        matchReason: 'Botanical ingredients / benefits match',
        score: 40,
      });
      seenProductIds.add(p.id);
    }
  }

  // Combine prioritized primary results
  const primaryResults = [
    ...exactMatches.sort((a, b) => b.score - a.score),
    ...typoMatches.sort((a, b) => b.score - a.score),
    ...partialMatches.sort((a, b) => b.score - a.score),
    ...relatedMatches.sort((a, b) => b.score - a.score),
  ];

  // 7. SMART ALTERNATIVE RECOMMENDATIONS
  // If results are few (< 3) or empty, find relevant recommendations
  const suggestedAlternatives: SearchResultItem[] = [];
  if (primaryResults.length < 4) {
    // Find concerns related to any matched products, or bestsellers
    const matchedConcerns = new Set<string>();
    primaryResults.forEach((r) => r.product.healthConcerns.forEach((c) => matchedConcerns.add(c)));

    const remainingProducts = products.filter((p) => !seenProductIds.has(p.id));

    // Prefer products that share the same health concern
    for (const p of remainingProducts) {
      if (p.healthConcerns.some((c) => matchedConcerns.has(c))) {
        suggestedAlternatives.push({
          product: p,
          matchType: 'recommended',
          matchReason: `Alternative for ${p.healthConcerns[0]}`,
          score: 30,
        });
        seenProductIds.add(p.id);
        if (suggestedAlternatives.length >= 3) break;
      }
    }

    // If still need suggestions, add customer favorites / bestsellers
    if (suggestedAlternatives.length < 3) {
      for (const p of remainingProducts) {
        if (!seenProductIds.has(p.id) && (p.isBestseller || p.rating >= 4.7)) {
          suggestedAlternatives.push({
            product: p,
            matchType: 'recommended',
            matchReason: 'Customer favorite Ayurvedic formulation',
            score: 20,
          });
          seenProductIds.add(p.id);
          if (suggestedAlternatives.length >= 4) break;
        }
      }
    }
  }

  return {
    query,
    correctedQuery: detectedCorrection,
    hasExactMatch: exactMatches.length > 0,
    results: primaryResults,
    suggestedAlternatives,
  };
}
