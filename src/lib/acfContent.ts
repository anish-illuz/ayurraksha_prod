/**
 * Parsing helpers for the WordPress ACF `ingredients` and `how_to_use` fields
 * that drive the PDP "What's Inside?" and "How to Use" sections.
 *
 * The CMS stores both as free-text single fields, and the delimiter
 * conventions are inconsistent across products:
 *
 *  - Ingredients are written as "Common / Alias — Latin" or "Common, Latin"
 *    entries separated by newlines, double spaces, or packed onto one line.
 *    The Latin name is a two-word binomial (occasionally with a Capitalised
 *    species, e.g. "Aegle Marmelos") optionally followed by part words
 *    (rhizome, leaf, fruit, bark, extract, ...). When names are packed
 *    without any delimiter, they are recovered with a short botanical name
 *    vocabulary (ANCHOR_TERMS) that lists the known ingredient names the
 *    backend actually uses.
 *  - How-to-use instructions are separated by newlines, double spaces,
 *    sentence periods, or a comma before a Capitalised step-start word
 *    ("...after breakfast, Another 10 ml sachet after dinner"). Some
 *    records use numbered lists with section labels
 *    ("Before bath: 1. ... For regular care: ...").
 *
 * These functions split the raw backend text into structured items without
 * changing its meaning. When a record is too free-form to split safely it is
 * kept as a single item so the original content is always preserved.
 * Ingredient images are resolved from the shared botanical image library
 * (src/lib/ingredientImages.ts) because the CMS stores ingredient names but
 * no per-ingredient photos.
 */

import { resolveIngredientImage } from './ingredientImages';

export interface StructuredIngredient {
  /** Display name, e.g. "Vilvaver / Bael Root". */
  commonName: string;
  /** Latin binomial, e.g. "Aegle marmelos". */
  latinName?: string;
  /** Free-text description when the field is prose rather than a name list. */
  description?: string;
  badge: string;
  /** Auto-resolved botanical image. */
  image: string;
}

export interface StructuredStep {
  stepNumber: number;
  title: string;
  description: string;
  /** Optional grouping label from the backend, e.g. "Before bath". */
  sectionLabel?: string;
}

function padBadge(n: number): string {
  return `HERB ${n < 10 ? '0' : ''}${n}`;
}

/* ------------------------------------------------------------------ *
 *  Ingredients
 * ------------------------------------------------------------------ */

/**
 * Words that trail a Latin binomial to name the plant part used
 * ("Curcuma longa rhizome", "Vitis vinifera fruit dried powder").
 */
const LATIN_PART_WORDS = new Set([
  'rhizome', 'leaf', 'leaves', 'fruit', 'fruits', 'bark', 'root', 'roots',
  'extract', 'powder', 'heartwood', 'seed', 'seeds', 'bulb', 'oil',
  'juice', 'petal', 'petals', 'flower', 'flowers', 'stem', 'stems', 'sap',
  'resin', 'cut', 'cuts', 'dried',
]);

/**
 * Binomials whose species word is written Capitalised in the CMS data
 * ("Aegle Marmelos") and would otherwise stop Latin extraction early.
 */
const KNOWN_LATIN_CAPITAL = new Set(['aegle marmelos']);

/**
 * Single- or two-token botanical names used to split packed ingredient
 * lists that carry no delimiter at all ("Epsom Salt Rock Salt Dry Ginger
 * Menthol Thymol Bhimseni Karpooram"). Only names that actually appear in
 * the backend data are included so unrelated text is never split.
 */
const ANCHOR_TERMS = [
  'rock salt', 'dry ginger', 'bhimseni karpooram', 'bhimseni',
  'epsom salt', 'epsom', 'menthol', 'thymol',
  'mangosteen', 'perandai', 'manjanathi',
];

