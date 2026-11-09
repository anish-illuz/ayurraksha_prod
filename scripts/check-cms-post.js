const { execSync } = require('child_process');
const fs = require('fs');

function runPhp(site, code) {
  fs.writeFileSync('temp-exec-code.json', JSON.stringify({ code }));
  const output = execSync(`novamira --yes --site ${site} run novamira/execute-php --input "@temp-exec-code.json" --json`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024
  });
  return JSON.parse(output);
}

// Check if post exists on CMS
const check = runPhp('cms.ayurrakshaonline.com', `
  $p = get_page_by_path('natural-treatment-for-irregular-periods', OBJECT, 'post');
  return $p ? [
    'id' => $p->ID,
    'title' => $p->post_title,
    'status' => $p->post_status,
    'thumb' => get_the_post_thumbnail_url($p->ID, 'full'),
    'categories' => wp_get_post_categories($p->ID, ['fields' => 'names']),
  ] : null;
`);
console.log('CMS Post Check:', check);
