// Pull out, for each of the 6 product item headings, the current Status label text
// so I can decide whether the delivered docx notes need refreshing.
const fs = require('fs');
const T = process.env.TEMP;
const raw = fs.readFileSync(T + '\\docx-verify\\word\\document.xml', 'utf8');
// Collapse the XML to plain text (strip tags, unescape entities)
const text = raw
  .replace(/<w:p[ >]/g, '\n<w:p ')
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&#8212;/g, '—');
const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

const HEADS = [
  'GARG',
  'DIA WELL CAPSULES',
  'FLOW WELL CAPSULES',
  'HERBO PROTEIN',
  'HIBISCUS TEA',
  'PI WELL CAPSULES',
];
lines.forEach((line, idx) => {
  // Only treat a line as an item heading if it is short (numbered item titles), not a Status note.
  for (const h of HEADS) {
    if (line.toUpperCase().includes(h) && !line.includes('Status:') && line.length < 140) {
      let status = '(no status within 10 lines)';
      for (let i = idx + 1; i < Math.min(idx + 11, lines.length); i++) {
        if (lines[i].includes('Status:')) { status = lines[i]; break; }
      }
      console.log('\n### ' + h + '  (line ' + idx + ')');
      console.log('  HEAD: ' + line);
      console.log('  ' + status);
    }
  }
});