const escapeRegExp = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Split "Genus species ... rest" into its Latin tail and the next name. */
function splitLatinAndName(seg: string): { latin: string; next: string } {
  const words = seg.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return { latin: '', next: '' };

  let i = 0;
  const latin: string[] = [];
  if (/^[A-Z]/.test(words[0])) {
    latin.push(words[0]);
    i += 1;
  }
  if (i < words.length && /^[a-z]/.test(words[i])) {
    latin.push(words[i]);
    i += 1;
  }
  if (
    i < words.length &&
    /^[A-Z]/.test(words[i]) &&
    latin.length === 1 &&
    KNOWN_LATIN_CAPITAL.has(`${latin[0]} ${words[i]}`.toLowerCase())
  ) {
    latin.push(words[i]);
    i += 1;
  }
  while (i < words.length && LATIN_PART_WORDS.has(words[i].toLowerCase())) {
    latin.push(words[i]);
    i += 1;
  }

  let next = words.slice(i).join(' ');
  // A " / variant" continuation belongs to the Latin, not the next name.
  if (next.startsWith('/')) {
    return { latin: [latin.join(' '), next].filter(Boolean).join(' '), next: '' };
  }
  return { latin: latin.join(' '), next };
}

/**
 * Split a packed single-line ingredient list (no newlines / double spaces)
 * into individual "name [+ / alias] — latin" items, using Latin-boundary
 * logic and the anchor-term vocabulary.
 */
function splitPackedIngredientList(text: string): string[] {
  const dashCount = (text.match(/—/g) || []).length;

  if (dashCount >= 2) {
    // "Name1 — Latin1 Name2 — Latin2 ...": each dash starts a new item's
    // Latin; split at the dash and reattach the tail.
    const segs = text.split(/—/g).map((s) => s.trim()).filter(Boolean);
    const items: string[] = [];
    segs.forEach((seg, idx) => {
      if (idx === 0) {
        items.push(seg);
        return;
      }
      const { latin, next } = splitLatinAndName(seg);
      const prev = items[idx - 1];
      items[idx - 1] = prev ? `${prev} — ${latin}`.trim() : latin;
      if (next) items.push(next);
    });
    return items.filter(Boolean);
  }

  if (dashCount === 1) {
    // "Common / Alias, Latin" with a single dash or comma structure.
    const dashIdx = text.indexOf('—');
    const nameSide = text.slice(0, dashIdx).trim();
    const tail = text.slice(dashIdx + 1).trim();
    const { latin, next } = splitLatinAndName(tail);
    const out: string[] = [
      latin ? `${nameSide} — ${latin}`.trim() : nameSide,
    ];
    if (next) out.push(next);
    return out.filter(Boolean);
  }

  // No dashes at all: "Name, Latin Name, Latin ..." — a comma after each
  // item's name carries its Latin (and the next name), so split on every
  // comma and reattach each Latin tail to the item before it.
  const commaCount = (text.match(/,/g) || []).length;
  if (commaCount >= 2) {
    const segs = text.split(',').map((s) => s.trim()).filter(Boolean);
    const items: string[] = [];
    segs.forEach((seg, idx) => {
      if (idx === 0) {
        items.push(seg);
        return;
      }
      const { latin, next } = splitLatinAndName(seg);
      if (latin) {
        const prev = items[idx - 1];
        items[idx - 1] = prev ? `${prev}, ${latin}`.trim() : latin;
      }
      if (next) items.push(next);
    });
    return items.filter(Boolean);
  }

  // Pure packed name run with no punctuation: split at known botanical
  // names (the ANCHOR_TERMS vocabulary). Longest terms are tried first so
  // "rock salt" wins over a bare "salt", and each item spans from one
  // matched name to the next.
  const anchorRe = new RegExp(
    `\\b(${ANCHOR_TERMS.slice().sort((a, b) => b.length - a.length).map(escapeRegExp).join('|')})`,
    'gi',
  );
  const matches = Array.from(text.matchAll(anchorRe));
  if (matches.length >= 2) {
    return matches
      .map((mm, i) => {
        const start = mm.index ?? 0;
        const end = i + 1 < matches.length ? matches[i + 1].index ?? text.length : text.length;
        return text.slice(start, end).trim();
      })
      .filter(Boolean);
  }

  return [text.trim()];
}

