/*
 * End-to-end verification of the homepage hero banner:
 *  - Desktop (1440x900): each of the 5 slides serves its desktop image,
 *    CTA label + product link are correct, and a CTA click reaches the PDP.
 *  - All 5 CTA product URLs return 200.
 *  - Mobile (375x812): slides serve their mobile images (picture srcSet
 *    fallback), keyboard navigation works, CTA links match.
 *  - Screenshots saved to qa-reports/hero-verification/.
 *
 * Run: node scripts/verify-hero-banner.js   (dev server must be up on :3100)
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:3100';
const OUT = path.join(__dirname, '..', 'qa-reports', 'hero-verification');

const SLIDES = [
  {
    id: 'boozliv',
    desktop: '/images/banners/boozliv-desktop.webp',
    mobile: '/images/banners/boozliv-mobile.webp',
    link: '/product/boozliv',
  },
  {
    id: 'skin-well-combo',
    desktop: '/images/banners/skin-well-combo.webp',
    mobile: '/images/banners/skin-well-combo-mobile.webp',
    link: '/product/skin-well-pack',
  },
  {
    id: 'varicose-veins',
    desktop: '/images/banners/varicose-veins.webp',
    mobile: '/images/banners/varicose-veins-mobile.webp',
    link: '/product/flow-well-pack',
  },
  {
    id: 'breathe-well',
    desktop: '/images/banners/breathe-well.webp',
    mobile: '/images/banners/breathe-well-mobile.webp',
    link: '/product/ayur-raksha-breathe-well-pack',
  },
  {
    id: 'purna-sakthi',
    desktop: '/images/banners/purna-sakthi.webp',
    mobile: '/images/banners/purna-sakthi-mobile.webp',
    link: '/product/purna-sakthi-tonic',
  },
];

const ACTIVE_IMG = 'section[aria-roledescription="carousel"] [role="group"][aria-hidden="false"] img';

let failures = 0;
const check = (cond, msg) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${msg}`);
  if (!cond) failures += 1;
};

async function waitImageLoaded(page) {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      return !!el && el.complete && el.naturalWidth > 0;
    },
    ACTIVE_IMG,
    { timeout: 15000 }
  );
}

async function activeState(page) {
  return page.evaluate((sel) => {
    const img = document.querySelector(sel);
    const link = document.querySelector(sel.replace(' img', ' a'));
    const active = document.querySelector(
      'section[aria-roledescription="carousel"] [role="group"][aria-hidden="false"]'
    );
    return {
      label: active ? active.getAttribute('aria-label') : null,
      currentSrc: img ? img.currentSrc || img.src : null,
      ctaHref: link ? link.getAttribute('href') : null,
      ctaText: link ? link.textContent.replace(/\s+/g, ' ').trim() : null,
    };
  }, ACTIVE_IMG);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  // ---------------- DESKTOP ----------------
  const dPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await dPage.goto(BASE + '/', { waitUntil: 'load' });
  const sec = dPage.locator('section[aria-roledescription="carousel"]');
  await sec.waitFor({ state: 'attached', timeout: 20000 });
  // Hover the banner to pause autoplay during the slide sweep
  await sec.hover();
  await dPage.waitForTimeout(500);

  for (let i = 0; i < SLIDES.length; i++) {
    const s = SLIDES[i];
    await dPage.click(`button[aria-label="Go to slide ${i + 1}"]`);
    await waitImageLoaded(dPage);
    const st = await activeState(dPage);
    check(
      (st.currentSrc || '').endsWith(s.desktop),
      `Desktop ${s.id}: active image -> ${st.currentSrc}`
    );
    check(
      st.ctaHref && st.ctaHref.replace(/\/+$/, '') === s.link,
      `Desktop ${s.id}: CTA href -> ${st.ctaHref} (expected ${s.link})`
    );
    check(/shop/i.test(st.ctaText || ''), `Desktop ${s.id}: CTA label -> "${st.ctaText}"`);
    if (i === 0) await dPage.screenshot({ path: path.join(OUT, 'hero-desktop-slide1.png') });
    if (i === 2) await dPage.screenshot({ path: path.join(OUT, 'hero-desktop-slide3.png') });
  }

  // CTA click navigates to the BoozLiv product page
  await dPage.click('button[aria-label="Go to slide 1"]');
  await dPage.waitForTimeout(700);
  await sec.locator('a').first().click();
  await dPage.waitForURL(/\/product\/boozliv/, { timeout: 20000 });
  const h1 = (await dPage.locator('h1').first().innerText()).trim();
  check(h1.includes('BoozLiv'), `CTA click lands on BoozLiv PDP (h1: ${h1})`);

  // All 5 CTA targets return 200
  for (const s of SLIDES) {
    const r = await dPage.request.get(BASE + s.link + '/');
    check(r.status() === 200, `GET ${s.link}/ -> ${r.status()}`);
  }

  // ---------------- MOBILE ----------------
  const mPage = await browser.newPage({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
  });
  await mPage.goto(BASE + '/', { waitUntil: 'load' });
  const mSec = mPage.locator('section[aria-roledescription="carousel"]');
  await mSec.waitFor({ state: 'attached', timeout: 20000 });
  await waitImageLoaded(mPage);
  let st = await activeState(mPage);
  check(
    (st.currentSrc || '').endsWith(SLIDES[0].mobile),
    `Mobile slide 1: active image -> ${st.currentSrc}`
  );
  check(
    st.ctaHref && st.ctaHref.replace(/\/+$/, '') === SLIDES[0].link,
    `Mobile slide 1: CTA href -> ${st.ctaHref}`
  );
  await mPage.screenshot({ path: path.join(OUT, 'hero-mobile-slide1.png') });

  // Keyboard navigation to slide 3 (dots/arrows are hidden on mobile)
  await mSec.focus();
  await mPage.keyboard.press('ArrowRight');
  await mPage.waitForFunction(
    () => {
      const a = document.querySelector(
        'section[aria-roledescription="carousel"] [role="group"][aria-hidden="false"]'
      );
      return !!a && a.getAttribute('aria-label').includes('2 of 5');
    },
    null,
    { timeout: 10000 }
  );
  await mPage.keyboard.press('ArrowRight');
  await mPage.waitForFunction(
    () => {
      const a = document.querySelector(
        'section[aria-roledescription="carousel"] [role="group"][aria-hidden="false"]'
      );
      return !!a && a.getAttribute('aria-label').includes('3 of 5');
    },
    null,
    { timeout: 10000 }
  );
  await waitImageLoaded(mPage);
  st = await activeState(mPage);
  check(
    (st.currentSrc || '').endsWith(SLIDES[2].mobile),
    `Mobile slide 3 (via keyboard): active image -> ${st.currentSrc}`
  );
  check(
    st.ctaHref && st.ctaHref.replace(/\/+$/, '') === SLIDES[2].link,
    `Mobile slide 3: CTA href -> ${st.ctaHref}`
  );
  await mPage.screenshot({ path: path.join(OUT, 'hero-mobile-slide3.png') });

  await browser.close();
  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('Verification run crashed:', e);
  process.exit(2);
});
