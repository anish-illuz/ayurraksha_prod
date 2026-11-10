// Verify the regenerated document: every status label, its anchor, and total count.
const fs = require('fs');
const xmlPath = process.argv[2];
let xml = fs.readFileSync(xmlPath, 'utf8');
if (xml.charCodeAt(0) === 0xfeff) xml = xml.slice(1);
const paras = xml.match(/<w:p\b[\s\S]*?<\/w:p>/g) || [];
function textOf(p) {
  const ts = p.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
  return ts.map((t) => t.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>$/, '')).join('')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}
console.log('total paragraphs: ' + paras.length);
console.log('Status: labels present: ' + paras.filter((p) => textOf(p).startsWith('Status:')).length);

// Show every Status label with its immediately-preceding non-empty paragraph as context
const texts = paras.map(textOf);
let prev = '';
console.log('\n--- label -> context ---');
paras.forEach((p, i) => {
  const t = texts[i];
  if (t.startsWith('Status:')) {
    // find nearest preceding non-empty, non-status line
    let ctx = '';
    for (let j = i - 1; j >= 0; j--) {
      if (texts[j] && !texts[j].startsWith('Status:')) { ctx = texts[j]; break; }
    }
    const badge = t.slice(8, 20).trim();
    console.log('[' + (badge.startsWith('✅') ? 'DONE' : badge.startsWith('🟡') ? 'PART' : 'NOT ') + '] ctx="' + ctx.slice(0, 50) + '" | ' + t.slice(0, 60));
  }
});

// Specifically check IMU 360 context
console.log('\n--- IMU 360 blocks ---');
paras.forEach((p, i) => {
  const t = texts[i];
  if (t.includes('IMU 360') && t.length < 90) console.log(i, JSON.stringify(t));
});
