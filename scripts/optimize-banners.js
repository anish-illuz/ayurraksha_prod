const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function optimizeMobileBanners() {
  const dir = path.join(__dirname, '..', 'public', 'images', 'banners');
  const files = [
    'boozliv-mobile.webp',
    'breathe-well-mobile.webp',
    'purna-sakthi-mobile.webp',
    'skin-well-combo-mobile.webp',
    'varicose-veins-mobile.webp'
  ];

  console.log('Optimizing mobile banners...');
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;

    const originalSize = fs.statSync(filePath).size;
    const buffer = fs.readFileSync(filePath);
    const meta = await sharp(buffer).metadata();

    // Optimize to max 1080px width (retina 2x/3x mobile), webp quality 82, effort 6
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1080, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toBuffer();

    const newSize = optimizedBuffer.length;
    if (newSize < originalSize) {
      fs.writeFileSync(filePath, optimizedBuffer);
      const savedPercent = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
      console.log(`✓ ${file}: ${(originalSize / 1024).toFixed(1)} KB -> ${(newSize / 1024).toFixed(1)} KB (${savedPercent}% saved)`);
    } else {
      console.log(`- ${file}: already optimal`);
    }
  }
}

optimizeMobileBanners().catch(console.error);
