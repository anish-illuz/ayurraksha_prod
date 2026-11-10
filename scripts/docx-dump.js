// Read a docx document.xml and print a linear view so we can map Status labels to items.
const fs = require('fs');

const xmlPath = process.argv[2];
let xml = fs.readFileSync(xmlPath, 'utf8');
if (xml.charCodeAt(0) === 0xfeff) xml = xml.slice(1);

const paras = xml.match(/<w:p\b[\s\S]*?<\/w:p>/g) || [];

function textOf(p) {
  const ts = p.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
  let out = ts.map((t) => t.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>$/, '')).join('');
  return out.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

// Print only status labels, with the nearest preceding non-status paragraph context.
let lastNonStatus = '';
paras.forEach((p, i) => {
  const t = textOf(p);
  if (!t) return;
  const isStatus = /^Status:/.test(t);
  if (isStatus) {
    console.log(`IDX ${i} | CONTEXT: ${lastNonStatus.slice(0, 90)} | LABEL: ${t.slice(0, 90)}`);
  } else {
    // skip the label's own text as context; remember last real content line
    lastNonStatus = t;
  }
});
