const { execSync } = require('child_process');
const fs = require('fs');

fs.writeFileSync('temp-input.json', JSON.stringify({ code: "return wp_count_posts('post');" }));

try {
  const result = execSync('novamira --yes --site cms.ayurrakshaonline.com run novamira/execute-php --input "@temp-input.json" --json', {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });
  console.log('Result:', result);
} catch (e) {
  console.error('Error message:', e.message);
  console.error('Error stdout:', e.stdout);
  console.error('Error stderr:', e.stderr);
}
