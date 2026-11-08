'use client';

/**
 * WooCommerce Order Attribution Tracker for AyurRaksha Headless Storefront
 * Tracks visitor acquisition source (Direct, Organic, Referral, UTM campaign)
 * matching WooCommerce 8.5+ Order Attribution schema:
 * - source_type ('typein' | 'organic' | 'referral' | 'utm' | 'admin')
 * - referrer
 * - utm_source, utm_medium, utm_campaign, utm_content, utm_term, utm_id
 * - utm_source_platform, utm_creative_format, utm_marketing_tactic
 * - session_entry
 * - session_start_time
 * - session_pages
 * - session_count
 * - user_agent
 */

export interface OrderAttributionData {
  source_type: string;
  referrer: string;
  utm_campaign: string;
  utm_source: string;
  utm_medium: string;
  utm_content: string;
  utm_id: string;
  utm_term: string;
  utm_source_platform: string;
  utm_creative_format: string;
  utm_marketing_tactic: string;
  session_entry: string;
  session_start_time: string;
  session_pages: string;
  session_count: string;
  user_agent: string;
}

const STORAGE_KEY = 'ayurraksha_order_attribution';
const SESSION_COUNT_KEY = 'ayurraksha_session_count';
const PAGE_COUNT_KEY = 'ayurraksha_session_pages';

const SEARCH_ENGINES: Record<string, string> = {
  'google.': 'google',
  'bing.': 'bing',
  'yahoo.': 'yahoo',
  'duckduckgo.': 'duckduckgo',
  'baidu.': 'baidu',
  'yandex.': 'yandex',
  'ecosia.': 'ecosia',
  'ask.com': 'ask',
};

function formatCurrentDateTime(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function initOrderAttribution(): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Increment page counter for current session
    let pageCount = 1;
    const existingPageCount = sessionStorage.getItem(PAGE_COUNT_KEY);
    if (existingPageCount) {
      pageCount = parseInt(existingPageCount, 10) + 1;
    }
    sessionStorage.setItem(PAGE_COUNT_KEY, String(pageCount));

    // 2. Increment overall session count in localStorage if this is a new tab/session
    let sessionCount = 1;
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      const storedCount = localStorage.getItem(SESSION_COUNT_KEY);
      if (storedCount) {
        sessionCount = parseInt(storedCount, 10) + 1;
      }
      localStorage.setItem(SESSION_COUNT_KEY, String(sessionCount));
    } else {
      sessionCount = parseInt(localStorage.getItem(SESSION_COUNT_KEY) || '1', 10);
    }

    // If attribution for current session already exists and no new UTM params present, just update pages
    const existingAttributionJson = sessionStorage.getItem(STORAGE_KEY);
    const searchParams = new URLSearchParams(window.location.search);
    const hasNewUtm = searchParams.has('utm_source') || searchParams.has('gclid') || searchParams.has('fbclid');

    if (existingAttributionJson && !hasNewUtm) {
      const existing = JSON.parse(existingAttributionJson);
      existing.session_pages = String(pageCount);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      return;
    }

    // 3. Determine acquisition origin
    const ref = document.referrer || '';
    const currentHost = window.location.hostname;
    const entryUrl = window.location.href;

    const utmSource = searchParams.get('utm_source') || (searchParams.has('gclid') ? 'google' : searchParams.has('fbclid') ? 'facebook' : '');
    const utmMedium = searchParams.get('utm_medium') || (searchParams.has('gclid') ? 'cpc' : searchParams.has('fbclid') ? 'paid_social' : '');
    const utmCampaign = searchParams.get('utm_campaign') || '';
    const utmContent = searchParams.get('utm_content') || '';
    const utmId = searchParams.get('utm_id') || '';
    const utmTerm = searchParams.get('utm_term') || '';
    const utmSourcePlatform = searchParams.get('utm_source_platform') || '';
    const utmCreativeFormat = searchParams.get('utm_creative_format') || '';
    const utmMarketingTactic = searchParams.get('utm_marketing_tactic') || '';

    let sourceType = 'typein'; // Default: Direct
    let computedUtmSource = utmSource;
    let computedUtmMedium = utmMedium;

    if (utmSource) {
      sourceType = 'utm';
    } else if (ref) {
      try {
        const refUrl = new URL(ref);
        const refHost = refUrl.hostname.toLowerCase();

        // Check if referral is internal (same domain)
        if (refHost === currentHost || refHost.endsWith(`.${currentHost}`)) {
          // If we already have stored attribution from initial entry, preserve it
          if (existingAttributionJson) {
            return;
          }
          sourceType = 'typein';
        } else {
          // Check organic search engine
          let isSearch = false;
          for (const [engineHost, engineName] of Object.entries(SEARCH_ENGINES)) {
            if (refHost.includes(engineHost)) {
              sourceType = 'organic';
              computedUtmSource = engineName;
              computedUtmMedium = 'organic';
              isSearch = true;
              break;
            }
          }

          if (!isSearch) {
            sourceType = 'referral';
            computedUtmSource = refHost;
            computedUtmMedium = 'referral';
          }
        }
      } catch {
        sourceType = 'typein';
      }
    }

    const attribution: OrderAttributionData = {
      source_type: sourceType,
      referrer: ref || '(none)',
      utm_campaign: utmCampaign || '(none)',
      utm_source: computedUtmSource || '(none)',
      utm_medium: computedUtmMedium || '(none)',
      utm_content: utmContent || '(none)',
      utm_id: utmId || '(none)',
      utm_term: utmTerm || '(none)',
      utm_source_platform: utmSourcePlatform || '(none)',
      utm_creative_format: utmCreativeFormat || '(none)',
      utm_marketing_tactic: utmMarketingTactic || '(none)',
      session_entry: entryUrl,
      session_start_time: formatCurrentDateTime(),
      session_pages: String(pageCount),
      session_count: String(sessionCount),
      user_agent: navigator.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch (err) {
    console.warn('[OrderAttribution Error]', err);
  }
}

export function getOrderAttribution(): OrderAttributionData {
  const defaultAttribution: OrderAttributionData = {
    source_type: 'typein',
    referrer: '(none)',
    utm_campaign: '(none)',
    utm_source: '(none)',
    utm_medium: '(none)',
    utm_content: '(none)',
    utm_id: '(none)',
    utm_term: '(none)',
    utm_source_platform: '(none)',
    utm_creative_format: '(none)',
    utm_marketing_tactic: '(none)',
    session_entry: typeof window !== 'undefined' ? window.location.href : 'https://www.ayurrakshaonline.com/',
    session_start_time: formatCurrentDateTime(),
    session_pages: '1',
    session_count: '1',
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  };

  if (typeof window === 'undefined') {
    return defaultAttribution;
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Update latest page count and user agent
      const latestPages = sessionStorage.getItem(PAGE_COUNT_KEY) || parsed.session_pages || '1';
      return {
        ...defaultAttribution,
        ...parsed,
        session_pages: String(latestPages),
        user_agent: navigator.userAgent || defaultAttribution.user_agent,
      };
    }
  } catch {
    // fallback to default
  }

  // If not yet initialized, initialize now
  initOrderAttribution();
  try {
    const fresh = sessionStorage.getItem(STORAGE_KEY);
    if (fresh) return JSON.parse(fresh);
  } catch {}

  return defaultAttribution;
}