function mapIngredientItem(item: string, index: number): StructuredIngredient {
  const prose =
    /\b(is a|known as|used in|naturally contains|botanical)\b/i.test(item) &&
    item.length > 60;
  if (prose) {
    return {
      commonName: item.replace(/\s*—\s*.*/, '').trim() || item,
      description: item,
      badge: padBadge(index + 1),
      image: resolveIngredientImage({ name: item, description: item }),
    };
  }

  let nameSide = item;
  let latinSide = '';
  const dashIdx = item.indexOf('—');
  if (dashIdx >= 0) {
    nameSide = item.slice(0, dashIdx).trim();
    latinSide = item.slice(dashIdx + 1).trim();
  } else {
    const commaIdx = item.lastIndexOf(',');
    if (commaIdx >= 0 && item.length - commaIdx > 2) {
      const afterComma = item.slice(commaIdx + 1).trim();
      // Only treat the comma as a name/latin split when the tail reads like
      // a Latin binomial ("Wedelia calendulacea"), not like a plain alias.
      const tailWords = afterComma.split(/\s+/);
      const looksLatin =
        tailWords.length >= 2 &&
        /^[A-Z]/.test(tailWords[0]) &&
        /^[a-z]/.test(tailWords[1]);
      if (looksLatin) {
        nameSide = item.slice(0, commaIdx).trim();
        latinSide = afterComma;
      }
    }
  }

  const slashParts = nameSide.split('/').map((s) => s.trim()).filter(Boolean);
  const primary = slashParts[0] || nameSide;
  const aliases = slashParts.slice(1);
  const latinName = latinSide || undefined;

  const displayName =
    [primary, ...aliases].filter(Boolean).join(' / ').trim() || item;

  return {
    commonName: displayName,
    latinName,
    badge: padBadge(index + 1),
    image: resolveIngredientImage({
      name: primary || displayName,
      aliases,
      latin: latinName,
      description: item,
    }),
  };
}

/**
 * Parse a raw ACF ingredients string into individual, image-mapped
 * ingredient items.
 */
