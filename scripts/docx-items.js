// Print a clean list of the numbered correction items (heading paragraphs) from document.xml.
const fs = require('fs');
let xml = fs.readFileSync(process.argv[2], 'utf8');
if (xml.charCodeAt(0) === 0xfeff) xml = xml.slice(1);
const paras = xml.match(/<w:p\b[\s\S]*?<\/w:p>/g) || [];
function textOf(p) {
  const ts = p.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
  return ts.map((t) => t.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>$/, '')).join('')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}
paras.forEach((p, i) => {
  const t = textOf(p);
  if (!t) return;
  // item headings: start with a number (1-2 digits, optional) + "." + text, or a known keyword, and are SHORT
  if (t.startsWith('Status:')) return;
  if (/^\d{1,2}\.?\s*[A-Z]/.test(t) && t.length <= 80) {
    console.log(String(i).padEnd(5), JSON.stringify(t));
  }
});
