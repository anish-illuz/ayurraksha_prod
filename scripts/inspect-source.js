async function inspectSource() {
  const url = 'https://ayurrakshaonline.com';

  // 1. Categories
  const catRes = await fetch(`${url}/wp-json/wp/v2/categories?per_page=100`);
  const cats = await catRes.json();
  console.log(`=== Categories (${cats.length}) ===`);
  cats.slice(0, 10).forEach(c => console.log(` - [${c.id}] ${c.name} (slug: ${c.slug}, count: ${c.count})`));

  // 2. Tags count
  const tagRes = await fetch(`${url}/wp-json/wp/v2/tags?per_page=10`);
  console.log(`Tags total: ${tagRes.headers.get('x-wp-total')}`);

  // 3. Sample post with _embed
  const postRes = await fetch(`${url}/wp-json/wp/v2/posts?per_page=1&_embed=true`);
  const [post] = await postRes.json();
  console.log(`\n=== Sample Post Details ===`);
  console.log(`ID: ${post.id}`);
  console.log(`Title: ${post.title?.rendered}`);
  console.log(`Slug: ${post.slug}`);
  console.log(`Date: ${post.date}`);
  console.log(`Status: ${post.status}`);
  console.log(`Format: ${post.format}`);
  console.log(`Featured Media ID: ${post.featured_media}`);
  if (post._embedded && post._embedded['wp:featuredmedia']) {
    const fm = post._embedded['wp:featuredmedia'][0];
    console.log(`Featured Media URL: ${fm?.source_url}`);
    console.log(`Featured Media Alt: ${fm?.alt_text}`);
    console.log(`Featured Media Title: ${fm?.title?.rendered}`);
  }
  if (post._embedded && post._embedded['wp:term']) {
    console.log(`Terms:`, post._embedded['wp:term'].flat().map(t => `${t.taxonomy}:${t.name} (${t.slug})`));
  }
  console.log(`Meta keys:`, Object.keys(post.meta || {}));
  console.log(`Content length: ${post.content?.rendered?.length} chars`);
  console.log(`Excerpt: ${post.excerpt?.rendered?.slice(0, 150)}...`);
}

inspectSource().catch(console.error);
