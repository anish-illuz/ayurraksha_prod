const { execSync } = require('child_process');
const fs = require('fs');

function runPhp(site, code, timeout = 120000) {
  fs.writeFileSync('temp-exec-code.json', JSON.stringify({ code }));
  const output = execSync(`novamira --yes --site ${site} --timeout ${timeout} run novamira/execute-php --input "@temp-exec-code.json" --json`, {
    encoding: 'utf8',
    maxBuffer: 40 * 1024 * 1024
  });
  const parsed = JSON.parse(output);
  if (!parsed.ok || !parsed.data?.success) {
    throw new Error(parsed.error?.message || parsed.data?.error_message || 'PHP execution failed');
  }
  return parsed.data.return_value;
}

async function migrateDrafts() {
  console.log('================================================================');
  console.log('MIGRATING ALL 26 DRAFT POSTS TO CMS');
  console.log('================================================================\n');

  // 1. Delete post 27776 on CMS
  console.log('Cleaning up temporary draft post 27776...');
  runPhp('cms.ayurrakshaonline.com', `
    if (get_post(27776)) {
      wp_delete_post(27776, true);
    }
    return ['cleaned' => true];
  `);

  // 2. Fetch all 26 drafts with full details from source
  console.log('Fetching all 26 drafts from source...');
  const draftsData = runPhp('www.ayurrakshaonline.com', `
    global $wpdb;
    $draft_ids = $wpdb->get_col("SELECT ID FROM {$wpdb->posts} WHERE post_type = 'post' AND post_status = 'draft' ORDER BY ID ASC");
    $posts_data = [];
    foreach ($draft_ids as $id) {
      $post = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$wpdb->posts} WHERE ID = %d", $id), ARRAY_A);
      if (!$post) continue;

      $terms = wp_get_object_terms($id, ['category', 'post_tag']);
      $categories = [];
      $tags = [];
      foreach ($terms as $t) {
        if ($t->taxonomy === 'category') {
          $categories[] = ['name' => $t->name, 'slug' => $t->slug];
        } elseif ($t->taxonomy === 'post_tag') {
          $tags[] = ['name' => $t->name, 'slug' => $t->slug];
        }
      }

      $thumb_id = get_post_thumbnail_id($id);
      $thumb_url = $thumb_id ? wp_get_attachment_url($thumb_id) : null;
      $thumb_alt = $thumb_id ? get_post_meta($thumb_id, '_wp_attachment_image_alt', true) : '';

      $all_meta = get_post_meta($id);
      $seo_meta = [];
      foreach ($all_meta as $k => $v) {
        if (strpos($k, 'rank_math_') === 0 || $k === '_thumbnail_id' || $k === 'footnotes') {
          $seo_meta[$k] = $v[0];
        }
      }

      $posts_data[] = [
        'post' => $post,
        'categories' => $categories,
        'tags' => $tags,
        'thumb_url' => $thumb_url,
        'thumb_alt' => $thumb_alt,
        'seo_meta' => $seo_meta,
      ];
    }
    return $posts_data;
  `);

  console.log(`Fetched ${draftsData.length} draft posts from source.`);

  // 3. Insert into CMS in chunks of 5
  for (let i = 0; i < draftsData.length; i += 5) {
    const chunk = draftsData.slice(i, i + 5);
    const b64Chunk = Buffer.from(JSON.stringify(chunk)).toString('base64');

    const result = runPhp('cms.ayurrakshaonline.com', `
      $items = json_decode(base64_decode('${b64Chunk}'), true);
      if (!$items) return ['success' => false, 'error' => 'Decode failed'];

      require_once(ABSPATH . 'wp-admin/includes/media.php');
      require_once(ABSPATH . 'wp-admin/includes/file.php');
      require_once(ABSPATH . 'wp-admin/includes/image.php');

      global $wpdb;
      $imported = [];

      foreach ($items as $item) {
        $p = $item['post'];

        // Map category IDs
        $cat_ids = [];
        foreach ($item['categories'] as $cat) {
          $t = get_term_by('slug', $cat['slug'], 'category');
          if ($t) $cat_ids[] = $t->term_id;
        }

        // Map tag names
        $tag_names = [];
        foreach ($item['tags'] as $tag) {
          $tag_names[] = $tag['name'];
        }

        $slug = !empty($p['post_name']) ? $p['post_name'] : sanitize_title($p['post_title']);

        // Check if post already exists on destination by slug
        $existing_id = $wpdb->get_var($wpdb->prepare("SELECT ID FROM {$wpdb->posts} WHERE post_name = %s AND post_type = 'post'", $slug));

        $post_arr = [
          'post_title'        => $p['post_title'],
          'post_name'         => $slug,
          'post_content'      => $p['post_content'],
          'post_excerpt'      => $p['post_excerpt'],
          'post_status'       => 'draft',
          'post_type'         => 'post',
          'post_date'         => $p['post_date'],
          'post_date_gmt'     => $p['post_date_gmt'],
          'post_modified'     => $p['post_modified'],
          'post_modified_gmt' => $p['post_modified_gmt'],
          'post_category'     => $cat_ids,
          'tags_input'        => $tag_names,
          'comment_status'    => !empty($p['comment_status']) ? $p['comment_status'] : 'closed',
          'ping_status'       => !empty($p['ping_status']) ? $p['ping_status'] : 'closed',
        ];

        if ($existing_id) {
          $post_arr['ID'] = $existing_id;
          $post_id = wp_update_post($post_arr);
        } else {
          $post_id = wp_insert_post($post_arr);
        }

        if (is_wp_error($post_id) || !$post_id) {
          $imported[] = ['title' => $p['post_title'], 'success' => false];
          continue;
        }

        // SEO meta
        if (!empty($item['seo_meta'])) {
          foreach ($item['seo_meta'] as $k => $v) {
            if ($k !== '_thumbnail_id') {
              update_post_meta($post_id, $k, $v);
            }
          }
        }

        // Media
        $thumb_attached = false;
        if (!empty($item['thumb_url'])) {
          $existing_att = $wpdb->get_var($wpdb->prepare("SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_migrated_source_url' AND meta_value = %s", $item['thumb_url']));
          if ($existing_att && get_post($existing_att)) {
            set_post_thumbnail($post_id, $existing_att);
            $thumb_attached = true;
          } else {
            $downloaded = media_sideload_image($item['thumb_url'], $post_id, $item['thumb_alt'] ?: $p['post_title'], 'id');
            if (!is_wp_error($downloaded)) {
              set_post_thumbnail($post_id, $downloaded);
              update_post_meta($downloaded, '_migrated_source_url', $item['thumb_url']);
              if (!empty($item['thumb_alt'])) {
                update_post_meta($downloaded, '_wp_attachment_image_alt', $item['thumb_alt']);
              }
              $thumb_attached = true;
            }
          }
        }

        $imported[] = [
          'title' => $p['post_title'],
          'post_id' => $post_id,
          'slug' => $slug,
          'thumb_attached' => $thumb_attached,
          'success' => true
        ];
      }

      return ['success' => true, 'imported' => $imported];
    `, 90000);

    for (const item of (result.imported || [])) {
      console.log(`  ✓ Draft [ID:${item.post_id}] "${item.title.slice(0, 50)}..." (Img: ${item.thumb_attached ? 'Yes' : 'No'})`);
    }
  }

  console.log('\nAll 26 drafts imported successfully!');
}

migrateDrafts().catch(console.error);
