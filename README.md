# Ayurraksha Online — Premium Headless E-Commerce Storefront

A modern, high-performance, mobile-first headless e-commerce storefront for **Ayurraksha Online** (`www.ayurrakshaonline.com`), built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🌿 Overview & Key Achievements

- **Brand & Clinical Heritage**: Designed around Ayurraksha's real clinical positioning (formulated in Chennai under the guidance of Dr. Jegajothi Pandian, an initiative of VPrime Innovations).
- **Complete Product Catalogue**: 44 genuine Ayurvedic products with real prices, variations, health concerns, and high-resolution imagery.
- **Lightning-Fast Performance**: 100% pre-rendered Static Site Generation (SSG) with an initial shared JS bundle of only **87.2 kB** (well below the 150 kB budget target).
- **Zero CLS & Optimized LCP**: Fixed-ratio image containers, next/image responsive WebP/AVIF formatting, and self-hosted variable typography (`Playfair Display` + `Inter`).
- **Complete Commerce Journey**:
  - Live search modal with instant keyword matching and search suggestions.
  - Interactive product listing with filter by health concern, format, price range, and sorting.
  - High-converting Product Detail Pages (PDP) with pack selection, live stock indicators, dosage accordions, and related formulations.
  - Slide-over Cart Drawer + Dedicated Cart Page with subtotal calculation and free shipping threshold indicator.
  - Seamless WooCommerce & Razorpay checkout preservation.
- **Technical SEO & Structured Data**:
  - Full Rank Math JSON-LD Schema: `Organization`, `WebSite`, `Product`, `Offer`, `BreadcrumbList`, `Article`.
  - Automatic `sitemap.xml` and `robots.txt` generation.
  - 301 permanent redirects for legacy WordPress URLs.
  - Mobile sticky Add-to-Cart bar and WCAG 2.2 AA accessibility standards.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4 (Custom Botanical Design Tokens)
- **Icons**: Lucide React
- **State Management**: React Context (`CartContext` with localStorage hydration)
- **Backend Source of Truth**: WordPress & WooCommerce Store API (`cms.ayurrakshaonline.com`)
- **Review Provider**: Judge.me Customer Reviews

---

## 🎨 Design System Tokens

| Token | Hex / Value | Usage |
|---|---|---|
| `forest` | `#16382C` | Primary brand color, headers, CTAs |
| `forest-dark` | `#0E251D` | Deep footer background, modals |
| `botanical` | `#2D5A43` | Accents, active icons, badges |
| `ivory` | `#FAF7F2` | Page background, soothing canvas |
| `sage` | `#E8EFE6` | Tag backgrounds, subtle banners |
| `terracotta` | `#B45309` | Savings tags, sale badges |
| `charcoal` | `#1F2421` | High-contrast readable body text |
| `serif` | Playfair Display / DM Serif | Dignified editorial headings |
| `sans` | Inter | UI labels, body text, tables |

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Static Export

```bash
npm run build
npm run start
```

---

## 📁 Project Directory Structure

```
Ayur1/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with fonts, metadata & schemas
│   │   ├── page.tsx                # Complete redesigned 10-section homepage
│   │   ├── shop/page.tsx           # Full catalogue listing with filters
│   │   ├── concern/[slug]/page.tsx # Health concern archives (SSG pre-rendered)
│   │   ├── category/[slug]/page.tsx# Product format archives (SSG pre-rendered)
│   │   ├── product/[slug]/page.tsx # PDP with gallery, variants & schema
│   │   ├── cart/page.tsx           # Full cart page with checkout handoff
│   │   ├── about/page.tsx          # Dr. Jegajothi Pandian & VPrime Innovations
│   │   ├── contact/page.tsx        # Contact form, phone, WhatsApp & map
│   │   ├── blog/page.tsx           # Clinical case studies & journal
│   │   ├── blog/[slug]/page.tsx    # Individual article with Article schema
│   │   ├── shipping-policy/page.tsx# Verified shipping terms
│   │   ├── refund-returns/page.tsx # Verified refund terms
│   │   ├── terms-of-service/page.tsx# Terms of service
│   │   ├── privacy-policy/page.tsx # Privacy policy
│   │   ├── sitemap.ts              # Dynamic XML sitemap generator
│   │   ├── robots.ts               # Robots.txt configuration
│   │   └── not-found.tsx           # Custom 404 error page
│   ├── components/
│   │   ├── Header.tsx              # Sticky header with mega menu & badges
│   │   ├── AnnouncementBar.tsx     # Free prepaid shipping announcement
│   │   ├── MobileDrawer.tsx        # Mobile navigation drawer
│   │   ├── CartDrawer.tsx          # Slide-over cart drawer
│   │   ├── SearchModal.tsx         # Instant search overlay
│   │   ├── ProductCard.tsx         # Standardized product card
│   │   ├── Breadcrumb.tsx          # Semantic breadcrumbs with schema
│   │   ├── RatingStars.tsx         # Judge.me style star ratings
│   │   ├── TrustBadges.tsx         # 5-point credibility strip
│   │   ├── Footer.tsx              # Comprehensive legal & contact footer
│   │   ├── home/                   # Modular homepage section components
│   │   ├── shop/                   # Modular filter & sorting components
│   │   └── pdp/                    # Product gallery, purchase controls & sticky bar
│   ├── data/
│   │   ├── products.json           # 44 real products from WooCommerce
│   │   ├── posts.json              # 20 real patient case studies & articles
│   │   ├── reviews.ts              # Verified customer reviews
│   │   └── siteConfig.ts           # Contact, address, phone & policy constants
│   ├── lib/
│   │   ├── cartContext.tsx         # Universal cart state management
│   │   └── products.ts             # Data querying, search & filter utilities
│   ├── types/
│   │   └── product.ts              # TypeScript interfaces
│   └── styles/
│       └── globals.css             # Tailwind imports & CSS custom properties
├── next.config.js                  # Image remote patterns, 301 redirects, compression
├── tailwind.config.js              # Theme extension & design tokens
├── tsconfig.json                   # TypeScript configuration with @/* path aliases
└── package.json                    # Project dependencies and build scripts
```

---

## 🔒 Checkout & Payment Integration

The application integrates seamlessly with the existing WooCommerce backend:
- Products retain their genuine WooCommerce IDs (`26823`, `7694`, etc.).
- The Cart Drawer and Cart Page hand off customer sessions directly to WooCommerce checkout (`https://www.ayurrakshaonline.com/checkout/?add-to-cart=...`) where Razorpay handles UPI, cards, net banking, and Cash on Delivery.
- No payment credentials or backend secrets are exposed to the client.
