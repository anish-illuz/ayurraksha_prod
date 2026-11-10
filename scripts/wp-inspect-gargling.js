const fs = require('fs');
const path = process.env.TEMP;

function inspect(file, label) {
  let h;
  try {
    h = fs.readFileSync(path + '\\' + file, 'utf8');
  } catch (e) {
    console.log(label, '(no file: ' + e.message + ')');
    return;
  }
  if (h.charCodeAt(0) === 0xfeff) h = h.slice(1);
  const has = (s) => h.toLowerCase().includes(s.toLowerCase());
  console.log('===== ' + label + ' (' + h.length + ' bytes) =====');
  console.log('  SIMMER OR DISSOLVE (contaminated):  ', has('Simmer or Dissolve'));
  console.log('  CONSUME AS ROUTINE (contaminated):  ', has('Consume as Routine'));
  console.log('  TAKE RECOMMENDED DOSE (contam title):', has('Take Recommended Dose'));
  console.log('  PREPARE WITH WATER (contam title):   ', has('Prepare with Water'));
  console.log('  MEASURE THE OIL (approved):          ', has('Measure the Oil'));
  console.log('  SWISH AS DIRECTED (approved):        ', has('Swish as Directed'));
  console.log('  SPIT OUT COMPLETELY (approved):      ', has('Spit Out Completely'));
  console.log('  RINSE MOUTH THOROUGHLY (approved):   ', has('Rinse Mouth Thoroughly'));
  console.log('  SWISH (any):                         ', has('Swish'));
  console.log('  Do Not Swallow (any casing):         ', has('Do Not Swallow') || has('DO NOT SWALLOW'));
  console.log('  Clove / Syzygium aromaticum present: ', has('Clove') || has('Syzygium aromaticum'));
  console.log('  generic img path .webp:              ', has('/images/products/ayur-raksha-gargling-oil.webp'));
  console.log('  img tags count:                      ', (h.match(/<img /gi) || []).length);
  // count how many ingredient cards carry the generic product image
  const imgSrcs = h.match(/<img[^>]*src="([^"]*)"/gi) || [];
  let cloveImg = 0;
  imgSrcs.forEach((s) => {
    if (/clove/i.test(s) || /syzygium/i.test(s)) cloveImg++;
  });
  console.log('  img srcs mentioning clove/syzygium:  ', cloveImg);
}

inspect('cms-gargling2.html', 'CMS id 91');
inspect('www-gargling2.html', 'WWW id 22736');
