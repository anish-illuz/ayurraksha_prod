# 03 — SEO & Structured Data (Schema.org)

## Finding — flagship PDP `/product/boozliv` returns 404 in production (P1)

This is the most visible defect in the whole site. The homepage hero CTA
(`Hero.tsx` `primaryLink: '/product/boozliv'`), the featured-video card, and
`heroProductSlug: 'boozliv'` all point at it — so the product the marketing copy is
built around is unreachable.

Live evidence (I fetched the real production HTML; not a browser-probe artifact):

```
GET https://www.ayurrakshaonline.com/product/boozliv      -> 404 (404 boundary, canonical points to /)
GET https://www.ayurrakshaonline.com/product/boozliv/     -> 404 (both forms, 3 consecutive tries)
GET https://www.ayurrakshaonline.com/product/ayurraksha-detox-tea/ -> 200, Product JSON-LD present
```

Root cause I traced:
- The CMS Store API **resolves** it: `products/114` returns `BoozLiv / slug=boozliv`,
  and the exact query the PDP code issues
  (`wc/store/v1/products?slug=boozliv&per_page=1`) returns **200 with id=114, type=variable,
  2 variations**.
- The PDP route (`product/[slug]/page.tsx`) is `dynamic = 'force-dynamic'` and calls
  `fetchDynamicProduct(slug)` → `notFound()` only when **both** CMS fetches return nothing
  **and** the bundled snapshot has no match. The bundled `products.json` does contain
  `slug: 'boozliv'` (id 114). So the current source *should* render it.

Conclusion: the live 404 is **not reproducible from the current source** — it is a **stale
production build and/or a CDN-cached 404** for that path. The CMS and the code agree the
product exists; the served page does not.

Remediation (ops, not a source-code change on my side):
1. Redeploy the current source (this also ships the Razorpay + analytics fixes above).
2. Purge the edge/CDN cache for `/product/boozliv` and `/product/boozliv/`.
3. Re-check: both URL forms should 200 with a Product JSON-LD block.

I deliberately did **not** "fix" the PDP source, because I could not reproduce a code-level
404 — the exact Store API call succeeds. Forcing a code change to a symptom I can't
reproduce would be guessing and risks breaking the 4 PDPs that already work.

## Confirmed working — PDP Product JSON-LD (on the PDPs that render)

For every PDP that renders, the page emits a `@type: Product` schema with `Brand`,
`AggregateRating`, and `Offer` (price, `InStock`/`OutOfStock`, `priceCurrency: INR`),
plus the site-wide `Organization`/`WebSite` graph from the layout. Verified live:

```
/product/ayurraksha-detox-tea/      schema=true  h1="AyurRaksha Detox Tea"
/product/etioment-balm-2/           schema=true  h1="Etioment Balm"
/product/skinwell-soap-pack-of-2/   schema=true  h1="AyurRaksha SkinWell Soap (Pack of 2)"
```

> Correction to my own earlier E2E note: the Playwright journey reported "0 Product
> schema blocks" for the PDP — that was a **false negative**, because the journey
> probed `boozliv` (the 404'ing one). Raw HTML confirms Product schema *is* present on
> the PDPs that render. I'm recording the corrected truth, not the artifact.

## Finding — homepage has zero `<h1>` (P2, real on-page SEO gap)

Live HTML of `/` shows **0 `<h1>` tags** (7×h2, multiple h3/h4). The hero uses styled
headings that are not `h1`. A single descriptive `h1` on the homepage is a basic on-page
signal and helps the page's topical framing. Open item: add one `h1` to the homepage hero.
I did not change this in code since it's a content/wording decision for the site owner,
but it is a concrete, cheap win.

## Trailing-slash behaviour (P3, consistent with config)

`next.config.js` sets `trailingSlash: true`. In practice some slugs 404 without the slash
and 200 with it (`divine-healing-oil`), while others 200 in both forms — the
`force-dynamic` PDP + CMS lookup means the canonical "with slash" form is the reliable one.
All internal links in the codebase use the trailing-slash form, so user-facing navigation
is fine; this is a minor edge-case robustness note, not a visible bug.

## Still open / blocked

- Full on-page audit across all PDPs/blog pages (meta description coverage, canonical
  uniqueness, image alt completeness) — I verified the flagship samples, not every page.
- GSC indexation / CrUX field data and a real backlink audit need the Google account.
