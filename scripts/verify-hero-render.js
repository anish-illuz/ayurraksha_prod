/*
 * Deterministic hero banner verification on both breakpoints.
 *
 * Navigation is confirmed step-by-step against the active slide's aria-label
 * ("N of 5") so a lost-focus / mid-transition state can never cause a
 * slide to be read at the wrong index. Desktop uses the dot buttons; mobile
 * hides the dots, so it drives the section's keyboard handler and confirms
 * each arrow landed before pressing the next.
 *
 * For each slide we capture:
 *   - the resolved image src (desktop vs mobile, per the <picture> media query)
 *   - a canvas pixel sample to prove the banner actually paints artwork
 *   - a clean screenshot
 *
 * Run: node scripts/verify-hero-render.js   (dev server up on :3100)
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:3100';
const OUT = path.join(__dirname, '..', 'qa-reports', 'hero-verification');

const SLIDES = [
  { id: 'boozliv', desktop: '/images/banners/boozliv-desktop.webp', mobile: '/images/banners/boozliv-mobile.webp', link: '/product/boozliv' },
  { id: 'skin-well-combo', desktop: '/images/banners/skin-well-combo.webp', mobile: '/images/banners/skin-well-combo-mobile.webp', link: '/product/skin-well-pack' },
  { id: 'varicose-veins', desktop: '/images/banners/varicose-veins.webp', mobile: '/images/banners/varicose-veins-mobile.webp', link: '/product/flow-well-pack' },
  { id: 'breathe-well', desktop: '/images/banners/breathe-well.webp', mobile: '/images/banners/breathe-well-mobile.webp', link: '/product/ayur-raksha-breathe-well-pack' },
  { id: 'purna-sakthi', desktop: '/images/banners/purna-sakthi.webp', mobile: '/images/banners/purna-sakthi-mobile.webp', link: '/product/purna-sakthi-tonic' },
];

const ACTIVE_GROUP = '[role="group"][aria-hidden="false"]';
const ACTIVE_IMG = ACTIVE_GROUP + ' img';

const labelOf = (n) => `${n} of 5`; // n is 1-based

async function currentSlideNo(page) {
  // ACTIVE_GROUP must be passed in: the callback runs in the page, not this module.
  return page.evaluate((sel) => {
    const g = document.querySelector(sel);
    const m = (g ? g.getAttribute('aria-label') : '').match(/^(\d+) of \d+/);
    return m ? parseInt(m[1], 10) : -1;
  }, ACTIVE_GROUP);
}

/**
 * Deterministically advance/retreat one slide at a time, confirming via the
 * active slide's aria-label that each move landed before the next.
 */
async function gotoSlide(page, sec, targetNo, viaKeyboard) {
  // targetNo is 1-based
  if (!viaKeyboard) {
    await page.click(`button[aria-label="Go to slide ${targetNo}"]`);
    // Single array arg: destructure inside the page callback.
    // aria-label is "N of 5: <title>", so match the "N of 5:" prefix.
    await page.waitForFunction(
      ([exp, sel]) => {
        const g = document.querySelector(sel);
        const lbl = g ? g.getAttribute('aria-label') : '';
        return lbl.startsWith(exp + ':');
      },
      [labelOf(targetNo), ACTIVE_GROUP],
      { timeout: 8000 }
    );
    return;
  }
  let cur = await currentSlideNo(page);
  if (cur === -1) cur = 1;
  while (cur !== targetNo) {
    const right = cur < targetNo;
    const next = right ? cur + 1 : cur - 1;
    await sec.focus();
    await page.keyboard.press(right ? 'ArrowRight' : 'ArrowLeft');
    // The callback runs in the page: ACTIVE_GROUP must be passed in, not referenced.
    await page.waitForFunction(
      ([exp, sel]) => {
        const g = document.querySelector(sel);
        const lbl = g ? g.getAttribute('aria-label') : '';
        return lbl.startsWith(exp + ':');
      },
      [labelOf(next), ACTIVE_GROUP],
      { timeout: 8000 }
    );
    cur = next;
  }
}

