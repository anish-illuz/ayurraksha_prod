const { execSync } = require('child_process');
const fs = require('fs');

function runPhp(site, code) {
  fs.writeFileSync('temp-exec-code.json', JSON.stringify({ code }));
  const output = execSync(`novamira --yes --site ${site} run novamira/execute-php --input "@temp-exec-code.json" --json`, {
    encoding: 'utf8',
    maxBuffer: 25 * 1024 * 1024
  });
  return JSON.parse(output);
}

async function testSingleMigration() {
  console.log('Fetching source post 21396 from www.ayurrakshaonline.com...');

  const srcRes = runPhp('www.ayurrakshaonline.com', `
    global $wpdb;
    $post = $wpdb->get_row("SELECT * FROM {$wpdb->posts} WHERE ID = 21396", ARRAY_A);
    if (!$post) return null;

    $terms = wp_get_object_terms($post['ID'], ['category', 'post_tag']);
    $categories = [];
    $tags = [];
    foreach ($terms as $t) {
      if ($t->taxonomy === 'category') {
        $categories[] = ['name' => $t->name, 'slug' => $t->slug];
      } elseif ($t->taxonomy === 'post_tag') {
        $tags[] = ['name' => $t->name, 'slug' => $t->slug];
      }
    }

    $thumb_id = get_post_thumbnail_id($post['ID']);
    $thumb_url = $thumb_id ? wp_get_attachment_url($thumb_id) : null;
    $thumb_alt = $thumb_id ? get_post_meta($thumb_id, '_wp_attachment_image_alt', true) : '';

    $all_meta = get_post_meta($post['ID']);
    $seo_meta = [];
    foreach ($all_meta as $k => $v) {
      if (strpos($k, 'rank_math_') === 0) {
        $seo_meta[$k] = $v[0];
      }
    }

    return [
      'post' => $post,
      'categories' => $categories,
      'tags' => $tags,
      'thumb_url' => $thumb_url,
      'thumb_alt' => $thumb_alt,
      'seo_meta' => $seo_meta,
    ];
  `);

  const srcPostData = srcRes.data?.return_value;
  console.log('Source post fetched:', srcPostData?.post?.post_title);

  const b64Data = Buffer.from(JSON.stringify(srcPostData)).toString('base64');

  const insertPhp = `
    $raw = base64_decode('${b64Data}');
    $data = json_decode($raw, true);
    if (!$data) return ['success' => false, 'error' => 'JSON decode failed'];

    $p = $data['post'];

    // 1. Categories
    $cat_ids = [];
    foreach ($data['categories'] as $cat) {
      $term = get_term_by('slug', $cat['slug'], 'category');
      if (!$term) {
        $new_term = wp_insert_term($cat['name'], 'category', ['slug' => $cat['slug']]);
        if (!is_wp_error($new_term)) {
          $cat_ids[] = $new_term['term_id'];
        }
      } else {
        $cat_ids[] = $term->term_id;
      }
    }

    // 2. Tags
    $tag_names = [];
    foreach ($data['tags'] as $tag) {
      $tag_names[] = $tag['name'];
    }

    // 3. Insert or update post
    global $wpdb;
    $existing_id = $wpdb->get_var($wpdb->prepare("SELECT ID FROM {$wpdb->posts} WHERE post_name = %s AND post_type = 'post'", $p['post_name']));

    $post_arr = [
      'post_title'     => $p['post_title'],
      'post_name'      => $p['post_name'],
      'post_content'   => $p['post_content'],
      'post_excerpt'   => $p['post_excerpt'],
      'post_status'    => $p['post_status'],
      'post_type'      => 'post',
      'post_date'      => $p['post_date'],
      'post_date_gmt'  => $p['post_date_gmt'],
      'post_modified'  => $p['post_modified'],
      'post_modified_gmt' => $p['post_modified_gmt'],
      'post_category'  => $cat_ids,
      'tags_input'     => $tag_names,
    ];

    if ($existing_id) {
      $post_arr['ID'] = $existing_id;
      $post_id = wp_update_post($post_arr);
    } else {
      $post_id = wp_insert_post($post_arr);
    }

    if (is_wp_error($post_id) || !$post_id) {
      return ['success' => false, 'error' => is_wp_error($post_id) ? $post_id->get_error_message() : 'Insert failed'];
    }

    // 4. Update SEO meta
    if (!empty($data['seo_meta'])) {
      foreach ($data['seo_meta'] as $k => $v) {
        update_post_meta($post_id, $k, $v);
      }
    }

    // 5. Featured image
    $thumb_attached = false;
    $att_id = 0;
    if (!empty($data['thumb_url'])) {
      require_once(ABSPATH . 'wp-admin/includes/media.php');
      require_once(ABSPATH . 'wp-admin/includes/file.php');
      require_once(ABSPATH . 'wp-admin/includes/image.php');

      // Check if attachment exists by source url
      $existing_att = $wpdb->get_var($wpdb->prepare("SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_migrated_source_url' AND meta_value = %s", $data['thumb_url']));

      if ($existing_att) {
        set_post_thumbnail($post_id, $existing_att);
        $thumb_attached = true;
        $att_id = $existing_att;
      } else {
        $downloaded = media_sideload_image($data['thumb_url'], $post_id, $data['thumb_alt'] ?: $p['post_title'], 'id');
        if (!is_wp_error($downloaded)) {
          set_post_thumbnail($post_id, $downloaded);
          update_post_meta($downloaded, '_migrated_source_url', $data['thumb_url']);
          if (!empty($data['thumb_alt'])) {
            update_post_meta($downloaded, '_wp_attachment_image_alt', $data['thumb_alt']);
          }
          $thumb_attached = true;
          $att_id = $downloaded;
        } else {
          return ['success' => true, 'post_id' => $post_id, 'media_error' => $downloaded->get_error_message()];
        }
      }
    }

    return [
      'success' => true,
      'post_id' => $post_id,
      'thumb_attached' => $thumb_attached,
      'thumb_id' => $att_id,
      'permalink' => get_permalink($post_id),
      'categories' => wp_get_post_categories($post_id, ['fields' => 'names']),
      'thumbnail_url' => get_the_post_thumbnail_url($post_id, 'full'),
    ];
  `;

  console.log('Sending base64 encoded payload to destination CMS...');
  const destRes = runPhp('cms.ayurrakshaonline.com', insertPhp);
  console.log('Destination response:', JSON.stringify(destRes, null, 2));
}

testSingleMigration().catch(console.error);
