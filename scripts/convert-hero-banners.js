/*
 * Convert new hero banner PNGs (from Downloads/Desktop & Downloads/Mobile)
 * into optimized WebP files under public/images/banners/, sized like the
 * current banner assets.
 *
 * Usage: node scripts/convert-hero-banners.js
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const PROJECT_ROOT = path.join(__dirname, '..');
const BANNERS_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'banners');

// source (downloads from C:\Users\anish\Downloads\Banner) -> target banner filename
const MAP = [
  // Desktop Banners (from PC folder)
  {
    src: 'C:\\Users\\anish\\Downloads\\Banner\\PC\\BoozLiv PC.png',
    dest: 'boozliv-desktop.webp',
  },
  {
    src: 'C:\\Users\\anish\\Downloads\\Banner\\PC\\Skin well 1530x670.png',
    dest: 'skin-well-combo.webp',
  },
  {
    src: 'C:\\Users\\anish\\Downloads\\Banner\\PC\\varicose 1530x670.png',
    dest: 'varicose-veins.webp',
  },
  {
    src: 'C:\\Users\\anish\\Downloads\\Banner\\PC\\Breathe_Well_Combo_PC.png',
    dest: 'breathe-well.webp',
  },
  {
    src: 'C:\\Users\\anish\\Downloads\\Banner\\PC\\Purna Sakthi 1530x670.png',
    dest: 'purna-sakthi.webp',
  },
  // Mobile Banners (from Mobile view folder)
  {
    src: 'C:\\Users\\anish\\Downloads\\Banner\\Mobile view\\BoozLiv mobile.png',
    dest: 'boozliv-mobile.webp',
  },
  {
    src: 'C:\\Users\\anish\\Downloads\\Banner\\Mobile view\\skin well combo mobile.png',
    dest: 'skin-well-combo-mobile.webp',
  },
  {
    src: 'C:\\Users\\anish\\Downloads\\Banner\\Mobile view\\varicose veins mobile.png',
    dest: 'varicose-veins-mobile.webp',
  },
  {
    src: 'C:\\Users\\anish\\Downloads\\Banner\\Mobile view\\breathe well mobile.png',
    dest: 'breathe-well-mobile.webp',
  },
  {
    src: 'C:\\Users\\anish\\Downloads\\Banner\\Mobile view\\Purna sakthi mobile.png',
    dest: 'purna-sakthi-mobile.webp',
  },
];

const QUALITY = 82;

async function convertOne({ src, dest }) {
  const out = path.join(BANNERS_DIR, dest);
  if (!fs.existsSync(src)) {
    console.error(`MISSING SOURCE: ${src}`);
    process.exitCode = 1;
    return;
  }
  const pipeline = sharp(src, { animated: false })
    .png({ compressionLevel: 9 });
  const meta = await pipeline.metadata();
  const buffer = await sharp(src, { animated: false }).webp({
    quality: QUALITY,
    effort: 4,
  }).toBuffer();
  fs.writeFileSync(out, buffer);
  console.log(
    `${dest} <- ${path.basename(src)} | ${meta.width}x${meta.height} | ${(buffer.length / 1024).toFixed(0)} KB webp`
  );
}

(async () => {
  for (const entry of MAP) {
    await convertOne(entry);
  }
  console.log('Done. Files written to', BANNERS_DIR);
})();
