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

async function migrateAllPosts() {
  console.log('================================================================');
  console.log('STARTING AYURRAKSHA WORDPRESS BLOG POST MIGRATION');
  console.log('Source:      https://ayurrakshaonline.com (www.ayurrakshaonline.com)');
  console.log('Destination: https://cms.ayurrakshaonline.com');
  console.log('================================================================\n');

  // STEP 1: Clean up Hello World dummy post and sync categories and tags
  console.log('Step 1: Synchronizing categories, tags, and cleaning dummy content...');

  // Clean dummy Hello World
  try {
    const cleanResult = runPhp('cms.ayurrakshaonline.com', `
      $p = get_page_by_path('hello-world', OBJECT, 'post');
      if ($p) {
        wp_delete_post($p->ID, true);
        return ['deleted' => true, 'id' => $p->ID];
      }
      return ['deleted' => false];
    `);
    console.log('Hello world dummy post cleanup:', cleanResult);
  } catch (e) {
    console.log('Dummy cleanup note:', e.message);
  }

  // Pre-create categories and tags from source
  const taxonomies = runPhp('www.ayurrakshaonline.com', `
    $cats = get_categories(['hide_empty' => false]);
    $cat_data = [];
    foreach ($cats as $c) {
      $cat_data[] = ['name' => $c->name, 'slug' => $c->slug, 'description' => $c->description];
    }
    $tags = get_tags(['hide_empty' => false]);
    $tag_data = [];
    foreach ($tags as $t) {
      $tag_data[] = ['name' => $t->name, 'slug' => $t->slug, 'description' => $t->description];
    }
    return ['categories' => $cat_data, 'tags' => $tag_data];
  `);

  console.log(`Source has ${taxonomies.categories.length} categories and ${taxonomies.tags.length} tags.`);

  const b64Taxonomies = Buffer.from(JSON.stringify(taxonomies)).toString('base64');
  const syncTaxResult = runPhp('cms.ayurrakshaonline.com', `
    $tax = json_decode(base64_decode('${b64Taxonomies}'), true);
    $created_cats = 0;
    $created_tags = 0;
    foreach ($tax['categories'] as $c) {
      if (!term_exists($c['slug'], 'category')) {
        wp_insert_term($c['name'], 'category', ['slug' => $c['slug'], 'description' => $c['description']]);
        $created_cats++;
      }
    }
    foreach ($tax['tags'] as $t) {
      if (!term_exists($t['slug'], 'post_tag')) {
        wp_insert_term($t['name'], 'post_tag', ['slug' => $t['slug'], 'description' => $t['description']]);
        $created_tags++;
      }
    }
    return ['created_cats' => $created_cats, 'created_tags' => $created_tags];
  `);
  console.log('Destination taxonomy sync complete:', syncTaxResult);

  // STEP 2: Fetch all post IDs and basic metadata from source
  console.log('\nStep 2: Fetching list of all blog posts from source...');
  const postList = runPhp('www.ayurrakshaonline.com', `
    global $wpdb;
    $posts = $wpdb->get_results("
      SELECT ID, post_title, post_name, post_status, post_date
      FROM {$wpdb->posts}
      WHERE post_type = 'post' AND post_status IN ('publish', 'draft')
      ORDER BY post_date ASC
    ", ARRAY_A);
    return $posts;
  `);

  console.log(`Found ${postList.length} total posts to migrate.`);

  // STEP 3: Migrate posts in batches of 5
  const BATCH_SIZE = 5;
  let totalProcessed = 0;
  let totalSuccess = 0;
  let totalImagesAttached = 0;
  let errors = [];

  const totalBatches = Math.ceil(postList.length / BATCH_SIZE);

  for (let i = 0; i < postList.length; i += BATCH_SIZE) {
    const batch = postList.slice(i, i + BATCH_SIZE);
    const batchIds = batch.map(p => parseInt(p.ID, 10));
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    console.log(`\n[Batch ${batchNum}/${totalBatches}] Fetching posts ${i + 1} to ${Math.min(i + BATCH_SIZE, postList.length)}...`);

    // Fetch full post payload from source with retry
    let batchData = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const b64Ids = Buffer.from(JSON.stringify(batchIds)).toString('base64');
        batchData = runPhp('www.ayurrakshaonline.com', `
          $ids = json_decode(base64_decode('${b64Ids}'), true);
          global $wpdb;
          $posts_data = [];
          foreach ($ids as $id) {
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
        break;
      } catch (err) {
        console.warn(`Retry ${attempt} fetching source batch:`, err.message);
        if (attempt === 2) {
          errors.push({ batch: batchNum, stage: 'source_fetch', error: err.message });
        }
      }
    }

    if (!batchData) {
      console.error(`Skipping batch ${batchNum} due to fetch error.`);
      continue;
    }

    // Insert batch into destination with retry
    let batchResult = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const b64Batch = Buffer.from(JSON.stringify(batchData)).toString('base64');
        batchResult = runPhp('cms.ayurrakshaonline.com', `
          $items = json_decode(base64_decode('${b64Batch}'), true);
          if (!$items) return ['success' => false, 'error' => 'Decode error'];

          require_once(ABSPATH . 'wp-admin/includes/media.php');
          require_once(ABSPATH . 'wp-admin/includes/file.php');
          require_once(ABSPATH . 'wp-admin/includes/image.php');

          global $wpdb;
          $results = [];

          foreach ($items as $item) {
            $p = $item['post'];

            $cat_ids = [];
            foreach ($item['categories'] as $cat) {
              $t = get_term_by('slug', $cat['slug'], 'category');
              if ($t) {
                $cat_ids[] = $t->term_id;
              }
            }

            $tag_names = [];
            foreach ($item['tags'] as $tag) {
              $tag_names[] = $tag['name'];
            }

            $existing_id = $wpdb->get_var($wpdb->prepare("SELECT ID FROM {$wpdb->posts} WHERE post_name = %s AND post_type = 'post'", $p['post_name']));

            $post_arr = [
              'post_title'        => $p['post_title'],
              'post_name'         => $p['post_name'],
              'post_content'      => $p['post_content'],
              'post_excerpt'      => $p['post_excerpt'],
              'post_status'       => $p['post_status'],
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

            $is_update = false;
            if ($existing_id) {
              $post_arr['ID'] = $existing_id;
              $new_post_id = wp_update_post($post_arr);
              $is_update = true;
            } else {
              $new_post_id = wp_insert_post($post_arr);
            }

            if (is_wp_error($new_post_id) || !$new_post_id) {
              $results[] = [
                'slug' => $p['post_name'],
                'success' => false,
                'error' => is_wp_error($new_post_id) ? $new_post_id->get_error_message() : 'Insert failed'
              ];
              continue;
            }

            if (!empty($item['seo_meta'])) {
              foreach ($item['seo_meta'] as $k => $v) {
                if ($k !== '_thumbnail_id') {
                  update_post_meta($new_post_id, $k, $v);
                }
              }
            }

            $thumb_attached = false;
            if (!empty($item['thumb_url'])) {
              $existing_att = $wpdb->get_var($wpdb->prepare("SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_migrated_source_url' AND meta_value = %s", $item['thumb_url']));
              if ($existing_att && get_post($existing_att)) {
                set_post_thumbnail($new_post_id, $existing_att);
                $thumb_attached = true;
              } else {
                $downloaded = media_sideload_image($item['thumb_url'], $new_post_id, $item['thumb_alt'] ?: $p['post_title'], 'id');
                if (!is_wp_error($downloaded)) {
                  set_post_thumbnail($new_post_id, $downloaded);
                  update_post_meta($downloaded, '_migrated_source_url', $item['thumb_url']);
                  if (!empty($item['thumb_alt'])) {
                    update_post_meta($downloaded, '_wp_attachment_image_alt', $item['thumb_alt']);
                  }
                  $thumb_attached = true;
                }
              }
            }

            $results[] = [
              'slug' => $p['post_name'],
              'title' => $p['post_title'],
              'post_id' => $new_post_id,
              'is_update' => $is_update,
              'thumb_attached' => $thumb_attached,
              'success' => true
            ];
          }

          return ['success' => true, 'results' => $results];
        `, 90000);
        break;
      } catch (err) {
        console.warn(`Retry ${attempt} inserting batch into destination:`, err.message);
        if (attempt === 2) {
          errors.push({ batch: batchNum, stage: 'dest_insert', error: err.message });
        }
      }
    }

    if (batchResult && batchResult.results) {
      for (const r of batchResult.results) {
        totalProcessed++;
        if (r.success) {
          totalSuccess++;
          if (r.thumb_attached) totalImagesAttached++;
          console.log(`  ✓ [${totalProcessed}/${postList.length}] [${r.is_update ? 'Updated' : 'Imported'}] ID:${r.post_id} | ${r.title.slice(0, 45)}... (Img: ${r.thumb_attached ? 'Yes' : 'No'})`);
        } else {
          console.error(`  ✗ [${totalProcessed}/${postList.length}] Failed: ${r.slug} - ${r.error}`);
          errors.push(r);
        }
      }
    }
  }

  console.log('\n================================================================');
  console.log('MIGRATION SUMMARY REPORT');
  console.log('================================================================');
  console.log(`Total Source Posts:          ${postList.length}`);
  console.log(`Total Processed:             ${totalProcessed}`);
  console.log(`Successfully Migrated:       ${totalSuccess}`);
  console.log(`Featured Images Attached:    ${totalImagesAttached}`);
  console.log(`Errors / Failures:           ${errors.length}`);
  if (errors.length > 0) {
    console.log('Error items:', JSON.stringify(errors, null, 2));
  }
}

migrateAllPosts().catch(console.error);
