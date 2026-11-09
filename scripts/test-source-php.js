const { execSync } = require('child_process');
const fs = require('fs');

fs.writeFileSync('temp-src-code.json', JSON.stringify({
  code: `
    global $wpdb;
    $post_counts = wp_count_posts('post');
    $sample = $wpdb->get_results("SELECT ID, post_title, post_name, post_date FROM {$wpdb->posts} WHERE post_type = 'post' AND post_status = 'publish' ORDER BY post_date DESC LIMIT 3", ARRAY_A);
    $meta_sample = [];
    if (!empty($sample)) {
      $meta_sample = $wpdb->get_results($wpdb->prepare("SELECT meta_key, meta_value FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key NOT LIKE '_edit_%'", $sample[0]['ID']), ARRAY_A);
    }
    return [
      'counts' => $post_counts,
      'sample' => $sample,
      'meta_sample' => $meta_sample
    ];
  `
}));

try {
  const output = execSync('novamira --yes --site www.ayurrakshaonline.com run novamira/execute-php --input "@temp-src-code.json" --json', {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024
  });
  console.log('Source PHP Result:', JSON.stringify(JSON.parse(output).data?.return_value, null, 2));
} catch (e) {
  console.error('Source PHP Error:', e.message);
  if (e.stdout) console.error('Stdout:', e.stdout);
}