export function parseIngredients(raw: string | undefined): StructuredIngredient[] {
  if (!raw || !raw.trim()) return [];

  const source = raw.trim();

  let itemStrings: string[];
  if (source.includes('\n')) {
    itemStrings = source
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (/\s{2,}/.test(source)) {
    itemStrings = source
      .replace(/\s{2,}/g, '\u0000')
      .split('\u0000')
      .map((s) => s.trim())
      .filter(Boolean);
  } else {
    // Packed single-line list (dashes, commas, or bare name runs).
    itemStrings = splitPackedIngredientList(source);
  }

  const seen = new Set<string>();
  const unique = itemStrings.filter((it) => {
    const key = it.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.map((it, i) => mapIngredientItem(it, i));
}

/* ------------------------------------------------------------------ *
 *  How to use
 * ------------------------------------------------------------------ */

const STEP_START_WORDS = new Set([
  'another', 'then', 'for', 'if', 'do', 'when', 'use', 'take', 'apply',
  'after', 'before', 'add', 'heat', 'measure', 'wash', 'rinse', 'soak',
  'place', 'allow', 'boil', 'fill', 'shake', 'swish', 'spit', 'gently',
  'ensure', 'massage', 'spread', 'pat', 'wipe', 'leave', 'enjoy',
]);

const STEP_START_REGEX = new RegExp(
  `(?<=[.!?])\\s+(?=[A-Z])|,\\s+(?=${Array.from(STEP_START_WORDS).join('|')}\\s)`,
  'i',
);

/** Split a free-form instruction string into step texts. */
function splitFreeFormSteps(text: string): string[] {
  const marked = text.replace(/[\r\n\t]+/g, ' ').replace(/ {2,}/g, '\u0000');

  const out: string[] = [];
  for (const segment of marked.split('\u0000')) {
    const pieces = segment
      .split(STEP_START_REGEX)
      .map((s) => s.trim())
      .filter(Boolean);
    out.push(...pieces);
  }
  return out.filter((s) => s.length > 0);
}

/** Concise card title derived from a single instruction. */
export function extractStepTitle(text: string, stepNum: number): string {
  const t = text.trim().replace(/[.]+$/, '');
  const lower = t.toLowerCase();

  if (lower.includes('empty stomach')) return 'Empty Stomach';
  if (lower.includes('before bed') || lower.includes('bedtime')) return 'Before Bed';
  if (lower.includes('breakfast') && !lower.includes('dinner')) return 'Morning Dosage';
  if (lower.includes('dinner') || lower.includes('at night')) return 'Evening Dosage';
  if (lower.includes('dilute')) return 'Dilute with Water';
  if (lower.includes('swish') || lower.includes('gargle')) return 'Swish & Rinse';
  if (lower.includes('massage') || (lower.includes('apply') && !lower.includes('two capsules')))
    return 'Apply & Massage';
  if (lower.includes('lather')) return 'Lather & Wash';
  if (lower.includes('rinse') || lower.includes('pat dry')) return 'Rinse & Dry';
  if (lower.includes('boil') || lower.includes('heat') || lower.includes('simmer'))
    return 'Heat & Prepare';
  if (lower.includes('infuse') || lower.includes('tea bag')) return 'Infuse';
  if (lower.includes('soak')) return 'Warm Soak';
  if (lower.includes('brush') || lower.includes('tooth')) return 'Brush Gently';
  if (lower.includes('fill') && lower.includes('basin')) return 'Prepare the Basin';
  if (lower.includes('shake')) return 'Shake First';
  if (lower.includes('roll')) return 'Roll On Area';

  const first = t.split(/\s{2}/)[0].replace(/[.,;]+$/, '').trim();
  return first.slice(0, 44) || `Step ${stepNum}`;
}

/**
 * Parse a "Label: 1. ... 2. ... Next label: ..." style field into steps
 * with section labels. Returns null when the field is not a numbered list.
 */
function parseLabeledNumbered(text: string): StructuredStep[] | null {
  if (!/\d+\s*[\.\)]\s/.test(text)) return null;

  const labelRe = /([A-Za-z][A-Za-z /&-]{1,28}:\s*(?=\d+\s*[\.\(]))/g;
  const sections: { label?: string; body: string }[] = [];
  let lastEnd = 0;
  let m: RegExpExecArray | null;
  while ((m = labelRe.exec(text)) !== null) {
    sections.push({ body: text.slice(lastEnd, m.index) });
    sections.push({ label: m[1].trim().replace(/:\s*$/, ''), body: '' });
    lastEnd = m.index + m[1].length;
  }
  sections.push({ body: text.slice(lastEnd) });

  // Merge a bare body with the label that follows it.
  const merged: { label?: string; body: string }[] = [];
  for (const s of sections) {
    if (s.label === undefined) {
      const prev = merged[merged.length - 1];
      if (prev) prev.body += s.body;
      else merged.push({ label: s.label, body: s.body });
    } else {
      merged.push({ label: s.label, body: s.body });
    }
  }

  const steps: StructuredStep[] = [];
  for (const sec of merged) {
    const body = sec.body.trim();
    if (!body) continue;
    const parts = body
      .split(/\d+\s*[\.\)]\s*/g)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length > 1) {
      for (const p of parts) {
        steps.push({ stepNumber: 0, title: '', description: p, sectionLabel: sec.label });
      }
    } else {
      for (const p of splitFreeFormSteps(body)) {
        steps.push({ stepNumber: 0, title: '', description: p, sectionLabel: sec.label });
      }
    }
  }

  if (steps.length === 0) return null;
  return steps.map((s, i) => ({
    ...s,
    stepNumber: i + 1,
    title: extractStepTitle(s.description, i + 1),
  }));
}

/**
 * Parse a raw ACF how-to-use string into numbered step-by-step cards.
 */
export function parseHowToUse(raw: string | undefined): StructuredStep[] {
  if (!raw || !raw.trim()) return [];

  const text = raw.replace(/[\r\n\t]+/g, ' ').replace(/ {3,}/g, '  ').trim();

  const labeled = parseLabeledNumbered(text);
  if (labeled && labeled.length > 1) return labeled;

  const pieces = splitFreeFormSteps(text);
  if (pieces.length === 0) return [];

  return pieces.map((p, i) => ({
    stepNumber: i + 1,
    title: extractStepTitle(p, i + 1),
    description: p.replace(/[.]+$/, ''),
  }));
}