/** Renders an image URL into a canvas and reports how much real content it has. */
async function pixelStats(page, url) {
  return page.evaluate(async (imgUrl) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = () => rej(new Error('decode failed'));
      img.src = imgUrl;
    });
    const w = 300;
    const h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w));
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h).data;
    const colors = new Set();
    let min = 255,
      max = 0,
      sum = 0,
      n = 0;
    for (let i = 0; i < d.length; i += 4) {
      colors.add((d[i] >> 3) + ',' + (d[i + 1] >> 3) + ',' + (d[i + 2] >> 3));
      const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      if (lum < min) min = lum;
      if (lum > max) max = lum;
      sum += lum;
      n++;
    }
    return {
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
      distinctColors: colors.size,
      lumMin: Math.round(min),
      lumMax: Math.round(max),
      lumMean: Math.round(sum / n),
    };
  }, url);
}

let failures = 0;
const check = (cond, msg) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${msg}`);
  if (!cond) failures += 1;
};

async function run(browser, label, viewport, mobile) {
  const page = await browser.newPage({
    viewport,
    isMobile: mobile,
    hasTouch: mobile,
    userAgent: mobile
      ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36'
      : undefined,
  });
  await page.goto(BASE + '/', { waitUntil: 'load' });
  const sec = page.locator('section[aria-roledescription="carousel"]');
  await sec.waitFor({ state: 'attached', timeout: 20000 });
  await page.waitForTimeout(800);

  console.log(`\n=== ${label} (${viewport.width}x${viewport.height}) ===`);
  for (let i = 0; i < SLIDES.length; i++) {
    const s = SLIDES[i];
    const no = i + 1;
    await gotoSlide(page, sec, no, mobile);

    // wait for the active image to be fully decoded AND the opacity transition to settle
    await page.waitForFunction(
      (sel) => {
        const el = document.querySelector(sel);
        return !!el && el.complete && el.naturalWidth > 0;
      },
      ACTIVE_IMG,
      { timeout: 15000 }
    );
    await page.waitForTimeout(700); // 500ms crossfade + margin

    const state = await page.evaluate(
      ([imgSel, grpSel]) => {
        const img = document.querySelector(imgSel);
        const link = document.querySelector(imgSel.replace(' img', ' a'));
        const g = document.querySelector(grpSel);
        return {
          label: g ? g.getAttribute('aria-label') : null,
          src: img ? img.currentSrc || img.src : null,
          ctaHref: link ? link.getAttribute('href') : null,
        };
      },
      [ACTIVE_IMG, ACTIVE_GROUP]
    );

    const expected = mobile ? s.mobile : s.desktop;
    check(
      state.label && state.label.startsWith(labelOf(no) + ':'),
      `${label} slide ${no} (${s.id}): active label -> ${state.label}`
    );
    check(
      state.src && state.src.endsWith(expected),
      `${label} slide ${no} (${s.id}): image -> ${(state.src || '').split('/').pop()} (expected ${expected.split('/').pop()})`
    );
    check(
      state.ctaHref && state.ctaHref.replace(/\/+$/, '') === s.link,
      `${label} slide ${no}: CTA -> ${state.ctaHref} (expected ${s.link})`
    );

    const stats = await pixelStats(page, state.src);
    const blank = stats.distinctColors < 5;
    check(!blank, `${label} slide ${no}: painted (${stats.distinctColors} colors, lum ${stats.lumMin}..${stats.lumMax})${blank ? '  <-- BLANK' : ''}`);

    await page.screenshot({ path: path.join(OUT, `final-${label}-slide${no}.png`) });
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  await run(browser, 'desktop', { width: 1440, height: 900 }, false);
  await run(browser, 'mobile', { width: 375, height: 812 }, true);
  await browser.close();
  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
})().catch((e) => {
  console.error('Verification run crashed:', e);
  process.exit(2);
});
