const { execSync } = require('child_process');
const fs = require('fs');

function runPhp(site, code) {
  fs.writeFileSync('temp-dest-code.json', JSON.stringify({ code }));
  const output = execSync(`novamira --yes --site ${site} run novamira/execute-php --input "@temp-dest-code.json" --json`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024
  });
  return JSON.parse(output).data?.return_value;
}

async function inspectDestination() {
  console.log('Inspecting destination cms.ayurrakshaonline.com...');

  // 1. Existing categories
  const categories = runPhp('cms.ayurrakshaonline.com', `
    $cats = get_categories(['hide_empty' => false]);
    $res = [];
    foreach ($cats as $c) {
      $res[] = ['id' => $c->term_id, 'name' => $c->name, 'slug' => $c->slug, 'count' => $c->count];
    }
    return $res;
  `);
  console.log('Destination Categories:', categories);

  // 2. Existing tags
  const tags = runPhp('cms.ayurrakshaonline.com', `
    $tags = get_tags(['hide_empty' => false]);
    $res = [];
    foreach ($tags as $t) {
      $res[] = ['id' => $t->term_id, 'name' => $t->name, 'slug' => $t->slug, 'count' => $t->count];
    }
    return $res;
  `);
  console.log('Destination Tags:', tags);

  // 3. Existing posts count and posts
  const posts = runPhp('cms.ayurrakshaonline.com', `
    $posts = get_posts(['post_type' => 'post', 'post_status' => 'any', 'numberposts' => 10]);
    $res = [];
    foreach ($posts as $p) {
      $res[] = ['id' => $p->ID, 'title' => $p->post_title, 'slug' => $p->post_name, 'status' => $p->post_status];
    }
    return ['count' => count(get_posts(['post_type' => 'post', 'post_status' => 'any', 'numberposts' => -1])), 'sample' => $res];
  `);
  console.log('Destination Posts:', posts);

  // 4. Test image download capability on CMS
  const testUpload = runPhp('cms.ayurrakshaonline.com', `
    require_once(ABSPATH . 'wp-admin/includes/media.php');
    require_once(ABSPATH . 'wp-admin/includes/file.php');
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    $upload_dir = wp_upload_dir();
    return [
      'writable' => wp_is_writable($upload_dir['basedir']),
      'basedir' => $upload_dir['basedir'],
      'baseurl' => $upload_dir['baseurl'],
      'has_media_sideload' => function_exists('media_sideload_image'),
      'php_memory' => ini_get('memory_limit'),
      'max_execution_time' => ini_get('max_execution_time'),
    ];
  `);
  console.log('Destination Upload & Media Capabilities:', testUpload);
}

inspectDestination().catch(console.error);
