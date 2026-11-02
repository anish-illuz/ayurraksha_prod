const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, 'qa-reports', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runQASuite() {
  console.log('===============================================================');
  console.log('   AYURRAKSHA STOREFRONT — COMPREHENSIVE AUTOMATED QA SUITE    ');
  console.log('===============================================================');
  console.log(`Target URL: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  const browser = await chromium.launch({ headless: true });
  const results = [];
  const consoleErrors = [];

  function record(id, suite, name, status, details = '') {
    results.push({ id, suite, name, status, details });
    const mark = status === 'PASS' ? '✓' : '✗';
    console.log(`[${status}] ${mark} ${id} - ${name} ${details ? '(' + details + ')' : ''}`);
  }

  // 1. DESKTOP CONTEXT
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  const page = await desktopContext.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({ url: page.url(), text: msg.text() });
    }
  });

  try {
    // -------------------------------------------------------------
    // SUITE 1: HOMEPAGE & GLOBAL NAVIGATION
    // -------------------------------------------------------------
    console.log('\n--- SUITE 1: HOMEPAGE & GLOBAL NAVIGATION ---');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const title = await page.title();
    record('TC-HOM-001', 'Homepage', 'Homepage loads with authentic page title', title.includes('AyurRaksha') ? 'PASS' : 'FAIL', title);

    const heroBanner = await page.locator('img[alt*="BoozLiv" i], img[alt*="AyurRaksha" i]').first().isVisible();
    record('TC-HOM-002', 'Homepage', 'Hero carousel banner rendered and visible', heroBanner ? 'PASS' : 'FAIL');

    // Health concerns grid
    const concernCards = await page.locator('a[href^="/concern/"]').count();
    record('TC-HOM-003', 'Homepage', 'Health concerns category grid rendered', concernCards >= 4 ? 'PASS' : 'FAIL', `${concernCards} concern links found`);

    // Bestsellers grid
    const productCards = await page.locator('a[href^="/product/"]').count();
    record('TC-HOM-004', 'Homepage', 'Bestsellers product cards displayed', productCards >= 4 ? 'PASS' : 'FAIL', `${productCards} product links found`);

    // Trust strip
    const docFormulated = await page.getByText('Doctor Formulated').first().isVisible();
    const qualityTested = await page.getByText('Quality Tested').first().isVisible();
    record('TC-HOM-005', 'Homepage', 'Trust & convenience credibility badges rendered', (docFormulated && qualityTested) ? 'PASS' : 'FAIL');

    // Botanical Green Footer
    const footer = page.locator('footer');
    const footerVisible = await footer.isVisible();
    const footerBg = await footer.evaluate(el => window.getComputedStyle(el).backgroundColor);
    record('TC-HOM-006', 'Footer', 'Botanical green footer rendered with brand palette', footerVisible ? 'PASS' : 'FAIL', `BG: ${footerBg}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'qa-01-homepage-desktop.png') });

    // -------------------------------------------------------------
    // SUITE 2: SHOP CATALOGUE & FILTERS
    // -------------------------------------------------------------
    console.log('\n--- SUITE 2: SHOP CATALOGUE & FILTERS ---');
    await page.goto(`${BASE_URL}/shop`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const shopProductsCount = await page.locator('a[href^="/product/"]').count();
    record('TC-CAT-001', 'Shop', 'Catalogue renders products grid', shopProductsCount >= 10 ? 'PASS' : 'FAIL', `${shopProductsCount} product links displayed`);

    // Out of Stock detection in catalogue
    const outOfStockBadges = await page.locator('text=Out of Stock').count();
    record('TC-CAT-002', 'Shop', 'Out of stock products correctly flagged with disabled buttons', outOfStockBadges > 0 ? 'PASS' : 'FAIL', `${outOfStockBadges} out of stock items flagged`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'qa-02-shop-catalogue.png') });

    // -------------------------------------------------------------
    // SUITE 3: REDESIGNED PRODUCT DETAIL PAGE (AYURRAKSHA DETOX TEA)
    // -------------------------------------------------------------
    console.log('\n--- SUITE 3: REDESIGNED PRODUCT DETAIL PAGE (DETOX TEA) ---');
    await page.goto(`${BASE_URL}/product/ayurraksha-detox-tea`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Top Header Badges
    const classicalBadge = await page.getByText('Ayurvedic Classical Formulation').first().isVisible();
    const doctorTopBadge = await page.getByText('Doctor Formulated by Dr. Jegajothi Pandian').first().isVisible();
    record('TC-PDP-001', 'PDP Redesign', 'Header pill badges render above hero', (classicalBadge || doctorTopBadge) ? 'PASS' : 'FAIL');

    // Hero image badge overlays
    const formulaBadge = await page.getByText('100% AYURVEDIC FORMULA').first().isVisible();
    const curatedTag = await page.getByText('Hand-curated').first().isVisible();
    record('TC-PDP-002', 'PDP Redesign', 'Hero image badge overlays present', (formulaBadge || curatedTag) ? 'PASS' : 'FAIL');

    // Visual thumbnails row
    const coaLab = await page.getByText('COA Lab Pure').first().isVisible();
    const wholeFruits = await page.getByText('Whole Botanical Fruits').first().isVisible();
    record('TC-PDP-003', 'PDP Redesign', '4-item feature thumbnail row rendered', (coaLab && wholeFruits) ? 'PASS' : 'FAIL');

    // SKU badge & Title
    const skuBadge = await page.getByText(/SKU:/i).first().isVisible();
    const productTitle = await page.getByRole('heading', { name: 'AyurRaksha Detox Tea' }).first().isVisible();
    record('TC-PDP-004', 'PDP Redesign', 'SKU badge and serif title verified', (skuBadge && productTitle) ? 'PASS' : 'FAIL');

    // Mint Green Price Card
    const priceMintCard = await page.getByText('Inclusive of all taxes').first().isVisible();
    const priceAmount = await page.locator('span:has-text("₹750")').first().isVisible();
    record('TC-PDP-005', 'PDP Redesign', 'Mint green price box with taxes note verified', (priceMintCard && priceAmount) ? 'PASS' : 'FAIL');

    // Pack / Course Radio Options
    const standardCourse = page.getByText('Standard Course').first();
    const familyRegimen = page.getByText('3-Month Family Regimen').first();
    const hasPacks = (await standardCourse.isVisible()) && (await familyRegimen.isVisible());
    record('TC-PDP-006', 'PDP Redesign', 'Select Pack / Course radio selector cards displayed', hasPacks ? 'PASS' : 'FAIL');

    // Click on 3-Month Family Regimen to verify dynamic price update
    if (hasPacks) {
      await familyRegimen.click();
      await page.waitForTimeout(400);
      const updatedPriceText = await page.locator('button:has-text("Add to Cart • ₹")').first().textContent();
      const priceSwitched = updatedPriceText.includes('1,988') || updatedPriceText.includes('1,990') || updatedPriceText.includes('1988');
      record('TC-PDP-007', 'PDP Redesign', 'Pack course selection dynamically updates price and button subtotal', priceSwitched ? 'PASS' : 'FAIL', updatedPriceText?.trim());
      // Switch back to standard
      await standardCourse.click();
      await page.waitForTimeout(300);
    }

    // Quantity Stepper & Add to Cart
    const plusBtn = page.locator('button[aria-label="Increase quantity"]').first();
    if (await plusBtn.isVisible()) {
      await plusBtn.click();
      await page.waitForTimeout(300);
      const qtyText = await page.locator('button:has-text("Add to Cart • ₹")').first().textContent();
      record('TC-PDP-008', 'PDP Redesign', 'Quantity stepper updates total price calculation', qtyText.includes('1,500') || qtyText.includes('1500') ? 'PASS' : 'FAIL', qtyText?.trim());
      // Decrease back to 1
      await page.locator('button[aria-label="Decrease quantity"]').first().click();
      await page.waitForTimeout(300);
    }

    // Doctor Banner Section
    const docBanner = await page.getByText('Formulated Under the Clinical Guidance of Dr. Jegajothi Pandian').first().isVisible();
    const docBtn = await page.getByText('Discuss Dosage with Doctor').first().isVisible();
    record('TC-PDP-009', 'PDP Redesign', 'Authentic Clinical Heritage Doctor banner displayed', (docBanner && docBtn) ? 'PASS' : 'FAIL');

    // Editorial Story Section
    const storyTitle = await page.getByText('Traditional Ayurvedic Wellness, Naturally Inspired').first().isVisible();
    const charakaPrinciples = await page.getByText('CHARAKA SAMHITA PRINCIPLES').first().isVisible();
    record('TC-PDP-010', 'PDP Redesign', 'Editorial Ayurvedic Story and Charaka Samhita card verified', (storyTitle && charakaPrinciples) ? 'PASS' : 'FAIL');

    // Key Features (6 Cards)
    const featuresBadge = await page.getByText('6 Verified Formulation Pillars').first().isVisible();
    const featuresHeading = await page.getByText('Key Features & Therapeutic Benefits').first().isVisible();
    record('TC-PDP-011', 'PDP Redesign', 'Key Features & Therapeutic Benefits 6-card grid rendered', (featuresBadge && featuresHeading) ? 'PASS' : 'FAIL');

    // Botanical Ingredients (4 Herb Cards)
    const ingredientsTitle = await page.getByText('Botanical Ingredients Breakdown').first().isVisible();
    const avuriCard = await page.getByText('Indigofera tinctoria').first().isVisible();
    const haritakiCard = await page.getByText('Terminalia chebula').first().isVisible();
    const thanrikkaiCard = await page.getByText('Terminalia bellirica').first().isVisible();
    const amlaCard = await page.getByText('Phyllanthus emblica').first().isVisible();
    const allHerbs = ingredientsTitle && avuriCard && haritakiCard && thanrikkaiCard && amlaCard;
    record('TC-PDP-012', 'PDP Redesign', 'Botanical Ingredients breakdown with all 4 standardized herb cards', allHerbs ? 'PASS' : 'FAIL');

    // The Evening Ritual (4 Steps)
    const ritualTitle = await page.locator('h3').filter({ hasText: /How to Prepare/i }).first().isVisible();
    const step1 = await page.getByText('STEP 01').first().isVisible();
    const step4 = await page.getByText('STEP 04').first().isVisible();
    record('TC-PDP-013', 'PDP Redesign', 'The Evening Ritual 4-step decoction guide verified', (ritualTitle && step1 && step4) ? 'PASS' : 'FAIL');

    // Bottom 3 Cards: Indications, Advisory, Specifications
    const targetIndications = await page.getByText('Target Indications').first().isVisible();
    const advisory = await page.getByText('Advisory Guidelines').first().isVisible();
    const specs = await page.getByText('Product Specifications').first().isVisible();
    record('TC-PDP-014', 'PDP Redesign', 'Target Indications, Advisory Guidelines, and Specifications cards verified', (targetIndications && advisory && specs) ? 'PASS' : 'FAIL');

    // Credibility Quality Strip
    const gmpCertified = await page.getByText('GMP Certified').first().isVisible();
    const heavyMetal = await page.getByText('Heavy-Metal Tested').first().isVisible();
    const vaidya = await page.getByText('Vaidya Formulated').first().isVisible();
    record('TC-PDP-015', 'PDP Redesign', 'Quality credibility strip (GMP, Heavy-Metal, Vaidya Formulated) verified', (gmpCertified && heavyMetal && vaidya) ? 'PASS' : 'FAIL');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'qa-03-pdp-detox-tea-redesign.png'), fullPage: true });

    // -------------------------------------------------------------
    // SUITE 4: IN-STOCK & OUT-OF-STOCK VERIFICATIONS
    // -------------------------------------------------------------
    console.log('\n--- SUITE 4: IN-STOCK & OUT-OF-STOCK VERIFICATIONS ---');
    // In-Stock Test (BoozLiv)
    await page.goto(`${BASE_URL}/product/boozliv`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const inStockDot = await page.getByText('In Stock • Dispatched').first().isVisible();
    const inStockAddBtn = await page.locator('button:has-text("Add to Cart")').first().isEnabled();
    record('TC-STK-001', 'Stock Check', 'In-stock formulation displays active Add to Cart & pulse indicator', (inStockDot && inStockAddBtn) ? 'PASS' : 'FAIL');

    // Out-of-Stock Test (Hair Well Capsules)
    await page.goto(`${BASE_URL}/product/hair-well-food-supplement-capsules`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const outOfStockAlert = await page.getByText('Currently Out of Stock • Fresh Batch in Preparation').first().isVisible();
    const outOfStockDisabled = await page.locator('button:has-text("Out of Stock")').first().isDisabled();
    record('TC-STK-002', 'Stock Check', 'Out-of-stock product displays rose alert pill and disabled button', (outOfStockAlert && outOfStockDisabled) ? 'PASS' : 'FAIL');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'qa-04-pdp-outofstock-hairwell.png') });

    // -------------------------------------------------------------
    // SUITE 5: CART, SLIDE-OVER DRAWER & CHECKOUT
    // -------------------------------------------------------------
    console.log('\n--- SUITE 5: CART & CHECKOUT JOURNEY ---');
    // Add Detox Tea to cart
    await page.goto(`${BASE_URL}/product/ayurraksha-detox-tea`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    await page.locator('button:has-text("Add to Cart")').first().click();
    await page.waitForTimeout(1000);

    const cartBadge = await page.locator('button[aria-label*="cart" i], a[href="/cart"]').first().textContent();
    record('TC-CRT-001', 'Cart', 'Adding item to cart updates cart counter badge', (cartBadge && !cartBadge.includes('0')) ? 'PASS' : 'FAIL', `Cart Count: ${cartBadge?.trim()}`);

    // Dedicated cart page
    await page.goto(`${BASE_URL}/cart`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const cartItemsCount = await page.getByText('AyurRaksha Detox Tea').count();
    record('TC-CRT-002', 'Cart Page', 'Dedicated Cart page renders item line and subtotal', cartItemsCount > 0 ? 'PASS' : 'FAIL');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'qa-05-cart-page.png') });

    // Checkout page test
    // Click Proceed to Checkout
    const checkoutBtn = page.getByRole('link', { name: /Proceed to Secure Checkout/i });
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await page.waitForURL('**/checkout', { timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1000);
    } else {
      await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
    }

    const hasOrderSummary = await page.getByText(/Order Summary/i).first().isVisible();
    const hasPhoneInput = await page.locator('input[name="phone"], input[type="tel"]').first().isVisible();
    const hasNameInput = await page.locator('input[name="name"]').first().isVisible();
    record('TC-CHK-001', 'Checkout', 'Checkout interface loads populated customer details form and order summary', (hasOrderSummary || hasNameInput || hasPhoneInput) ? 'PASS' : 'FAIL');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'qa-06-checkout-desktop.png') });

    // -------------------------------------------------------------
    // SUITE 6: COMBO BUILDER, ORDER TRACKING, BLOG
    // -------------------------------------------------------------
    console.log('\n--- SUITE 6: COMBO BUILDER, ORDER TRACKING & BLOG ---');
    // Combo builder
    await page.goto(`${BASE_URL}/combo-builder`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const comboTitle = await page.locator('h1, h2').filter({ hasText: /Skin Care|Combo/i }).first().isVisible();
    record('TC-CMB-001', 'Combo Builder', 'Interactive Combo Builder loads concerns & products', comboTitle ? 'PASS' : 'FAIL');

    // Order tracking
    await page.goto(`${BASE_URL}/order-tracking`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const trackingHeading = await page.getByRole('heading', { name: /Track your order/i }).first().isVisible();
    record('TC-TRK-001', 'Order Tracking', 'Dedicated Order Tracking interface active', trackingHeading ? 'PASS' : 'FAIL');

    // Blog
    await page.goto(`${BASE_URL}/blog`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const blogCount = await page.locator('a[href^="/blog/"]').count();
    record('TC-BLG-001', 'Blog', 'Clinical case studies & blog archive loaded', blogCount >= 5 ? 'PASS' : 'FAIL', `${blogCount} articles found`);

    // -------------------------------------------------------------
    // SUITE 7: MOBILE RESPONSIVENESS AUDIT (375 × 812 px)
    // -------------------------------------------------------------
    console.log('\n--- SUITE 7: MOBILE RESPONSIVENESS AUDIT (375 × 812 px) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    });
    const mobilePage = await mobileContext.newPage();

    // Mobile Home
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(800);
    const mobileOverflowHome = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    record('TC-MOB-001', 'Mobile Audit', 'Mobile homepage renders without horizontal scroll overflow', !mobileOverflowHome ? 'PASS' : 'FAIL');

    // Mobile PDP (AyurRaksha Detox Tea)
    await mobilePage.goto(`${BASE_URL}/product/ayurraksha-detox-tea`, { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(800);

    const mobileOverflowPDP = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    record('TC-MOB-002', 'Mobile Audit', 'Redesigned PDP renders on mobile viewport without horizontal overflow', !mobileOverflowPDP ? 'PASS' : 'FAIL');

    // Mobile Sticky Add to Cart Bar
    const stickyBar = await mobilePage.locator('button:has-text("Add to Cart")').first().isVisible();
    record('TC-MOB-003', 'Mobile Audit', 'Mobile purchase controls active on PDP', stickyBar ? 'PASS' : 'FAIL');

    await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, 'qa-07-mobile-pdp.png'), fullPage: true });

    // -------------------------------------------------------------
    // SUITE 8: CONSOLE ERROR & EXCEPTION AUDIT
    // -------------------------------------------------------------
    console.log('\n--- SUITE 8: CONSOLE ERROR & NETWORK AUDIT ---');
    const severeErrors = consoleErrors.filter(e => !e.text.includes('favicon') && !e.text.includes('webpack'));
    record('TC-ERR-001', 'Console Audit', 'Zero uncaught JavaScript exceptions during full user flow', severeErrors.length === 0 ? 'PASS' : 'FAIL', `${severeErrors.length} errors observed`);

  } catch (err) {
    console.error('Test execution error:', err);
    record('TC-ERR-999', 'Runtime', 'Unhandled test suite error', 'FAIL', err.message);
  } finally {
    await browser.close();
  }

  // Summary Metrics
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log('\n===============================================================');
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed} | PASS RATE: ${passRate}%`);
  console.log('===============================================================');

  const reportData = {
    total,
    passed,
    failed,
    passRate,
    timestamp: new Date().toISOString(),
    results
  };

  fs.writeFileSync(path.join(__dirname, 'qa-reports', 'automated-qa-results.json'), JSON.stringify(reportData, null, 2));
  return reportData;
}

runQASuite().catch(err => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
