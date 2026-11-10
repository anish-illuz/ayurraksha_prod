const { execSync } = require('child_process');
const fs = require('fs');

function runPhp(site, code) {
  fs.writeFileSync('temp-exec-code.json', JSON.stringify({ code }));
  const output = execSync(`novamira --yes --site ${site} run novamira/execute-php --input "@temp-exec-code.json" --json`, {
    encoding: 'utf8',
    maxBuffer: 40 * 1024 * 1024
  });
  return JSON.parse(output).data?.return_value;
}

async function verifyFullMigration() {
  console.log('================================================================');
  console.log('COMPREHENSIVE BLOG POST MIGRATION VERIFICATION');
  console.log('================================================================\n');

  // 1. Source vs Destination Post Counts
  const srcCounts = runPhp('www.ayurrakshaonline.com', "return wp_count_posts('post');");
  const destCounts = runPhp('cms.ayurrakshaonline.com', "return wp_count_posts('post');");

  console.log('1. POST COUNTS COMPARISON:');
  console.log('   Source:      Published:', srcCounts.publish, '| Drafts:', srcCounts.draft);
  console.log('   Destination: Published:', destCounts.publish, '| Drafts:', destCounts.draft);

  // 2. Categories
  const srcCats = runPhp('www.ayurrakshaonline.com', `
    $cats = get_categories(['hide_empty' => false]);
    $res = [];
    foreach ($cats as $c) $res[$c->slug] = ['name' => $c->name, 'count' => $c->count];
    return $res;
  `);
  const destCats = runPhp('cms.ayurrakshaonline.com', `
    $cats = get_categories(['hide_empty' => false]);
    $res = [];
    foreach ($cats as $c) $res[$c->slug] = ['name' => $c->name, 'count' => $c->count];
    return $res;
  `);

  console.log('\n2. CATEGORIES COMPARISON:');
  for (const slug of Object.keys(srcCats)) {
    console.log(`   [${slug}] Source: "${srcCats[slug].name}" (${srcCats[slug].count}) | Dest: "${destCats[slug]?.name}" (${destCats[slug]?.count || 0})`);
  }

  // 3. Featured Images count
  const destThumbCount = runPhp('cms.ayurrakshaonline.com', `
    global $wpdb;
    return $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key = '_thumbnail_id' AND meta_value > 0");
  `);
  console.log('\n3. FEATURED IMAGES:');
  console.log(`   Destination posts with attached featured image: ${destThumbCount}`);

  // 4. Sample 5 verified posts from Destination via public REST API
  console.log('\n4. PUBLIC REST API FIDELITY SAMPLES (cms.ayurrakshaonline.com):');
  const restRes = await fetch('https://cms.ayurrakshaonline.com/wp-json/wp/v2/posts?per_page=5&_embed=true');
  console.log(`   REST API Status: ${restRes.status} ${restRes.statusText}`);
  console.log(`   Total posts reported by REST header: ${restRes.headers.get('x-wp-total')}`);
  const samplePosts = await restRes.json();
  for (const p of samplePosts) {
    const thumbUrl = p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const catNames = p._embedded?.['wp:term']?.[0]?.map(c => c.name).join(', ');
    console.log(`\n   --- Post ID: ${p.id} ---`);
    console.log(`   Title:          ${p.title?.rendered}`);
    console.log(`   Slug:           ${p.slug}`);
    console.log(`   Date:           ${p.date}`);
    console.log(`   Categories:     ${catNames}`);
    console.log(`   Featured Image: ${thumbUrl || 'None'}`);
    console.log(`   Content Length: ${p.content?.rendered?.length} characters`);
  }

  // 5. Check SEO Meta on a sample post
  const seoCheck = runPhp('cms.ayurrakshaonline.com', `
    global $wpdb;
    $p = $wpdb->get_row("SELECT ID, post_title FROM {$wpdb->posts} WHERE post_type = 'post' AND post_status = 'publish' ORDER BY ID DESC LIMIT 1");
    $meta = get_post_meta($p->ID);
    $seo = [];
    foreach ($meta as $k => $v) {
      if (strpos($k, 'rank_math_') === 0) $seo[$k] = $v[0];
    }
    return ['id' => $p->ID, 'title' => $p->post_title, 'seo' => $seo];
  `);
  console.log('\n5. RANK MATH SEO METADATA AUDIT:');
  console.log('   Sample Post:', seoCheck.id, seoCheck.title);
  console.log('   Rank Math Keys:', Object.keys(seoCheck.seo));
  console.log('   Title Meta:    ', seoCheck.seo.rank_math_title);
  console.log('   Desc Meta:     ', seoCheck.seo.rank_math_description);
  console.log('   Focus Keyword: ', seoCheck.seo.rank_math_focus_keyword);
}

verifyFullMigration().catch(console.error);
